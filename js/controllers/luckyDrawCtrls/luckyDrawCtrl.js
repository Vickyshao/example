/*注册*/
mainModule.controller('luckyDrawCtrl', ['$scope',
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
        // $scope.isLogin = $filter('isRegister')().register;
        if ($localStorage.user != undefined) {
            $scope.user = $localStorage.user;
        }

        $scope.loginTitle = '登录后来领取抽奖码';
        $scope.regTitle = '注册后来领取抽奖码';
        $scope.curClass = 'commonLogin';

        if ($location.$$url.indexOf("luckyDraw") > -1) {
            $localStorage.luckyDrawPath = $scope.luckyDrawPath = true;
        } else {
            delete $localStorage.luckyDrawPath;
            $localStorage.luckyDrawPath = $scope.luckyDrawPath = false;
        }

        resourceService.queryPost($scope, $filter('交互接口对照表')('抽奖最新动态'), {}, {name: '抽奖最新动态'});
        resourceService.queryPost($scope, $filter('交互接口对照表')('预约奖品列表'), {}, {name: '预约奖品列表'});
        resourceService.queryPost($scope, $filter('交互接口对照表')('获取抽奖活动的奖品信息'), {}, {name: '获取抽奖活动的奖品信息'});
        resourceService.queryPost($scope, $filter('交互接口对照表')('往期开奖'), {}, {name: '往期开奖'});

        if($scope.isLogin) {
            resourceService.queryPost($scope, $filter('交互接口对照表')('预约奖品列表'), {}, {name: '预约奖品列表'});
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
                    $scope.userLogin.picCode = null;
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
        // $scope.LoginClick = function(clickName,tegForm) {
        //     switch(clickName){
        //         case 'denLu':
        //             if(isDenLuSubmin){//防重复提交
        //                 isDenLuSubmin = false;
        //                 resourceService.queryPost($scope,$filter('交互接口对照表')('登录接口'),$scope.userLogin,{name:'用户登录',tegForm:tegForm});
        //             };
        //             break;
        //     };
        // };

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


        /*//查看所有显示隐藏
        $scope.moreToggle = function () {
            $scope.getMore = !$scope.getMore;
            if($scope.getMore) {
                $('span.more').addClass('open');
            } else {
                $('span.more').removeClass('open');
            }
        };

        //常见问题显示隐藏
        $scope.toggleFAQ = function () {
            $scope.showFAQ = !$scope.showFAQ;
            if($scope.showFAQ) {
                // $('.questions').removeClass('hide');
                $('.questions').slideDown(400);
                $('.rules .arr').addClass('open');
            } else {
                // $('.questions').addClass('hide');
                $('.questions').slideUp(400);
                $('.rules .arr').removeClass('open');
            }
        };

        //预约其他
        $scope.orderOther = function () {
            $('html, body').animate({scrollTop: $('.reservation').offset().top});
        };

        // 监听退出是否成功
        $rootScope.$on('exitSuccess', function (event, flag) {
            if (flag) {
                $scope.isLogin = false;
            }
        });

        //获取抽奖码
        $scope.getCode = function () {
            $scope.isLogin = $filter('isRegister')().register;
            if ($scope.isLogin) {
                resourceService.queryPost($scope, $filter('交互接口对照表')('中奖记录'), {}, {name: '中奖记录'});
            } else {
                $filter('登录注册弹窗')($scope);
                // $scope.isLogin = $filter('isRegister')().register;
            }
        };

        //预约商品
        $scope.toReserve = function (index) {
            $scope.isLogin = $filter('isRegister')().register;
            if($scope.isLogin) {
                $scope.curAwards = $scope.awards[index];
                // $scope.orderNum = parseInt($('#orderNum').val());
                $scope.pro = {
                    orderNum : 1,
                    // maxNum : $scope.currentAward.residueCount
                }
                // $scope.orderNum = 1;
                $filter('预约商品')($scope);
            } else {
                $filter('登录注册弹窗')($scope);
            }
        };

        //确认预约
        $scope.user = $localStorage.user;
        $scope.sureToOrder = function () {
            $scope.closeDialog();
            $scope.obj = {};
            // $scope.obj.uid = $scope.user.uid;
            $scope.obj.awardId =  $scope.curAwards.id;
            $scope.obj.count = parseInt($scope.pro.orderNum);
            resourceService.queryPost($scope, $filter('交互接口对照表')('奖品预约'), $scope.obj, {name: '奖品预约'});
        };

        //改变往期产品
        $scope.changepreviousLottery = function (index) {
            $scope.activerevious = $scope.previousLottery[index];
        };

        // $scope.$watch('pro.orderNum',function(newValue,oldValue){
        //     $scope.pro.orderNum = newValue;
        // });

        // 减
        $scope.minus = function () {
            $scope.pro.orderNum--;
            $scope.isMaximum = false;
            if($scope.pro.orderNum < 1 ) {
                $scope.isMinimum = true;
                $scope.pro.orderNum = 1;
            } else {
                $scope.isMinimum = false;
            }
        };
        // 加
        $scope.plus = function () {
            $scope.pro.orderNum++;
            $scope.isMinimum = false;
            // if($scope.pro.orderNum > $scope.pro.maxNum ) {
            //     $scope.isMaximum = true;
            //     $scope.pro.orderNum = $scope.pro.maxNum;
            //
            // } else {
            //     $scope.isMaximum = false;
            // }
        };
        $scope.changeOrderNum = function () {
            // $scope.pro.orderNum = parseInt(num);
            $scope.pro.orderNum = $scope.pro.orderNum;
            // if(parseInt($scope.pro.orderNum) > parseInt($scope.pro.maxNum)) {
            //     $scope.isMaximum = true;
            //     $scope.pro.orderNum = $scope.pro.maxNum;
            // } else {
            //     $scope.isMaximum = false;
            // }
        };*/

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
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
                case '活动页账户信息':
                    if (data.success) {
                        $scope.account = data.map;
                    }
                    break;
                case '抽奖最新动态':
                    if (data.success) {
                        if(data.map.pi) {
                            $scope.latestAwarDynamic = data.map.pi.rows;
                        }
                        var $infos = $('.latestNews .info ul');
                        if($scope.latestAwarDynamic) {
                            if($scope.latestAwarDynamic.length > 5){
                                setInterval(function () {
                                    $infos.animate({'margin-top': '-52px'}, 1000, function () {
                                        $infos.find('li').eq(0).appendTo($infos);
                                        $infos.css('margin-top','0');
                                    });
                                }, 3000);
                            }
                        }
                    }
                    break;
                case '预约奖品列表':
                    if (data.success) {
                        $scope.awards = data.map.pageInfo.rows;
                    }
                    break;
                case '我的邀请列表':
                    if (data.success) {
                        $scope.account = data.map;
                    }
                    break;
                case '获取抽奖活动的奖品信息':
                    if (data.success) {
                        $scope.currentAward = data.map;
                        $scope.currentAwardInfo = data.map.awardInfo;
                        // $scope.remainNum = $scope.currentAwardInfo.periodCount - $scope.currentAwardInfo.reservedNums;
                    }
                    break;
                case '往期开奖':
                    if (data.success) {
                        $scope.previousLottery = data.map.pageInfo.rows;
                        $scope.activerevious = $scope.previousLottery[0];
                    }
                    break;
                case '奖品预约':
                    if (data.success) {
                        $scope.account = data.map;
                        $filter('感谢您的预约')($scope);
                        resourceService.queryPost($scope, $filter('交互接口对照表')('预约奖品列表'), {}, {name: '预约奖品列表'});
                    }
                    break;
                case '中奖记录':
                    if (data.success) {
                        $scope.myPrizeRecords = data.map.pageInfo.rows;
                        if ($scope.myPrizeRecords.length) {
                            $filter('跳转页面')('', 'luckyDraw', 'main.myAccount.winningRecord', '', null, {
                                name: '活动中心',
                                url: 'main.myAccount.winningRecord'
                            });
                        } else {
                            $filter('投资领取抽奖码')($scope);
                        }
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
        //查看所有显示隐藏
        $scope.moreToggle = function () {
            $scope.getMore = !$scope.getMore;
            if($scope.getMore) {
                $('span.more').addClass('open');
            } else {
                $('span.more').removeClass('open');
            }
        };

        //常见问题显示隐藏
        $scope.toggleFAQ = function () {
            $scope.showFAQ = !$scope.showFAQ;
            if($scope.showFAQ) {
                // $('.questions').removeClass('hide');
                $('.questions').slideDown(400);
                $('.rules .arr').addClass('open');
            } else {
                // $('.questions').addClass('hide');
                $('.questions').slideUp(400);
                $('.rules .arr').removeClass('open');
            }
        };

        //预约其他
        $scope.orderOther = function () {
            $('html, body').animate({scrollTop: $('.reservation').offset().top});
        };

        // 监听退出是否成功
        $rootScope.$on('exitSuccess', function (event, flag) {
            if (flag) {
                $scope.isLogin = false;
            }
        });

        //获取抽奖码
        $scope.getCode = function () {
            $scope.isLogin = $filter('isRegister')().register;
            if ($scope.isLogin) {
                resourceService.queryPost($scope, $filter('交互接口对照表')('中奖记录'), {}, {name: '中奖记录'});
            } else {
                $filter('登录注册弹窗')($scope);
                // $scope.isLogin = $filter('isRegister')().register;
            }
        };

        //预约 活动商品
        $scope.toReserve = function (index) {
            $scope.isLogin = $filter('isRegister')().register;
            if($scope.isLogin) {
                $scope.curAwards = $scope.awards[index];
                // $scope.orderNum = parseInt($('#orderNum').val());
                $scope.pro = {
                    orderNum : 1,
                    maxNum : 300
                    // maxNum : $scope.currentAward.residueCount
                }
                // $scope.orderNum = 1;
                $filter('预约商品')($scope);
            } else {
                $filter('登录注册弹窗')($scope);
            }
        };

        //预约 非活动商品（预约下一期）
        $scope.toReserveNext = function () {
            $scope.isLogin = $filter('isRegister')().register;
            if($scope.isLogin) {
                $scope.curAwards = $scope.currentAwardInfo;
                // $scope.orderNum = parseInt($('#orderNum').val());
                $scope.pro = {
                    orderNum : 1,
                    maxNum : 300
                    // maxNum : $scope.currentAward.residueCount
                }
                // $scope.orderNum = 1;
                $filter('预约商品')($scope);
            } else {
                $filter('登录注册弹窗')($scope);
            }
        };

        //确认预约
        $scope.user = $localStorage.user;
        $scope.sureToOrder = function () {
            $scope.closeDialog();
            $scope.obj = {};
            // $scope.obj.uid = $scope.user.uid;
            $scope.obj.awardId =  $scope.curAwards.id;
            $scope.obj.count = parseInt($scope.pro.orderNum);
            resourceService.queryPost($scope, $filter('交互接口对照表')('奖品预约'), $scope.obj, {name: '奖品预约'});
        };

        //改变往期产品
        $scope.changepreviousLottery = function (index) {
            $scope.activerevious = $scope.previousLottery[index];
        };

        // $scope.$watch('pro.orderNum',function(newValue,oldValue){
        //     $scope.pro.orderNum = newValue;
        // });

        // 减
        $scope.minus = function () {
            $scope.pro.orderNum--;
            $scope.isMaximum = false;
            if($scope.pro.orderNum < 1 ) {
                $scope.isMinimum = true;
                $scope.pro.orderNum = 1;
            } else {
                $scope.isMinimum = false;
            }
        };
        // 加
        $scope.plus = function () {
            // if($scope.pro.orderNum < $scope.pro.maxNum ) {
                $scope.pro.orderNum++;
            // }
            $scope.isMinimum = false;
            if($scope.pro.orderNum > $scope.pro.maxNum ) {
                $scope.isMaximum = true;
                $scope.pro.orderNum = $scope.pro.maxNum;

            } else {
                $scope.isMaximum = false;
            }
        };
        $scope.changeOrderNum = function () {
            $scope.pro.orderNum = $scope.pro.orderNum;
            if(parseInt($scope.pro.orderNum) > parseInt($scope.pro.maxNum)) {
                // $scope.isMaximum = true;
                $scope.pro.orderNum = $scope.pro.maxNum;
                // $scope.isMaximum = false;
            } else {
                $scope.isMaximum = false;
            }
        };

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
