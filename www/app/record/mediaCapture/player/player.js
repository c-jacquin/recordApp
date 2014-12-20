'use strict';

function mediaPlayer($window,AudioPlayer,VideoPlayer){
    $window.AudioContext = $window.AudioContext || $window.webkitAudioContext;
    return {
        restrict: 'EA',
        templateUrl: 'app/record/mediaCapture/player/player.tpl.html',
        scope: {
            videoTrack: '=',
            audioTrack: '=',
            isVideo: '='
        },
        replace: true,
        link:function(scope,element,attrs){
            console.log(scope);

            var audioCtx = new $window.AudioContext(),
                canvas  = element[0].querySelector('canvas'),
                canvasCtx = canvas.getContext('2d'),
                video,
                isStreaming;

            scope.play =  function(){
                var audioEnded = function(){
                    console.log('ended');
                };
                var audioPlayerOptions = {
                    width: element[0].clientWidth
                };
                var audioUrl;
                if('WebkitAppearance' in document.documentElement.style){
                    audioUrl = scope.audioTrack.replace('data:audio/wav;base64,','');
                }else{
                    audioUrl = scope.audioTrack.replace('data:video/webm;base64,','');
                }
                if(scope.isVideo){
                    video = element[0].querySelector('video');
                    video.control = false;
                    video.muted = true;
                    AudioPlayer
                        .play(audioCtx,audioUrl)
                        .then(function(source){
                            video.src = scope.videoTrack;
                            VideoPlayer.start(video,canvasCtx);
                            source.addEventListener('ended',audioEnded);
                        });
                }else{
                    AudioPlayer
                        .play(audioCtx,audioUrl,canvasCtx,audioPlayerOptions)
                        .then(function(source){
                            source.addEventListener('ended',audioEnded);
                        });
                }
            };

            scope.back = function(){
                //todo make it work 0o
            };

            scope.toggleSound = function(){
                angular.element(element[0].querySelector('.range')).toggleClass('sound-visible');
            };

            scope.changeVolume = function(){

            };

            scope.volumeMax = function(){
                scope.volume = 1;
            };

        }
    };
}



angular.module('app.record.mediaCapture.player',[
    'app.record.mediaCapture.player.audioVisualizer',
    'app.record.mediaCapture.player.videoPlayer',
    'app.record.mediaCapture.player.audioPlayer'
])
    .directive('mediaPlayer',mediaPlayer);