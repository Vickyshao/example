mainModule.controller('inviteCtrl', ['$state','$rootScope','$scope','$location','$localStorage','$filter','resourceService','ngDialog',function($state,$rootScope,$scope,$location,$localStorage,$filter,resourceService,ngDialog) {
	$rootScope.title = '有钱一起赚，人脉变钱脉';
	$localStorage.activityUrl = 'extend.invite';

	if ($location.$$path == '/newlayout/invite') {
        var obj = $location.$$search;
        $state.go('extend.invite',obj);
    }

	if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
        $localStorage.webFormPath = $location.$$search;
    }

    $scope.showRulesA = $scope.showRulesB = $scope.showRulesC = false;

	$scope.isLogin = $filter('isRegister')().register;
	if ($scope.isLogin) {
    	resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},'首页主数据');
	}

	if ($localStorage.user) {
		$scope.myPhone = $localStorage.user.mobilephone;
	}

	// 计算器
	$scope.checkType = 'C';
	$scope.amount = 50000;
	$scope.percentage = 0.3;
	$scope.deadline = 180;
	$scope.rate = 10.5;
	$scope.alertCal = function() {
		$filter('计算器弹窗')($scope);
	};

	$scope.changeType = function(type) {
		switch(type) {
			case 'A':
				$scope.checkType = 'A';
				$scope.deadline = 35;
				$scope.rate = 6;
			break;
			case 'B':
				$scope.checkType = 'B';
				$scope.deadline = 60;
				$scope.rate = 7.5;
			break;
			case 'C':
				$scope.checkType = 'C';
				$scope.deadline = 180;
				$scope.rate = 10.5;
			break;
		}
	};

	$scope.closeDialog = function() {
		ngDialog.closeAll();
	};

	// 监听退出是否成功
	$rootScope.$on('exitSuccess', function(event, flag) {
		if (flag) {
			$scope.isLogin = false;
		}
	});

	// 复制并打开链接
	$scope.copy = function() {
		$('#mycopy').select(); // 选择对象
		document.execCommand("Copy"); // 执行浏览器复制命令
		alert("已复制好，可贴粘。");
	};

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
		switch(type){
			case "首页主数据":
				$scope.user = data.map;
				if (data.map.realName == '' || data.map.realName == undefined) {
					$scope.user.userName = '亲爱的用户';
				} else {
					$scope.user.userName = data.map.realName;
				}
				$localStorage.user = $scope.user;
				$scope.myPhone = $localStorage.user.mobilephone;
			break;
			case "三重礼排行榜":
				if (data.success) {
					$scope.top = data.map.top;
					if ($scope.top!=undefined) {
						if ($scope.top.length>10) {
							$scope.top.length = 10;
						}
					}
					$scope.info = data.map.activity;
					$scope.recommCode = data.map.recommCode;
				}
			break;
		}
	});

	// 底部悬浮
	var $hb = $('html,body'),
		$window = $(window),
		$bottom = $('.bottom-line');
	$bottom.hide();
	$window.on('scroll resize',function(){
		// var myH = $hb.height()-$window.height()-$window.scrollTop();
		// if (myH <= 414 && $bottom.css('position') == 'fixed') {
		// 	$bottom.css({'position':'absolute','bottom':myH-174});
		// 	$bottom.animate({'bottom':0},500);
		// } else if (myH > 414 && $bottom.css('position') == 'absolute') {
		// 	$bottom.css({'position':'fixed','bottom':-myH});
		// 	$bottom.animate({'bottom':0},1000);
		// }

		var myH = $hb.height()-$window.height()-$window.scrollTop();
		if (myH <= 500) {
			$bottom.slideUp(300);
		} else if (myH > 500) {
			$bottom.slideDown(300);
		}
	});

	$scope.goBot = function() {
		$hb.animate({scrollTop:$hb.height()-414},500);
	};


	// 倒计时
	$scope.getRTime = function() {
		var myday = $filter('date')($scope.info.endDate, "yyyy/MM/dd HH:mm:ss");
		var EndTime= new Date(myday); //截止时间 
		var NowTime = new Date(); 
		var t =EndTime.getTime() - NowTime.getTime(); 
		$scope.$apply(function() {
			$scope.day=Math.floor(t/1000/60/60/24); 
			$scope.hour=Math.floor(t/1000/60/60%24); 
			$scope.minute=Math.floor(t/1000/60%60); 
			$scope.second=Math.floor(t/1000%60);
		});
		if ($scope.day <= 0 && $scope.hour <= 0 && $scope.minute <= 0 && $scope.second <= 0) {
			clearInterval(timer);
			$scope.$apply(function() {
				$scope.showBtn = true;
			});
		}
	};
	var timer = setInterval($scope.getRTime,1000);

	resourceService.queryPost($scope,$filter('交互接口对照表')('三重礼排行榜'),{},'三重礼排行榜');

}])