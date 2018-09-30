mainModule.controller('actstorageinfoCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService','$state','ngDialog',function($rootScope,$scope,$location,$localStorage,$filter,resourceService,$state,ngDialog) {
	$rootScope.title = '银行存管正式上线';
	$scope.isLogin = $filter('isRegister')().register;

	$localStorage.activityUrl = 'storageInfo';

	// 监听退出是否成功
	$rootScope.$on('exitSuccess', function(event, flag) {
		if (flag) {
			$scope.isLogin = false;
		}
	});

	if($localStorage.user != undefined){
		$scope.uid = $localStorage.user.uid;
		resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},'首页主数据');
		resourceService.queryPost($scope, $filter('交互接口对照表')('存管账户信息'),{},'存管账户信息');
	}

	resourceService.queryPost($scope,$filter('交互接口对照表')('端午节活动'),{},'端午节活动');

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type) {
			case "首页主数据":
				$scope.user = data.map;
				if (data.map.realName == '' || data.map.realName == undefined) {
					$scope.user.userName = '亲爱的用户';
				} else {
					$scope.user.userName = data.map.realName;
				}
				$localStorage.user = $scope.user;
			break;
			case "存管账户信息":
				if (data.success) {
					$scope.isFuiou = data.map.isFuiou;
				}
			break;
		}
	});
	

}])