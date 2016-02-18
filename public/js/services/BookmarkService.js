angular.module('app')
	.factory('BookmarkFactory', function ($http) {					
		return {
			getBookmarks: function(){
				return $http({
					method:'GET',
					url:'/bookmarks',
				});
			},
            getCategories: function(){
				return $http({
					method:'GET',
					url:'/categories',
				});
			},
			postBookmark: function(bookmark){
				return $http({
					url:'/bookmark',
                    method:'POST',
                    data:bookmark
					
				});

			},
            updateBookmark: function(bookmark){
				return $http({
					method:'PUT',
					url:'/update_bookmark',
					data: bookmark
				});

			},            
			updateBookmarkWithCategory: function(bookmark){
				return $http({
					method:'PUT',
					url:'/bookmark',
					data: bookmark
				});

			},
			deleteBookmark: function(data){
				return $http({
					method:'DELETE',
					url:'/bookmark',
					data:data,
                    headers: {"Content-Type": "application/json;charset=utf-8"}
				});

			},
            deleteCategory: function(data){
				return $http({
					method:'DELETE',
					url:'/category',
					data:data,
                    headers: {"Content-Type": "application/json;charset=utf-8"}
				});

			}
			
		};
	})