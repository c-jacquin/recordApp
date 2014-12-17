'use strict';

function appRun($ionicPlatform,$window) {
    $ionicPlatform.ready(function () {
        if ($window.cordova && $window.cordova.plugins.Keyboard) {
            $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if ($window.StatusBar) {
            $window.StatusBar.styleDefault();
        }
    });
}

function appConfig($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'app/app.tpl.html'
        });

    $urlRouterProvider.otherwise('/app/record');
}


angular.module('app', [
    'ionic',
    'pouchdb',
    'ngToast',
    'app.dashboard',
    'app.record',
    'app.home',
    'app.common'
])
    .run(appRun)
    .config(appConfig);