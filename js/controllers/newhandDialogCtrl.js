mainModule.controller('newhandDialogCtrl', ['$location','$rootScope','$localStorage','$scope','$http','resourceService','$filter','$window','ngDialog','$state','$stateParams',function($location,$rootScope,$localStorage,$scope,$http,resourceService,$filter,$window,ngDialog,$state,$stateParams) {
	if ($localStorage.newhandPro != undefined) {
		$scope.product = $localStorage.newhandPro;
	} else {
		$scope.product = {};
		if ($stateParams.nowNum != undefined) {
			$scope.product.nowNum = Number($stateParams.nowNum);
		}
		$scope.product.rate = 12;
		$scope.product.activityRate = 3;
		$scope.product.deadline = 1;
	}
	$scope.showDataAll = false;
	$scope.sure = false;
	if ($localStorage.newhandShowType != undefined) {
		$scope.showType = $localStorage.newhandShowType;
	} else {
		$scope.showType = 'a';
	}
	var today = new Date();
	$scope.hkDate = today.getTime() + 3600*24*1000*2;
	$scope.showDialog = function(type) {
		$scope.dialogType = type;
		$filter('新手标弹窗')($scope);
	};
	$scope.closeDialog = function() {
		ngDialog.closeAll();
	};
	$scope.goNext = function() {
		$scope.showType = 'b';
		// $localStorage.newhandShowType = 'b';
	};
	$scope.showDetailData = function(item) {
		$scope.deadline = item.deadline;
		$scope.amount = item.amount;
		$scope.showDataAll = true;
	};
	var $list = $('.new-list li');
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case '新手标领取现金':
				if (data.success) {
					$scope.list = data.map.parcelList;
					$scope.data = data.map.rewardList;
					if ($scope.list.length > 2) {
						setInterval(function() {
							$list.animate({'margin-top': '-34px'},800,function() {
								$list.find('p').eq(0).appendTo($list);
								$list.find('p').eq(0).appendTo($list);
								$list.css('margin-top',0);
							});
						}, 5000);
					}
				} else {
					$.qTip({
						'type': false,
						'text': data.errorMsg
					});
				}
			break;
			case '新手标续投':
				if (data.success) {
					ngDialog.closeAll();
					$scope.showDialog('success');
					if ($localStorage.newhandPro != undefined) {
						delete $localStorage.newhandPro;
					}
					if ($localStorage.newhandShowType != undefined) {
						delete $localStorage.newhandShowType;
					}
				} else {
					$.qTip({
						'type': false,
						'text': data.errorMsg
					});
				}
			break;
		}
	});
	resourceService.queryPost($scope,$filter('交互接口对照表')('新手标领取现金'),{},'新手标领取现金');
	$scope.sureNext = function() {
		resourceService.queryPost($scope,$filter('交互接口对照表')('新手标续投'),{period:$scope.deadline},'新手标续投');
	};
}])
