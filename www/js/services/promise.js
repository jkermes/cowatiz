angular.module('starter.services.promise', [])
    .factory('Promise', function($q) {

        return {

            getNewPromise : function () {

                var deferred = $q.defer();
                var promise = deferred.promise;

                promise.success = function(fn) {
                    promise.then(fn);
                    return promise;
                }

                promise.error = function(fn) {
                    promise.then(null, fn);
                    return promise;
                }

                return deferred;
            }
        }
    });