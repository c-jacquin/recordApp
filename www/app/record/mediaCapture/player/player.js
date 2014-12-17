'use strict';

function mediaPlayer(Recorder){
    return {
        restrict: 'EA',
        templateUrl: 'app/record/mediaCapture/player/player.tpl.html',
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
    };
}


angular.module('app.record.mediaCapture.player',[])
    .directive('mediaPlayer',mediaPlayer);