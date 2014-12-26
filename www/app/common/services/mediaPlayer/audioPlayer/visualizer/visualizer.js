'use strict';

function AudioVisualizer($window){
    var requestId,
        canvasCtx,
        params,
        analyser,
        freqs,
        times,
        SMOOTHING = 0.8,
        FFT_SIZE = 2048;

    function init(analyse,context,options){

        analyser = analyse;

        //analyser.connect(destination);
        analyser.minDecibels = -140;
        analyser.maxDecibels = 0;

        freqs = new Uint8Array(analyser.frequencyBinCount);
        times = new Uint8Array(analyser.frequencyBinCount);

        canvasCtx = context;
        params = options;
    }

    function drawCurve(){
        for (var i = 0; i < analyser.frequencyBinCount; i++) {
            var value = times[i];
            var percent = value / 256;
            var height = canvasCtx.canvas.height * percent;
            var offset = canvasCtx.canvas.height - height - 1;
            var barWidth = canvasCtx.canvas.width/analyser.frequencyBinCount;
            canvasCtx.fillStyle = params.curveColor;
            canvasCtx.fillRect(i * barWidth, offset, 1, 2);
        }
    }

    function drawDiag(){
        for (var i = 0; i < analyser.frequencyBinCount; i++) {
            var value = freqs[i];
            var percent = value / 256;
            var height = canvasCtx.canvas.height * percent;
            var offset = canvasCtx.canvas.height - height - 1;
            var barWidth = canvasCtx.canvas.width/analyser.frequencyBinCount;
            var hue = i/analyser.frequencyBinCount * 360;
            canvasCtx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
            canvasCtx.fillRect(i * barWidth, offset, barWidth, height);
        }
    }


    function draw(){
        canvasCtx.fillStyle = params.backgroundColor;
        canvasCtx.fillRect(0,0,canvasCtx.canvas.width,canvasCtx.canvas.height);
        analyser.smoothingTimeConstant = SMOOTHING;
        analyser.fftSize = FFT_SIZE;

        // Get the frequency data from the currently playing music
        analyser.getByteFrequencyData(freqs);
        analyser.getByteTimeDomainData(times);

        //var width = Math.floor(1/freqs.length, 10);

        switch(params.type){
            case 'bar':
                drawDiag();
                break;
            case 'curve':
                drawCurve();
                break;
            default :
                drawDiag();
                drawCurve();
                break;
        }

        requestId = $window.requestAnimationFrame(draw);

    }
    return{
        init: init,
        start:  function start() {
            if (!requestId) {
                draw();
            }
        },
        stop: function stop() {
            if (requestId) {
                $window.cancelAnimationFrame(requestId);
                requestId = undefined;

            }
        }
    };
}

function visualizer(AudioVisualizer,AudioPlayer){
    return {
        restrict : 'EA',
        templateUrl: 'app/common/services/mediaPlayer/audioPlayer/visualizer/visualizer.tpl.html',
        scope: {
            options : '='
        },
        require:  ['^mediaPlayer','^audioPlayer'],
        link: function(scope,element,attrs,Ctrl){
            console.log(scope.options);

            var defaultOptions = {
                backgroundColor: 'black',
                curveColor: 'white'
            };
            scope.options = angular.extend(defaultOptions,scope.options);

            var canvas = element[0].querySelector('canvas');
            var canvasCtx = canvas.getContext('2d');
            canvas.height = scope.options.height || element.parent()[0].clientHeight;
            canvas.width = element.parent()[0].clientWidth;
            Ctrl[0].$scope.$watch('isPlaying',function(){
                if(Ctrl[0].$scope.isPlaying){

                    scope.$watch(function(){
                        return AudioPlayer.sources[Ctrl[1].$scope.name];
                    },function(){
                        if(AudioPlayer.sources[Ctrl[1].$scope.name]){
                            var analyzer = AudioPlayer.getContext(Ctrl[1].$scope.name).createAnalyser();
                            AudioVisualizer.init(analyzer,canvasCtx,scope.options);
                            AudioPlayer.sources[Ctrl[1].$scope.name].connect(analyzer);
                            AudioVisualizer.start();
                        }
                    });
                    scope.$on('audioEnded', function(){
                        console.log('ended visu',canvasCtx.canvas.width);
                        scope.$apply(function(){
                            AudioVisualizer.stop();
                        });
                    });
                }

            });
        }
    };
}


angular.module('app.common.services.mediaPlayer.audioPlayer')
    .service('AudioVisualizer',AudioVisualizer)
    .directive('visualizer',visualizer);