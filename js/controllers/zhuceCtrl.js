/*注册*/
mainModule.controller('zhuceCtrl', ['$scope',
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

    function($scope,
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
        if ($location.$$path == '/main/newcomer') {
            var obj = $location.$$search;
            $state.go('newlayout.finance',obj);
        }

        if ($location.$$path == '/broadbandnew') {
            $state.go('main.home');
        }

        $scope.showPic = false;

        // 营销QQ 2
        $scope.mouseover = function () {
            $scope.count = true;
        };
        $scope.mouseout = function () {
            $timeout(function(){
                $scope.count = false;
            },2000);
        };

        /*注册*/
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
        if($scope.login.toFrom) {
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
                    } else {
                        if ($userphone.val() == '' ) {
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
                            }, { name: '获取验证码', tegForm: tegForm, isvoice: isvoice, nowTimer: $scope.nowTimer });
                        };
                    }

                    break;
            };
        };
        $scope.LoginClick = function(clickName, tegForm) {
            if (isZhuCeSubmin) {
                isZhuCeSubmin = false;
                $scope.login.isCheckPic = false;
                resourceService.queryPost($scope, $filter('交互接口对照表')('立即注册'), $scope.login, { name: '注册', tegForm: tegForm });
            }
        };
        /*焦点进入与离开*/
        $scope.blurID = function(code, tegForm, event) {
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
        $scope.gotoLoginPage = function(type) {
            switch (type) {
                case "帮助中心": //我的资产
                    $localStorage.showQA = false;
                    $filter('跳转页面')('', 'main.home', 'main.jt.help', '帮助中心', null, { name: '帮助中心', url: 'main.jt.help' });
                    break;
                case "投资课堂": //我的资产
                    $filter('跳转页面')('', 'main.home', 'main.jt.LCZS', '帮助中心', null, { name: '帮助中心', url: 'main.jt.LCZS' });
                    break;
                case "新手指引": //我的资产
                    $filter('跳转页面')('', 'main.home', 'main.guide', '', null, { name: '', url: 'main.guide' });
                    break;

                case "信息披露": //我的资产
                    $filter('跳转页面')('', 'main.home', 'main.jt.JSGK', '信息披露', null, { name: '信息披露', url: 'main.jt.JSGK' });
                    break;
                case "沪深概况": //我的资产
                    $filter('跳转页面')('', 'main.home', 'main.jt.JSGK', '信息披露', null, { name: '信息披露', url: 'main.jt.JSGK' });
                    break;
                case "法律法规": //我的资产
                    $filter('跳转页面')('', 'main.home', 'main.jt.FLFG', '信息披露', null, { name: '信息披露', url: 'main.jt.FLFG' });
                    break;
                case "联系我们": //我的资产
                    $filter('跳转页面')('', 'main.home', 'main.jt.LXWM', 'LXWM', null, { name: '信息披露', url: 'main.jt.LXWM' });
                    break;

                default:
                    $filter("跳转页面")(type, 'main.home', 'dl');
                    break;
            };
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type.name) {
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
                        $localStorage.user.mobilephone=$scope.login.mobilephone;
                        $scope.closeDialog();
                        if(data.map != undefined){
                            $localStorage.exclusiveUser = data.map.member.userType;
                            $localStorage.isDs = data.map.isDsUser;
                        }
                        /*$localStorage.exclusiveUser = $scope.user.map.member.userType;
                        $localStorage.isDs = data.map.isDsUser;*/
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
                        }
                        // else if($location.$$url != '/dl' && $location.$$url != '/zhuce' && $localStorage.smashEggPath) {
                        //     delete $localStorage.pathUrl;
                        //     resourceService.queryPost($rootScope, $filter('交互接口对照表')('砸蛋记录'), {}, '砸蛋记录');
                        //     $state.go('smashEgg');
                        // }
                        else if($location.$$url != '/dl' && $location.$$url != '/zhuce' && $localStorage.luckyDrawPath) {
                            delete $localStorage.pathUrl;
                             $state.go('luckyDraw');
                             resourceService.queryPost($rootScope, $filter('交互接口对照表')('预约奖品列表'), {}, {name:'预约奖品列表'});
                        } else if ($scope.fromCommonDl) {
                            delete $localStorage.pathUrl;
                            $state.reload();
                            $rootScope. closeDialog();
                        } else {
                            // $state.go('main.tradepasswdSet');
                            $state.go('main.financeSuccess',{num:data.map.regSendCount});
                        }
                    } else {
                        $scope.showPic = true;
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
                            case '1009':
                                type.tegForm.recommPhone.$error.serverError = true;
                                break;
                            case '1010':
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
                case '获取变现产品':
                    if (data.success) {
                        if (data.map.pid) {
                            if (data.map.pid == -1) {
                                $state.go('main.bankBillList');
                            } else {
                                $state.go('main.billDetail',{id:data.map.pid});
                            }
                        }
                    }
                break;
                case '长城宽带已登录数据':
                    if (data.success) {
                        $scope.broadbandInfo = data.map;
                    }
                break;
            };
        });

        // 推广页的方法
        $scope.focusMobile = function() {
            $('#mobilephone').focus();
            if ($location.$$path == '/broadbandnew' && $scope.hasLogin) {
                $(window).scrollTop(0);
            }
        };
        if ($location.$$path == '/main/newcomer') {
            resourceService.queryPost($scope, $filter('交互接口对照表')('selectInvest'), {}, { name: '获取新手投资列表'});
        }

        // 获取产品id
        $scope.getProId = function(deadline) {
            resourceService.queryPost($rootScope,$filter('交互接口对照表')('获取变现产品'),{deadline: deadline},'获取变现产品');
        };

        $scope.userOut = function (event) {
            $filter('清空缓存')();
            resourceService.queryPost($scope,$filter('交互接口对照表')('退出接口'),{},'退出');

            $scope.hasLogin = false;
        };
    }
])
