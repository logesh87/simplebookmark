angular.module('app', ['ui.router', 'ngMaterial', 'ngMessages', 'angular-loading-bar'])
.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise("/home");
  
  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "/views/home.html",
      controller:"BookmarkCtrl",
      controllerAs:"vm"
    })
  
});