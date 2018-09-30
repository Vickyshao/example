mainModule.controller('tanabataCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService',function($rootScope,$scope,$location,$localStorage,$filter,resourceService) {
	$rootScope.title = '浪漫七夕，相约沪深';

	var $lotteryBtn = $("#lotteryBtn"),
		timer;

	$scope.lotteryNum = 0;
	$scope.showMylist = false;
	$scope.noinvest = false;
	$scope.runout = false;
	$scope.showwin = false;
	$scope.nologin = false;
	$scope.nochance = false;
	$scope.isDraw = false;

	/* 页面加载数据 */
	$scope.refresh = function() {
		resourceService.queryPost($scope,$filter('交互接口对照表')('七夕中奖名单'),{},'七夕中奖名单');
	};

	/* 抽奖 */
	$scope.luckDraw = function() {
		if ($scope.isDraw) {
			return;
		}
		if (!$filter('isRegister')().register) {
			$scope.nologin = true;
		} else {
			$scope.isDraw = true;
			resourceService.queryPost($scope,$filter('交互接口对照表')('七夕抽奖'),{},'七夕抽奖');
		}
	}

	$scope.refresh();

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type) {
			case "七夕中奖名单":
				if (data.success) {
					$scope.nochance = false;
				} else {
					$scope.nochance = true;
				}
				$scope.lotteryNum = data.map.count;
				$scope.lotteryCount = data.map.lotteryCount;
				$scope.winlist = data.map.all;
				if ($scope.winlist.length > 4) {
					clearInterval(timer);
					timer = setInterval(function() {
						$('.tanabata-list ul').animate({'margin-top':'-37px'},500,function() {
							var $clone = $('.tanabata-list ul li').eq(0);
							$('.tanabata-list ul li').eq(0).remove();
							$clone.appendTo('.tanabata-list ul');
							$('.tanabata-list ul').css('margin-top',0);
						});
					}, 3000);
				}
			break;

			case "我的奖品":
				if (data.success) {
					$scope.mylist = data.map.page.rows;
					// $scope.allUserNumPast = data.map.page.rows.length;
					$scope.mylistPage = data.map.page;
					// $scope.totalPast = data.map.page.total;
					$scope.mylistPage.pages = [];

					// $scope.totalPage = data.map.page.totalPage;
					for(var i = 0; i < parseInt($scope.mylistPage.totalPage); i ++){
						$scope.mylistPage.pages[i] = i+1;
					};
				}
			break;

			case "七夕抽奖":
				if (data.success) {
					$scope.winText = data.map.name;
					if (data.map.id == 5 || data.map.id == 6 || data.map.id == 7) {
						rotateFunc(0);
					} else if (data.map.id == 2 || data.map.id == 3) {
						rotateFunc(60);
					} else if (data.map.id == 11 || data.map.id == 12 || data.map.id == 13) {
						rotateFunc(120);
					} else if (data.map.id == 4) {
						rotateFunc(180);
					} else if (data.map.id == 8 || data.map.id == 9 || data.map.id == 10) {
						rotateFunc(240);
					} else if (data.map.id == 1) {
						rotateFunc(300);
					}
				} else {
					if (data.errorCode == '1001') {
						$scope.nochance = true;
					} else if (data.errorCode == '1002') {
						$scope.runout = true;
					} else if (data.errorCode == '1003') {
						$.qTip({
							'type': false,
							'text': '本活动已结束'
						});
					} else if (data.errorCode == '1004') {
						$scope.noinvest = true;
					} else if (data.errorCode == '1005') {
						$scope.nologin = true;
					}
				}
			break;
		}
	});

	$scope.checkMylist = function() {
		resourceService.queryPost($scope,$filter('交互接口对照表')('七夕我的奖品'),{pageOn: 1,pageSize: 5},'我的奖品');
		$scope.showMylist = true;
	};

	$scope.goPage = function (scope) {
        var obj = {};
        obj.pageOn = scope.mylistPage.pageOn;
        obj.pageSize = 5;
        resourceService.queryPost($scope,$filter('交互接口对照表')('七夕我的奖品'),obj,'我的奖品');
    };

	$scope.changePage = function (type,pageNum) {
        switch(type){
            case "beforPage":
                if($scope.mylistPage.pageOn > 1){$scope.mylistPage.pageOn -=1;$scope.goPage($scope);};
            break;
            case "currentPage":
                $scope.mylistPage.pageOn = pageNum;$scope.goPage($scope);
            break;
            case "nextPage":
                if($scope.mylistPage.pageOn < $scope.mylistPage.pages.length){$scope.mylistPage.pageOn +=1;$scope.goPage($scope);};
            break;
        };
    };

	var rotateFunc = function(angle){  //awards:奖项，angle:奖项对应的角度
		$lotteryBtn.stopRotate();
		$lotteryBtn.rotate({
			angle:0, 
			duration: 5000, 
			animateTo: angle+2160, //angle是图片上各奖项对应的角度，1440是我要让指针旋转4圈。所以最后的结束的角度就是这样子^^
			callback:function(){
				$scope.$apply(function() {
					$scope.showwin = true;
					$scope.refresh();
				});
			}
		}); 
	};

	var mySwiper = new Swiper('.swiper-container', {
        // nextButton: '.partners .swiper-button-next',
        // prevButton: '.partners .swiper-button-prev',
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