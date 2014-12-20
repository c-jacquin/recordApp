'use strict';

navigator.getUserMedia = ( navigator.getUserMedia ||
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia ||
navigator.msGetUserMedia);


function recordConfig($stateProvider){
    $stateProvider
        .state('app.record',{
            url: '/record',
            views: {
                recordView: {
                    templateUrl: 'app/record/record.tpl.html',
                    controller: 'RecordController'
                }
            }
        });
}

function RecordCtrl($scope,$ionicModal,Toast,FileService,Recorder,Record){

    $scope.recordSuccess = function(url){
        $scope.video = Recorder.isVideo();
        if('WebkitAppearance' in document.documentElement.style){
            console.log(url);
            if($scope.video){
                $scope.videoTrack = url.video;
                $scope.audioTrack = url.audio;
            }else{
                $scope.url = url;
            }
        }else{
            $scope.url = url;
        }



        $scope.cancel = function(){
            $scope.modal.hide();
        };

        $scope.save = function(record){
            Recorder.meta = record;
            FileService
                .urlToBlob(url)
                .then(FileService.blobToBase64)
                .then(Recorder.buildData)
                .then(Record.save)
                .then(function(){
                    $scope.modal.hide();
                    Toast.info('record saved !');
                })
                .catch(function(err){
                    Toast.error(err.message);
                });
        };

        $scope.$on('$destroy', function() {
            if($scope.modal){
                $scope.modal.remove();
            }
        });

        $ionicModal.fromTemplateUrl('app/record/recordPreview.tpl.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };

    $scope.recordError = function(err){
        Toast.error(err.message);
    };
}

angular.module('app.record',[
    'app.record.mediaCapture'
])
    .config(recordConfig)
    .controller('RecordController',RecordCtrl);