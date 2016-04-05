// angular.module('uBet', ['ionic'])

app.controller('friendsController', ['$rootScope','$scope', '$state', 'friendsFactory', 'fileUpload', function($rootScope, $scope, $state, friendsFactory, fileUpload){
	var fi = this;
	console.log('instance');

	fi.sortType = 'lname';
	fi.sortReverse = false;
	fi.searchUsers = '';
	fi.members = [];

	friendsFactory.getUsers()
	.then(function(data) {
		// console.log(data);
		for(var i = 0; i < data.length; i++) {
			var userObj = {
				fname: data[i].fname,
				lname: data[i].lname,
				username: data[i].username
			}
			fi.members[i] = userObj;
			// console.log(fi.members2);
		}
	});


	fi.getAllUsers = function() {
		console.log(fi.members);
	}

	fi.members2 = [
		{
			fname: 'Bob',
			lname: 'Smith',
			username: 'bobSmith',
		},
		{
			fname: 'Jane',
			lname: 'Zmith',
			username: 'janeSmith',
		},
		{
			fname: 'Vanessa',
			lname: 'Rusu',
			username: 'VanessaRusu',
		},
		{
			fname: 'Mike',
			lname: 'Hayes',
			username: 'mikehayes',
		}
	];

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
		}
	}
	
}]);
