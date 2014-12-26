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
                     return Record.findAll(0)

                }
            }
        });
}

function DashboardCtrl(Record,Toast,$ionicPopup,records){
    var self = this;
    Record
        .populate(records)
        .then(function(){
            self.records = records;
        });

    this.visualizerOptions = {
        backgroundColor: 'white',
        curveColor: 'black',
        type:'curve',
        height: '50'
    };

    this.playOptions = {
        playingClass: 'ion-ios7-play-outline',
        pauseClass: 'ion-ios7-pause-outline'
    };


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
}

angular.module('app.dashboard',[])
    .config(dashboardConfig)
    .controller('DashboardController',DashboardCtrl);
