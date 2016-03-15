var _ = require('underscore');

/*@ngInject*/
module.exports = function ($scope, $location, $auth, ToastService, spinnerService, UsersService) {
    var vm = this;
    vm.users = [];
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

    vm.getUsers = function () {
        spinnerService.show('booksSpinner');
        UsersService.getUsers()
            .success(function (res) {
                vm.users = res;
                spinnerService.hide('booksSpinner');
            })
            .error(function (res) {
                console.log(res);
                spinnerService.hide('booksSpinner');
            })
    };

    vm.deleteUser = function (userId) {
        spinnerService.show('booksSpinner');
        UsersService.deleteUser(userId)
            .success(function (res) {
                console.log(res);
                var i = _.findIndex(vm.users, {_id: userId})                                                        
                if (i !== -1) {
                    vm.users.splice(i, 1);    
                } 
                spinnerService.hide('booksSpinner');
            })
            .error(function (res) {
                console.log(res);
                spinnerService.hide('booksSpinner');
            })
    };

    vm.getUsers();
}
