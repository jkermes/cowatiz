angular.module('starter.services.storage', ['firebase'])
.factory('Storage', function() {
	var storage = firebase.storage();

	return {
		test: function() {
			return 'storage service test';
		}
	}
});