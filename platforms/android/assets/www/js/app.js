angular.module('spotlight', ['ionic', 'firebase', 'controller', 'service'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom');

  var config = {
    apiKey: "AIzaSyCyNSzp_bfCDJARRRLuEVxBUsp569bvyXc",
    authDomain: "tourism-authority-of-thailand.firebaseapp.com",
    databaseURL: "https://tourism-authority-of-thailand.firebaseio.com",
    storageBucket: "tourism-authority-of-thailand.appspot.com"
  };
  firebase.initializeApp(config);

  $stateProvider
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.profile', {
    url: '/profile',
    views: {
      'profile': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('tab.map', {
    url: '/map',
    views: {
      'map': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('tab.search', {
    url: '/search',
    views: {
      'search': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('tab.favorite', {
    url: '/favorite',
    views: {
      'favorite': {
        templateUrl: 'templates/favorite.html',
        controller: 'FavoriteCtrl'
      }
    }
  })

  .state('tab.setting', {
    url: '/setting',
    views: {
      'setting': {
        templateUrl: 'templates/setting.html',
        controller: 'SettingCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise("/tab/profile");

});