
/*lee 实名认证*/
mainModule.controller('registerCtrl', ['$rootScope','$scope', '$state', '$localStorage', 'resourceService','$filter','$interval',function($rootScope,$scope, $state, $localStorage,resourceService,$filter,$interval) {
	$filter('isLogin')($scope);
	var url='';
	showAuthentication(1);
	$scope.user = {};
	$scope.trade = {};
	$scope.user.getCodeText = '获取验证码';
	$rootScope.title='欢迎注册-沪深理财';

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			// case "实名认证完成":
			// 	$localStorage.user = data;
			// 	$scope.listDatas = data.result;
			// break;

			// 判断是否认证过了
			case '安全认证数据':
				if (data.map.realFlag) {

					if (data.map.tpwFlag) {
						$state.go('main.myAccount.accountHome');
					} else {
						showAuthentication(2);
					}
				}
				break;

			// 身份认证-获取短信验证码
			// case "身份认证获取短信验证码":
			// 	if (data.success) {
			// 		$.qTip({
			// 			'type': true,
			// 			'text': '短信发送成功'
			// 		});
			// 	} else {
			// 		var errorMsg = $filter('身份认证获取验证码error信息')(data.errorCode);
			// 		$.qTip({
			// 			'type': false,
			// 			'text': errorMsg
			// 		});
			// 	}
			// 	break;

			// 身份认证--银行信息
			case "身份认证":
				_hmt.push(['_trackPageview', 'www.hushenlc.cn/maidian/smrz']);
				if (data.success) {

					$.qTip({
						'type': true,
						'text': '认证成功'
					});
					showAuthentication(2);

				} else {
					var errorMsg = $filter('身份认证error信息')(data.errorCode);
					$.qTip({
						'type': false,
						'text': errorMsg
					});
					$scope.isSubmit = false;
					if (data.errorCode == '1013') {
						showAuthentication(2);
					}
				}
				break;

			// 设置交易密码
			case "设置交易密码":
				if (data.success) {
					$.qTip({
						'type': true,
						'text': '交易密码设置成功'
					});
					$state.go('main.myAccount.accountHome');
				} else {
					var errorMsg = $filter('设置交易密码error信息')(data.errorCode);
					$.qTip({
						'type': false,
						'text': errorMsg
					});
					$scope.isSubmit = false;
				}
				break;

		};
	});
	$scope.isGetVoice = false;
	// 身份认证--获取短信验证码
	$scope.user.times = 59;
	$scope.getPhoneCode = function(bankphone, event, item, isvoice) {
		$('.voice-box span').hide();
		var $this = $(event.currentTarget),
			type = 1;
		if ($this.hasClass('getcode-disabled')) {
			return;
		}
		if (!$filter('isRegister')().register) {
			return;
		}

		if (isvoice) {
			type = 2;
		} else {
			type = 1;
		}
		$this.addClass('getcode-disabled');
		if (bankphone) {
			$.ajax({
				headers: { 
			        'Accept': 'application/json',
			        'Content-Type': 'application/json' 
			    },
				url: $filter('交互接口对照表')('身份认证获取短信验证码'),
				type: 'post',
				data: JSON.stringify({mobilePhone: bankphone,bankNum: $filter('limitTo')($scope.user.bankcardno, -4),type: type}),
				dataType: 'json',
				success: function(data){
					if (data.success) {

						if (isvoice) {
							$scope.isGetVoice = true;
						} else {
							$scope.isGetVoice = false;
						}
						// item.times = 59;
						if (!isvoice || (isvoice && !item.isGetCode)) {
							if (!isvoice) {
								item.isGetCode = true;
							}
							item.timer = $interval(function(){
								if (item.times == 0) {
									$interval.cancel(item.timer);
									// if (!isvoice) {
										item.getCodeText = '获取验证码';
									// } else {
										$scope.isGetVoice = false;
									// }
									item.isGetCode = false;
									item.times = 59;
									return;
								}
								// if (!isvoice) {
									item.getCodeText = item.times + 's重新获取';
								// }
								item.times --;
					        }, 1000);
						}
						$.qTip({
							'type': true,
							'text': '短信发送成功'
						});
					} else {
						var errorMsg = $filter('身份认证获取验证码error信息')(data.errorCode);
						if (data.errorCode == '8888') {
							$('.voice-box span').show();
						} else {
							$.qTip({
								'type': false,
								'text': errorMsg
							});
						}
						$this.removeClass('getcode-disabled');
					}
				}
			});
			// resourceService.queryPost($scope, $filter('交互接口对照表')('身份认证获取短信验证码'),{
			// 	mobilePhone: bankphone,
			// 	bankNum: $filter('limitTo')($scope.user.bankcardno, -4),
			// 	type: type
			// },'身份认证获取短信验证码');
		}
	};

	$scope.submitForm = function(isvalid, formname) {
		if (!isvalid || $scope.isSubmit) {
			return;
		}
		else {
			if ($filter('isRegister')().register) {
				switch(formname) {

					// 身份认证
					case 'trueNameForm':
						$scope.subForm = 'trueNameForm';
						resourceService.queryPost($scope, $filter('交互接口对照表')('身份认证'),{
							realName: $scope.user.truename,
							idCards: $scope.user.idcard,
							bankNum: $scope.user.bankcardno,
							phone: $scope.user.bankphone,
							smsCode: $scope.user.phonecode
						},'身份认证');
						$scope.isSubmit = true;
						break;

					// 设置交易密码
					case 'tpwdSetForm':
						resourceService.queryPost($scope, $filter('交互接口对照表')('设置交易密码'),{
							tpwd: $scope.trade.tpasswd,
							confirm: $scope.trade.retpasswd
						},'设置交易密码');
						$scope.isSubmit = true;
						break;

				}
			}
		}
	};

	$scope.goNext = function(num) {
		showAuthentication(num);
	};

	$scope.onClickReal = function (type) {
		switch(type){
			case 'checkName':
				showAuthentication(2);
			break;
			case 'checkPassWord':
				if($scope.user.passWordOne == $scope.user.passWordTwo){
					showAuthentication(3);
					resourceService.queryPost($scope,url,{},'实名认证完成');
				}else{
					$scope.isErrorPassWord=true;
				}
			break;
			case 'ok':
			break;
		};
	}

	function showAuthentication(num) {
		switch(num){
			case 1:
				$scope.authenticationOne = true;
				$scope.authenticationTwo = false;
				$scope.authenticationOk = false;
				$scope.isSubmit = false;
			break;
			case 2:
				$scope.authenticationOne = false;
				$scope.authenticationTwo = true;
				$scope.authenticationOk = false;
				$scope.isSubmit = false;
			break;
			case 3:
				$scope.authenticationOne = false;
				$scope.authenticationTwo = false;
				$scope.authenticationOk = true;
				$scope.isSubmit = false;
			break;
		};
	}

	resourceService.queryPost($scope, $filter('交互接口对照表')('安全认证数据'),{},'安全认证数据');
	
}])