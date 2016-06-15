angular.module('starter.services.models', ['firebase'])
.factory('Journeys', function ($firebaseArray) {
    var database = firebase.database();
    var ref = firebase.database().ref().child('journeys');

    return $firebaseArray(ref);
})
.factory('Test', function ($firebaseArray) {
    var database = firebase.database();
    var ref = firebase.database().ref().child('journeys');

    return {
        byCities: function(fromCity, toCity) {
            var results = new Array();
            ref.orderByChild("fromCity").startAt(fromCity).on("child_added", function(snapshot) {
                if (snapshot.val().toCity.toString().toLowerCase().substr(0, toCity.length) === toCity.toLowerCase()) {
                     results.push(snapshot.val());
                }
            });

            return results;
        },
        get: function() {
            return $firebaseArray(ref);
        }
    };
})
.factory('Users', function ($firebaseArray) {
    var database = firebase.database();
    var ref = firebase.database().ref().child('users');

    return $firebaseArray(ref);
});