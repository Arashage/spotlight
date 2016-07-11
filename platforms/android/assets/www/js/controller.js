angular.module('controller', [])

.controller('ProfileCtrl', function($scope, $ionicModal, $state) {
	
	$scope.loginData = {};
	$scope.userData = {};
	$scope.resetData = {};

	var auth = firebase.auth();

	$ionicModal.fromTemplateUrl('templates/createUser.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.createModal = modal;
	});

	$ionicModal.fromTemplateUrl('templates/forgotPassword.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.forgotModal = modal;
	});

	$scope.createUser = function() {
		$scope.createModal.show();
	};

	$scope.closeCreate = function() {
		$scope.createModal.hide();
	};

	$scope.forgotPassword = function() {
		$scope.forgotModal.show();
	};

	$scope.closeForgot = function() {
		$scope.forgotModal.hide();
	};

	$scope.doCreate = function() {
		auth.createUserWithEmailAndPassword($scope.userData.email, $scope.userData.password)
		.then(function (result) {
			console.log("Create success");
			$scope.createModal.hide();
		}).catch(function(error) {
			console.log("Cannot Create with error: " + error);
		});
	};

	$scope.deReset = function() {

	};

	$scope.userSignin = function() {
		auth.signInWithEmailAndPassword($scope.loginData.user, $scope.loginData.password)
		.then(function (authData) {
			console.log("Authenticated successfully with payload-", authData);
			$state.go('map');
		}).catch(function (error) {
			console.log("Login Failed!", error);
		});
	};

	$scope.facebookSignin = function() {
		var provider = new firebase.auth.FacebookAuthProvider();
		provider.addScope('user_birthday');

		auth.signInWithRedirect(provider);
		auth.getRedirectResult().then(function(result) {
			var token = result.credential.accessToken;
			var user = result.user;
			console.log("Authenticated successfully with payload-", result);
			$state.go('map');
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log("Login Failed!", error);
		});
	};

})

.controller('SearchCtrl', function($scope) {

})

.controller('MapCtrl', function($scope) {

	$scope.map;

	var mapOptions = {
		center: {lat: 44.540, lng: -78.546},
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
	$scope.map = map;

})

.controller('FavoriteCtrl', function($scope) {

})

.controller('SettingCtrl', function($scope) {

});
