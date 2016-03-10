/*@ngInject*/
module.exports = function ($scope, $auth, $mdToast) {
    $scope.isAuthenticated = function () {
        return $auth.isAuthenticated();
    };

 

};