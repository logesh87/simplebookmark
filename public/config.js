
module.exports = function ($stateProvider, $urlRouterProvider, $authProvider) {

    $urlRouterProvider.otherwise("/home");

    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "/partials/home.html",
            controller: "BookmarkCtrl",
            controllerAs: "vm"
        })
        .state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl',
            controllerAs: "vm",
            resolve: {
                skipIfLoggedIn: skipIfLoggedIn
            }
        })
        .state('adduser', {
            url: '/add_user',
            templateUrl: 'partials/addUser.html',
            controller: 'AdduserCtrl',
            controllerAs: "vm",
            resolve: {
                loginRequired: loginRequired

            }
        })
        .state('logout', {
            url: '/logout',
            controller: 'LogoutCtrl',
            controllerAs: "vm",
        })

    function skipIfLoggedIn($q, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
            deferred.reject();
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
            deferred.resolve();
        } else {
            $location.path('/login');
        }
        return deferred.promise;
    }

};





