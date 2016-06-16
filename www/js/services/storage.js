angular.module('starter.services.storage', ['firebase'])
.factory('Storage', function($q) {
	var storage = firebase.storage();
	var storageRef = storage.ref();

	var deferred = $q.defer();
	var promise = deferred.promise;

	var imagesRef = storageRef.child('images/users');

	return {
		getUserImage: function(uid) {

			var userImageRef = imagesRef.child(uid + ".jpg");

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
		},

		uploadUserImage: function (uid, file) {
			var uploadTask = imagesRef.child(uid + ".jpg").put(file);

			uploadTask.on('state_changed', function(snapshot){

			}, function(error) {
				deferred.reject(error);
			}, function() {
				var downloadURL = uploadTask.snapshot.downloadURL;

				deferred.resolve(downloadURL);
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