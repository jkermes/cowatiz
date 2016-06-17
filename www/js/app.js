// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'ngStorage', 'starter.controllers', 'starter.services.models', 'starter.services.login', 'starter.services.storage', 'ionic-datepicker', 'ionic-timepicker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  // Login
  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  .state('tab.travel', {
    url: '/travel',
    views: {
      'tab-travel': {
        templateUrl: 'templates/tab-travel.html',
        controller: 'TravelCtrl'
      }
    }
  })
  .state('tab.journeys', {
    url: '/journeys',
    views: {
      'tab-journeys': {
        templateUrl: 'templates/tab-journeys.html',
        controller: 'JourneysCtrl'
      }
    }
  })
  .state('tab.journey-detail', {
    url: '/journeys/:journeyId',
    views: {
      'tab-journeys': {
        templateUrl: 'templates/journey-detail.html',
        controller: 'JourneyDetailCtrl'
      }
    }
  })
  .state('tab.journey-add', {
    url: '/addJourney',
    views: {
      'tab-journeys': {
        templateUrl: 'templates/journey-add.html',
        controller: 'AddJourneyCtrl'
      }
    }
  })
  .state('tab.profil', {
    url: '/profil',
    views: {
      'tab-profil': {
        templateUrl: 'templates/tab-profil.html',
        controller: 'ProfilCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('login');
})

  .config(function (ionicDatePickerProvider) {

    var currentDate = new Date();

    var datePickerObj = {
      setLabel: 'Ok',
      todayLabel: "Auj.",
      closeLabel: '×',
      mondayFirst: true,
      weeksList: ["D", "L", "Ma", "Me", "J", "V", "S"],
      monthsList: ["Janv.", "Fév.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."],
      templateType: 'popup',
      from: currentDate,
      to: new Date(currentDate.getFullYear() + 2, currentDate.getMonth(), currentDate.getDate()),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })

  .config(function (ionicTimePickerProvider) {
    var timePickerObj = {
      inputTime: (new Date()).getHours() * 60 * 60,
      format: 24,
      setLabel: 'Ok',
      closeLabel: '×'
    };
    ionicTimePickerProvider.configTimePicker(timePickerObj);
  });

