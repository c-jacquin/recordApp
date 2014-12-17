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
                   _attachments: {
                       'attachment': {
                           content_type: 'audio/ogg',
                           data: base64.replace('data:audio/ogg;base64,','')
                       }
                   }
               }));
            });
            return deferred.promise;
        }
    };
    return service;
}

function previewPlayer(Recorder){
    return {
        restrict: 'EA',
        templateUrl: 'js/record/mediaCapture/preview-player.tpl.html',
        replace: true,
        link:function(scope,element,attrs){
            var mediaElement;
            if(Recorder.isVideo){
                mediaElement = element.find('video')[0];
                mediaElement.style.width = '100%';
            }else{
                mediaElement = element.find('audio')[0];
            }
            mediaElement.src = Recorder.url;

            mediaElement.controls = false;

            mediaElement.volume = 0.5;

            mediaElement.play();

            scope.play = function(){
                if(mediaElement.paused){
                    mediaElement.play();
                }else{
                    mediaElement.pause();
                }
                scope.isPaused = mediaElement.paused;
            };

            scope.back = function(){
                //todo make it work 0o
                mediaElement.currentTime = 1;
            };

            scope.toggleSound = function(){
                angular.element(element[0].querySelector('.range')).toggleClass('sound-visible');
            };

            scope.changeVolume = function(){
                mediaElement.volume = scope.volume;
                console.log(mediaElement.volume);
            };

            scope.volumeMax = function(){
                scope.volume = 1;
                mediaElement.volume = scope.volume;
            };

            mediaElement.onended = function(e) {
                scope.$apply(function(){
                    scope.isPaused = true;
                });
            };
        }
    }
}


function recorder(Recorder,$ionicModal,Record,FileService,Toast){
    return {
        restrict: 'E',
        templateUrl: 'js/record/mediaCapture/recorder.tpl.html',
        scope: {},
        link: function link(scope,element,attrs){
            var mediaElement = element.find('video')[0];

            scope.type = {
                "audio": true,
                "video": false
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
                    })
            };
            scope.stop = function(){
                Recorder
                    .stop()
                    .then(function(){
                        scope.isRecording = false;
                        $ionicModal.fromTemplateUrl('recordDetail', {
                            scope: scope,
                            animation: 'slide-in-up'
                        }).then(function(modal) {
                            scope.modal = modal;
                            scope.modal.show();
                        });
                    })
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
                        Toast.info('record saved !',5);
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
    }
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
    }
}

angular.module('app.record.mediaCapture',[])
    .factory('Recorder', Recorder)
    .directive('recorder',recorder)
    .directive('previewPlayer',previewPlayer)
    .directive('downloadBlob',downloadBlob);