'use strict';

function Toast(ngToast){
    return {
        info: function(label){
            ngToast.create({
                'content': label,
                'class' : 'alert-info'
            });
        },
        error: function(label){
            ngToast.create({
                'content': label,
                'class' : 'alert-error'
            });
        }
    };
}

angular.module('app.common.services.toast',[
    'ngToast'
])
    .factory('Toast',Toast);