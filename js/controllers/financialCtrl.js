mainModule.controller('financialCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService',function($rootScope,$scope,$location,$localStorage,$filter,resourceService) {
	$rootScope.title = '618沪深理财节';
	$scope.showBtn = false;
	if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined){
		$localStorage.webFormPath = $location.$$search;
	};
	$scope.redbagFlag = false;
	if (!$filter('isRegister')().register) {
		$scope.login = false;
		$scope.redBagText = '立即抢钱';
	} else {
		$scope.login = true;
		resourceService.queryPost($scope,$filter('交互接口对照表')('领券信息'),{type:1},'领券信息');
	}
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type) {
			case '首页主数据':
				if (data.success) {
					$localStorage.user = data.map;
				}
			break;
			case "领券信息":
				$scope.redbagFlag = data.flag;
			break;
		}
	});
	var mySwiper = new Swiper('.swiper-container', {
        // nextButton: '.partners .swiper-button-next',
        // prevButton: '.partners .swiper-button-prev',
        slidesPerView: 6,
        paginationClickable: true
    });

	if($localStorage.user != undefined){
		resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},'首页主数据');
	}

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
	$('.partners .swiper-button-prev').on('click', function(e){
		e.preventDefault();
		mySwiper.swipePrev();
	});
	$('.partners .swiper-button-next').on('click', function(e){
		e.preventDefault();
		mySwiper.swipeNext();
	});

	$scope.gotoPageLogin = function() {
		$filter("跳转页面")('denLu','financial','dl');
	};

	$scope.day = 0;
	$scope.hour1 = 0;
	$scope.hour2 = 0;
	$scope.minute1 = 0;
	$scope.minute2 = 0;
	$scope.second1 = 0;
	$scope.second2 = 0;

	var $time = $('.time');

	$scope.getRTime = function() { 
		var EndTime= new Date('2016/6/11 10:00:00'); //截止时间 
		var NowTime = new Date(); 
		var t =EndTime.getTime() - NowTime.getTime(); 
		$scope.$apply(function() {
			$scope.day=Math.floor(t/1000/60/60/24); 
			$scope.hour=Math.floor(t/1000/60/60%24); 
			$scope.minute=Math.floor(t/1000/60%60); 
			$scope.second=Math.floor(t/1000%60);
			$scope.hour1 =$scope.hour.toString().substr(-1,1);
			$scope.hour2 =  $scope.hour.toString().length == 1 ? '0' : $scope.hour.toString().substr(-2,1);
			$scope.minute1 = $scope.minute.toString().substr(-1,1);
			$scope.minute2 = $scope.minute.toString().length == 1 ? '0' : $scope.minute.toString().substr(-2,1);
			$scope.second1 = $scope.second.toString().substr(-1,1);
			$scope.second2 = $scope.second.toString().length == 1 ? '0' : $scope.second.toString().substr(-2,1);
		});
		if ($scope.day <= 0 && $scope.hour <= 0 && $scope.minute <= 0 && $scope.second <= 0) {
			clearInterval(timer);
			$scope.$apply(function() {
				$scope.showBtn = true;
			});
		}
	} 
	var timer = setInterval($scope.getRTime,1000);
}])