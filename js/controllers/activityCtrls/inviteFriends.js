/*注册*/
mainModule.controller('inviteFriendsCtrl', ['$scope',
    '$rootScope',
    '$http',
    '$state',
    '$stateParams',
    '$localStorage',
    '$location',
    'resourceService',
    'communicationService',
    '$filter',
    '$timeout',
    'ngDialog',
    
    function ($scope,
              $rootScope,
              $http,
              $state,
              $stateParams,
              $localStorage,
              $location,
              resourceService,
              communicationService,
              $filter,
              $timeout,
              ngDialog) {
        document.getElementsByTagName('html')[0].scrollTop = 0;
        document.getElementsByTagName('body')[0].scrollTop = 0;

        // mobilephone=136****7308&realName=****祥
        if(!!$location.$$search.realName) {
            $scope.userInfo = $location.$$search.realName;
        } else {
            if($location.$$search.mobilephone) {
                $scope.userInfo = $location.$$search.mobilephone;
            }
        }

        // if ($location.$$path == '/main/newcomer') {
        //     var obj = $location.$$search;
        //     $state.go('newlayout.finance',obj);
        // }

        // if ($location.$$path == '/broadbandnew') {
        //     $state.go('main.home');
        // }
        resourceService.queryPost($scope, $filter('交互接口对照表')('未登录邀请记录'), {
            "pageOn": 1,
            "pageSize": 30
        }, {name: '未登录邀请记录'});

        $scope.isLogin = $filter('isRegister')().register;

        if ($scope.isLogin) {
            resourceService.queryPost($scope, $filter('交互接口对照表')('已登录邀请记录'), {
                "pageOn": 1,
                "pageSize": 30
            }, {name: '已登录邀请记录'});
        }

        // 营销QQ 2
        $scope.mouseover = function () {
            $scope.count = true;
        };
        $scope.mouseout = function () {
            $timeout(function () {
                $scope.count = false;
            }, 2000);
        };

        /*注册*/
        $scope.userLogin = {};
        $scope.login = {};
        $scope.isDisabledRecomm = false;

        //组队活动传参
        if($location.$$search.activityCode != undefined) {
            $scope.login.activityCode = $location.$$search.activityCode;
        }
        if($location.$$search.teamId != undefined) {
            $scope.login.teamId = $location.$$search.teamId;
        }
        if($location.$$search.recommCode != undefined) {
            $scope.login.recommCode = $location.$$search.recommCode;
        }

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
        if ($scope.login.toFrom) {
            $scope.showRecommend = false;
        } else {
            $scope.showRecommend = true;
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
        var changeIMG = function (event) { //换图片验证码
            if (event != undefined) {
                event.currentTarget.src += '?' + new Date().getTime();
            } else {
                if ($('.img-box img')[0] != undefined) {
                    $('.img-box img')[0].src += '?' + new Date().getTime();
                }
            }
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
                    } else if (tegForm.mobilephone.$error.serverError == true) {
                        $userphone.focus();
                        //alert('手机号已经注册');
                        //$filter('zhuCePhoneError')('1007', $scope);
                        $scope.serverErrorCode = 1007;
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
        $scope.LoginClick = function (clickName, tegForm) {
            if (isZhuCeSubmin) {
                isZhuCeSubmin = false;
                // console.log($scope.login);
                resourceService.queryPost($scope, $filter('交互接口对照表')('立即注册'), $scope.login, {
                    name: '注册',
                    tegForm: tegForm
                });
            }
        };
        /*焦点进入与离开*/
        $scope.blurID = function (code, tegForm, event) {
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {

                if (event != undefined) {
                    var $this = $(event.currentTarget);
                    if ($this.hasClass('semmobilephone')) {
                        $filter('清空缓存')();
                        resourceService.queryPost($rootScope, $filter('交互接口对照表')('退出接口'), {}, '退出');
                        var $semImg = $this.parents('.quick-register-box').find('.semimg-box').find('img'),
                            semsrc = $semImg.attr('src');
                        $semImg.attr('src', semsrc + '?' + new Date().getTime());
                    }
                }
                // changeIMG();
                resourceService.queryPost($scope, $filter('交互接口对照表')('注册验证手机号'), {
                    mobilephone: $scope.login.mobilephone
                }, {name: '注册验证手机号', tegForm: tegForm});
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
                        ;
                    }
                    ;
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
                    $rootScope.closeDialog();
                    if ($scope.stop != undefined) {
                        $scope.stop();
                    }
                    isZhuCeSubmin = true;
                    if (data.success) {
                        $localStorage.webFormPath = {};
                        $localStorage.user = data;
                        $localStorage.isDs = data.map.isDsUser;
                        if ($localStorage.regACTURL != undefined) {
                            $state.go($localStorage.regACTURL);
                            ngDialog.closeAll();
                            delete $localStorage.regACTURL;
                        } else if ($location.$$path == '/broadbandnew') {
                            // window.location.reload();
                            setTimeout(function () {
                                resourceService.queryPost($scope, $filter('交互接口对照表')('长城宽带已登录数据'), {}, {name: '长城宽带已登录数据'});
                            }, 1000);
                            $scope.hasLogin = true;
                        } else if ($location.$$url != '/zhuce' && $localStorage.smashEggPath) {
                            delete $localStorage.pathUrl;
                            resourceService.queryPost($rootScope, $filter('交互接口对照表')('砸蛋记录'), {}, '砸蛋记录');
                            $state.go('smashEgg');
                        } else if($scope.login.activityCode != undefined && $scope.login.activityCode == 'zudui') {
                             $state.go('zudui');
                        } else {
                            // $state.go('main.tradepasswdSet');
                            $state.go('main.financeSuccess', {num: data.map.regSendCount});
                        }
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
                case '未登录邀请记录':
                    if (data.success) {
                        $scope.pageData = data.map.pageData;
                        $scope.rows = $scope.pageData.rows;

                        var $table = $('.peoples.noneLogin table');
                        if ($scope.pageData.total > 5) {
                            setInterval(function () {
                                $table.animate({'margin-top': '-20px'}, 500, function () {
                                    $table.find('tr').eq(0).appendTo($table);
                                    $table.css('margin-top', '0');
                                });
                            }, 3000);
                        }
                    }
                    break;
                    case '已登录邀请记录':
                    if (data.success) {
                        $scope.data = data.map;
                        $scope.inviteNumbers = $scope.data.inviteNumbers;
                        $scope.totalAmount = $scope.data.totalAmount;
                        $scope.pageInfo = $scope.data.page.rows;
                        var $table2 = $('#loginTable');
                        // var $table2 = $('.peoples.login .box table');
                        if ($scope.inviteNumbers > 4) {
                            setInterval(function () {
                                $table2.animate({'margin-top': '-20px'}, 500, function () {
                                    $table2.find('tr').eq(0).appendTo($table2);
                                    $table2.css('margin-top', '0');
                                });
                            }, 3000);
                        }
                    }
                    break;
            }
            ;
        });

        $scope.userOut = function (event) {
            $filter('清空缓存')();
            resourceService.queryPost($scope, $filter('交互接口对照表')('退出接口'), {}, '退出');
            $scope.isLogin = $filter('isRegister')().register;
            $scope.hasLogin = false;
        };
    }
])
