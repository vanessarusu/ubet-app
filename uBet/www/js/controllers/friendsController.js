// angular.module('uBet', ['ionic'])

app.controller('friendsController', ['$rootScope','$scope', '$state', 'friendsFactory', 'profileFactory', 'fileUpload', 'viewMember', function($rootScope, $scope, $state, friendsFactory, profileFactory, fileUpload, viewMember){
	var fi = this;
	console.log('instance');
	fi.viewMember = viewMember;
	console.log(fi.viewMember);
	console.log('^^^ is view Mmeber');

	fi.sortType = 'lname';
	fi.sortReverse = false;
	fi.searchUsers = '';
	fi.members = [];
	fi.friends = [];
	fi.friendsIDList = [];
	fi.currentUser = JSON.parse(localStorage.getItem('user'));
	fi.currentUserID = fi.currentUser.user_id;
	fi.doneCheck = false;

	if(fi.viewMember === null) {
		fi.viewingUserID = fi.currentUserID;
	}
	else {
		fi.viewingUserID = viewMember.user_id; 
	}
	console.log(fi.viewingUserID+' is the viewing user id');





	// console.log(JSON.parse(localStorage.getItem('user')).user_id);

	// get all friends that have been accepted
	friendsFactory.getFriends(fi.viewingUserID)
	.then(function(data) {
		// console.log(data);

		for(var i = 0; i < data.length; i++) {
			fi.friendsIDList.push(data[i].user_id);
			profileFactory.checkProfileImage(data[i]);
			// if(data[i].profile_image === null) {
			// 	data[i].profile_image = 'default-profile.png';
			// }
		}
		fi.friends = data;
		console.log(data);
		fi.doneCheck = true;

		if(fi.currentUserID == fi.viewingUserID) {

			friendsFactory.getUsers()
			.then(function(data) {
				console.log("friends" + fi.friendsIDList);
				for(var i = 0; i < data.length; i++) {
					// for(var j = 0; j < fi.friends.length; i++) {
					// 	if(data[i].user_id.indexOf(fi.members[i].user_id) !== -1) {
					// 		var isFriend = true;
					// 	}
					// 	else {
					// 		var isFriend = false;
					// 	}
					// }

					profileFactory.checkProfileImage(data[i]);
					// if(data[i].profile_image === null) {
					// 		var defaultProfileImage = 'default-profile.png';
					// }
					// else {
					// 	var defaultProfileImage = data[i].profile_image;
					// }
					console.log(fi.friendsIDList.indexOf(data[i].user_id));
					if(fi.friendsIDList.indexOf(data[i].user_id) !== -1) {
						var isFriend = true;
					}
					else {
						var isFriend = false;
					}
					var userObj = {
						fname: data[i].fname,
						lname: data[i].lname,
						username: data[i].username,
						user_id: data[i].user_id,
						profile_image: data[i].profile_image,
						isFriend: isFriend
					}
					fi.members[i] = userObj;
				}
				console.log(fi.members);
			});
		}

	});
// fi.checkingVar = function() {
// 	console.log('in checkingVar function');
// 	return false;
// }

fi.checkFriendship = function(id) {

	if(fi.friendsIDList.indexOf(id) !== -1) {
		return true;
	}
	else {
		return false;
	}
};

fi.removeFriend = function(friendID) {
	friendsFactory.removeFriend(fi.currentUserID, friendID)
	.then(function(data) {
		alert(data + ' is the remove friend response');
		friendsFactory.getFriends(fi.viewingUserID)
		.then(function(data) {
			for(var i = 0; i < data.length; i++) {
			fi.friendsIDList.push(data[i].user_id);
			if(data[i].profile_image === null) {
				data[i].profile_image = 'default-profile.png';
			}
		}
		fi.friends = data;
		console.log(data);
		fi.doneCheck = true;

		});
	});
	// alert(friendID);
};

fi.addFriend = function(friendID) {
	friendsFactory.addFriend(fi.currentUserID, friendID)
	.then(function(data) {
		alert(data+ ' is the add friend response');
		friendsFactory.getFriends(fi.viewingUserID)
		.then(function(data) {
			for(var i = 0; i < data.length; i++) {
			fi.friendsIDList.push(data[i].user_id);
			if(data[i].profile_image === null) {
				data[i].profile_image = 'default-profile.png';
			}
		}
		fi.friends = data;
		console.log(data);
		fi.doneCheck = true;

		});
	});
	// alert(friendID + ' remove');
}


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

		getFriends: function(userID) {
			// var userID = JSON.parse(localStorage.getItem('user')).user_id;
			console.log(userID + ' is the user id in get friends');
			var request = $http.get($rootScope.basePath+'/User/friends/'+userID)
			.then(function(response) {
				// console.log(response);
				return response.data;
			});
			return request;
		},
		getMember: function(id) {
			var request = $http.get($rootScope.basePath+'/User/user/'+id)
			.then(function(response) {
				return response.data;
			});
			return request;
		},
		removeFriend: function(userID, friendID) {
			var request = $http.delete($rootScope.basePath+'/user/'+userID+'/friends/friend/'+friendID)
			.then(function(response) {
				console.log(response);
				return response.data;
			});
			return request;
		},
		addFriend: function(userID, friendID) {
			var request = $http.post($rootScope.basePath+'/user/'+userID+'/friends/friend/'+friendID)
			.then(function(response) {
				console.log(response);
				return response.data;
			});
			return request;
		}
	}
	
}]);
