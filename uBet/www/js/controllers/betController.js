// angular.module('uBet', ['ionic'])

app.controller('betController', ['$scope', '$rootScope', '$state', 'betFactory', 'friendsFactory', 'profileFactory', 'authFactory', 'eventFactory', 'viewBet', '$ionicHistory', function($scope, $rootScope, $state, betFactory, friendsFactory, profileFactory, authFactory, eventFactory, viewBet, $ionicHistory){
	$scope.logout = function() {
		localStorage.removeItem('user');
		$state.go('tabs.feed');
	}
	var bet = this;

	bet.rootImagePath = $rootScope.imagePath;

	// bet.viewBet = viewBet;
	console.log('the viewBet is ');
	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
	    viewData.enableBack = true;
	});


	$scope.$on('$ionicView.beforeEnter', function() {

		bet.activeUser = JSON.parse(localStorage.getItem('user'));
		bet.allBets = [];
		bet.activeBets = [];
		bet.resolutionPhaseBets = [];
		bet.unresolvedArchivedBets = [];
		bet.archivedBets = [];
		bet.pendingBets = [];
		bet.deniedBets = [];
		bet.viewBet = viewBet;
		bet.betMembers = [];
		bet.moderator = false;
		bet.pendingResponse = false;
		bet.winnerSelected = false;
		bet.vote = false;
		bet.memberHasVoted = false;
		bet.creator = [];



// --- if we are looking at a specific bet ------ //

		if(bet.viewBet != null) {
			bet.viewBet.pretty_start_date = bet.viewBet.start_date.toString();
			console.log(bet.viewBet.pretty_start_date);
			betFactory.checkBetImage(bet.viewBet);
			bet.betStatus = betFactory.getBetStatus(bet.viewBet.bet_status);
			if(bet.viewBet.bet_status == 2 || bet.viewBet.bet_status == '2') {

				betFactory.getVotes(bet.viewBet.bet_id)
				.then(function (data) {
					bet.viewBet.votes = [];
					bet.viewBet.votes = data;
					console.log('checking votes');
					console.log(bet.viewBet.votes);

					for(var i = 0; i < data.length; i++) {
						for (var j = 0; j < bet.betMembers.length;  j++) {

						}
					}
				});

			}
			betFactory.getBetMembers(viewBet.bet_id)
			.then(function(data) {
					for(var i = 0; i < data.length; i++) {

						profileFactory.checkProfileImage(data[i]);
						if(bet.viewBet.bet_status == 5 || bet.viewBet.bet_status == '5') {
							if(data[i].accepted_bet == 1 || data[i].accepted_bet == '1') {
								data[i].pendingClass = 'ion-checkmark-circled balanced';
							}
							else if(data[i].accepted_bet == 2 || data[i].accepted_bet == '2') {
								data[i].pendingClass = 'ion-close-circled danger';
							}
							else if(data[i].accepted_bet == 3 || data[i]. accepted_bet == '3') {
								data[i].pendingClass = 'ion-help-circled calm';
							}
						}
						if(data[i].role_id == 3){
							bet.moderator = true;
						}
						if(data[i].user_id == bet.activeUser.user_id) {
							if(data[i].accepted_bet == 3 || data[i].accepted_bet =='3') {
								bet.pendingResponse = true;
							}
						}
					bet.betMembers = data;
				}

				for(var k = 0; k < bet.betMembers.length; k++) {
					if(bet.betMembers[k].role_id == 1 || bet.betMembers[k].role_id == '1') {
						bet.creator = bet.betMembers[k];
					}
				}
				if(bet.viewBet.bet_status == 2 || bet.viewBet.bet_status =='2') {
					betFactory.getVotes(bet.viewBet.bet_id)
					.then(function(data) {
						console.log('the bet status was 2 and the votes are ');
						console.log(data);
						for(var i = 0; i < data.length; i ++) {

							for(var j = 0; j < bet.betMembers.length; j++) {

								if(data[i].user_id == bet.betMembers[j].user_id) {
									console.log(bet.betMembers[j].username + ' voted');
									bet.betMembers[i].voteStatusIcon = 'ion-checkmark-circled balanced';
								}
								if(data[i].user_id == bet.betMembers[j].user_id &&
									bet.betMembers[j].user_id == bet.activeUser.user_id) {
									bet.memberHasVoted = true;
								}
							}
							console.log(bet.betMembers);

						}
						bet.viewBet.votes = [];
						bet.viewBet.votes = data;
					})
				}
			});

			betFactory.getProof(viewBet.bet_id)
			.then(function(data) {
				viewBet.textProof = [];
				for(var i=0; i<data.length; i++) {
					if(data[i].text_content != null && data[i].text_content != "") {
						viewBet.textProof.push(data[i]);
					}
				}
				console.log('the text proof is ');
				console.log(bet.viewBet.textProof.length);
				console.log(viewBet.textProof.length);				
			});
		}

		betFactory.getAllBets(bet.activeUser.user_id)
		.then(function(data) {
			for(var i = 0; i < data.length; i++) {
				// console.log(data[i]);
				betFactory.checkBetImage(data[i].bet_id);

				var nowDate = Date.now();
				var betDate = new Date(data[i].end_date);
				if(nowDate > betDate && data[i].bet_status != 6 &&
					data[i].bet_status != 3 && data[i].bet_status != 4) {
					// console.log("date is bigger");

					if(data[i].bet_status == 1) {
						betFactory.updateBetStatus(data[i].bet_id, 2);
						data[i].bet_status = 2;	
					} else if(data[i].bet_status == 5) {
						betFactory.updateBetStatus(data[i].bet_id, 6);
						data[i].bet_status = 6;	

					}

					betDate.setDate(betDate.getDate() + 7);
	
					if(nowDate > betDate) {
						if(data[i].bet_status != 3 && data[i].bet_status != 6) {
							betFactory.updateBetStatus(data[i].bet_id, 4);
							data[i].bet_status = 4;	
						}
					}
					
				} else {
				}


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

	// ---- end of before enter -----

	bet.acceptBet = function(betID) {
		// need to check if moderator  - if it is, dont call withdraw function
		betFactory.voteYes(bet.activeUser.user_id, betID)
		.then(function(data) {

			for(var i =0; i < bet.betMembers.length; i++) {

				if(bet.betMembers[i].user_id == bet.activeUser.user_id && bet.betMembers[i].role_id != 3) {

					// console.log("Not a moderator");

					betFactory.currencyWithdrawl(betID, bet.activeUser.user_id, bet.viewBet.wager_amount)
					.then(function(data){
						authFactory.getUser(bet.activeUser.user_id);
					});
				}

			}

			//withdraw money
			// console.log(data);
			bet.pendingResponse = false;
			betFactory.checkBetStatus(betID)
			.then(function(data) {
				bet.viewBet.bet_status = data.bet_status;
			});

			var event = {
				'bet_id' : bet.viewBet.bet_id,
				'user_id' : bet.activeUser.user_id,
				'event_type' : 2,
				'event_content' : "Accepted the bet, you're on!",
				'link' : 'tabs.bets'
			}
			var afterEvent = eventFactory.addEvent(event)
			.then(function(data) {
				console.log(data);
				console.log('^^this is the data from addEvent, about to push to textProof array');
			});




			$ionicHistory.nextViewOptions({
    			disableBack: true
  			});

			$state.go('tabs.bets');
		});
	};
	bet.declineBet = function(betID) {
		betFactory.voteNo(bet.activeUser.user_id, betID)
		.then(function(data) {
			console.log(data);
			bet.pendingResponse = false;
			betFactory.checkBetStatus(betID)
			.then(function(data) {
				bet.viewBet.bet_status = data.bet_status;
			});

			$ionicHistory.nextViewOptions({
    			disableBack: true
  			});
  			$state.go('tabs.bets');

		});
		// alert('deny' + betID);
	}

	bet.submitProof = function() {

		if(bet.proofContent != null && bet.proofContent != "") {

			var proof = {
				'bet_id' : bet.viewBet.bet_id,
				'user_id' : bet.activeUser.user_id,
				'proof_name' : "title-unused",
				'video_path' : null,
				'text_content' : bet.proofContent,
				'image_path' : null

			}
			var afterProof = betFactory.addProof(proof)
			.then(function(data) {
				console.log(data);
				console.log('^^this is the data from addProof, about to push to textProof array');
				if(data.username == null) {
					data.username = bet.activeUser.username;
				}
				bet.viewBet.textProof.push(data);	
			});

			bet.proofContent = "";
			console.log('about to submit an event for proof submission');

			var event = {
				'bet_id' : bet.viewBet.bet_id,
				'user_id' : bet.activeUser.user_id,
				'event_type' : 5,
				'event_content' : "Posted proof to the bet!",
				'link' : 'tabs.bets'
			}
			var afterEvent = eventFactory.addEvent(event)
			.then(function(data) {
				console.log(data);
				console.log('^^this is the data from addEvent, about to push to textProof array');
			});

		}		
	};

	bet.voteWinner = function(userID) {
		for(var i = 0; i < bet.betMembers.length; i ++) {
			if(bet.betMembers[i].user_id == userID) {

				bet.winnerSelected = {
					user_id: bet.betMembers[i].user_id,
					fname: bet.betMembers[i].fname,
					lname: bet.betMembers[i].lname,
					username: bet.betMembers[i].username
				}
				bet.vote = true;
			}
		}
	};
	bet.submitVote = function(winnerID) {
		var userRole;
		for(var i = 0; i < bet.betMembers.length; i++) {
			if(bet.betMembers[i].user_id == bet.activeUser.user_id) {
				userRole = bet.betMembers[i].role_id;
			}
		}
		betFactory.submitVote(bet.viewBet.bet_id, bet.activeUser.user_id, userRole, winnerID)
		.then(function(data) {

			console.log("submitted vote");
			bet.memberHasVoted = true;
			betFactory.checkBetStatus(bet.viewBet.bet_id)
			.then(function(data) {
				console.log("getting status");
				if(bet.viewBet.bet_status != data.bet_status) {
					bet.viewBet.bet_status = data.bet_status;

					console.log('status as differnet');
					authFactory.getUser(bet.activeUser.user_id);
					$ionicHistory.nextViewOptions({
		    			disableBack: true
		  			});

					$state.go('tabs.bets');
				}
			});
		});
	};


}]);


app.factory('eventFactory', ['$rootScope', '$http', '$httpParamSerializer', function($rootScope, $http, $httpParamSerializer) {
	return {
		getEventsForUserId: function(userID) {
			var userID = userID;
			var request = $http.get($rootScope.basePath+'/Event/getEventsForUserId/'+userID)
			.then(function(response) {
				return response.data;
			});
			return request;
		},
		getEventsForBetId: function(betID) {
			var request = $http.get($rootScope.basePath+'/Event/getEventsForBetId/'+betID)
			.then(function(response) {
				return response.data;
			});
			return request;
		},
		getFriendEventsForUserId: function(userID) {
			var request = $http.get($rootScope.basePath+'/Event/getFriendEventsForUserID/'+userID)
			.then(function(response) {
				return response.data;
			});
			return request;
		},
		addEvent : function(event) {
			console.log(event);
			var request = $http.post($rootScope.basePath+'/Event/addEvent', $httpParamSerializer({event: event}), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
			.then(function(response) {
				console.log(response.data);
				return response.data;
			});
			return request;
		}
	}
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
			console.log('the bet status is '+betStatus);
			return betStatus;
		},
		checkBetImage: function(bet) {
			if(!bet) {
				return;
			}
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
				console.log(response.data);
				return response.data;
			});
			return request;
		},
		voteYes: function(userID, betID){
			var responseID = 1;
			var request = $http.post($rootScope.basePath+'/Bet/response/user/'+userID+'/bet/'+betID+'/reply/'+responseID)
			.then(function(response) {
				return response.data;
			});
			return request;
		},
		voteNo: function(userID, betID){
			var responseID = 2;
			var request = $http.post($rootScope.basePath+'/Bet/response/user/'+userID+'/bet/'+betID+'/reply/'+responseID)
			.then(function(response) {
				return response.data;
			});
			return request;
		},
		checkBetStatus: function(betID) {
			var request = $http.get($rootScope.basePath+'/Bet/refreshBetStatus/'+betID)
			.then(function(response) {
				console.log(response.data);
				return response.data;
			});
			return request;
		},
		updateBetStatus: function(betID, status) {
			var request = $http.post($rootScope.basePath+'/Bet/updateBetStatus/'+betID+'/status/'+status)
			.then(function(response) {
				console.log(response.data);
				return response.data;
			});
			return request;
		},

		addProof : function(proof) {
			console.log(proof);
			var request = $http.post($rootScope.basePath+'/Bet/addProof', $httpParamSerializer({proof: proof}), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
			.then(function(response) {
				console.log(response.data);
				return response.data;
			});
			return request;
		},

		getProof : function(betID) {

			var request = $http.get($rootScope.basePath+'/Bet/getProof/'+betID)
			.then(function(response) {
				console.log(response.data);
				return response.data;
			});
			return request;
		},
		submitVote : function(betID, userID, userRoleID, winnerID) {
			var request = $http.post($rootScope.basePath+'/Bet/'+betID+'/vote/user/'+userID+'/role/'+userRoleID+'/selected/'+winnerID)
			.then(function(response) {
				// console.log(response.data);
				return response.data;
			});
			return request;
		},

		getVotes : function(betID) {

			var request = $http.get($rootScope.basePath+'/Bet/getVotes/'+betID)
			.then(function(response) {
				console.log(response.data);
				return response.data;
			});
			return request;			
		},

		currencyWithdrawl : function(betID, userID, betAmount) {
			var request = $http.post($rootScope.basePath+'/Bet/withdrawl/bet/'+betID+'/user/'+userID+'/value/'+betAmount)
			.then(function(data) {
				console.log('in the currencyWithdrawl factory function then');
			});
			return request;
		}


	}
}]);
