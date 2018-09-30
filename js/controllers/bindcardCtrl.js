
/* si 安全认证 */
mainModule.controller('bindcardCtrl', ['$rootScope','$scope','$filter','resourceService','$interval','$localStorage','$state','ngDialog','$location', function($rootScope,$scope,$filter,resourceService,$interval,$localStorage,$state,ngDialog,$location) {
	$scope.bank = {};
	$scope.passwd = {};
	// $scope.settruename = false;
	$scope.subForm = '';
	$scope.bank.getCodeText = '获取验证码';
	$scope.isSubmit = false;
	$rootScope.title = '实名绑卡-沪深理财';
	$rootScope.activeNav = 'account';

	$scope.hasSysBank = false;

	$scope.ecId = $localStorage.ecId;
	$scope.exclusiveUser = $localStorage.exclusiveUser;
	//用户信息
	$scope.user = $localStorage.user;
	$scope.bank.bankphone=$localStorage.user.mobilephone;
	//认证失败返回已输入信息
	if($localStorage.errorbank!=undefined && $localStorage.errorbank!=""){
		$scope.bank=$localStorage.errorbank;
		$scope.lastActiveBank=$localStorage.errorbank.lastActiveBank;
		$scope.hasSysBank = true;
	}
	//投资信息
	$scope.investInfo=false;
	if($localStorage.product!=undefined && $localStorage.product!=""){
		if($localStorage.product.nowNum!=undefined && $localStorage.product.nowNum!=""){
			$scope.investInfo=true;
			$scope.product=$localStorage.product;
		}
	}
	//绑卡成功，绑卡失败
    if($location.$$path == '/main/bindcardSuccess') {
        $scope.bankCode = $location.$$search.bankCode;
        $scope.bankcardno = $location.$$search.bankcardno;
        resourceService.queryPost($scope, $filter('交互接口对照表')('充值数据'),{},'充值数据');
    }else if($location.$$path == '/main/bindcardFail') {
    	$scope.errorMsg = $filter('身份认证error信息')($location.$$search.errorCode);
    }else if($location.$$path == '/main/bindcard'){
    	//解决重新绑卡时没有显示'获取验证码'
    	$scope.bank.getCodeText = '获取验证码';
    };

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type) {
			case "安全认证数据":
				if (data.success) {
					$scope.member = data.map;
					$scope.truenameset = data.map.realFlag;
					if ($scope.truenameset == 0) {
						resourceService.queryPost($scope, $filter('交互接口对照表')('认证支持银行列表'),{},'认证支持银行列表');
					}
				} else {

				}
				// $scope.isSubmit = false;
				break;

			// 身份认证--银行信息
			case "身份认证":
				if (data.success) {
					delete $localStorage.errorbank;
					$scope.isCps = data.map.isCps;
					if($localStorage.exclusiveUser == 1) {
                        $scope.exclusiveUser = true;
					}
                    $scope.truenameset = true;
                    $scope.isSubmit = false;
                    if($scope.investInfo){
                    	$state.go('main.myAccount.recharge');
                    }else{
                    	$state.go('main.bindcardSuccess', {bankCode:data.map.bankCode,bankcardno:$scope.bank.bankcardno});
                    }
                    

                } else {
                    $scope.isSubmit = false;
                    if (data.errorCode == '1013') {
                        $state.go('main.myAccount.security', null, {
                            reload: true
                        });
                    }else{
                    	console.log(data.errorCode);
                    	$state.go('main.bindcardFail', {errorCode:data.errorCode});
                    }
                }
                break;

			case "认证支持银行列表":
				if (data.success) {
					$scope.sysBankList = data.map.sysBankList;
					// $scope.sysBankList.length = 15;
					$scope.activeSysBank = $scope.sysBankList[0];
					$scope.spreadBank = false;
					if ($scope.sysBankList.length%3==0) {
						$scope.bankNumError = true;
					} else {
						$scope.bankNumError = false;
					}
				}
			break;

			case "充值数据":
				if (data.success) {
					$scope.quota = data.map.quota;
				}
			break;
		}
	});

	$scope.submitForm = function(isvalid, event, formname) {
		if (!isvalid || $scope.isSubmit) {
			return;
		}
		else {
			if ($filter('isRegister')().register) {
				$scope.subForm = 'bankInfoForm';
				//储存填写信息
				$scope.errorbank={};
				$scope.errorbank.truename = $scope.bank.truename;
                $scope.errorbank.idcard = $scope.bank.idcard;
                $scope.errorbank.bankcardno = $scope.bank.bankcardno;
                $scope.errorbank.bankphone = $scope.bank.bankphone;
                $scope.errorbank.lastActiveBank=$scope.lastActiveBank;
            	$localStorage.errorbank=$scope.errorbank;

				resourceService.queryPost($scope, $filter('交互接口对照表')('身份认证'),{
					realName: $scope.bank.truename,
					idCards: $scope.bank.idcard,
					bankNum: $scope.bank.bankcardno,
					phone: $scope.bank.bankphone,
					smsCode: $scope.bank.phonecode,
                    bankCode: $scope.lastActiveBank.bankCode
				},'身份认证');
				$scope.isSubmit = true;
                    
			}
		}
	};
	$scope.isGetVoice = false;
	// 身份认证--获取短信验证码
	$scope.bank.times = 59;
	$scope.getPhoneCode = function(bankphone, bankcardno, event, item, isvoice) {
		var $this = $(event.currentTarget),
			type = 1;
		$this.parents('.set-mod').find('.voice-box span').hide();
		if ($this.hasClass('getcode-disabled')) {
			return;
		}
		if (!$filter('isRegister')().register) {
			return;
		}

		$this.addClass('getcode-disabled');

		if (isvoice) {
			type = 2;
		} else {
			type = 1;
		}
		
		$.ajax({
			headers: { 
		        'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		    },
			url: $filter('交互接口对照表')('身份认证获取短信验证码'),
			type: 'post',
			data: JSON.stringify({mobilePhone: bankphone,bankNum: $filter('limitTo')(bankcardno, -4),type: type}),
			dataType: 'json',
			success: function(data){
				if (data.success) {
					if (isvoice) {
						item.isGetVoice = true;
					} else {
						item.isGetVoice = false;
					}

					// item.times = 59;
					// item.isGetCode = true;
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
									item.isGetVoice = false;
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
					/*$.qTip({
						'type': true,
						'text': '短信发送成功'
					});*/
				} else {
					var errorMsg = $filter('身份认证获取验证码error信息')(data.errorCode);
					if (data.errorCode == '8888') {
						$this.parents('.set-mod').find('.voice-box span').show();
					} else {
						/*$.qTip({
							'type': false,
							'text': errorMsg
						});*/
						// $scope.erroryzm=true;
						$scope.errorMsg=errorMsg;
					}
					$this.removeClass('getcode-disabled');
				}
				// $scope.isSubmit = false;
			}
		});

		/*resourceService.queryPost($scope, $filter('交互接口对照表')('身份认证获取短信验证码'),{
			mobilePhone: bankphone,
			bankNum: $filter('limitTo')(bankcardno, -4),
			type: type
		},'身份认证获取短信验证码');*/
		
	};

	resourceService.queryPost($scope, $filter('交互接口对照表')('安全认证数据'),{},'安全认证数据');
	

	$scope.changeSysBank = function(index) {
		$scope.activeSysBank = $scope.sysBankList[index];
	};
	$scope.sureSysBank = function() {
		$scope.lastActiveBank = $scope.activeSysBank;
		$scope.hasSysBank = true;
		ngDialog.closeAll();
	};
	$scope.chooseSysBank = function() {
		if ($scope.lastActiveBank != undefined) {
			$scope.activeSysBank = $scope.lastActiveBank;
		}
		$filter('银行卡选择弹窗')($scope);
	};

    $scope.sectoInvest = function () {
        ngDialog.closeAll();
        $state.go('main.billDetail',  { reimId: true, ecId: $scope.ecId });
    };

    $scope.continueReim = function () {
        ngDialog.closeAll();
        $state.go('main.billDetail',  { reimId: true, ecId: $scope.ecId });
    };

    $scope.goreimInvest = function () {
        ngDialog.closeAll();
        $state.go('main.myAccount.recharge',  { reimId: true, ecId: $scope.ecId });
    };

}])