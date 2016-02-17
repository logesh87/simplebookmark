angular.module('app')
    .controller('BookmarkCtrl', function($scope, $mdDialog, $mdMedia, BookmarkFactory) {
        var vm = this;
        vm.bookmarks = [];
        
        vm.getBookmarks = function(){
            BookmarkFactory.getBookmarks()
            .then(function(res){
                console.log(res.data);
                vm.bookmarks = res.data;
            }, function(res ){
                console.log(res);
            })
        }; 
        
        vm.getBookmarks();
        
        vm.saveBookmark = function(category){
            
            var data = {
                "category_type" : category.categoryName,
                "bookmark":{
                    "name":category.bookmarkName,
                    "uri":  category.uri
                }
            };
                    
            BookmarkFactory.postBookmark(data)
                .then(function(res){
                    console.log(res);
                    vm.getBookmarks();
                }, function(res){
                    console.log(res);
                });
        };
        
        

        $scope.openCategoryModal = function(ev) {
            $mdDialog.show({
                    controller: DialogController,
                    //controllerAs: 'ctrl',
                    templateUrl: '../../views/CreateCategory.html',
                    locals: {
                       saveBookmark: vm.saveBookmark 
                    }, 
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

        vm.CreateCategory = function(){
        	console.log("hello");
        };

    });

function DialogController($scope, $mdDialog, saveBookmark) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
    
    $scope.save = function(data){
        saveBookmark(data);
    };
    
}
