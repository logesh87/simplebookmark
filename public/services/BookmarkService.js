module.exports = function ($http) {
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