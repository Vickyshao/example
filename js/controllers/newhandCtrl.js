mainModule.controller('newhandCtrl', ['$rootScope','$scope', '$state', '$localStorage', 'resourceService','$filter','ngDialog','$location','storage',function($rootScope,$scope, $state, $localStorage,resourceService,$filter,ngDialog,$location,storage) {

	if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
        $localStorage.webFormPath = $location.$$search;
    }
    alert(1);

	$scope.isLogin = $filter('isRegister')().register;

	resourceService.queryPost($scope,$filter('交互接口对照表')('financeSEM'),{},{name: 'financeSEM'});
    resourceService.queryPost($scope,$filter('交互接口对照表')('产品列表'),{},'产品列表');

    if ($scope.isLogin) {
		resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},{name: '首页主数据'});
		if ($location.$$path == '/regfinance') {
			resourceService.queryPost($scope,$filter('交互接口对照表')('活动页账户信息'),{},{name: '活动页账户信息'});
		}
    }

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
                console.log(data);
				$scope.user = data.map;
				console.log(data);
				if (data.map.realName == '' || data.map.realName == undefined) {
					$scope.user.userName = '亲爱的用户';
				} else {
					$scope.user.userName = data.map.realName;
				}
				$localStorage.user = $scope.user;
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
		}
	});

	$scope.accountUserOut = function (event) {
        $filter('清空缓存')();
        resourceService.queryPost($scope,$filter('交互接口对照表')('退出接口'),{},'退出');

        $rootScope.$emit('exitSuccess',true);
    };

	$scope.noGoDetail = function(e) {
		e.stopPropagation();
	};

	$scope.setTable = function() {
		$table.find('tr:even').addClass('bg');
	};

}])