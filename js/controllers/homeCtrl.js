/*首页*/
mainModule.controller('homeCtrl', [ 
	'$rootScope',
	'$scope',
	 '$state',
	 '$localStorage',
	 'resourceService',
	 'communicationService',
	'$filter',
	'$document',
	'$timeout',
	'$location',
	'$animate',
	'$interval',
	'ngDialog',
	function($rootScope,
		$scope,
		 $state,
		 $localStorage,
		 resourceService,
		communicationService,
		$filter,
		$document,
		$timeout,
		$location,
		$animate,
		$interval,
		ngDialog
		) {

	$('html,body').animate({scrollTop:0});
	$filter('isLogin')($scope);
	$scope.showSummary=true;
	$rootScope.activeNav = 'home';

	$scope.showVideo = false;
	// $scope.hotSales = [];
	if($localStorage.user != undefined){$scope.user = $localStorage.user;};
	$rootScope.title="沪深理财-网贷投资，国企控股平台";
	$scope.updateBargain={register:'',
	successfulTrade:''};
	
	$scope.myInterval = 5000;
    // 轮播图数据初始化
    var slides = $scope.slides = [];
    

    // 浏览器判定
    var browser = navigator.appName;
    var b_version = navigator.appVersion;
    var version = b_version.split(";");
    var trim_Version; 
    $scope.showAD = true;
    $localStorage.pathUrl = 'main.home';


    if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined||$location.$$search.tid!=undefined){
		$localStorage.webFormPath = $location.$$search;
	};
    if(version[1]!=undefined){
    	trim_Version = version[1].replace(/[ ]/g,""); 
    }else{
    	trim_Version = version[0].replace(/[ ]/g,""); 
    }
    if (browser == "Microsoft Internet Explorer" && trim_Version=="MSIE8.0") { 
        $rootScope.isI8 = true;
    } else {
        $rootScope.isI8 = false;
    }
    var $noticeBoxDiv = $('.notice-box .con div'); 
    
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case "产品列表":
				$scope.map = data.map;
				$scope.listDatas = data.map.otherPro;
				// $scope.newUser = data.map.newhand;
//				var temp = $scope.listDatas[0];
//				$scope.listDatas[0] = $scope.listDatas[1];
//				$scope.listDatas[1] = temp;

				// $scope.hotSales = data.map.mainPush;
				$scope.activity = data.map.activity;
				$scope.activityReward = data.map.activityReward;
				$scope.newhand = data.map.newhand;
				$scope.periodPro = data.map.periodPro;
				$scope.investSendInfo = data.map.investSendInfo;
				$scope.periodProInvestCount = data.map.periodProInvestCount;

				// if ($scope.hotSales.length > 0) {
				// 	$scope.listDatas.length = 2;
				// } else {
				// 	$scope.listDatas.length = 3;
				// }
				
				// $localStorage.newHandId = $scope.newUser.id;
				// $scope.hotSales.length = 1;
				$scope.activityInvestTotal = data.map.investTotal;
				if (data.map.isReservation != undefined) {
					$scope.isReservation = data.map.isReservation;
				} else {
					$scope.isReservation = false;
				};
				/*
					双旦判断
				*/
				data.map.activity_60 = Number(data.map.activity_60);
				data.map.activity_180 = Number(data.map.activity_180);
				if(data.map.activity_60>0){
					$scope.shuangDanActivity=true;
				}else if(data.map.activity_180>0){
					$scope.shuangDanActivity=true;
				}else{
					$scope.shuangDanActivity=false;
				};

			break;
			case "首页主数据":
				$scope.user = data.map;
				// $scope.regDate = data.map.regDate;
				if (data.map.realName == '' || data.map.realName == undefined) {
					$scope.user.userName = '亲爱的用户';
				} else {
					$scope.user.userName = data.map.realName;
				}
				$localStorage.user = $scope.user;
			break;
			case "首页icon":
				if(data.success){
					$scope.isInDoubleEggActivity = data.map.isInDoubleEggActivity;
				}	
				
			break;
			case "注册成交人数":
				$scope.updateBargain = data.map;
			break;
			case "投资统计数据":
				if (data.success) {
					$scope.investTotal = data.map;
					/*$scope.investCumulative = parseInt($scope.investTotal.investCumulative).toLocaleString();
					$scope.profitCumulative = parseInt($scope.investTotal.profitCumulative).toLocaleString();*/
                    $scope.investCumulative = parseInt($scope.investTotal.investCumulative);
                    $scope.profitCumulative = parseInt($scope.investTotal.profitCumulative);
                    with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='/vendor/numScroll.js'];
				}
			break;
			case "实时投资记录":
				if (data.success) {
					$scope.investList = data.map.page.rows;
				}
			break;
			case "获取首页广告":
				if (data.success) {
					if (data.map.floatList.length > 0) {
						$scope.floatList = data.map.floatList[0];
						if ($scope.floatList.location == '' || $scope.floatList.location == undefined) {
							$('.float-ad').html('<img src="'+ $scope.floatList.imgUrl +'">');
						}
					}
					if (data.map.popList.length > 0) {
						$scope.popList = data.map.popList[0];
					    if(!$localStorage.firstTime){
					    	$scope.isShowGangGao=true;
					        $localStorage.firstTime = new Date().getDate();
					    }else{
					        var day = new Date().getDate();
					        if($localStorage.firstTime != day){
					        	$scope.isShowGangGao=true;	
					            $localStorage.firstTime = day;
					        }else{
					        	$scope.isShowGg=true;
					        }
					    }
					}
				}
			break;
			case "公司新闻":
				if(data.map.urgentNotice[0] != undefined){
					$localStorage.summaryContents = $scope.summaryContents = data.map.urgentNotice[0].summaryContents;
					$localStorage.summaryTime = $scope.summaryTime = data.map.urgentNotice[0].create_time;
					$scope.noticeList = data.map.urgentNotice;
					if ($scope.noticeList.length > 5) {
						$scope.noticeList = $scope.noticeList.slice(0,5);
					}
					if ($scope.noticeList.length > 1) {
						setInterval(function() {
							$noticeBoxDiv.animate({'margin-top': '-26px'},function() {
								$noticeBoxDiv.find('span').eq(0).appendTo($noticeBoxDiv);
								$noticeBoxDiv.css('margin-top', 0);
							});
						}, 8000);
					};
					
				} else {
					$scope.showSummary = false;
				}
				$scope.nowTimer=11;
				function setTimerOut() {
                    var timer = $timeout(
                        function() {
                            if($scope.nowTimer <= 0 ){
                            }else{
                                $scope.nowTimer-=1;
                                setTimerOut();
                            }
                        },
                        1000
                    );
                };
				setTimerOut();
				// $scope.news = data.map.notice;
				$scope.helps = data.map.questions;
				$scope.notice = data.map.notice;
				//公司新闻----title   id   img
				$scope.newsTitle = data.map.news[0];
			break;
			case "banner":
                $scope.banner = data.map.banner;
            break;
            case "新闻列表":
                $scope.news = data.map.page.rows;
            break;
            case "首页视频":
                if(data.success){
                	// $scope.video = data.map.videoList[0];
                	$scope.video = $location.$$protocol + '://'+ $location.$$host + data.map.videoList[0];
                	$filter('首页播放视频')($scope);
                }
                break;
            /*case "风险评测弹窗显示":
	            if(data.success){
	            	if(data.map.show){
	            		$filter('风险评测首页提示弹窗')($scope);
	            	}
	            }
                break;*/
		};
	});

	$scope.cl=true;
	$scope.isShowGg=false;
	$scope.closeAD=function(){
		$scope.cl=false;
		$scope.isShowGg=true;
        $document.find('.donghua').animate({
            width:"0",
            height:"0",
            opacity:"0",
            'margin':'300 0 100 2500'
        },1000,function(){
        })
        $('.donghuawrap').hide();            
	}
	/*立即投资*/
	$scope.onclickTouzi =  function(type,item) {
		switch(type){
			case "xinShou":
				$filter('跳转页面')(type,'main.home','main.billDetail',item);
			break;
			case "热销":
				$filter('跳转页面')(type,'main.home','main.billDetail',item);
			break;
			case "新闻":
				$filter('跳转页面')(type,'main.home','main.jt.GSXW',item,'沪深新闻',{name:'沪深新闻',url:'main.guarantee'});
			break;
		};
	};
	
	if($localStorage.user != undefined){
		resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},'首页主数据');
		/*//首页风险评估提示弹窗
		resourceService.queryPost($scope,$filter('交互接口对照表')('风险评测弹窗显示'),{},'风险评测弹窗显示');*/
	}
	resourceService.queryPost($scope,$filter('交互接口对照表')('首页icon'),{},'首页icon');
	resourceService.queryPost($scope,$filter('交互接口对照表')('产品列表'),{},'产品列表');
	resourceService.queryPost($scope,$filter('交互接口对照表')('公司新闻'),{},'公司新闻');
	resourceService.queryPost($scope,$filter('交互接口对照表')('投资统计数据'),{},'投资统计数据');
	// resourceService.queryPost($scope,$filter('交互接口对照表')('实时投资记录'),{},'实时投资记录');
	resourceService.queryPost($scope,$filter('交互接口对照表')('获取首页广告'),{},'获取首页广告');

	//组队活动第二期
	var nowDate=new Date().getTime();
    var startDate=new Date('2018/03/15 00:00:00').getTime();
    var endDate=new Date('2018/04/15 24:00:00').getTime();
    if(nowDate>startDate && nowDate<endDate){
    	$scope.zuduiShow=true;
    }else{
    	$scope.zuduiShow=false;
    }
	
	/*// 庆A轮融资弹窗
    var nowDate=new Date().getTime();
    var startDate=new Date('2018/02/01 00:00:00').getTime();
    var endDate=new Date('2018/02/06 00:00:00').getTime();
    var reglimit=new Date('2018/01/31 00:00:00').getTime();
    setTimeout(function(){
    	if ($filter('isRegister')().register) {
			if($scope.user.regDate != undefined && ($localStorage.alertAfinance==undefined || !$localStorage.alertAfinance)){
		    	if($scope.user.regDate<reglimit && nowDate>startDate && nowDate<endDate){
		    		$filter('庆A轮融资弹窗')($scope);
		    		$localStorage.alertAfinance=true;
		    	}else{
		    		$localStorage.alertAfinance=false;
		    	}
		    }	
		}
    }, 100)*/
    

	$scope.balanceShowType='隐藏';
	$scope.showBalance=true;
	$scope.onClickBalanceShow=function(event){
		if(event.target.innerText == '隐藏'){$scope.showBalance=false;$scope.balanceShowType='显示账户余额';}else{$scope.showBalance=true;$scope.balanceShowType='隐藏';};
	};
	/*退出*/
	$scope.userOut = function (type) {
		$filter('清空缓存')();
		resourceService.queryPost($scope,$filter('交互接口对照表')('退出接口'),{},'退出');
	};

	/*点击登录注册*/
	$scope.gotoLoginPage = function (type) {
		$filter("跳转页面")(type,'main.home','dl');
	};

	// 图片经过上移效果
	// var $featureImg = $('.feature-box li img');
	// $featureImg.on('mouseover', function() {
	// 	$(this).stop().animate({'margin-top':'-96px'},200);
	// }).on('mouseout', function() {
	// 	$(this).stop().animate({'margin-top':0},200);
	// });
		
	var mySwiper = new Swiper('.partner-box .swiper-container', {
        slidesPerView: 6,
        paginationClickable: true,
        loop: true,
        nextButton: '.button-next',
        prevButton: '.button-prev'
    });

    var swiperImg = new Swiper('.newlayout .swiper-container', {
        loop : true,
		loopAdditionalSlides : 1,
        autoplay: 3000,
        pagination: '.newlayout .video .swiper-pagination',
        paginationClickable: true
    });
    $('.newlayout .devices').on('mouseout', function() {
        swiperImg.startAutoplay();
    }).on('mouseover', function() {
        swiperImg.stopAutoplay();
    });

	// 监听关闭砸金蛋弹窗
	$rootScope.$on('closeEgg', function(event, flag) {
		if (flag) {
			if ($localStorage.eggProItem && $localStorage.eggEnroll) {
				if ($localStorage.eggEnroll == 'home') {
					// if ($scope.hotSales.length > 0 && $scope.hotSales[0].id == $localStorage.eggProItem.id) {
					// 	$scope.hotSales[0].isEgg = 2;
					// 	$scope.hotSales[0].maxActivityCoupon = $localStorage.eggProItem.maxActivityCoupon;
					// 	$('.hot-box').find('.shake-rotate').hide();
					// 	$('.hot-box').find('.egg-box').find('.num').eq(0).hide();

					// 	$('.hot-box').find('.egg-sopenegg').show().removeClass('ng-hide');
					// 	$('.hot-box').find('.egg-box').find('.num').eq(1).show().removeClass('ng-hide');

					// } else {
						var listLength = $scope.listDatas.length;
						for (var i=0; i<listLength; i++) {
							if ($scope.listDatas[i].id == $localStorage.eggProItem.id) {
								$scope.listDatas[i].isEgg = 2;
								$scope.listDatas[i].maxActivityCoupon = $localStorage.eggProItem.maxActivityCoupon;
								$('.eggProMode').find('.shake-rotate').eq(i).hide();
								$('.eggProMode').find('.egg-box').eq(i).find('.num').eq(0).hide();

								$('.eggProMode').find('.egg-box').eq(i).find('.egg-sopenegg').show().removeClass('ng-hide');
								$('.eggProMode').find('.egg-box').eq(i).find('.num').eq(1).show().removeClass('ng-hide');
								delete $localStorage.eggProItem;
								delete $localStorage.eggEnroll;
								break;
							}
						}
					// }
				}
			}
			ngDialog.closeAll();
		}
	});
	$scope.ifGoDetail = function(e,item) {
		if (item.isEgg == 1) {
			e.stopPropagation();
		}
	};
	$scope.noGoDetail = function(e) {
		e.stopPropagation();
	};
	var $win = $(window);
	$win.on('load scroll resize', function() {
		if ($win.height()/2 < $('.float-ad').height() + 200) {
			$('.float-ad').css({'top': 'auto','bottom': '10px'});
		} else {
			$('.float-ad').css({'top': '50%','bottom': 'auto'});
		}
	});

	resourceService.queryPost($scope,$filter('交互接口对照表')('banner'),{},'banner');
	resourceService.queryPost($scope, $filter('交互接口对照表')('新闻列表'),{
		pageOn:1,
		pageSize:5,
		proId:1
	},'新闻列表');


	// 打开视频
	$scope.getVideo = function () {
        resourceService.queryPost($scope, $filter('交互接口对照表')('首页视频'), {'videoDate': '2017001.mp4'} , '首页视频');
	};
	$scope.closeVideo = function() {
		$scope.showVideo = false;
	};
	$scope.showVideoMap = function() {
		$scope.showVideo = true;
		$('video').attr('src','https://www.hushenlc.cn/images/shipin/hepingjusheng.mp4');
	};

	$scope.showBusiness = true;


}])