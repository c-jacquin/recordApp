function homeConfig($stateProvider){
    $stateProvider
        .state('app.dashboard',{
            url: '/dashboard',
            views: {
                dashboardView: {
                    templateUrl: 'js/dashboard/dashboard.tpl.html',
                    controller: 'DashboardController as dashboard'
                }
            },
            resolve: {
                records: function(Record){
                    return Record.findAll();
                }
            }
        })
}

function DashboardCtrl(Record,Toast){
    this.records = Record.list;
    this.remove = function(id){
        console.log(id)
        Record
            .remove(id)
            .then(function(){
                Toast.info('record removed',5);
            })
            .catch(function(err){
                Toast.info(err.message);
            })
    }
}

angular.module('app.dashboard',[])
    .config(homeConfig)
    .controller('DashboardController',DashboardCtrl);