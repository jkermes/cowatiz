angular.module('starter.services.login', ['firebase'])
.service('LoginService', function($firebaseAuth, $q) {
	var auth = $firebaseAuth();
	var deferred = $q.defer();
	var promise = deferred.promise;

	return {
		register: function(name, pw) {
			auth.$createUserWithEmailAndPassword(name, pw).then(function(firebaseUser) {
				deferred.resolve("User " + firebaseUser.email + " created successfully!");
			}).catch(function(error) {
				deferred.reject('Sorry, an error occured');
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
		loginUser: function(name, pw) {
			auth.$signInWithEmailAndPassword(name, pw).then(function(firebaseUser) {
				var user = {
					uid: firebaseUser.uid,
					email: firebaseUser.email
				}

				deferred.resolve(user);
			}).catch(function(error) {
				deferred.reject('Wrong credentials');
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
		logout: function() {
			auth.$signOut();
		}
	}
});