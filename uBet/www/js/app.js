// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('uBet', ['ionic', 'ngMessages', 'ionic-datepicker', 'ngPassword'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        console.log('running');
        if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
    
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

app.run(['$rootScope', '$state', function($rootScope, $state) {
  // localStorage.removeItem('user');
    $rootScope.basePath = 'http://localhost/ubet-app/index.php';
    $rootScope.user = false;
    $rootScope.$state = $state;
    $rootScope.$on('$stateChangeStart', function(e, toState, fromState, toParams, fromParams, options) {
        console.log(toState.name);
        // console.log(localStorage.getItem('user'));

        // e.preventDefault();

        //if we are NOT going to the home state or the register state (so if we are going to any other state)
        // check to see if there is a user stored in local storage (this gets set on login function)
        // if there is no user stored, go to the home state

        if(toState.name!=='home' && toState.name!=='register') {

          if(!localStorage.getItem('user')) {
            e.preventDefault();
            $state.go('home');
          }
        }

        // if we are trying to go to the home state or the register state
        // check to see if there is a user stored in local storage
        // if there is a user, go to the main page you should see when logged in

        if(toState.name =='home' || toState.name =='register') {
            if(localStorage.getItem('user')) {
                e.preventDefault();
                $state.go('tabs.feed');
            }
        }
    });
}]);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider){

// $httpProvider.defaults.useXDomain = true;
    // $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

    /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  // var param = function(obj) {
  //   var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
  //   for(name in obj) {
  //     value = obj[name];
        
  //     if(value instanceof Array) {
  //       for(i=0; i<value.length; ++i) {
  //         subValue = value[i];
  //         fullSubName = name + '[' + i + ']';
  //         innerObj = {};
  //         innerObj[fullSubName] = subValue;
  //         query += param(innerObj) + '&';
  //       }
  //     }
  //     else if(value instanceof Object) {
  //       for(subName in value) {
  //         subValue = value[subName];
  //         fullSubName = name + '[' + subName + ']';
  //         innerObj = {};
  //         innerObj[fullSubName] = subValue;
  //         query += param(innerObj) + '&';
  //       }
  //     }
  //     else if(value !== undefined && value !== null)
  //       query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
  //   }
      
  //   return query.length ? query.substr(0, query.length - 1) : query;
  // };
 
  // // Override $http service's default transformRequest
  // $httpProvider.defaults.transformRequest = [function(data) {
  //   return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  // }];






























    $urlRouterProvider.otherwise('/')
    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: 'partials/login.html',
        controller: 'loginController',
        controllerAs: 'welcome'
    })
    .state('register', {
        url: '/register',
        templateUrl: 'partials/register.html',
        controller: 'loginController',
        controllerAs: 'welcome'
    })

  .state('tabs', {
      url: '/tab',
      abstract: true,
      templateUrl: 'partials/tabs.html'
    })
    .state('tabs.feed', {
      url: '/home',
      views: {
        'feed-tab': {
          templateUrl: 'partials/home.html',
          // controller: 'HomeTabCtrl'
        }
      }
    })



    .state('tabs.profile', {
      url: '/profile',
      // cache: false,
      // params: { updater : 1}, 
      // resolve : {
      //   currentUser : function() {
      //     console.log('in controller resolve');
      //     console.log(JSON.parse(localStorage.getItem('user')));
      //     return JSON.parse(localStorage.getItem('user'));
      //   }
      // },
      views: {
        'profile-tab': {
          templateUrl: 'partials/profile.html',
          controller: 'profileController',
          controllerAs: 'profileInstance'
        }
      }
    })

    .state('tabs.edit-profile', {
        url: '/profile/edit',
        // resolve: {
        //     currentUser : function() {
        //       return JSON.parse(localStorage.getItem('user'));
        //     }
        // },
        views: {
            'profile-tab': {
                templateUrl: 'partials/profile-edit.html',
                controller: 'profileController',
                controllerAs: 'editProfileInstance'
            }
        }
    })

    // PROFILE SUB TABS --------------------------------------------------------

    .state('tabs.profile.activity', {
        url: '/profile/activity',
        templateUrl: 'partials/profilePartials/activity.html'
    })

    .state('tabs.profile.bets', {
        url:'/profile/bets',
        templateUrl:'partials/profilePartials/bets.html'
    })
    .state('tabs.profile.wins', {
        url:'/profile/wins',
        templateUrl:'partials/profilePartials/wins.html'
    })
    .state('tabs.profile.losses', {
        url:'/profile/losses',
        templateUrl:'partials/profilePartials/losses.html'
    })
    .state('tabs.profile.friends', {
        url:'/profile/friends',
        resolve: {
          viewMember: function(){return null;}
        },
        templateUrl:'partials/profilePartials/friends.html',
        controller: 'friendsController',
        controllerAs: 'profileFriendsInstance'
    })
    .state('tabs.profile.following', {
        url:'/profile/following',
        templateUrl:'partials/profilePartials/following.html'
    })





    .state('tabs.friends', {
      cache: false,
      url: '/friends',
      resolve: {
        viewMember: function(){return null;}
      },
      views: {
        'friends-tab': {
          templateUrl: 'partials/friends.html',
          controller: 'friendsController',
          controllerAs: 'friendsInstance'
        }
      }
    })

    // changed this
    .state('tabs.user', {
      url: '/friends/:userID',
      resolve: {
        viewMember: function($stateParams, friendsFactory) {
          return friendsFactory.getMember($stateParams.userID)
          .then(function(data) {
            if(data.profile_image === null) {
              data.profile_image = 'default-profile.png';
            }
            return data;
          });

        }
      },
      views: {
        'friends-tab': {
          templateUrl: 'partials/public-profile.html',
          controller: 'friendsController',
          controllerAs: 'friendProfileInstance'
        }
      }
      // templateUrl: 'partials/profilePartials/activity.html'
    })
    .state('tabs.user.activity', {
      url: '/friends/:userID/activity',
      templateUrl: 'partials/profilePartials/activity.html'
    })
    .state('tabs.user.bets', {
      url: '/friends/:userID/bets',
      templateUrl: 'partials/profilePartials/bets.html'
    })
    .state('tabs.user.wins', {
      url: '/friends/:userID/wins',
      templateUrl: 'partials/profilePartials/wins.html'
    })
    .state('tabs.user.losses', {
      url: '/friends/:userID/losses',
      templateUrl: 'partials/profilePartials/losses.html'
    })
    .state('tabs.user.friends', {
      url: '/friends/:userID/friends',
      templateUrl: 'partials/profilePartials/friends.html',
      controller: 'friendsController',
      controllerAs: 'profileFriendsInstance'
    })
    .state('tabs.user.following', {
      url: '/friends/:userID/following',
      templateUrl: 'partials/profilePartials/following.html'
    })

    .state('tabs.find-friends', {
      cache: false,
      url: '/friends/find-friends',
      resolve: {
        viewMember: function(){return null;}
      },
      views: {
        'friends-tab': {
          templateUrl: 'partials/find-friends.html',
          controller: 'friendsController',
          controllerAs: 'findFriendsInstance'
        }
      }
    })
    .state('tabs.bets', {
      url: '/bets',
      views: {
        'bets-tab': {
          templateUrl: 'partials/bets.html',
          controller: 'betController',
          controllerAs: 'betInstance'
        }
      }
    })
    .state('tabs.bet', {
      url: '/bets/:betID',
      views: {
        'bets-tab' : {
          templateUrl: 'partials/bet-page.html',
          controller: 'betController',
          controllerAs: 'betPageInstance'
        }
      }
    })



    // CREATE -----------------------------------------------------------------

    .state('tabs.create', {
      url: '/create',
      views: {
        'create-tab': {
          templateUrl: 'partials/createBet.html',
          controller: 'createBetController',
          controllerAs : 'cbInstance'
          // controller: 'HomeTabCtrl'
          // OLA
        }
      }
    })

    // CREATE SUB TABS --------------------------------------------------------

    .state('tabs.create.terms', {
        url: '/create/terms',
        templateUrl: 'partials/createBetPartials/terms.html'
    })

    .state('tabs.create.members', {
        url:'/create/members',
        templateUrl:'partials/createBetPartials/members.html'
    })
    .state('tabs.create.moderator', {
        url:'/create/moderator',
        templateUrl:'partials/createBetPartials/moderator.html'
    })
    .state('tabs.create.image', {
        url:'/create/image',
        templateUrl:'partials/createBetPartials/image.html'
    })
    .state('tabs.create.submit', {
        url:'/create/submit',
        templateUrl:'partials/createBetPartials/submit.html'
    });

}]);

