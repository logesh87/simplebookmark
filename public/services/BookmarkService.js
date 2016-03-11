/*@ngInject*/ 
module.exports = function ($http, Upload) {
    return {
        getBookmarks: function () {
            return $http({
                method: 'GET',
                url: '/bookmarks',
            });
        },
        getCategories: function () {
            return $http({
                method: 'GET',
                url: '/categories',
            });
        },
        updateBookmark: function(bookmark){
            return Upload.upload({
                url: '/updateBookmark', //webAPI exposed to upload the file                
                data: { file: bookmark.favicon, 
                        bookmarkId: bookmark.bookmarkId, bookmarkName: bookmark.bookmarkName, 
                        bookmarkUri: bookmark.uri, resetFavicon: bookmark.resetFavicon } 
            });
        },
        addBookmarkToCategory:function(category){
             return Upload.upload({
                url: '/bookmark_with_cat', //webAPI exposed to upload the file                
                data: { file: category.favicon, categoryId: category.categoryId, bookmarkId: category.bookmarkId, 
                bookmarkName: category.bookmarkName, bookmarkUri: category.uri, resetFavicon: category.resetFavicon }               
            })  
        },       
        addNewCategory:function(category){
            return Upload.upload({
                url: '/bookmark',         
                data: { file: category.favicon, category_type: category.categoryName, bookmarkName: category.bookmarkName, 
                bookmarkUri: category.uri, resetFavicon: category.resetFavicon }
            })  
        },
        deleteBookmark: function (data) {
            return $http({
                method: 'DELETE',
                url: '/bookmark',
                data: data,
                headers: { "Content-Type": "application/json;charset=utf-8" }
            });

        },
        deleteCategory: function (data) {
            return $http({
                method: 'DELETE',
                url: '/category',
                data: data,
                headers: { "Content-Type": "application/json;charset=utf-8" }
            });

        }

    };
}