/*@ngInject*/ 
module.exports = function ($scope, $location, $auth, ToastService, spinnerService) {
    var vm = this;

    vm.login = function () {
        spinnerService.show('booksSpinner');
        $auth.login(vm.user)
            .then(function () {
                console.log('You have successfully signed in!');
                spinnerService.hide('booksSpinner');
                $location.path('/');
            })
            .catch(function (error) {
                spinnerService.hide('booksSpinner');
                ToastService.showToast(error.data.message);
                console.log(error.data.message, error.status);
            });
    };

}



