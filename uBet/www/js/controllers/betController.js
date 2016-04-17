// angular.module('uBet', ['ionic'])

app.controller('betController', ['$scope', '$rootScope', '$state', 'betFactory', 'friendsFactory', 'profileFactory', 'viewBet', function($scope, $rootScope, $state, betFactory, friendsFactory, profileFactory, viewBet){
	var bet = this;
	// bet.viewBet = viewBet;
	console.log('the viewBet is ');

	$scope.$on('$ionicView.beforeEnter', function() {

		bet.activeUser = JSON.parse(localStorage.getItem('user'));
		// console.log(bet.activeUser);

		bet.allBets = [];
		bet.activeBets = [];
		bet.resolutionPhaseBets = [];
		bet.archivedBets = [];
		bet.pendingBets = [];
		bet.deniedBets = [];
		bet.viewBet = viewBet;
		console.log(bet.viewBet);
		bet.betMembers = [];
		bet.moderator = false;

		if(bet.viewBet != null) {
			betFactory.checkBetImage(bet.viewBet);
			bet.betStatus = betFactory.getBetStatus(bet.viewBet.bet_status);
			betFactory.getBetMembers(viewBet.bet_id)
			.then(function(data) {
				for(var i = 0; i < data.length; i++) {
					profileFactory.checkProfileImage(data[i]);
					if(data[i].role_id == 3){
						bet.moderator = true;
					}
				}
				bet.betMembers = data;
			});

		}

		betFactory.getAllBets(bet.activeUser.user_id)
		.then(function(data) {
			for(var i = 0; i < data.length; i++) {
				if(data[i].bet_status == 1 || data[i].bet_status == '1') {
					bet.activeBets.push(data[i]);
				}
				else if(data[i].bet_status == 2 || data[i].bet_status == '2') {
					bet.resolutionPhaseBets.push(data[i]);
				}
				else if(data[i].bet_status == 3 || data[i].bet_status == '3') {
					bet.archivedBets.push(data[i]);
				}
				else if(data[i].bet_status == 4 || data[i].bet_status == '4') {
					bet.unresolvedArchivedBets.push(data[i]);
				}
				else if(data[i].bet_status == 5 || data[i].bet_status == '5') {
					bet.pendingBets.push(data[i]);
				}
				else if(data[i].bet_status == 6 || data[i].bet_status == '6') {
					bet.deniedBets.push(data[i]);
				}
			}
			bet.allBets = data;
		});
	});


}]);


app.factory('betFactory', ['$rootScope', '$http', '$httpParamSerializer', function($rootScope, $http, $httpParamSerializer) {
	return {
		getBetStatus: function(betStatusID) {
			var betStatus;
			if(betStatusID == 1 || betStatusID == '1') {
				betStatus = 'This bet is underway';
			}
			else if(betStatusID == 2 || betStatusID == '2') {
				betStatus = 'This bet is being resolved';
			}
			else if(betStatusID == 3 || betStatusID == '3') {
				betStatus = 'This bet is over! See winner below';
			}
			else if(betStatusID == 4 || betStatusID == '4') {
				betStatus = 'This bet is over and no winner was determined';
			}
			else if(betStatusID == 5 || betStatusID == '5') {
				betStatus = 'This bet is still pending';
			}
			else if(betStatusID == 6 || betStatusID == '6') {
				betStatus = 'This bet was denied';
			}
			return betStatus;
		},
		checkBetImage: function(bet) {
			if(!bet.bet_image || bet.bet_image == null) {
					bet.bet_image = 'default-profile.png';
					return bet.bet_image;
				}
				return;
		},
		getAllBets: function(userID) {
			var userID = userID;
			var request = $http.get($rootScope.basePath+'/Bet/getAll/'+userID)
			.then(function(response) {
				return response.data;
			});
			return request;
		},
		getBet: function(betID) {
			var request = $http.get($rootScope.basePath+'/Bet/getOne/'+betID)
			.then(function(response) {
				return response.data;
			});
			return request;
		},
		getBetMembers: function(betID) {
			var request = $http.get($rootScope.basePath+'/Bet/getBetMembers/'+betID)
			.then(function(response) {
				return response.data;
			});
			return request;
		}

	}
}]);
