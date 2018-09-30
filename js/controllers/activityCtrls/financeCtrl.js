/*注册*/
mainModule.controller('financeCtrl', ['$scope',
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

        $scope.curClass = 'commonLogin';

        if ($location.$$path == '/newlayout/finance') {
            $('html,body').animate({scrollTop: 0});
        }

        if ($location.$$path == '/main/finance') {
            var obj = $location.$$search;
            $state.go('newlayout.finance', obj);
        }

        $scope.isLogin = $filter('isRegister')().register;
        if ($localStorage.user != undefined) {
            $scope.user = $localStorage.user;
        }

        if($stateParams.ecCode) {
            $scope.ecCode = $stateParams.ecCode;
        } else {
            $scope.ecCode = null;
        }
        ;

        if($stateParams.newToInvest) {
            $scope.newToInvest = true;
        } else {
            $scope.newToInvest = false;
        }
        ;

        if ($scope.isLogin) {
            resourceService.queryPost($scope, $filter('交互接口对照表')('活动页账户信息'), {}, {name: '活动页账户信息'});
        }

        if(!!$scope.ecCode) {
            $scope.isecCommer = true;

            if ($localStorage.ecCode.substring(2,3) == 'A') {
                $scope.price = '10';
            } else if($localStorage.ecCode.substring(2,3) == 'B') {
                $scope.price = '50';
            } else if ($localStorage.ecCode.substring(2,3) == 'c'){
                $scope.price = '100';
            }
        } else {
            $scope.isecCommer = false;
        }

        $scope.historyRate = '12.88';
        /*注册*/
        $scope.showPic=false;
        $scope.userLogin = {};
        $scope.login = {};
        $scope.isDisabledRecomm = false;

        $scope.isLogin = $filter('isRegister')().register;

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
            }
        };
        /*焦点进入与离开*/
        $scope.blurID = function (code, tegForm) {
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                if (event != undefined) {
                    var $this = $(event.currentTarget);
                    if ($this.hasClass('semmobilephone')) {
                        $filter('清空缓存')();
                        resourceService.queryPost($rootScope,$filter('交互接口对照表')('退出接口'),{},'退出');
                        var $semImg = $this.parents('.quick-register-box').find('.semimg-box').find('img'),
                            semsrc = $semImg.attr('src');
                        $semImg.attr('src',semsrc+'?'+ new Date().getTime());
                    }
                }
                // changeIMG();
                resourceService.queryPost($scope, $filter('交互接口对照表')('注册验证手机号'), {
                    mobilephone: $scope.login.mobilephone
                }, { name: '注册验证手机号', tegForm: tegForm });
            }
        };

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
                        $scope.closeDialog();
                        if ($location.$$path == '/extend/poster') {
                            $state.go('main.billDetail', {id: data.map.pid});
                        } else if ($location.$$path == '/newToInvest') {
                            $state.go('main.financeSuccess', {num: data.map.regSendCount, newToInvest:true});
                        } else {
                            $state.go('main.financeSuccess', {num: data.map.regSendCount});
                        }
                        // if($location.$$path == '/newToInvest' && $location.$$search.toFrom) {
                        //     $scope.newToInvest = true;
                        // } else {
                        //     $scope.newToInvest = false;
                        // }
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
                        }
                        ;
                    }
                    ;
                    break;
                case '新手标排行榜':
                    if (data.success) {
                        $scope.xsInvestList = data.map.investList;
                        $scope.xsCount = data.map.investCount;
                        $scope.newhand = data.map.newHand;
                        if ($scope.xsInvestList.length > 9) {
                            var $newList = $('.new-wrapper .invest ul');
                            setInterval(function () {
                                $newList.animate({'margin-top': '-36px'}, 500, function () {
                                    $newList.find('li').eq(0).appendTo($newList);
                                    $newList.css('margin-top', 0);
                                });
                            }, 3000);
                        }
                    }
                    break;
                case '活动页账户信息':
                    if (data.success) {
                        $scope.account = data.map;
                    }
                    break;
                case '电商码':
                    if (data.success) {
                    }
                    break;
                case '注册的用户':
                    if (data.success) {
                        $scope.userList = data.map.list;
                        if ($scope.userList.length > 5) {
                            setInterval(function() {
                                $table.animate({'margin-top':'-36px'},500,function() {
                                    $table.find('li').eq(0).appendTo($table);
                                    $table.css('margin-top',0);
                                })
                            }, 5000);
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
        if ($location.$$path == '/extend/poster') {
            resourceService.queryPost($scope, $filter('交互接口对照表')('新手标排行榜'), {}, {name: '新手标排行榜'});
        }
        resourceService.queryPost($scope, $filter('交互接口对照表')('新手标排行榜'), {}, {name: '新手标排行榜'});

        // pullNewSem2
        resourceService.queryPost($scope, $filter('交互接口对照表')('注册的用户'), {}, {name: '注册的用户'});
        var $table = $('.right .out .userlist');
        $scope.tomodal = function () {
            $filter('sem2注册弹窗')($scope);
        };
        $scope.todl = function () {
            $scope.closeDialog();
            $state.go('dl');
        };

        //beginSem(新手理財)
        $scope.toAward = function () {
            $filter('奖励条件弹窗')($scope);
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

        // 监听退出是否成功
        $rootScope.$on('exitSuccess', function (event, flag) {
            if (flag) {
                $scope.isLogin = false;
            }
        });

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
