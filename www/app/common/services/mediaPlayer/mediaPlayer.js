'use strict';


function MediaPlayerCtrl($scope,$element) {
    $scope.isPlaying = false;

    this.$scope = $scope;
    this.$element = $element;
}

function mediaPlayer($window){
    $window.AudioContext = $window.AudioContext || $window.webkitAudioContext;
    return {
        restrict: 'EA',
        templateUrl: 'app/common/services/mediaPlayer/mediaPlayer.tpl.html',
        scope: {
            videoTrack: '=',
            audioTrack: '='
        },
        transclude: true,
        replace: true,
        controller: 'MediaPlayerController'
    };
}


angular.module('app.common.services.mediaPlayer',[
    'app.common.services.mediaPlayer.videoPlayer',
    'app.common.services.mediaPlayer.audioPlayer'
])
    .controller('MediaPlayerController',MediaPlayerCtrl)
    .directive('mediaPlayer',mediaPlayer);
