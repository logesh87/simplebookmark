angular.module('app')
	.factory('BookmarkFactory', function ($http) {					
		return {
			getBookmarks: function(){
				return $http({
					method:'GET',
					url:'/bookmarks',
				});
			},
			postBookmark: function(bookmark){
				return $http({
					url:'/bookmark',
                    method:'POST',
                    data:bookmark
					
				});

			},
			updateBookmark: function(bookmark_id){
				return $http({
					method:'PUT',
					url:'/bookmark',
					data: bookmark_id
				});

			},
			deleteBookmark: function(bookmark_id){
				return $http({
					method:'DELETE',
					url:'/bookmark',
					data:bookmark_id
				});

			}
			
		};
	})