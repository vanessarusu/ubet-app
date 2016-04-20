app.controller('homeController', ['$scope', '$rootScope', '$state', 'eventFactory', function($scope, $rootScope, $state, eventFactory){
	$scope.logout = function() {
		localStorage.removeItem('user');
		$state.go('tabs.feed', {}, {reload: true});
	}
	var hc = this;

	$scope.$on('$ionicView.beforeEnter', function() {
	    hc.currentUser = JSON.parse(localStorage.getItem('user'));
	    console.log(hc.currentUser);
	    hc.homeEvents = [];
	    
		eventFactory.getFriendEventsForUserId(hc.currentUser.user_id)
		.then(function(data) {
			console.log(data);
			hc.homeEvents = [];
			if(data.length != 0) {
				console.log('made it');
				hc.homeEvents = data;
			}
		});
	});

}]);