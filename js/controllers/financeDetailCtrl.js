/*产品详情页*/
mainModule.controller('financeDetailCtrl', ['$rootScope','$scope', '$state', '$localStorage', 'resourceService','$filter','communicationService','$timeout','$location','ngDialog','$element','MAIN_MENU','storage','$stateParams',function($rootScope,$scope, $state, $localStorage,resourceService,$filter,communicationService,$timeout,$location,ngDialog,$element,MAINMENU,storage,$stateParams) {
	$scope.isLogin = $filter('isRegister')().register;

	$rootScope.title="体验金专享标-沪深理财";

	$localStorage.activityUrl = 'main.financeDetail';

	resourceService.queryPost($scope,$filter('交互接口对照表')('体验标详情'),{},'体验标详情');

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case '体验标详情':
				if (data.success) {
					$scope.product = data.map.productInfo;
					$scope.investCount = data.map.investCount;
					$scope.isFuiou = data.map.isFuiou;
					if (data.map.experienceAmount != undefined) {
						$scope.experienceAmount = data.map.experienceAmount;
					} else {
						$scope.experienceAmount = {
							experAmount:0
						};
					}
				} else {
					$.qTip({
						'type': false,
						'text': data.errorMsg
					});
				}
			break;
			case '体验标投资':
				if (data.success) {
					$scope.realverify = data.map.realverify;
					$scope.redTotal = data.map.redTotal;
					$scope.today = new Date();
					$scope.clDate = $scope.today.getTime() + 3600*24*1000*1;
					$scope.dqDate = $scope.today.getTime() + 3600*24*1000*2;
					$filter('体验金投资弹窗')($scope);
					$rootScope.isExperience = false;
				} else {
					$.qTip({
						'type': false,
						'text': data.errorMsg
					});
				}
			break;
		}
	});

	$scope.onClick = function() {
		if ($scope.experienceAmount.experAmount <= 0) {
			return;
		}
		resourceService.queryPost($scope,$filter('交互接口对照表')('体验标投资'),{pid:$scope.product.id,ids:$scope.experienceAmount.ids},'体验标投资');
	};

	$scope.bindBank = function() {
		ngDialog.closeAll();
        $filter('跳转页面')('','main.myAccount.recharge','main.myAccount.security','setTruename',null,{name:'账户管理',url:'main.myAccount.security'});
    };

    $scope.refresh = function() {
    	ngDialog.closeAll();
		resourceService.queryPost($scope,$filter('交互接口对照表')('体验标详情'),{},'体验标详情');
    }
}])
