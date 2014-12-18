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
}

angular.module('app.dashboard',[])
    .config(dashboardConfig)
    .controller('DashboardController',DashboardCtrl)
