module.exports = function ($scope, $auth) {
    $scope.isAuthenticated = function () {
        return $auth.isAuthenticated();
    };
};
    