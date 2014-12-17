angular.module('app', [
    'ionic',
    'pouchdb',
    'app.dashboard',
    'app.record',
    'app.manage',
    'app.common'
])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "js/app.tpl.html"
            });

        $urlRouterProvider.otherwise('/app/record');

    });

