angular.module('controller', [])

.controller('LanguageCtrl', function ($scope, $state) {
	$scope.$on('$ionicView.afterEnter', function () {
		setTimeout(function () {
			document.getElementById("custom-overlay").style.display = "none";
		}, 3000);
	});

	$scope.selectLanguage = function (language) {
		// set language
		$state.go('login');
	}

})

.controller('LoginCtrl', function ($scope, $ionicModal, $ionicPopup, $state) {

	$scope.loginData = {};
	$scope.userData = {};
	$scope.resetData = {};

	var auth = firebase.auth();
	//
	// $ionicModal.fromTemplateUrl('templates/createUser.html', {
	// 	scope: $scope,
	// 	animation: 'slide-in-up'
	// }).then(function (modal) {
	// 	$scope.createModal = modal;
	// });
	//
	// $ionicModal.fromTemplateUrl('templates/forgotPassword.html', {
	// 	scope: $scope,
	// 	animation: 'slide-in-up'
	// }).then(function (modal) {
	// 	$scope.forgotModal = modal;
	// });
	//
	// $scope.createUser = function () {
	// 	$scope.createModal.show();
	// };
	//
	// $scope.back = function () {
	// 	$scope.createModal.hide();
	// 	$scope.forgotModal.hide();
	// };
	//
	// $scope.forgotPassword = function () {
	// 	$scope.forgotModal.show();
	// };

	// $scope.doCreate = function () {
	//
	// 	var alertPopup;
	//
	// 	auth.createUserWithEmailAndPassword($scope.userData.email, $scope.userData.password)
	// 		.then(function (result) {
	// 			alertPopup = $ionicPopup.alert({
	// 				title: 'Create Result',
	// 				template: "Create New User successfully"
	// 			});
	// 			$scope.createModal.hide();
	// 		}).catch(function (error) {
	// 			alertPopup = $ionicPopup.alert({
	// 				title: 'Create Result',
	// 				template: "Cannot Create with error: " + error
	// 			});
	// 		});
	//
	// };
	//
	// $scope.deReset = function () {
	// 	$scope.forgotModal.hide();
	// };

	$scope.userSignin = function () {

		$state.go('tab.map');

		// var alertPopup;
		//
		// auth.signInWithEmailAndPassword($scope.username, $scope.password)
		// 	.then(function (authData) {
		// 		alertPopup = $ionicPopup.alert({
		// 			title: 'Login Result',
		// 			template: "Sigin successfully"
		// 		});
		// 		console.log("Authenticated successfully with payload-", authData);
		// 		$state.go('tab.map');
		// 	}).catch(function (error) {
		// 		alertPopup = $ionicPopup.alert({
		// 			title: 'Login Result',
		// 			template: "Login Failed! " + error
		// 		});
		// 	});

	};

	$scope.facebookSignin = function () {
		var provider = new firebase.auth.FacebookAuthProvider();
		var alertPopup;

		auth.signInWithRedirect(provider);
		auth.getRedirectResult().then(function (result) {
			var token = result.credential.accessToken;
			var user = result.user;
			console.log("Authenticated successfully with payload-", result);
			alertPopup = $ionicPopup.alert({
				title: 'Login Result',
				template: "Sigin successfully"
			});
			$state.go('tab.map');
		}).catch(function (error) {
			alertPopup = $ionicPopup.alert({
				title: 'Login Result',
				template: "Login Failed! " + error
			});
		});
	};

})

.controller('SearchCtrl', function ($scope, $rootScope, AppService, $state) {

	$scope.search = function (type) {

		console.log("Search Control, type: " + type);
		AppService.setType(type);
		$rootScope.$emit("SearchMethod", {});
		$state.go('tab.map');

	}

})

