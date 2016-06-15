
angular.module('starter.controllers', ['firebase', 'ionic-datepicker', 'ngAutocomplete'])
.controller('LoginCtrl', function ($scope) {

})
.controller('TravelCtrl', function ($scope, Auth, $localStorage, Users, ionicDatePicker, ionicTimePicker) {

    $scope.disableTap = function(){
        container = document.getElementsByClassName('pac-container');
        // disable ionic data tab
        angular.element(container).attr('data-tap-disabled', 'true');
        // leave input field if google-address-entry is selected
        angular.element(container).on("click", function(){
            document.getElementById('searchBar').blur();
        });
    };

    $scope.auth = Auth;

    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
  });

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
};

$scope.signIn = function() {
  $scope.firebaseUser = null;
  $scope.error = null;

  $scope.auth.$signInWithEmailAndPassword("jukedroid@gmail.com", "plopplop").then(function(firebaseUser) {
    $localStorage.user = {
        uid: firebaseUser.uid,
        email: firebaseUser.email
    };

    if (!Users.$getRecord(firebaseUser.uid)) {
        writeUserData(firebaseUser.uid, '', firebaseUser.email);
    }
}).catch(function(error) {
  console.error("Authentication failed:", error);
});

var dpOptions = {
    callback: function (val) {
        var date = new Date(val);
        $scope.startDate = date;
        $scope.startDateString =
        ("0"+(date.getDate())).slice(-2)
        +"/"+("0"+(date.getMonth()+1)).slice(-2)
        +"/"+date.getFullYear();
    }
}

var tpOptions = {
    callback: function (val) {
        var date = new Date(val * 1000);
        $scope.startTime = date;
        $scope.startTimeString =
        ("0"+date.getUTCHours()).slice(-2)+":"
        +("0"+date.getUTCMinutes()).slice(-2);
    }
}

$scope.openDatePicker = function () {
    ionicDatePicker.openDatePicker(dpOptions);
}

$scope.openTimePicker = function () {
    ionicTimePicker.openTimePicker(tpOptions);
}
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

.controller('ProfilCtrl', function ($scope, $localStorage, Users) {    
    $scope.user = Users.$getRecord("PoZjT54RAMNft1Bgsn7fAx0ggHG3");

    console.log($localStorage.user.uid);

    $scope.settings = {
        enableFriends: false
    };
})

.controller('PreferencesCtrl', function ($scope, $localStorage, Users) {    
    $scope.user = Users.$getRecord(window.localStorage['user'].uid);

    console.log($localStorage.user.uid);

    $scope.settings = {
        enableFriends: false
    };
});
