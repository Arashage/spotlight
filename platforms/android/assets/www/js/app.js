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

.config(function($stateProvider, $urlRouterProvider) {

  var config = {
    apiKey: "AIzaSyCyNSzp_bfCDJARRRLuEVxBUsp569bvyXc",
    authDomain: "tourism-authority-of-thailand.firebaseapp.com",
    databaseURL: "https://tourism-authority-of-thailand.firebaseio.com",
    storageBucket: "tourism-authority-of-thailand.appspot.com"
  };
  firebase.initializeApp(config);

  $stateProvider
  .state('profile', {
    url: '/',
    templateUrl: 'templates/profile.html',
    controller: 'ProfileCtrl'
  })

  .state('map', {
    url: '/',
    templateUrl: 'templates/map.html',
    controller: 'MapCtrl'
/*  })

  .state('search', {
    url: '/',
    templateUrl: 'templates/search.html',
    controller: 'SearchCtrl'
  })

  .state('favorite', {
    url: '/',
    templateUrl: 'templates/favorite.html',
    controller: 'FavoriteCtrl'
  })

  .state('setting', {
    url: '/',
    templateUrl: 'templates/setting.html',
    controller: 'SettingCtrl'*/
  });

  $urlRouterProvider.otherwise("/");

});