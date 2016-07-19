angular.module('controller', [])

.controller('ProfileCtrl', function($scope, $ionicModal, $ionicPopup, $state) {
	
$scope.$on('$ionicView.afterEnter', function(){
    setTimeout(function(){
      document.getElementById("custom-overlay").style.display = "none";      
    }, 3000);
  });  

	$scope.loginData = {};
	$scope.userData = {};
	$scope.resetData = {};

	var auth = firebase.auth();

	$ionicModal.fromTemplateUrl('templates/createUser.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.createModal = modal;
	});

	$ionicModal.fromTemplateUrl('templates/forgotPassword.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.forgotModal = modal;
	});

	$scope.createUser = function() {
		$scope.createModal.show();
	};

	$scope.back = function() {
		$scope.createModal.hide();
		$scope.forgotModal.hide();
	};

	$scope.forgotPassword = function() {
		$scope.forgotModal.show();
	};

	$scope.doCreate = function() {
		
		var alertPopup;

		auth.createUserWithEmailAndPassword($scope.userData.email, $scope.userData.password)
		.then(function (result) {
			alertPopup = $ionicPopup.alert({
				title: 'Create Result',
				template: "Create New User successfully"
			});
			$scope.createModal.hide();
		}).catch(function(error) {
			alertPopup = $ionicPopup.alert({
				title: 'Create Result',
				template: "Cannot Create with error: " + error
			});
		});

	};

	$scope.deReset = function() {
		$scope.forgotModal.hide();
	};

	$scope.userSignin = function() {

		var alertPopup;

		auth.signInWithEmailAndPassword($scope.loginData.user, $scope.loginData.password)
		.then(function (authData) {
			alertPopup = $ionicPopup.alert({
				title: 'Login Result',
				template: "Sigin successfully"
			});
			console.log("Authenticated successfully with payload-", authData);
			$state.go('tab.map');
		}).catch(function (error) {
			alertPopup = $ionicPopup.alert({
				title: 'Login Result',
				template: "Login Failed! " + error
			});
		});

	};

	$scope.facebookSignin = function() {
		var provider = new firebase.auth.FacebookAuthProvider();
		provider.addScope('user_birthday');
		var alertPopup;

		auth.signInWithRedirect(provider);
		auth.getRedirectResult().then(function(result) {
			var token = result.credential.accessToken;
			var user = result.user;
			console.log("Authenticated successfully with payload-", result);
			alertPopup = $ionicPopup.alert({
				title: 'Login Result',
				template: "Sigin successfully"
			});
			$state.go('tab.map');
		}).catch(function(error) {
			alertPopup = $ionicPopup.alert({
				title: 'Login Result',
				template: "Login Failed! " + error
			});
		});
	};

})

.controller('SearchCtrl', function($scope) {

})

.controller('MapCtrl', function($scope) {

	$scope.map;
	$scope.place = {};

	var pos;

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
		});
	};

	var mapOptions = {
		center: {lat: 44.540, lng: -78.546},
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
	var marker = new google.maps.Marker({
		position: {lat: 44.540, lng: -78.546},
		map: map,
		title: 'You are here.'
	});

	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);

    var origin = document.getElementById("origin");
    var destination = document.getElementById("destination");

	

	var originAutocomplete = new google.maps.places.Autocomplete(origin);
	originAutocomplete.bindTo('bounds', map);

	var destinationAutocomplete = new google.maps.places.Autocomplete(destination);
	destinationAutocomplete.bindTo('bounds', map);

	originAutocomplete.addListener('place_changed', function() {
		
		var place = originAutocomplete.getPlace();
		if (!place.geometry) {
			window.alert("Autocomplete's returned place contains no geometry");
			return;
		}
		expandViewportToFitPlace(map, place);

		// If the place has a geometry, store its place ID and route if we have
		// the other place ID
		origin_place_id = place.place_id;
		route(origin_place_id, destination_place_id, google.maps.TravelMode.DRIVING, directionsService, directionsDisplay);
	});

	destinationAutocomplete.addListener('place_changed', function() {
		
		var place = destinationAutocomplete.getPlace();
		if (!place.geometry) {
			window.alert("Autocomplete's returned place contains no geometry");
			return;
		}
		expandViewportToFitPlace(map, place);

		// If the place has a geometry, store its place ID and route if we have
		// the other place ID
		destination_place_id = place.place_id;
		route(origin_place_id, destination_place_id, google.maps.TravelMode.DRIVING, directionsService, directionsDisplay);
	});

	function expandViewportToFitPlace(map, place) {
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}
	}

	function route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay) {
		if (!origin_place_id || !destination_place_id) {
			return;
		}
		
		directionsService.route({
			origin: {'placeId': origin_place_id},
			destination: {'placeId': destination_place_id},
			travelMode: travel_mode
		}, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	}

	$scope.map = map;

})

.controller('FavoriteCtrl', function($scope) {



})



.controller('FavoriteMainCtrl', function($scope) {



})

.controller('FavoriteHistoryCtrl', function($scope) {



})

.controller('SearchMainCtrl', function($scope) {



})

.controller('SearchHistoryCtrl', function($scope) {



})

.controller('SettingCtrl', function($scope, $ionicModal, $ionicPopup, $state) {

	$ionicModal.fromTemplateUrl('templates/sound.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.soundModal = modal;
	});

	$ionicModal.fromTemplateUrl('templates/mapSetting.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.mapModal = modal;
	});

	$ionicModal.fromTemplateUrl('templates/about.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.aboutModal = modal;
	});

	$scope.alertSetting = function() {
		var alertPopup = $ionicPopup.confirm({
			title: 'Login Result',
			templateUrl: "templates/roadAlert.html"
		});
	};

	$scope.soundSetting = function() {
		$scope.soundModal.show();
	};

	$scope.mapSetting = function() {
		$scope.mapModal.show();
	};

	$scope.about = function() {
		$scope.aboutModal.show();
	};

	$scope.signout =function() {
		firebase.auth().signOut().then(function() {
			$state.go('tab.profile');
		}, function(error) {
			// An error happened.
		});
	};

	$scope.back = function() {
		$scope.soundModal.hide();
		$scope.mapModal.hide();
		$scope.aboutModal.hide();
	};

});
