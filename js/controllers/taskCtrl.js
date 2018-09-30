mainModule.controller('taskCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService',function($rootScope,$scope,$location,$localStorage,$filter,resourceService) {
	$rootScope.title = '活动中心-赚钱任务';
	$scope.mylistPage = {
		pageOn: 1,
		pageSize: 5
	};
	$scope.action = 0;

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case "邀请活动列表":
				if (data.success) {
					$scope.inviteList = data.map.pageInfo.rows;
					$scope.mylistPage = data.map.pageInfo;
					$scope.mylistPage.pages = [];

					for(var i = 0; i < parseInt($scope.mylistPage.totalPage); i ++){
						$scope.mylistPage.pages[i] = i+1;
					}
				}
			break;
		};
	});

	$scope.showList = function(type) {
		$scope.mylistPage.pageOn = 1;
		$scope.action = type;
		$scope.goPage($scope);
	};

	$scope.goPage = function(scope) {
        var obj = {};
        obj.status = scope.action;
        obj.pageOn = scope.mylistPage.pageOn;
        obj.pageSize = scope.mylistPage.pageSize;
        resourceService.queryPost($scope, $filter('交互接口对照表')('邀请活动列表'),obj,'邀请活动列表');
    };
    $scope.goPage($scope);

	$scope.changePage = function(type,pageNum) {
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
	
}])