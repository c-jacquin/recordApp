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
    this.remove = function(record,index){
        console.log(record);
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
                } else {
                    console.log('You are not sure');
                }
            });
    };
    this.moveItem = function(item, fromIndex, toIndex) {
        Record.list.splice(fromIndex, 1);
        Record.list.splice(toIndex, 0, item);
    };
}

angular.module('app.dashboard',[])
    .config(dashboardConfig)
    .controller('DashboardController',DashboardCtrl);