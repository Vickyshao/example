mainModule.controller('regCtrl', ['$rootScope','$scope', '$state', '$localStorage', 'resourceService','$filter','ngDialog','$location','storage',function($rootScope,$scope, $state, $localStorage,resourceService,$filter,ngDialog,$location,storage) {

	if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
        $localStorage.webFormPath = $location.$$search;
    }

	$scope.isLogin = $filter('isRegister')().register;
	$localStorage.regACTURL = 'main.home';
    if ($location.$$path == '/reg/iphone') {
        $localStorage.regACTURL = 'newlayout.special';
		resourceService.queryPost($scope,$filter('交互接口对照表')('iPhoneSEM'),{},{name: 'iPhoneSEM'});
    } else if ($location.$$path == '/regfinance') {
    	// $localStorage.regACTURL = 'newlayout.finance';
    	$localStorage.regACTURL = 'main.home';
		resourceService.queryPost($scope,$filter('交互接口对照表')('financeSEM'),{},{name: 'financeSEM'});
    } else if ($location.$$path == '/reg/hold') {
    	$localStorage.regACTURL = 'main.conference';
    } else if ($location.$$path == '/reg/investgift') {
    	$localStorage.regACTURL = 'extend.investgift';
    	var $list = $('.investbox .list table'),
    		$proTable = $('.investpro .slide table');
    	resourceService.queryPost($scope,$filter('交互接口对照表')('投即送活动页数据'),{},{name:'投即送活动页数据'});
    }

    if ($scope.isLogin) {
		resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},{name: '首页主数据'});
		if ($location.$$path == '/regfinance') {
			resourceService.queryPost($scope,$filter('交互接口对照表')('活动页账户信息'),{},{name: '活动页账户信息'});
		}
    }

	$scope.showREG = true;
	$scope.showTab = 'a';

	// 监听退出是否成功
	$rootScope.$on('exitSuccess', function(event, flag) {
		if (flag) {
			$scope.isLogin = false;
		}
	});

	// 监听登录是否成功
	$scope.$on('loginSuccess', function(event, flag) {
		if (flag) {
			$scope.isLogin = true;
			if($localStorage.user != undefined){
				resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},{name: '首页主数据'});
			}
		}
	});

	var $table = $('.semfinance-mode .box table');


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
			case "iPhoneSEM":
				$scope.investCount = data.map.investCount;
				$scope.prizeCount = data.map.prizeCount;
				$scope.semIphoneInfo = data.map.info;
			break;
			case "financeSEM":
				$scope.financeList = data.map.list;
				$scope.regSendCount = data.map.regSendCount;
				if ($scope.financeList.length%2 == 1){
					$scope.financeList.length --;
				}
				if ($scope.financeList.length > 8) {
					setInterval(function() {
						$table.animate({'margin-top':'-38px'},500,function() {
							$table.find('tr').eq(0).appendTo($table);
							$table.css('margin-top',0);
						})
					}, 3000);
				}
			break;
			case "投即送活动页数据":
				if (data.success) {
					$scope.investList = data.map.investList;
					$scope.investgiftCount = data.map.investCount;
					if ($scope.investList.length > 5) {
						setInterval(function() {
							$list.animate({'margin-top':'-36px'},500,function() {
								$list.find('tr').eq(0).appendTo($list);
								$list.css('margin-top',0);
							});
						}, 3000);
					}
				}
			break;
			case '活动页账户信息':
                if (data.success) {
                    $scope.account = data.map;
                }
            break;
		}
	});

	$scope.accountUserOut = function (event) {
        $filter('清空缓存')();
        resourceService.queryPost($scope,$filter('交互接口对照表')('退出接口'),{},'退出');

        $rootScope.$emit('exitSuccess',true);
    };

	var $regiphoneNext = $('.regiphone-next'),
		$regiphonePrev = $('.regiphone-prev'),
		$containerWrap = $('.container-wrap .container'),
		goFanYe = false;
	$regiphoneNext.on('click',function() {
		if (!goFanYe) {
			goFanYe = true;
			$containerWrap.stop().animate({'marginLeft':parseInt($containerWrap.css('marginLeft'))-1192},300,function() {
				if (parseInt($containerWrap.css('marginLeft')) <= -3576) {
					$containerWrap.css('marginLeft',0);
				}
				goFanYe = false;
			});
		}
	});
	$regiphonePrev.on('click',function() {
		if (!goFanYe) {
			goFanYe = true;
			if (parseInt($containerWrap.css('marginLeft')) >= 0) {
				$containerWrap.css('marginLeft',-3576);
			}
			$containerWrap.stop().animate({'marginLeft':parseInt($containerWrap.css('marginLeft'))+1192},300,function() {
				goFanYe = false;
			});
		}
	});

	$scope.alertRegLoginDialog = function() {
		$filter('推广页登录注册弹窗')($scope);
	};
	$scope.alertRegDialog = function() {
		$filter('推广页注册弹窗')($scope);
	};

	$scope.showVideo = false;
	$scope.closeVideo = function() {
		$scope.showVideo = false;
	};
	$scope.noGoDetail = function(e) {
		e.stopPropagation();
	};

	$scope.setTable = function() {
		$table.find('tr:even').addClass('bg');
	};
	$scope.showLeft = true;
	$scope.slidePro = function(side) {
		if (side == 'left') {
			$proTable.animate({'margin-left':'-1px'},200);
			$scope.showLeft = true;
		} else {
			$proTable.animate({'margin-left':'-249px'},200);
			$scope.showLeft = false;
		}
	};

	$scope.closeFinanceDialog = function(flag) {
		ngDialog.closeAll();
		if (flag == false) {
			$filter('推广页注册弹窗')($scope);
		} else if (flag == true) {
			$filter('推广页不注册弹窗')($scope);
		}
	}

}])