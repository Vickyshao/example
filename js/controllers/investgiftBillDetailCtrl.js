/*lee 产品详情页*/
mainModule.controller('investgiftBillDetailCtrl', ['$rootScope','$scope', '$state', '$localStorage', 'resourceService','$filter','communicationService','$timeout','$location','ngDialog','$element','MAIN_MENU','storage','$stateParams',function($rootScope,$scope, $state, $localStorage,resourceService,$filter,communicationService,$timeout,$location,ngDialog,$element,MAINMENU,storage,$stateParams) {
	$filter('isLogin')($scope);
	$(window).scrollTop(0);
	MAINMENU.menuname('bill','menu');
	$scope.product = $localStorage.product;
	$scope.path = $localStorage.pathObj;
	$scope.title = '项目详情';
	$scope.portName = '投资记录';
	$scope.playSound=true;
	$scope.amount = 0;
	$scope.showTabNum = 0;
	$scope.investGiftDialog = 'sure';

	$scope.showTab = 'gift';

	$scope.bill= {};
    $scope.bill.pageOn = 1;
    $scope.bill.pageSize = 10;

    $scope.bookStatus = 'before';

    if ($location.$$path == '/main/investgiftBillDetail') {
    	$scope.investGiftOn = true;
    } else {
    	$scope.investGiftOn = false;
    }

    delete $localStorage.inProfitProductList;

    $scope.isLogin = $filter('isRegister')().register;

	// 未设置交易密码时--去安全认证页面设置
	$scope.setTradeCode = function() {
		ngDialog.closeAll();
		$filter('跳转页面')('','main.myAccount.recharge','main.myAccount.security','setTradeCode',null,{name:'账户管理',url:'main.myAccount.security'});
	};
    $scope.showPastList = false;
    $scope.investListPast = [];
    $scope.isNumCash=false;
	var isSubmin=true;
	var balance;

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case '投资记录':
				if (data.success) {
					$scope.total = data.map.page.total;
					$scope.investList = data.map.page.rows;
					$scope.allUserNum = data.map.page.rows.length;
					$scope.bill = data.map.page;
					$scope.bill.pages = [];
					for(var i=0;i<parseInt($scope.bill.totalPage);i++){
						$scope.bill.pages[i]=i+1;
					};
				}
			break;
			case '用户信息':
				if (data.success) {
					$localStorage.user = data.map;
				}
			break;
			case "票据详情":
				$localStorage.product = $scope.product = data.map.info;
				$scope.extendInfos = data.map.extendInfos;
				$scope.isOldUser = data.map.isOldUser;
				$scope.specialRate = Number(data.map.specialRate);

				// 存管
				$scope.isFuiou = data.map.isFuiou;

				if ($scope.investGiftOn) {
					if($location.$$search.id != undefined){
						resourceService.queryPost($scope,$filter('交互接口对照表')('查询产品绑定的奖品'),{pid:$location.$$search.id},'查询产品绑定的奖品');
					}else{
						if ($scope.product!= undefined) {
							resourceService.queryPost($scope,$filter('交互接口对照表')('查询产品绑定的奖品'),{pid:$scope.product.id},'查询产品绑定的奖品');
						}
					}
				}

				if (data.map.projectList != undefined ) {
					if(data.map.projectList.length != 0){
						$scope.projectList = data.map.projectList;
						$scope.projectListData = true;
					}
				} else {
					$scope.projectListData = false;
				}
		
				if (data.map.info.type == 1){
					$rootScope.title = '新手标-沪深理财';
					$scope.goPage($scope);
				} else if (data.map.info.type == 2) {
					$scope.goPage($scope);
					$rootScope.title = '优选投资-沪深理财';
				} else if (data.map.info.type == 3) {
					$scope.goPage($scope);
					$rootScope.title = '优选投资-沪深理财';
				}
				$scope.XQ = data.map;
				$scope.pics = data.map.picList;

				if(data.map.funds != undefined){
					$scope.account={};
					$scope.account = data.map.funds;//用户资金

					$scope.account.balance = $scope.account.balance;

					balance = $scope.account.balance;
					if($scope.XQ.newHandInvested == false && $scope.product.type == 1 && $scope.XQ.isInvested == false){
						$scope.isNewGay = true;
					}else{
						$scope.isNewGay = false;
					}
					
				}else{
					delete $localStorage.user;
				}
				$scope.product = data.map.info;
				var borrower = $filter('截取段落')($scope.product.borrower);
				var introduce = $filter('截取段落')($scope.product.introduce);
				var repaySource = $filter('截取段落')($scope.product.repaySource);
				var windMeasure = $filter('截取段落')($scope.product.windMeasure);
				$scope.product.borrower = borrower;
				$scope.product.introduce = introduce;
				$scope.product.repaySource = repaySource;
				$scope.product.windMeasure = windMeasure;
				
				if($scope.product.establish != undefined){
					var date3 = $scope.product.establish - Date.parse(new Date());
					var day = Math.floor(date3/(24*3600*1000));
					var hh= Math.floor(date3/(3600*1000));
					if(day > 0){
						$scope.nowTimer = day+'天';
					}else
					if(day == 0&& hh > 1){
						$scope.nowTimer = hh+'小时';
						$scope.isBuTimer = true;
					}else
					if(day == 0&& hh < 1){
						$scope.nowTimer = '1小时内'
					}else
					if(hh < 0){
						$scope.nowTimer ='已结束';
					}
				}else{
					$scope.nowTimer ='已结束';
				}
				
			    // 预约下期
			    if (data.map.isReservation != undefined) {
					$scope.isReservation = data.map.isReservation;
				} else {
					$scope.isReservation = false;
				}
				if (data.map.realverify != undefined) {
					$scope.realverify = data.map.realverify;
				}
				if (data.map.prid != undefined) {
					$scope.prid = data.map.prid;
				}
				if (data.map.name != undefined) {
					$scope.name = data.map.name;
				}
			break;
			case "确认投资":
				isSubmin = true;
				$scope.success = data.success;
				$scope.nextInvestNumber = $scope.product.nowNum;
				$scope.product.tpwd=null;
				$scope.redbag = false;

				if(data.success){
					// resourceService.queryPost($scope,$filter('交互接口对照表')('投即送获取收货地址'),{},'投即送获取收货地址');
					_hmt.push(['_trackPageview', 'www.hushenlc.cn/maidian/tzcg']);
					$scope.investGiftDialog = 'success';
					resourceService.queryPost($scope,$filter('交互接口对照表')('票据详情'),{id: $scope.product.id},'票据详情');
					$scope.investTime = data.map.investTime;
					$scope.luckCodeCount=data.map.luckCodeCount;
					$scope.luckCodes=data.map.luckCodes;
					
				}else{
					$scope.investGiftDialog = 'error';
					if (data.errorCode == '2001') {
						$scope.showForgetPwd = true;
					} else {
						$scope.showForgetPwd = false;
					}
					$scope.statusCode = $filter('确认投资服务器Error')(data.errorCode).classCode;
					$scope.pText = $filter('确认投资服务器Error')(data.errorCode).text;
				}
			break;
			case "查询产品绑定的奖品":
				if (data.success) {
					$scope.prize = data.map.prize;
					$scope.product.nowNum = $scope.prize.amount;
				}
			break;
			case "投即送获取收货地址":
				if (data.success) {
					$scope.address = data.map.jsMemberInfo;
				}
			break;
			case "投即送预约":
				if (data.success) {
					$scope.bookStatus = 'next';
				} else {
					ngDialog.closeAll();
					$scope.bookStatus = 'before';
					$.qTip({
						'type': false,
						'text': '预约失败'
					});
				}
			break;
		};
	});
	
    $scope.closeDialog = function(bool) {
		ngDialog.closeAll();
		$scope.bookStatus = 'before';
	};
	var $win = $(window);
	$win.on('load resize scroll', function() {
    	$('.mask-imgs').height($win.height()).width($win.width());
        $('.mask-imgs li').height($win.height()).width($win.width());
        $('.mask-imgs li img').css('max-height',$win.height()).css('max-width',$win.width());
    });

    $('.explain').on('mouseover', function() {
    	$(this).addClass('showexplain');
    }).on('mouseout', function() {
    	$(this).removeClass('showexplain');
    });

    $('.ico_point').on('mouseenter mouseover', function(){
        $('.finance_tip').removeClass('hide');
    }).on('mouseout mouseleave', function(){
        $('.finance_tip').addClass('hide');
    });

	//controller里对应的处理函数
	$scope.renderFinish = function(){
    	if ($('.img-detail .imgs li').length <= 3) {
    		$('.img-detail .imgs ul').addClass('center-img');
    		$('.bill-turn-right').addClass('displaybtn');
    	}
		$('.bill-turn-left').addClass('displaybtn');
    	var lastindex = $('.img-detail .imgs li').length - 3;
		var mySwiper = new Swiper('.swiper-container', {
	        slidesPerView: 3,
	        paginationClickable: true,
	        loop: false
	    });

		$('.bill-turn-left').on('click', function(e){
			if ($('.bill-turn-left').hasClass('displaybtn')) {
				return;
			}
			e.preventDefault();
			mySwiper.slidePrev();
			$('.bill-turn-right').removeClass('displaybtn');
			if(mySwiper.slides[0].isActive()) {
				$('.bill-turn-left').addClass('displaybtn');
			} else {
				$('.bill-turn-left').removeClass('displaybtn');
			}
		});
		$('.bill-turn-right').on('click', function(e){
			if ($('.bill-turn-right').hasClass('displaybtn')) {
				return;
			}
			e.preventDefault();
			mySwiper.slideNext();
			$('.bill-turn-left').removeClass('displaybtn');
			if(mySwiper.slides[lastindex].isActive()) {
				$('.bill-turn-right').addClass('displaybtn');
			} else {
				$('.bill-turn-right').removeClass('displaybtn');
			}
		});

		var mySwiper1 = new Swiper('.swiper-container1', {
			slidesPerView: 1,
	        paginationClickable: true
	    });

	    $('.img-detail .imgs li').on('click', function() {
	    	var index = $(this).index();
	    	if(!mySwiper1.browser.ie8) {
	    		mySwiper1.slideTo(index, 1000, false);
	    	}
	    	// mySwiper1.swipeTo(index, 1000, false);
	    	$('.mask-imgs').eq(0).addClass('show-mask');
	    });
	};
    $('.mask-imgs .close').on('click', function() {
    	$(this).parents('.mask-imgs').removeClass('show-mask');
    });
	var mySwiper2 = new Swiper('.swiper-container2', {
		slidesPerView: 1,
        paginationClickable: true
    });

	// 忘记交易密码--去安全认证页面找回
	$scope.forgetTradeCode = function() {
		ngDialog.closeAll();
		$filter('跳转页面')('','main.myAccount.withdraw','main.myAccount.security','forgetTradeCode',null,{name:'账户管理',url:'main.myAccount.security'});
	};
	
	$localStorage.balanceNotEnough = false;
	$localStorage.balanceNotEnoughId = '';
	/*倒计时结束*/
	/*加减金额*/
	$scope.winterest = 0;
	
	$scope.onClick=function (type,event,num) {
		switch(type){
			case "cut":
				if (parseInt($scope.product.nowNum) > parseInt($scope.product.leastaAmount)) {
					$scope.product.nowNum = parseInt($scope.product.nowNum);
					$scope.product.leastaAmount = parseInt($scope.product.leastaAmount);
					if($scope.product.nowNum < $scope.product.leastaAmount){
						$scope.product.nowNum = $scope.product.leastaAmount;
					}else{
						$scope.product.nowNum -= $scope.product.increasAmount;
					}
				}
			break;
			case "add":
				if (parseInt($scope.product.nowNum) < $scope.product.maxAmount) {
					$scope.product.nowNum = parseInt($scope.product.nowNum);
					// $scope.account.balance = $scope.account.balance;
					if($scope.product.nowNum > $scope.product.maxAmount){
						$scope.product.nowNum = $scope.product.maxAmount;
					}else{
						$scope.product.nowNum += $scope.product.increasAmount;
					}
				}
			break;
			case "keyUpBalance":
					$scope.product.nowNum = parseInt($scope.product.nowNum);
					$scope.isNumCash=false;
					// $scope.account.balance = $scope.account.balance;
					if(angular.equals($scope.product.nowNum,NaN)){
						$scope.isHideNowNum = true;
						// $scope.product.nowNum = 0
						$scope.account.balance = balance;
					}else{
						$scope.isHideNowNum = false;
					};
					if($scope.product.nowNum > $scope.product.maxAmount){
						$scope.product.nowNum = $scope.product.maxAmount;
					}
					if(($scope.product.nowNum - $scope.product.leastaAmount)%$scope.product.increasAmount != 0 ){
						$scope.product.nowNum -= ($scope.product.nowNum - $scope.product.leastaAmount)%$scope.product.increasAmount;
					}
			break;
			case "礼品详情":
				$scope.showTab = 'gift';
			break;
			case "项目介绍":
				$scope.showTab = 'introduce';
			break;
			case "本息保障":
				$scope.showTab = 'guarantee';
				$('.guarantee img').on('click', function() {
			    	var index = $(this).parents('td').index();
			    	if(!mySwiper2.browser.ie8) {
				    	mySwiper2.slideTo(index, 1000, false);
				    }
			    	$('.mask-imgs').eq(1).addClass('show-mask');
			    });
			break;
			case "投资记录":
				$scope.showTab = 'invest';
			break;
			case "立即抢购":
				$localStorage.balanceNotEnough = false;
				$scope.investGiftDialog = 'sure';
				if (($scope.account.balance < $scope.product.leastaAmount)||($scope.account.balance - $scope.product.nowNum < 0)) {
					$localStorage.balanceNotEnough = true;
					$localStorage.balanceNotEnoughId = $location.$$search.id;
					$filter("跳转页面")('','main.investgiftBillDetail','main.myAccount.recharge');
				} else {
					$filter('投即送投资成功弹窗')($scope);
				}
			break;
			case "登录":
				$filter("跳转页面")('denLu','main.investgiftBillDetail','dl');
			break;
			case "确认投资":
				if(isSubmin){
					isSubmin=false;
					var obj = {};
					obj.pid = $scope.product.id;
					obj.tpwd = $scope.product.tpwd;
					obj.amount = $scope.product.nowNum;
					resourceService.queryPost($scope,$filter('交互接口对照表')('invest'),obj,'确认投资');
				}
			break;
			case "请关注其他项目":
				$filter("跳转页面")('','main.billDetail','main.bankBillList');
			break;
		};
	};
	$scope.goPage = function (scope) {
        var obj={};
        obj.pageOn =  scope.bill.pageOn;
        obj.pageSize = scope.bill.pageSize;
        obj.pid = scope.product.id;
        resourceService.queryPost($scope,$filter('交互接口对照表')(scope.portName),obj,scope.portName);
     };

	/*菜单切换*/
	var beforEvent=null;
	function change(event) {
		if(beforEvent == null){
			beforEvent = event.currentTarget;
			if(event.currentTarget.className == 'actived'){

			}else{
				event.currentTarget.parentNode.children[0].className='';
				event.currentTarget.className = 'actived';
			};
		}else if(beforEvent == event.currentTarget){

		}else{
			event.currentTarget.className = 'actived';
			beforEvent.className = '';
			beforEvent = event.currentTarget;
		};
	}
	/*×××××菜单切换结束××××××××××*/
	function showDetail() {
		if($location.$$search.id != undefined){
			$localStorage.pathUrl = 'main.investgiftBillDetail';
			resourceService.queryPost($scope,$filter('交互接口对照表')('票据详情'),$location.$$search,'票据详情');
		}else{
			if ($scope.product!= undefined) {
				$localStorage.pathUrl = 'main.investgiftBillDetail';
				resourceService.queryPost($scope,$filter('交互接口对照表')('票据详情'),$scope.product,'票据详情');
			}else{
				$state.go('main.bankBillList');
			}
		}
	}
	showDetail();
	if($localStorage.user != undefined){
		resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},'用户信息');
	}
	// 监听退出是否成功
	$rootScope.$on('exitSuccess', function(event, flag) {
		if (flag) {
			$scope.isLogin = false;
		}
	});

	// 预定弹窗
	$scope.bookGift = function() {
		$filter('投即送预约弹窗')($scope);
	};
	$scope.bookNow = function() {
		resourceService.queryPost($scope,$filter('交互接口对照表')('投即送预约'),{ppid:$scope.prize.id},'投即送预约');
	};

	// 未绑定银行卡时--去安全认证页面绑定
	$scope.bindBank = function() {
		ngDialog.closeAll();
		$filter('跳转页面')('','main.myAccount.recharge','main.myAccount.security','setTruename',null,{name:'账户管理',url:'main.myAccount.security'});
	};

	$scope.onReturn = function() {
		ngDialog.closeAll();
	};

}])