.controller('MapCtrl', function ($scope, $rootScope, AppService, $state) {

	$scope.map;
	$scope.place = {};
	$rootScope.$on("SearchMethod", function () {
		$scope.searchPlace();
	});


	$scope.pos;

	navigator.geolocation.getCurrentPosition(function (position) {
		$scope.pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		console.log("Current Pos: " + $scope.pos);

		var pos = $scope.pos;

		var mapOptions = {
			center: pos,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DEFAULT,
				position: google.maps.ControlPosition.RIGHT_BOTTOM
			}
		};

		var map = new google.maps.Map(document.getElementById("map"), mapOptions);

		map.setCenter(pos);

		var directionsService = new google.maps.DirectionsService;
		var directionsDisplay = new google.maps.DirectionsRenderer;
		directionsDisplay.setMap(map);

		var origin = document.getElementById("origin");
		var destination = document.getElementById("destination");
		var travel = document.getElementById("travel");
		var record = document.getElementById("record");
		var plus = document.getElementById("plus");
		var gps = document.getElementById("gps");
		var compass = document.getElementById("compass");

		map.controls[google.maps.ControlPosition.LEFT_TOP].push(origin);
		map.controls[google.maps.ControlPosition.LEFT_TOP].push(destination);
		map.controls[google.maps.ControlPosition.RIGHT_TOP].push(travel);
		map.controls[google.maps.ControlPosition.LEFT_CENTER].push(record);
		map.controls[google.maps.ControlPosition.LEFT_CENTER].push(plus);
		map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(compass);
		map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(gps);


		var originTextBox = document.getElementById("originTextBox");
		var destinationTextBox = document.getElementById("destinationTextBox");

		var originAutocomplete = new google.maps.places.Autocomplete(originTextBox);
		originAutocomplete.bindTo('bounds', map);

		var destinationAutocomplete = new google.maps.places.Autocomplete(destinationTextBox);
		destinationAutocomplete.bindTo('bounds', map);

		originAutocomplete.addListener('place_changed', function () {

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

		destinationAutocomplete.addListener('place_changed', function () {

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

		function route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay) {
			if (!origin_place_id || !destination_place_id) {
				return;
			}

			directionsService.route({
				origin: {
					'placeId': origin_place_id
				},
				destination: {
					'placeId': destination_place_id
				},
				travelMode: travel_mode
			}, function (response, status) {
				if (status === google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
				} else {
					window.alert('Directions request failed due to ' + status);
				}
			});
		}

		function placeMarkerAndPanTo(latLng, map, marker) {

			map.panTo(latLng);
			marker.setPosition(latLng);
			$rootScope.$apply(function () {
				$scope.place.latitude = latLng.lat();
				$scope.place.longitude = latLng.lng();
			});

		}

	});

	function expandViewportToFitPlace(map, place) {
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}
	}



	$scope.searchPlace = function () {

		$scope.type = AppService.getType();
		console.log("Type: " + $scope.type);
		var placeService = new google.maps.places.PlacesService(map);

		var request = {
			location: pos,
			radius: '1500',
			types: []
		};

		placeService.nearbySearch(request, function (results, status) {
			console.log("Result: " + results)
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					console.log("Result " + i + ":" + results[i])
					var place = results[i];
					var marker = new google.maps.Marker({
						map: map,
						position: place.geometry.location
					});
				}
			}
		});

	};
})

.controller('FavoriteCtrl', function ($scope) {

})

.controller('SettingCtrl', function ($scope, $ionicModal, $ionicPopup, $state) {

	$ionicModal.fromTemplateUrl('templates/sound.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.soundModal = modal;
	});

	$ionicModal.fromTemplateUrl('templates/mapSetting.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.mapModal = modal;
	});

	$ionicModal.fromTemplateUrl('templates/about.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.aboutModal = modal;
	});

	$scope.alertSetting = function () {
		var alertPopup = $ionicPopup.confirm({
			title: 'Login Result',
			templateUrl: "templates/roadAlert.html"
		});
	};

	$scope.soundSetting = function () {
		$scope.soundModal.show();
	};

	$scope.mapSetting = function () {
		$scope.mapModal.show();
	};

	$scope.about = function () {
		$scope.aboutModal.show();
	};

	$scope.signout = function () {
		firebase.auth().signOut().then(function () {
			$state.go('tab.profile');
		}, function (error) {
			// An error happened.
		});
	};

	$scope.back = function () {
		$scope.soundModal.hide();
		$scope.mapModal.hide();
		$scope.aboutModal.hide();
	};

})

.controller('SearchCategoryCtrl', function ($scope) {
	console.log('Category');
})

.controller('SearchHistoryCtrl', function ($scope) {
	console.log('History');
})


.controller('FavoriteMainCtrl', function ($scope) {

})

.controller('FavoriteHistoryCtrl', function ($scope) {

});
