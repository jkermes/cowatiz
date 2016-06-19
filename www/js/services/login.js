angular.module('starter.services.login', ['firebase'])
.service('LoginService', function($firebaseAuth, Promise) {
	var auth = $firebaseAuth();

	return {
		register: function(name, pw) {
			var deferred = Promise.getNewPromise();

			auth.$createUserWithEmailAndPassword(name, pw).then(function(firebaseUser) {
				deferred.resolve("User " + firebaseUser.email + " created successfully!");
			}).catch(function(error) {
				deferred.reject(error.message);
			});

			return deferred.promise;
		},
		loginUser: function(name, pw) {
			var deferred = Promise.getNewPromise();

			auth.$signInWithEmailAndPassword(name, pw).then(function(firebaseUser) {
				var user = {
					uid: firebaseUser.uid,
					email: firebaseUser.email
				}

				deferred.resolve(user);
			}).catch(function(error) {
				deferred.reject('Wrong credentials');
			});

			return deferred.promise;
		},
		logout: function() {
			auth.$signOut();
		}
	}
});