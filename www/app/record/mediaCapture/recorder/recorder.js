'use strict';

function Recorder($q,$window,$timeout){

    var record,
        type,
        stream,
        url,
        audioUrl,
        videoUrl,
        base64,
        isVideo,
        meta,
        videoTrack,
        audioTrack;

    return{
        start: function(options){
            type = options;
            var deferred = $q.defer();
            isVideo = type.video;
            $window.navigator.getUserMedia(type,function(streamData){
                stream = streamData;
                if(type.video){
                    var options = {
                        type: 'video'
                    };
                    if('WebkitAppearance' in document.documentElement.style) {
                        videoTrack = $window.RecordRTC(stream, options);
                        audioTrack = $window.RecordRTC(stream);
                        audioTrack.startRecording();
                        videoTrack.startRecording();
                    }else{
                        record = $window.RecordRTC(stream, options);
                        record.startRecording();
                    }
                }else{
                    record = $window.RecordRTC(stream);
                    record.startRecording();
                }
                url = $window.URL.createObjectURL(stream);
                deferred.resolve(url);
            },function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        },
        stop: function(){
            var deferred = $q.defer();
            if(type.video) {
                if ('WebkitAppearance' in document.documentElement.style) {
                    audioTrack.stopRecording(function () {
                        console.log('stop1')
                        videoTrack.stopRecording(function () {
                            console.log('stop1')
                            audioTrack.getDataURL(function (audioURL) {
                                console.log('stop1')
                                videoTrack.getDataURL(function (videoURL) {
                                    console.log('stop1')
                                    audioUrl = audioURL;
                                    videoUrl = videoURL;
                                    deferred.resolve({
                                        video: videoURL,
                                        audio: audioURL
                                    })
                                })
                            });
                        })
                    });
                } else {
                    record.stopRecording(function (localUrl) {
                        url = localUrl;
                        record.getDataURL(function (dataURI) {
                            base64 = dataURI;
                            deferred.resolve(base64);
                        });
                    })
                }
            }else{
                record.stopRecording(function (localUrl) {
                    url = localUrl;
                    record.getDataURL(function (dataURI) {
                        base64 = dataURI;
                        deferred.resolve(base64);
                    });
                })
            }
            return deferred.promise;
        },
        isVideo: function(){
            return isVideo;
        },
        getUrl: function(){
            return url;
        },
        getBase64: function(){
            return base64;
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
                    .then(function(data){
                        scope.onrecorded(data);
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