'use strict';

function FileService($q,$window,$timeout){
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
        },
        base64toArrayBuffer: function(base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        }
    };
}

angular.module('app.common.services.fileSystem',[])
    .factory('FileService', FileService);