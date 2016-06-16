angular.module('starter.services.login', ['firebase'])
.service('LoginService', function($firebaseAuth, $q) {
	return {
		loginUser: function(name, pw) {
			var auth = $firebaseAuth();
			var deferred = $q.defer();
			var promise = deferred.promise;

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
		}
	}
});