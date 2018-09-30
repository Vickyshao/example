/* si 充值成功 */
mainModule.controller('rechargeSuccessCtrl', ['$rootScope','$scope','$filter','resourceService','ngDialog','$localStorage','$interval','$location' ,function($rootScope,$scope,$filter,resourceService,ngDialog,$localStorage,$interval,$location) {
	$localStorage.dialogType = '充值';
	$rootScope.title = '充值成功-沪深理财';

	var data = $location.$$search;
	if (data.success == 'true') {
		$scope.success = true;
		$scope.amount = data.amount;
		$scope.ing = false;
		$scope.fail = false;
	} else {
		$scope.success = false;
		if (data.errorCode == '1001') {
			$scope.ing = true;
			$scope.fail = false;
		} else if (data.errorCode == '1002') {
			$scope.fail = true;
			$scope.ing = false;
		}
	}

	$scope.onClickToBillDetail = function(item) {
		$filter('跳转页面')('产品推荐','main.myAccount.accountHome','main.billDetail',item,{pathName:'产品推荐',url:'/mainmyAccountaccountHome'});
	};

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case "资产首页":
				$scope.infoList = data.map.infoList;
			break;
		};
	});
	resourceService.queryPost($scope, $filter('交互接口对照表')('我的资产首页数据'),{},'资产首页');
	// resourceService.queryPost($scope, $filter('交互接口对照表')('充值成功数据'),{},'充值成功数据');
}]);