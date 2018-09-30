/*登录*/
mainModule.controller('dlCtrl', [ '$scope', '$rootScope', '$http', '$state', '$stateParams', '$localStorage','$location', 'resourceService','communicationService','$filter','ngDialog','$timeout',function($scope, $rootScope, $http, $state, $stateParams, $localStorage,$location,resourceService,communicationService,$filter,ngDialog,$timeout) {
	$scope.userLogin = {};
	$rootScope.title="沪深理财-用户登录";
	var obj = $location.$$search;
	$scope.goZhuce = function() {
        $state.go('zhuce',obj);
    };
    $scope.userLogin.mobilePhone = '123123123'
	if ($localStorage.keepUser) {
        $scope.userLogin.mobilephone = $localStorage.keepUser.phone
	}
    $scope.serverErrorText = '';
    document.getElementsByTagName('html')[0].scrollTop = 0;
    document.getElementsByTagName('body')[0].scrollTop = 0;
	var isDenLuSubmin = true;
	var changePicEvent;
	var changeIMG = function (event) {//换图片验证码
		if(event != undefined){
			event.currentTarget.src += '?'+ new Date().getTime();
		}else{
			if($('.img-box img')[0]!= undefined){
				$('.img-box img')[0].src += '?'+ new Date().getTime();	
			};
		};
	};
	changeIMG();

	$scope.fromEc = $stateParams.fromEc;
	
    // 营销QQ 2
    $scope.mouseover = function () {
        $scope.count = true;
    };
    $scope.mouseout = function () {
        $timeout(function(){
            $scope.count = false;
        },2000);
    };

	$rootScope.showMaskCoupon = false;

	// 判断是不是从活动页进来-----促复投第一期
	if ($location.$$search.fromActivity == undefined) {
		$scope.showRedDialog = true;
	} else {
		$('html,body').animate({scrollTop:0});
		$scope.showRedDialog = false;
	}

	$scope.gotoLoginPage = function (type) {
		switch(type){
			case "帮助中心"://我的资产
				$localStorage.showQA = false;
				$filter('跳转页面')('','main.home','main.jt2.help','帮助中心',null,{name:'帮助中心',url:'main.jt2.help'});
			break;
			case "投资课堂"://我的资产
				$filter('跳转页面')('','main.home','main.jt.LCZS','帮助中心',null,{name:'帮助中心',url:'main.jt.LCZS'});
			break;
			case "新手指引"://我的资产
				$filter('跳转页面')('','main.home','main.guide','帮助中心',null,{name:'',url:'main.guide'});
			break;

			case "信息披露"://我的资产
				$filter('跳转页面')('','main.home','main.jt.JSGK','信息披露',null,{name:'信息披露',url:'main.jt.JSGK'});
			break;
			case "沪深概况"://我的资产
				$filter('跳转页面')('','main.home','main.jt.JSGK','信息披露',null,{name:'信息披露',url:'main.jt.JSGK'});
			break;
			case "法律法规"://我的资产
				$filter('跳转页面')('','main.home','main.jt.FLFG','信息披露',null,{name:'信息披露',url:'main.jt.FLFG'});
			break;
			case "联系我们"://我的资产
				$filter('跳转页面')('','main.home','main.jt.LXWM','LXWM',null,{name:'信息披露',url:'main.jt.LXWM'});
			break;

			default:
				$filter("跳转页面")(type,'main.home','dl');
			break;
		};
	};
	$scope.LoginClick = function(clickName,tegForm) {
		switch(clickName){
			case 'denLu':
				if(isDenLuSubmin){//防重复提交
					isDenLuSubmin = false;
					resourceService.queryPost($scope,$filter('交互接口对照表')('登录接口'),$scope.userLogin,{name:'用户登录',tegForm:tegForm});
				};
			break;
		};
	};

    // $scope.LoginClick = function (clickName, tegForm) {
    //     if (isZhuCeSubmin) {
    //         isZhuCeSubmin = false;
    //         $scope.login.isCheckPic = false;
    //         resourceService.queryPost($scope, $filter('交互接口对照表')('立即注册'), $scope.login, {
    //             name: '注册',
    //             tegForm: tegForm,
    //         });
    //     }
    // };



	$scope.clickInput=function (type,event,isLogin,tegForm) {
		switch(type){
			case 'changePic':
				$scope.userLogin.picCode=null;
				changePicEvent = event;
				changeIMG(changePicEvent);
				break;
		};
	};
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
		switch(type.name){
			case '用户登录': 
				isDenLuSubmin = true;
				if(data.success){
                    $rootScope.closeDialog();
					$scope.isPicYanZhen = false;
					$localStorage.user = {};
					$localStorage.loginNum=0;
					$localStorage.regDate=data.map.member.regDate;
					if ($localStorage.keepUser) {
					    delete $localStorage.keepUser;
                    }

                    $scope.user = data.map;
                    if (data.map.realName == '' || data.map.realName == undefined) {
                        $scope.user.userName = '亲爱的用户';
                    } else {
                        $scope.user.userName = data.map.realName;
                    }
                    $localStorage.user = $scope.user;
                    $localStorage.exclusiveUser = $scope.user.member.userType;
					if(data.map.isDs){
                        $localStorage.isDs = data.map.isDs;
					} else {
                        $localStorage.isDs = false;
					}

                    if(data.map.enFuProductId){
                        $localStorage.enFuProductId = data.map.enFuProductId;
                    } else {
                        $localStorage.enFuProductId = false;
                    }

					if(data.map.isChannelUser) {
                        $localStorage.isChannelUser = data.map.isChannelUser;
					} else {
                        $localStorage.isChannelUser = false;
					}

					if ($scope.specialDialogTag == true) {
						$scope.specialDialogTag = false;
						$scope.$emit('loginSuccess',true);
					} else {
						if ($location.$$search.goMyFriend != undefined) {
							$state.go('main.myAccount.myFriend');
						} else if ($localStorage.regACTURL != undefined) {
							$state.go($localStorage.regACTURL);
							ngDialog.closeAll();
							delete $localStorage.regACTURL;
							$scope.$emit('loginSuccess',true);
						} else if($location.$$url != '/dl' && $location.$$url != '/zhuce' && $localStorage.luckyDrawPath) {
                            delete $localStorage.pathUrl;
                            $state.go('luckyDraw');
                            resourceService.queryPost($rootScope, $filter('交互接口对照表')('预约奖品列表'), {}, {name:'预约奖品列表'});
                            // $('html, body').animate({scrollTop: $('.reservation').offset().top});
                        }
                        else if ($scope.fromCommonDl) {
                            //从公共登录注册框弹窗
                            delete $localStorage.pathUrl;
                            // $state.reload();
                            $scope.isLogin = true;
                            // resourceService.queryPost($rootScope,$filter('交互接口对照表')('登录接口'), {}, {name:'用户登录'});
                            if($scope.loginCallBack && typeof $scope.loginCallBack == "function") {
                                $scope.loginCallBack();
							}
                            $rootScope. closeDialog();
                        }
                        // else if($location.$$url != '/dl' && $location.$$url != '/zhuce' && $localStorage.smashEggPath) {
                        //     delete $localStorage.pathUrl;
                        //     resourceService.queryPost($rootScope, $filter('交互接口对照表')('砸蛋记录'), {}, '砸蛋记录');
                        //     $state.go('smashEgg');
                        // }
                        else if (!$localStorage.isDs && $localStorage.pathUrl != undefined && $localStorage.pathUrl == 'main.home' && $scope.showRedDialog) {
							delete $localStorage.pathUrl;
							$state.go('main.myAccount.accountHome');
						} else if (!$scope.fromEc && $localStorage.isDs) {
                            delete $localStorage.pathUrl;
                            $state.go('main.myAccount.accountHome');
                        } else if ($localStorage.isDs && $scope.fromEc) {
							delete $localStorage.pathUrl;
                            $state.go('main.myAccount.reimtask');
                        } else {
							if ($location.$$search.fromActivity != undefined && $localStorage.activityUrl != undefined) {
								$state.go($localStorage.activityUrl);
								delete $localStorage.activityUrl;
								$scope.$emit('loginSuccess',true);
							} else {
								$filter('跳回上一页')();
							}
						}
					}
					if (data.flag) {
						$rootScope.showMaskCoupon = true;
						$('.mask-coupon').css('display','block');
					} else {
						$rootScope.showMaskCoupon = false;
					}

				} else {
					$scope.serverErrorCode = data.errorCode;
					$localStorage.loginNum++;
					changeIMG(changePicEvent);
					if(data.errorCode == 1002 ){
						type.tegForm.picCode.$error.serverError = true;
					} else if(data.errorCode == 1003 ){
                        type.tegForm.userName.$error.serverError = true;
                        $scope.serverErrorText = data.errorMsg;
                    }else{
						type.tegForm.userName.$error.serverError = true;
					};
					if($localStorage.loginNum > 2 || data.errorCode == 1002 || data.map.loginErrorNums > 2){
						$scope.isPicYanZhen = true;
					};
				}
			break;
			// --------------促复投第一期-------------
			case '获取复投红包':
				if (data.success) {
					$rootScope.promoteGetCashFrom = false;
					if (data.map.isRedPacket) {
						if (data.map.returnedCount) {
							$rootScope.promoteHasReturn = true;
							$rootScope.returnedCount = data.map.returnedCount;
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
		};
	});
}])