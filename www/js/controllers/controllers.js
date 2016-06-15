
angular.module('starter.controllers', ['firebase', 'ionic-datepicker', 'ngAutocomplete'])
.controller('LoginCtrl', function ($scope) {

})
.controller('TravelCtrl', function ($scope, Auth, $localStorage, Users, ionicDatePicker) {
    $scope.auth = Auth;

    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
    });

    function writeUserData(userId, name, email) {

    var dpOptions = {
        callback: function (val) {
            var date = new Date(val);
            $scope.startDate = date;
            $scope.startDateString = ("0"+(date.getDate())).slice(-2)
                +"/"+("0"+(date.getMonth()+1)).slice(-2)
                +"/"+date.getFullYear();
        }
    }

    $scope.openDatePicker = function () {
        ionicDatePicker.openDatePicker(dpOptions);
    }

    $scope.result = {};
    $scope.options = {
      country: 'fr',
      types: '(cities)'
    };    
   
   $scope.loadResults = function() {
        if ($scope.result.fromCity && $scope.result.toCity) {
            console.log('from: ' + $scope.result.fromCity);
            console.log('from: ' + $scope.result.toCity);
        }
   }
}

    $scope.signIn = function() {
      $scope.firebaseUser = null;
      $scope.error = null;

      $scope.auth.$signInWithEmailAndPassword("jukedroid@gmail.com", "plopplop").then(function(firebaseUser) {
        window.localStorage['user'] = {
            uid: firebaseUser.uid,
            email: firebaseUser.email
        };

        if (!Users.$getRecord(firebaseUser.uid)) {
            writeUserData(firebaseUser.uid, '', firebaseUser.email);
        }
    }).catch(function(error) {
      console.error("Authentication failed:", error);
  });
};

if (!$scope.firebaseUser) {
    $scope.signIn();    
}
})
.controller("JourneysCtrl", function ($scope, $firebaseArray, $localStorage, Journeys) {
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
.controller('AccountCtrl', function ($scope, $localStorage, Users) {    
    $scope.user = Users.$getRecord(window.localStorage['user'].uid);

    console.log($localStorage.user.uid);

    $scope.settings = {
        enableFriends: false
    };
});
