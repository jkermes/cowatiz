angular.module('starter.controllers', ['firebase', 'ionic-datepicker', 'ngAutocomplete'])
    .controller('LoginCtrl', function ($scope, $state, $ionicPopup, User) {
        $scope.user = {};

        if (User.isUserLoggedIn()) {
            redirectToTravel();
        }

        function redirectToTravel() {
            $state.go('tab.travel');
        }

        $scope.login = function () {
            if (!$scope.user.email || !$scope.user.password) {
                $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please fill the email and password fields.'
                });
                return;
            }

            User
                .login($scope.user.email, $scope.user.password)
                .success(
                    function () {
                        redirectToTravel();
                    }
                ).error(
                    function (error) {
                        $ionicPopup.alert({
                            title: 'Login failed!',
                            template: error.message
                        }
                 );
            });
        }

        $scope.register = function () {
            if (!$scope.user.email || !$scope.user.password) {
                $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please fill the email and password fields.'
                });
                return;
            }

            User
                .register($scope.user.email, $scope.user.password)
                .success(
                    function () {
                        $ionicPopup.alert({
                            title: 'Account created!',
                            template: 'You can now login'
                        });
                    }
                ).error(
                    function (data) {
                        $ionicPopup.alert({
                            title: 'Registration failed!',
                            template: data
                        });
                    }
                );
        }
    })
    .controller('TravelCtrl', function ($scope, $filter, $localStorage, Users, ionicDatePicker, ionicTimePicker) {

        $scope.disableTap = function () {
            var container = document.getElementsByClassName('pac-container');
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
                $scope.startDateString = $filter('date')(date, 'dd/MM/yyyy', '+000');
            }
        };

        var tpOptions = {
            callback: function (val) {
                var date = new Date(val * 1000);
                console.log(date);
                $scope.startTime = date;
                $scope.startTimeString = $filter('date')(date, 'HH:mm', '+000')
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

    .controller('ProfilCtrl', function ($scope, $filter, $ionicPlatform, $state, User, Camera, ionicDatePicker) {

        if (!User.isUserLoggedIn()) {
            $state.go('login');
        }

        var currentDate = new Date();
        var dpOptions = {
            callback: function (val) {
                var date = new Date(val);
                date.setDate(date.getDate() + 1);
                $scope.userInfos.born = $filter('date')(date, 'dd/MM/yyyy', '+000');
            },
            from: new Date(currentDate.getFullYear() - 100, currentDate.getMonth(), currentDate.getDate()),
            to: new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate()),
            inputDate: new Date(currentDate.getFullYear() - 19, currentDate.getMonth(), currentDate.getDate())
        };

        $scope.user = User.getUser();

        $scope.logout = function () {
            User.logout();
            $state.go('login');
        }

        User.getUserInfos().$bindTo($scope, "userInfos");

        $scope.setBorn = function () {
            ionicDatePicker.openDatePicker(dpOptions);
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
