/*@ngInject*/ 
module.exports = function ($scope, $location, $auth, ToastService, spinnerService) {
    var vm = this;
    vm.signup = function () {
        spinnerService.show('booksSpinner');
        $auth.signup(vm.user)
            .then(function (response) {
                $auth.setToken(response);
                $location.path('/');
                spinnerService.hide('booksSpinner');
                console.log('You have successfully created a new account and have been signed-in');
            })
            .catch(function (response) {
                ToastService.showToast(response.data.message);
                spinnerService.hide('booksSpinner');
                console.log(response.data.message);
            });
    };
}
