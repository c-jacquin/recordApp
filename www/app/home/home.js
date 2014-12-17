'use strict';

function homeConfig($stateProvider){
    $stateProvider
        .state('app.home',{
            url: '/home',
            views: {
                manageView: {
                    templateUrl: 'app/home/home.tpl.html',
                    controller: 'HomeController'
                }
            }
        });
}

function HomeCtrl(){

}

angular.module('app.home',[])
    .config(homeConfig)
    .controller('HomeController',HomeCtrl);