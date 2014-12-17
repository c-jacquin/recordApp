//todo add error and info icon

function Toast($timeout){
    Notification.requestPermission(function (permission) {
        if (permission === "granted") {

        }
    });
    return {
        info: function(label,duration){
            var toast = new Notification(label);
            if(duration){
                $timeout(function(){
                    toast.close();
                },duration*1000);
            }
        },
        error: function(label,duration){
            var toast = new Notification(label);
            if(duration){
                $timeout(function(){
                    toast.close();
                },duration*1000);
            }
        }
    };
}
angular.module('app.common.services.toast',[])
    .factory('Toast',Toast);