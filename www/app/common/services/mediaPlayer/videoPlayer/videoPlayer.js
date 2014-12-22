'use strict';

//function hue2rgb (p, q, t) {
//    if(t < 0) t += 1;
//    if(t > 1) t -= 1;
//    if(t < 1/6) return p + (q - p) * 6 * t;
//    if(t < 1/2) return q;
//    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
//    return p;
//}
//
//function hslToRgb(h, s, l){
//    var r, g, b;
//    if (s == 0) {
//        r = g = b = l; // achromatic
//    } else {
//        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
//        var p = 2 * l - q;
//        r = hue2rgb(p, q, h + 1/3);
//        g = hue2rgb(p, q, h);
//        b = hue2rgb(p, q, h - 1/3);
//    }
//    return [r * 255, g * 255, b * 255];
//}

function ImageVisualizer($window){
    var requestId,
        canvasContext,
        video,
        tr = 255,
        tg = 0,
        tb = 0;

    function draw() {
        requestId = $window.requestAnimationFrame(draw);
        canvasContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
        //var pixels = canvasContext.getImageData(0, 0, canvasContext.canvas.width, canvasContext.canvas.height),
        //    i = 0,
        //    brightness;
        //
        //for (; i < pixels.data.length; i += 4) {
        //    // brightness code from Tab Atkins' canvas demos
        //    brightness = ((3*pixels.data[i]+4*pixels.data[i+1]+pixels.data[i+2])>>>3) / 256;
        //
        //    pixels.data[i] = ((tr * brightness)+0.5)>>0;
        //    pixels.data[i+1] = ((tg * brightness)+0.5)>>0
        //    pixels.data[i+2] = ((tb * brightness)+0.5)>>0
        //}
        //canvasContext.putImageData(pixels, 0, 0);
    }

    return{
        start: function(videoElement,context){
            canvasContext = context;
            video = videoElement;
            draw();
            video.addEventListener('loadedmetadata', function() {
                context.canvas.height = this.videoHeight;
                context.canvas.width = this.videoWidth;
                video.play();
            }, false);
        },
        changeColor: function(){

        },
        stop: function(){
            if (requestId) {
                $window.cancelAnimationFrame(requestId);
                requestId = undefined;
            }
        }
    };

}

function videoPlayer(){
    return{
        restrict: 'EA',
        templateUrl: 'app/common/services/mediaPlayer/videoPlayer/videoPlayer.js',
        require: '^mediaPlayer',
        replace: true,
        link: function(scope,element,attrs,mediaPlayerCtrl){
            scope.videoElement = element[0].querySelector('video');
            scope.videoElement.control = false;
            scope.videoElement.muted = true;
            var audioEnded = function(){
                console.log('ended');
                mediaPlayerCtrl.$scope.isPlaying = false;
            };

            mediaPlayerCtrl
                .$scope
                .$watch('isPlaying',function(){
                    AudioPlayer
                        .play(mediaPlayerCtrl.$scope.audioUrl)
                        .then(function(source){
                            scope.videoElement.src = scope.26videoTrack;
                            VideoPlayer.start(video);
                            source.addEventListener('ended',audioEnded);
                        });
                })
        }
    }
}


angular.module('app.common.services.mediaPlayer.videoPlayer',[])
    .service('VideoPlayer',ImageVisualizer);