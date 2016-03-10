require('ngmaterial');
require('ngloadingbar');
require('maincss');
module.exports = function ($scope, $auth, $mdToast) {
    $scope.isAuthenticated = function () {
        return $auth.isAuthenticated();
    };

 

};
    