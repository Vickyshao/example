'use strict';

routerApp
/*开发环境*/
    .filter('isOnLine', function () {
        return function () {
            var isOnLine = true;//fasle=静态调试；true=开发模式
            return isOnLine;
        }
    })
    /*清空缓存*/
    .filter('清空缓存', function ($localStorage) {
        return function () {
            if ($localStorage.pathUrl != undefined && $localStorage.pathUrl != 'main.home') {
                delete $localStorage.pathUrl;
            }
            delete $localStorage.user;
            if ($localStorage.promoteIsPayment != undefined) {
                delete $localStorage.promoteIsPayment;
            }
            if ($localStorage.showXiaoBiao != undefined) {
                delete $localStorage.showXiaoBiao;
            }
        }
    })
    /*开发环境*/
    .filter('isLinWidth', function () {
        return function (width) {
            // return 'width:'+width+'%';
            return 'WIDTH:50%';
        }
    })

    /*当前登录状态*/
    .filter('isRegister', function ($localStorage, $filter) {
        return function (name) {
            var obj = {};
            obj.register = false;
            obj.user = {};
            if ($localStorage.user != undefined) {
                obj.register = true;
                if ($localStorage.user.realName == '' || $localStorage.user.realName == undefined || $localStorage.user.realName == null) {
                    $localStorage.user.userName = '亲爱的用户';
                } else {
                    $localStorage.user.userName = $localStorage.user.realName;
                }
                obj.user = $localStorage.user;
            } else {
                obj.register = false;
                obj.user.userName = '亲爱的用户';
            }
            return obj;
        }
    })

    /*判断login头部*/
    .filter('isLoginPage', function ($rootScope) {
        return function (name) {
            if ($rootScope.title == "login") {
                return true;
            } else {
                return false;
            }
        }
    })

    /*根据用户状态提示跳转页面方向*/
    .filter('提示跳转', function (ngDialog) {
        return function (templateurl, scope) {
            ngDialog.open({
                template: templateurl,
                scope: scope,
                closeByDocument: true,
                plain: false
            });
            // return  dialog;
        };
    })

    /*电商拉新投资弹窗*/
    .filter('电商拉新投资弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/ecommer-invest-dialog.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                className: 'invest-dialog-wrapper ngdialog-theme-default'
            });
        };
    })

    /*投资确认弹窗*/
    .filter('投资确认弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/invest-dialog.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                className: 'invest-dialog-wrapper ngdialog-theme-default'
            });
        };
    })

    .filter('投即送投资成功弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/investgift-dialog.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                className: 'invest-dialog-wrapper ngdialog-theme-default'
            });
        };
    })

    /*投资确认弹窗*/
    .filter('弹窗', function (ngDialog) {
        return function (scope, tpl) {
            ngDialog.open({
                template: tpl,
                scope: scope,
                closeByDocument: true,
                plain: false
            });
        };
    })

    /*广告弹窗*/
    .filter('广告弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '<a target="_blank" href="' + scope.popList.location + '" ng-click="closeAD()"><div style="width:840px;height:460px;"><img style="width:100%;height:100%;" src="' + scope.popList.imgUrl + '"><div></a>',
                scope: scope,
                closeByDocument: false,
                plain: true,
                animation: {
                    width: "100px",
                    height: "200px",
                    right: 0,
                    bottom: 0,
                    'margin-right': 0,
                    'margin-bottom': 0
                },
                className: 'ad-dialog-wrapper ngdialog-theme-default'
            });
            scope.$on('ngDialog.closing', function (e, $dialog) {
                $dialog.find('.ngdialog-overlay').fadeOut(200);
                $dialog.find('.donghua').animate({
                    width: "100px",
                    height: "200px",
                    right: 0,
                    bottom: 0,
                    'margin-right': 0,
                    'margin-bottom': 0
                }, 1000, function () {
                    $dialog.find('.donghua').fadeOut(200);
                })
            });
            // ngDialog.setPadding='0';
            scope.closeAD = function () {
                ngDialog.closeAll();
            };
        };
    })

    /*充值提现弹窗*/
    .filter('充值提现弹窗', function (ngDialog, $state, $localStorage) {//../js/ng/dialog/success-dialog.html
        return function (scope) {
            scope.status = $localStorage.dialogStatus;
            scope.type = $localStorage.dialogType;
            scope.msg = $localStorage.dialogMsg;
            switch (scope.status) {
                case 'success':
                    scope.text = '成功';
                    break;
                case 'ing':
                    scope.text = '处理中';
                    break;
                case 'error':
                    scope.text = '失败';
                    break;
            }
            if (scope.type === '充值' && scope.status == 'success') {
                scope.showLittleTip = true;
            } else {
                scope.showLittleTip = false;
            }
            scope.closeDialog = function (bool) {
                ngDialog.closeAll();
                if (!bool) {
                    if (scope.type === '充值') {
                        if (scope.status == 'success' || scope.status == 'ing') {
                            $state.go('main.myAccount.recharge', null, {
                                reload: true
                            });
                        } else if (scope.status == 'error') {
                            if (scope.recharge.errorCode != '1003') {
                                $state.go('main.myAccount.recharge', null, {
                                    reload: true
                                });
                            }
                        }
                        scope.isSubmit = false;
                    } else if (scope.type === '提现') {
                        $state.go('main.myAccount.Withdraw', null, {
                            reload: true
                        });
                    }
                }
            };
            ngDialog.open({
                template: '../js/ng/dialog/success-dialog.html',
                scope: scope,
                closeByDocument: false,
                // plain : true,
                showClose: false
            });
            // return  dialog;
        };
    })
    /*充值弹窗*/
    .filter('充值弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/recharge-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false
            });
            // return  dialog;
        };
    })
    /*充值弹窗*/

    //  登录弹窗
    .filter('登录弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/login-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false
            });
        };
    })

    //  sem2注册弹窗
    .filter('sem2注册弹窗', function (ngDialog) {
        return function (scope) {
            console.log(scope);
            ngDialog.open({
                template: '../js/ng/dialog/sem2-zhuce.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false
            });
        };
    })

    //  砸蛋登录注册弹窗
    .filter('砸蛋登录注册弹窗', function (ngDialog) {
        return function (scope) {
            console.log(scope);
            ngDialog.open({
                template: '../js/ng/dialog/egg-loginReg-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false
            });
        };
    })

    //砸蛋第一次获奖弹窗
    .filter('砸蛋第一次获奖弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/eggFirstPrize.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false
            });
        };
    })

    //砸蛋二维码弹窗
    .filter('砸蛋二维码弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/egg-code-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false
            });
        };
    })

    //砸蛋第三次获奖弹窗
    .filter('砸蛋第三次获奖弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/eggThirdPrize.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false
            });
        };
    })

    //领取砸蛋奖品
    .filter('领取砸蛋奖品', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/getEggPrize.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false
            });
        };
    })

    .filter('砸蛋奖励激活条件不足弹窗', function (ngDialog, $state, $localStorage) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/eggActivationCondition.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false
            });
        };
    })

    //砸蛋渠道用户激活奖励弹窗
    .filter('砸蛋渠道用户激活奖励弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/judgeChanelUser.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false
            });
        };
    })

    //  倒计时弹窗
    .filter('倒计时弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/countdown-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false
            });
        };
    })

    //  幸运码弹窗
    .filter('幸运码弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/special-code-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false
            });
        };
    })

    .filter('图片放大弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/bigimg-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false
            });
            // return  dialog;
        };
    })

    .filter('砸金蛋弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/egg-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'egg-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
        };
    })

    .filter('计算器弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/calculator-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'cal-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
        };
    })
    .filter('奖金弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/pop-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'pop-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
        };
    })
    .filter('微信二维码弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/code-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'pop-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
        };
    })

    .filter('红包弹窗', function (ngDialog, $state) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/redbag-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'redbag-dialog-wrapper ngdialog-theme-default'
            });
            scope.promoteGoCoupon = function () {
                ngDialog.closeAll();
                $state.go('main.myAccount.myCoupon');
            }
            scope.promoteCloseDialog = function () {
                ngDialog.closeAll();
            };
        };
    })

    .filter('注册红包弹窗', function (ngDialog, $state) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/zcRedbag-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'redbag-dialog-wrapper ngdialog-theme-default'
            });
            scope.goCoupon = function () {
                ngDialog.closeAll();
                $state.go('main.myAccount.myCoupon');
            }
            scope.closeDialog = function () {
                ngDialog.closeAll();
            };
        };
    })

    .filter('促复投红包弹窗', function (ngDialog, $state) {
        return function (scope, type) {
            ngDialog.open({
                template: '../js/ng/dialog/promote-redbag-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'redbag-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
            scope.promoteGoCoupon = function () {
                ngDialog.closeAll();
                $state.go('main.myAccount.myCoupon');
            }
            scope.promoteCloseDialog = function (flag) {
                ngDialog.closeAll();
                if (flag) {
                    scope.showPromoteTear = true;
                } else {
                    scope.showPromoteTear = false;
                }
            };
            scope.showBagType = type;
        };
    })

    .filter('预定弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/book-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'book-dialog-wrapper ngdialog-theme-default'
            });
        };
    })

    .filter('投即送预约弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/investgift-book-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'invest-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
        };
    })

    .filter('投即送常见问题弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/investgift-question.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'invest-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });

        };
    })

    .filter('新手标弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/newhand-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'newhand-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
        };
    })
    .filter('圣诞节弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/christmas-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'christmas-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
            scope.closeDialog = function () {
                ngDialog.closeAll();
            };
        };
    })

    .filter('体验金认证弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/finance-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'christmas-dialog-wrapper ngdialog-theme-default'
            });
            scope.closeDialog = function (type) {
                ngDialog.closeAll();
                if (type != undefined) {
                    $localStorage.activeText = {name: '我的福利', url: 'main.myAccount.' + type};
                }
            };
        };
    })

    .filter('交易密码设置成功', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/setPwd-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'christmas-dialog-wrapper ngdialog-theme-default'
            });
        };
    })


    .filter('体验金投资弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/financeInvest-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'christmas-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
            scope.closeDialog = function () {
                ngDialog.closeAll();
            };
        };
    })

    .filter('元宵弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/lantern-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'christmas-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
            scope.closeDialog = function () {
                ngDialog.closeAll();
            };
        };
    })

    .filter('元宵未获奖弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/lantern-dialogno.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'christmas-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
            scope.closeDialog = function () {
                ngDialog.closeAll();
            };
        };
    })

    .filter('意见弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/msg-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'christmas-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
            scope.closeDialog = function () {
                ngDialog.closeAll();
            };
        };
    })

    .filter('银行卡选择弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/bank-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                className: 'christmas-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
            scope.closeDialog = function () {
                ngDialog.closeAll();
            };
        };
    })

    .filter('推广页登录注册弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/reglogin-dialog.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                className: 'registerlogin-dialog-wrapper christmas-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
            scope.closeDialog = function () {
                ngDialog.closeAll();
            };
        };
    })

    .filter('推广页注册弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/reg-dialog.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                className: 'registerlogin-dialog-wrapper christmas-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
            // scope.closeDialog = function() {
            //     ngDialog.closeAll();
            // };
        };
    })

    .filter('推广页不注册弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/regnoget-dialog.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                className: 'registerlogin-dialog-wrapper christmas-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
            scope.closeDialog = function () {
                ngDialog.closeAll();
            };
        };
    })

    .filter('不要体验金弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/goldnoact-dialog.html',
                scope: scope,
                // closeByDocument : true,
                plain: false,
                className: 'registerlogin-dialog-wrapper christmas-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
            scope.closeDialog = function () {
                ngDialog.closeAll();
            };
            scope.goGoldACT = function () {
                ngDialog.closeAll();
                scope.goldACT = true;
                scope.product.nowNum = 5000;
            };

        };
    })

    .filter('有红包未使用', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/redpacketNotused-dialog.html',
                scope: scope,
                // closeByDocument : true,
                plain: false,
                className: 'registerlogin-dialog-wrapper christmas-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
            scope.closeDialog = function () {
                ngDialog.closeAll();
            };
            scope.goGoldACT = function () {
                ngDialog.closeAll();
                scope.goldACT = true;
                scope.product.nowNum = 5000;
            };

        };
    })

    .filter('开通存管账户弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/storage-dialog.html',
                scope: scope,
                plain: false,
                closeByDocument: false,
                className: 'christmas-dialog-wrapper ngdialog-theme-default',
                showClose: false
            });
            scope.closeDialog = function () {
                ngDialog.closeAll();
            };
        };
    })

    /**
     当点击投资时要判断当前用登录状态并决定页面跳转到哪里
     */
    .filter('clickTouZiGotoWhere', function ($localStorage, $filter, communicationService, $state) {

        return function (scope, myUrl) {
            var url;
            scope.msg = {};
            if ($filter('isRegister')().register) {//如果已登录
                url = myUrl;
            } else {//未登录
                communicationService.setTagPage('denLu', 'main.home');
                url = 'main.loginPage';
            }
            ;
            $state.go(url);
        }
    })

    /*跳转去登录*/
    .filter('跳转页面', function ($rootScope, communicationService, $state, $localStorage) {
        /*
            type:登录或注册状态,
            path:出自,
            url：要去,
            item：产品信息,
            pathMenu,按钮名
            activeText：按钮选择的状态name:上级按钮名url:子集按钮路径
        */
        return function (type, path, url, item, pathMenu, activeText) {

            if (item != undefined && item != '' ) {
                $localStorage.product = item;
                communicationService.setProduct(item);
            }
            ;
            $localStorage.pathObj = [{pathName: '首页', url: '/mainhome'}];
            if (pathMenu != undefined || pathMenu != null) {
                $localStorage.pathObj.push(pathMenu);
            }
            $localStorage.pathUrl = path;

            // 跳转到我的账户里边左边栏显示
            if (activeText == undefined) {
                $localStorage.activeText = {name: '我的账户', url: 'main.myAccount.accountHome'};
            } else {
                $rootScope.$broadcast('myEvent.WHDR_Ctrl', {
                    type: type,
                    path: path,
                    url: url,
                    item: item,
                    pathMenu: pathMenu,
                    activeText: activeText
                });
                $localStorage.activeText = activeText;
            }
            communicationService.setTagPage(type, path);
            if (item != undefined) {
                $state.go(url, item.id);
            } else {
                $state.go(url);
            }
            ;
        }
    })
    /*跳回上一页*/
    .filter('跳回上一页', function ($localStorage, $state) {

        return function (type, path) {

            if ($localStorage.pathUrl != undefined && $localStorage.pathUrl != '') {
                if ($localStorage.product != undefined) {
                    $state.go($localStorage.pathUrl, {id: $localStorage.product.id});
                } else {
                    $state.go($localStorage.pathUrl);
                }
                // delete $localStorage.pathUrl;
            } else {
                $state.go('main.home');
            }
        }
    })

    //登录注册弹窗
    .filter('登录注册弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/loginReg-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false,
            });
            //showREG  true为登录，showREG  false为注册
            scope.fromCommonDl = true;
            scope.toLogin = function () {
                scope.showREG = true;
            };
            scope.toRegister = function () {
                scope.showREG = false;
            };
            scope.closeDialog = function () {
                ngDialog.closeAll();
            };
        };
    })

    //投资领取抽奖码
    .filter('投资领取抽奖码', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/luckyDraw/toInvestGet-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false,
            });
        };
    })

    //预约商品
    .filter('预约商品', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/orderPro-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false,
            });
        };
    })

    //感谢您的预约
    .filter('感谢您的预约', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/luckyDraw/thxForOrder-dialog.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false,
            });
        };
    })

    //首页播放视频
    .filter('首页播放视频', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/video-dialog.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                showClose: false,
            });
        };
    })

    // 余额不足弹窗
    .filter('余额不足弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/investProcess/balance-notEnough.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                showClose: false,
            });
        };
    })

    // 产品被抢光弹窗
    .filter('产品被抢光弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/investProcess/productOut.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                showClose: false,
            });
            scope.closeDialog = function(bool) {
                ngDialog.closeAll();
            };
        };
    })

    // 组队活动恭喜成为队长
    .filter('恭喜成为队长', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/zudui-captain.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                showClose: false,
            });
            scope.closeDialog = function(bool) {
                ngDialog.closeAll();
            };
        };
    })

    // 庆A轮融资弹窗
    .filter('庆A轮融资弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/a-finance.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                showClose: false,
            });
            scope.closeDialog = function(bool) {
                ngDialog.closeAll();
            };
        };
    })

    // 春节活动奖品弹窗
    .filter('春节活动奖品弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/chunjie/chunjiePrize.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false
            });
        };
    })

    // 春节年化收益计算器弹窗
    .filter('春节年化收益计算器弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/chunjie/chunjieincomeCalc.html',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false
            });
        };
    })

    // beginSem页面奖励条件弹窗
    .filter('奖励条件弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/awardCondition.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                showClose: false,
            });
            scope.closeDialog = function(bool) {
                ngDialog.closeAll();
            };
        };
    })

    // 首页风险评测提示弹窗
    .filter('风险评测首页提示弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/risk-assess-tip.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                showClose: false,
            });
            scope.closeDialog = function(bool) {
                ngDialog.closeAll();
            };
        };
    })

    // 风险评测未完成弹窗
    .filter('风险评测未完成弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/risk-assess-undo.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                showClose: false,
                preserveFocus:false,
            });
            scope.closeDialog = function(bool) {
                ngDialog.closeAll();
            };
        };
    })

    // 风险评测结果提示弹窗
    .filter('风险评测结果弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/risk-assess-result.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                showClose: false,
            });
            scope.closeDialog = function(bool) {
                ngDialog.closeAll();
            };
        };
    })

    // 风险评测重新评测弹窗（我的账户页面）
    .filter('风险评测重新测评弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/risk-assess-again.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                showClose: false,
            });
            scope.closeDialog = function(bool) {
                ngDialog.closeAll();
            };
        };
    })

    // 投资时超出风险评估结果提示
    .filter('超出风险评测提示弹窗', function (ngDialog) {
        return function (scope) {
            ngDialog.open({
                template: '../js/ng/dialog/risk-assess-result-tip.html',
                scope: scope,
                closeByDocument: true,
                plain: false,
                showClose: false,
            });
            scope.closeDialog = function(bool) {
                ngDialog.closeAll();
            };
        };
    })

    /* 数字转为两位小数 */
    .filter('changeTwoDecimal', function () {
        return function (x) {
            var f_x = parseFloat(x);
            if (isNaN(f_x)) {
                return;
            }
            var f_x = Math.round(x * 100) / 100;
            var s_x = f_x.toString();
            var pos_decimal = s_x.indexOf('.');
            if (pos_decimal < 0) {
                pos_decimal = s_x.length;
                s_x += '.';
            }
            while (s_x.length <= pos_decimal + 2) {
                s_x += '0';
            }
            if (s_x == '0.00') {
                return '';
            }
            return s_x;
        }
    })

    // 数字向下取整
    .filter('numFloor', function () {
        return function (num) {
            return Math.floor(num);
        }
    })

    /*跳回上一页*/
    .filter('60秒倒计时', function ($timeout) {

        return function (scope, timeNum) {
            scope.nowTimer = '';
            var timer;
            var nowTimer = timeNum;
            if (scope.isSubMin) {
                setTimerOut();
            }

            function setTimerOut() {
                timer = $timeout(
                    function () {
                        if (nowTimer <= 0) {
                            scope.nowTimer = '';
                            scope.disabledPhoneBtn = false;
                            scope.isSubMin = true;
                            scope.isGetVoice = false;
                            scope.isGetCode = false;
                            scope.bool = true;
                            // if ($('.img-box img')[0] != undefined) {
                            //     $('.img-box img')[0].src += '?' + new Date().getTime();
                            // }
                            if (scope.changeIMGCode != undefined) {
                                scope.changeIMGCode();
                            }
                        } else {
                            if (scope.isvoice) {
                                scope.isSubMin = false;
                            }
                            nowTimer -= 1;
                            scope.nowTimer = nowTimer + 's';
                            setTimerOut();
                        }
                    },
                    1000
                );
            };
            scope.stop = function () {
                nowTimer = 0;
                scope.isGetVoice = false;
                scope.bool = false;
            };
        }
    })
    /*倒计时*/
    .filter('倒计时', function ($timeout) {
        return function (scope, timeNum) {
            scope.nowTimer = '';
            var timer;
            var isError = false;
            var nowTimer = timeNum;
            if (scope.isSubMin) {
                setTimerOut();
            }

            function setTimerOut() {
                // scope.isSubMin=false;
                timer = $timeout(
                    function () {
                        if (nowTimer <= 0) {
                            scope.nowTimer = '重发';
                            scope.isGetCode = false;
                            scope.isSubMin = true;

                        } else {
                            scope.isSubMin = false;
                            nowTimer -= 1;
                            scope.nowTimer = nowTimer + '秒 ';
                            setTimerOut();
                        }
                    }, 1000);
            };
            scope.stop = function () {
                nowTimer = 0;
                isError = true;
                if (timer) {
                    timer = null;
                }
            };
        }
    })
    /*跳回上一页　　　*/
    .filter('300秒倒计时', function ($timeout) {

        return function (scope, timeNum, isOverBool) {
            scope.nowTimer = '';
            var timer;
            var nowTimer = timeNum;
            // var isOverBool=true;
            if (isOverBool) {
                setTimerOut();
            }

            function setTimerOut() {
                timer = $timeout(
                    function () {
                        if (isOverBool) {
                            if (nowTimer <= 0) {
                                scope.nowTimer = '短信验证失效';
                                scope.isDisabledPhoneMsg = true;
                                scope.disabledPhoneBtn = true;
                                if (scope.changeIMGCode != undefined) {
                                    scope.changeIMGCode();
                                }
                                ;

                            } else {
                                nowTimer -= 1;
                                setTimerOut();
                            }
                        }
                    },
                    1000
                );
            };
            scope.stopmsmTimerout = function () {
                isOverBool = false;
            };
        }
    })

    /*跳回上一页*/
    .filter('6秒倒计时自动跳转', function ($timeout, $filter) {

        return function (scope, timeNum) {
            scope.nowTimerGoto = '';
            var nowTimer = timeNum;
            setTimerOut();
            var isBool = true;
            scope.stopTimerout = function () {
                isBool = false;
            };

            function setTimerOut() {
                var timer = $timeout(
                    function () {
                        if (nowTimer <= 0) {
                            if (isBool) {
                                $filter('跳转页面')('', 'main.home', 'main.home');
                            }
                        } else {
                            nowTimer -= 1;
                            scope.nowTimerGoto = nowTimer + 's ';
                            setTimerOut();
                        }
                    },
                    1000
                );
            };
        }
    })

    /*路由状态*/
    .filter('isLogin', function ($rootScope, $location, communicationService) {

        return function (scope) {
            switch ($location.$$url) {
                case "/mainloginPage":
                    if (communicationService.getTagPage().url == undefined) {
                        communicationService.setTagPage('denLu', 'main.home');
                    }
                    ;
                    $rootScope.title = "沪深理财欢迎您！";
                    $rootScope.isLoginPage = true;
                    break;
                case "/mainresetPasswd":
                    $rootScope.title = "修改密码";
                    $rootScope.isLoginPage = true;
                    break;
                case "/maintradepasswdSet":
                    $rootScope.title = "实名认证";
                    $rootScope.isLoginPage = true;
                    break;
                case "/mainbankBillList":
                    scope.path = [{pathName: '首页', url: '/mainhome'}, {pathName: '优选投资', url: '/mainbankBillList'}];
                    $rootScope.title = "沪深-优选投资";
                    $rootScope.isLoginPage = false;
                    break;
                case "/mainYbankBillList":
                    scope.path = [{pathName: '首页', url: '/mainhome'}, {pathName: '票据优选', url: '/mainYbankBillList'}];
                    $rootScope.title = "沪深-优选投资";
                    $rootScope.isLoginPage = false;
                    break;
                case "/mainbillDetail":
                    scope.path = [{pathName: '首页', url: '/mainhome'}, {pathName: '票据优选', url: '/mainYbankBillList'}];
                    $rootScope.title = "沪深-投资详情";
                    $rootScope.isLoginPage = false;
                    break;
                case "/mainmyAccountaccountHome":
                    $rootScope.title = "沪深-我的资产";
                    $rootScope.isLoginPage = false;
                    break;
                default :
                    $rootScope.isLoginPage = false;
                    break;
            }
        }
    })

    /*接口对照表*/
    .filter('交互接口对照表-', function () {

        return function (name) {
            var portUrlMap = {
                '登录接口': "/login/doLogin",

                /*登录注册*/
                '修改用户手机验证': '/login/forgetPwdSmsCode.do',

                /*首页Home*/
                'Home主数据': 'data/TEST/testHomeDatas.json',
                '产品列表': 'data/TEST/testBillListDatas.json',
                '注册成交人数': 'data/TEST/testUpdate.json',
                '常见问题': 'data/helps.json',
                '公司新闻': 'data/news.json',
                /*票据优选*/
                '票据安选列表': 'data/TEST/testBillListDatas.json',
                /*产品详情页*/
                '票据详情投资记录': 'data/TEST/testInvestListDatas.json',
                '票据详情账户信息': 'data/TEST/testBillAccountDatas.json',

                /*我的资产首页*/
                '我的资产首页数据': 'data/TEST/myAccunt.json',

                /*实名认证*/

                'test': 'product/listAx',

                /* 身份认证 */
                '身份认证': '',

                /* 安全认证 */
                '安全认证数据': 'data/TEST/testSecurity.json',
                '安全认证实名认证表单提交': '',
                '安全认证原始密码验证': ''
            };

            return portUrlMap[name];
        }
    })
    /*接口对照表*/
    .filter('交互接口对照表', function () {

        return function (name) {
            var portUrlMap = {
                '登录接口': "doLogin",
                '退出接口': "exit",

                /*登录注册*/
                '注册验证手机号': 'existMobilePhone',
                '校验图片验证码': 'sendRegMsg',
                '立即注册': 'reg',
                '修改用户密码-手机验证': 'forgetPwdSmsCode',
                '修改用户密码-提交手机验证': 'validateSmsCode',
                '修改用户密码-提交密码': '/login/updatePwd.do',

                /*首页Home*/
                'Home主数据': 'indexMemberInfo',
                '产品列表': 'indexProduct',
                'banner': 'banner',
                '公司新闻': 'indexArticle',
                '投资统计数据': 'regAndInvestCount',
                '实时投资记录': 'indexInvestLogs',
                '首页视频': 'video',
                '首页icon': '/activity/isInDoubleEggActivity.do',

                /*票据优选*/
                '票据优选列表': 'productList',

                /*票据安选*/
                '票据列表': 'productList',

                /*产品详情页*/
                '票据详情': 'detail',
                '确认投资': 'invest',
                '投资记录': 'depositsHistory',


                /*我的资产首页*/
                '我的资产首页数据': 'info',
                '我的投资': 'investStat',
                '我的投资明细': '/investCenter/repayInfoDetail.do',
                '我的投资-收益中的产品': '/investCenter/productList.do',
                // '我的投资-已到期产品' :'expireProductList',
                '我的投资-资产记录': 'assetRecord',


                /*实名认证*/
                'test': 'listAx',

                /* 身份认证 */
                '身份认证': 'bankInfoVerify',
                '身份认证获取短信验证码': 'sendBankMsg',

                /* 安全认证 */
                '安全认证数据': 'memberSetting',
                '安全认证修改登录密码': 'updateLoginPassWord',

                /* 设置交易密码 */
                '设置交易密码': 'setTpwd',

                /* 修改交易密码 */
                '修改交易密码': 'updateTpwd',

                /* 找回交易密码获取短信验证码 */
                '找回交易密码获取短信验证码': '/memberSetting/sendForgetTpwdCode.do',

                /* 找回交易密码验证短信验证码 */
                '找回交易密码验证短信验证码': '/memberSetting/validateTpwdCode.do',

                /* 找回交易密码设置新交易密码 */
                '找回交易密码设置新交易密码': '/memberSetting/updateTpwdBySms.do',

                /* 充值提现数据 */
                '充值数据': 'recharge',
                '提现数据': 'withdrawals',

                /* 充值 */
                '创建订单': 'createPayOrder',
                '充值': 'goPay',
                '充值获取验证码': 'sendRechargeSms',
                '网银充值': 'goJYTWYPay',
                '充值成功数据': 'rechargeSuccess',

                /* 提现 */
                '提现': 'addWithdrawals',

                /* 我的消息 */
                '我的消息': 'myMessage',
                '消息列表': 'getMessage',
                '标记消息为已读': 'updateUnReadMsg',

                /* 个人中心 */
                '个人中心': 'personInfo',

                /* 优惠券 */
                '用户可用优惠券': 'usable',
                '我的优惠券': 'activity',

                /* 我的好友 */
                '我的好友': 'myRecommend',

                /* 新闻列表 */
                '新闻列表': 'newsInformationList',
                '新闻详情': 'newsDetails',

                /* 权益转让及受让协议 */
                '权益转让及受让协议': 'agreement',
                /* 借款协议 */
                '借款协议': 'borrow',
                /* 债权转让协议 */
                '债权转让协议': 'transfer',

                '好友互推列表': 'recommend/myFriendInvest.do',
                'selectInvest': 'product/selectInvest.do',

                // 我的幸运码
                '我的幸运码': 'product/getMyLuckCodes.do',
                // 财胜标详情
                '活动标详情': 'product/getNewActivityProduct.do',
                // 活动开奖结果
                '活动开奖结果': 'activity/getActivityPrizeResult.do',

                '砸金蛋加息券': 'activity/getRandomCouponByProductId.do',

                // 好友邀请
                '查询邀请活动信息': 'activity/getActivityFriendConfig.do',
                '获取邀请手机号': 'activity/getMobilePhoneByRecommCode.do',
                '邀请好友统计': 'activity/getActivityFriendStatistics.do',
                '邀请活动列表': 'activity/getActivityFriendConfigAll.do',
                '领取奖金': 'assetRecord/getTheRewards.do',

                '获取首页广告': 'index/advertisement.do',

                '获取复投红包': 'member/getPromoteRedelivery.do',
                '获取注册红包': 'member/getMemberFavourable.do',
                '获取变现产品': 'member/getUse.do',
                '拆红包': 'member/getOpenRed.do',

                '预约下期': 'product/getReservation.do',

                '我的好友邀请': 'activity/myInvitation.do',

                '新手标领取现金': 'product/getContinueReward.do',
                '新手标续投': 'product/addContinueReward.do',

                '圣诞节活动页数据': 'activity/doubleAggIndex.do',
                '圣诞节拆红包': 'activity/tearOpen.do',

                '投即送活动页数据': 'activity/investSendPrizeIndex.do',
                '查询产品绑定的奖品': 'activity/selectProductPrize.do',
                '投即送获取收货地址': 'member/getReceiptAddress.do',
                '投即送投资记录': 'activity/accountInvestLogs.do',
                '投即送预约': 'activity/insertPrizeInfo.do',
                '投即送修改收货地址': 'member/updateReceiptAddress.do',
                '投即送添加收货地址': 'member/insertReceiptAddress.do',
                '活动聚合页列表': 'activity/getAllActivity.do',
                '投即送心愿提交': 'activity/wishCommit.do',
                '投即送获取默认地址': 'member/getReceiptAddress.do',

                '人脉王排行': 'activity/getTopTen.do',
                '长城宽带已登录数据': 'activity/getGreatWallInfo.do',
                '体验标详情': 'product/experienceDetail.do',
                '体验标投资': 'product/experienceInvest.do',
                '吃元宵': 'activity/eatGlutinous.do',
                '吃元宵领取记录': 'activity/getEatGlutinousLog.do',
                '意见反馈': 'system/feedback.do',
                '新手标排行榜': 'activity/getProductInvestList.do',
                '注册的用户': 'activity/lastRegMember.do',

                '认证支持银行列表': 'memberSetting/selectBank.do',

                '开放日活动页详情': 'activity/getOpenDayDetail.do',
                '开放日往期列表': 'activity/getOpenDayList.do',
                '开放日详情': 'activity/getOpenDayArticleDetail.do',
                '开放日报名': 'activity/SignUp.do',

                '公益活动列表': 'activity/offlineActivityList.do',
                '公益活动详情': 'activity/offlineActivityDetail.do',

                '三重礼首投复投': 'activity/firstInvestList.do',
                '三重礼排行榜': 'activity/getRankingList.do',

                '518活动信息': 'activity/activityMay18d.do',
                '活动页产品列表': 'product/getPorductList.do',

                'iPhoneSEM': 'activity/iPhoneSEM.do',
                'financeSEM': 'activity/lastRegMember.do',

                '存管信息': 'member/openAccountSignature.do',
                '存管快捷充值': 'recharge/depositsRecharge.do',
                '存管网银充值': 'recharge/onlineBankingRecharge.do',
                '存管提现': 'withdrawals/depositsWithdrawals.do',
                '存管账户信息': 'memberSetting/fuiouIndex.do',
                '修改存管交易密码': 'memberSetting/fuiouUpdatePwd.do',

                '活动页账户信息': 'activity/getMyAccount.do',

                '聚划算产品列表': 'product/getPeroidProList.do',
                '端午节活动': 'activity/dragonBoat.do',

                'end': 'end',
                'getPrizeInfoByProductId': 'activity/getPrizeInfoByProductId.do',
                'getMyPrizeRecords': 'activity/getMyPrizeRecords.do',

                //我的奖品
                'getJeCadeaux': 'activity/getJeCadeaux.do',

                //电商活动
                '我要报销': '/reimburse',
                '我要报销列表': '/reimburseList',
                '已报销账户': '/latestReim',
                '电商码': '/checkEccode',

                '沪深公益列表': '/allOfflineActivityList',
                '沪深公益详情': '/offlineActivityDetail',

                //砸蛋活动
                '已参加砸蛋人员': 'lotteryPeopleList',
                '砸蛋': 'lotteryEggs',
                '砸蛋信息': 'lotteryEggsInfo',
                // '当天首次投资':'/product/boolInvested.do',
                '砸金蛋': 'lotteryEggs',
                '砸蛋记录': 'lotteryEggsInfo',
                '砸蛋分享': 'addLotteryOpp',

                // 邀请好友
                '未登录邀请记录': 'historyWinnerInfos',
                '已登录邀请记录': 'inviteFriendList',

                //抽奖活动
                '获取抽奖活动的奖品信息': 'currentAward',
                '往期开奖': 'previousLottery',
                '抽奖最新动态': 'newAwarDynamic',
                '预约奖品列表': 'appointmentAwardList',
                '奖品预约': 'appointmentAward',
                '中奖记录': 'getMyPrizeRecords',

                //组队活动
                '排行榜': 'yxActivityOfTeam/rankList.do',
                '最新消息': 'yxActivityOfTeam/getNewMessage.do',
                '我的战队': 'yxActivityOfTeam/myTeam.do',
                '我的队员': 'yxActivityOfTeam/myTeamDetail.do',
                '首次成为队长': 'yxActivityOfTeam/indexCreateTeam.do',

                //活动中心
                '获取所有活动': 'activity/getAllActivity.do',

                //发布会视频
                '发布会视频': 'pcLiveUrl/windowsUrl.do',

                //春节活动
                '我的投资信息': 'myInfo',
                '奖品列表': 'awardList',
                '中奖纪录': 'winningRecord',
                '投资排行': 'investRanking',

                //风险评测
                '风险评测弹窗显示': 'questionnaire/evaluateStatus.do',
                '风险评测题目': 'questionnaire/subjectList.do',
                '风险评测提交': 'questionnaire/submitAnswer.do'
                

            };

            return portUrlMap[name];
        }
    })

    /*静态json*/
    .filter('静态接口对照表', function () {

        return function (name) {
            var portUrlMap = {
                '弹出框模板': "js/ng/dialog/msgGoLogin.html",
                /*帮助-常见问题*/
                '常见问题': "/data/helps.json",
                '存管问题': 'data/storage.json',
                '投资知识': "/data/lczs.json",
                'end': 'end'
            };

            return portUrlMap[name];
        }
    })
    .filter('特定时间消失弹窗', function (ngDialog) {
        return function (text,mills) {
        	ngDialog.open({
                template: '<p class="error-msg">' + text+ '</p>',
                showClose: false,
                className: 'chaoshi-dialog-wrap ngdialog-theme-default',
                closeByDocument: false,
                plain: true
            });
            setTimeout(function () {
                ngDialog.closeAll();
            }, mills);
        };
    })
