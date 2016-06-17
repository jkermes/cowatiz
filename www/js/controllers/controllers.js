angular.module('starter.controllers', ['firebase', 'ionic-datepicker', 'ngAutocomplete'])
    .controller('LoginCtrl', function ($scope, $localStorage, $state, $ionicPopup, LoginService, Users) {
        $scope.user = {};

        if ($localStorage.user) {
            redirectToTravel();
        }

        function redirectToTravel() {
            $state.go('tab.travel');
        }

        function writeUserData(userId, name, email) {
            firebase.database().ref('users/' + userId).set({
                username: name,
                email: email
            })
        }

        $scope.login = function () {
            LoginService.loginUser($scope.user.email, $scope.user.password).success(function (user) {
                redirectToTravel();
                $localStorage.user = user;

                if (!Users.$getRecord(user.uid)) {
                    writeUserData(user.uid, '', user.email);
                }
            }).error(function (data) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your credentials!'
                });
            });
        }

        $scope.register = function () {
            LoginService.register($scope.user.email, $scope.user.password).success(function (data) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Account created!',
                    template: 'You can now login'
                });
            }).error(function (data) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Register failed!',
                    template: data
                });
            });
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

    .controller('ProfilCtrl', function ($scope, $q, $localStorage, $ionicPlatform, $state, $cordovaCamera,
                                        $cordovaFile, $http, Users, LoginService, Storage) {
        $scope.user = Users.$getRecord($localStorage.user.uid);

        $scope.logout = function () {
            LoginService.logout();
            $localStorage.user = null;
            $state.go('login');
        }

        function loadImage() {
            Storage.getUserImage($localStorage.user.uid).success(function (data) {
                $scope.image = data;
                console.log("data : ", data);
            });
        }

        loadImage();


        $ionicPlatform.ready(function () {
            var options = {
                quality: 50,
                //destinationType: Camera.DestinationType.FILE_URI,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 800,
                targetHeight: 800,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };

            $scope.takeImage = function () {


                /*$cordovaCamera.getPicture(options).then(
                    function (data) {
                        var imageAsBytes = $base64.decode(data);

                        console.log(data);

                        Storage.uploadUserImage($localStorage.user.uid, imageAsBytes).success(function (data) {
                            console.log('Uploaded');
                            //console.log(data);
                        }).error(function (error) {
                            console.log('Error during file upload: ' + error.message);
                        });

                        $window.resolveLocalFileSystemURL(imageURI, function (fileEntry)
                         {
                         fileEntry.file(function (file)
                         {
                         Storage.uploadUserImage($localStorage.user.uid, file)
                         .then( function ()
                         {
                         console.log("Successfully uploaded");
                         })
                         .error(function (err)
                         {
                         console.log("An error occured : ", err);
                         })
                         })
                         },
                         function () { console.log("Erreur...") });
                    }, function (err) {
                        console.log('An error occured while taking picture.')
                    });*/


                $cordovaCamera.getPicture(options).then(function(uri) {
                    console.log(uri);
                    var filename = uri.substring(uri.lastIndexOf('/') + 1);
                    var path = uri.split('/');
                    path.pop();
                    path = path.join('/');
                    
                    console.log(filename);
                    console.log(path);

                    $cordovaFile.readAsArrayBuffer(path, filename).then(function (result) {
                        var file = result;
                        //console.log(result);
                        var arrayBuffer = new Uint8Array(file);

                        var blob = new Blob([arrayBuffer], {type: "application/octet-stream"});

                        Storage.uploadUserImage($localStorage.user.uid, blob).success(function (data) {
                            console.log('Uploaded');
                            loadImage();
                            $state.reload();
                        }).error(function (error) {
                            console.log('Error during file upload: ' + error.message);
                        });
                    });
                }, function(error) {
                    console.error(error);
                });
            }




        });
        

        $scope.settings = {
            enableFriends: false
        };
    });
