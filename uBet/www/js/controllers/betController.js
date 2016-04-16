// angular.module('uBet', ['ionic'])

app.controller('betController', ['$scope', '$rootScope', '$state', 'betFactory', 'friendsFactory', function($scope, $rootScope, $state, betFactory, friendsFactory){
	var bet = this;


	bet.activeUser = JSON.parse(localStorage.getItem('user'));
	console.log(bet.activeUser);

	bet.bets = [];

	betFactory.getBets(bet.activeUser.user_id)
	.then(function(data) {
		bet.bets = data;
	});


}]);


app.factory('betFactory', ['$rootScope', '$http', '$httpParamSerializer', function($rootScope, $http, $httpParamSerializer) {
	return {
		getBets : function(userID) {
			var userID = userID;
			var request = $http.get($rootScope.basePath+'/Bet/getAll/'+userID)
			.then(function(response) {
				console.log(response.data);
				return response.data;
			});
			return request;
		}

	}
}]);
