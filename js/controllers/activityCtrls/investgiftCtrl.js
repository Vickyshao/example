mainModule.controller('investgiftCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService','$state','ngDialog','$timeout',function($rootScope,$scope,$location,$localStorage,$filter,resourceService,$state,ngDialog,$timeout) {
	$rootScope.title = '豪礼钜献 0元狂享';
	$('html,body').animate({scrollTop:0});

	var $swiperWrapper = $('.card-wrap .swiper-wrapper'),
		isSubmit = false;

	if ($location.$$path == '/newlayout/investgift') {
        var obj = $location.$$search;
        $state.go('extend.investgift',obj);
    }

	$scope.isLogin = $filter('isRegister')().register;
	$scope.product = {};
	$scope.showTip = false;

	if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined){
		$localStorage.webFormPath = $location.$$search;
	}

	// 监听退出是否成功
	$rootScope.$on('exitSuccess', function(event, flag) {
		if (flag) {
			$scope.isLogin = false;
		}
	});

	$scope.bookStatus = 'before';

	if($localStorage.user != undefined){
		$scope.uid = $localStorage.user.uid;
		resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},'首页主数据');
	}

	var $list = $('.list table');

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
			case "投即送活动页数据":
				if (data.success) {
					$scope.prizeList = data.map.prizeList;
					$scope.investList = data.map.investList;
					$scope.orderShareList = data.map.orderShareList;
					$scope.investCount = data.map.investCount;

					if ($scope.prizeList.length < 8) {
						var prizeLength = $scope.prizeList.length;
						for (var i = prizeLength; i<8; i++) {
							$scope.prizeList[i] = [];
						}
					} else if ($scope.prizeList.length > 8) {
						$scope.prizeList.length = 8;
					}
					for (var j = 0; j<8; j++) {
						if ($scope.prizeList[j].rate == undefined) {
							$scope.prizeList[j].rate = 8.5;
						}
						if ($scope.prizeList[j].activityRate == undefined) {
							$scope.prizeList[j].activityRate = 3;
						}
						if ($scope.prizeList[j].deadline == undefined) {
							$scope.prizeList[j].deadline = 90;
						}
					}
					if ($scope.investList.length > 6) {
						setInterval(function() {
							$list.animate({'margin-top':'-36px'},500,function() {
								$list.find('tr').eq(0).appendTo($list);
								$list.css('margin-top',0);
							});
						}, 3000);
					}

					var orderLength = $scope.orderShareList.length,
						shareStr = '';
					if (orderLength>0) {
						for (var k=0;k<orderLength;k++) {
							shareStr += '<div class="swiper-slide"><img src="'+ $scope.orderShareList[k].pcImgUrl +'"></div>'
						}
						$swiperWrapper.html(shareStr);
					}
					$timeout(function(){
                		var mySwiper = new Swiper('.user .swiper-container',{
				            loop:true,
				            grabCursor: true,
				            paginationClickable: true,
				            autoplay: 3000,
				            pagination: '.user .swiper-pagination'
				        });
                	});
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
			case "投即送心愿提交":
				if (data.success) {
					$scope.showQ = false;
    				$filter('投即送常见问题弹窗')($scope);
    				isSubmit = false;
				} else {
					if (data.errorCode == '1001') {
						$scope.showTip = true;
					} else {
						$.qTip({
							'type': false,
							'text': data.errorMsg
						});
					}
					isSubmit = false;
				}
			break;
		}
	});

	$scope.closeDialog = function(bool) {
		ngDialog.closeAll();
		$scope.bookStatus = 'before';
	};

	// 预定弹窗
	$scope.bookGift = function(item) {
		if (!$scope.isLogin) {
			$localStorage.activityUrl = 'extend.investgift';
			$state.go('dl',{fromActivity:true});
			return;
		}
		$scope.prize = item;
		$scope.product.rate = $scope.prize.rate;
		$scope.product.activityRate = $scope.prize.activityRate;
		$scope.product.nowNum = $scope.prize.amount;
		$scope.product.deadline = $scope.prize.deadline;
		$filter('投即送预约弹窗')($scope);
	};
	$scope.bookNow = function() {
		resourceService.queryPost($scope,$filter('交互接口对照表')('投即送预约'),{ppid:$scope.prize.id},'投即送预约');
	};

	resourceService.queryPost($scope,$filter('交互接口对照表')('投即送活动页数据'),{},'投即送活动页数据');
	var $window = $(window),
        $toTop = $('.poster-totop'),
        $hb = $('html,body');
    $scope.toTop = function() {
        $hb.animate({scrollTop: 0}, 300);
    };
    $window.on('resize scroll load', function() {
        if ($hb.height() - $window.scrollTop() - $window.height() < 275) {
            $toTop.addClass('totop');
        } else {
            $toTop.removeClass('totop');
        }
    });

    $('.device').on('mouseout', function() {
        mySwiper.startAutoplay();
    }).on('mouseover', function() {
        mySwiper.stopAutoplay();
    });

    $scope.showQuestion = function() {
    	$scope.showQ = true;
    	$filter('投即送常见问题弹窗')($scope);
    };

    $scope.closeAskDialog = function() {
        ngDialog.closeAll();
        $mylink.val('');
        $wishtype.val('');
    };

    var $mylink = $('#mylink'),
    	$wishtype = $('#wishtype');
    $scope.subWish = function() {
    	isSubmit = false;
    	if (!$scope.isLogin) {
			$localStorage.activityUrl = 'extend.investgift';
			$state.go('dl',{fromActivity:true});
			return;
		}
    	if ($mylink.val() == '') {
    		$mylink.focus();
    		return;
    	} else if (!isUrl($mylink.val())) {
    		$.qTip({
				'type': false,
				'text': '请输入正确的网址'
			});
			$mylink.focus();
			return;
    	} else if (isSubmit) {
    		return;
    	} else {
    		isSubmit = true;
			resourceService.queryPost($scope,$filter('交互接口对照表')('投即送心愿提交'),{
				url: $mylink.val(),
				remarks: $wishtype.val()
			},'投即送心愿提交');
    	}
    }

    function isUrl(str){
		return !!str.match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g);
	}

    $scope.testUrl = function() {
		if($mylink.val()!= '' && !isUrl($mylink.val())) {
    		$.qTip({
				'type': false,
				'text': '请输入正确的网址'
			});
			$mylink.focus();
			return;
    	}
    };

}])