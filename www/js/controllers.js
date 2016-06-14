angular.module('starter.controllers', ['firebase'])
.controller('LoginCtrl', function ($scope) {

})
.controller('TravelCtrl', function ($scope, Auth) {
    $scope.auth = Auth;

    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    });

    $scope.signIn = function() {
      $scope.firebaseUser = null;
      $scope.error = null;

      $scope.auth.$signInAnonymously().then(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
      }).catch(function(error) {
        $scope.error = error;
      });
    };

    if (!$scope.firebaseUser) {
        $scope.signIn();
    }
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
.controller('AddJourneyCtrl', function ($scope, $stateParams, Journeys) {
    $scope.journey = [];
})
.controller('AccountCtrl', function ($scope, Users, Auth) {
    $scope.users = Users;
    $scope.auth = Auth;

    $scope.users.$add({
        key: $scope.auth.user,
        name: ''
    });

    $scope.settings = {
        enableFriends: false
    };
});
