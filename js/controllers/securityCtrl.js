
/* si 安全认证 */
mainModule.controller('securityCtrl', ['$rootScope','$scope','$filter','resourceService','$interval','$localStorage','$state','ngDialog', function($rootScope,$scope,$filter,resourceService,$interval,$localStorage,$state,ngDialog) {
	$scope.user = {};
	$scope.bank = {};
	$scope.trade = {};
	$scope.passwd = {};
	// $scope.settruename = false;
	$scope.subForm = '';
	$scope.user.getCodeText = '获取验证码';
	$scope.bank.getCodeText = '获取验证码';
	$scope.trade.getCodeText = '获取验证码';
	$scope.isSubmit = false;
	$scope.userphone = $localStorage.user.mobilephone;
	$rootScope.title = '安全认证-沪深理财';
	$rootScope.activeNav = 'account';

	$scope.hasSysBank = false;

	$scope.ecId = $localStorage.ecId;

    if(!$localStorage.isDs) {
        $scope.isDs = true;
    } else {
        $scope.isDs = false;
    }
    //专属标
    if($localStorage.exclusiveUser==1) {
        $scope.exclusiveUser = true;
    } else {
        $scope.exclusiveUser = false;
    }

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type) {
			case "安全认证数据":
				if (data.success) {
					$scope.member = data.map;
					$scope.truenameset = data.map.realFlag;
					$scope.tpwdset = data.map.tpwFlag;
					$('.trade-code-btn').text($scope.tpwdset ? '修改' : '设置');
					if ($localStorage.product == 'setTradeCode') {
						$('.set-tradecode').addClass('actived-set-wrap').find('.btn a').text('取消设置');
						$('#set-tradecode').show();
						$localStorage.product = '';
					} else if ($localStorage.product == 'forgetTradeCode') {
						$('.set-tradecode').addClass('actived-set-wrap').find('.btn a').text('取消修改');
						$('#set-tradecode').show().find('.set-trade-box').hide();
						$('.set-before').show();
						$localStorage.product = '';
					}
					if ($scope.truenameset == 0) {
						resourceService.queryPost($scope, $filter('交互接口对照表')('认证支持银行列表'),{},'认证支持银行列表');
					}
				} else {

				}
				// $scope.isSubmit = false;
				break;

			// 安全认证修改登录密码
			case "安全认证修改登录密码":
				if (data.success) {
					$.qTip({
						'type': true,
						'text': '修改成功'
					});
					$('#set-passwd').slideUp(500, function() {
						$('.reset-passwd-btn').text('修改');
						$('.set-passwd').removeClass('actived-set-wrap');
						$scope.$apply(function() {
							$scope.isSubmit = false;
						});
						$state.go('main.myAccount.security',null,{
						    reload:true
						});
					});
				} else {
					var errorMsg = $filter('安全认证修改登录密码error信息')(data.errorCode);
					$.qTip({
						'type': false,
						'text': errorMsg
					});
					$scope.isSubmit = false;
				}
				break;
				
			// 设置交易密码
			case "设置交易密码":
				if (data.success) {
					if($scope.ecId){
                        $filter('交易密码设置成功')($scope);
					} else {
                        $.qTip({
                            'type': true,
                            'text': '交易密码设置成功'
                        });
					}
                    $('#set-tradecode').slideUp(500, function() {
                        $('.trade-code-btn').text('修改');
                        $('.set-tradecode').removeClass('actived-set-wrap');
                        $scope.$apply(function() {
                            $scope.isSubmit = false;
                            $scope.tpwdset = true;
                        });
                    });

				} else {
					var errorMsg = $filter('设置交易密码error信息')(data.errorCode);
					$.qTip({
						'type': false,
						'text': errorMsg
					});
					$scope.isSubmit = false;
				}
				break;

			// 修改交易密码
			case "修改交易密码":
				if (data.success) {
					$.qTip({
						'type': true,
						'text': '交易密码修改成功'
					});
					$('#set-tradecode').slideUp(500, function() {
						$('.trade-code-btn').text('修改');
						$('.set-tradecode').removeClass('actived-set-wrap');
						$scope.$apply(function() {
							$scope.isSubmit = false;
						});
						$state.go('main.myAccount.security',null,{
						    reload:true
						});
					});
				} else {
					var errorMsg = $filter('修改交易密码error信息')(data.errorCode);
					$.qTip({
						'type': false,
						'text': errorMsg
					});
					$scope.isSubmit = false;
				}
				break;
            // 修改登录密码验证验证码
            case "修改登录密码时验证验证码":
                if (data.success) {
                    /*$.qTip({
                        'type': false,
                        'text': '验证码通过'
                    });*/
                    resourceService.queryPost($scope, $filter('交互接口对照表')('修改用户密码-提交密码'),{
                        // forgetPwdPhone: $scope.userphone,
                        password: $scope.passwd.newpasswd,
                        confirmPwd: $scope.passwd.repasswd
                    },'安全认证修改登录密码');
                } else {
                    // var errorMsg = $filter('修改交易密码error信息')(data.errorCode);
                    $.qTip({
                        'type': false,
                        'text': '短信验证码错误'
                    });
                    // $scope.isSubmit = false;
                }
                break;

			// 找回交易密码获取短信验证码
			// case "找回交易密码获取短信验证码":
			// 	if (data.success) {
			// 		$.qTip({
			// 			'type': true,
			// 			'text': '短信发送成功'
			// 		});
			// 	} else {
			// 		var errorMsg = $filter('找回交易密码获取短信验证码error信息')(data.errorCode);
			// 		$.qTip({
			// 			'type': false,
			// 			'text': errorMsg
			// 		});
			// 	}
			// 	$scope.isSubmit = false;
			// 	break;

			// 找回交易密码验证短信验证码
			case "找回交易密码验证短信验证码":
				if (data.success) {
					$('.set-before').slideUp(500, function() {
						$('.set-new').slideDown(500);
						$scope.$apply(function() {
							$scope.isSubmit = false;
						});
					});
				} else {
					$.qTip({
						'type': false,
						'text': '验证码输入不正确'
					});
					$scope.isSubmit = false;
				}
				break;
            // 找回交易密码验证短信验证码
            case "重置交易密码验证短信验证码":
                if (data.success) {
                    resourceService.queryPost($scope, $filter('交互接口对照表')('找回交易密码设置新交易密码'),{
                        // oldPwd: $scope.trade.usedtpasswd,
                        tpwd: $scope.trade.newtpasswd,
                        confirmTpwd: $scope.trade.retradepasswd,
                        code: $scope.trade.phonecodejy
                    },'修改交易密码');
                } else {
                    var errorMsg = $filter('修改交易密码error信息')(data.errorCode);
                    $.qTip({
                        'type': false,
                        'text': errorMsg
                    });
                    $scope.isSubmit = false;
                }
                break;

			// 找回交易密码设置新交易密码
			case "找回交易密码设置新交易密码":
				if (data.success) {
					$('.set-new').slideUp(500, function() {
						$('.change-trade-success').slideDown(500);
						setTimeout(function() {
							$('.change-trade-success').slideUp(500, function() {
								$('.trade-code-btn').text('修改');
								$('.set-tradecode').removeClass('actived-set-wrap').find('.set-mod').hide();
								$('.set-trade-box').css('display', 'block');
								$scope.$apply(function() {
									$scope.isSubmit = false;
								});
								$state.go('main.myAccount.security',null,{
								    reload:true
								});
							});
						}, 3000);
					});
				} else {
					var errorMsg = $filter('找回交易密码设置新交易密码error信息')(data.errorCode);
					$.qTip({
						'type': false,
						'text': errorMsg
					});
					$scope.isSubmit = false;
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
		}
	});

	// 显示下拉内容
	var isChange = false;
	$scope.showSetMod = function(event) {
		var $this = $(event.currentTarget),
			$mySetWrap = $this.parents('.set-wrap');

		if (!$mySetWrap.hasClass('actived-set-wrap')) {
			var $activeSetWrap = $('.actived-set-wrap'),
				$activeBtn = $activeSetWrap.find('.btn a');
			if (isChange) {
				return;
			}
			isChange = true;
			$activeSetWrap.find('.set-mod').slideUp(400, function() {
				$activeSetWrap.removeClass('actived-set-wrap');
				$activeBtn.text($activeBtn.text().replace('取消', ''));
			});
			$mySetWrap.find('.set-mod').slideDown(400, function() {
				$mySetWrap.addClass('actived-set-wrap');
				$this.text('取消' + $this.text());
				isChange = false;
			});
		} else {
			if (isChange) {
				return;
			}
			isChange = true;
			$mySetWrap.find('.set-mod').slideUp(400, function() {
				$mySetWrap.removeClass('actived-set-wrap');
				$this.text($this.text().replace('取消', ''));
				isChange = false;
			});
		}
	};
	//获取短信验证码
    $scope.bank.times = 59;
    $scope.getPhoneCodedl = function(event, item, isvoice) {
    	// var userphone = $localStorage.user.mobilephone;
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
            url: $filter('交互接口对照表-')('修改用户手机验证'),
            type: 'post',
            data: JSON.stringify({mobilephone: $scope.userphone,type: type}),
            dataType: 'json',
            success: function(data){
                if (data.success) {

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
                    var errorMsg = $filter('安全认证修改登录密码error信息')(data.errorCode);
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
    $scope.getPhoneCodejy = function(event, item, isvoice) {
        // var userphone = $localStorage.user.mobilephone;
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
            url: $filter('交互接口对照表')('找回交易密码获取短信验证码'),
            type: 'post',
            data: JSON.stringify({mobilephone: $scope.userphone,type: type}),
            dataType: 'json',
            success: function(data){
                if (data.success) {

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
                    var errorMsg = $filter('安全认证修改登录密码error信息')(data.errorCode);
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

	$scope.submitForm = function(isvalid, event, formname) {
		if (!isvalid || $scope.isSubmit) {
			return;
		}
		else {
			if ($filter('isRegister')().register) {
				switch(formname) {

					// 修改登录密码
					case 'passwdFrom':
                        // var userphone = $localStorage.user.mobilephone;
                        if ($scope.passwd.phonecode.length == 4) {
                            resourceService.queryPost($scope, $filter('交互接口对照表')('修改用户密码-提交手机验证'),{
                                // oldPwd: $scope.passwd.usedpasswd,
                                mobilephone: $scope.userphone,
                                code: $scope.passwd.phonecode
                            },'修改登录密码时验证验证码');
                        } else {
                            $.qTip({
                                'type': false,
                                'text': '请输入正确的验证码'
                            });
						}
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

					// 修改交易密码
					case 'changetpwdForm':
                        // var userphone = $localStorage.user.mobilephone;
                        if ($scope.trade.phonecodejy.length == 4) {
                            resourceService.queryPost($scope, $filter('交互接口对照表')('找回交易密码验证短信验证码'),{
                                // oldPwd: $scope.passwd.usedpasswd,
                                mobilephone: $scope.userphone,
                                code: $scope.trade.phonecodejy
                            },'重置交易密码验证短信验证码');
                        } else {
                            $.qTip({
                                'type': false,
                                'text': '短信验证码错误'
                            });
                        }
						$scope.isSubmit = true;
						break;

					// 找回交易密码验证短信验证码
					case 'phonecodeForm':
						resourceService.queryPost($scope, $filter('交互接口对照表')('找回交易密码验证短信验证码'),{code: $scope.trade.phonecode},'找回交易密码验证短信验证码');
						$scope.isSubmit = true;
						break;

					// 找回交易密码设置新交易密码
					case 'setnewtpwdForm':
						resourceService.queryPost($scope, $filter('交互接口对照表')('找回交易密码设置新交易密码'),{
							tpwd: $scope.trade.newtpwd,
							confirmTpwd: $scope.trade.retpwd,
							code: $scope.trade.phonecode
						},'找回交易密码设置新交易密码');
						$scope.isSubmit = true;
						break;
				}
			}
		}
	};
	$scope.isGetVoice = false;
	// 身份认证--获取短信验证码
	$scope.bank.times = 59;
	$scope.user.times = 59;
	$scope.trade.times = 59;
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
			url: $filter('交互接口对照表')('找回交易密码获取短信验证码'),
			type: 'post',
			data: JSON.stringify({type: type}),
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
					$.qTip({
						'type': true,
						'text': '短信发送成功'
					});
				} else {
					var errorMsg = $filter('找回交易密码获取短信验证码error信息')(data.errorCode);
					if (data.errorCode == '8888') {
						$this.parents('.set-mod').find('.voice-box span').show();
					} else {
						$.qTip({
							'type': false,
							'text': errorMsg
						});
					}
					$this.removeClass('getcode-disabled');
				}
				// $scope.isSubmit = false;
			}
		});
		// resourceService.queryPost($scope, $filter('交互接口对照表')('找回交易密码获取短信验证码'),{},'找回交易密码获取短信验证码');
	};

	// 忘记交易密码
	$scope.getCodeByMsg = function(event) {
		var $this = $(event.currentTarget);
		$this.parents('.set-trade-box').slideUp(500, function() {
			$('.set-before').slideDown(500);
		});
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