var routerApp = angular.module('someApp', [
    'ui.router'
    ,'loginModule'
    ,'ngDialog'
    ,'ngResource'
    ,'mainModule'
    ,'ui.bootstrap'
    ,'ngAnimate'
    ,'monospaced.qrcode'
    // ,'investListModule'
    ]);
routerApp.run(function($rootScope, $state, $stateParams,$location,$http,$templateCache,$filter,resourceService,$localStorage,ngDialog,$window){
        // console.log(BizQQWPA);
        // BizQQWPA.addCustom();
	
		/*if ($location.$$protocol == 'http') {
            var url = 'https'+ $location.$$absUrl.substring(4);
            $window.location.href = url;
        }*/

        $rootScope.$state = $state;
        $rootScope.webPath = '/';
        $rootScope.hrefUrl = '';
        $rootScope.v = 'v1.0.0';
        $rootScope.$stateParams = $stateParams;
        $rootScope.maskHidde = false;

        $rootScope.$on('LOGIN_DEL_X-REQU',function(){
            delete $http.defaults.headers.common['X-Requested-With'];
        });
        $rootScope.$on('LOGIN_OUT',function(event,url){
            if (!$localStorage.keepUser) {
                $localStorage.keepUser = {
                    phone: $localStorage.user.mobilephone
                };
            }
            delete $localStorage.user;
            $templateCache.remove(url);
            resourceService.queryPost($rootScope,$filter('交互接口对照表')('退出接口'),{},'退出');
            if($localStorage.pathUrl != undefined){
                var pth = $localStorage.pathUrl.replace('/','').replace('mainmyAccount', 'main.myAccount.')
            }else{
              $localStorage.pathUrl = pth = 'main.home';
            }
            if(pth.indexOf('main.myAccount')){
                $filter("跳转页面")('denLu',$localStorage.pathUrl,$localStorage.pathUrl);
            }else{
                $filter("跳转页面")('denLu',$localStorage.pathUrl,'dl');
            }
            
            $rootScope.maskHidde = false;
        });

        // 复投红包事件
        $rootScope.promoteGoToUse = function(item) {
            $rootScope.promoteRedBagFid = item.id;
            $localStorage.promoteEnableAmount = item.enableAmount;
            resourceService.queryPost($rootScope,$filter('交互接口对照表')('获取变现产品'),{fid: item.id},'获取变现产品');
        };

        $rootScope.scrollTop = function () {
            $(window).scrollTop(0);
            // $(window).animate({scrollTop: 0}, 300);
        };

        $rootScope.closeDialog = function() {
            ngDialog.closeAll();
        };

        $rootScope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch(type){
                case '获取变现产品':
                    if (data.success) {
                        ngDialog.closeAll();
                        if (data.map.pid) {
                            if (data.map.pid == -1) {
                                $state.go('main.bankBillList');
                            } else {
                                // $state.go('main.billDetail',{id:data.map.pid,redBagFid:$rootScope.promoteRedBagFid});
                                $state.go('main.bankBillList');
                            }
                        }
                    }
                break;
            };
        });
    })
