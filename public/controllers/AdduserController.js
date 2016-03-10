module.exports = function ($scope, $location, $auth, ToastService) {
    var vm = this;
    vm.signup = function () {
        $auth.signup(vm.user)
            .then(function (response) {
                $auth.setToken(response);
                $location.path('/');
                console.log('You have successfully created a new account and have been signed-in');
            })
            .catch(function (response) {
                ToastService.showToast(response.data.message)
                console.log(response.data.message);
            });
    };
}
