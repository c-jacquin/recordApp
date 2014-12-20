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

function RecordCtrl($scope,$ionicModal,Toast,Record,$window){

    $window.navigator.getUserMedia({audio:true,video:true},function(stream) {
        $scope.$apply(function(){
            $scope.stream = stream;
        });
    },function(err){
        console.log(err);
    });

    $scope.recordSuccess = function(record){
        $scope.isVideo = record.isVideo;
        $scope.audioTrack = record.audioUrl;
        $scope.videoTrack = record.videoUrl;
        $scope.cancel = function(){
            $scope.modal.hide();
        };

        $scope.save = function(meta){
            Record.buildData(meta,record)
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