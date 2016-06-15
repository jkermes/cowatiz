angular.module('starter.services.auth', ['firebase'])
.factory('Auth', function ($firebaseAuth) {
	return $firebaseAuth();
});