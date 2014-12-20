'use strict';

function mediaPlayer($window,AudioPlayer,VideoPlayer){
    return {
        restrict: 'EA',
        templateUrl: 'app/record/mediaCapture/player/player.tpl.html',
        scope: {
            url: '=',
            videoTrack: '=',
            audioTrack: '=',
            isVideo: '='
        },
        replace: true,
        link:function(scope,element,attrs){
            var audioCtx = new ($window.AudioContext || $window.webkitAudioContext)(),
                canvas  = element[0].querySelector('canvas'),
                canvasCtx = canvas.getContext('2d'),
                video,
                isStreaming;

            scope.play =  function(){
                var audioEnded = function(){
                    console.log('ended')
                };
                var audioPlayerOptions = {
                    width: element[0].clientWidth
                };
                var url;

                console.log('video',scope.isVideo)
                if(scope.isVideo){
                    video = element[0].querySelector('video');
                    canvas.height = video.clientHeight;
                    canvas.width = video.clientWidth;
                    video.control = false;
                    video.muted = true;
                    if('WebkitAppearance' in document.documentElement.style){
                        console.log(scope
                        )
                        url = scope.audioTrack.replace('data:audio/wav;base64,','');
                        console.log('Webkiyt',url)
                        AudioPlayer
                            .play(audioCtx,url)
                            .then(function(source){
                                console.log('audio plya ???')
                                video.src = scope.videoTrack;
                                VideoPlayer.start(video,canvasCtx);
                                source.addEventListener('ended',audioEnded)
                            })
                    }else{
                        //url = scope.url.replace('data:video/webm;base64,','');
                        video.src = scope.url;
                        VideoPlayer.start(video,canvasCtx);
                    }
                    video.addEventListener('loadedmetadata', function() {
                        isStreaming = true;
                    }, false);
                }else{
                    'WebkitAppearance' in document.documentElement.style ?
                        url = scope.url.replace('data:audio/wav;base64,','') :
                        url = scope.url.replace('data:audio/ogg;base64,','');



                    AudioPlayer
                        .play(audioCtx,url,canvasCtx,audioPlayerOptions)
                        .then(function(source){
                            source.addEventListener('ended',audioEnded)
                        })
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
    .directive('mediaPlayer',mediaPlayer)
    .factory('AudioVisualizer',AudioVisualizer);