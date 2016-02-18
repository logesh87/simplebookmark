angular.module('app')
    .controller('BookmarkCtrl', function($scope, $mdDialog, $mdMedia, BookmarkFactory) {
        var vm = this;
        vm.bookmarkList = [];
        vm.categories = [];
        
        vm.getBookmarks = function(){
            BookmarkFactory.getBookmarks()
            .then(function(res){
                console.log(res.data);
                vm.bookmarkList = res.data;
            }, function(res ){
                console.log(res);
            })
        }; 
        
        vm.getCategories = function(){
            BookmarkFactory.getCategories()
            .then(function(res){                
                vm.categories = res.data;
                vm.categories.push({"_id":"0", "category_type":"Custom"});
            }, function(res ){
                console.log(res);
            })
        }; 
        
        vm.updateBookmark = function(bookmark){
             BookmarkFactory.updateBookmark(bookmark)
            .then(function(res){      
                vm.getBookmarks();          
                console.log(res.data);               
            }, function(res ){
                console.log(res);
            })
        };
        
        vm.deleteBookmark = function(cid, bid){
            var data = {
                "categoryId": cid,
                "bookmarkId": bid
            };
            
            BookmarkFactory.deleteBookmark(data)
            .then(function(res){      
                vm.getBookmarks();    
                   
                console.log(res.data);               
            }, function(res ){
                console.log(res);
            })
        };
        
        vm.deleteCategory = function(cid){
            var data = {
                "categoryId": cid                
            };
            
            BookmarkFactory.deleteCategory(data)
            .then(function(res){      
                vm.getBookmarks(); 
                vm.getCategories();            
                console.log(res.data);               
            }, function(res ){
                console.log(res);
            })
        }
        
        vm.getBookmarks();
         vm.getCategories();
        
        vm.saveBookmark = function(category){
            var data;
                       
            if( category.categoryId && category.categoryId != "0" ){
                
                data = {
                    "id": category.categoryId,                    
                    "bookmark":{
                        "name": category.bookmarkName,
                        "uri":  category.uri
                    }
                };
                
                BookmarkFactory.updateBookmarkWithCategory(data)
                .then(function(res){
                    console.log(res);
                    vm.getBookmarks();
                }, function(res){
                    console.log(res);
                });
                    
            }else{
                data = {
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
                        vm.getCategories();
                    }, function(res){
                        console.log(res);
                    });
            }
            
            
        };
        
        

        vm.openCategoryModal = function(ev, bookmark, cId) {
          
            $mdDialog.show({
                    controller: DialogController,
                    //controllerAs: 'ctrl',
                    templateUrl: '../../views/CreateCategory.html',
                    locals: {
                       items:{
                           saveBookmark: vm.saveBookmark,
                           categories: vm.categories,
                           updateBookmark:vm.updateBookmark,
                           bookmark: bookmark,
                           categoryId:cId
                       } 
                    }, 
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function() {
                   
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

    });

function DialogController($scope, $mdDialog, items) {
    
    if(items.bookmark){
        $scope.editBookmark = true;
        $scope.category = {
            bookmarkId:"",
            bookmarkName: "",
            uri:""
        };
        $scope.category.bookmarkId = items.bookmark._id;
        $scope.category.bookmarkName = items.bookmark.name;
        $scope.category.uri = items.bookmark.uri;        
        console.log($scope.selectedBookmark);
    }else if(items.categoryId){
        $scope.addBookmark = true;
    }else{
      $scope.editBookmark = false;  
      $scope.addBookmark = false;
    }
    
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
        if($scope.editBookmark){            
            items.updateBookmark($scope.category)
        }else{
            
            if(items.categoryId){                
                data.categoryId = items.categoryId
            }
            
            items.saveBookmark(data);    
        }
        
        $mdDialog.hide();
    };    
    
    $scope.selectCategory = function(){
        //console.log($scope.category.category_id);
       // $scope.selectedCategory = angular.fromJson($scope.selectedCategory);
    }
    
    $scope.categories = items.categories;
    
}
