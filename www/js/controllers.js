angular.module('starter.controllers', ['firebase'])
    .controller('TravelCtrl', function ($scope) {
    })
    .controller("JourneysCtrl", function ($scope, $firebaseArray, Journeys) {
        $scope.journeys = Journeys;

        $scope.addJourney = function () {
            var name = prompt("Where do you need to go ?");
            if (name) {
                $scope.journeys.$add({
                        name: name,
                        lastText: 'You on your way?',
                        date: Date()
                });
            }
        };
    })
    .controller('JourneyDetailCtrl', function ($scope, $stateParams, Journeys) {
        $scope.journey = Journeys.$getRecord($stateParams.journeyId);
    })
    .controller('AccountCtrl', function ($scope) {
        $scope.settings = {
            enableFriends: false
        };
    });
