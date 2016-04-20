// angular.module('uBet', ['ionic'])

app.controller('createBetController', ['$scope', '$rootScope', '$state', 'createBetFactory', 'friendsFactory', 'betFactory', 'authFactory', 'profileFactory', function($scope, $rootScope, $state, createBetFactory, friendsFactory, betFactory, authFactory, profileFactory){
	$scope.logout = function() {
		localStorage.removeItem('user');
		$state.go('tabs.feed');
	}

	var cb = this;

	cb.rootImagePath = $rootScope.imagePath;

	cb.creator = JSON.parse(localStorage.getItem('user'));
	console.log(cb.creator);

	// BET VARIABLES --------------------------------------------------------

	// cb.currentDate = new Date();
	cb.currentStartDate = new Date();
	cb.currentEndDate = new Date();
	cb.minDate = cb.currentStartDate;
	cb.maxDate = new Date(2017,12,31);
	cb.wagerAmount = 5;
	cb.betTerms;
	cb.betName;
	cb.friends = [];
	cb.searchUsers = '';
	cb.searchModeratedUsers = '';

	cb.moderators = [];
	cb.competitors = [];


	cb.betStartDate = function(val) {
		console.log(cb.currentEndDate);
		if(!val) {
			console.log('no date selected');
		}

		else if(cb.currentEndDate < val) {
			cb.currentEndDate = val;
		}

		else {
			console.log('selected date is : '+val);
			cb.currentStartDate = val;
		}
	};

	cb.betEndDate = function(val) {
		if(!val) {
			console.log('no date selected');
		}

		else {
			console.log('selected date2 is : '+cb.currentEndDate);
			val.setHours(23,59);
			cb.currentEndDate = val;
		}
	};

	cb.removeCompetitor = function(f) {
		console.log("removing " + f);

		var id = f.user_id;

		var indx = cb.competitors.indexOf(f);
		console.log("index of friend " + indx);
		cb.competitors.splice(indx, 1);

		cb.friends.push(f);

	}

	cb.addCompetitor = function(f) {

		var id = f.user_id;
		cb.competitors.push(f);

		console.log('the id is '+ id);
		var indx = cb.friends.indexOf(f);
		cb.friends.splice(indx, 1);
	}


	cb.removeModerator = function(m) {
		console.log("removing " + m);

		var id = m.user_id;

		var indx = cb.moderators.indexOf(m);
		cb.moderators.splice(indx, 1);

		cb.friends.push(m);

	}

	cb.addModerator = function(m) {

		var id = m.user_id;
		cb.moderators.push(m);

		console.log('the id is '+ id);
		// remove clicked on friend from friends list
		var indx = cb.friends.indexOf(m);
		cb.friends.splice(indx, 1);
	}


	cb.submitBet = function() {

		console.log("called submit bet");

		var bet = {
			'bet_name' : cb.betName,
			'start_date' : cb.currentStartDate,
			'end_date' : cb.currentEndDate,
			'wager_amount' : cb.wagerAmount,
			'bet_terms' : cb.betTerms,
			'creator_user_id' : cb.creator.user_id,
			'bet_particpants' : cb.competitors,
			'bet_moderators' : cb.moderators
		}

		createBetFactory.createBet(bet).then(function(data) {
			betFactory.currencyWithdrawl(data.bet_id, cb.creator.user_id, bet.wager_amount)
			.then(function(data){
				authFactory.getUser(cb.creator.user_id);
			});
		});
		$state.go('tabs.bets', {}, {reload: true});

	}

	createBetFactory.getUserInfo(cb.creator)
	.then(function(data) {
		// console.log(data);
		cb.creatorCurrency = data.currency;
		console.log(cb.creatorCurrency);
	})
	.catch(function(){
		console.log('in the catch');
	});

	cb.saveData = function() {
		console.log('bet terms are '+ cb.betTerms);
		console.log('wager amount is '+cb.wagerAmount);
		console.log('bet name is '+cb.betName);
		console.log('start date is '+ cb.currentStartDate);
		console.log('end date is '+ cb.currentEndDate);
	}

	friendsFactory.getFriends(cb.creator.user_id)
	.then(function(data) {
		for(var i = 0; i < data.length; i++) {
			profileFactory.checkProfileImage(data[i]);
		}
		cb.friends = data;
		console.log(cb.friends);
		console.log('is friends ^^');

	});


}]);


app.factory('createBetFactory', ['$rootScope', '$http', '$httpParamSerializer', function($rootScope, $http, $httpParamSerializer) {
	return {

		getUserInfo : function(user) {
			var userID = user.user_id;
			console.log('about to pass in '+userID);
			var request =  $http.get($rootScope.basePath+'/User/user/'+userID)
			.then(function(response) {
				return response.data;
			});
			return request;
		},

		createBet : function(betInfo) {
			console.log(betInfo);
			var request = $http.post($rootScope.basePath+'/Bet/create', $httpParamSerializer({bet: betInfo}), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
			.then(function(response) {
				console.log(response.data);
				return response.data;
			});
			return request;
		}
	}
}]);
