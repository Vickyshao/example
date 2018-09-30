mainModule.controller('loveCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService',function($rootScope,$scope,$location,$localStorage,$filter,resourceService) {
	$rootScope.title = '520为爱去投资';
	if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined){
		$localStorage.webFormPath = $location.$$search;
	};
	$scope.redbagFlag = false;
	if (!$filter('isRegister')().register) {
		$scope.login = false;
	} else {
		$scope.login = true;
		resourceService.queryPost($scope,$filter('交互接口对照表')('领券信息'),{type:1},'领券信息');
	}
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type) {
			case "领券信息":
				$scope.redbagFlag = data.flag;
				if(data.flag) {
					$scope.redBagText = '立即使用';
				} else {
					$scope.redBagText = '立即抢钱';
				}
			break;
		}
	});
	var mySwiper = new Swiper('.swiper-container', {
        // nextButton: '.partners .swiper-button-next',
        // prevButton: '.partners .swiper-button-prev',
        slidesPerView: 6,
        paginationClickable: true
    });
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
}])
