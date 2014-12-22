'use strict';


function MediaPlayerCtrl($scope,$element) {
    if('WebkitAppearance' in document.documentElement.style){
        $scope.audioUrl = $scope.audioTrack.replace('data:audio/wav;base64,','');
    }else{
        $scope.audioUrl = $scope.audioTrack.replace('data:video/webm;base64,','');
    }
    this.$scope = $scope;
    this.$element = $element;
}

function mediaPlayer($window,AudioPlayer,VideoPlayer){
    $window.AudioContext = $window.AudioContext || $window.webkitAudioContext;
    return {
        restrict: 'EA',
        templateUrl: 'app/common/services/mediaPlayer/mediaPlayer.tpl.html',
        scope: {
            videoTrack: '=',
            audioTrack: '=',
            showAudioVisu:'='
        },
        transclude: true,
        replace: true,
        controller: 'MediaPlayerController',
        link:function(scope,element,attrs){

            scope.play =  function(){
                scope.isPlaying = true;
            };

            scope.back = function(){
                //todo make it work 0o
            };

        }
    };
}


angular.module('app.common.services.mediaPlayer',[
    'app.common.services.mediaPlayer.videoPlayer',
    'app.common.services.mediaPlayer.audioPlayer'
    //'app.common.services.mediaPlayer.audioVisualizer'
])
    .controller('MediaPlayerController',MediaPlayerCtrl)
    .directive('mediaPlayer',mediaPlayer);
