mainModule.controller('JSpc1208Ctrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService',function($rootScope,$scope,$location,$localStorage,$filter,resourceService) {
	$rootScope.title = '沪深理财邀请返利';

	if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined){
		$scope.toForm = $location.$$search;
	};

}])
