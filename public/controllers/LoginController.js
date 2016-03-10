module.exports = function ($scope, $location, $auth, ToastService) {
    var vm = this;

    vm.login = function () {
        $auth.login(vm.user)
            .then(function () {
                console.log('You have successfully signed in!');
                $location.path('/');
            })
            .catch(function (error) {
                ToastService.showToast(error.data.message);
                console.log(error.data.message, error.status);
            });
    };

}



