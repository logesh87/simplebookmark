
module.exports = function ($mdToast) {
    return {
        showToast: function (msg, type) {
            $mdToast.show({
                template: '<md-toast class="md-toast error">' + msg + '</md-toast>',
                hideDelay: 2000,
                position: 'bottom right left'                                
            });             
        }
    }
}


