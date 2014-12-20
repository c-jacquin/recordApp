'use strict';

function collapseCard(collapse){
    return {
        restrict: 'EA',
        transclude: true,
        scope: {},
        templateUrl: 'app/common/services/collapseCard/collapse-card.tpl.html',
        link: function(scope, element) {
            scope.$watch(function(){
                return collapse.isOpen;
            },function(){
                if(collapse.isOpen !== undefined){
                    element.find('section').toggleClass('open');
                }
            });
        }
    };
}

function collapseButton(collapse){
    return {
        restrict: 'EA',
        scope: {
            tooltip: '@'
        },
        templateUrl: 'app/common/directives/collapseCard/collapse-button.tpl.html',
        link: function(scope) {
            scope.button = collapse;
            scope.toggle = function toggle() {
                collapse.isOpen = !collapse.isOpen;
            };
        }
    };
}

function collapse(){
    return {};
}

angular.module('app.common.services.collapse',[])
    .directive('collapseCard',collapseCard)
    .directive('collapseButton', collapseButton)
    .factory('collapse',collapse);