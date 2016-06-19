angular.module('starter.controllers', ['firebase', 'ionic-datepicker', 'ngAutocomplete'])
    .controller('LoginCtrl', function ($scope, $localStorage, $state, $ionicPopup, LoginService, Users, User) {
        $scope.user = {};

        if (User.isUserLoggedIn()) {
            redirectToTravel();
        }

        function redirectToTravel() {
            $state.go('tab.travel');
        }

        $scope.login = function () {
            User
                .login($scope.user.email, $scope.user.password)
                .success(
                    function (user) {
                        redirectToTravel();
                    }
                ).error(
                    function (data) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login failed!',
                            template: 'Please check your credentials!'
                        }
                 );
            });
        }

        $scope.register = function () {
            User
                .register($scope.user.email, $scope.user.password)
                .success(
                    function () {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Account created!',
                            template: 'You can now login'
                        });
                    }
                ).error(
                    function (data) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Register failed!',
                            template: data
                        });
                    }
                );
        }
    })
    .controller('TravelCtrl', function ($scope, $localStorage, Users, ionicDatePicker, ionicTimePicker) {

        $scope.disableTap = function () {
            container = document.getElementsByClassName('pac-container');
            // disable ionic data tab
            angular.element(container).attr('data-tap-disabled', 'true');
            // leave input field if google-address-entry is selected
            angular.element(container).on("click", function () {
                document.getElementById('searchBar').blur();
            });
        };

        $scope.result = {};
        $scope.options = {
            country: 'fr',
            types: '(cities)'
        };

        $scope.loadResults = function () {
            if ($scope.result.fromCity && $scope.result.toCity) {
                console.log('from: ' + $scope.result.fromCity);
                console.log('from: ' + $scope.result.toCity);
            }
        };

        var dpOptions = {
            callback: function (val) {
                var date = new Date(val);
                $scope.startDate = date;
                $scope.startDateString =
                    ("0" + (date.getDate())).slice(-2)
                    + "/" + ("0" + (date.getMonth() + 1)).slice(-2)
                    + "/" + date.getFullYear();
            }
        };

        var tpOptions = {
            callback: function (val) {
                var date = new Date(val * 1000);
                $scope.startTime = date;
                $scope.startTimeString =
                    ("0" + date.getUTCHours()).slice(-2) + ":"
                    + ("0" + date.getUTCMinutes()).slice(-2);
            }
        };

        $scope.openDatePicker = function () {
            ionicDatePicker.openDatePicker(dpOptions);
        };

        $scope.openTimePicker = function () {
            ionicTimePicker.openTimePicker(tpOptions);
        };
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

    .controller('ProfilCtrl', function ($scope, $ionicPlatform, $state, User, Camera) {

        if (!User.isUserLoggedIn()) {
            $state.go('login');
        }

        $scope.user = User.getUser();

        $scope.logout = function () {
            User.logout();
            $state.go('login');
        }

        function loadImage() {
            User
                .getUserImageUrl()
                .success(
                    function (data) {
                        $scope.image = data;
                    }
                );
        }

        loadImage();


        $ionicPlatform.ready(function () {

            $scope.takeImage = function () {

                Camera.getPictureAsBlob()
                    .success(
                        function (imageBlob) {
                            User.uploadUserImage(imageBlob)
                                .success(
                                    function () {
                                        loadImage();
                                    }
                                ).error(
                                    function (error) {
                                        console.log('Error during file upload : ' + error.message);
                                    }
                                );
                        }
                )
            }
        });

        $scope.settings = {
            enableFriends: false
        };
    });
