// angular.module('uBet', ['ionic'])

app.controller('friendsController', ['$rootScope','$scope', '$state', 'friendsFactory', 'profileFactory','betFactory', 'eventFactory','fileUpload', 'viewMember', function($rootScope, $scope, $state, friendsFactory, profileFactory, betFactory, eventFactory, fileUpload, viewMember){
	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
	    viewData.enableBack = true;
	});
	$scope.logout = function() {
		localStorage.removeItem('user');
		$state.go('tabs.feed');
	}

	var fi = this;
	fi.rootImagePath = $rootScope.imagePath;

	console.log('instance');
	fi.viewMember = viewMember;
	// console.log(fi.viewMember);
	// console.log('^^^ is view Mmeber');

	fi.sortType = 'lname';
	fi.sortReverse = false;
	fi.searchUsers = '';
	fi.members = [];
	fi.friends = [];
	fi.friendsIDList = [];
	fi.currentUser = JSON.parse(localStorage.getItem('user'));
	fi.currentUserID = fi.currentUser.user_id;
	fi.doneCheck = false;
	fi.userEvents = [];

	if(fi.viewMember === null) {
		fi.viewingUserID = fi.currentUserID;
	}
	else {
		fi.viewingUserID = viewMember.user_id;
		fi.activeBets = [];
		fi.archivedWins = [];
		fi.archivedLosses = [];
		fi.moderatorBets = [];
		betFactory.getAllBets(fi.viewMember.user_id)
		.then(function(data) {
			// console.log(data);
			for (var i = 0; i < data.length; i++) {
				if(data[i].bet_status == 1 || data[i].bet_status == '1') {
					fi.activeBets.push(data[i]);
				}
				else if(data[i].bet_status == 3 || data[i].bet_status == 4) {
					if(data[i].winner_id == fi.viewMember.user_id) {
						fi.archivedWins.push(data[i]);
					}
					else {		

						if(data[i].role_id == 3) {
							console.log("im a moderator yo");
							fi.moderatorBets.push(data[i]);
						} else {
							console.log("i lost");
							fi.archivedLosses.push(data[i]);
						}
					}
				} else {
					// console.log("didnt render for bet status " + data[i].bet_status);
				}
			}
			// console.log('friends bet stuff: ');
			// console.log(fi.archivedWins);
			// console.log(fi.archivedLosses);
			// console.log(fi.moderatorBets);
		});
		eventFactory.getEventsForUserId(fi.viewMember.user_id)
		.then(function(data) {
			fi.userEvents = data;
		})
	}
	// console.log(fi.viewingUserID+' is the viewing user id');


	// get all friends that have been accepted
	friendsFactory.getFriends(fi.viewingUserID)
	.then(function(data) {
		// console.log(data);

		for(var i = 0; i < data.length; i++) {
			fi.friendsIDList.push(data[i].user_id);
			profileFactory.checkProfileImage(data[i]);
		}
		fi.friends = data;
		// console.log(data);
		fi.doneCheck = true;

		if(fi.currentUserID == fi.viewingUserID) {

			friendsFactory.getUsers()
			.then(function(data) {
				// console.log("friends" + fi.friendsIDList);
				for(var i = 0; i < data.length; i++) {

					profileFactory.checkProfileImage(data[i]);
					// console.log(fi.friendsIDList.indexOf(data[i].user_id));
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
				// console.log(fi.members);
			});
		}

	});

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
		// alert(data + ' is the remove friend response');
		friendsFactory.getFriends(fi.viewingUserID)
		.then(function(data) {
			for(var i = 0; i < data.length; i++) {
			fi.friendsIDList.push(data[i].user_id);
			if(data[i].profile_image === null) {
				data[i].profile_image = 'default-profile.png';
			}
		}
		fi.friends = data;
		// console.log(data);
		fi.doneCheck = true;

		});
	});
};

fi.addFriend = function(friendID) {
	friendsFactory.addFriend(fi.currentUserID, friendID)
	.then(function(data) {
		// alert(data+ ' is the add friend response');
		friendsFactory.getFriends(fi.viewingUserID)
		.then(function(data) {
			for(var i = 0; i < data.length; i++) {
			fi.friendsIDList.push(data[i].user_id);
			if(data[i].profile_image === null) {
				data[i].profile_image = 'default-profile.png';
			}
		}
		fi.friends = data;
		// console.log(data);
		fi.doneCheck = true;

		});
	});
}


	fi.getProfile = function(id) {
		fi.profile = friends[id];
		return fi.profile;
	}


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
				// console.log(response);
				return response.data;
			});
			return request;
		},
		addFriend: function(userID, friendID) {
			var request = $http.post($rootScope.basePath+'/user/'+userID+'/friends/friend/'+friendID)
			.then(function(response) {
				// console.log(response);
				return response.data;
			});
			return request;
		}
	}
	
}]);
