/*注册*/
mainModule.controller('eCommerceCtrl', ['$scope',
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
        ;

        if ($scope.isLogin) {
            resourceService.queryPost($scope, $filter('交互接口对照表')('活动页账户信息'), {}, {name: '活动页账户信息'});
        }

        /*注册*/
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
            // if ($localStorage.webFormPath.recommCode != undefined) {
            //     $scope.login.recommPhone = $localStorage.webFormPath.recommCode;
            // }
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
                case 'phonecodeMSG':
                    // if ($userphone.val() == '') {
                    //     $userphone.focus();
                    //     return;
                    // } else if ($imgcode.val() == '') {
                    //     $imgcode.focus();
                    //     return;
                    // }
                    if ($scope.isSubMin) {
                        if (!isvoice && parseInt($scope.nowTimer) > 0) {
                            return;
                        }
                        var $this = $(event.currentTarget);
                        // if ($this.hasClass('getcode-disabled')) {
                        //     return;
                        // }
                        $scope.isGetCode = true;
                        $scope.voiceRepeat = false;
                        $scope.isvoice = isvoice;

                        $scope.setMobilephone = function () {
                            $scope.stop();
                            type.nowTimer = "获取验证码";
                            $scope.isSubMin = true;
                        };

                        resourceService.queryPost($scope, $filter('交互接口对照表')('校验图片验证码'), {
                            // picCode: $scope.login.picCode,
                            isCheckPic: false,
                            mobilephone: $scope.login.mobilephone,
                            type: isvoice + 1
                        }, {name: '获取验证码', tegForm: tegForm, isvoice: isvoice, nowTimer: $scope.nowTimer});

                    }
                    ;
                    break;
            }
            ;
        };
        $scope.LoginClick = function (clickName, tegForm) {
            if (isZhuCeSubmin) {
                isZhuCeSubmin = false;
                $scope.login.isCheckPic = false;
                if($scope.login.ecCode) {
                    $localStorage.isDs = true;
                } else {
                    $localStorage.isDs = false;
                }
                resourceService.queryPost($scope, $filter('交互接口对照表')('立即注册'), $scope.login, {
                    name: '注册',
                    tegForm: tegForm,
                });
            }
        };
        /*焦点进入与离开*/
        $scope.blurID = function (code, tegForm) {
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                $filter('清空缓存')();
                resourceService.queryPost($rootScope, $filter('交互接口对照表')('退出接口'), {}, '退出');
                resourceService.queryPost($scope, $filter('交互接口对照表')('注册验证手机号'), {
                    mobilephone: $scope.login.mobilephone
                }, {name: '注册验证手机号', tegForm: tegForm});
            }
        };

        /*电商专属码判断*/
        $scope.checkEccode = function (code, tegForm) {
            resourceService.queryPost($scope, $filter('交互接口对照表')('电商码'), {
                ecCode: $scope.login.ecCode,
                isCheckPic: false
            }, {name: '电商码', tegForm: tegForm});
            $scope.ecCode = $scope.login.ecCode;
        };
        // $scope.checkEccodel = function (code, tegForm) {
        //     resourceService.queryPost($scope, $filter('交互接口对照表')('电商码'), {
        //         mobilephone: $scope.login.mobilephone,
        //         ecCode: $scope.login.ecCode,
        //         isCheckPic : true
        //     }, {name: '电商码', tegForm: tegForm});
        // };

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
                case '电商码':
                    if (data.success) {
                        $scope.ecCodeError= false;
                        $localStorage.ecCode = $scope.login.ecCode;
                    } else {
                        $scope.isShowPhoneError = !data.success;
                        $scope.isDisabledPhoneMsg = true;
                        $scope.serverErrorCode = data.errorCode;
                        // $scope.isGetCode = false;
                        $scope.ecCodeError= data.errorMsg;
                        // switch (data.errorCode) {
                        //     case '00001':
                        //         type.tegForm.ecCode.$error.serverError = true;
                        //         // changeIMG();
                        //         break;
                        //     case 'ds1001':
                        //         type.tegForm.ecCode.$error.serverError = true;
                        //         break;
                        //     case 'ds1002':
                        //         type.tegForm.ecCode.$error.serverError = true;
                        //         break;
                        //     case 'ds1003':
                        //         type.tegForm.ecCode.$error.serverError = true;
                        // }
                    }
                    break;
                case '获取验证码':
                    if (data.success) {
                        $scope.isShowPhoneError = !data.success;
                        $scope.isDisabledPhoneMsg = false;
                        $scope.isGetCode = true;
                        if (type.isvoice) {
                            $scope.isGetVoice = true;
                        } else {
                            $scope.isGetVoice = false;
                        }
                        if (type.nowTimer == '重发'|| parseInt(type.nowTimer) <= 0 || type.nowTimer == undefined || type.nowTimer == '') {
                            $filter('倒计时')($scope, 60);
                        }
                    } else {
                        $scope.isShowPhoneError = !data.success;
                        $scope.isDisabledPhoneMsg = true;
                        // $scope.stop();
                        $scope.serverErrorCode = data.errorCode;
                        $scope.isGetCode = false;
                        switch (data.errorCode) {
                            case '1001':
                                // type.tegForm.picCode.$error.serverError = true;
                                // changeIMG();
                                break;
                            case '1002':
                                // type.tegForm.picCode.$error.serverError = true;
                                break;
                            case '1003':
                                type.tegForm.smsCode.$error.serverError = true;
                                break;
                            case '8888':
                                $scope.voiceRepeat = true;
                        }
                        ;
                    }
                    ;
                    break;
                case '注册':
                    // if ($scope.stop != undefined) {
                    //     $scope.stop();
                    // }
                    isZhuCeSubmin = true;
                    if (data.success) {
                        $localStorage.webFormPath = {};
                        $localStorage.user = data;
                        if ($location.$$path == '/extend/poster') {
                            $state.go('main.billDetail', {id: data.map.pid});
                        } else {
                            $state.go('main.financeSuccess', {num: data.map.regSendCount, ecCode:$scope.login.ecCode});
                        }
                    } else {
                        $scope.serverErrorCode = data.errorCode;
                        switch (data.errorCode) {
                            case '1001':
                                type.tegForm.smsCode.$error.serverError = true;
                                break;
                            case '1002':
                                type.tegForm.smsCode.$error.serverError = true;
                                break;
                            case '1003':
                                type.tegForm.mobilephone.$error.serverError = true;
                                break;
                            case '1004':
                                // type.tegForm.picCode.$error.serverError = true;
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
                    }
                    break;
                case '已报销账户':
                    if (data.success) {
                        $scope.infos = data.map.pageData.rows;
                        $scope.total = data.map.pageData.total;
                        $scope.realName =
                        $table = $('.bxpro .detail .r table');
                        if ($scope.total > 5) {
                            setInterval(function() {
                                $table.animate({'margin-top':'-38px'},500,function() {
                                    $table.find('tr').eq(0).appendTo($table);
                                    $table.css('margin-top',0);
                                })
                            }, 3000);
                        }
                    }
                    break;
                case '活动页账户信息':
                    if (data.success) {
                        $scope.account = data.map;
                    }
                    break;
            }
        });

        resourceService.queryPost($scope, $filter('交互接口对照表')('已报销账户'), {}, {name: '已报销账户'});
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

        $scope.gostep2 = function (event) {
            // var stepone = false,
            //     steptwo = true;
            if($scope.ecCodeError || $scope.loginform.mobilephone.$valid) {
                loginform.$valid = false;
            } else {
                $('.step2').removeClass('hide');
                $('.step1').addClass('hide');
                $scope.clickInput('phonecodeMSG',event,null,loginform,false);
            }
        };

        $scope.gostep1 = function () {
            // var stepone = false,
            //     steptwo = true;
            $('.step1').removeClass('hide');
            $('.step2').addClass('hide');
            $('#mobilephone').focus();
        };

        if ($location.$$path == '/main/financeSuccess') {
            $scope.regSendCount = $location.$$search.num;
        }
    }
])
