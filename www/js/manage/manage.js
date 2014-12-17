function manageConfig($stateProvider){
    $stateProvider
        .state('app.manage',{
            url: '/manage',
            views: {
                manageView: {
                    templateUrl: 'js/manage/manage.tpl.html',
                    controller: 'ManageController'
                }
            }
        })
}

function ManageCtrl(){

}

angular.module('app.manage',[])
    .config(manageConfig)
    .controller('ManageController',ManageCtrl);