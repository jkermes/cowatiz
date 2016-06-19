angular.module('starter.services.storage', ['firebase'])
.factory('Storage', function($q, Promise) {
	var storage = firebase.storage();
	var storageRef = storage.ref();

	var imagesRef = storageRef.child('images/users');

	return {

		uploadFile: function (path, fileName, blob) {
			var deferred = Promise.getNewPromise();

			var uploadTask = storageRef
				.child(path)
				.child(fileName)
				.put(blob);

			uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
				function(snapshot) {

					var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log('Upload is ' + progress + '% done');

			}, 	function(error) {

					deferred.reject(error);

			}, function() {

					deferred.resolve(uploadTask.snapshot.downloadURL);

			});

			return deferred.promise;
		},

		getDownloadUrl: function (path, fileName) {
			var deferred = Promise.getNewPromise();

			storageRef
				.child(path)
				.child(fileName)
				.getDownloadURL()
				.then(
					function (url) {
						deferred.resolve(url);
					}
				).catch(
					function (error) {
						deferred.reject(error);
					}
				);

			return deferred.promise;
		},

		deleteFile: function (path, fileName) {
			var deferred = Promise.getNewPromise();

			storageRef
				.child(path)
				.child(fileName)
				.delete()
				.then(
					function () {
						deferred.resolve();
					}
				).catch(function (error) {
						deferred.reject(error);
					}
				);

			return deferred.promise;
		}
	}
});