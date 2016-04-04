// angular.module('uBet', ['ionic'])

app.controller('profileController', ['$rootScope','$scope', '$state', 'profileFactory', /*'currentUser',*/ 'fileUpload', function($rootScope, $scope, $state, profileFactory, /*currentUser,*/ fileUpload){
	var pc = this;
	console.log('instance');

	$scope.$on('$ionicView.beforeEnter', function() {
	    pc.currentUser = JSON.parse(localStorage.getItem('user'));

		if(pc.currentUser.profile_img == null) {
			pc.currentUser.profile_img = 'default-profile.png';
		}
	});
	// console.log(currentUser.data);
	// pc.currentUser = currentUser;
	// console.log(pc.currentUser.fname + ' when loading');
	
	// pc.currentUser = localStorage.getItem('user');
	// console.log(currentUser.fname);
	// console.log(JSON.parse(currentUser));
	// pc.currentUser = $rootScope.user.data;


	// pc.reloadProfile = function() {
	// 	$state.go('tabs.profile')
	// 	.then(function(){
	// 		$state.reload();
	// 	})
	// 	// $state.reload();
	// }
	

	// console.log($rootScope.user);
	// if(profileInstance.currentUser.profile_img == null) {
	// 	alert('there is no profile image');
	// 	profileInstance.currentUser.profile_img = 'default-profile.png';
	// }
	// pc.uploadFile = function() {
	// 	console.log('in uploadFile');
	// 	var file = pc.myFile;
	// 	console.log('file is '+ file);
	// 	var uploadUrl = 'http://localhost/ubet-app/testUploads';
	// 	fileUpload.uploadFileToUrl(file, uploadUrl);
	// }
	// var uploadFile = function() {
	// 	alert('in the var upload file');
	// }
	// $scope.uploadFile = function() {
	// 	alert('in the scope upload');
	// }

	pc.test = function() {
		alert('called');
		console.log('called');
	}


	pc.uploadFile = function(e){
		// alert("Your cookie: " + document.cookie);
		e.preventDefault();
		// alert('in file upload');
        var file = pc.myFile;
        var uploadUrl = $rootScope.basePath+'/User/do_upload';
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };

	pc.updateProfile = function(user) {
		console.log('calling updateProfile');
		// pc.currentUser = JSON.parse(localStorage.getItem('user'));
		console.log(user);

		// profileFactory.updateDetails(user)
		// .then(function(data){
			// console.log(data);
		// });

	}

    pc.myBlur = function(value) {
    	console.log('calling blur');
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
						currency: data.data.curr

					};
					// console.log(updatedUser);
				// return updatedUser;
    		// console.log(returnedUserData);
    		if(updatedUser.user_id) {
    			alert('there is a returned user id');
    			localStorage.removeItem('user');
    			localStorage.setItem('user', JSON.stringify(updatedUser));
    			pc.currentUser = updatedUser;
    			console.log(updatedUser.fname +' after updating');
    			// console.log(pc.currentUser + ' is the current user before getting');
    			// pc.currentUser = JSON.parse(localStorage.getItem('user'));
    			// console.log(pc.currentUser + ' is the current user after getting');
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
					console.log('error '+data);
					alert('failure');
				});
				return request;
			},
			// updateFname : function(newName) {
			// 	alert(newName);
			// 	var activeUser = JSON.parse(localStorage.getItem('user'));
			// 	var activeUserID = activeUser.user_id;
			// 	// JSON.parse(activeUser);
			// 	console.log( activeUser.fname + ' is the active user');


			// 	// var request = $http.post($rootScope.basePath+'/Login/login', $httpParamSerializer({user: user}), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
			// 	var request = $http.post($rootScope.basePath+'/User/updateFName/', $httpParamSerializer({user: activeUserID, newName: newName}), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
			// 	.success(function(data) {
			// 		console.log(data);
			// 	})
			// 	// .error(function(data) {
			// 	// 	console.log('error in update fname return');
			// 	// });
			// 	// return request;
			// 	return null;
			// },
			updateFname : function(newName) {
				var activeUser = JSON.parse(localStorage.getItem('user'));
				var activeUserID = activeUser.user_id;
				// alert(activeUserID);
				var updatedInfo = {
					fname : newName
				}
				var request = $http.post($rootScope.basePath+'/User/update', $httpParamSerializer({user: activeUser, updatedInfo : updatedInfo}), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
					.success(function(data) {
						// console.log(data);
				// 		var updatedUser = {
				// 		user_id: data.data.user_id,
				// 		fname: data.data.fname,
				// 		lname: data.data.lname,
				// 		username: data.data.username,
				// 		email: data.data.email,
				// 		profile_image : data.data.profile_image,
				// 		birthdate: data.data.birthdate,
				// 		city: data.data.city,
				// 		country: data.data.country,
				// 		currency: data.data.curr

				// 	};
				// 	console.log(updatedUser);
				// return updatedUser;
				// return 'hello';
				});
				return request;
			}

			// updateDetails : function(user) {
			// 	var activeUser = JSON.parse(localStorage.getItem('user'));
			// 	var activeUserID = activeUser.user_id;
			// 	// alert(activeUserID);
			// 	var updatedInfo = {
			// 		fname : newName
			// 	}
			// }
		}

		// updateFname : function() {
			// var request = $http.get($rootScope.basePath+'/User/')
		// }


	
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
        // console.log(file);
        // console.log(fd.getAll('file'));
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        // var req = {
        // 	method: 'POST',
        // 	url: uploadUrl,
        // 	headers: {
        // 		'Content-Type' : 'application/x-www-form-urlencoded'
        // 	},
        // 	data: $httpParamSerializer(fd)
        // };
        // $http(req)
        // $http.post(uploadUrl, $httpParamSerializer(fd))
        // $http.post(uploadUrl, $httpParamSerializer({'file':file}))
        // $http.post(uploadUrl, "data=" + encodeURIComponent(fd))
        .success(function(data){
        	console.log(data);
        })
        .error(function(){
        });
    }
}]);