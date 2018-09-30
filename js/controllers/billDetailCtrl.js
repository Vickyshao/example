/*lee 产品详情页*/
mainModule.controller('billDetailCtrl', ['$rootScope', '$scope', '$state', '$localStorage', 'resourceService', '$filter', 'communicationService', '$timeout', '$location', 'ngDialog', '$element', 'MAIN_MENU', 'storage', '$stateParams', function ($rootScope, $scope, $state, $localStorage, resourceService, $filter, communicationService, $timeout, $location, ngDialog, $element, MAINMENU, storage, $stateParams) {
    $filter('isLogin')($scope);
    $(window).scrollTop(0);
    MAINMENU.menuname('bill', 'menu');
    $scope.product = $localStorage.product;
    $scope.path = $localStorage.pathObj;
    $scope.title = '项目详情';
    $scope.portName = '投资记录';
    $scope.playSound = true;
    $scope.amount = 0;
    $scope.showTabNum = 0;
    $scope.isShowDetail = false;
    $scope.isShowIntroduce = false;
    $scope.isShowGuarantee = false;
    $scope.isShowInvest = false;
    $scope.ischufa = false;
    $scope.isShowShouyi = false;
    $scope.isFinish = false;

    $scope.goldACT = false;

    $scope.hasGold = false;

    $scope.sureNoGold = false;

    $scope.reimId = $stateParams.reimId;
    $scope.ecId = $stateParams.ecId;
    $scope.isEnFuPro = false;

    $scope.isReimPro = false;
    if($stateParams.ecId) {
        $scope.isReimPro = true;
    }

    //删除本地的恩弗标记
    if($localStorage.efCode!=undefined){
        delete $localStorage.efCode;
    }

    $scope.bill = {};
    $scope.pro = {};
    //所有可用优惠券
    $scope.couponInfo = {
        comboxList:[],      //下拉框优惠券列表
        isOpenCombox:false  //是否展开Combox  false:关闭   true：打开
    };
    $scope.bill.pageOn = 1;
    $scope.bill.pageSize = 10;
    delete $localStorage.inProfitProductList;

    $scope.isLogin = $filter('isRegister')().register;

    if($localStorage.drAwardMemberLog) {
        $scope.drAwardMemberLog = $localStorage.drAwardMemberLog;
    }

    if (!!$localStorage.user) {
        resourceService.queryPost($scope, $filter('交互接口对照表')('我的资产首页数据'), {}, '账户信息');
        resourceService.queryPost($scope, $filter('交互接口对照表')('产品列表'), {}, '产品列表');
        // resourceService.queryPost($scope,$filter('交互接口对照表')('我的优惠券'),{flag:1},'我的优惠券');
    }

    // delete $localStorage.protocolIds;

    // 未设置交易密码时--去安全认证页面设置
    $scope.setTradeCode = function () {
        ngDialog.closeAll();
        $filter('跳转页面')('', 'main.myAccount.recharge', 'main.myAccount.security', 'setTradeCode', null, {
            name: '账户管理',
            url: 'main.myAccount.security'
        });
    };
    $scope.showPastList = false;
    $scope.investListPast = [];
    $scope.isNumCash = false;
    var isSubmin = true;
    var balance;
    $scope.selectMyWinning = function () {
        $filter('跳转页面')('', 'main.billDetail', 'main.myAccount.winningRecord', '', null, {
            name: '活动中心',
            url: 'main.myAccount.winningRecord'
        });
        ngDialog.closeAll();
    }
    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
        switch (type) {
            case '账户信息':
                if (data.success) {
                    $localStorage.bankVerify = data.map.bankVerify;
                    $scope.tpwdVerify = data.map.tpwdVerify;
                    $scope.bankVerify = data.map.bankVerify;
                }
                break;
            case '投资记录':
                if (data.success) {
                    $scope.total = data.map.page.total;
                    if (!$scope.total) {
                        $scope.total = 0;
                    }
                    $scope.investList = data.map.page.rows;
                    $scope.allUserNum = data.map.page.rows.length;
                    $scope.bill = data.map.page;
                    $scope.bill.pages = [];
                    for (var i = 0; i < parseInt($scope.bill.totalPage); i++) {
                        $scope.bill.pages[i] = i + 1;
                    }
                    ;
                }
                break;
            case '续投资记录':
                if (data.success) {
                    $scope.investListPast = data.map.page.rows;
                    $scope.allUserNumPast = data.map.page.rows.length;
                    $scope.billPast = data.map.page;
                    $scope.totalPast = data.map.page.total;
                    $scope.billPast.pages = [];
                    for (var i = 0; i < parseInt($scope.billPast.totalPage); i++) {
                        $scope.billPast.pages[i] = i + 1;
                    }
                    ;
                }
                break;
            case '用户信息':
                if (data.success) {
                    $localStorage.user = data.map;
                    $scope.balance = $localStorage.user.balance;
                }
                break;
            case '新手标体验金':
                if (data.success) {
                    $scope.tyjCoupons = data.map.list;
                    if ($scope.tyjCoupons.length > 0) {
                        $scope.TYJ = {};
                        $scope.TYJ = $scope.tyjCoupons[0];
                        var maxNum = Math.max.apply(Math, [$scope.tyjCoupons[0].amount, $scope.tyjCoupons[1].amount, $scope.tyjCoupons[2].amount]);
                        for (var i = 0; i < $scope.tyjCoupons.length; i++) {
                            if (maxNum == $scope.tyjCoupons[i].amount) {
                                $scope.tyjCoupons[i].tyjCouponBool = true;
                                if ($scope.tyjCoupons[i]) {
                                    //首投

                                }
                            } else {
                                $scope.tyjCoupons[i].tyjCouponBool = false;
                            }
                        }
                        ;
                        $scope.product.nowNum = $scope.tyjCoupons[0].enableAmount;
                    }
                }
                break;
            case "票据详情":
                $scope.repayPeriod = data.map.repayPeriod;
                $scope.firstRepayDate = data.map.firstRepayDate;
                $localStorage.product = $scope.product = data.map.info;
                $localStorage.product.totalAmount = $scope.product.totalAmount = data.map.info.amount;
                $localStorage.product.specialRate=data.map.specialRate;
                $scope.extendInfos = data.map.extendInfos;
                $scope.repair = data.map.repair;
                $scope.isOldUser = data.map.isOldUser;
                $scope.specialRate = Number(data.map.specialRate);
                $scope.drMemberFavourableList = data.map.drMemberFavourableList;
                $scope.isShowLabel = data.map.isShowLabel;
                $scope.product.maxAmount = data.map.info.maxAmount;
                $scope.reimAmount = data.map.info.maxAmount;  //报销专属标金额固定
                $scope.balance = data.map.balance;
                //关于风险评测
                $scope.showDilog = data.map.showDilog;
                $scope.allowInvest = data.map.allowInvest;
                if(data.map.myType!=undefined && data.map.myType!=''){
                    $scope.myType = data.map.myType;
                }

                if(!!data.map.info.bountry) {
                    $scope.bountry = data.map.info.bountry;
                }
                if(!!data.map.info.luckyman) {
                    $scope.luckyman = data.map.info.luckyman;
                }
                // 可用红包
                $scope.isCash = !!data.map.info.isCash;
                // 可用加息券
                $scope.isInterest = !!data.map.info.isInterest;
                // 可用翻倍券
                $scope.isDouble = !!data.map.info.isDouble;

                if (data.map.info.type == 1) {
                    $scope.newHandInvested = data.map.newHandInvested;
                    $scope.isShowDetail = true;
                    $scope.isShowIntroduce = false;
                } else {
                    $scope.newHandInvested = 0;
                    $scope.isShowDetail = false;
                    $scope.isShowIntroduce = true;
                }

                //抽奖活动-初始化抽奖码
                if(data.map.info.atid){
                    if(data.map.awardInfo != undefined){
                        $scope.awardInfo=data.map.awardInfo;
                        $scope.surplusCode=$scope.product.surplusAmount/$scope.awardInfo.lotteryCodePrice;
                        if($scope.surplusCode>10){
                            $scope.product.drawCode=10;
                            $scope.unminus=false;
                            $scope.unadd=false;
                        }else if($scope.surplusCode>1){
                            $scope.product.drawCode=$scope.surplusCode;
                            $scope.unminus=false;
                            $scope.unadd=true;
                        }else if($scope.surplusCode=1){
                            $scope.product.drawCode=$scope.surplusCode;
                            $scope.unminus=true;
                            $scope.unadd=true;
                        }
                    }
                }

                // 存管
                $scope.isFuiou = data.map.isFuiou;

                if ($scope.drMemberFavourableList != undefined) {
                    var drlength = $scope.drMemberFavourableList.length;
                    for (var k = 0; k < drlength; k++) {
                        if ($scope.drMemberFavourableList[k].source == 100) {
                            if ($scope.product.type == 1) {
                                $scope.hasGold = true;
                            }
                        }
                    }
                }

                if ($scope.isOldUser && $scope.specialRate != undefined && $scope.specialRate > 0) {
                    $scope.onDoubleEgg = true;
                } else {
                    $scope.onDoubleEgg = false;
                }

                if (data.map.projectList != undefined) {
                    if (data.map.projectList.length != 0) {
                        $scope.projectList = data.map.projectList;
                        $scope.projectListData = true;
                    }
                } else {
                    $scope.projectListData = false;
                }
                if ($scope.product.fid != undefined) {
                    $scope.showPast = true;
                    resourceService.queryPost($scope, $filter('交互接口对照表')('投资记录'), {
                        pid: $scope.product.fid,
                        pageOn: 1,
                        pageSize: 10
                    }, '续投资记录');
                } else {
                    $scope.showPast = false;
                }

                if (data.map.info.type == 1) {
                    $rootScope.title = '新手标-沪深理财';
                    $scope.goPage($scope);
                    // if($localStorage.user != undefined){
                    // 	resourceService.queryPost($scope,$filter('交互接口对照表')('用户可用优惠券'),{
                    // 		pid : $scope.product.id,
                    // 		amount:$scope.product.nowNum
                    // 	},'新手标体验金');
                    // }
                } else if (data.map.info.type == 2) {
                    $scope.goPage($scope);
                    $rootScope.title = '优选投资-沪深理财';
                } else if (data.map.info.type == 3) {
                    $scope.goPage($scope);
                    $rootScope.title = '优选投资-沪深理财';
                }
                $scope.XQ = data.map;
                $scope.pics = data.map.picList;

                if (data.map.funds != undefined) {
                    $scope.account = {};
                    $localStorage.account = $scope.account = data.map.funds;//用户资金
                    if (!!$scope.account){
                        $localStorage.user.balance = $scope.account.balance;
                        //$scope.account.balance = $scope.account.balance;
                    }

                    $scope.balance = $localStorage.user.balance;
                    // if($scope.account.investAmount <= 0 && $scope.product.type == 1){
                    // 	$scope.isNewGay = true;
                    // }else{
                    // 	$scope.isNewGay = false;
                    // };
                    if ($scope.XQ.newHandInvested == false && $scope.product.type == 1 && $scope.XQ.isInvested == false) {
                        $scope.isNewGay = true;
                    } else {
                        $scope.isNewGay = false;
                    }

                    if ($scope.product) {
                        resourceService.queryPost($scope, $filter('交互接口对照表')('用户可用优惠券'), {
                            pid: $scope.product.id,
                            amount: $scope.product.nowNum
                        }, '用户可用优惠券');
                    }
                } else {
                    delete $localStorage.user;
                }
                $scope.product = data.map.info;
                var borrower = $filter('截取段落')($scope.product.borrower);
                var introduce = $filter('截取段落')($scope.product.introduce);
                var repaySource = $filter('截取段落')($scope.product.repaySource);
                var windMeasure = $filter('截取段落')($scope.product.windMeasure);
                $scope.product.borrower = borrower;
                $scope.product.introduce = introduce;
                $scope.product.repaySource = repaySource;
                $scope.product.windMeasure = windMeasure;
                if ($scope.product.atid) {
                    $scope.isShowHDXQ = true;
                    $scope.isShowIntroduce = false;
                    $scope.isShowGuarantee = false;
                    $scope.isShowInvest = false;
                    $scope.ischufa = false;
                    $scope.isShowShouyi = false;
                    $scope.isFinish = false;
                }
                // 注释
                // $scope.product.nowNum = $scope.product.leastaAmount;

                // 活动标
                if ($localStorage.specialId == $scope.product.id) {
                    $scope.product.nowNum = $localStorage.specialNowNum;
                } else {
                    if ($localStorage.specialNowNum) {
                        delete $localStorage.specialNowNum;
                    }
                }

                if ($scope.product.establish != undefined) {
                    var date3 = $scope.product.establish - Date.parse(new Date());
                    var day = Math.floor(date3 / (24 * 3600 * 1000));
                    var hh = Math.floor(date3 / (3600 * 1000));
                    if (day > 0) {
                        $scope.nowTimer = day + '天';
                        // $scope.isFinish = true;
                    } else if (day == 0 && hh > 1) {
                        $scope.nowTimer = hh + '小时';
                        // $scope.isFinish = true;
                        $scope.isBuTimer = true;
                    } else if (day == 0 && hh < 1) {
                        $scope.nowTimer = '1小时内'
                        // $scope.isFinish = true;
                    } else if (hh < 0) {
                        $scope.nowTimer = '已结束';
                        $scope.isFinish = true;
                    }
                } else {
                    $scope.nowTimer = '已结束';
                    $scope.isFinish = true;
                }
                ;
                // if($filter('isRegister')().register&&$scope.product.isRepair==1&& $scope.isBuTimer == true&& $scope.product.surplusAmount <= 2000 ){
                if ($filter('isRegister')().register && $scope.product.isRepair == 1 && $scope.repair != undefined) {
                    $scope.ischufa = true;
                }
                // if($scope.product.isRepair!=1||$scope.isBuTimer == false||$scope.product.surplusAmount > 2000 ){
                if ($scope.product.isRepair != 1 || $scope.repair == undefined) {
                    $scope.ischufa = false;
                }
                if ($scope.repair != undefined) {
                    // if($scope.product.isRepair==1 && $scope.isBuTimer == true &&  $scope.product.surplusAmount <= 2000 && $scope.repair.type == 1){
                    if ($scope.product.isRepair == 1 && $scope.repair.type == 1) {
                        $scope.isShowShouyi = true;
                    }
                }
                if ($scope.product.atid) {
                    $scope.investTotal = data.map.investTotal;
                    resourceService.queryPost($scope, $filter('交互接口对照表')('getPrizeInfoByProductId') + "?id=" + $scope.product.id, {id: $scope.product.id}, '本期中奖');
                    resourceService.queryPost($scope, $filter('交互接口对照表')('活动开奖结果'), {}, '活动开奖结果');
                }
                if (storage.storageData) {
                    $scope.isShowHDXQ = false;
                    $scope.isShowIntroduce = false;
                    $scope.isShowGuarantee = false;
                    $scope.isShowInvest = false;
                    $scope.isShowWinning = true;
                    storage.storageData = false;
                    $timeout(function () {
                        $("html,body").animate({scrollTop: $('.bill-detail-info').offset().top})
                    });
                }

                // 预约下期
                if (data.map.isReservation != undefined) {
                    $scope.isReservation = data.map.isReservation;
                } else {
                    $scope.isReservation = false;
                }
                if (data.map.realverify != undefined) {
                    $scope.realverify = data.map.realverify;
                }
                if (data.map.prid != undefined) {
                    $scope.prid = data.map.prid;
                }
                if (data.map.name != undefined) {
                    $scope.name = data.map.name;
                }
                //    if ($stateParams.redBagFid && data.map.funds) {
                //    	if ($localStorage.promoteEnableAmount) {
                // 		if (data.map.funds.balance < $localStorage.promoteEnableAmount) {
                // 			alert('账户余额不足，请充值！');
                // 			// $scope.product.nowNum = $localStorage.promoteEnableAmount;
                // 			delete $localStorage.promoteEnableAmount;
                // 		}
                //    	}
                // }
                break;
            /*case "当天首次投资":
                $localStorage.IsInvested=data.map.IsInvested;
                if(!data.map.IsInvested){
                    $scope.toHit = true;
                }else{
                    $scope.toHit = false;
                }

                break;*/
            case "确认投资":
                isSubmin = true;
                $scope.isShowOver = false;
                $scope.success = data.success;
                $scope.nextInvestNumber = $scope.product.nowNum;
                $scope.product.tpwd = null;
                $scope.redbag = false;
                if (data.success) {
                    $localStorage.product.investTime = $scope.product.investTime = data.map.investTime;
                    $localStorage.isInNewYearActivityTime = $scope.isInNewYearActivityTime = data.map.isInNewYearActivityTime;

                    // 砸蛋奖品已领取
                    if($localStorage.drAwardMemberLog) {
                        $localStorage.drAwardMemberLog.status = 1;
                    }
                    _hmt.push(['_trackPageview', 'www.hushenlc.cn/maidian/tzcg']);

                    /*//砸蛋机会
                    if(data.map.isGivenLotteryOpp){
                        $scope.toHit = true;
                    }else{
                        $scope.toHit = false;
                    }*/

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
                    $scope.statusCode = 'success';
                    // resourceService.queryPost($scope, $filter('交互接口对照表')('票据详情'), {id: $scope.product.id}, '票据详情');
                    $localStorage.product.investTime =  $scope.investTime = data.map.investTime;
                    //抽奖活动
                    $localStorage.luckCodeCount = data.map.luckCodeCount ? data.map.luckCodeCount : null;
                    $localStorage.luckCodes = $scope.luckCodes = data.map.luckCodes ? data.map.luckCodes : null;
                    //有抽奖码不弹砸蛋弹框
                    if($scope.luckCodeCount && $scope.luckCodes){
                        // $scope.toHit = false;
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

                    ngDialog.closeAll();
                    // $state.go('main.investSucess', {isShowOver:$scope.isShowOver, isRepeats:$scope.isRepeats, comInvestSuc:$scope.comInvestSuc, isSuc:$scope.success, statusCode:$scope.statusCode, redbag:$scope.redbag });
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
                } else {
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
                    $localStorage.product.statusCode =  $scope.statusCode;
                    $localStorage.product.pText = $scope.pText;
                    $scope.redbag = false;
                    ngDialog.closeAll();
                    // $state.go('main.investSucess', {isShowOver:$scope.isShowOver, isRepeats:$scope.isRepeats, comInvestSuc:$scope.comInvestSuc, isSuc:$scope.success});
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
                break;
            case "用户可用优惠券":
                $scope.hb = null;
                if (data.success) {
                    $scope.HBList = [];
                    $scope.QList = [];
                    $scope.FBQList = [];
                    $scope.fristInvest = data.map;
                    $scope.EggQList = [];
                    $scope.clickBox = true;
                    for (var i = 0; i < data.map.list.length; i++) {
                        switch (data.map.list[i].type) {
                            case 1:
                                data.map.list[i].sel = false;
                                $scope.HBList.push(data.map.list[i]);

                                // 复投红包
                                if (Qtrget == null && $stateParams.redBagFid != undefined && $stateParams.redBagFid == data.map.list[i].id) {
                                    Qtrget = data.map.list[i];
                                    $scope.hb = data.map.list[i];
                                }
                                break;
                            case 2:
                                data.map.list[i].sel = false;
                                $scope.QList.push(data.map.list[i]);

                                // 砸金蛋的加息券
                                if (data.map.list[i].fullName != undefined && Qtrget == null && $stateParams.redBagFid == undefined) {
                                    Qtrget = data.map.list[i];
                                    $scope.hb = data.map.list[i];
                                    // $scope.EggQList.push(data.map.list[i]);
                                }
                                break;
                            case 4:
                                data.map.list[i].sel = false;
                                if (data.map.list[i].source == 0) {
                                    $scope.FBQList.unshift(data.map.list[i]);
                                } else {
                                    $scope.FBQList.push(data.map.list[i])
                                }
                                break;
                        }
                        ;
                    }
                    // 砸金蛋的加息券
                    if (Qtrget != null) {
                        if (Qtrget.type == 1) {
                            $scope.clickBox = 0;
                        } else if (Qtrget.type == 2) {
                            $scope.clickBox = 1;
                        }
                        Qtrget.sel = true;
                    } else if ($scope.HBList.length > 0) {
                        $scope.clickBox = 0;
                    } else if ($scope.QList.length > 0) {
                        $scope.clickBox = 1;
                    } else if ($scope.FBQList.length > 0) {
                        $scope.clickBox = 2;
                    } else {
                        $scope.clickBox = 999;
                    }
                    $scope.isShowOver = true;
                    // $filter('投资确认弹窗')($scope);

                    $scope.couponInfo.comboxList = data.map.list;
                    $scope.sortComboxCouponList(null);
                }
                break;
            case '我的优惠券':
                if (data.success) {
                    $scope.HBList=[];
                    $scope.QList=[];
                    $scope.FBQList=[];
                    $scope.TYJ={};
                    for (var i = 0; i < data.map.list.length; i++) {
                        switch(data.map.list[i].type){
                            case 1:
                                data.map.list[i].sel=false;
                                $scope.HBList.push(data.map.list[i]);
                                break;
                            case 2:
                                data.map.list[i].sel=false;
                                $scope.QList.push(data.map.list[i]);
                                break;
                            case 3:
                                // $scope.TYJ = data.map.list[i];
                                data.map.list[i].sel=false;
                                $scope.HBList.push(data.map.list[i]);
                  break;
                            case 4:
                                // $scope.TYJ = data.map.list[i];
                                data.map.list[i].sel=false;
                                $scope.FBQList.push(data.map.list[i]);
                                break;
                        };
                    }
                    $scope.couponLength = 0;
                    $scope.couponUsedLength = 0;
                    $scope.couponDisabledLength = 0;
                    for (var i = 0; i < $scope.QList.length; i++) {
                        if ($scope.QList[i].status == 0) {
                            $scope.couponLength ++;
                        } else if ($scope.QList[i].status == 1) {
                            $scope.couponUsedLength ++;
                        } else if ($scope.QList[i].status == 2) {
                            $scope.couponDisabledLength ++;
                        }
                    }
                    $scope.tipsLength = 0;
                    $scope.tipsUsedLength = 0;
                    $scope.tipsDisabledLength = 0;
                    var currMillTimes = new Date().getTime();
                    for (var i = 0; i < $scope.HBList.length; i++) {
                        if ($scope.HBList[i].status == 0) {
                            if(currMillTimes <= $scope.HBList[i].expireDate){
                                $scope.tipsLength ++;   //可用红包
                            }else {
                                $scope.tipsDisabledLength ++;
                            }

                        } else if ($scope.HBList[i].status == 1) {
                            $scope.tipsUsedLength ++;
                        } else if ($scope.HBList[i].status == 2) {
                            $scope.tipsDisabledLength ++;
                        }
                    }
                    $scope.fbqLength = 0;
                    $scope.fbqUsedLength = 0;
                    $scope.fbqDisabledLength = 0;

                    for (var i = 0; i < $scope.FBQList.length; i++) {
                        if ($scope.FBQList[i].status == 0) {
                            $scope.fbqLength ++;
                        } else if ($scope.FBQList[i].status == 1) {
                            $scope.fbqUsedLength ++;
                        } else if ($scope.FBQList[i].status == 2) {
                            $scope.fbqDisabledLength ++;
                        }
                    }
                }
                break;
            case '本期中奖':
                if (data.success) {
                    if (data.map.list.length > 0) {
                        $scope.winningPerson = data.map.list[0];
                        // if(!$scope.winningPerson.prizeImgUrl){
                        // 	$scope.winningPerson.prizeImgUrl='images/cs90/defaultheader.png';
                        // }
                        if ($scope.winningPerson.prizeContent != undefined) {
                            if ($scope.winningPerson.prizeContent.length > 63) {
                                $scope.winningPerson.prizeContent = $scope.winningPerson.prizeContent.substr(0, 63) + '...';
                            }
                        }
                    }
                    $scope.pcDetailImg = data.map.pcDetailImg;
                }
                break;
            case '预约下期':
                if (data.success) {
                    $scope.closeDialog();
                    $scope.bookType = 'success';
                    $filter('预定弹窗')($scope);
                } else {
                    if (data.errorCode == '1003') {
                        $scope.closeDialog();
                        $scope.bookType = 'fin';
                        $filter('预定弹窗')($scope);
                    }
                }
                break;
            case "活动开奖结果":
                if (data.success) {
                    $scope.history = data.map.history;
                    if ($scope.history.length > 4) {
                        $scope.history.length = 4;
                    }
                    var length = $scope.history.length;
                    for (var i = 0; i < length; i++) {
                        if ($scope.history[i].prizeContent != undefined) {
                            if ($scope.history[i].prizeContent.length > 110) {
                                $scope.history[i].prizeContent = $scope.history[i].prizeContent.substr(0, 110) + '...';
                            }
                        }
                    }
                }
                break;
            case "产品列表":
                if (data.success) {
                    $scope.type = data.map.newhand.type;
                }
        }
        ;
    });

    $scope.selTYJ = false;
    $scope.onSelTyj = function (item) {
        // 选体验金
        for (var i = 0; i < $scope.tyjCoupons.length; i++) {
            $scope.tyjCoupons[i].tyjCouponBool = false;
        }
        item.tyjCouponBool = true;
        if ($scope.product.nowNum < item.enableAmount) {
            $scope.product.nowNum = item.enableAmount;
        }
        $scope.TYJ = item;
        if (item.enableAmount < $scope.product.nowNum) {
            $scope.selTYJ = true;
        }
    };
    $scope.closeDialog = function (bool) {
        ngDialog.closeAll();
    };
    var $win = $(window);
    $win.on('load resize scroll', function () {
        $('.mask-imgs').height($win.height()).width($win.width());
        $('.mask-imgs li').height($win.height()).width($win.width());
        $('.mask-imgs li img').css('max-height', $win.height()).css('max-width', $win.width());
    });

    $('.explain').on('mouseover', function () {
        $(this).addClass('showexplain');
    }).on('mouseout', function () {
        $(this).removeClass('showexplain');
    });


    $('.ico_point').on('mouseenter mouseover', function () {
        $('.finance_tip').removeClass('hide');
    }).on('mouseout mouseleave', function () {
        $('.finance_tip').addClass('hide');
    });

    //controller里对应的处理函数
    $scope.renderFinish = function () {
        if ($('.img-detail .imgs li').length <= 3) {
            $('.img-detail .imgs ul').addClass('center-img');
            $('.bill-turn-right').addClass('displaybtn');
        }
        $('.bill-turn-left').addClass('displaybtn');
        var lastindex = $('.img-detail .imgs li').length - 3;
        var mySwiper = new Swiper('.swiper-container', {
            slidesPerView: 3,
            paginationClickable: true,
            loop: false
        });

        $('.bill-turn-left').on('click', function (e) {
            if ($('.bill-turn-left').hasClass('displaybtn')) {
                return;
            }
            e.preventDefault();
            mySwiper.slidePrev();
            $('.bill-turn-right').removeClass('displaybtn');
            if (mySwiper.slides[0].isActive()) {
                $('.bill-turn-left').addClass('displaybtn');
            } else {
                $('.bill-turn-left').removeClass('displaybtn');
            }
        });
        $('.bill-turn-right').on('click', function (e) {
            if ($('.bill-turn-right').hasClass('displaybtn')) {
                return;
            }
            e.preventDefault();
            mySwiper.slideNext();
            $('.bill-turn-left').removeClass('displaybtn');
            if (mySwiper.slides[lastindex].isActive()) {
                $('.bill-turn-right').addClass('displaybtn');
            } else {
                $('.bill-turn-right').removeClass('displaybtn');
            }
        });

        var mySwiper1 = new Swiper('.swiper-container1', {
            slidesPerView: 1,
            paginationClickable: true
        });

        $('.img-detail .imgs li').on('click', function () {
            var index = $(this).index();
            if (!mySwiper1.browser.ie8) {
                mySwiper1.slideTo(index, 1000, false);
            }
            // mySwiper1.swipeTo(index, 1000, false);
            $('.mask-imgs').eq(0).addClass('show-mask');
        });
    };
    $('.mask-imgs .close').on('click', function () {
        $(this).parents('.mask-imgs').removeClass('show-mask');
    });
    var mySwiper2 = new Swiper('.swiper-container2', {
        slidesPerView: 1,
        paginationClickable: true
    });
    /*补标说明*/
    $(".bubiaoBox").on('mousemove', function () {
        $('.NNSM').css("display", "block");
    });
    $(".bubiaoBox").on('mouseout', function () {
        $('.NNSM').css("display", "none");
    });
    $scope.onClickPastPage = function (type, pageNum, listtype) {
        switch (type) {
            case "beforPage":
                if ($scope.billPast.pageOn > 1) {
                    $scope.billPast.pageOn -= 1;
                    $scope.goPagePast($scope);
                }
                ;
                break;
            case "currentPage":
                $scope.billPast.pageOn = pageNum;
                $scope.goPagePast($scope);
                break;
            case "nextPage":
                if ($scope.billPast.pageOn < $scope.billPast.pages.length) {
                    $scope.billPast.pageOn += 1;
                    $scope.goPagePast($scope);
                }
                ;
                break;
        }
        ;
    };

    $scope.goPagePast = function (scope) {
        var obj = {};
        obj.pageOn = scope.billPast.pageOn;
        obj.pageSize = 10;
        obj.pid = scope.product.fid;
        obj.awardRecordId = $localStorage.prizeId;
        obj.activityType = 0;
        resourceService.queryPost($scope, $filter('交互接口对照表')('投资记录'), obj, '续投资记录');
    };

    // 忘记交易密码--去安全认证页面找回
    $scope.forgetTradeCode = function () {
        ngDialog.closeAll();
        $filter('跳转页面')('', 'main.myAccount.withdraw', 'main.myAccount.security', 'forgetTradeCode', null, {
            name: '账户管理',
            url: 'main.myAccount.security'
        });
    };

    $localStorage.balanceNotEnough = false;
    $localStorage.balanceNotEnoughId = '';
    /*倒计时结束*/
    /*加减金额*/
    $scope.winterest = 0;
    var Qtrget = null;
    $scope.isShowShouyiDisabled = true;

    $scope.onClick = function (type, event, num) {
        switch (type) {
            case "补标":
                $scope.product.nowNum = parseInt($scope.product.surplusAmount);
                /*点击补标后输入框*/
                $scope.isShowShouyiDisabled = false;
                break;
            case "cut":
                if (parseInt($scope.product.nowNum) > parseInt($scope.product.leastaAmount)) {
                    $scope.product.nowNum = parseInt($scope.product.nowNum);
                    $scope.product.leastaAmount = parseInt($scope.product.leastaAmount);
                    if ($scope.product.nowNum < $scope.product.leastaAmount) {
                        $scope.product.nowNum = $scope.product.leastaAmount;
                    } else {
                        $scope.product.nowNum -= $scope.product.increasAmount;
                    }
                }
                $scope.product.nowNum = parseInt($scope.product.nowNum);
                if ($scope.product.nowNum < 5000 || angular.equals($scope.product.nowNum, NaN)) {
                    $scope.goldACT = false;
                } else {
                    $scope.goldACT = true;
                }
                break;
            case "add":
                if (parseInt($scope.product.nowNum) < $scope.product.maxAmount) {
                    $scope.product.nowNum = parseInt($scope.product.nowNum);
                    // $scope.account.balance = $scope.account.balance;
                    if ($scope.product.nowNum > $scope.product.maxAmount) {
                        $scope.product.nowNum = $scope.product.maxAmount;
                    } else {
                        $scope.product.nowNum += $scope.product.increasAmount;
                    }
                }
                $scope.product.nowNum = parseInt($scope.product.nowNum);
                if ($scope.product.nowNum < 5000 || angular.equals($scope.product.nowNum, NaN)) {
                    $scope.goldACT = false;
                } else {
                    $scope.goldACT = true;
                }
                break;
            case "keyUpBalance":
                $localStorage.product.amount = $scope.product.amount = parseInt($("input[name='amount']").val());
                // resourceService.queryPost($scope, $filter('交互接口对照表')('用户可用优惠券'), {
                //     pid: $scope.product.id,
                //     amount: $scope.product.nowNum
                // }, '用户可用优惠券');
                //抽奖活动-抽奖码
                if($scope.product.drawCode){
                    $scope.product.nowNum=$scope.product.drawCode*$scope.awardInfo.lotteryCodePrice;
                    $localStorage.product.amount = $scope.product.amount = parseInt($("input[name='amount']").val())*$scope.awardInfo.lotteryCodePrice;

                    if ($scope.product.nowNum > $scope.product.maxAmount) {
                        $scope.product.nowNum = $scope.product.maxAmount;
                    }
                }

                $scope.product.nowNum = parseInt($scope.product.nowNum);
                $scope.isNumCash = false;

                if ($scope.product.type == 1) {
                    $scope.goldACT = false;
                } else {
                    if ($scope.product.nowNum < 5000 || angular.equals($scope.product.nowNum, NaN)) {
                        $scope.goldACT = false;
                    } else {
                        $scope.goldACT = true;
                    }
                }

                // $scope.account.balance = $scope.account.balance;
                if (angular.equals($scope.product.nowNum, NaN)) {
                    $scope.isHideNowNum = true;
                    // $scope.product.nowNum = 0
                    $scope.account.balance = balance;
                } else {
                    $scope.isHideNowNum = false;
                }

                // if($scope.curTicket) {
                //     switch ($scope.curTicket.type) {
                //         case 1:
                //             //返现 金额 * （基础利率+加息券利率+平台加息）/360*30 , 金额 * 利率/360
                //             // $scope.rewardProfit = ($scope.product.rate + $scope.product.activityRate)/100 / 360 * $scope.product.nowNum * $scope.curTicket.productDeadline;
                //             $scope.product.rewardProfit = $scope.curTicket.amount;
                //             break;
                //         case 2:
                //             // 加息券  金额 * 加息券利率/360*30
                //             // $scope.rewardProfit = ($scope.product.rate + $scope.product.activityRate)/100 / 360 * $scope.product.nowNum * $scope.curTicket.productDeadline + ($scope.curTicket.raisedRates/100 / 360 * $scope.product.nowNum * $scope.curTicket.productDeadline);
                //             $scope.product.rewardProfit = $scope.product.nowNum * $scope.curTicket.raisedRates / 360 * $scope.curTicket.productDeadline;
                //             break;
                //         case 4:
                //             // 翻倍券  金额 * （基础利率*翻倍+平台加息）/360*30
                //             $scope.product.rewardProfit = (($scope.product.rate * $scope.curTicket.multiple + $scope.product.activityRate)/100 / 360 * $scope.product.nowNum * $scope.curTicket.productDeadline);
                //             break;
                //     } ;
                // }
                //$localStorage.product.rewardProfit = $scope.product.rewardProfit;
                if(!!$scope.curTicket && $scope.product.nowNum < $scope.curTicket.enableAmount) {
                    $scope.curTicket = null;
                    $scope.product.rewardProfit = null;
                }

                angular.forEach($scope.couponInfo.comboxList, function (value, index) {
                    if($scope.product.nowNum == value.enableAmount) {
                        value.suitable = 1;
                    } else {
                        value.suitable = 0;
                    }
                });
                $scope.sortComboxCouponList($scope.curTicket);
                // if (($scope.product.nowNum - $scope.product.leastaAmount) % $scope.product.increasAmount != 0) {
                //     $scope.product.nowNum -= ($scope.product.nowNum - $scope.product.leastaAmount) % $scope.product.increasAmount;
                // }
                break;
            case "奖品详情":
                change(event);
                $scope.isShowHDXQ = true;
                $scope.isShowIntroduce = false;
                $scope.isShowGuarantee = false;
                $scope.isShowInvest = false;
                $scope.isShowWinning = false;
                break;
            case "产品描述":
                change(event);
                $scope.isShowHDXQ = false;
                $scope.isShowDetail = true;
                $scope.isShowIntroduce = false;
                $scope.isShowGuarantee = false;
                $scope.isShowInvest = false;
                $scope.isShowWinning = false;
                break;
            case "项目介绍":
                change(event);
                $scope.isShowHDXQ = false;
                $scope.isShowDetail = false;
                $scope.isShowIntroduce = true;
                $scope.isShowGuarantee = false;
                $scope.isShowInvest = false;
                $scope.isShowWinning = false;
                break;
            case "本息保障":
                change(event);
                $scope.isShowHDXQ = false;
                $scope.isShowDetail = false;
                $scope.isShowIntroduce = false;
                $scope.isShowGuarantee = true;
                $scope.isShowInvest = false;
                $scope.isShowWinning = false;
                $('.guarantee img').on('click', function () {
                    var index = $(this).parents('td').index();
                    if (!mySwiper2.browser.ie8) {
                        mySwiper2.slideTo(index, 1000, false);
                    }
                    $('.mask-imgs').eq(1).addClass('show-mask');
                });
                break;
            case "投资记录":
                change(event);
                $scope.isShowHDXQ = false;
                $scope.isShowDetail = false;
                $scope.isShowIntroduce = false;
                $scope.isShowGuarantee = false;
                $scope.isShowWinning = false;
                $scope.isShowInvest = true;

                break;
            case "本期中奖者":
                change(event);
                $scope.isShowHDXQ = false;
                $scope.isShowDetail = false;
                $scope.isShowIntroduce = false;
                $scope.isShowGuarantee = false;
                $scope.isShowInvest = false;
                $scope.isShowWinning = true;
                break;
            case "立即抢购":
                
                $localStorage.balanceNotEnough = false;
                $localStorage.product.fid = $scope.product.fid;
                $scope.pro.nowNum = parseInt($("input[name='amount']").val());
                //抽奖活动-抽奖码
                if($scope.product.drawCode){
                    $scope.product.nowNum=$scope.product.drawCode*$scope.awardInfo.lotteryCodePrice;
                    $scope.pro.nowNum=parseInt($("input[name='amount']").val())*$scope.awardInfo.lotteryCodePrice;
                }

                if ($scope.product.type == 1) {
                    $scope.sureNoGold = false;
                    $scope.goldACT = false;
                    Qtrget = null;
                    $scope.isShowOver = true;

                    // resourceService.queryPost($scope, $filter('交互接口对照表')('用户可用优惠券'), {
                    //     pid: $scope.product.id,
                    //     amount: $scope.product.nowNum
                    // }, '用户可用优惠券');

                    // 针对新手标产品的判断
                    if (!!$localStorage.user) {
                        resourceService.queryPost($scope, $filter('交互接口对照表')('我的资产首页数据'), {}, '账户信息');
                        if ($localStorage.bankVerify != 1) {
                            // 未认证，去绑卡
                            $scope.bindBank();
                        } else{
                            if (($scope.account.balance < $scope.product.leastaAmount) || ($scope.account.balance < $scope.product.nowNum)) {
                                $localStorage.balanceNotEnough = true;
                                $localStorage.balanceNotEnoughId = $location.$$search.id;
                                //去充值
                                $filter("余额不足弹窗")($scope);
                                // $filter("跳转页面")('', 'main.billDetail', 'main.myAccount.recharge');
                            } else if($scope.showDilog){
                                $filter('风险评测首页提示弹窗')($scope);
                            }  else {
                                if ($scope.product.nowNum >= 5000) {
                                    Qtrget = event;
                                    $scope.goldACT = true;
                                    $filter('投资确认弹窗')($scope);
                                    $localStorage.product.fid = $scope.product.fid;
                                    // $state.go('main.investConfirm',{fid: $localStorage.product.fid});
                                } else if($scope.tipsLength) {
                                    // $filter('有红包未使用')($scope);
                                    $localStorage.product.fid = $scope.product.fid;
                                    $filter('投资确认弹窗')($scope);
                                    // $state.go('main.investConfirm',{fid: $localStorage.product.fid});
                                } else  {
                                    Qtrget = event;
                                    $filter('投资确认弹窗')($scope);
                                    $localStorage.product.fid = $scope.product.fid;
                                    // $state.go('main.investConfirm',{fid: $localStorage.product.fid});
                                }
                            }
                        }
                    } else {
                        $filter("跳转页面")('denLu', 'main.billDetail', 'dl');
                    }
                } else if ($scope.ecId){
                    var obj={};
                    // obj.amount = $scope.maxAmount;
                    obj.amount = $localStorage.product.amount;
                    obj.rid = $scope.ecId;
                    obj.awardRecordId = $localStorage.prizeId;
                    obj.activityType = 0;
                    if($scope.bankVerify == 0){
                        // 未认证，去绑卡
                        $scope.bindBank();
                    } else if($scope.showDilog){
                        $filter('风险评测首页提示弹窗')($scope);
                    } else if ($scope.tpwdVerify == 0) {
                        // 去设置交易密码
                        $filter('跳转页面')('','main.billDetail','main.myAccount.security','setTradeCode',null,{name:'账户管理',url:'main.myAccount.security'});
                        // $state.go('resetTradePwd', { firstset: true });
                    } else if($scope.balance < $scope.maxAmount) {
                        //去充值
                        $filter("跳转页面")('', 'main.billDetail', 'main.myAccount.recharge');
                    }
                    // else if (!$localStorage.product.atid && $localStorage.IsInvested && !!$localStorage.drAwardMemberLog && $localStorage.drAwardMemberLog.status != 1 && ($scope.product.nowNum < $localStorage.drAwardMemberLog.drAward.useCondition)) {
                    //     $filter('砸蛋奖励激活条件不足弹窗')($scope);
                    // }
                    else if (!!$localStorage.drAwardMemberLog && ($scope.product.nowNum >= $localStorage.drAwardMemberLog.drAward.useCondition)) {
                        // resourceService.queryPost($scope, $filter('交互接口对照表')('用户可用优惠券'), {
                        //     pid: $scope.product.id,
                        //     amount: $scope.product.nowNum
                        // }, '用户可用优惠券');
                        $filter('投资确认弹窗')($scope);
                    }
                    else {
                        $scope.goldACT = false;
                        $scope.sureNoGold = false;
                        Qtrget = null;
                        $scope.isShowOver = true;
                        $filter('投资确认弹窗')($scope);
                        // resourceService.queryPost($scope, $filter('交互接口对照表')('确认投资'), obj, '确认投资');
                    }
                }  else {
                    if ($localStorage.bankVerify != 1) {
                        // 未认证，去绑卡
                        $scope.bindBank();
                    } else if (($scope.account.balance < $scope.product.leastaAmount) || ($scope.account.balance - $scope.product.nowNum < 0)) {
                        $localStorage.balanceNotEnough = true;
                        $localStorage.balanceNotEnoughId = $location.$$search.id;
                        $filter("余额不足弹窗")($scope);
                        // $filter("跳转页面")('', 'main.billDetail', 'main.myAccount.recharge');
                    }else if($scope.showDilog){
                        $filter('风险评测首页提示弹窗')($scope);
                    }  else if (!$localStorage.product.atid && $localStorage.IsInvested && !!$localStorage.drAwardMemberLog && $localStorage.drAwardMemberLog.status != 1  && ($scope.product.nowNum < $localStorage.drAwardMemberLog.drAward.useCondition)) {
                        $filter('砸蛋奖励激活条件不足弹窗')($scope);
                    } else if (!!$localStorage.drAwardMemberLog && ($scope.product.nowNum >= $localStorage.drAwardMemberLog.drAward.useCondition)) {
                        resourceService.queryPost($scope, $filter('交互接口对照表')('用户可用优惠券'), {
                            pid: $scope.product.id,
                            amount: $scope.product.nowNum
                        }, '用户可用优惠券');
                        $filter('投资确认弹窗')($scope);
                    } else {
                        if ($scope.product.nowNum >= 5000) {
                            $scope.goldACT = true;
                        }
                        if ($scope.hasGold && !$scope.goldACT && !$scope.sureNoGold) {
                            $filter('不要体验金弹窗')($scope);
                        }
                        else {
                            $scope.sureNoGold = false;
                            Qtrget = null;
                            $scope.isShowOver = true;

                            resourceService.queryPost($scope, $filter('交互接口对照表')('用户可用优惠券'), {
                                pid: $scope.product.id,
                                amount: $scope.product.nowNum
                            }, '用户可用优惠券');

                            resourceService.queryPost($scope, $filter('交互接口对照表')('票据详情'), {id: $scope.product.id}, '票据详情');
                            $localStorage.product.fid = $scope.product.fid;
                            // $state.go('main.investConfirm',{fid: $localStorage.product.fid});
                            $filter('投资确认弹窗')($scope);
                        }
                    }
                }
                
                
                break;
            case "登录":
                $filter("跳转页面")('denLu', 'main.billDetail', 'dl');
                break;
            case "确认投资":
                if (isSubmin) {
                    isSubmin = false;
                    var obj = {};
                    obj.pid = $scope.product.id;

                    /*//抽奖活动-抽奖码
                    if($scope.product.drawCode){
                        $scope.product.nowNum=$scope.product.drawCode*$scope.awardInfo.lotteryCodePrice;
                        $scope.pro.nowNum=parseInt($("input[name='amount']").val())*$scope.awardInfo.lotteryCodePrice;
                    }*/

                    // resourceService.queryPost($scope, $filter('交互接口对照表')('当天首次投资'), {}, '当天首次投资');
                    if($scope.ecId) {
                        // obj.tpwd = $scope.tpwdVerify;
                        obj.tpwd = $scope.product.tpwd;;
                        // obj.amount = $scope.maxAmount;
                        obj.amount = $scope.pro.nowNum;
                        obj.rid = $scope.ecId;
                        obj.awardRecordId = $localStorage.prizeId;
                        obj.activityType = 0;
                        if ($scope.curTicket && $scope.curTicket.id) {
                            obj.fid = $scope.curTicket.id;
                        } else {
                            obj.fid = $scope.product.fid;
                        }
                        resourceService.queryPost($scope, $filter('交互接口对照表')('确认投资'), obj, '确认投资');
                    } else {
                        obj.tpwd = $scope.product.tpwd;
                        // obj.amount = $("input[name='amount']").val();
                        // obj.amount = $scope.product.amount;
                        obj.amount = $scope.pro.nowNum;
                        obj.awardRecordId = $localStorage.prizeId;
                        obj.activityType = 0;
                        if ($scope.curTicket && $scope.curTicket.id) {
                            obj.fid = $scope.curTicket.id;
                        } else {
                            obj.fid = $scope.product.fid;
                        }
                        if (Qtrget != null) {
                            obj.fid = Qtrget.id;
                        } else if ($scope.isNewGay) {
                            // obj.fid = $scope.TYJ.id;
                        } else if (($scope.fristInvest && $scope.ecId) && ($scope.fristInvest.investCount == 0 && $scope.FBQList.length > 0)) {
                            obj.fid = $scope.FBQList[0].id;
                        }
                        ;
                        if (!$scope.product.atid) {
                            resourceService.queryPost($scope, $filter('交互接口对照表')('确认投资'), obj, '确认投资');
                        } else {
                            resourceService.queryPost($scope, $filter('交互接口对照表')('确认投资'), obj, '确认投资');
                        }
                    }
                }
                break;
            case "返回":
                $scope.isShowOver = true;
                break;
            case "券":
                    $scope.hb = event;
                    if (Qtrget == null) {
                        event.sel = true;
                        Qtrget = event;
                    } else if (Qtrget == event) {
                        if (Qtrget.sel) {
                            event.sel = false;
                            Qtrget = null;
                            $scope.hb = null;
                        } else {
                            event.sel = true;
                            Qtrget = event;
                        }
                        ;
                    } else {
                        event.sel = true;
                        Qtrget.sel = false;
                        Qtrget = event;
                    }
                    $scope.isShowOver = true;
                break;
                case "新手券":
                    // $scope.hbfirst
                    $scope.Nhb = event;
                    event.sel = true;
                    Qtrget = event;
                    $scope.isShowOver = true;
                break;
            case "请关注其他项目":
                $filter("跳转页面")('', 'main.billDetail', 'main.bankBillList');
                break;

            //抽奖活动-加减抽奖码
            case "减抽奖码":

                if($scope.product.drawCode>1){
                    $scope.product.drawCode-=1;
                    $scope.unminus=false;
                }else{
                    $scope.unminus=true;
                }
                if(($scope.product.drawCode)*($scope.awardInfo.lotteryCodePrice)<$scope.product.surplusAmount){
                    $scope.unadd=false;
                }
                break;
            case "加抽奖码":
                $scope.unminus=false;
                if(($scope.product.drawCode)*($scope.awardInfo.lotteryCodePrice)<$scope.product.surplusAmount){
                    $scope.unadd=false;
                    $scope.product.drawCode=parseInt($scope.product.drawCode);
                    $scope.product.drawCode+=1;
                }else{
                    $scope.unadd=true;
                }
                break;
        }
        ;
    };

    //抽奖活动-输入抽奖码
    $scope.changeCode = function () {
        if($scope.product.drawCode>1){
            $scope.unminus=false;
        }else{
            $scope.unminus=true;
        }
        if(($scope.product.drawCode)*($scope.awardInfo.lotteryCodePrice)<$scope.product.surplusAmount){
            $scope.unadd=false;
        }else{
            $scope.unadd=true;
        }
    };

    $scope.givenUpPrize = function () {
        $scope.closeDialog();
        delete $localStorage.drAwardMemberLog;
        $scope.onClick('立即抢购');
    };

    $scope.toRecivePrize = function () {
        if($localStorage.drAwardMemberLog) {
            var orderTime = $filter("date")($localStorage.drAwardMemberLog.orderTime,'yyyy-MM-dd');
            var currTime = $filter("date")(new Date(),'yyyy-MM-dd');
            // 过期则删除砸蛋优惠券
            if(orderTime != currTime) {
                delete $localStorage.drAwardMemberLog;
            } else {
                if($scope.product.nowNum < $localStorage.drAwardMemberLog.drAward.useCondition) {
                    $scope.closeDialog();
                    $scope.product.nowNum = $localStorage.drAwardMemberLog.drAward.useCondition;
                } else {
                    $scope.closeDialog();
                    $filter('投资确认弹窗')($scope);
                }
            }
        } else {
            $scope.closeDialog();
        }
    };

    $scope.newhand = function (type, event, num) {
        switch (type) {
            case "券":
                $scope.hb = event;
                if (Qtrget == null) {
                    event.sel = true;
                    Qtrget = event;
                } else if (Qtrget == event) {
                    if (Qtrget.sel) {
                        event.sel = false;
                        Qtrget = null;
                        $scope.hb = null;
                    } else {
                        event.sel = true;
                        Qtrget = event;
                    }
                    ;
                } else {
                    event.sel = true;
                    Qtrget.sel = false;
                    Qtrget = event;
                }
                $scope.isShowOver = true;
                break;
            case "新手券":
                // $scope.hbfirst
                $scope.Nhb = event;
                for (var i = 0; i < $scope.Nhb; i++) {
                    if( $scope.Nhb[i].amount == 8) {
                       event.sel = true;
                       Qtrget = event;
                   }
                }

                if (Qtrget == null) {
                    event.sel = true;
                    Qtrget = event;
                } else if (Qtrget == event) {
                    if (Qtrget.sel) {
                        event.sel = false;
                        Qtrget = null;
                        $scope.Nhb = null;
                    } else {
                        event.sel = true;
                        Qtrget = event;
                    }
                    ;
                } else {
                    event.sel = true;
                    Qtrget.sel = false;
                    Qtrget = event;
                }

                $scope.isShowOver = true;
                break;
        }
        ;
    };

    $scope.goPage = function (scope) {
        var obj = {};
        obj.pageOn = scope.bill.pageOn;
        obj.pageSize = scope.bill.pageSize;
        obj.pid = scope.product.id;
        obj.awardRecordId = $localStorage.prizeId;
        obj.activityType = 0;
        // 投资记录
        resourceService.queryPost($scope, $filter('交互接口对照表')(scope.portName), obj, scope.portName);
    };

    /*更换加息券*/
    function changeQuan(item) {
        // body...
        switch (item.type) {
            case 2:
                break;
            case 3:
                break;
        }
        ;
    }

    /*菜单切换*/

    var beforEvent = null;

    function change(event) {
        if (beforEvent == null) {
            beforEvent = event.currentTarget;
            if (event.currentTarget.className == 'actived') {

            } else {
                event.currentTarget.parentNode.children[0].className = '';
                event.currentTarget.className = 'actived';
            }
            ;
        } else if (beforEvent == event.currentTarget) {

        } else {
            event.currentTarget.className = 'actived';
            beforEvent.className = '';
            beforEvent = event.currentTarget;
        }
        ;
    }

    /*×××××菜单切换结束××××××××××*/
    function showDetail() {
        if ($scope.reimId) {
            resourceService.queryPost($scope, $filter('交互接口对照表')('票据详情'), {id: ''}, '票据详情');
        } else {
            if ($location.$$search.id == 2) {
                resourceService.queryPost($scope, $filter('交互接口对照表')('票据详情'), {id: 2, type: 1}, '票据详情');
            } else {
                if ($location.$$search.id != undefined) {
                    $localStorage.pathUrl = 'main.billDetail';
                    // $localStorage.pathUrl = 'main.bankBillList';
                    resourceService.queryPost($scope, $filter('交互接口对照表')('票据详情'), $location.$$search, '票据详情');
                } else {
                    if ($scope.product != undefined) {
                        $localStorage.pathUrl = 'main.billDetail';
                        resourceService.queryPost($scope, $filter('交互接口对照表')('票据详情'), $scope.product, '票据详情');
                    } else {
                        $state.go('main.bankBillList');
                    }
                }
            }
        }
    }

    showDetail();
    if ($localStorage.user != undefined) {
        resourceService.queryPost($scope, $filter('交互接口对照表')('Home主数据'), {}, '用户信息');
    }
    // 监听退出是否成功
    $rootScope.$on('exitSuccess', function (event, flag) {
        if (flag) {// && $scope.product.atid != undefined && $location.$$search.id != undefined
            $scope.isLogin = false;
            // resourceService.queryPost($scope,$filter('交互接口对照表')('票据详情'),$location.$$search,'票据详情');
        }
    });

    // 监听关闭砸金蛋弹窗
    $rootScope.$on('closeEgg', function (event, flag) {
        if (flag) {
            if ($localStorage.eggProItem && $localStorage.eggEnroll) {
                if ($localStorage.eggEnroll == 'detail' && $scope.product.id == $localStorage.eggProItem.id) {
                    $scope.product.isEgg = 2;
                    $scope.product.maxActivityCoupon = $localStorage.eggProItem.maxActivityCoupon;
                    $('.egg-box').find('.shake-rotate').hide();
                    $('.egg-box').find('.num').eq(0).hide();

                    $('.egg-box').find('.egg-sopenegg').show().removeClass('ng-hide');
                    $('.egg-box').find('.num').eq(1).show().removeClass('ng-hide');
                    delete $localStorage.eggProItem;
                    delete $localStorage.eggEnroll;
                }
            }
            ngDialog.closeAll();
        }
    });

    // 预定弹窗
    $scope.book = {};
    $scope.book.leastaAmount = 1200;
    $scope.book.maxAmount = 1000000;
    $scope.book.increasAmount = 1200;
    $scope.book.playSound = true;
    $scope.changeBook = function (type) {
        switch (type) {
            case "cut":
                if (parseInt($scope.book.nowNum) > parseInt($scope.book.leastaAmount)) {
                    $scope.book.nowNum = parseInt($scope.book.nowNum);
                    $scope.book.leastaAmount = parseInt($scope.book.leastaAmount);
                    if ($scope.book.nowNum < $scope.book.leastaAmount) {
                        $scope.book.nowNum = $scope.book.leastaAmount;
                    } else {
                        $scope.book.nowNum -= $scope.book.increasAmount;
                    }
                }
                break;
            case "add":
                if (parseInt($scope.book.nowNum) < $scope.book.maxAmount) {
                    $scope.book.nowNum = parseInt($scope.book.nowNum);
                    // $scope.account.balance = $scope.account.balance;
                    if ($scope.book.nowNum > $scope.book.maxAmount) {
                        $scope.book.nowNum = $scope.book.maxAmount;
                    } else {
                        $scope.book.nowNum += $scope.book.increasAmount;
                    }
                }
                break;
            case "keyUpBalance":
                resourceService.queryPost($scope, $filter('交互接口对照表')('用户可用优惠券'), {
                    pid: $scope.product.id,
                    amount: $scope.product.nowNum
                }, '用户可用优惠券');
                $scope.pro.nowNum = parseInt($("input[name='amount']").val());
                $scope.book.nowNum = parseInt($scope.book.nowNum);
                $scope.isNumCash = false;
                // $scope.account.balance = $scope.account.balance;
                // if(angular.equals($scope.book.nowNum,NaN)){
                //  $scope.isHideNowNum = true;
                //  // $scope.product.nowNum = 0
                //  // $scope.account.balance = balance;
                // }else{
                //  $scope.isHideNowNum = false;
                // }
                if ($scope.book.nowNum > $scope.book.maxAmount) {
                    $scope.book.nowNum = $scope.book.maxAmount;
                }
                if (($scope.book.nowNum - $scope.book.leastaAmount) % $scope.book.increasAmount != 0) {
                    $scope.book.nowNum -= ($scope.book.nowNum - $scope.book.leastaAmount) % $scope.book.increasAmount;
                }
                break;
        }
    };
    $scope.showBookDialog = function () {
        if ($scope.book.playSound) {
            if (!$scope.realverify) {
                $scope.bookType = 'real';
            } else {
                $scope.bookType = 'book';
            }
        }
        $filter('预定弹窗')($scope);
    };

    $scope.getReservation = function () {
        resourceService.queryPost($scope, $filter('交互接口对照表')('预约下期'), {
            prid: $scope.prid,
            amount: $scope.book.nowNum
        }, '预约下期');
    };

    // 未绑定银行卡时--去安全认证页面绑定
    $scope.bindBank = function () {
        ngDialog.closeAll();
        // $filter('跳转页面')('', 'main.myAccount.recharge', 'main.myAccount.security', 'setTruename', null, {
        //     name: '账户管理',
        //     url: 'main.myAccount.security'
        // });  main.bindcard
        $filter('跳转页面')('', 'main.billDetail', 'main.bindcard', '', null, {
            name: '实名绑卡',
            url: 'main.bindcard'
        });
    };

    $scope.changeGoldACT = function () {
        $scope.goldACT = !$scope.goldACT;
        if ($scope.goldACT) {
            $scope.product.nowNum = 5000;
        }
    };

    // 尾标奖显示/隐藏
    $scope.lastPrizeIsOpen = false;
    $scope.lastPrizeOpen = function () {
        $scope.lastPrizeIsOpen = !$scope.lastPrizeIsOpen;
    };

    $scope.goContinueInvest = function () {
        $scope.sureNoGold = true;
        ngDialog.closeAll();
        $scope.onClick('立即抢购');
    };

    $scope.givenUp = function () {
        $scope.sureNoGold = true;
        ngDialog.closeAll();
        $filter('投资确认弹窗')($scope)
    };

    // 优惠券列表显示隐藏
    /*
    $scope.showTickets = function ($event,amount) {
        $('.notChoosen').addClass('hide').css('display', 'none');
        $('.choosenTicket').removeClass('hide').css('display', 'block');
        $scope.onClick('keyUpBalance',$event,amount);
    };
    */
    /*
    $scope.hideTickets = function ($event,amount) {
        $('.choosenTicket').addClass('hide').css('display', 'none');
        $('.notChoosen').removeClass('hide').css('display', 'block');
        $scope.onClick('keyUpBalance',$event,amount);
    };
    */
    $scope.combox = function ($event, amount) {
        if($scope.couponInfo.comboxList.length < 1) {
            return;
        }
        $scope.couponInfo.isOpenCombox = !$scope.couponInfo.isOpenCombox;
    };
    //选择优惠券
    $scope.choosenTicket = function (event, item, index) {
        if(item.status == 1){
            $scope.hasChoosen = true;
            item.status = 0;
            $scope.curTicket = null;
            $localStorage.product.fid = $scope.product.fid = null;
            $localStorage.product.rewardProfit = null;
            $filter('orderBy')($scope.couponInfo.comboxList, ['status','suitable','profit','expireDate'],[false,false,false,false]);
            return;
        }
        if(!$scope.product.nowNum || item.enableAmount > $scope.product.nowNum){
            $scope.product.nowNum = item.enableAmount;
        }
        $localStorage.product.fid = $scope.product.fid = item.id;
        $scope.sortComboxCouponList(item);
    };
    /**
     * 计算优惠券列表状态和收益
     * @param selectedCoupon
     */
    $scope.sortComboxCouponList = function(selectedCoupon){
        var investAmount = $scope.product.nowNum? $scope.product.nowNum: 0;
        angular.forEach($scope.couponInfo.comboxList, function (value, indexInList) {
            switch (value.type) {
                case 1:
                    //返现
                    value.profit = value.amount;
                    break;
                case 2:
                    // 加息券  金额*加息券利率/360/100*30
                    // value.profit = investAmount*($scope.product.rate + $scope.product.activityRate + value.raisedRates)/(360*100)*$scope.product.deadline;
                    value.profit = investAmount*value.raisedRates/(360*100)*$scope.product.deadline;
                    break;
                case 4:
                    // 翻倍券  金额*(基础利率*翻倍+平台加息)/360/100*30
                    // value.profit = investAmount*($scope.product.rate * value.multiple + $scope.product.activityRate)/(360*100)*$scope.product.deadline;
                    value.profit = investAmount*($scope.product.rate * value.multiple - $scope.product.rate)/(360*100)*$scope.product.deadline;
                    break;
            } ;
            if(selectedCoupon && selectedCoupon.id == value.id){
                value.status = 1;
                $scope.curTicket = value;
                $scope.product.rewardProfit = value.profit;
            }else{
                value.status = 0;
            }


            $scope.couponInfo.comboxList[indexInList] = value;
        });
        $filter('orderBy')($scope.couponInfo.comboxList, ['status','suitable','profit','expireDate'],[false,false,false,true]);
    };
}])
    .controller('investSucessCtrl', ['$rootScope', '$scope', '$state', '$localStorage', 'resourceService', '$filter', 'communicationService', '$timeout', '$location', 'ngDialog', '$element', 'MAIN_MENU', 'storage', '$stateParams', function ($rootScope, $scope, $state, $localStorage, resourceService, $filter, communicationService, $timeout, $location, ngDialog, $element, MAINMENU, storage, $stateParams) {
        /*$scope.isShowOver = $location.$$search.isShowOver;
        $scope.isRepeats = $location.$$search.isRepeats;
        $scope.comInvestSuc = $location.$$search.comInvestSuc;
        $scope.redbag = $location.$$search.redbag;
        $scope.statusCode = $location.$$search.statusCode;
        $scope.isSuc = $location.$$search.isSuc;
        $scope.pText = $location.$$search.pText;*/
        $scope.luckCodeCount = $localStorage.luckCodeCount;
        $scope.luckCodes = $localStorage.luckCodes;
        $scope.investResults = $localStorage.investResults;
        $scope.product = $localStorage.product;
        $scope.isInNewYearActivityTime = $localStorage.isInNewYearActivityTime;

        if($localStorage.efCode == 'enfu') {
            delete $localStorage.efCode;
        }

        //$location.$$path ==  "/main/investSucess" &&
        if ($scope.statusCode=='succes') {
            $localStorage.fullProcess = true;
        } else {
            $localStorage.fullProcess = false;
        }

        if(!!$scope.luckCodeCount && !!$scope.luckCodes){
            $scope.luckCodeInvestSuc = true;
        } else {
            $scope.luckCodeInvestSuc = false;
        }

        $scope.selectMyWinning = function () {
            $filter('跳转页面')('', 'main.billDetail', 'main.myAccount.winningRecord', '', null, {
                name: '活动中心',
                url: 'main.myAccount.winningRecord'
            });
            ngDialog.closeAll();
        };

        // 忘记交易密码--去安全认证页面找回
        $scope.forgetTradeCode = function () {
            ngDialog.closeAll();
            $filter('跳转页面')('', 'main.myAccount.withdraw', 'main.myAccount.security', 'forgetTradeCode', null, {
                name: '账户管理',
                url: 'main.myAccount.security'
            });
        };

        // if($location.$$path !=  "/main/investSucess") {
        //     delete $localStorage.investResults;
        // }
    }]);
