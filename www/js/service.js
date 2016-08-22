angular.module('service', [])

.factory('AppService', function() {

	var type = '';

	var setType = function(newType) {
		type = newType
	};

	var getType = function() {
		return type;
	};

	return {
		setType: setType,
		getType: getType
	};

});