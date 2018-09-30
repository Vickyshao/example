
/* si 充值 */
mainModule.controller('rechargeCtrl', ['$rootScope','$scope','$filter','resourceService','ngDialog','$localStorage','$interval','$http','$state',function($rootScope,$scope,$filter,resourceService,ngDialog,$localStorage,$interval,$http,$state) {
	$scope.isSubmit = false;
	$scope.user = {};
	$scope.code = {};
	$scope.code.getCodeText = '点击获取验证码';
	$localStorage.dialogType = '充值';
	$rootScope.title = '充值-沪深理财';
	$scope.tab = 1;
	$scope.online = {};
	$hiddenForm = $('#hiddenForm')[0];

	$rootScope.activeNav = 'account';

	$scope.showAmount = true;
	$scope.orderSubmit = false;

	$scope.rechargemore = 3;

	$scope.pay = {
		payNum: ''
	};

	$scope.ecId = $localStorage.ecId;

	var $amount = $('#amount');
	/*$scope.tabRecharge = function(step) {
		if (!$filter('isRegister')().register) {
			return;
		}
		if(step == 1) {
			$scope.showAmount = true;
			$scope.orderSubmit = false;
		} else if (step == 2) {
			if ($('#amount').val() == '' || $('#amount').val() == undefined || $scope.amountIsTrue == false) {
				$('#amount').focus();
				if ($scope.amountIsTrue == true) {
					$scope.amountError = true;
				}
				// return;
			} else {
				if ($scope.orderSubmit == false) {
					$scope.orderSubmit = true;
					// resourceService.queryPost($scope, $filter('交互接口对照表')('创建订单'),{
					// 	amount: $scope.user.amount
					// },'创建订单');
					$scope.showAmount = false;
					// $scope.pay.payNum = data.map.payNum;
					$scope.orderSubmit = false;
				}
				// $scope.showAmount = false;
			}
		}
	};*/
	$scope.user.realFlag = true;

	//充值成功去投资
    $scope.toInvest = function () {
    	if($scope.investInfo){
			$state.go('main.investConfirm',{fid: $scope.fid});
		}else{
			$state.go('main.bankBillList');
		}
        ngDialog.closeAll();
    };

	// $scope.rechargemore = 1;
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type) {
			case "充值数据":
				if (data.success) {
					$scope.user = data.map;
					$scope.hasRecharged = $scope.user.hasRecharged;
					// $scope.quota = $scope.user.quota;
					$scope.quota = 5000000;

					//投资信息
					$scope.investInfo=false;
					if($localStorage.product!=undefined && $localStorage.product!=""){

						if($localStorage.product.nowNum!=undefined && $localStorage.product.nowNum!=""){
							$scope.investInfo=true;
							if($localStorage.product.nowNum>$scope.user.funds){
								$scope.user.amount = $localStorage.product.nowNum;
								$localStorage.user.amount = $scope.user.amount = $filter('isNumber2')($scope.user.amount,undefined,1);
							}else{
								$localStorage.user.amount = $scope.user.amount=0.00;
							}
                           
							if($localStorage.product.fid!=undefined && $localStorage.product.fid!=""){
								$scope.fid=$localStorage.product.fid;
							}else{
								$scope.fid='';
							}
						}
					}

					if ($scope.user.bankCode == 6) {
						$scope.rechargemore = 3;
						$scope.changeTab(1);
					}
					if (data.map.realFlag) {
						$scope.bankCode = data.map.bankList[0].bankCode;
					}
					if (data.map.sysArticleList.length > 0 && data.map.sysArticleList[0].summaryContents != '') {
						$scope.showBankTip = true;
						$scope.bankTip = data.map.sysArticleList[0].summaryContents;
						$scope.changeTab(2);
					} else {
						$scope.showBankTip = false;
						$scope.changeTab(1);
					}
				} else {
					var errorMsg = $filter('充值数据error信息')(data.errorCode);
					$.qTip({
						'type': false,
						'text': errorMsg
					});
				}
				break;

			case "充值":
				if (data.map != undefined && data.map.src != undefined) {
					$scope.gift = true;
				} else {
					$scope.gift = false;
				}
				if (data.success) {
					if ($localStorage.balanceNotEnough == true) {
						$localStorage.balanceNotEnough = false;
						/*$state.go($localStorage.pathUrl,{id:$localStorage.balanceNotEnoughId});
						return;*/
					} 
					$localStorage.dialogStatus = 'success';
					$scope.rechargeSuccess = true;
					$localStorage.dialogMsg = '您已成功充值'+ $filter('currency')($scope.user.amount,'') +'元';
				} else {
					// //充值失败删除已输入的投资金额
					// if($localStorage.product!=undefined && $localStorage.product!=""){
					// 	if($localStorage.product.nowNum!=undefined){
					// 		delete $localStorage.product.nowNum;
					// 	}
					// }
					$scope.recharge = {};
					$scope.recharge.errorCode = data.errorCode;
					$scope.errorCode = data.errorCode;
					if(data.errorMsg!=undefined && data.errorMsg!=''){
						$localStorage.dialogMsg = data.errorMsg;
					}else if($filter('充值error信息')(data.errorCode)!=undefined && $filter('充值error信息')(data.errorCode)!=''){
						$localStorage.dialogMsg = $filter('充值error信息')(data.errorCode);
					}else{
						$localStorage.dialogMsg = '充值失败，请联系客服';
					}
					
					if ($localStorage.dialogMsg == '处理中') {
						$localStorage.dialogStatus = 'ing';
						$localStorage.dialogMsg = '请稍后查询处理结果';
					} else {
						$localStorage.dialogStatus = 'error';
					}
				}
				if ($scope.gift == true && $scope.rechargeSuccess == true) {
					$scope.giftFlag = true;
				} else {
					$scope.giftFlag = false;
				}
				// if ($localStorage.balanceNotEnough != true) {
					$filter('充值提现弹窗')($scope);
					$scope.user.amount=0.00;
				// } else {
					// $localStorage.balanceNotEnough = false;
				// }
				// $scope.isSubmit = false;
				break;

			case "网银充值":
				if (data.success) {
					
					$scope.online = data.map;
					var formHtml = data.map.formHtml;
					if(undefined == formHtml || '' == formHtml){
						$('.tranCode',$hiddenForm).val(data.map.tranCode);
						$('.version',$hiddenForm).val(data.map.version);
						$('.charset',$hiddenForm).val(data.map.charset);
						$('.uaType',$hiddenForm).val(data.map.uaType);
						$('.merchantId',$hiddenForm).val(data.map.merchantId);
						$('.merOrderId',$hiddenForm).val(data.map.merOrderId);
						$('.merTranTime',$hiddenForm).val(data.map.merTranTime);
						$('.merUserId',$hiddenForm).val(data.map.merUserId);
						$('.orderDesc',$hiddenForm).val(data.map.orderDesc);
						$('.prodInfo',$hiddenForm).val(data.map.prodInfo);
						$('.tranAmt',$hiddenForm).val(data.map.tranAmt);
						$('.curType',$hiddenForm).val(data.map.curType);
						$('.payMode',$hiddenForm).val(data.map.payMode);
						$('.bankCode',$hiddenForm).val(data.map.bankCode);
						$('.bankCardType',$hiddenForm).val(data.map.bankCardType);
						$('.notifyUrl',$hiddenForm).val(data.map.notifyUrl);
						$('.backUrl',$hiddenForm).val(data.map.backUrl);
						$('.signType',$hiddenForm).val(data.map.signType);
						$('.sign',$hiddenForm).val(data.map.sign);
						$hiddenForm.action = data.map.url;
						// var data = new FormData($hiddenForm);
	
						// $.ajax({
						// 	url: data.map.url,
						// 	type: 'post',
						// 	data: $('#hiddenForm').serialize(),
						// 	success: function (data) {
						// 	}
						// });
						// window.open(data.map.url + '?' + $('#hiddenForm').serialize(),"_blank");
						 // var mya = $('<a href="'+ data.map.url + '?' + $('#hiddenForm').serialize() +'" target="_blank">test</a>').get(0);
						 // var mye = document.createEvent('MouseEvents');
						 // mye.initEvent('click', true, true);
						 // mya.dispatchEvent(mye);
						// $('#prevent').attr('href', data.map.url + '?' + $('#hiddenForm').serialize());
						// // var $prevent = $('<a id="prevent" style="display: none;" href="'+ data.map.url + '?' + $('#hiddenForm').serialize() +'" target="_blank"></a>').appendTo('body');
						// document.getElementById("prevent").click();
						// $filter('充值弹窗')($scope);
						// // $('#prevent').remove();
	
						$hiddenForm.submit();
						$filter('充值弹窗')($scope);
					}else{
						$(formHtml).appendTo('body').submit();
					}
					
				} else {
					$localStorage.dialogMsg = $filter('网银充值error信息')(data.errorCode);
					$localStorage.dialogStatus = 'error';
					$filter('充值提现弹窗')($scope);
				}
				// $scope.isSubmit = false;
				break;
		}
	});
	$('.amount').on('keyup change', function() {
		$scope.$apply(function() {
			if ($scope.user.amount == '' || $scope.user.amount == undefined) {
				$scope.amountIsTrue = true;
			}
		});
	});

	// onblur将金额保留两位小数
	$scope.setAmount = function() {
        $localStorage.user.amount = $scope.user.amount = $filter('isNumber2')($scope.user.amount,undefined,1);
		var obj = $filter('rechargeLimit')($scope.user.amount,$scope.rechargemore,$scope.quota);
		// obj.typemax = true;
		if (obj.typemin == false || obj.typemax == false) {
			$scope.amountIsTrue = false;
			if (obj.typemin == false) {
				$scope.typemin = false;
				$scope.amountMsg = '充值金额至少为' + $scope.rechargemore + '元';
			}
			if (obj.typemax == false) {
				$scope.typemax = false;
				$scope.amountMsg = '单笔限额' + $filter('number')($scope.quota) + '元';
			}
		} else {
			$scope.amountIsTrue = true;
			$scope.typemin = true;
			$scope.typemax = true;
			$scope.amountMsg = '';
		}
	};

	// 未绑定银行卡时--去安全认证页面绑定
	$scope.bindBank = function() {
		$filter('跳转页面')('','main.myAccount.recharge','main.bindcard','',null,{name:'实名绑卡',url:'main.bindcard'});
	};

	// 未设置交易密码时--去安全认证页面设置
	$scope.setTradeCode = function() {
		$filter('跳转页面')('','main.myAccount.recharge','main.myAccount.security','setTradeCode',null,{name:'账户管理',url:'main.myAccount.security'});
	};

	// 忘记交易密码--去安全认证页面找回
	$scope.forgetTradeCode = function() {
		$filter('跳转页面')('','main.myAccount.recharge','main.myAccount.security','forgetTradeCode',null,{name:'账户管理',url:'main.myAccount.security'});
	};

	$scope.setAmountError = function() {
		$scope.amountError = false;
	};

	$scope.chooseBank = function(code) {
		$scope.bankCode = code;
//		if ($scope.isSubmit) {
//			return;
//		}
//		$scope.isSubmit = true;
//		resourceService.queryPost($scope, $filter('交互接口对照表')('网银充值'),{
//			amount: $scope.user.amount,
//			bankCode: $scope.bankCode
//		},'网银充值');
	}

	$scope.isGetVoice = false;
	// 身份认证--获取短信验证码
	$scope.code.times = 59;
	$scope.voiceRepeat = false;
	$scope.getPhoneCode = function(entrance, event, item, isvoice) {
		$('.voice-box span').hide();
		var type = 1;
		
		if (!$filter('isRegister')().register) {
			return;
		}
		var $this = $(event.currentTarget);
		if ($this.hasClass('getcode-disabled')) {
			return;
		}
		$this.addClass('getcode-disabled');
		$scope.amountError = false;

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
			url: $filter('交互接口对照表')('充值获取验证码'),
			type: 'post',
			data: JSON.stringify({type: type,amount: $scope.user.amount}),
			dataType: 'json',
			success: function(data){
				if (data.success) {

					if (isvoice) {
						$scope.isGetVoice = true;
					} else {
						$scope.isGetVoice = false;
					}
					$scope.pay.payNum = data.map.payNum;

					// item.times = 59;
					if (!isvoice || (isvoice && !item.isGetCode)) {
						if (!isvoice) {
							item.isGetCode = true;
						}
						item.timer = $interval(function(){
							if (item.times == 0) {
								$interval.cancel(item.timer);
								// if (!isvoice) {
									item.getCodeText = '点击获取验证码';
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
					if (data.errorCode == 'XTWH') {
						$state.go('500');
						return;
					}
					var errorMsg = $filter('充值获取验证码error信息')(data.errorCode);
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
		
		// resourceService.queryPost($scope, $filter('交互接口对照表')('充值获取验证码'),{type},'充值获取验证码');
	};

	// 切换方式
	$scope.changeTab = function(type) {
		switch(type) {
			case 1:
				$scope.tab = 1;
				// $scope.quota = $scope.user.quota;
				// if ($scope.user.bankCode == 6) {
				// 	$scope.rechargemore = 2;
				// } else {
				// 	$scope.rechargemore = 1;
				// }
				break;
			case 2:
				$scope.tab = 2;
				// $scope.quota = 500000;
				// $scope.rechargemore = 1;
				break;	
		}
		var obj = $filter('rechargeLimit')($scope.user.amount,$scope.rechargemore,$scope.quota);
		if (obj.typemin == false || obj.typemax == false) {
			$scope.amountIsTrue = false;
			if (obj.typemin == false) {
				$scope.typemin = false;
				$scope.amountMsg = '充值金额至少为' + $scope.rechargemore + '元';
			}
			if (obj.typemax == false) {
				$scope.typemax = false;
				$scope.amountMsg = '单笔限额' + $filter('number')($scope.quota) + '元';
			}
		} else {
			$scope.amountIsTrue = true;
			$scope.typemin = true;
			$scope.typemax = true;
			$scope.amountMsg = '';
		}

	}

	// 提交表单
	$scope.submitForm = function(valid) {
//		if (!valid || $scope.isSubmit) {
		if (!valid) {
			return;
		}
		$scope.isSubmit = true;
		resourceService.queryPost($scope, $filter('交互接口对照表')('充值'),{
			payNum: $scope.pay.payNum,
			smsCode: $scope.user.phonecode
		},'充值');
	};

	// 网银充值
	$scope.goWYPay = function() {

		if ($scope.isSubmit) {
			return;
		}
		$scope.isSubmit = true;
		resourceService.queryPost($scope, $filter('交互接口对照表')('网银充值'),{
			amount: $scope.user.amount,
			bankCode: $scope.bankCode
		},'网银充值');
	};
    $scope.rechargeToReim = function () {
        $state.go('main.billDetail',  { reimId: true, ecId: $scope.ecId });
        ngDialog.closeAll();
    };

	resourceService.queryPost($scope, $filter('交互接口对照表')('充值数据'),{},'充值数据');

}]);