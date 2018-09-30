
/* cp66 */
mainModule.controller('cp66Ctrl', ['$rootScope','$scope','$filter','resourceService','$localStorage','$location', function($rootScope,$scope,$filter,resourceService,$localStorage,$location) {
	$rootScope.title = '新手活动';
	$scope.gotoTop = function() {
        $('html,body').animate({scrollTop: 0}, 300);
	}
}]);

