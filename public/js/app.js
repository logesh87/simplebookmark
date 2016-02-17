angular.module('app', ['ui.router', 'ngMaterial', 'ngMessages'])
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