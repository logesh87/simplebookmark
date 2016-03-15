var angular = require('angular');
var app = angular.module('app', [
    require('angular-ui-router'), 
    require('angular-material'), 
    require('angular-messages'), 
    //require('angular-loading-bar'), 
    require('satellizer'),
    require('angular-animate'),
    require('ng-file-upload'),
    require('angular-spinners')
]);



app.config(require('./config'));
app.factory('BookmarkFactory', require('./services/BookmarkService.js'));
app.factory('ToastService', require('./services/ToastService.js'));
app.filter('favicon', require('./filters/faviconFilter.js'));
app.directive('passwordMatch', require('./directives/PasswordMatch.js'));
app.controller('MainCtrl', require('./controllers/MainController.js'));
app.controller('AdduserCtrl', require('./controllers/AdduserController.js'));
app.controller('BookmarkCtrl', require('./controllers/BookmarkController.js'));
app.controller('LoginCtrl', require('./controllers/LoginController.js'));
app.controller('LogoutCtrl', require('./controllers/LogoutController.js'));

angular.element(document).ready(function () {
  angular.bootstrap(document, ['app']);
});



    