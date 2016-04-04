// angular.module('uBet', ['ionic'])

app.controller('createBetController', ['$scope', '$rootScope', '$state', 'createBetFactory', function($scope, $rootScope, $state, createBetFactory){
	var cb = this;


	$scope.$on('$ionicView.beforeEnter', function() {
	    cb.creator = JSON.parse(localStorage.getItem('user'));
	    cb.creatorCurrency = cb.getCreatorCurrency();

	});
	// cb.creator = JSON.parse(localStorage.getItem('user'));
	console.log(cb.creator);
	console.log(cb.creatorCurrency);

	// cb.creatorCurrency = cb.getCreatorCurrency();
	// console.log(cb.creatorCurrency);

	cb.currentDate = new Date();
	cb.currentStartDate = new Date();
	cb.currentEndDate = new Date();
	cb.minDate = cb.currentDate;
	cb.maxDate = new Date(2017,12,31);

	cb.betStartDate = function(val) {
		if(!val) {
			console.log('no date selected');
		}

		else {
			console.log('selected date is : '+val);
			console.log(cb.creatorCurrency);
		}
	};

	cb.betEndDate = function(val) {
		if(!val) {
			console.log('no date selected');
		}

		else {
			console.log('selected date2 is : '+val);
		}
	};

	cb.getCreatorCurrency = function() {
		console.log('in the function it is '+cb.creator.user_id);
 
		return createBetFactory.getUserInfo(cb.creator)
		.then(function(data) {
			console.log(data.currency);
			console.log('is comeing back');
			return data.currency;
		});

	}

	cb.creatorCurrency = cb.getCreatorCurrency();
	// console.log(testWhatever);
	// console.log(cb.getCreatorCurrency());

}]);


app.factory('createBetFactory', ['$rootScope', '$http', '$httpParamSerializer', function($rootScope, $http, $httpParamSerializer) {
	return {
		getUserInfo : function(user) {
			var userID = user.user_id;
			console.log('about to pass in '+userID);
			var request =  $http.get($rootScope.basePath+'/User/user/'+userID)
			.then(function(data) {
				return data.data;
			});
			return request;
		}
	}
}]);


// app.factory('authFactory', ['$rootScope','$http', '$httpParamSerializer', function($rootScope, $http, $httpParamSerializer) {
// 	return {
// 		createUser : function(userInfo) {
// 			console.log(userInfo);
// 				// var request = $http.post($rootScope.basePath+'/Login/create', userInfo)
// 				// .success(function(data) {
// 				// })
// 				// .error(function(data) {
// 				// 	console.log('error '+data);
// 				// 	alert('failure');
// 				// });
// 				// return request;
// 			},

// 		checkUsername : function(username) {
// 			// console.log(username + ' from in the factory');
// 			var request = $http.post($rootScope.basePath+'/Login/checkUsername/'+username)
// 			.success(function(data){
// 				// console.log(data + ' is the response');
// 			});
// 			return request;

// 		},
// 		login : function(user) {
// 			var request = $http.post($rootScope.basePath+'/Login/login', $httpParamSerializer({user: user}), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
// 			.then(function(data){
// 				// console.log(data.data);
// 				var loggedInUser = {
// 					user_id: data.data.user_id,
// 					fname: data.data.fname,
// 					lname: data.data.lname,
// 					username: data.data.username,
// 					email: data.data.email,
// 					profile_image : data.data.profile_image,
// 					birthdate: data.data.birthdate,
// 					city: data.data.city,
// 					country: data.data.country,
// 					currency: data.data.curr

// 				};
// 				return loggedInUser;
// 			});
// 			return request;
// 		}
// 	}
	
// }]);

// app.directive('checkPassword', function(){
// 	console.log('hi from the directive');
// 	return {
// 		require: 'ngModel',
// 		link: function(scope, elm, attrs, ctl) {
// 			var pass1 = attrs.checkPassword;
// 			// console.log(pass1.value);
// 			// console.log(pass);
// 			// console.log(ctl);
// 			// console.log(elm.name);
// 			// if(elm.name == 'password') {
// 			// 	console.log('found password');
// 			// }
// 			// console.log(elm);
// 			ctl.$validators.checkPassword = function(val) {
// 				// var matchTo = attrs.checkPassword;
// 				// console.log(val);
// 				// console.log(matchTo.value);
// 				if(val =="password") {
// 					return true;
// 				}
// 				else {
// 					return true;
// 				}
// 			}
// 			// console.log(scope);
// 			// console.log(elm.value);
// 			// console.log(attrs);
// 			// console.log(ctl);
// 			// var me = attrs.ngModel;
// 			// var matchTo = attrs.checkPassword.value; 

// 			// scope.$watch('[me, matchTo]', function(value, value2) {
// 			// 	console.log(matchTo);
// 			// 	console.log(me);
// 			// 	console.log('inside of the watch');
// 			// 	console.log(scope[me]);
// 			// 	console.log(scope[matchTo]);

// 			// 	ctl.$setValidity('checkPassword', scope[me]===scope[matchTo]);
// 			// }, true);
// 		}
// 	};
// });
