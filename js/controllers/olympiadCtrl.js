mainModule.controller('olympiadCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService',function($rootScope,$scope,$location,$localStorage,$filter,resourceService) {
	$rootScope.title = '再见里约，相约沪深';
	if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined){
		$localStorage.webFormPath = $location.$$search;
	};
	$scope.login = 0;
	if (!$filter('isRegister')().register) {
		$scope.login = 0;
		resourceService.queryPost($scope,$filter('交互接口对照表')('cp079获取投资数据'),{
			topNum:15,
			startDate:'2016-08-25 00:00:00',
			endDate:'2016-09-01 00:00:00'
		},'首页主数据');
	} else {
		$scope.login = 1;
		resourceService.queryPost($scope,$filter('交互接口对照表')('cp079获取投资数据'),{
			uid:$scope.uid,
			topNum:15,
			startDate:'2016-08-25 00:00:00',
			endDate:'2016-09-01 00:00:00'
		},'首页主数据');
	}
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type) {
			case '首页主数据':
			// data.map = {
			// 	investList:[
			// 		{total:23234,mobilePhone:12333333333},
			// 		{total:11111,mobilePhone:12333333333},
			// 		{total:222222,mobilePhone:12333333333},
			// 		{total:1111111,mobilePhone:12333333333},
			// 		{total:222222222,mobilePhone:12333333333},
			// 		{total:4444,mobilePhone:12333333333},
			// 		{total:55555555,mobilePhone:12333333333},
			// 		{total:2777,mobilePhone:12333333333},
			// 		{total:27774,mobilePhone:12333333333},
			// 		{total:2388884,mobilePhone:12333333333},
			// 		{total:44444,mobilePhone:12333333333},
			// 		{total:2399994,mobilePhone:12333333333}
			// 	],
			// 	memberInvest:0,
			// 	readTime:1471860234685
			// };
			// $scope.phList = data.map.investList;
			if (data.success) {
				$scope.isJoin = data.map.isJoin;
				$scope.phList = data.map.investList;
				$scope.end = data.map.readTime;
				$scope.memberInvest = data.map.memberInvest;
				var timer;
				clearInterval(timer);
				if (data.map.investList.length > 8) {
					timer = setInterval(function() {
						$('.prize-list').animate({'margin-top':'-40px'},500,function() {
							var $clone = $('.prize-list tr').eq(0);
							$('.prize-list tr').eq(0).remove();
							$clone.appendTo('.prize-list');
							$('.prize-list').css('margin-top',0);
						});
					}, 3000);
				}
			}				
			break;
		}
	});
    /*所有的点击事件*/
    $scope.onClick=function(name){
         switch(name){
            case '获取最新':
                resourceService.queryPost($scope,$filter('交互接口对照表')('cp079获取投资数据'),{
					uid:$scope.uid,
					topNum:15,
					startDate:'2016-08-25 00:00:00',
					endDate:'2016-09-01 00:00:00'
				},'首页主数据');
            break;
        };
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

}])