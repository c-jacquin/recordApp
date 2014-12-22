'use strict';

function AudioPlayer($q,$window,AudioVisualizer){

    var audioContext;

     function base64toArrayBuffer(base64) {
        var binaryString = window.atob(base64);
        var len = binaryString.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    return{
        play: function(url,options,canvasContext){
            var deferred = $q.defer();
            audioContext = new $window.AudioContext();
            audioContext.decodeAudioData(base64toArrayBuffer(url),function(buffer) {
                var source = audioContext.createBufferSource();
                source.buffer = buffer;
                if(canvasContext){
                    var analyser = audioContext.createAnalyser();
                    source.connect(analyser);
                    AudioVisualizer.init(analyser,canvasContext, options);
                    AudioVisualizer.start();
                }
                source.connect(audioContext.destination);
                source.start(0);
                deferred.resolve(source);
            },function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        },
        getContext: function(){
            return audioContext;
        }
    };
}

function audioPlayer(AudioPlayer){

    return {
        restrict: 'EA',
        templateUrl: 'app/common/services/mediaPlayer/audioPlayer/audioPlayer.tpl.html',
        //replace: true,
        require: '^mediaPlayer',
        replace: true,
        link: function(scope,element,attrs,mediaPlayerCtrl){
            var canvasCtx = element[0].querySelector('canvas').getContext('2d');
            var audioEnded = function(){
                console.log('ended');
                mediaPlayerCtrl.$scope.isPlaying = false;
            };
            mediaPlayerCtrl
                .$scope
                .$watch('isPlaying',function(){
                    var options = {
                        height: element.parent()[0].clientHeight,
                        width: element.parent()[0].clientWidth
                    };
                    AudioPlayer
                        .play(mediaPlayerCtrl.$scope.audioUrl,options,canvasCtx)
                        .then(function(source){
                            source.addEventListener('ended',audioEnded);
                        });
                })
        }
    }
}



angular.module('app.common.services.mediaPlayer.audioPlayer',[])
    .service('AudioPlayer',AudioPlayer)
    .directive('audioPlayer',audioPlayer);
