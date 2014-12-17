function recordConfig($stateProvider){
    $stateProvider
        .state('app.record',{
            url: '/record',
            views: {
                recordView: {
                    templateUrl: 'js/record/record.tpl.html'
                }
            }
        })
}

angular.module('app.record',[
    'app.record.mediaCapture'
])
    .config(recordConfig);