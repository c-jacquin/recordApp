'use strict';

function dashboardConfig($stateProvider){
    $stateProvider
        .state('app.dashboard',{
            url: '/dashboard',
            views: {
                dashboardView: {
                    templateUrl: 'app/dashboard/dashboard.tpl.html',
                    controller: 'DashboardController as dashboard'
                }
            },
            resolve: {
                records: function(Record){
                    return Record.findAll();
                }
            }
        });
}

function DashboardCtrl(Record,Toast,$ionicPopup){
    this.records = Record.list;
    this.remove = function(event,record,index){
        $ionicPopup
            .confirm({
                title: 'Remove a record',
                template: 'Do you confirm ?'
            })
            .then(function(res) {
                if(res) {
                    Record
                        .remove(record)
                        .then(function(){
                            Record.list.splice(index, 1);
                            Toast.info('record removed');
                        })
                        .catch(function(err){
                            Toast.error(err.message);
                        });
                }
            });
    };

    this.moveItem = function(item, fromIndex, toIndex) {
        Record.list.splice(fromIndex, 1);
        Record.list.splice(toIndex, 0, item);
    };

    this.playSound = function(id){
        Record
            .findOne(id)
            .then(function(){

            })

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
                        var audioElement = angular.element('<audio/>')[0];
                        audioElement.src =url;
                        audioElement.play();
                        ionItemCtrl.$scope.isPlaying = true;
                        audioElement.addEventListener('ended',function(){
                            scope.$apply(function(){
                                ionItemCtrl.$scope.isPlaying = false;
                            });
                        })
                    })
                    .catch(function(err){
                        Toast.error(err.message);
                    })
            })
        }
    }
}

angular.module('app.dashboard',[])
    .config(dashboardConfig)
    .controller('DashboardController',DashboardCtrl)
    .directive('play',play);