// angular.module('uBet', ['ionic'])

app.controller('profileController', ['$rootScope','$scope', '$state', 'profileFactory', 'betFactory', 'eventFactory', /*'currentUser',*/ 'authFactory', 'fileUpload', function($rootScope, $scope, $state, profileFactory, betFactory, eventFactory, authFactory,/*currentUser,*/ fileUpload){
	$scope.logout = function() {
		localStorage.removeItem('user');
		$state.go('tabs.feed');
	}

	var pc = this;
	console.log('instance');
	pc.rootImagePath = $rootScope.imagePath;
	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
	    viewData.enableBack = true;
	});

	$scope.$on('$ionicView.beforeEnter', function() {
	    pc.currentUser = JSON.parse(localStorage.getItem('user'));
	    console.log(pc.currentUser);

	    pc.activeBets = [];
	    pc.archivedWins = [];
	    pc.archivedLosses = [];

	    pc.userEvents = [];

	    console.log(pc.currentUser.profile_image);

		if(pc.currentUser.profile_image == null) {
			pc.currentUser.profile_image = 'default-profile.png';
		} else {
			pc.currentUser.profile_img = pc.currentUser.profile_image;
		}
		if(pc.currentUser.profile_img == null) {
			pc.currentUser.profile_img = 'default-profile.png';
		}
		betFactory.getAllBets(pc.currentUser.user_id)
		.then(function(data) {
			for (var i = 0; i < data.length; i++) {
				if(data[i].bet_status == 1 || data[i].bet_status == '1') {
					pc.activeBets.push(data[i]);
				}
				else {
					if(data[i].winner_id == pc.currentUser.user_id) {
						pc.archivedWins.push(data[i]);
					}
					else { 
						pc.archivedLosses.push(data[i]);
					}
				}
			}

		});

		eventFactory.getEventsForUserId(pc.currentUser.user_id)
		.then(function(data) {
			pc.userEvents = data;
		});
	});

	pc.maxDate = new Date();


	pc.test = function() {
		alert('called');
	}


	pc.uploadFile = function(){

        var file = pc.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = $rootScope.basePath+'/User/do_upload/'+pc.currentUser.user_id;
        fileUpload.uploadFileToUrl(file, uploadUrl);

        authFactory.getUser(pc.currentUser.user_id)
	    pc.currentUser = JSON.parse(localStorage.getItem('user'));
    };

	pc.updateProfile = function(user) {

	}

    pc.myBlur = function(value) {
    	pc.currentUser = JSON.parse(localStorage.getItem('user'));

    	profileFactory.updateFname(value)
    	.then(function(data) {
    		var updatedUser = {
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
    		if(updatedUser.user_id) {
    			alert('there is a returned user id');
    			localStorage.removeItem('user');
    			localStorage.setItem('user', JSON.stringify(updatedUser));
    			pc.currentUser = updatedUser;

    		}
    	})

    }

}]);


app.factory('profileFactory', ['$rootScope','$http', '$httpParamSerializer', function($rootScope, $http, $httpParamSerializer) {
	return {
		getUser : function() {
				var request = $http.get($rootScope.basePath+'/Login/test')
				.success(function(data) {
					if(data.profile_img == null) {
						data.profile_img = 'default-profile.png';
					}
				})
				.error(function(data) {
					alert('failure');
				});
				return request;
			},
			checkProfileImage: function(user) {
				if(user.profile_image == null) {
					user.profile_image = 'default-profile.png';
					return user.profile_image;
				}
				return;
			},

			updateFname : function(newName) {
				var activeUser = JSON.parse(localStorage.getItem('user'));
				var activeUserID = activeUser.user_id;
				// alert(activeUserID);
				var updatedInfo = {
					fname : newName
				}
				var request = $http.post($rootScope.basePath+'/User/update', $httpParamSerializer({user: activeUser, updatedInfo : updatedInfo}), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
					.success(function(data) {

				});
				return request;
			}

		}


	
}]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('fileUpload', ['$http', '$httpParamSerializer', function ($http, $httpParamSerializer) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        console.log(file);
        fd.append('file', file);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
    
        .success(function(data){
        })
        .error(function(){
        });
    }
}]);