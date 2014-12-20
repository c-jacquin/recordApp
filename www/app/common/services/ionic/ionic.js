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

function ionAudioVisu($window,FileService,$q){
    return {
        restrict: 'EA',
        template:'<canvas  height="50"></canvas>',
        scope: {
            label:'='
        },
        require: '^ionItem',
        link: function(scope,element,attrs,ionItemCtrl){

            var canvas = element[0].querySelector('canvas'),
                height = element.parent()[0].clientHeight,
                width = element.parent()[0].clientWidth-32,
                canvasCtx = canvas.getContext('2d'),
                audioCtx = new ($window.AudioContext || $window.webkitAudioContext)();



            canvasCtx.fillText(scope.label,0,30);


            function play(url){
                if(url){
                    canvas.width = width;
                    canvas.height = height;
                    audioCtx.decodeAudioData(FileService.base64toArrayBuffer(url.replace('data:audio/ogg;base64,','')),function(buffer){

                        var analyser = audioCtx.createAnalyser();
                        analyser.fftSize = 2048;
                        var bufferLength = analyser.frequencyBinCount;
                        var dataArray = new Uint8Array(bufferLength);
                        analyser.getByteTimeDomainData(dataArray);


                        var source = audioCtx.createBufferSource();
                        source.buffer = buffer;
                        source.connect(analyser);
                        source.connect(audioCtx.destination);
                        source.start(0);

                        source.addEventListener('ended',function(){
                            console.log('ended')
                            canvasCtx.clearRect ( 0 , 0 , canvas.width, canvas.height );
                            canvasCtx.fillText(scope.label,0,30);

                        });


                        var requestId;
                        function start() {
                            if (!requestId) {
                                draw();
                            }
                        }

                        function stop() {
                            if (requestId) {
                                window.cancelAnimationFrame(requestId);
                                requestId = undefined;
                            }
                        }


                        function draw(){
                            requestId = requestAnimationFrame(draw);

                            analyser.getByteFrequencyData(dataArray);

                            canvasCtx.fillStyle = 'white';
                            canvasCtx.fillRect(0, 0, width, height);

                            canvasCtx.lineWidth = 2;
                            canvasCtx.strokeStyle = '#8A6DE9';

                            canvasCtx.beginPath();

                            var sliceWidth = width * 1.0 / bufferLength;
                            var x = 0;

                            for(var i = 0; i < bufferLength; i++) {

                                var v = dataArray[i] / 128.0;
                                var y = v * height/2;

                                if(i === 0) {
                                    canvasCtx.moveTo(x, y);
                                } else {
                                    canvasCtx.lineTo(x, y);
                                }

                                x += sliceWidth;
                            }

                            canvasCtx.lineTo(canvas.width, canvas.height/2);
                            canvasCtx.stroke();

                        }
                        start();

                    });
                }
            }

            ionItemCtrl.$scope.$watch('audioUrl',play)
        }
    }

}



function play(Record,Toast){
    return {
        scope: {
            id: '='
        },
        require: '^ionItem',
        link: function(scope,element,attrs,ionItemCtrl){
            element.on('click',function(){
                Record
                    .getBase64(scope.id)
                    .then(function(url){
                        //var audioElement = angular.element('<audio/>')[0];
                        //audioElement.src =url;
                        //audioElement.play();
                        ionItemCtrl.$scope.isPlaying = true;
                        ionItemCtrl.$scope.audioUrl = url;
                        //audioElement.addEventListener('ended',function(){
                        //    scope.$apply(function(){
                        //        ionItemCtrl.$scope.isPlaying = false;
                        //    });
                        //})
                    })
                    .catch(function(err){
                        Toast.error(err.message);
                    })
            })
        }
    }
}

angular.module('app.common.services.ionic',[
    'ionic'
])
    .directive('clickForOptionsWrapper', clickForOptionsWrapper)
    .directive('clickForOptions', clickForOptions)
    .directive('ionAudioVisu',ionAudioVisu)
    .directive('play',play);