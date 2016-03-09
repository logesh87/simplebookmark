require('ngmaterial');
require('ngloadingbar');
require('maincss');
module.exports = function ($scope, $auth) {
    $scope.isAuthenticated = function () {
        return $auth.isAuthenticated();
    };
};
    