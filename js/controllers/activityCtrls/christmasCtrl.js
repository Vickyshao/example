mainModule.controller('christmasCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService','$state','ngDialog',function($rootScope,$scope,$location,$localStorage,$filter,resourceService,$state,ngDialog) {
	$rootScope.title = '双诞嘉年华 一次赚过瘾';
	$scope.showMode = 'A';
	$localStorage.activityUrl = 'newlayout.christmas';
	$scope.isLogin = $filter('isRegister')().register;
	$scope.prizeError = false;

	var $window = $(window),
		$modeB = $('.modeb-wrap'),
		$modeC = $('.modec-wrap'),
		$hb = $('html,body');
	
	/*下雪*/
    $(".snow-canvas").snow();
    
    $scope.show = function(type) {
		switch(type) {
			case 'A':
				$hb.animate({scrollTop:$('.modea-wrap').offset().top - 34});
			break;
			case 'B':
				$hb.animate({scrollTop:$modeB.offset().top});
			break;
			case 'C':
				$hb.animate({scrollTop:$modeC.offset().top});
			break;
			case 'TOP':
				$hb.animate({scrollTop:0});
			break;
			case 'one':
				if ($scope.isLogin) {
					$hb.animate({scrollTop:$('.modea-wrap').offset().top - 34});
				}
			break;
		}
	};
    if ($location.$$search.goTear != undefined && $location.$$search.goTear == 'true') {
    	$scope.show('A');
    }

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

	
	$window.on('resize scroll load', function() {
		var standB = $modeB.offset().top-($window.height()/2 - 387/2),
			standC = $modeC.offset().top-($window.height()/2 - 387/2);
		if ($window.scrollTop() >= standB) {
			$scope.$apply(function() {
				$scope.showMode = 'B';
			});
			if ($window.scrollTop() >= standC) {
				$scope.$apply(function() {
					$scope.showMode = 'C';
				});
			}
		} else if ($window.scrollTop() < standB) {
			$scope.$apply(function() {
				$scope.showMode = 'A';
			});
		}
		if ($window.scrollTop() + $window.height() == $hb.height()) {
			$scope.showMode = 'C';
		}
		if ($window.width() < 1660) {
			$scope.littleWindow = true;
		} else {
			$scope.littleWindow = false;
		}
	});
	
	$scope.teadBag = function() {
		if (!$scope.isLogin) {
			$state.go('dl',{fromActivity:'true'})
		} else {
			resourceService.queryPost($scope,$filter('交互接口对照表')('圣诞节拆红包'),{},'圣诞节拆红包');
		}
	};

	$scope.goInvest = function() {
		ngDialog.closeAll();
		$scope.show('B');
	};

	$scope.goRules = function() {
		ngDialog.closeAll();
		$scope.show('C');
	};

	var $luckyNum = $('.lucky-num');

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
			case "圣诞节活动页数据":
				if (data.success) {
					$scope.isOldUser = data.map.isOldUser;
					$scope.pullCount = data.map.pullCount;
					$scope.productList = data.map.productList;
					$scope.addRate60 = data.map.activity_60;
					$scope.addRate180 = data.map.activity_180;
					$scope.luckyList = data.map.luckyList;
					if ($scope.luckyList.length > 3) {
						setInterval(function() {
							$luckyNum.animate({'margin-top':'-47px'},400,function() {
								$luckyNum.find('tr').eq(0).appendTo($luckyNum);
								$luckyNum.css('margin-top',0);
							});
						}, 3000);
					}
				}
			break;
			case "圣诞节拆红包":
				if (data.success) {
					$scope.pullCount = data.map.pullCount;
					$scope.amount = data.map.amount;
					$scope.isWin = true;
					$scope.prizeName = data.map.prizeName;
					$scope.prizeError = false;
					$filter('圣诞节弹窗')($scope);
				} else {
					$scope.isWin = false;
					if (data.errorCode == '1003' || data.errorCode == 1003) {
						$scope.prizeError = false;
						$filter('圣诞节弹窗')($scope);
					} else if (data.errorCode == '1002' || data.errorCode == 1002) {
						$scope.prizeError = true;
						$filter('圣诞节弹窗')($scope);
					} else if (data.errorCode == '1001' || data.errorCode == 1001) {
						alert('本活动已结束');
					}
				}
			break;
		}
	});

	// $filter('圣诞节弹窗')($scope);
	resourceService.queryPost($scope,$filter('交互接口对照表')('圣诞节活动页数据'),{},'圣诞节活动页数据');
	
}])