mainModule.controller('seckillCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService','$state','ngDialog',function($rootScope,$scope,$location,$localStorage,$filter,resourceService,$state,ngDialog) {
	$rootScope.title = '端午福利 10万贴息为您放送';
	$scope.isLogin = $filter('isRegister')().register;
	var $table = $('.list-box .box table'),
		timer;

	$scope.hour=0; 
	$scope.minute=0; 
	$scope.second=0;

	// 监听退出是否成功
	$rootScope.$on('exitSuccess', function(event, flag) {
		if (flag) {
			$scope.isLogin = false;
		}
	});

	if($localStorage.user != undefined){
		$scope.uid = $localStorage.user.uid;
		resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},'首页主数据');
	}

	resourceService.queryPost($scope,$filter('交互接口对照表')('端午节活动'),{},'端午节活动');

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type) {
			case "首页主数据":
				$scope.user = data.map;
				if (data.map.realName == '' || data.map.realName == undefined) {
					$scope.user.userName = '亲爱的用户';
				} else {
					$scope.user.userName = data.map.realName;
				}
				$localStorage.user = $scope.user;
			break;
			case "端午节活动":
				if (data.success) {
					$scope.seckillTime = data.map.seckillTime;
					$scope.investLog = data.map.investLog;
					$scope.productInfo45 = data.map.productInfo45;
					$scope.productInfo75 = data.map.productInfo75;
					if ($scope.investLog.length > 6) {
						setInterval(function() {
							$table.animate({'margin-top': '-30px'},800,function() {
								$table.find('tr').eq(0).appendTo('.list-box .box table');
								$table.css('margin-top','0');
							});
						}, 1800);
					}
					if ($scope.seckillTime!=undefined && $scope.seckillTime!='' && $scope.seckillTime>0) {
						$scope.showTime = true;
						timer = setInterval($scope.getRTime,1000);
					} else {
						$scope.showTime = false;
					}
				}
			break;
		}
	});

	// 倒计时
	$scope.getRTime = function() {
		// var myday = $filter('date')($scope.seckillTime, "yyyy/MM/dd HH:mm:ss");
		// var EndTime= new Date(myday); //截止时间 
		// var NowTime = new Date(); 
		// var t =EndTime.getTime() - NowTime.getTime();
		var t = new Date($scope.seckillTime);

		$scope.$apply(function() {
			// $scope.day=Math.floor(t/1000/60/60/24); 
			// $scope.hour=Math.floor(t/60/60%24); 
			// $scope.minute=Math.floor(t/60%60); 
			// $scope.second=Math.floor(t%60);
			$scope.hour=Math.floor(t/1000/60/60); 
			$scope.minute=Math.floor(t/1000/60%60); 
			$scope.second=Math.floor(t/1000%60);
			$scope.seckillTime = $scope.seckillTime - 1000;
		});// $scope.day <= 0 && 
		if ($scope.hour <= 0 && $scope.minute <= 0 && $scope.second <= 0) {
			clearInterval(timer);
			$scope.$apply(function() {
				delete $scope.seckillTime;
				resourceService.queryPost($scope,$filter('交互接口对照表')('端午节活动'),{},'端午节活动');
			});
		}
	};
	

}])