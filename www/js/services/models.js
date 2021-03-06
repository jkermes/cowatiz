angular.module('starter.services.models', ['firebase'])
    .factory('Journeys', function ($firebaseArray) {
        var database = firebase.database();
        var ref = firebase.database().ref().child('journeys');

        return $firebaseArray(ref);
    })
    .factory('Users', function ($firebaseArray) {
        var database = firebase.database();
        var ref = firebase.database().ref().child('users');

        return $firebaseArray(ref);
    })
    .factory('AddUser', function ($firebaseArray) {
        var database = firebase.database();
        var ref = firebase.database().ref().child('users');

        return {
            add: function (uid, user) {
                var userRef = ref.child(uid);

                userRef.set(user);
            }
        }
    });