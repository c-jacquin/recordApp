'use strict';

function play(){
    return {
        restrict : 'A',
        scope: {
            options: '='
        },
        require: '^mediaPlayer',
        link: function(scope,element,attrs,mediaPlayerCtrl){
            var i = element.find('i');
            if(i[0]){
                i.addClass(scope.options.pauseClass);
            }else{
                element.addClass(scope.options.pauseClass);
            }
            element.on('click',function(){
                scope.$apply(function(){
                    mediaPlayerCtrl.$scope.isPlaying = !mediaPlayerCtrl.$scope.isPlaying;
                })
            });
            mediaPlayerCtrl
                .$scope
                .$watch('isPlaying',function(){
                    if(i){
                        i.toggleClass(scope.options.playingClass);
                        i.toggleClass(scope.options.pauseClass);
                    }else{
                        element.toggleClass(scope.options.playingClass);
                        element.toggleClass(scope.options.pauseClass);
                    }

                });
        }
    };
}

angular.module('app.common.services.mediaPlayer')
.directive('play',play);