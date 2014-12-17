'use strict';

function FileService($q,$window,$http){
    return {
        urlToBlob: function(url){
            var deferred = $q.defer();
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function(e) {
                if (this.status === 200 || this.status === 0 ) {
                    deferred.resolve(this.response);
                }
            };
            xhr.onerror = function(err){
              deferred.reject(err);
            };
            xhr.send();

            return deferred.promise;
        },
        blobToBase64: function(blob){
            var deferred = $q.defer();
            var reader = new $window.FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function() {
                deferred.resolve(reader.result);
            };
            reader.onerror = function(err){
                deferred.reject(err);
            };
            return deferred.promise;
        }
    };
}

angular.module('app.common.services.fileSystem',[])
    .factory('FileService', FileService);