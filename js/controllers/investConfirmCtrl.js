
/* si 安全认证 */
mainModule.controller('investConfirmCtrl', ['$rootScope','$scope','$filter','resourceService','$interval','$localStorage','$state','ngDialog','$location', function($rootScope,$scope,$filter,resourceService,$interval,$localStorage,$state,ngDialog,$location) {
	$scope.bank = {};
	$scope.passwd = {};
	// $scope.settruename = false;
    $localStorage.pathUrl = 'main.investConfirm';// 
	$scope.subForm = '';
	$scope.bank.getCodeText = '获取验证码';
	$scope.isSubmit = false;
	$rootScope.title = '投资确认-沪深理财';
	$rootScope.activeNav = 'account';
	$scope.hasSysBank = false;

	$scope.ecId = $localStorage.ecId;
	$scope.account = $localStorage.account;
    $scope.enfuInvestResults = $localStorage.enfuInvestResults;
    $scope.exclusiveUser = $localStorage.exclusiveUser;
    if ($location.$$path ==  "/main/investConfirm") {
        $localStorage.rechargePros = true;
    } else {
        $localStorage.rechargePros = false;
    }
    $scope.user = $localStorage.user;
    $scope.product = $localStorage.product;
    if($scope.user){
        $scope.user = $localStorage.user;
        $scope.balance = parseInt($scope.user.balance) + parseInt($scope.user.amount);
        resourceService.queryPost($scope, $filter('交互接口对照表')('我的资产首页数据'),{},'资产首页');
        //首页风险评估提示弹窗
        resourceService.queryPost($scope,$filter('交互接口对照表')('风险评测弹窗显示'),{},'风险评测弹窗显示');
    }

    var isSubmin = true;
    var Qtrget = null;
	if($localStorage.errorbank!=undefined && $localStorage.errorbank!=""){
		$scope.bank=$localStorage.errorbank;
		$scope.lastActiveBank=$localStorage.errorbank.lastActiveBank;
		$scope.hasSysBank = true;
	}

	$scope.investInfo=false;
	if($localStorage.product!=undefined && $localStorage.product!=""){
		if($localStorage.product.nowNum!=undefined && $localStorage.product.nowNum!=""){
			$scope.investInfo=true;
			$scope.product=$localStorage.product;
		}
	}
    resourceService.queryPost($scope, $filter('交互接口对照表')('安全认证数据'),{},'安全认证数据');
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type) {
            case "资产首页":
                $scope.userInfo = data.map;
                break;
            case "安全认证数据":
                if (data.success) {
                    $scope.member = data.map;
                    $scope.truenameset = data.map.realFlag;
                    $scope.tpwdset = data.map.tpwFlag;
                    // $('.trade-code-btn').text($scope.tpwdset ? '修改' : '设置');
                    // if ($localStorage.product == 'bindBank') {
                    //     $('.set-bankinfo').addClass('actived-set-wrap').find('.btn a').text('取消绑定');
                    //     $('#set-bankinfo').show();
                    //     $localStorage.product = '';
                    // } else if ($localStorage.product == 'setTruename') {
                    //     $('.set-truename').addClass('actived-set-wrap').find('.btn a').text('取消认证');
                    //     $('#set-truename').show();
                    //     $localStorage.product = '';
                    // } else if ($localStorage.product == 'setTradeCode') {
                    //     $('.set-tradecode').addClass('actived-set-wrap').find('.btn a').text('取消设置');
                    //     $('#set-tradecode').show();
                    //     $localStorage.product = '';
                    // } else if ($localStorage.product == 'forgetTradeCode') {
                    //     $('.set-tradecode').addClass('actived-set-wrap').find('.btn a').text('取消修改');
                    //     $('#set-tradecode').show().find('.set-trade-box').hide();
                    //     $('.set-before').show();
                    //     $localStorage.product = '';
                    // }
                    // if ($scope.truenameset == 0) {
                    //     resourceService.queryPost($scope, $filter('交互接口对照表')('认证支持银行列表'),{},'认证支持银行列表');
                    // }
                } else {

                }
                // $scope.isSubmit = false;
                break;
            case "确认投资":
                isSubmin = true;
                $scope.isShowOver = true;
                $scope.success = data.success;
                $scope.nextInvestNumber = $scope.product.nowNum;
                $scope.product.tpwd = null;
                $scope.redbag = false;
                if (data.success) {
                    $localStorage.product.investTime = $scope.product.investTime = data.map.investTime;
                    // 砸蛋奖品已领取
                    if($localStorage.drAwardMemberLog) {
                        $localStorage.drAwardMemberLog.status = 1;
                    }
                    _hmt.push(['_trackPageview', 'www.hushenlc.cn/maidian/tzcg']);

                    // if(data.map.isGivenLotteryOpp){
                    //     $scope.toHit = true;
                    // }else{
                    //     $scope.toHit = false;
                    // }

                    // 新手标续投
                    if ($scope.product.type == 1) {
                        $localStorage.newhandPro = $scope.product;
                        ngDialog.closeAll();
                        $state.go('main.myAccount.accountHome');
                        // $state.go('main.newhandSuccess',{nowNum: $scope.product.nowNum});
                    }

                    if (data.success) {
                        $scope.redbag = true;
                    } else {
                        $scope.redbag = false;
                    }

                    $scope.pText = '恭喜您！投资成功！';
                    // $scope.comTxt = '投资成功！';
                    $scope.statusCode = 'succes';
                    // resourceService.queryPost($scope, $filter('交互接口对照表')('票据详情'), {id: $scope.product.id}, '票据详情');
                    $scope.investTime = data.map.investTime;

                    //抽奖活动
                    $scope.luckCodeCount = data.map.luckCodeCount;
                    $scope.luckCodes = data.map.luckCodes;
                    //有抽奖码不弹砸蛋弹框
                    if($scope.luckCodeCount && $scope.luckCodes){
                        $scope.toHit = false;
                        $scope.showLuckCode = true;
                        $scope.comInvestSuc = false;
                    } else {
                        $scope.comInvestSuc = true;
                    }

                    if (data.map.isRepeats != undefined) {
                        $scope.isRepeats = data.map.isRepeats;
                    } else {
                        $scope.isRepeats = false;
                    }
                    $scope.isDoubleEgg = data.map.isDoubleEgg;
                    $scope.isShowOver = false;
                    // $filter('投资确认弹窗')($scope);
                    ngDialog.closeAll();

                    // $scope.enfuInvestResults = $localStorage.enfuInvestResults;
                    // $state.go('main.investSucess', {isShowOver:$scope.isShowOver, isRepeats:$scope.isRepeats, comInvestSuc:$scope.comInvestSuc, isSuc:$scope.success, statusCode:$scope.statusCode, redbag:$scope.redbag });
                    //恩弗活动投资成功跳转
                    if($localStorage.efCode == 'enfu'){
                        $scope.product.huikuan=parseInt(data.map.investTime)+parseInt($scope.product.deadline)*3600*1000*24;
                        $scope.product.benxi=$scope.product.rate/100 / 360 *$scope.product.amount * $scope.product.deadline+$scope.product.amount;
                        $localStorage.enfuInvestResults = {
                            id:$scope.product.id,
                            amount:$scope.product.amount,
                            fullName: $scope.product.fullName,
                            deadline: $scope.product.deadline,
                            huikuan: $scope.product.huikuan,
                            benxi: $scope.product.benxi,
                            enFuConvertCode: data.map.enFuConvertCode,  
                        };
                        $state.go('main.enfuInvestSucess');
                    }else{
                        $localStorage.investResults = $scope.investResults = {
                            isShowOver: $scope.isShowOver,
                            isRepeats: $scope.isRepeats,
                            comInvestSuc: $scope.comInvestSuc,
                            isSuc: $scope.isSuc,
                            statusCode: $scope.statusCode,
                            redbag: $scope.redbag,
                            pText: $scope.pText,
                            showForgetPwd: $scope.showForgetPwd,
                        };
                        $state.go('main.investSucess');
                    }
                    

                } else {
                    if(data.errorCode == '1007') {
                        $filter("余额不足弹窗")($scope);
                    }
                    if($scope.product.status != 5) {
                        ngDialog.closeAll();
                        $filter('产品被抢光弹窗')($scope);
                    }
                    if (data.errorCode == '2001') {
                        $scope.showForgetPwd = true;
                    } else {
                        $scope.showForgetPwd = false;
                    }
                    if ($filter('确认投资服务器Error')(data.errorCode) == undefined) {
                        $scope.statusCode = 'error';
                        $scope.pText = data.errorMsg;
                    } else {
                        $scope.statusCode = $filter('确认投资服务器Error')(data.errorCode).classCode;
                        $scope.pText = $filter('确认投资服务器Error')(data.errorCode).text;
                    }
                    $scope.redbag = false;

                    $localStorage.investResults = $scope.investResults = {
                        isShowOver: $scope.isShowOver,
                        isRepeats: $scope.isRepeats,
                        comInvestSuc: $scope.comInvestSuc,
                        isSuc: $scope.isSuc,
                        statusCode: $scope.statusCode,
                        redbag: $scope.redbag,
                        pText: $scope.pText,
                        showForgetPwd: $scope.showForgetPwd,
                    };
                    // $scope.enfuInvestResults = $localStorage.enfuInvestResults;
                    $state.go('main.investSucess');
                }
                break;
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
                    $scope.isSubmit = false;
                    $scope.tpwdset = true;
					// $scope.$apply(function() {
					// 	$scope.isSubmit = false;
					// 	$scope.tpwdset = true;
					// });

                } else {
                    var errorMsg = $filter('设置交易密码error信息')(data.errorCode);
                    $.qTip({
                        'type': false,
                        'text': errorMsg
                    });
                    $scope.isSubmit = false;
                }
                break;
            case "风险评测弹窗显示":
                if(data.success){
                    $scope.riskTip =data.map.show;
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

                switch(formname) {
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
                        resourceService.queryPost($scope, $filter('交互接口对照表')('修改交易密码'),{
                            oldPwd: $scope.trade.usedtpasswd,
                            tpwd: $scope.trade.newtpasswd,
                            confirmTpwd: $scope.trade.retradepasswd
                        },'修改交易密码');
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
    $scope.onClick = function (type, event, num) {
        switch (type) {
            case "确认投资":
                if (isSubmin) {
                    isSubmin = false;
                    Qtrget = event;
                    var obj = {};
                    if(!!$localStorage.product && !!$localStorage.product.fid) {
                        obj.fid = $localStorage.product.fid;
                    } else {

                    }
                    obj.pid = $scope.product.id;

                    if($localStorage.efCode == 'enfu') {
                        obj.activityCode = 'enfu';
                    }
                    //抽奖活动-抽奖码
                    // if($scope.product.drawCode){
                    //     $scope.product.nowNum=$scope.product.drawCode*$scope.awardInfo.lotteryCodePrice;
                    // }

                    // resourceService.queryPost($scope, $filter('交互接口对照表')('当天首次投资'), {}, '当天首次投资');
                    if($scope.ecId) {
                        // obj.tpwd = $scope.tpwdVerify;
                        obj.tpwd = $scope.product.tpwd;;
                        obj.amount = $scope.maxAmount;
                        obj.rid = $scope.ecId;
                        obj.awardRecordId = $localStorage.prizeId;
                        obj.activityType = 0;

                        if(!!$localStorage.product && !!$localStorage.product.fid) {
                            obj.fid = $localStorage.product.fid;
                        }

                        if ((!!$scope.userInfo && $scope.userInfo.balance < $scope.product.leastaAmount) || ($scope.userInfo.balance < $scope.product.nowNum)) {
                            $localStorage.balanceNotEnough = true;
                            $localStorage.balanceNotEnoughId = $location.$$search.id;
                            $filter("余额不足弹窗")($scope);
                        } else if($scope.riskTip){
                             $filter('风险评测首页提示弹窗')($scope);
                        } else{
                            resourceService.queryPost($scope, $filter('交互接口对照表')('确认投资'), obj, '确认投资');
                        }
                    } else {
                        if (!!$scope.userInfo && ($scope.userInfo.balance < $scope.product.leastaAmount) || ($scope.userInfo.balance < $scope.product.nowNum)) {
                            $localStorage.balanceNotEnough = true;
                            $localStorage.balanceNotEnoughId = $location.$$search.id;
                            $filter("余额不足弹窗")($scope);
                        } else if($scope.riskTip){
                             $filter('风险评测首页提示弹窗')($scope);
                        } else {
                            obj.tpwd = $scope.product.tpwd;
                            obj.amount = $scope.product.nowNum;
                            obj.awardRecordId = $localStorage.prizeId;
                            obj.activityType = 0;
                            if (Qtrget != null) {
                                obj.fid = Qtrget.id;
                            } else if ($scope.isNewGay) {
                                // obj.fid = $scope.TYJ.id;
                            } else if (($scope.fristInvest && $scope.ecId) && ($scope.fristInvest.investCount == 0 && $scope.FBQList.length > 0)) {
                                obj.fid = $scope.FBQList[0].id;
                            };
                            if(!!$localStorage.product && !!$localStorage.product.fid) {
                                obj.fid = $localStorage.product.fid;
                            }
                            obj.fid = $location.$$search.fid;
                            if (!$scope.product.atid) {
                                resourceService.queryPost($scope, $filter('交互接口对照表')('确认投资'), obj, '确认投资');
                            } else {
                                resourceService.queryPost($scope, $filter('交互接口对照表')('确认投资'), obj, '确认投资');
                            }
                        }
                    }
                }
                break;
        }
        ;
    };
	$scope.changeSysBank = function(index) {
		$scope.activeSysBank = $scope.sysBankList[index];
	};
	$scope.sureSysBank = function() {
		$scope.lastActiveBank = $scope.activeSysBank;
		$scope.hasSysBank = true;
		ngDialog.closeAll();
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