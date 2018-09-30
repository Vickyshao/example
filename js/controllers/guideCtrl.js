/* 注册引导 */
mainModule.controller('guideCtrl', ['$location','$rootScope','$localStorage','$scope','$http','resourceService','$filter',function($location,$rootScope,$localStorage,$scope,$http,resourceService,$filter) {
	if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined){
		$localStorage.webFormPath = $location.$$search;
	};
	$rootScope.title = '春暖花开季，沪深送万金';
	$scope.gotoLoginPage = function (type) {
		if (type == '好友') {
			$filter("跳转页面")('','newGuide','newFriend');
		} else {
			$filter("跳转页面")(type,'newGuide','zhuce');
		}
	};
}])