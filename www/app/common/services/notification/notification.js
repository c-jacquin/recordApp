'use strict';


function Notif($timeout,$window){
    $window.Notification.requestPermission();
    return {
        info: function(label,duration){
            $window.Notification.requestPermission(function (permission) {
                if (permission === 'granted') {
                    var notif = new $window.Notification(label);
                    if(duration){
                        $timeout(function(){
                            notif.close();
                        },duration*1000);
                    }
                }
            });
        },
        error: function(label,duration){
            $window.Notification.requestPermission(function (permission) {
                if (permission === 'granted') {
                    var notif = new $window.Notification(label);
                    if (duration) {
                        $timeout(function () {
                            notif.close();
                        }, duration * 1000);
                    }
                }
            });
        }
    };
}

angular.module('app.common.services.notification',[])
    .factory('Notif',Notif);