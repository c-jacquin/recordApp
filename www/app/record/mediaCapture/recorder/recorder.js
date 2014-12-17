'use strict';

function Recorder($q,$window,$timeout){

    navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);


    var service = {
        start: function(params){
            var deferred = $q.defer();
            service.isVideo = params.video;
            $window.navigator.getUserMedia(params, function(stream) {
                $window.audioVideoRecorder = window.RecordRTC(stream, {
                    type: 'video' // don't forget this; otherwise you'll get video/webm instead of audio/ogg
                });
                $window.audioVideoRecorder.startRecording();
                service.ObjectURL = $window.URL.createObjectURL(stream);
                deferred.resolve(service.ObjectURL);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        },
        stop: function(){
            var deferred = $q.defer();
            $window.audioVideoRecorder.stopRecording(function(url) {
                service.url = url;
                deferred.resolve(url);
            });
            return deferred.promise;
        },
        buildData: function(base64){
            //todo make it work for video too
            var deferred = $q.defer();
            $timeout(function(){
                deferred.resolve(angular.extend(service.meta, {
                    '_attachments': {
                        'attachment': {
                            'content_type': 'audio/ogg',
                            'data': base64.replace('data:audio/ogg;base64,','')
                        }
                    }
                }));
            });
            return deferred.promise;
        }
    };
    return service;
}

function recorder(Recorder,$ionicModal,Record,FileService,Toast){
    return {
        restrict: 'E',
        templateUrl: 'app/record/mediaCapture/recorder/recorder.tpl.html',
        scope: {},
        link: function link(scope,element,attrs){
            var mediaElement = element.find('video')[0];

            scope.type = {
                'audio': true,
                'video': false
            };

            scope.start = function(){
                scope.isRecording = true;
                scope.isFinish = false;
                Recorder
                    .start(scope.type)
                    .then(function(ObjectURL){
                        if(scope.type.video){
                            mediaElement.src = ObjectURL;
                            mediaElement.muted = true;
                            mediaElement.controls = false;
                            mediaElement.play();
                        }
                    });
            };
            scope.stop = function(){
                Recorder
                    .stop()
                    .then(function(){
                        scope.isRecording = false;
                        $ionicModal.fromTemplateUrl('app/record/mediaCapture/recorder/recorder.tpl.html', {
                            scope: scope,
                            animation: 'slide-in-up'
                        }).then(function(modal) {
                            scope.modal = modal;
                            scope.modal.show();
                        });
                    });
            };

            scope.cancel = function(){
                scope.modal.hide();
            };

            scope.save = function(record){
                Recorder.meta = record;
                FileService
                    .urlToBlob(Recorder.url)
                    .then(FileService.blobToBase64)
                    .then(Recorder.buildData)
                    .then(Record.save)
                    .then(function(data){
                        scope.modal.hide();
                        Toast.info('record saved !');
                    })
                    .catch(function(err){
                        Toast.error(err.message);
                    });
            };

            scope.$on('$destroy', function() {
                if(scope.modal){
                    scope.modal.remove();
                }
            });
        }
    };
}

function downloadBlob(Recorder){
    return {
        restrict: 'EA',
        scope: {
            name: '@'
        },
        link: function(scope,element,attrs){
            element[0].href = Recorder.url;
            element[0].download = scope.name;
        }
    };
}

angular.module('app.record.mediaCapture.recorder',[])
    .factory('Recorder',Recorder)
    .directive('recorder',recorder)
    .directive('downloadBlob',downloadBlob);