angular.module('starter.services.storage', ['firebase'])
.factory('Storage', function($q) {
	var storage = firebase.storage();
	var storageRef = storage.ref();

	var deferred = $q.defer();
	var promise = deferred.promise;

	return {
		getUserImage: function() {
			var imagesRef = storageRef.child('images/users');
			var userImageRef = imagesRef.child('adam.jpg');

			userImageRef.getDownloadURL().then(function(url) {
				deferred.resolve(url);
			}).catch(function(error) {
  				deferred.reject('An error occured during download url request');
			});

			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			}
			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			}

			return promise;
		}
	}
});