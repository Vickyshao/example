/*注册*/
mainModule.controller('chunjie2018Ctrl', ['$scope',
    '$rootScope',
    '$http',
    '$state',
    '$stateParams',
    '$localStorage',
    '$location',
    'resourceService',
    'communicationService',
    '$filter',

    function ($scope,
              $rootScope,
              $http,
              $state,
              $stateParams,
              $localStorage,
              $location,
              resourceService,
              communicationService,
              $filter) {
        $scope.isLogin = $filter('isRegister')().register;
        if ($localStorage.user != undefined) {
            $scope.user = $localStorage.user;
        }

        // 公共弹窗登录成功后的回调函数
        $scope.loginCallBack = function () {
            $scope.isLogin = true;
            resourceService.queryPost($scope, $filter('交互接口对照表')('我的投资信息'), {}, {name: '我的投资信息'});
            resourceService.queryPost($scope, $filter('交互接口对照表')('奖品列表'), {}, {name: '奖品列表'});
            resourceService.queryPost($scope, $filter('交互接口对照表')('投资排行'), {}, {name: '投资排行'});
        };

        $scope.loginTitle = '请先登录';
        $scope.regTitle = '请先注册';
        $scope.curClass = 'commonLogin';
        $scope.showREG = true;
        $scope.investNum = 10000;

        if($localStorage.user) {
            console.log($localStorage.user);
            $scope.isLogin = true;
        }

        if ($location.$$url.indexOf("luckyDraw") > -1) {
            $localStorage.luckyDrawPath = $scope.luckyDrawPath = true;
        } else {
            delete $localStorage.luckyDrawPath;
            $localStorage.luckyDrawPath = $scope.luckyDrawPath = false;
        }

        /*注册*/
        $scope.userLogin = {};
        $scope.login = {};
        $scope.isDisabledRecomm = false;

        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        }
        if ($stateParams.recommCode) {
            $scope.isDisabledRecomm = true;
        }
        ;
        if ($localStorage.webFormPath != undefined) {
            if ($localStorage.webFormPath.recommCode != undefined) {
                $scope.login.recommPhone = $localStorage.webFormPath.recommCode;
            }
            ;
            if ($localStorage.webFormPath.toFrom != undefined) {
                $scope.login.toFrom = $localStorage.webFormPath.toFrom;
            }
            ;
            if ($localStorage.webFormPath.tid != undefined) {
                $scope.login.tid = $localStorage.webFormPath.tid;
            }
            ;
        }

        $scope.login.checkbox = true;
        $scope.isDisabledPhoneMsg = true;
        $scope.isSubMin = true;
        $scope.isShowReferee = false;
        var isZhuCeSubmin = true;
        var isDenLuSubmin = true;
        var changeIMG = function (event) { //换图片验证码
            if (event != undefined) {
                event.currentTarget.src += '?' + new Date().getTime();
            } else {
                if ($('.img-box img')[0] != undefined) {
                    $('.img-box img')[0].src += '?' + new Date().getTime();
                }
                ;
            }
            ;
        };
        changeIMG();
        $scope.onClickReferee = function () {
            if ($scope.isShowReferee) {
                $scope.isShowReferee = false;
            } else {
                $scope.isShowReferee = true;
            }
            ;
        };
        $scope.isGetVoice = false;
        var $userphone = $('#userphone'),
            $imgcode = $('#imgcode');
        $scope.clickInput = function (type, event, isLogin, tegForm, isvoice) {
            switch (type) {
                case 'changePic':
                    // $scope.userLogin.picCode = null;
                    changePicEvent = event;
                    changeIMG(changePicEvent);
                    break;
                case 'phonecodeMSG':
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
                        $scope.isGetCode = true;
                        $scope.voiceRepeat = false;
                        $scope.isvoice = isvoice;
                        resourceService.queryPost($scope, $filter('交互接口对照表')('校验图片验证码'), {
                            picCode: $scope.login.picCode,
                            mobilephone: $scope.login.mobilephone,
                            type: isvoice + 1
                        }, {name: '获取验证码', tegForm: tegForm, isvoice: isvoice, nowTimer: $scope.nowTimer});
                    }
                    ;
                    break;
            }
            ;
        };

        // 去安全认证页面绑定
        $scope.bindBank = function () {
            // ngDialog.closeAll();
            $filter('跳转页面')('', 'main.myAccount.recharge', 'main.myAccount.security', 'setTruename', null, {
                name: '账户管理',
                url: 'main.myAccount.security'
            });
        };
        $scope.toReceivePacket = function () {
            $filter('跳转页面')('','main.financeSuccess','main.myAccount.reimtask',null,null, {
                url:'main.myAccount.reimtask',
                name:'我要报销'
            });
        };
        $scope.LoginClick = function (clickName, tegForm) {
            if (isZhuCeSubmin) {
                isZhuCeSubmin = false;
                resourceService.queryPost($scope, $filter('交互接口对照表')('立即注册'), $scope.login, {
                    name: '注册',
                    tegForm: tegForm
                });

                if(isDenLuSubmin){//防重复提交
                    isDenLuSubmin = false;
                    resourceService.queryPost($scope,$filter('交互接口对照表')('登录接口'),$scope.userLogin,{name:'用户登录',tegForm:tegForm});
                };
            }
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

        /*焦点进入与离开*/
        $scope.blurID = function (code, tegForm) {
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                $filter('清空缓存')();
                resourceService.queryPost($rootScope, $filter('交互接口对照表')('退出接口'), {}, '退出');
                changeIMG();
                resourceService.queryPost($scope, $filter('交互接口对照表')('注册验证手机号'), {
                    mobilephone: $scope.login.mobilephone
                }, {name: '注册验证手机号', tegForm: tegForm});
            }
        };

        resourceService.queryPost($scope, $filter('交互接口对照表')('我的投资信息'), {}, {name: '我的投资信息'});
        resourceService.queryPost($scope, $filter('交互接口对照表')('奖品列表'), {}, {name: '奖品列表'});
        resourceService.queryPost($scope, $filter('交互接口对照表')('中奖纪录'), {}, {name: '中奖纪录'});
        resourceService.queryPost($scope, $filter('交互接口对照表')('投资排行'), {}, {name: '投资排行'});

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '奖品列表':
                    if (data.success) {
                        $scope.awardList = data.map.awardList;
                        $scope.awardListFirst3 = [$scope.awardList[0], $scope.awardList[1], $scope.awardList[2]];
                        $scope.awardLists = $scope.awardListFirst3.concat($scope.awardList[5], $scope.awardList[4], $scope.awardList[3]);
                        // 得到进宝奖
                        if($scope.awardList[5].status == 1) {
                            $scope.getFullPrize = true;
                        } else {
                            $scope.getFullPrize = false;
                        }
                    }
                    break;
                case '我的投资信息':
                    if(data.success) {
                        $scope.myInvestInfo = data.map;
                        $scope.isInActivityTime = data.map.isInActivityTime;
                    }
                    break;
                case '投资排行':
                    if(data.success) {
                        $scope.rankList = data.map.rankList;
                        // 前三名
                        $scope.rankListTop3 = [$scope.rankList[0],$scope.rankList[1],$scope.rankList[2]];
                        // 后面7名
                        $scope.rankListOther7 = [$scope.rankList[3],$scope.rankList[4],$scope.rankList[5],$scope.rankList[6],$scope.rankList[7],$scope.rankList[8],$scope.rankList[9]];
                        // 第10名
                        $scope.rankList10 = $scope.rankList[9];
                        /*angular.forEach($scope.rankListTop3, function (value, index) {
                            if($scope.isLogin) {
                                if(value.userName == $localStorage.user.userName) {
                                    value.ownPos = true;
                                } else {
                                    value.ownPos = false;
                                }
                            }

                        });*/

                        angular.forEach($scope.rankListOther7, function (value, index) {
                            value.index = index + 4;
                            if(index < 2) {
                                value.awardName = '京东卡800元';
                            } else if(index >= 2 && index < 4) {
                                value.awardName = '京东卡500元';
                            } else {
                                value.awardName = '京东卡300元';
                            }
                            /*if($scope.isLogin) {
                                if(value.userName == $localStorage.user.userName) {
                                    value.ownPos = true;
                                } else {
                                    value.ownPos = false;
                                }
                            }*/
                        });
                    }
                    break;
                case '中奖纪录':
                    if (data.success) {
                        if(data.map.pageData) {
                            // if($scope.isLogin) {
                            //     $state.reload();
                            // }
                            $scope.winningRecords = data.map.pageData.rows;

                            var num = 0;
                            function goLeft() {
                                if ($scope.winningRecords.length >= 50) {
                                    if (num == -5000) {
                                        num = 0;
                                    }
                                } else {
                                    if (num == -3000) {
                                        num = 0;
                                    }
                                }
                                num -= 1;
                                $(".investedPeople .investedCnt").css({
                                    left: num
                                });
                                if($(".investedPeople .investedCnt").css('left') <= -4900) {
                                        $(".investedPeople .investedCnt").find('span').eq(0).appendTo($infos);
                                        // $infos.css('margin-left','-190px');
                                        $(".investedPeople .investedCnt").css('margin-left','0px');
                                    }
                            }
                            //设置滚动速度
                            var timer = setInterval(goLeft, 10);
                            //设置鼠标经过时滚动停止
                            $(".box").hover(function() {
                                    clearInterval(timer);
                                }, function() {
                                    timer = setInterval(goLeft, 20);
                            });
                        }

                       /* function scroll(){
                            $(".content ul").animate({"margin-left":"-110px"},function(){
                                $(".content ul li:eq(0)").appendTo($(".content ul"))
                                $(".content ul").css({"margin-left":0})
                            })
                        }
                        setInterval(scroll,1000)*/


                        /*var $infos = $('.investedPeople .investedCnt');
                        if($scope.winningRecords) {
                            setInterval(function () {
                                $infos.animate({'margin-left': '-1200px'}, 8000, function () {
                                    $infos.find('span').eq(0).appendTo($infos);
                                    // $infos.css('margin-left','-190px');
                                    $infos.css('margin-left','-430px');
                                });
                            }, 0);
                        }*/
                    }
                    break;
                case '注册验证手机号':
                    if (data.success) {
                        if (data.map.exists) { //已有用户名
                            type.tegForm.mobilephone.$error.serverError = data.map.exists;
                            $scope.serverErrorCode = 8888;
                        } else {
                            type.tegForm.mobilephone.$error.serverError = data.map.exists;
                        }
                    }
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
                        }
                        ;
                        changeIMG();
                    }
                    ;
                    break;
                case '注册':
                    if ($scope.stop != undefined) {
                        $scope.stop();
                    }
                    isZhuCeSubmin = true;
                    if (data.success) {
                        $localStorage.webFormPath = {};
                        $localStorage.user = data;
                        if ($location.$$path == '/extend/poster') {
                            $state.go('main.billDetail', {id: data.map.pid});
                        } else if ($location.$$path == '/luckyDraw') {
                            $state.go('luckyDraw', {num: data.map.regSendCount});
                        }  else {
                            $state.go('main.financeSuccess', {num: data.map.regSendCount});
                        }
                        // if($location.$$path == '/newToInvest' && $location.$$search.toFrom) {
                        //     $scope.newToInvest = true;
                        // } else {
                        //     $scope.newToInvest = false;
                        // }
                        resourceService.queryPost($scope, $filter('交互接口对照表')('我的投资信息'), {}, {name: '我的投资信息'});
                        resourceService.queryPost($scope, $filter('交互接口对照表')('奖品列表'), {}, {name: '奖品列表'});
                        resourceService.queryPost($scope, $filter('交互接口对照表')('投资排行'), {}, {name: '投资排行'});
                    } else {
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
                        }
                        ;
                    }
                    ;
                    break;
                case '用户登录':
                    if(data.success) {
                        console.log('222 ' +data);
                        if ($scope.fromCommonDl) {
                            delete $localStorage.pathUrl;
                            $rootScope. closeDialog();
                        }

                        $scope.isLogin = true;
                        resourceService.queryPost($scope, $filter('交互接口对照表')('我的投资信息'), {}, {name: '我的投资信息'});
                        resourceService.queryPost($scope, $filter('交互接口对照表')('奖品列表'), {}, {name: '奖品列表'});
                        resourceService.queryPost($scope, $filter('交互接口对照表')('投资排行'), {}, {name: '投资排行'});
                    } else {
                        $scope.isLogin = false;
                    }
                    break;
            }
            ;
        });

        // 推广页的方法
        $scope.focusMobile = function () {
            $('#mobilephone').focus();
        };

        var $window = $(window),
            $toTop = $('.poster-totop'),
            $hb = $('html,body');
        $scope.toTop = function () {
            $hb.animate({scrollTop: 0}, 300);
        };
        $window.on('resize scroll load', function () {
            if ($hb.height() - $window.scrollTop() - $window.height() < 275) {
                $toTop.addClass('totop');
            } else {
                $toTop.removeClass('totop');
            }
        });

        // 如果没有登录，弹出登录弹框
        $scope.isLoginFun = function () {
            $scope.isLogin = $filter('isRegister')().register;
            if (!$scope.isLogin) {
                $filter('登录注册弹窗')($scope);
            } else {
                resourceService.queryPost($scope, $filter('交互接口对照表')('奖品列表'), {}, {name: '奖品列表'});
            }
        };

        // 监听退出是否成功
        $rootScope.$on('exitSuccess', function (event, flag) {
            if (flag) {
                $scope.isLogin = false;
            }
        });

        //年华收益计算器
        $scope.openCalc = function () {
            $filter('春节年化收益计算器弹窗')($scope);
            /*$scope.isLoginFun();
            if ($scope.isLogin) {
                $filter('春节年化收益计算器弹窗')($scope);
            }*/
        };

        // 奖品详情
        $scope.awardDetail = function (item) {
            $scope.isLoginFun();
            if ($scope.isLogin) {
                $filter('春节活动奖品弹窗')($scope);
                $scope.proInfos = item;
            }
        };

        // 春节年化收益计算器弹窗
        $scope.time = 30;
        $scope.investTime = function (time) {
            $scope.time = time;
        };

        //改变往期产品
        $scope.changepreviousLottery = function (index) {
            $scope.activerevious = $scope.previousLottery[index];
        };

        // $scope.$watch('pro.orderNum',function(newValue,oldValue){
        //     $scope.pro.orderNum = newValue;
        // });

        $scope.accountUserOut = function (event) {
            $filter('清空缓存')();
            resourceService.queryPost($scope, $filter('交互接口对照表')('退出接口'), {}, '退出');
            $rootScope.$emit('exitSuccess', true);
            $scope.isLogin = false;
        };

        if ($location.$$path == '/main/financeSuccess') {
            $scope.regSendCount = $location.$$search.num;
        }
    }
])
