'use strict';

function AudioVisualizer($window){
    var requestId,
        canvasCtx,
        bufferLength,
        dataArray,
        params,
        analyser;

    function init(analyse,context,options){
        analyser = analyse;
        canvasCtx = context;
        params = options;
        analyser.fftSize = 2048;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);
    }
    
    function draw(){
        requestId = $window.requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'white';
        canvasCtx.fillRect(0, 0, params.width, params.height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = '#8A6DE9';

        canvasCtx.beginPath();

        var sliceWidth = params.width * 1.0 / bufferLength;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * params.height/2;

            if(i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(params.width, params.height/2);
        canvasCtx.stroke();

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



angular.module('app.common.services.mediaPlayer.audioPlayer')
    .service('AudioVisualizer',AudioVisualizer);

