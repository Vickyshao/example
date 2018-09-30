/*注册*/
mainModule.controller('smashEggCtrl', ['$scope',
    '$rootScope',
    '$http',
    '$state',
    '$stateParams',
    '$localStorage',
    '$location',
    'resourceService',
    'communicationService',
    '$filter',
    'ngDialog',
    '$window',
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
              ngDialog,
              $window) {
        // $scope.isLogin = $filter('isRegister')().register;

        if ($location.$$url.indexOf("smashEgg") > -1) {
            $localStorage.smashEggPath = $scope.smashEggPath = true;
        } else {
            delete $localStorage.smashEggPath;
            $localStorage.smashEggPath = $scope.smashEggPath = false;
        }

        resourceService.queryPost($scope, $filter('交互接口对照表')('已参加砸蛋人员'), {limit: 100}, '已参加砸蛋人员');
        resourceService.queryPost($rootScope, $filter('交互接口对照表')('砸蛋记录'), {}, '砸蛋记录');

        $('body.ngdialog-open, html.ngdialog-open').css('overflow', 'visible !important');
        if($($('.danbox').find('img')[1]).hasClass('show')) {
            $(this).find('.p2-egg').removeClass('p2-egg-hover');
            $(this).find('.p2-egg').css('animation', 'unset');
            $filter('砸蛋第一次获奖弹窗')($scope);
        }

        $scope.Egg = function () {
            $(function () {
                $(".danbox li ").mouseenter(function () {
                    if (!$(this).find(".p2-egg").hasClass("move_egg_click")) {
                        $(".p2-chui").hide();
                        $(".p2-ps").hide();
                        $(".p2-egg").removeClass("p2-egg-hover");
                        $(this).find(".p2-egg").addClass("p2-egg-hover");
                        $(this).find(".p2-chui").show();
                        $(this).find(".p2-ps").show();
                    }
                    if($scope.lotteryCount == 3 || $($(this).find('img')[1]).hasClass('show') ) {
                        $('.p2-chui').css('display', 'none');
                    }
                });

                //点击金蛋时执行
                $(".danbox ul li .ins").on('click', function () {
                    // $scope.isLogin = $filter('isRegister')().register;
                    $scope.obj = $(this);
                    // 0左， 1中， 2右
                    $scope.pos = 0;
                    if ($(this).hasClass('left')) {
                        $scope.pos = 0;
                    } else if ($(this).hasClass('middle')) {
                        $scope.pos = 1;
                    } else if ($(this).hasClass('right')) {
                        $scope.pos = 2;
                    }

                    if($scope.isLogin) {
                        if($($(this).find('img')[1]).hasClass('show') || $($(this).find('img')[2]).hasClass('show')) {
                            // if($scope.smashEggStatus == false) {
                                $filter('砸蛋第一次获奖弹窗')($scope);
                            // }
                        } else {
                            resourceService.queryPost($scope, $filter('交互接口对照表')('砸金蛋'), {
                                pos: $scope.pos
                            }, '砸金蛋');
                                $(".p2-egg").removeClass("p2-egg-hover");
                                $(this).find(".p2-chui").hide();
                                $(this).find(".p2-ps").hide();

                                $(this).find(".p2-egg").addClass("move_egg_click");
                                $(this).parent('li').addClass('po');
                                $(this).find('.p2-egg .normal').removeClass('show').hide();

                                $(this).find('.p2-egg:not(.jxq)').removeClass('p2-egg-hover');
                        }
                    } else {
                        $scope.closeDialog();
                        $filter('砸蛋登录注册弹窗')($scope);
                    }
                });

            });
        };
        $scope.Egg();
        /**
         * 砸蛋抽奖
         * @param item
         */
        $scope.breakEggs = function(item){
            $scope.currPos = item.pos;
            $scope.isLogin = $filter('isRegister')().register;
            if($scope.isLogin) {
                resourceService.queryPost($scope, $filter('交互接口对照表')('砸金蛋'), {
                    pos: item.pos
                }, '砸金蛋');
            } else {
                $scope.closeDialog();
                $filter('砸蛋登录注册弹窗')($scope);
            }
        };
        /**
         * 砸蛋领奖
         * @param item
         */
        $scope.getAward = function (item) {
            $scope.drAward = item.drAward;
            $scope.prizeType = item.type;
            $localStorage.drAwardMemberLog = $scope.drAwardMemberLog = item;
            if($scope.drAwardMemberLog) {
                $localStorage.prizeId = $scope.prizeId = item.id;
            }
            if($scope.prizeType == '1') {
                $scope.drAward.useCondition = '100';
            }

            if(item.status == 1) {
                $scope.closeDialog();
                ngDialog.open({
                    // template: '<div class="operateError" style="padding: 80px 55px; font-size: 15px;">该奖品已领取<div class="ngdialog-close" style="position: absolute; top:15px; right: 15px; cursor:pointer;"></div></div>',
                    template: '<div class="operateError" style="width: 300px;font-size: 22px;padding: 70px 55px;">该奖品已领取</div>',
                    showClose: true,
                    closeByDocument: true,
                    plain: true
                });
            } else {
                $scope.closeDialog();
                $filter('砸蛋第一次获奖弹窗')($scope);
            }
        };
        /**
         * 锤子移动效果
         * @param item
         */
        $scope.chuiMove = function (item) {
            $scope.currPos = item.pos;
        };
        // 数字翻页效果
        $scope.numScroll = function (value) {
            var num = $("#number");
            num.animate({count: value}, {
                duration: 600,
                step: function () {
                    num.text(String(parseInt(this.count)));
                }
            });
        };
        $scope.numScroll($scope.peopleNum);

        // 砸蛋渠道用户激活奖励弹窗
        $scope.channelUser = function () {
            $scope.closeDialog();
            if ($localStorage.isChannelUser) {
                // 若投资过定期标
                if ($localStorage.IsInvested) {
                    $scope.closeDialog();
                    $state.go('main.bankBillList');
                } else {
                    $filter('砸蛋渠道用户激活奖励弹窗')($scope);
                }
            } else {
                $scope.closeDialog();
                $state.go('main.bankBillList');
            }
        };

        // 继续砸蛋
        $scope.continueSmash = function () {
            $scope.closeDialog();
        };

        $scope.showREG = true;
        $scope.eggRegister = function () {
            $scope.showREG = false;
        };

        $scope.eggLogin = function () {
            $scope.showREG = true;
        };
        $scope.closeDialog = function () {
            ngDialog.closeAll();
        };

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
                    break;
            }
        };



        $scope.LoginClick = function (clickName, tegForm) {
            if (isZhuCeSubmin) {
                isZhuCeSubmin = false;
                $scope.login.isCheckPic = false;
                resourceService.queryPost($scope, $filter('交互接口对照表')('立即注册'), $scope.login, {
                    name: '注册',
                    tegForm: tegForm,
                });
            }
        };

        // $scope.LoginClick = function (clickName, tegForm) {
        //     if (isZhuCeSubmin) {
        //         isZhuCeSubmin = false;
        //         resourceService.queryPost($scope, $filter('交互接口对照表')('立即注册'), $scope.login, {
        //             name: '注册',
        //             tegForm: tegForm
        //         });
        //     }
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

        $scope.getPrize = function () {
            $filter('领取砸蛋奖品')($scope);
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
                            $filter('60秒倒计时')($scope, 60);
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
                        } else {
                            $state.go('main.financeSuccess', {num: data.map.regSendCount});
                        }
                        $scope.closeDialog();
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
            }
        });

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '已参加砸蛋人员':
                    if (data.success) {
                        $scope.peopleNum = data.map.size;
                        $scope.peoples = data.map.list;
                        if ($scope.peopleNum > 5) {
                            var $newList = $('.currentNums table');
                            setInterval(function () {
                                $newList.animate({'margin-top': '-36px'}, 500, function () {
                                    $newList.find('tr').eq(0).appendTo($newList);
                                    $newList.css('margin-top', 0);
                                });
                            }, 3000);
                        }
                    }
                    break;
                case '砸金蛋':
                    resourceService.queryPost($rootScope, $filter('交互接口对照表')('砸蛋记录'), {}, '砸蛋记录');
                    if(data.success) {
                        $scope.smashEggStatus = true;
                        if ($scope.remainCount == 2) {
                            $filter('砸蛋第一次获奖弹窗')($scope);
                        }
                        $localStorage.drAwardMemberLog = $scope.drAwardMemberLog = data.map.drAwardMemberLog;
                        $scope.drAward = $scope.drAwardMemberLog.drAward;
                        $localStorage.prizeId = $scope.prizeId = $scope.drAwardMemberLog.id;
                        // type为1 时，奖品为加息券
                        //$scope.type = $scope.drAwardMemberLog.type;
                        // if($scope.remainCount == 1) {
                        // if( $scope.type == 1 ) {
                        //     $scope.obj.find('.game-over').css('display', 'none').removeClass('show');
                        //     $scope.obj.find('.jxq').css('display', 'block').addClass('show');
                        // } else {
                        //     $scope.obj.find('.p2-egg .game-over:not(.jxq)').addClass('show').css('display', 'block');
                        //     $scope.obj.find('.p2-egg .game-over.jxq').removeClass('show').css('display', 'none');
                        // }
                        // } else {
                        //     $scope.obj.find('.jxq').removeClass('show').css('display', 'none');
                        // }
                    } else {
                        $scope.smashEggStatus = false;
                        // $scope.obj.find('.p2-egg .normal').addClass('show');
                        // $scope.obj.find('.p2-egg .game-over').removeClass('show').hide();
                        if ($scope.remainCount == 2) {
                            if ($scope.hasShared == true) {
                                $scope.closeDialog();
                            } else {
                                $filter('砸蛋二维码弹窗')($scope);
                                resourceService.queryPost($rootScope, $filter('交互接口对照表')('砸蛋分享'), {source: 1}, '砸蛋分享');
                            }
                        } else if($scope.remainCount == 1) {
                            // $scope.obj.find('.p2-egg .normal').addClass('show');
                            // $scope.obj.find('.p2-egg .game-over').removeClass('show').hide();
                            if ($scope.hasShared == true) {
                                $scope.closeDialog();
                                $filter('砸蛋第三次获奖弹窗')($scope);
                            } else {
                                $filter('砸蛋二维码弹窗')($scope);
                                resourceService.queryPost($rootScope, $filter('交互接口对照表')('砸蛋分享'), {source: 1}, '砸蛋分享');
                            }
                        }
                    }
                    break;
                case '砸蛋记录':
                    if (data.success) {
                        data = data.map;
                        $scope.lotteryCount = data.lotteryCount;
                        $scope.IsInvested = data.IsInvested;
                        $scope.hasShared = data.hasShared;
                        $scope.lotteryRecord = [
                            {isDroped: false,pos:0,drAward:{picUrl:"/images/smashEgg/egg.png"}},
                            {isDroped: false,pos:1,drAward:{picUrl:"/images/smashEgg/egg.png"}},
                            {isDroped: false,pos:2,drAward:{picUrl:"/images/smashEgg/egg.png"}}
                        ];
                        angular.forEach(data.lotteryRecord,function(item){
                            $scope.lotteryRecord[item.pos] = item;
                            $scope.lotteryRecord[item.pos].isDroped = true;
                            if(item.type == '1') {
                                $scope.lotteryRecord[item.pos].drAward.picUrl = '/images/smashEgg/pro/jxq.png';
                            }
                        });
                        // 投资过定期标为true，否则为false
                        $localStorage.IsInvested = $scope.IsInvested;
                        $scope.remainCount = 3 - data.lotteryRecord.length;
                    }
                    break;
                case '砸蛋分享':
                    // if (data.success) {
                    //     $scope.closeDialog();
                    //     if($scope.remainCount == 1 && data.map.hasGivenLotteryOpp == false) {
                    //         $filter('砸蛋第三次获奖弹窗')($scope);
                    //     }
                    // }
                    resourceService.queryPost($rootScope, $filter('交互接口对照表')('砸蛋记录'), {}, '砸蛋记录');
                    break;
            }
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

        // 监听退出是否成功
        $rootScope.$on('exitSuccess', function (event, flag) {
            if (flag) {
                $scope.isLogin = false;
            }
        });

        $scope.accountUserOut = function (event) {
            $filter('清空缓存')();
            resourceService.queryPost($scope, $filter('交互接口对照表')('退出接口'), {}, '退出');
            delete $localStorage.drAwardMemberLog;
            $rootScope.$emit('exitSuccess', true);
            $scope.isLogin = false;
        };

        if ($location.$$path == '/main/financeSuccess') {
            $scope.regSendCount = $location.$$search.num;
        }
    }
])
