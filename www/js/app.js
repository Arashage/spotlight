angular.module('spotlight', ['ionic', 'firebase', 'controller', 'service'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {

      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom');

  var config = {
    apiKey: 'AIzaSyCyNSzp_bfCDJARRRLuEVxBUsp569bvyXc',
    authDomain: 'tourism-authority-of-thailand.firebaseapp.com',
    databaseURL: 'https://tourism-authority-of-thailand.firebaseio.com',
    storageBucket: 'tourism-authority-of-thailand.appspot.com'
  };

  firebase.initializeApp(config);

  $stateProvider
    .state('language', {
      url: '/language',
      templateUrl: 'templates/language.html',
      controller: 'LanguageCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('tab', {
      url: '/tab',
      abtract: true,
      templateUrl: 'templates/tabs.html'
    })
    .state('tab.search', {
      url: '/search',
      views: {
        'search': {
          templateUrl: 'templates/search/search.html',
          controller: 'SearchCtrl'
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
    .state('tab.favorite', {
      url: '/favorite',
      views: {
        'favorite': {
          templateUrl: 'templates/favorite/favorite.html',
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
    })
    .state('tab.search.category', {
      url: '/category',
      views: {
        'search-category': {
          templateUrl: 'templates/search/search-category.html',
          controller: 'SearchCategoryCtrl'
        }
      }
    })
    .state('tab.search.history', {
      url: '/history',
      views: {
        'search-history': {
          templateUrl: 'templates/search/search-history.html',
          controller: 'SearchHistoryCtrl'
        }
      }
    })
    .state('tab.favorite.main', {
      url: '/main',
      views: {
        'favorite-main': {
          templateUrl: 'templates/favorite/favorite-main.html',
          controller: 'FavoriteMainCtrl'
        }
      }
    })
    .state('tab.favorite.history', {
      url: '/history',
      views: {
        'favorite-history': {
          templateUrl: 'templates/favorite/favorite-history.html',
          controller: 'FavoriteHistoryCtrl'
        }
      }
    });

    $urlRouterProvider.otherwise("/language");

});
