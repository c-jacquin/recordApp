'use strict';

function Recorder($q,$window,$timeout){

    var record,
        type,
        meta;

    var Record = function(stream,video){
        var self = this;
        if(video) {
            var videoOptions;
            videoOptions = {
                type: 'video'
            };
            this.video = $window.RecordRTC(stream, videoOptions);
            this.audio = $window.RecordRTC(stream, {
                onAudioProcessStarted: function () {
                    self.video.startRecording();
                }
            });
            this.audio.startRecording();
        }else{
            this.audio = $window.RecordRTC(stream);
            this.audio.startRecording();
        }
    };

    Record.prototype.getAudioUrl = function(){
        var deferred = $q.defer(),
            self = this;
        this.audio.stopRecording(function () {
            self.audio.getDataURL(function(dataURL){
                deferred.resolve(dataURL);
            });
        });
        return deferred.promise;
    };

    Record.prototype.getVideoUrl = function(){
        var deferred = $q.defer(),
            self = this;
        this.video.stopRecording(function () {
            self.video.getDataURL(function(dataURL){
                deferred.resolve(dataURL);
            });
        });
        return deferred.promise;
    };

    return{
        start: function(stream,options){
            type = options;
            record = new Record(stream,type.video);
            record.isVideo = type.video;
            var url;
            if(type.video){
                url = $window.URL.createObjectURL(stream);
            }
            return url;
        },
        stop: function(){
            var deferred = $q.defer();
            var self = this;
            if(type.video){
                $q
                    .all([
                        record.getAudioUrl(),
                        record.getVideoUrl()
                    ])
                    .then(function(data){
                        record.audioUrl = data[0];
                        record.videoUrl = data[1];
                        deferred.resolve(record);
                    });
            }else {
                record
                    .getAudioUrl()
                    .then(function (audioURL) {
                        record.audioUrl = audioURL;
                        deferred.resolve(record);
                    });
            }
            return deferred.promise;
        },
        isVideo: function(){
            return type.video;
        },
        setMeta: function(metaData){
            meta = metaData;
        }
    };
}

function recorder(Recorder){
    return {
        restrict: 'E',
        templateUrl: 'app/record/mediaCapture/recorder/recorder.tpl.html',
        scope: {
            onrecorded: '=',
            onerror: '=',
            stream: '='
        },
        link: function link(scope,element,attrs){
            var mediaElement = element.find('video')[0];

            scope.type = {
                'audio': true,
                'video': false
            };

            scope.start = function(){
                scope.isRecording = true;
                scope.isFinish = false;
                var url = Recorder.start(scope.stream,scope.type);
                if(scope.type.video){
                    mediaElement.src = url;
                    mediaElement.muted = true;
                    mediaElement.controls = false;
                    mediaElement.play();
                }
            };

            scope.stop = function(){
                Recorder
                    .stop()
                    .then(function(record){
                        scope.onrecorded(record);
                        scope.isRecording = false;
                    })
                    .catch(function(err){
                        scope.onerror(err);
                    });
            };
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