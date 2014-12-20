'use strict';

function AudioPlayer($q,FileService,AudioVisualizer){

    var audioCtx;

    return{
        play: function(context,url,canvasCtx,options){
            var deferred = $q.defer();
            audioCtx = context;
            audioCtx.decodeAudioData(FileService.base64toArrayBuffer(url),function(buffer) {
                var source = audioCtx.createBufferSource();
                source.buffer = buffer;
                if(canvasCtx){
                    var analyser = audioCtx.createAnalyser();
                    var canvasParams = {
                        height: 200,
                        width: options.width
                    };
                    AudioVisualizer.init(analyser,canvasCtx,canvasParams);
                    AudioVisualizer.start();
                    source.connect(analyser);
                }
                source.connect(audioCtx.destination);
                source.start(0);
                deferred.resolve(source);
            },function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        }
    };
}


angular.module('app.record.mediaCapture.player.audioPlayer',[])
    .service('AudioPlayer',AudioPlayer);
