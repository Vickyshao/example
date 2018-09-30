mainModule.controller('winnerInfoCtrl', ['$rootScope','$scope', '$state', '$localStorage', 'resourceService','$filter','ngDialog','$location','$stateParams',function($rootScope,$scope, $state, $localStorage,resourceService,$filter,ngDialog,$location,$stateParams) {
	$scope.current = [];
	$scope.history = [];
	$scope.mylistPage = {
		pageOn: 1,
		pageSize: 8
	};

	if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
        $localStorage.webFormPath = $location.$$search;
    }

	// 监听退出是否成功
	$rootScope.$on('exitSuccess', function(event, flag) {
		if (flag) {
			$scope.isLogin = false;
		}
	});

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
		switch(type){
			case "活动开奖结果":
				if (data.success) {
                    $scope.history = data.map.history;
					for (var i = 0; i < $scope.history.length; i++) {
                    	if ($scope.history[i].prizeContent != undefined) {
                    		$scope.history[i].prizeContentL = $scope.history[i].prizeContent.length > 88 ? $scope.history[i].prizeContent.substr(0,88) + '...' : $scope.history[i].prizeContent;
                    		$scope.history[i].prizeContentS = $scope.history[i].prizeContent.length > 26 ? $scope.history[i].prizeContent.substr(0,26) + '...' : $scope.history[i].prizeContent;
                    	}
                    }
                    $scope.mylistPage = data.map;
					$scope.mylistPage.pages = [];

					for(var i = 0; i < parseInt($scope.mylistPage.TotalPage); i ++){
						$scope.mylistPage.pages[i] = i+1;
					}
					if ($scope.curNum == undefined) {
						if ($stateParams.cur != '' && $stateParams.cur != undefined) {
							$scope.curNum = $scope.history[$stateParams.cur].activityPeriods;
							$scope.curHistory = $scope.history[$stateParams.cur];
						} else {
							$scope.curNum = $scope.history[0].activityPeriods;
							$scope.curHistory = $scope.history[0];
						}
						$('.video').html('<i>第 '+$scope.curHistory.activityPeriods+' 期</i><embed src="'+$scope.curHistory.prizeVideoUrl+'" allowFullScreen="true" autoplay="true" quality="high" width="660" height="376" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>');
					}
				}
			break;
		}
	});

	$scope.goPage = function(scope) {
        var obj = {};
        obj.pageOn = scope.mylistPage.pageOn;
        obj.pageSize = 8;
        resourceService.queryPost($scope, $filter('交互接口对照表')('活动开奖结果'),obj,'活动开奖结果');
    };
    $scope.goPage($scope);

	$scope.onClickPage = function(type,pageNum) {
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

    $scope.changeInfo = function(item) {
    	$scope.curNum = item.activityPeriods;
    	$scope.curHistory = item;

		$('.video').html('<i>第 '+$scope.curHistory.activityPeriods+' 期</i><embed src="'+$scope.curHistory.prizeVideoUrl+'" allowFullScreen="true" autoplay="true" quality="high" width="660" height="376" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>');
    };


}])