
/* 翻倍券 */
mainModule.controller('doublegiftCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService',function($rootScope,$scope,$location,$localStorage,$filter,resourceService) {
	$rootScope.title = '三重壕礼';
	if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined){
		$localStorage.webFormPath = $location.$$search;
	};
	if (!$filter('isRegister')().register) {
		$scope.login = false;
	} else {
		$scope.login = true;
	}
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