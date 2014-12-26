'use strict';

function AudioPlayer($q){

    var audioContext = {};

     function base64toArrayBuffer(base64) {
        var binaryString = window.atob(base64);
        var len = binaryString.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    return{
        sources: {},
        play: function(id){
            this.sources[id].start(0);
        },
        getContext: function(id){
            return audioContext[id];
        },
        addContext: function(id,context,dataUrl){
            audioContext[id] = context;
            var deferred = $q.defer();
            var self = this;
            //var url = dataUrl.replace('data:audio/wav;base64,','') || dataUrl.replace('data:video/webm;base64,','') || dataUrl.replace('data:audio/ogg;base64,','');
            audioContext[id].decodeAudioData(base64toArrayBuffer(dataUrl),function(buffer) {
                self.sources[id] = audioContext[id].createBufferSource();
                self.sources[id].buffer = buffer;
                self.sources[id].connect(audioContext[id].destination);
                deferred.resolve(self.sources[id]);
            },function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        },
        stop: function(id){
            this.sources[id].pause();
        },
        pause: function(id){
            this.sources[id].pause();
        }
    };
}

function AudioPlayerCtrl($scope,$element){
    this.$scope = $scope;
    this.$element = $element;
}

function audioPlayer(AudioPlayer,$window){

    return {
        restrict: 'EA',
        templateUrl: 'app/common/services/mediaPlayer/audioPlayer/audioPlayer.tpl.html',
        require: '^mediaPlayer',
        scope:{
            name: '@'
        },
        replace: true,
        transclude:true,
        controller: 'AudioPlayerController',
        link: function(scope,element,attrs,mediaPlayerCtrl){
            var audioEnded = function(e){
                scope.$apply(function(){
                    mediaPlayerCtrl.$scope.isPlaying = false;
                    scope.$emit('audioEnded');
                    AudioPlayer
                        .addContext(scope.name,new $window.AudioContext(),mediaPlayerCtrl.$scope.audioTrack)
                        .then(function(source){
                            source.onended = audioEnded;
                        });
                });
            };
            mediaPlayerCtrl
                .$scope
                .$watch('audioTrack',function(){
                    if(mediaPlayerCtrl.$scope.audioTrack){
                        AudioPlayer
                            .addContext(scope.name,new $window.AudioContext(),mediaPlayerCtrl.$scope.audioTrack)
                            .then(function(source){
                                source.onended = audioEnded;
                            });
                    }
                });


            mediaPlayerCtrl
                .$scope
                .$watch('isPlaying',function(){
                    if(mediaPlayerCtrl.$scope.isPlaying){
                        AudioPlayer.play(scope.name);
                    }
                });
        }
    };
}

angular.module('app.common.services.mediaPlayer.audioPlayer',[])
    .factory('AudioPlayer',AudioPlayer)
    .controller('AudioPlayerController',AudioPlayerCtrl)
    .directive('audioPlayer',audioPlayer);