angular.module('starter.services.storage', ['firebase'])
.factory('Storage', function($q, Promise) {
	var storage = firebase.storage();
	var storageRef = storage.ref();

	var imagesRef = storageRef.child('images/users');

	return {
		getUserImage: function(uid) {

			var deferred = Promise.getNewPromise();

			var userImageRef = imagesRef.child(uid + ".jpg");

			userImageRef.getDownloadURL().then(function(url) {
				deferred.resolve(url);
			}).catch(function(error) {
  				deferred.reject('An error occured during download url request');
			});

			return deferred.promise;
		},

		uploadUserImage: function (uid, file) {
			var deferred = Promise.getNewPromise();

			var uploadTask = imagesRef.child(uid + ".jpg").put(file);

			uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot){
				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log('Upload is ' + progress + '% done');

			}, function(error) {
				deferred.reject(error);
			}, function() {
				var downloadURL = uploadTask.snapshot.downloadURL;

				deferred.resolve(downloadURL);
			});

			return deferred.promise;
		}
	}
});