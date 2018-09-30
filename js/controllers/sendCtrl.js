/* 沪深送财 */
mainModule.controller('sendCtrl', ['$rootScope','$scope','$filter','$location','$localStorage',function($rootScope,$scope,$filter,$location,$localStorage) {
	$rootScope.title = '沪深送财，10,000,000现金大放送';
		if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined){
			$localStorage.webFormPath = $location.$$search;
		};
		$scope.gotoLoginPage = function (type) {
			$filter("跳转页面")(type,'send','zhuce');
		};
		
	
}])


