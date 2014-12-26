'use strict';

function clickForOptionsWrapper(){
    return {
        restrict: 'A',
        controller: function($scope) {
            this.closeOptions = function() {
                $scope.$broadcast('closeOptions');
            };
        }
    };
}

function clickForOptions($ionicGesture){
    return {
        restrict: 'A',
        scope: false,
        require: '^clickForOptionsWrapper',
        link: function (scope, element, attrs, parentController) {
            // A basic variable that determines wether the element was currently clicked
            var clicked;

            // Set an initial attribute for the show state
            attrs.$set('optionButtons', 'hidden');

            // Grab the content
            var content = element[0].querySelector('.item-content');

            // Grab the buttons and their width
            var buttons = element[0].querySelector('.item-options');

            var closeAll = function() {
                element.parent()[0].$set('optionButtons', 'show');
            };

            // Add a listener for the broadcast event from the parent directive to close
            var previouslyOpenedElement;
            scope.$on('closeOptions', function() {
                if (!clicked) {
                    attrs.$set('optionButtons', 'hidden');
                }
            });

            // Function to show the options
            var showOptions = function() {
                // close all potentially opened items first
                parentController.closeOptions();

                var buttonsWidth = buttons.offsetWidth;
                ionic.requestAnimationFrame(function() {
                    // Add the transition settings to the content
                    content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

                    // Make the buttons visible and animate the content to the left
                    buttons.classList.remove('invisible');
                    content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';

                    // Remove the transition settings from the content
                    // And set the "clicked" variable to false
                    setTimeout(function() {
                        content.style[ionic.CSS.TRANSITION] = '';
                        clicked = false;
                    }, 250);
                });
            };

            // Function to hide the options
            var hideOptions = function() {
                var buttonsWidth = buttons.offsetWidth;
                ionic.requestAnimationFrame(function() {
                    // Add the transition settings to the content
                    content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

                    // Move the content back to the original position
                    content.style[ionic.CSS.TRANSFORM] = '';

                    // Make the buttons invisible again
                    // And remove the transition settings from the content
                    setTimeout(function() {
                        buttons.classList.add('invisible');
                        content.style[ionic.CSS.TRANSITION] = '';
                    }, 250);
                });
            };

            // Watch the open attribute for changes and call the corresponding function
            attrs.$observe('optionButtons', function(value){
                if (value === 'show') {
                    showOptions();
                } else {
                    hideOptions();
                }
            });

            // Change the open attribute on tap
            $ionicGesture.on('tap', function(e){
                clicked = true;
                if (attrs.optionButtons === 'show') {
                    attrs.$set('optionButtons', 'hidden');
                } else {
                    attrs.$set('optionButtons', 'show');
                }
            }, element);
        }
    };
}

angular.module('app.common.services.ionic',[
    'ionic'
])
    .directive('clickForOptionsWrapper', clickForOptionsWrapper)
    .directive('clickForOptions', clickForOptions);