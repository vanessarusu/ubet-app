// angular.module('uBet', ['ionic'])

app.controller('loginController', ['$scope', '$rootScope', '$state', 'authFactory', function($scope, $rootScope, $state, authFactory){
	$scope.logout = function() {
		localStorage.removeItem('user');
		$state.go('tabs.feed');
	}
	var welcome = this;
	welcome.userTaken = false;
	welcome.notice = false;
	welcome.login = function(user) {
		authFactory.login(user)
		.then(function(loggedInUser) {
			if(loggedInUser.user_id) {
				localStorage.setItem("user", JSON.stringify(loggedInUser));
				console.log(localStorage.getItem('user'));




				// $rootScope.user = data;
				$state.go('tabs.feed');
			}
			else {
				alert('there is no user');
				// $state.go('tabs.feed');
			}
		});
	}

	welcome.register = function(user) {
		if(user) {
			// alert('our form is amazing');
			console.log(user);
			authFactory.createUser(user)
			.then(function(data) {
				$state.go('home');
			})
		}
		else {
			welcome.notice = 'something went wrong, please try again!';
		}
	}

	welcome.checkUsernameAvailability = function(username) {
		if(username) {

			authFactory.checkUsername(username)
			.then(function(data){
				if(data.data.length>0) {
					welcome.userTaken = true;
				}
				else {
					welcome.userTaken = false;
					console.log('there is not a user');
				}
			});
		}
	}
	welcome.verifyPassword = function(password, passwordConfirm) {
		// alert('hello');
		if(password==passwordConfirm) {
			welcome.isMatch = true;
		}
		else {
			welcome.isMatch = false;
		}
	}
}]);


app.factory('authFactory', ['$rootScope','$http', '$httpParamSerializer', function($rootScope, $http, $httpParamSerializer) {
	return {
		createUser : function(userInfo) {
			console.log(userInfo);
			var request = $http.post($rootScope.basePath+'/Login/register', $httpParamSerializer({userInfo: userInfo}), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
			.then(function(response) {
				console.log(response.data);
				return response.data;
			});
			return request;
				
			},

		checkUsername : function(username) {
			// console.log(username + ' from in the factory');
			var request = $http.post($rootScope.basePath+'/Login/checkUsername/'+username)
			.success(function(data){
				// console.log(data + ' is the response');
			});
			return request;

		},
		login : function(user) {
			var request = $http.post($rootScope.basePath+'/Login/login', $httpParamSerializer({user: user}), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
			.then(function(data){
				// console.log(data.data);
				var loggedInUser = {
					user_id: data.data.user_id,
					fname: data.data.fname,
					lname: data.data.lname,
					username: data.data.username,
					email: data.data.email,
					profile_image : data.data.profile_image,
					birthdate: data.data.birthdate,
					city: data.data.city,
					country: data.data.country,
					currency: data.data.currency

				};
				return loggedInUser;
			});
			return request;
		},
		getUser: function(userID) {
			var request = $http.get($rootScope.basePath+'/User/user/'+userID)
			.then(function(data) {
				var loggedInUser = {
					user_id: data.data.user_id,
					fname: data.data.fname,
					lname: data.data.lname,
					username: data.data.username,
					email: data.data.email,
					profile_image : data.data.profile_image,
					birthdate: data.data.birthdate,
					city: data.data.city,
					country: data.data.country,
					currency: data.data.currency
				};
				localStorage.removeItem('user');
				localStorage.setItem("user", JSON.stringify(loggedInUser));
			});
			return request;
		}
	}
	
}]);

app.directive('checkPassword', function(){
	console.log('hi from the directive');
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctl) {
			var pass1 = attrs.checkPassword;
			// console.log(pass1.value);
			// console.log(pass);
			// console.log(ctl);
			// console.log(elm.name);
			// if(elm.name == 'password') {
			// 	console.log('found password');
			// }
			// console.log(elm);
			ctl.$validators.checkPassword = function(val) {
				// var matchTo = attrs.checkPassword;
				// console.log(val);
				// console.log(matchTo.value);
				if(val =="password") {
					return true;
				}
				else {
					return true;
				}
			}
			// console.log(scope);
			// console.log(elm.value);
			// console.log(attrs);
			// console.log(ctl);
			// var me = attrs.ngModel;
			// var matchTo = attrs.checkPassword.value; 

			// scope.$watch('[me, matchTo]', function(value, value2) {
			// 	console.log(matchTo);
			// 	console.log(me);
			// 	console.log('inside of the watch');
			// 	console.log(scope[me]);
			// 	console.log(scope[matchTo]);

			// 	ctl.$setValidity('checkPassword', scope[me]===scope[matchTo]);
			// }, true);
		}
	};
});
