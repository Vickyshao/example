
/* 端午节 */
mainModule.controller('dragonboatCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService',function($rootScope,$scope,$location,$localStorage,$filter,resourceService) {
	$rootScope.title = '粽情飘香 多财善贾';
	$scope.lotteryRuleShow = false;
	$scope.listRuleShow = false;
	$scope.nogift = false;
	$scope.getgift = false;
	$scope.getnext = false;
	$scope.isClick = false;
	var nogiftarr = [1,2,3],
		commonHeight = $('.show-list').height()/9,
		timer;
	if (!$filter('isRegister')().register) {
		$scope.isLogin = false;
	} else {
		$scope.isLogin = true;
	}

	$scope.refresh = function() {
		resourceService.queryPost($scope,$filter('交互接口对照表')('端午节投资数据'),{},{name:'端午节投资数据'});
	};

	$scope.refresh();

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type.name) {
			case '首页主数据':
				if (data.success) {
					$localStorage.user = data.map;
				}
			break;
			case "端午节投资数据":

				if (data.success) {
					$scope.investData = data.map;
					if (data.map.investList.length > 9) {
						clearInterval(timer);
						timer = setInterval(function() {
							$('.my-list').animate({'margin-top':'-' + commonHeight + 'px'},500,function() {
								var $clone = $('.my-list tr').eq(0);
								$('.my-list tr').eq(0).remove();
								$clone.appendTo('.my-list');
								$('.my-list').css('margin-top',0);
							});
						}, 3000);
					}
				}
			break;
			case "端午节抽奖":
				
				if (data.success) {
					$('.boat-lottery-mod img').eq(type.index).attr('src','images/zongzi/z.gif');
					$scope.giftMsg = data.msg;
					setTimeout(function() {
						$scope.$apply(function() {
							$scope.getgift = true;
						});
						$('.boat-lottery-mod img').eq(type.index).removeClass('clicked').attr('src','images/zongzi/zongzi.png');
					},1500);
					if ($scope.investData.useCount < 3) {
						$scope.investData.useCount ++;
					}
				} else {

					switch(data.errorCode) {
						case '1001':
							$.qTip({
								'type': false,
								'text': data.errorMsg
							});
							$scope.isClick = false;
							$('.boat-lottery-mod img').eq(type.index).removeClass('clicked');
						break;
						case '1002':
							$scope.getnext = true;
							$('.boat-lottery-mod img').eq(type.index).removeClass('clicked');
						break;
						case '9998':
							$.qTip({
								'type': false,
								'text': '请登录参与活动'
							});
							$scope.isClick = false;
							$('.boat-lottery-mod img').eq(type.index).removeClass('clicked');
						break;
						case '1003':
							var index = Math.floor((Math.random()*nogiftarr.length));
							$('.boat-lottery-mod img').eq(type.index).attr('src','images/zongzi/wz'+ index +'.gif');
							setTimeout(function() {
								$scope.$apply(function() {
									$scope.nogift = true;
								});
								// $('.boat-lottery-mod img').eq(type.index).removeClass('clicked').attr('src','images/zongzi/wz'+ index +'static.png');
								$('.boat-lottery-mod img').eq(type.index).removeClass('clicked').attr('src','images/zongzi/zongzi.png');
							},1500);
							if ($scope.investData.useCount < 3) {
								$scope.investData.useCount ++;
							}
						break;	
					}
				}
			break;
		}
	});

	if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined){
		$localStorage.webFormPath = $location.$$search;
	};

	/*退出*/
	$scope.userOut = function (event) {
		$filter('清空缓存')();
		resourceService.queryPost($scope,$filter('交互接口对照表')('退出接口'),{},'退出');

		if($location.$$url.indexOf('myAccount') != -1){
			$filter("跳转页面")('denLu','main.myAccount.accountHome','dl');
		};
	};
	$scope.gotoLoginPage = function() {
		$filter("clickTouZiGotoWhere")($scope,'main.myAccount.accountHome');
	};

	$scope.gotoPageLogin = function() {
		$filter("跳转页面")('denLu','dragonBoat','dl');
		// resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},'首页主数据');
	};

	var mySwiper = new Swiper('.swiper-container', {
        slidesPerView: 6,
        paginationClickable: true
    });
	$('.partners .swiper-button-prev').on('click', function(e){
		e.preventDefault();
		mySwiper.swipePrev();
	});
	$('.partners .swiper-button-next').on('click', function(e){
		e.preventDefault();
		mySwiper.swipeNext();
	});
	$scope.getLotteryGift = function(index,event) {
		var $this = $(event.currentTarget);
		if ($scope.isLogin == false) {
			return;
		}
		if($this.hasClass('clicked') || $scope.isClick || $scope.nogift || $scope.getnext || $scope.getgift) {
			return;
		}
		if ($scope.investData.useCount >= 3) {
			$scope.getnext = true;
			return;
		}
		$scope.isClick = true;
		$this.addClass('clicked');
		resourceService.queryPost($scope,$filter('交互接口对照表')('端午节抽奖'),{},{name:'端午节抽奖',index:index,$this:$this});
	};

	if($localStorage.user != undefined){
		resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},{name:'首页主数据'});
	}
	
}])