angular.module('controller', [])

.controller('ProfileCtrl', function($scope, $ionicModal, $ionicPopup, $state) {
	
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
			$state.go('map');
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
			$state.go('map');
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

	var mapOptions = {
		center: {lat: 44.540, lng: -78.546},
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
	var infoWindow = new google.maps.InfoWindow({map: map});
	var marker = new google.maps.Marker({
		position: {lat: 44.540, lng: -78.546},
		map: map,
		title: 'You are here.'
	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			infoWindow.setPosition(pos);
			marker.setPosition(pos);
			map.setCenter(pos);
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	};


	function handleLocationError(browserHasGeolocation, infoWindow, pos) {
		infoWindow.setPosition(pos);
		infoWindow.setContent(browserHasGeolocation ?
			'Error: The Geolocation service failed.' :
			'Error: Your browser doesn\'t support geolocation.');
	};

	var start = $scope.place.start;
	console.log("start: " + start);

	var autocomplete = new google.maps.places.Autocomplete(document.getElementById("map"));
	autocomplete.bindTo('bounds', map);

	autocomplete.addListener('place_changed', function() {

		console.log("start: " + $scope.place.start);
		infoWindow.close();
		marker.setVisible(false);
		var place = autocomplete.getPlace();

		console.log("AutoCOmple Place: " + place);
		
		if (!place.geometry) {
			window.alert("Autocomplete's returned place contains no geometry");
			return;
		}

		// If the place has a geometry, then present it on a map.
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);  // Why 17? Because it looks good.
		}

		marker.setIcon(/** @type {google.maps.Icon} */({
			url: place.icon,
			size: new google.maps.Size(71, 71),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(35, 35)
		}));

		marker.setPosition(place.geometry.location);
		marker.setVisible(true);

		var address = '';
		if (place.address_components) {
			address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
			].join(' ');
		}

		infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
		infoWindow.open(map, marker);

	});

	$scope.map = map;

})

.controller('FavoriteCtrl', function($scope) {

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
			$state.go('profile');
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
