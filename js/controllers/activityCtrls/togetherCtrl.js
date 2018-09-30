mainModule.controller('togetherCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService','$state','ngDialog','storage',function($rootScope,$scope,$location,$localStorage,$filter,resourceService,$state,ngDialog,storage) {
	$rootScope.title = '活动专区-沪深理财';

	$scope.isLogin = $filter('isRegister')().register;
	$scope.showOn = true;
	$scope.showCode = 'wechat';
	$scope.oldNum = 0;
	$scope.newNum = 0;
	$scope.oldList = [];
	$scope.newList = [];

	$rootScope.activeNav = 'together';

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
			case "活动聚合页列表":
				if (data.success) {
					$scope.list = data.map.pageInfo.rows;
					var lengthlist = $scope.list.length;
                    for (var i = 0; i < lengthlist; i++) {
                    	if ($scope.list[i].status == 1) {
                    		$scope.newNum ++;
                    		$scope.newList.push($scope.list[i]);
                    	} else if ($scope.list[i].status == 2) {
                    		$scope.oldNum ++;
                    		$scope.oldList.push($scope.list[i]);
                    	}
                    }
                    if ($scope.newList.length > 4) {
                    	$scope.showNewBtn = true;
                    } else {
                    	$scope.showNewBtn = false;
                    }
                    if ($scope.oldList.length > 4) {
                    	$scope.showOldBtn = true;
                    } else {
                    	$scope.showOldBtn = false;
                    }
				}
			break;
			case "活动开奖结果":
				if (data.success) {
                    $scope.history = data.map.history;
                    if ($scope.history.length > 5) {
                    	$scope.history.length = 5;
                    }
                    var length = $scope.history.length;
                    for (var i = 0; i < length; i++) {
                    	if ($scope.history[i].prizeContent != undefined) {
                    		if ($scope.history[i].prizeContent.length > 22) {
                    			$scope.history[i].prizeContent = $scope.history[i].prizeContent.substr(0,22) + '...';
                    		}
                    	}
                    }
				}
			break;
		}
	});

	resourceService.queryPost($scope,$filter('交互接口对照表')('活动聚合页列表'),{},'活动聚合页列表');
	
	$scope.goPage = function(scope) {
        var obj = {};
        obj.pageOn = 1;
        obj.pageSize = 200;
        resourceService.queryPost($scope, $filter('交互接口对照表')('活动开奖结果'),obj,'活动开奖结果');
    };
    $scope.goPage($scope);

    $scope.showMore = function(str) {
    	if (str == 'new') {
    		$scope.showNewBtn = false;
    	} else if (str == 'old') {
    		$scope.showOldBtn = false;
    	}
    };

    $scope.gotoDetail=function(id){
		storage.storageData=true;
		$state.go('main.billDetail',{id:id}); 
	};
}])