// angular.module('uBet', ['ionic'])

app.controller('friendsController', ['$rootScope','$scope', '$state', 'friendsFactory', 'fileUpload', function($rootScope, $scope, $state, friendsFactory, fileUpload){
	var fi = this;
	console.log('instance');

	fi.sortType = 'lname';
	fi.sortReverse = false;
	fi.searchUsers = '';
	fi.members = [];
	fi.friends = [];

	friendsFactory.getUsers()
	.then(function(data) {
		// console.log(data);
		for(var i = 0; i < data.length; i++) {
			var userObj = {
				fname: data[i].fname,
				lname: data[i].lname,
				username: data[i].username,
				user_id: data[i].user_id
			}
			fi.members[i] = userObj;
			// console.log(fi.members2);
		}
	});

	// console.log(JSON.parse(localStorage.getItem('user')).user_id);

	// get all friends that have been accepted
	friendsFactory.getFriends()
	.then(function(data) {
		// console.log(data);
		fi.friends = data;
		// for(var i =0; i < data.length; i++) {
		// 	// console.log(data[i]);
		// 	fi.friends.push(data[i]);
		// }
		// console.log('the friends array now is ');
		// console.log(fi.friends);
	});

	fi.getProfile = function(id) {
		fi.profile = friends[id];
		return fi.profile;
	}

	// $scope.$on('$ionicView.beforeEnter', function() {
	//  //    pc.currentUser = JSON.parse(localStorage.getItem('user'));

	// 	// if(pc.currentUser.profile_img == null) {
	// 	// 	pc.currentUser.profile_img = 'default-profile.png';
	// 	// }
	// });

}]);

app.factory('friendsFactory', ['$rootScope','$http', '$httpParamSerializer', function($rootScope, $http, $httpParamSerializer) {
	return {
		getUsers: function() {
			var request = $http.get($rootScope.basePath+'/User/all')
			.then(function(response) {
				return response.data;
			});
			return request;
		},

		getFriends: function() {
			var userID = JSON.parse(localStorage.getItem('user')).user_id;
			console.log(userID + ' is the user id in get friends');
			var request = $http.get($rootScope.basePath+'/User/friends/'+userID)
			.then(function(response) {
				// console.log(response);
				return response.data;
			});
			return request;
		}
	}
	
}]);