routerApp.factory('httpInterceptor', [ '$q', '$injector','$rootScope','$filter',function($q, $injector,$rootScope,$filter) {  
    var httpInterceptor = {   
        'responseError' : function(response) {
            return $q.reject("response",response);
        },
        'response' : function(response){
            if(response.headers("sessionstatus")=="timeout" ){
            	$filter('特定时间消失弹窗')('登录信息已失效，请重新登录',2000);
                if(response.config.url  != "Login" && response.config.url !="user/toLogin"){
                    $rootScope.$emit("LOGIN_OUT",response.config.url);
                    return false;
                }
            }
            return response;
        },  
        'request' : function(config) {
            if(config.url != "Login" && config.url !="user/toLogin" && config.url !="/user/findWhiteCollarApartmentByUserName"){
                config.headers['X-Requested-With']="XMLHttpRequest";
            }
            return config;
        },  
        'requestError' : function(config){  
            return $q.reject(config); 
        }  
    };
return httpInterceptor;  
}]);
routerApp.config([ '$httpProvider','$stateProvider','$urlRouterProvider','$sceProvider','$locationProvider',function($httpProvider,$stateProvider, $urlRouterProvider,$sceProvider,$locationProvider){
    $httpProvider.interceptors.push('httpInterceptor');
    // $sceProvider.enabled(false);
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/main/home');//mainwelcome maintradepasswdSet
    var date = "?date=" + new Date().getTime();

    var sta='';
    $stateProvider
        .state('main', {
            url: '/main',
            templateUrl: sta + 'html/global.html'
        })
        .state('header', {
            url: '/header',
            templateUrl: sta + 'html/header.html'
        })
        .state('404', {
            url: '/404',
            templateUrl: sta + 'html/404.html'
        })
        .state('505', {
            url: '/505',
            templateUrl: sta + 'html/505.html'
        })
        .state('500', {
            url: '/500',
            templateUrl: sta + 'html/500.html'
        })
        .state('main.newcomer', {
            url: '/newcomer',
            templateUrl: sta + 'html/newcomer.html'
        })
        /*登录*/
        .state('dl', {
            url: '/dl?fromActivity&fromEc',
            templateUrl: sta + 'html/login/dl.html'
        })
        /*注册*/
        .state('zhuce', {
            url: '/zhuce?recommPhone&toFrom&recommCode',
            templateUrl: sta + 'html/login/zc.html'
        })
        /*会员注册 填写推荐码 邀请好友*/
        .state('inviteLink', {
            url: '/inviteLink?recommPhone&toFrom',
            templateUrl: sta + 'html/login/invite-link.html'
        })
        /* 找回密码 */
        .state('main.resetPasswd', {
            url: '/resetPasswd',
            templateUrl: sta + 'html/reset-passwd.html'
        })
        /*实名认证*/
        // .state('main.tradepasswdSet', {
        //     url: '/tradepasswdSet',
        //     templateUrl:sta +  'html/tradepasswd-set.html'
        // })
        .state('main.home', {
            url: '/home',
            templateUrl: sta + 'html/home.html'
        })
        /*产品安选列表页*/
        .state('main.bankBillList', {
            url: '/bankBillList',
            templateUrl:sta +  'html/bill-list-new.html' + date
        })
        /*产品安选列表页*/
        .state('main.pastBillList', {
            url: '/pastBillList?type',
            templateUrl:sta +  'html/past-list-new.html'
        })
        /*专属产品列表页*/
        .state('main.exclusiveBillList', {
            url: '/exclusiveBillList?id',
            templateUrl:sta +  'html/exclusiveBillList.html'
        })
        /*新手标--产品详情页*/
        .state('main.billDetail', {
            url: '/billDetail?id&redBagFid&reimId&ecId',
            templateUrl: sta + 'html/bill-detail.html' + date
        })
        /*  账户中心模板  */
        .state('main.myAccount', {
            url: '/myAccount',
            templateUrl: sta + 'html/my-account.html'
        })
        /*我的资产首页*/
        .state('main.myAccount.accountHome', {
            url: '/accountHome',
            templateUrl: sta + 'html/account-home.html'
        }) 
        /*我的投资*/
        .state('main.myAccount.myInvest', {
            url: '/myInvest',
            templateUrl: sta + 'html/account-myInvest.html'
        })
        /*我的投资明细*/
        .state('main.myAccount.investDetail', {
            url: '/investDetail?id&idx',
            templateUrl: sta + 'html/account-investdetail.html'
        })
        /*资产记录*/
        .state('main.myAccount.myAssets', {
            url: '/myAssets',
            templateUrl: sta + 'html/account-myAssets.html'
        }) 
        /*资金管理-充值*/
        .state('main.myAccount.recharge', {
            url: '/recharge',
            templateUrl: sta + 'html/account-recharge.html'
        })
        /*资金管理-充值*/
        .state('main.myAccount.rechargeSuccess', {
            url: '/rechargeSuccess',
            templateUrl: sta + 'html/account-recharge-success.html'
        })
        /*资金管理-提现*/
        .state('main.myAccount.Withdraw', {
            url: '/Withdraw',
            templateUrl: sta + 'html/account-Withdraw.html'
        })
        /*账户管理-个人中心*/
        .state('main.myAccount.person', {
            url: '/person',
            templateUrl: sta + 'html/account-person.html'
        })
        /*账户管理-安全认证*/
        .state('main.myAccount.security', {
            url: '/security',
            templateUrl: sta + 'html/account-security.html'
        })
        /*账户管理-存管账户*/
        .state('main.myAccount.storageinfo', {
            url: '/storageinfo',
            templateUrl: sta + 'html/account-storageinfo.html'
        })
        /*账户管理-银行卡*/
        .state('main.myAccount.bankCard', {
            url: '/bankCard',
            templateUrl: sta + 'html/account-bankCard.html'
        })
        /*优惠券-我的优惠券*/
        .state('main.myAccount.myCoupon', {
            url: '/myCoupon',
            templateUrl: sta + 'html/account-myCoupon.html'
        })
        /*个人中心-我的账户*/
        .state('main.myAccount.myFinance', {
            url: '/myFinance',
            templateUrl: sta + 'html/account-myFinance.html'
        })
         /*消息-我的消息*/
        .state('main.myAccount.myMsg', {
            url: '/myMsg',
            templateUrl: sta + 'html/account-myMsg.html'
        })
        /*我的好友*/
        .state('main.myAccount.myFriend', {
            url: '/myFriend?toGet&activityCode&teamId',
            templateUrl: sta + 'html/account-friend.html'
        })
        /*我要报销 任务*/
        .state('main.myAccount.reimtask', {
            url: '/reimtask',
            templateUrl: sta + 'html/account-reimtask.html'
        })
        /*我要报销列表页*/
        .state('main.myAccount.reim', {
            url: '/reim',
            templateUrl: sta + 'html/account-reim.html'
        })
        /*活动中心-中奖纪录*/
        .state('main.myAccount.winningRecord', {
            url: '/winningRecord',
            templateUrl: sta + 'html/account-winningRecord.html',
            controller:'winningRecordCtrl'
        })
        /*活动中心-我的奖品*/
        .state('main.myAccount.myPrize', {
            url: '/myPrize',
            templateUrl: sta + 'html/account-myPrize.html',
            controller:'myPrizeCtrl'
        })
        /*活动中心-赚钱任务*/
        // .state('main.myAccount.task', {
        //     url: '/task',
        //     templateUrl: sta + 'html/account-task.html'
        // })
        // 活动中心-赚钱任务详情
        // .state('main.myAccount.taskDetail', {
        //     url: '/taskDetail?id',
        //     templateUrl: sta + 'html/task-detail.html'
        // })
        /*帮助*/
        .state('main.jt', {
            url: '/jt',
            templateUrl: sta + 'html/jt.html'
        })
        /*wqq---帮助*/
        .state('main.jt2', {
            url: '/jt2',
            templateUrl: sta + 'html/jt2.html'
        })
        /*wqq---帮助*/
        .state('main.jt2.help', {
            url: '/help',
            templateUrl: sta + 'html/jt/helps.html'
        })

         /*wqq---帮助*/
        .state('main.jt2.YHCG', {
            url: '/YHCG',
            templateUrl: sta + 'html/jt/YHCG.html'
        })

        /*沪深概况*/
        .state('main.jt.JSGK', {
            url: '/JSGK',
            templateUrl: sta + 'html/jt/JSGK.html',
            controller:'jtContCtrl'
        })
        /*公司简介*/
        .state('main.jt.GSJJ', {
            url: '/GSJJ',
            templateUrl: sta + 'html/jt/GSJJ.html',
            controller:'jtContCtrl'
        })
        /*股权信息*/
        // .state('main.jt.GQXX', {
        //     url: '/GQXX',
        //     templateUrl: sta + 'html/jt/GQXX.html',
        //     controller:'jtContCtrl'
        // })
        /*公司资质*/
        .state('main.jt.GSZZ', {
            url: '/GSZZ',
            templateUrl: sta + 'html/jt/GSZZ.html',
            controller:'jtContCtrl'
        })
        /*办公环境*/
        .state('main.jt.BGHJ', {
            url: '/BGHJ',
            templateUrl: sta + 'html/jt/BGHJ.html',
            controller:'jtContCtrl'
        })
        /*联系我们*/
        .state('main.jt.LXWM', {
            url: '/LXWM',
            templateUrl: sta + 'html/jt/LXWM.html',
            controller:'jtContCtrl'
        })
        /*一亿验资*/
        .state('main.jt.YYYZ', {
            url: '/YYYZ',
            templateUrl: sta + 'html/jt/YYYZ.html',
            controller:'jtContCtrl'
        })
        /*公司新闻*/
        // .state('main.jt.GSXW', {
        //     url: '/GSXW?newId',
        //     templateUrl: sta + 'html/jt/GSXW.html'
        // })
        /*公司公告*/
        .state('main.jt.GSGG', {
            url: '/GSGG',
            templateUrl: sta + 'html/jt/GSGG.html'
        })
        .state('main.jt.GGXQ', {
            url: '/GGXQ?newId',
            templateUrl: sta + 'html/jt/GGXQ.html'
        })
        // 团队
        .state('main.jt.GLTD', {
            url: '/GLTD',
            templateUrl: sta + 'html/jt/GLTD.html',
            controller:'jtContCtrl'
        })
        // 团队
        .state('main.jt.GLTD2', {
            url: '/GLTD2',
            templateUrl: sta + 'html/jt/GLTD2.html',
            controller:'jtContCtrl'
        })
        // 公司荣誉
        .state('main.jt.QYRY', {
            url: '/QYRY',
            templateUrl: sta + 'html/jt/QYRY.html',
        })
        // 监管法规
        .state('main.jt.JGFG', {
            url: '/JGFG',
            templateUrl: sta + 'html/jt/JGFG.html',
        })

        /*公司新闻详情*/
        .state('main.jt.XWXQ', {
            url: '/XWXQ?newId&t',
            templateUrl: sta + 'html/jt/XWXQ.html'
        })
        /*公司动态*/
        .state('main.jt.GSDT', {
            url: '/GSDT',
            templateUrl: sta + 'html/jt/GSDT.html'
        })
        /*运营报告*/
        .state('main.jt.YYBG', {
            url: '/YYBG',
            templateUrl: sta + 'html/jt/YYBG.html'
        })
        /*2017年运营报告*/
        .state('reportDetail', {
            url: '/reportDetail?artiId',
            templateUrl: sta + 'html/reports/reportDetail.html'
        })
        /* 支付额度 */
        .state('main.jt2.ZFED', {
            url: '/ZFED',
            templateUrl: sta + 'html/jt/ZFED.html'
        })
        /* 银联开通 */
        .state('main.jt2.YLKT', {
            url: '/YLKT',
            templateUrl: sta + 'html/jt/YLKT.html'
        })
        /*沪深理财注册协议*/
        .state('zc', {
            url: '/zc',
            templateUrl: sta + 'html/protocol/zc.html'
        })
        /*借款协议*/
        .state('loan', {
            url: '/loan?idx&pid&uid&investId',
            templateUrl: sta + 'html/protocol/loan.html'
        })
        /*APP支付协议*/
        .state('pay', {
            url: '/pay',
            templateUrl: sta + 'html/protocol/pay.html'
        })
        /*安全保障*/
        .state('main.guarantee', {
            url: '/guarantee',
            templateUrl: sta + 'html/guarantee.html'
        })
        
        // .state('activity', {
        //     url: '/activity',
        //     templateUrl: sta + 'html/activity/activity.html'
        // })

        /* 注册专题活动 */
        // .state('regTopic', {
        //     url: '/regTopic',
        //     templateUrl: sta + 'html/activity/regTopic.html'
        // })

        /* 注册专题活动改为拉新288 */
        .state('regTopic', {
            url: '/regTopic',
            templateUrl: sta + 'html/activity/pullNewSem.html'
        })

        /* 拉新专题活动 */
        .state('pullNew', {
            url: '/pullNew',
            templateUrl: sta + 'html/activity/pullNew.html'
        })

        /* 拉新专题推广页 */
        .state('pullNewSem', {
            url: '/pullNewSem',
            templateUrl: sta + 'html/activity/pullNewSem.html'
        })
        /* 拉新专题推广页2 */
        .state('pullNewSem2', {
            url: '/pullNewSem2',
            templateUrl: sta + 'html/activity/pullNewSem2.html'
        })
        /* 拉新专题推广页3（2.0版本） */
        .state('pullNewSem3', {
            url: '/pullNewSem3',
            templateUrl: sta + 'html/activity/pullNewSem3.html'
        })
        /* 渠道推广页(品牌推广1) */
        .state('jdekSem', {
            url: '/jdekSem',
            templateUrl: sta + 'html/activity/jdekSem.html'
        })
        /* 渠道推广页(品牌推广1) */
        .state('jdnkSem', {
            url: '/jdnkSem',
            templateUrl: sta + 'html/activity/jdnkSem.html'
        })

        /* 送话费活动推广页 */
        .state('billGiftSem', {
            url: '/billGiftSem',
            templateUrl: sta + 'html/activity/billGiftSem.html'
        })

        /* 电商拉新活动页 */
        .state('eCommerce', {
            url: '/eCommerce?ecCode',
            templateUrl: sta + 'html/activity/eCommerce.html'
        })

        /* 电商拉新活动攻略页 */
        .state('eCommerceGl', {
            url: '/eCommerceGl',
            templateUrl: sta + 'html/activity/eCommerceGl.html'
        })

        /* 砸蛋活动 */
        .state('smashEgg', {
            url: '/smashEgg',
            templateUrl: sta + 'html/activity/smashEgg.html'
        })

        /* 邀请好友专题页 */
        .state('inviteFriends', {
            url: '/inviteFriends',
            templateUrl: sta + 'html/activity/inviteFriends.html'
        })

        /* 邀请好友专题页 被邀请人点击后未登录注册 */
        .state('inviteFriendsReg', {
            url: '/inviteFriendsReg',
            templateUrl: sta + 'html/activity/inviteFriendsReg.html'
        })

        /* 利趣网活动页 */
        .state('liquwang', {
            url: '/liquwang',
            templateUrl: sta + 'html/activity/liquwang.html'
        })

        /*新人注册引导投资*/
        .state('newToInvest', {
            url: '/newToInvest',
            templateUrl: sta + 'html/activity/newToInvest.html'
        })

        /*邀请好友活动*/
        .state('newlayout.invite', {
            url: '/invite',
            templateUrl: sta + 'html/activity/invite.html'
        })

        /* 没有导航的结构 */
        .state('newlayout', {
            url: '/newlayout',
            templateUrl: sta + 'html/activity/newlayout.html'
        })

        /* 没有导航的结构 */
        .state('extend', {
            url: '/extend',
            templateUrl: sta + 'html/activity/extend.html'
        })

        /* 财胜标 */
        .state('newlayout.special', {
            url: '/special',
            templateUrl: sta + 'html/activity/special.html'
        })

        /* 下载页 */
        .state('downloadApp', {
            url: '/downloadApp',
            templateUrl: sta + 'html/downloadApp.html'
        })

        /* 新手指导 */
        .state('main.guide', {
            url: '/guide',
            templateUrl: sta + 'html/guide.html'
        })

        // /* 长城宽带 */
        // .state('newlayout.broadband', {
        //     url: '/broadband',
        //     templateUrl: sta + 'html/login/broadband.html'
        // })

        /* 长城宽带 */
        // .state('broadbandnew', {
        //     url: '/broadbandnew',
        //     templateUrl: sta + 'html/login/broadbandnew.html'
        // })

        /* 新手专享-成功页 */
        .state('main.newhandSuccess', {
            url: '/newhandSuccess?nowNum',
            templateUrl: sta + 'html/newhand-success.html'
        })

        /* iphone7往期中奖人信息 */
        .state('newlayout.winnerInfo', {
            url: '/winnerInfo?cur',
            templateUrl: sta + 'html/activity/winner-info.html'
        })
        .state('main.juhelist', {
            url: '/juhelist',
            templateUrl: sta + 'html/juheList.html'
        })
        .state('main.juheDetail', {
            url: '/juheDetail/{id}',
            templateUrl: sta + 'html/juheDetail.html'
        })
        /* 沪深返利pc-1208 */
        .state('pc1208', {
            url: '/pc1208?toform',
            templateUrl: sta + 'html/activity/JSpc1208.html'
        })
        /* 双旦活动 */
        .state('newlayout.christmas', {
            url: '/christmas?goTear',
            templateUrl: sta + 'html/activity/christmas.html'
        })
        /* 投即送 */
        .state('newlayout.investgift', {
            url: '/investgift',
            templateUrl: sta + 'html/activity/investgift.html'
        })

        /* 投即送 */
        .state('extend.investgift', {
            url: '/investgift',
            templateUrl: sta + 'html/activity/investgiftnew.html'
        })

        /* 投资送 */
        .state('main.myAccount.investgift', {
            url: '/investgift',
            templateUrl: sta + 'html/account-investgift.html'
        })

        /* 投资送 */
        .state('main.investgiftBillDetail', {
            url: '/investgiftBillDetail?id',
            templateUrl: sta + 'html/investgift-bill-detail.html'
        })

        /* 投资送 */
        .state('main.together', {
            url: '/together',
            templateUrl: sta + 'html/activity/together.html'
        })

        /* 体验金活动 */
        .state('finance', {
            url: '/finance?toFrom&tid',
            templateUrl: sta + 'html/activity/finance.html'
        })

        /* 体验金活动 */
        .state('main.finance', {
            url: '/finance?toFrom&tid',
            templateUrl: sta + 'html/activity/finance.html'
        })

        /* 体验标 */
        .state('main.financeDetail', {
            url: '/financeDetail',
            templateUrl: sta + 'html/finance-detail.html'
        })

        /* 体验金注册成功 */
        .state('main.financeSuccess', {
            url: '/financeSuccess?num&?ecCode&newToInvest',
            templateUrl: sta + 'html/activity/finance-success.html'
        })


        // /* 发布会 */
        // .state('main.conference', {
        //     url: '/conference?showVideo',
        //     templateUrl: sta + 'html/activity/conference.html'
        // })

        /* 春节活动 */
        // .state('newlayout.newyear', {
        //     url: '/newyear',
        //     templateUrl: sta + 'html/activity/newyear.html'
        // })

        //  春节活动 
        // .state('newlayout.lantern', {
        //     url: '/lantern',
        //     templateUrl: sta + 'html/activity/lantern.html'
        // })

        /* 新手宣传页 */
        // .state('extend.poster', {
        //     url: '/poster',
        //     templateUrl: sta + 'html/activity/poster.html'
        // })

        /* 没有导航的结构(注册推广) */
        .state('reg', {
            url: '/reg',
            templateUrl: sta + 'html/reg/reg.html'
        })

        /* iphone7推广 */
        .state('reg.iphone', {
            url: '/iphone',
            templateUrl: sta + 'html/reg/iphone.html'
        })

        /* 列表 */
        .state('reg.reglist', {
            url: '/reglist',
            templateUrl: sta + 'html/reg/reglist.html'
        })

        /* 和平影视 */
        // .state('reg.hold', {
        //     url: '/hold',
        //     templateUrl: sta + 'html/reg/hold.html'
        // })

        /* 体验金 */
        .state('regfinance', {
            url: '/regfinance',
            templateUrl: sta + 'html/reg/finance.html'
        })

        /* 投即送 */
        .state('reg.investgift', {
            url: '/investgift',
            templateUrl: sta + 'html/reg/investgift.html'
        })

        /* 开放日 */
        .state('main.openday', {
            url: '/openday',
            templateUrl: sta + 'html/openday/openday.html'
        })

        /* 开放日 */
        .state('main.opendaylist', {
            url: '/opendaylist',
            templateUrl: sta + 'html/openday/opendaylist.html'
        })

        /* 开放日 */
        .state('main.opendaydetail', {
            url: '/opendaydetail?id',
            templateUrl: sta + 'html/openday/opendaydetail.html'
        })
        /* 法律法规 */
        .state('main.FLFG', {
            url: '/FLFG',
            templateUrl: sta + 'html/jt/FLFG.html'
        })
        
        /*邀请好友活动*/
        .state('extend.invite', {
            url: '/invite?toFrom&tid&recommCode',
            templateUrl: sta + 'html/activity/invite.html'
        })

        /*邀请好友活动*/
        .state('reg.reginvite', {
            url: '/reginvite?recommCode',
            templateUrl: sta + 'html/reg/reginvite.html'
        })

        /*我的返现*/
        .state('main.myAccount.cashback', {
            url: '/cashback',
            templateUrl: sta + 'html/cashback.html'
        })

        /*沪深公益*/
        .state('main.hswelfare', {
            url: '/hswelfare',
            templateUrl: sta + 'html/hswelfare/hswelfare.html'
        })

        /*沪深公益详情*/
        .state('main.hswelfareDetail', {
            url: '/hswelfareDetail?id',
            templateUrl: sta + 'html/hswelfare/detail.html'
        })

        /*公益列表*/
        .state('main.welfarelist', {
            url: '/welfarelist',
            templateUrl: sta + 'html/welfare/list.html'
        })

        /*公益详情*/
        .state('main.welfaredetail', {
            url: '/welfaredetail?id',
            templateUrl: sta + 'html/welfare/detail.html'
        })

        /*实名绑卡*/
        .state('main.bindcard', {
            url: '/bindcard',
            templateUrl: sta + 'html/bindcard/bindcard.html'
        })
        /*实名绑卡*/
        .state('main.bindcardSuccess', {
            url: '/bindcardSuccess?bankCode&bankcardno',
            templateUrl: sta + 'html/bindcard/bindcard-success.html'
        })
        /*实名绑卡*/
        .state('main.bindcardFail', {
            url: '/bindcardFail?errorCode',
            templateUrl: sta + 'html/bindcard/bindcard-fail.html'
        })

        /*投资确认*/
        .state('main.investConfirm', {
            url: '/investConfirm?fid',
            templateUrl: sta + 'html/investConfirm.html'
        })

        /*投资成功*/
        .state('main.investSucess', {
            // url: '/investSucess?isShowOver&isRepeats&comInvestSuc&isSuc&redbag&statusCode&pText',
            url: '/investSucess',
            templateUrl: sta + 'html/investSucess.html'
        })

        /* 体验金 */
        .state('sitefinance', {
            url: '/sitefinance',
            templateUrl: sta + 'html/activity/sitefinance.html'
        })

        /* 新手专享标 */
        .state('newhand', {
            url: '/newhand',
            templateUrl: sta + 'html/activity/newhand.html'
        })

        /* 新手专享标 SEM */
        .state('newhandSem', {
            url: '/newhandSem',
            templateUrl: sta + 'html/activity/newhandSem.html'
        })

        /*518活动*/
        .state('extend.manage', {
            url: '/manage?toFrom&tid&recommCode',
            templateUrl: sta + 'html/activity/manage.html'
        })

        /*一站式*/
        .state('onestop', {
            url: '/onestop',
            templateUrl: sta + 'html/activity/onestop.html'
        })

        /*秒杀*/
        .state('extend.seckill', {
            url: '/seckill',
            templateUrl: sta + 'html/activity/seckill.html'
        })

        /*存管介绍*/
        .state('storageInfo', {
            url: '/storageInfo',
            templateUrl: sta + 'html/activity/storageinfo.html'
        })

        /* 存管 */
        .state('main.myAccount.openStorage', {
            url: '/openStorage',
            templateUrl: sta + 'html/account-storage.html'
        })

        /* 存管开通成功 */
            .state('main.myAccount.storageSuccess', {
                url: '/storageSuccess?success',
                templateUrl: sta + 'html/account-storage-success.html'
            })

            // AA信用评级
            .state('creditRating', {
                url: '/creditRating',
                templateUrl: sta + 'html/activity/creditRating.html'
            })

            // 送京东卡活动
            .state('jdSem', {
                url: '/jdSem',
                templateUrl: sta + 'html/activity/jdSem.html'
            })

            // SEM京东E卡活动
            .state('jdEcard', {
                url: '/jdEcard',
                templateUrl: sta + 'html/activity/jdEcard.html'
            })

            // 幸运抽奖活动
            .state('luckyDraw', {
                url: '/luckyDraw',
                templateUrl: sta + 'html/luckydraw/luckyDraw.html'
            })

            // 组队活动
            .state('zudui', {
                url: '/zudui',
                templateUrl: sta + 'html/activity/zudui.html'
            })

            // 活动中心
            .state('main.actcenter', {
                url: '/actcenter',
                templateUrl: sta + 'html/actcenter.html'
            })

            // 恩弗教育活动
            .state('main.enfu', {
                url: '/enfu?id',
                templateUrl: sta + 'html/enfu/enfu.html'
            })

            // 恩弗教育活动 - 投资成功
            .state('main.enfuInvestSucess', {
                url: '/enfuInvestSucess?id',
                templateUrl: sta + 'html/enfu/enfuInvestSucess.html'
            })

            // 春节活动
            .state('chunjie2018', {
                url: '/chunjie2018',
                templateUrl: sta + 'html/chunjie/chunjie2018.html' + date
            })

            // 春节活动  投资成功页面
	        .state('main.chunjieInvestSuc', {
	            url: 'chunjieInvestSuc',
	            templateUrl: sta + 'html/chunjie/chunjieInvestSuc.html' + date
	        })

            /* 发布会 */
            .state('conference', {
                url: '/conference?showVideo',
                templateUrl: sta + 'html/activity/conference.html'
            })

            /* 新手投资 */
            .state('beginSem', {
                url: '/beginSem',
                templateUrl: sta + 'html/activity/beginSem.html'
            })

            // 风险评估
            .state('main.riskAssess', {
                url: '/riskAssess',
                templateUrl: sta + 'html/riskAssess/riskAssess.html'
            })

            // 风险提示书与承诺书
            .state('main.riskTipPromise', {
                url: '/riskTipPromise',
                templateUrl: sta + 'html/riskAssess/riskTipPromise.html'
            })

}]);

var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?faaf4f44183640df310b381d7a407a39";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();



