var _ = require('underscore');

/*@ngInject*/ 
module.exports = function ($scope, $mdDialog, $mdMedia, BookmarkFactory, Upload) {
    var vm = this;
    vm.bookmarkList = [];
    vm.categories = [];

    vm.getBookmarks = function () {
        BookmarkFactory.getBookmarks()
            .then(function (res) {
                console.log(res.data);
                vm.bookmarkList = res.data;
            }, function (res) {
                console.log(res);
            })
    };

    vm.getCategories = function () {
        BookmarkFactory.getCategories()
            .then(function (res) {
                vm.categories = res.data;
                vm.categories.push({ "_id": "0", "category_type": "Custom" });
            }, function (res) {
                console.log(res);
            })
    };

    vm.updateBookmark = function (bookmark) {    
        BookmarkFactory.updateBookmark(bookmark)
        .then(function (resp) { //upload function returns a promise
            console.log(resp);
            vm.getBookmarks();                         
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);          
        });
    };

    vm.deleteBookmark = function (cid, bid) {
        var data = {
            "categoryId": cid,
            "bookmarkId": bid
        };
        
         var confirm = $mdDialog.confirm()
                .title('Would you like to delete this bookmark?')
                .textContent('This bookmark will be deleted permanently')
                .ariaLabel('Lucky day')                
                .ok('Please do it!')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                 
                 BookmarkFactory.deleteBookmark(data)
                    .then(function (res) {
                        
                        _.each(vm.bookmarkList, function(item, idx) {      
                            var i = _.findIndex(item.bookmarks, {_id: bid})
                            if (i !== -1) {
                                item.bookmarks.splice(i, 1);    
                            }                                                                          
                        });                                                                    
                      
                       console.log(res.data);
                    }, function (res) {
                        console.log(res);
                    })
            }, function() {
                 
            });

      
    };

    vm.deleteCategory = function (cid) {
            var data = {
                "categoryId": cid
            };              
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete this category?')
                .textContent('All the bookmarks under this category will be deleted permanently')
                .ariaLabel('Lucky day')                
                .ok('Please do it!')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                
                BookmarkFactory.deleteCategory(data)
                    .then(function (res) {
                        var i = _.findIndex(vm.bookmarkList, {_id: cid})                                                        
                        if (i !== -1) {
                            vm.bookmarkList.splice(i, 1);    
                        }                                                                                              
                        vm.getCategories();
                        console.log(res.data);
                    }, function (res) {
                        console.log(res);
                    });
                    
            }, function() {
                 
            });
        

    }

    vm.getBookmarks();
    vm.getCategories();

    vm.saveCategory = function (category) {
        if (category.categoryId && category.categoryId != "0") {
            BookmarkFactory.addBookmarkToCategory(category)
            .then(function (resp) { //upload function returns a promise
                console.log(resp);
                vm.getBookmarks();
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);                                
            });
        } else {
            BookmarkFactory.addNewCategory(category)
            .then(function (resp) { //upload function returns a promise
                console.log(resp);
                vm.getBookmarks();
                vm.getCategories();
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);               
            });

        }

    };


    vm.openCategoryModal = function (ev, bookmark, cId) {

        $mdDialog.show({
            controller: DialogController,            
            templateUrl: '../../partials/CreateCategory.html',
            locals: {
                items: {
                    saveCategory: vm.saveCategory,
                    categories: vm.categories,
                    updateBookmark: vm.updateBookmark,
                    bookmark: bookmark,
                    categoryId: cId
                }
            },
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
            .then(function () {

            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
    };

}

/*@ngInject*/ 
function DialogController($scope, $mdDialog, items, Upload, $window) {

    if (items.bookmark) {
        $scope.editBookmark = true;
        $scope.category = {
            bookmarkId: "",
            bookmarkName: "",
            uri: ""
        };
        $scope.category.bookmarkId = items.bookmark._id;
        $scope.category.bookmarkName = items.bookmark.name;
        $scope.category.uri = items.bookmark.uri;
        $scope.category.favicon = items.bookmark.favicon;
        //$scope.category.resetFavicon = items.bookmark.resetFavicon;
        console.log($scope.selectedBookmark);
    } else if (items.categoryId) {
        $scope.addBookmark = true;
    } else {
        $scope.editBookmark = false;
        $scope.addBookmark = false;
    }

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
    
    
    $scope.save = function () {
        if ($scope.editBookmark) {
            items.updateBookmark($scope.category)
        } else {

            if (items.categoryId) {
                $scope.category.categoryId = items.categoryId
            }

            items.saveCategory($scope.category);
        }

        $mdDialog.hide();
    };

    $scope.selectCategory = function () {
        //console.log($scope.category.category_id);
        // $scope.selectedCategory = angular.fromJson($scope.selectedCategory);
    }

    $scope.categories = items.categories;

}
