mainModule.controller('taskDetailCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService','ngDialog',function($rootScope,$scope,$location,$localStorage,$filter,resourceService,ngDialog) {
	$rootScope.title = '活动中心-我的返现';
	$scope.myPhone = $localStorage.user.mobilephone;
	
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case "三重礼首投复投":
				if (data.success) {
					$scope.invite = data.map.activity;
					$scope.info = data.map;
					$scope.nowRanking = $scope.info.nowRanking==undefined?undefined:parseInt($scope.info.nowRanking);
					$scope.firstInvestList = data.map.firstInvestList;
					$scope.repeatInvestList = data.map.repeatInvestList;
					$scope.getFirCount = $scope.firstInvestList.length;
					$scope.getRepeatCount = $scope.repeatInvestList.length;
				}
			break;
			case "三重礼排行榜":
				if (data.success) {
					$scope.top = data.map.top;
				}
			break;
			case "领取奖金":
				if (data.success) {
					$scope.amount = data.map.amount;
					$filter('奖金弹窗')($scope);
				}
			break;
		};
	});

	// 领取奖励
	$scope.getReward = function() {
		resourceService.queryPost($scope,$filter('交互接口对照表')('领取奖金'),{afid: $scope.invite.id},'领取奖金');
	};
	$scope.closeDialog = function() {
		resourceService.queryPost($scope,$filter('交互接口对照表')('三重礼首投复投'),{},'三重礼首投复投');
		ngDialog.closeAll();
	};
	$scope.showPop = 1;
	$scope.share = function() {
		$scope.showPop = 2;
	};
	resourceService.queryPost($scope,$filter('交互接口对照表')('三重礼首投复投'),{},'三重礼首投复投');
	resourceService.queryPost($scope,$filter('交互接口对照表')('三重礼排行榜'),{},'三重礼排行榜');

}])