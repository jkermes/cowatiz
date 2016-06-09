angular.module('starter.services', ['firebase'])
    .factory('Journeys', function ($firebaseArray) {
        var database = firebase.database();
        var ref = firebase.database().ref().child('journeys');

        return $firebaseArray(ref);
    });
