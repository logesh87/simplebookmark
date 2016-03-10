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
        Upload.upload({
            url: '/updateBookmark', //webAPI exposed to upload the file                
            data: { file: bookmark.favicon, 
                bookmarkId: bookmark.bookmarkId, bookmarkName: bookmark.bookmarkName, 
                bookmarkUri: bookmark.uri, resetFavicon: bookmark.resetFavicon                
            } 
        }).then(function (resp) { //upload function returns a promise
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

        BookmarkFactory.deleteBookmark(data)
            .then(function (res) {
                vm.getBookmarks();

                console.log(res.data);
            }, function (res) {
                console.log(res);
            })
    };

    vm.deleteCategory = function (cid) {
        var data = {
            "categoryId": cid
        };

        BookmarkFactory.deleteCategory(data)
            .then(function (res) {
                vm.getBookmarks();
                vm.getCategories();
                console.log(res.data);
            }, function (res) {
                console.log(res);
            })
    }

    vm.getBookmarks();
    vm.getCategories();

    vm.saveBookmark = function (category) {
        if (category.categoryId && category.categoryId != "0") {
            Upload.upload({
                url: '/bookmark_with_cat', //webAPI exposed to upload the file                
                data: { file: category.favicon, categoryId: category.categoryId, bookmarkId: category.bookmarkId, 
                bookmarkName: category.bookmarkName, bookmarkUri: category.uri, resetFavicon: category.resetFavicon },                
            }).then(function (resp) { //upload function returns a promise
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

            Upload.upload({
                url: '/bookmark', //webAPI exposed to upload the file                
                data: { file: category.favicon, category_type: category.categoryName, bookmarkName: category.bookmarkName, 
                bookmarkUri: category.uri, resetFavicon: category.resetFavicon }
            }).then(function (resp) { //upload function returns a promise
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
            //controllerAs: 'ctrl',
            templateUrl: '../../partials/CreateCategory.html',
            locals: {
                items: {
                    saveBookmark: vm.saveBookmark,
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

            items.saveBookmark($scope.category);
        }

        $mdDialog.hide();
    };

    $scope.selectCategory = function () {
        //console.log($scope.category.category_id);
        // $scope.selectedCategory = angular.fromJson($scope.selectedCategory);
    }

    $scope.categories = items.categories;

}
