

/* 安全保障 */
mainModule.controller('guaranteeCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService',function($rootScope,$scope,$location,$localStorage,$filter,resourceService) {
	$rootScope.title = '安全保障-沪深理财';
	if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined){
		$localStorage.webFormPath = $location.$$search;
	};
	if($location.$$search.menuName != undefined){
		var obj={};
		obj.name=$location.$$search.menuName;
		$rootScope.$broadcast('myEvent.WHDR_Ctrl',obj);
    }
	if (!$filter('isRegister')().register) {
		$scope.login = false;
	} else {
		$scope.login = true;
	}
	$rootScope.activeNav = 'help';
	/*退出*/
	$scope.userOut = function (event) {
		$filter('清空缓存')();
		resourceService.queryPost($scope,$filter('交互接口对照表')('退出接口'),{},'退出');

		if($location.$$url.indexOf('myAccount') != -1){
			$filter("跳转页面")('denLu','main.myAccount.accountHome','dl');
		};
	};
	$scope.gotoLoginPage = function() {
		$filter("clickTouZiGotoWhere")($scope,'main.myAccount.accountHome');
	};

}])