mainModule.controller('specialCtrl', ['$rootScope','$scope', '$state', '$localStorage', 'resourceService','$filter','ngDialog','$location','storage','$timeout',function($rootScope,$scope, $state, $localStorage,resourceService,$filter,ngDialog,$location,storage,$timeout) {
	$scope.product = {};
	$scope.history = [];
	$scope.upList = true;
	$rootScope.title = '你换iPhone7我买单';
	var $slideOne = $('.slideone ul'),
		$slideTwo = $('.slidetwo ul'),
		$dataTable = $('.news-inner ul'),
		mySwiper;
	$('html,body').animate({scrollTop:0});
	if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
        $localStorage.webFormPath = $location.$$search;
    }

	$scope.isLogin = $filter('isRegister')().register;

	$scope.alertLogin = function() {
		$scope.specialDialogTag = true;
		$filter('登录弹窗')($scope);
	};

	// 监听登录是否成功
	$scope.$on('loginSuccess', function(event, flag) {
		if (flag) {
			$scope.isLogin = true;
			if($localStorage.user != undefined){
				resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},{name: '首页主数据'});
			}
			if ($scope.isLogin) {
				resourceService.queryPost($scope,$filter('交互接口对照表')('我的幸运码'),{
					id:$scope.product.id
				},{name: '我的幸运码'});
				resourceService.queryPost($scope,$filter('交互接口对照表')('活动标详情'),{},{name: '活动标详情'});
			}
			ngDialog.closeAll();
		}
	});

	// 监听退出是否成功
	$rootScope.$on('exitSuccess', function(event, flag) {
		if (flag) {
			$scope.isLogin = false;
		}
	});

	// input数值onblur
	$scope.setNum = function() {
		$scope.product.nowNum = parseInt($scope.product.nowNum);
		if(angular.equals($scope.product.nowNum,NaN)){
			$scope.product.nowNum = 0;
		}
		if($scope.product.nowNum > $scope.product.maxAmount){
			$scope.product.nowNum = $scope.product.maxAmount;
		}
		if(($scope.product.nowNum - $scope.product.leastaAmount)%$scope.product.increasAmount != 0 ){
			$scope.product.nowNum -= ($scope.product.nowNum - $scope.product.leastaAmount)%$scope.product.increasAmount;
		}
		$localStorage.specialNowNum = $scope.product.nowNum;
	};

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
		switch(type.name){
			case "首页主数据":
				$scope.user = data.map;
				if (data.map.realName == '' || data.map.realName == undefined) {
					$scope.user.userName = '亲爱的用户';
				} else {
					$scope.user.userName = data.map.realName;
				}
				$localStorage.user = $scope.user;
			break;
			case "我的幸运码":
				if (data.success) {
					$scope.luckAmount = data.map.luckAmount;
					if ($scope.luckAmount) {
						$scope.luckCodes = data.map.luckCodes.split(',');
					}
				}
			break;
			case "活动标详情":
				if (data.success) {
					$scope.activityPeriods = data.map.activityPeriods;
					$scope.product = data.map.result;
					$scope.investTotal = data.map.investTotal;
					$scope.codeFixation = data.map.codeFixation;

					$scope.newTrends = data.map.newTrends;

					if ($scope.isLogin) {
						resourceService.queryPost($scope,$filter('交互接口对照表')('我的幸运码'),{
							id:$scope.product.id
						},{name: '我的幸运码'});
					}
					// $localStorage.specialNowNum = $scope.product.leastaAmount;
					$scope.setHotbar($scope.product.pert);
					$localStorage.specialId = $scope.product.id;
					if (data.map.isReservation != undefined) {
						$scope.isReservation = data.map.isReservation;
					} else {
						$scope.isReservation = false;
					}

					if ($scope.newTrends.length > 6) {
						setInterval(function() {
							$dataTable.animate({'margin-top': '-78px'},500,function() {
								$dataTable.find('li').eq(0).appendTo($dataTable);
								$dataTable.css('margin-top',0);
							});
						}, 3000);
					}
				}
			break;
			case "活动开奖结果":
				if (data.success) {
                    $scope.history = data.map.history;
                    $scope.historyOne = [];
                    $scope.historyTwo = [];
                    if ($scope.history.length > 8) {
                    	$scope.history.length = 8;
                    }
                    var historyLength = $scope.history.length,
                    	strOne='',
                    	strTwo='';
					for (var i = 0; i < historyLength; i++) {
                    	if ($scope.history[i].prizeContent != undefined) {
                    		if ($scope.history[i].prizeContent.length > 30) {
                    			$scope.history[i].prizeContent = $scope.history[i].prizeContent.substr(0,30) + '...';
                    		}
                    	}
                    	if (i<4) {
                    		strOne += '<li><img src="'+$scope.history[i].prizeHeadPhoto+'"><div>'+
										'<span>获奖者感言</span>'+
										'<p>'+$scope.history[i].prizeContent+'</p>'+
									'</div></li>';
                    	} else {
                    		strTwo += '<li><img src="'+$scope.history[i].prizeHeadPhoto+'"><div>'+
										'<span>获奖者感言</span>'+
										'<p>'+$scope.history[i].prizeContent+'</p>'+
									'</div></li>';
                    	}
                    }
                    $slideOne.html(strOne);
                    $slideTwo.html(strTwo);
            		$timeout(function(){
                		mySwiper = new Swiper('.winlist .swiper-container', {
					        loop: true,
					        autoplay: 3000,
					        nextButton: '.winbox .iphone-next',
					        loopAdditionalSlides: 1
					    });
                	});

                    $scope.winnerListDesc = data.map.winnerListDesc;
                    if ($scope.winnerListDesc.length > 5) {
                    	$scope.winnerListDesc.length = 5;
                    }

				}
			break;
		}
	});

	// 半圆进度条
	$scope.setHotbar = function(pert) {
    	var bar = new ProgressBar.SemiCircle(container, {
			strokeWidth: 5,
			easing: 'easeInOut',
			duration: 1400,
			color: '#ffca68',
			trailColor: '#edeeeb',
			trailWidth: 5,
			svgStyle: null
		});
		bar.animate(pert/100);
	};

	$scope.gotoDetail = function(id){
		storage.storageData=true;
		$state.go('main.billDetail',{id:id}); 
	};
	
	$scope.closeDialog = function() {
		ngDialog.closeAll();
	};

	$scope.alertCode = function() {
		// 我的幸运码
		$filter('幸运码弹窗')($scope);
	};

	$scope.changeUpList = function() {
		$scope.upList = !$scope.upList;
	};

	// 活动标详情
	resourceService.queryPost($scope,$filter('交互接口对照表')('活动标详情'),{},{name: '活动标详情'});

	// 活动开奖结果
	resourceService.queryPost($scope,$filter('交互接口对照表')('活动开奖结果'),{},{name: '活动开奖结果'});

}])