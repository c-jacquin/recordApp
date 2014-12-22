'use strict';

function volume(){
    return {
        restrict: 'EA',
        templateUrl:'app/common/services/mediaPlayer/controls/volume/volume.tpl.html',
        require: 'ngModel',
        replace: true,
        link: function(scope,element,attrs){

            scope.toggleSound = function(){
                angular.element(element[0].querySelector('.range')).toggleClass('sound-visible');
            };

            scope.changeVolume = function(){

            };

            scope.volumeMax = function(){
                scope.volume = 1;
            };

        }
    }
}

angular.module('app.common.services.mediaPlayer')
    .directive('volume',volume);