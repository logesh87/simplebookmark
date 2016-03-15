/*@ngInject*/
module.exports = function ($http) {
    return {
        getUsers :  function(){
            return $http.get('/users');
        },
        deleteUser: function(userId){
            return $http({
                method: 'DELETE',
                url: '/user',
                data: {userId: userId},
                headers: { "Content-Type": "application/json;charset=utf-8" }
            });
        }
    }
};