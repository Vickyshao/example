mainModule.controller(  'sitefinanceCtrl', ['$rootScope','$scope', '$state', '$localStorage', 'resourceService','$filter','ngDialog','$location','storage','$stateParams',function($rootScope,$scope, $state, $localStorage,resourceService,$filter,ngDialog,$location,storage, $stateParams) {

	if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
        $localStorage.webFormPath = $location.$$search;
    }

	$scope.isLogin = $filter('isRegister')().register;
    if ($localStorage.user != undefined) {
        $scope.user = $localStorage.user;
    }

	// resourceService.queryPost($scope,$filter('交互接口对照表')('financeSEM'),{},{name: 'financeSEM'});
    resourceService.queryPost($scope,$filter('交互接口对照表')('产品列表'),{},{name:'产品列表'});
    resourceService.queryPost($scope,$filter('交互接口对照表')('新手标排行榜'),{},{name:'新手标排行榜'});

    if ($scope.isLogin) {
		resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},{name: '首页主数据'});
        resourceService.queryPost($scope, $filter('交互接口对照表')('活动页账户信息'), {}, {name: '活动页账户信息'});
		if ($location.$$path == '/regfinance') {
			resourceService.queryPost($scope,$filter('交互接口对照表')('活动页账户信息'),{},{name: '活动页账户信息'});
		}
    }

    /*注册*/
    $scope.showPic=false;
    $scope.userLogin = {};
    $scope.login = {};
    $scope.isDisabledRecomm=false;

    $scope.hasLogin = $filter('isRegister')().register;

    if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined||$location.$$search.tid != undefined) {
        $localStorage.webFormPath = $location.$$search;
    }
    if($stateParams.recommCode){
        $scope.isDisabledRecomm=true;
    };
    if ($localStorage.webFormPath != undefined) {
        if ($localStorage.webFormPath.recommCode != undefined) {
            $scope.login.recommPhone = $localStorage.webFormPath.recommCode;
        };
        if ($localStorage.webFormPath.toFrom != undefined) {
            $scope.login.toFrom = $localStorage.webFormPath.toFrom;
        };
        if ($localStorage.webFormPath.tid != undefined) {
            $scope.login.tid = $localStorage.webFormPath.tid;
        };
    }
    // 邀请页面
    if ($location.$$search.recommCode != undefined && $location.$$path == '/reg/reginvite') {
        resourceService.queryPost($scope, $filter('交互接口对照表')('获取邀请手机号'), {recommCode: $location.$$search.recommCode}, {name: '获取邀请手机号'});
    }

    // 长城宽带
    if ($location.$$path == '/broadbandnew' && $scope.hasLogin) {
        resourceService.queryPost($scope, $filter('交互接口对照表')('长城宽带已登录数据'), {}, {name: '长城宽带已登录数据'});
    }
    // 长城宽带
    if ($location.$$path == '/broadbandnew' && !$scope.hasLogin) {
        $localStorage.activityUrl = 'broadbandnew';
    }

    $scope.login.checkbox = true;
    $scope.isDisabledPhoneMsg = true;
    $scope.isSubMin = true;
    $scope.isShowReferee = true;
    var isZhuCeSubmin = true;
    var changeIMG = function(event) { //换图片验证码
        if (event != undefined) {
            event.currentTarget.src += '?' + new Date().getTime();
        } else {
            if ($('.img-box img')[0] != undefined) {
                $('.img-box img')[0].src += '?' + new Date().getTime();
            }
        }
    };
    changeIMG();

    $scope.onClickReferee = function() {
        if ($scope.isShowReferee) {
            $scope.isShowReferee = false;
        } else {
            $scope.isShowReferee = true;
        };
    };
    $scope.isGetVoice = false;
    var $userphone = $('#userphone'),
        $imgcode = $('#imgcode');
    $scope.clickInput = function(type, event, isLogin, tegForm, isvoice) {
        switch (type) {
            case 'changePic':
                $scope.userLogin.picCode = null;
                changePicEvent = event;
                changeIMG(changePicEvent);
                break;
            case 'phonecodeMSG':
                    if(!$scope.showPic){
                        if ($userphone.val() == '') {
                            $userphone.focus();
                            return;
                        }
                        $scope.login.isCheckPic = false;
                        resourceService.queryPost($scope, $filter('交互接口对照表')('校验图片验证码'), {
                            picCode: $scope.login.picCode,
                            mobilephone: $scope.login.mobilephone,
                            isCheckPic:$scope.login.isCheckPic,
                            type: isvoice + 1
                        }, {name: '获取验证码', tegForm: tegForm, isvoice: isvoice, nowTimer: $scope.nowTimer});
                    }else{
                        if ($userphone.val() == '') {
                            $userphone.focus();
                            return;
                        } else if ($imgcode.val() == '') {
                            $imgcode.focus();
                            return;
                        }
                        if ($scope.isSubMin) {
                            if (!isvoice && parseInt($scope.nowTimer) > 0) {
                                return;
                            }
                            var $this = $(event.currentTarget);
                            if ($this.hasClass('getcode-disabled')) {
                                return;
                            }
                            $scope.login.isCheckPic = true;
                            $scope.isGetCode = true;
                            $scope.voiceRepeat = false;
                            $scope.isvoice = isvoice;
                            resourceService.queryPost($scope, $filter('交互接口对照表')('校验图片验证码'), {
                                picCode: $scope.login.picCode,
                                mobilephone: $scope.login.mobilephone,
                                type: isvoice + 1
                            }, {name: '获取验证码', tegForm: tegForm, isvoice: isvoice, nowTimer: $scope.nowTimer});
                        };
                    }
                    
                    break;
            };
    };
    $scope.LoginClick = function(clickName, tegForm) {
        if (isZhuCeSubmin) {
            isZhuCeSubmin = false;
            resourceService.queryPost($scope, $filter('交互接口对照表')('立即注册'), $scope.login, { name: '注册', tegForm: tegForm });
        }
    };

	// 监听退出是否成功
	$rootScope.$on('exitSuccess', function(event, flag) {
		if (flag) {
			$scope.isLogin = false;
		}
	});

	// 监听登录是否成功
	$scope.$on('loginSuccess', function(event, flag) {
		if (flag) {
			$scope.isLogin = true;
			if($localStorage.user != undefined){
				resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},{name: '首页主数据'});
			}
		}
	});

	var $table = $('.semfinance-mode .box table');

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
		switch(type.name){
			case "首页主数据":
				$scope.user = data.map;
				if (data.map.realName == '' || data.map.realName == undefined) {
					$scope.user.userName = '亲爱的用户';
				} else {
					$scope.user.userName = data.map.realName;
				}
				$localStorage.user = $scope.user;
			break;
			// case "financeSEM":
			// 	$scope.financeList = data.map.list;
			// 	$scope.regSendCount = data.map.regSendCount;
			// 	if ($scope.financeList.length%2 == 1){
			// 		$scope.financeList.length --;
			// 	}
			// 	if ($scope.financeList.length > 8) {
			// 		setInterval(function() {
			// 			$table.animate({'margin-top':'-38px'},500,function() {
			// 				$table.find('tr').eq(0).appendTo($table);
			// 				$table.css('margin-top',0);
			// 			})
			// 		}, 3000);
			// 	}
			// break;
			case "产品列表":
				$scope.newhand = data.map.newhand;
			break;
			case "新手标排行榜":
				$scope.peoples = data.map.investList.length;
                $scope.peopleList = data.map.investList;

                $scope.rate = data.map.newHand.rate;
                $scope.deadline = data.map.newHand.deadline;
                $scope.peopleList = data.map.investList;

                if ($scope.peoples % 2 == 1){
                    $scope.peoples --;
                }
                if ($scope.peoples > 6) {
                    setInterval(function() {
                        $table.animate({'margin-top':'-38px'},500,function() {
                            $table.find('tr').eq(0).appendTo($table);
                            $table.css('margin-top',0);
                        })
                    }, 5000);
                }
			break;

            case '注册验证手机号':
                if (data.success) {
                    if (data.map.exists) { //已有用户名
                        type.tegForm.mobilephone.$error.serverError = data.map.exists;
                        $scope.serverErrorCode = 8888;
                    } else {
                        type.tegForm.mobilephone.$error.serverError = data.map.exists;
                    };
                };
                break;
            case '获取验证码':
                if (data.success) {
                    $scope.isShowPhoneError = !data.success;
                    $scope.isDisabledPhoneMsg = false;
                    if (type.isvoice) {
                        $scope.isGetVoice = true;
                    } else {
                        $scope.isGetVoice = false;
                    }
                    if (parseInt(type.nowTimer) <= 0 || type.nowTimer == undefined || type.nowTimer == '') {
                        $filter('60秒倒计时')($scope, 120);
                    }
                } else {
                    $scope.isShowPhoneError = !data.success;
                    $scope.isDisabledPhoneMsg = true;
                    // $scope.stop();
                    $scope.serverErrorCode = data.errorCode;
                    $scope.isGetCode = false;
                    switch (data.errorCode) {
                        case '1001':
                            type.tegForm.picCode.$error.serverError = true;
                            // changeIMG();
                            break;
                        case '1002':
                            type.tegForm.picCode.$error.serverError = true;
                            break;
                        case '1003':
                            type.tegForm.smsCode.$error.serverError = true;
                            break;
                        case '8888':
                            $scope.voiceRepeat = true;
                    };
                    changeIMG();
                };
                break;
            case '注册':
                if ($scope.stop != undefined) {
                    $scope.stop();
                }
                isZhuCeSubmin = true;
                if (data.success) {
                    $localStorage.webFormPath = {};
                    $localStorage.user = data;
                    if($localStorage.regACTURL != undefined) {
                        $state.go($localStorage.regACTURL);
                        ngDialog.closeAll();
                        delete $localStorage.regACTURL;
                    }else if ($location.$$path == '/broadbandnew') {
                        // window.location.reload();
                        setTimeout(function() {
                            resourceService.queryPost($scope, $filter('交互接口对照表')('长城宽带已登录数据'), {}, {name: '长城宽带已登录数据'});
                        }, 1000);
                        $scope.hasLogin = true;
                    } else {
                        // $state.go('main.tradepasswdSet');
                        $state.go('main.financeSuccess',{num:data.map.regSendCount});
                    }
                } else {
                    $scope.showPic=true;
                    changeIMG();
                    $scope.serverErrorCode = data.errorCode;
                    switch (data.errorCode) {
                        case '1001':
                            type.tegForm.smsCode.$error.serverError = true;
                            // changeIMG();
                            break;
                        case '1002':
                            type.tegForm.smsCode.$error.serverError = true;
                            break;
                        case '1003':
                            type.tegForm.mobilephone.$error.serverError = true;
                            break;
                        case '1004':
                            type.tegForm.picCode.$error.serverError = true;
                            break;
                        case '1005':
                            type.tegForm.passWord.$error.serverError = true;
                            break;
                        case '1006':
                            type.tegForm.checkbox.$error.serverError = true;
                            break;
                        case '1007':
                            type.tegForm.mobilephone.$error.serverError = true;
                            break;
                        case '1008':
                            type.tegForm.recommPhone.$error.serverError = true;
                            break;
                    };
                };
                break;
            case '获取新手投资列表':
                if (data.success) {
                    var array=angular.fromJson(data.map.invest100);
                    for(var i=0;i<5;i++){
                        array.push(array[i]);
                    }
                    $scope.newcomerList=array;
                }
                break;
            case '获取邀请手机号':
                if (data.success) {
                    $scope.myInvitePhone = data.map.mobilePhone;
                }
                break;
            case '活动页账户信息':
                if (data.success) {
                    $scope.account = data.map;
                }
                break;

		}
	});

	$scope.accountUserOut = function (event) {
        $filter('清空缓存')();
        resourceService.queryPost($scope,$filter('交互接口对照表')('退出接口'),{},'退出');

        $rootScope.$emit('exitSuccess',true);
    };

	$scope.noGoDetail = function(e) {
		e.stopPropagation();
	};

	$scope.setTable = function() {
		$table.find('tr:even').addClass('bg');
	};

    var $window = $(window),
        $toTop = $('.poster-totop'),
        $hb = $('html,body');
    $scope.toTop = function() {
        $hb.animate({scrollTop: 0}, 300);
    };

}])