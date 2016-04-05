// angular.module('uBet', ['ionic'])

app.controller('createBetController', ['$scope', '$rootScope', '$state', 'createBetFactory', function($scope, $rootScope, $state, createBetFactory){
	var cb = this;


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
		}

	}
}]);
