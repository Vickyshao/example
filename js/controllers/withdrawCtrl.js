
/* si 提现 */
mainModule.controller('withdrawCtrl', ['$rootScope','$scope','$filter','resourceService','ngDialog','$localStorage' ,function($rootScope,$scope,$filter,resourceService,ngDialog,$localStorage) {
	$localStorage.dialogType = '提现';
	$rootScope.title = '提现-沪深理财';
	$rootScope.activeNav = 'account';
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type) {

			case "提现数据":
				if (data.success) {
					$scope.user = data.map;
					if (data.map.isChargeFlag==1) {
						$scope.user.cost =data.map.amount;
					} else {
						$scope.user.cost = 0;
					}
				} else {
					var errorMsg = $filter('提现数据error信息')(data.errorCode);
					$.qTip({
						'type': false,
						'text': errorMsg
					});
				}
				break;

			case "提现":
				$localStorage.hasShowRedBagDialog = true;
				if (data.success) {
					$localStorage.dialogStatus = 'success';
					$localStorage.dialogMsg = '您已成功提现'+ $filter('currency')($scope.user.cash - $scope.user.cost,'') +'元';
				} else {
					$scope.errorCode = data.errorCode;
					if (data.errorCode == '2001') {
						$scope.showForgetPwd = true;
					} else {
						$scope.showForgetPwd = false;
					}
					$localStorage.dialogMsg = $filter('提现error信息')(data.errorCode);
					if ($localStorage.dialogMsg == '处理中') {
						$localStorage.dialogStatus = 'ing';
						$localStorage.dialogMsg = '提现申请我们正在处理，如您填写的账户信息正确无误，您的资金将会于1-2个工作日内到达您的银行账户';
					} else {
						$localStorage.dialogStatus = 'error';
					}
				}
				$filter('充值提现弹窗')($scope);
			break;
			case '获取复投红包':
				if (data.success) {
					$rootScope.promoteGetCashFrom = true;
					if (data.map.isRedPacket) {
						if (data.map.returnedCount) {
							$rootScope.promoteHasReturn = true;
						} else {
							$rootScope.promoteHasReturn = false;
						}
					}
					$rootScope.promoteRedbags = data.map.redPacketList;
					if ($rootScope.promoteRedbags.length > 2) {
						$rootScope.promoteRedbags.length = 2;
					}
					$filter('红包弹窗')($rootScope);
				}
			break;
		}
	});

	// onblur将金额保留两位小数
	$scope.setAmount = function(event) {
		$scope.user.cash=$filter('isNumber2')($scope.user.cash,undefined,1);
	};

	// 未绑定银行卡时--去安全认证页面绑定
	$scope.bindBank = function() {
		// $scope.$broadcast('myEvent.WHDR_Ctrl','账户管理');
		$filter('跳转页面')('','main.myAccount.withdraw','main.bindcard','',null,{name:'实名绑卡',url:'main.bindcard'});
	};

	// 未设置交易密码时--去安全认证页面设置
	$scope.setTradeCode = function() {
		$filter('跳转页面')('','main.myAccount.withdraw','main.myAccount.security','setTradeCode',null,{name:'账户管理',url:'main.myAccount.security'});
	};

	// 忘记交易密码--去安全认证页面找回
	$scope.forgetTradeCode = function() {
		// $rootScope.$emit('myEvent.WHDR_Ctrl','账户管理');
		ngDialog.closeAll();
		$filter('跳转页面')('','main.myAccount.withdraw','main.myAccount.security','forgetTradeCode',null,{name:'账户管理',url:'main.myAccount.security'});
	};

	// 提交表单
	$scope.submitForm = function(valid) {
		if (!valid || $scope.isSubmit) {
			return;
		}
		$scope.isSubmit = true;
		resourceService.queryPost($scope, $filter('交互接口对照表')('提现'),{
			amount: $scope.user.cash,
			tpw: $scope.user.tradepwd,
			isChargeFlag: $scope.user.isChargeFlag,
			serviceCharge: $scope.user.cost
		},'提现');
	};

	resourceService.queryPost($scope, $filter('交互接口对照表')('提现数据'),{},'提现数据');
	
	if (!$localStorage.hasShowRedBagDialog || $localStorage.hasShowRedBagDialog == undefined) {
		// resourceService.queryPost($scope,$filter('交互接口对照表')('获取复投红包'),{},'获取复投红包');
	} else {
		$localStorage.hasShowRedBagDialog = false;
	}
}]);