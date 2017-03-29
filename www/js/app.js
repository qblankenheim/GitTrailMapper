var module = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {

      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  })
})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){
  $stateProvider
  .state('tabs',{
    url:'/tabs',
    abstract:true,
    templateUrl:'templates/tabs.html'
  })
  .state('tabs.home',{
    url:"/home",
    views: {
      'home':{
        templateUrl: "templates/home.html",
        controller:  'homeCtrl'
      }
    }
  })
  .state('tabs.maps',{
    url:"/maps",
    views:{
      'maps':{
        templateUrl:"templates/maps.html",
        controller: 'mapsCtrl'
      }
    }
  })
  .state('tabs.comm',{
    url:"/comm",
    views:{
      'community':{
        templateUrl:"templates/community.html",
        controller: 'commCtrl'
      }
    }
  })
  $urlRouterProvider.otherwise("/tabs/home");
  $ionicConfigProvider.tabs.position('bottom');
})
