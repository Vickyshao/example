// 我要报销
mainModule.controller('myAccountReimCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService','$state','ngDialog', function($rootScope,$scope,$location,$localStorage,$filter,resourceService,$state,ngDialog) {

	$rootScope.title = '我要报销-沪深理财';

    $scope.page = {};
    $scope.page.pageOn = 1;
    $scope.page.pageSize = 9;

    resourceService.queryPost($scope, $filter('交互接口对照表')('我要报销列表'), $scope.page ,'我要报销列表');
    resourceService.queryPost($scope, $filter('交互接口对照表')('我要报销'),{},'我要报销');

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
            case "我要报销列表":
                if (data.success) {
                    if (!!data.map.latestActiveNotReimbursedRecord) {
                        $scope.latestActiveNotReimbursedRecord = data.map.latestActiveNotReimbursedRecord;
                        $scope.latestStatus = $scope.latestActiveNotReimbursedRecord.status;
                        $scope.id = $scope.latestActiveNotReimbursedRecord.id;
                        $scope.title = $scope.latestActiveNotReimbursedRecord.title;
                        $scope.amount = $scope.latestActiveNotReimbursedRecord.amount;
                        $scope.id = $scope.latestActiveNotReimbursedRecord.id;
                        if(!!$scope.latestActiveNotReimbursedRecord.id) {
                            $localStorage.ecId = $scope.id;
                        } else {
                            $localStorage.ecId = '';
                        }
                    } else {
                        $scope.latestActiveNotReimbursedRecord = false;
                    }

                    $scope.totalPeriodsReimburseAmount = data.map.totalPeriodsReimburseAmount;
                    $scope.periodsReimbursedAmount = data.map.periodsReimbursedAmount;
                    $scope.periodsReimbursedRate = data.map.periodsReimbursedRate;

                    // 页码相关
                    $scope.pageData = data.map.pageData;
                    $scope.infos = $scope.pageData.rows;

                    $scope.pages=[];
                    $scope.page.total = $scope.pageData.total;
                    $scope.page.totalPage = $scope.pageData.totalPage;
                    for(var i=0; i < parseInt($scope.page.totalPage); i++){
                        $scope.pages[i] = i+1;
                    }
                }
                break;
			case "我要报销":
				if (data.success) {
					$scope.totalReimburseAmount = data.map.totalReimburseAmount;
					$scope.reimbursedAmount = data.map.reimbursedAmount;
					$scope.remainReimburseAmount = data.map.remainReimburseAmount;
					$scope.isProcessing = data.map.isProcessing;
					$scope.type = data.map.type;
                    $scope.isUserCarried = data.map.isUserCarried;
				}
			break;
		};
	});

	$scope.toReim = function () {
        $scope.isShowOver = true;
        $filter('电商拉新投资弹窗')($scope);
    };

	$scope.toInvest = function () {
	    $scope.ecId = $scope.id;
        $state.go('main.billDetail',  { reimId: true, ecId: $scope.ecId });
        ngDialog.closeAll();
    };

    $scope.onClick = function(type,item){
        switch(type) {
            case "beforePage":
                if($scope.page.pageOn > 1){
                    $scope.page.pageOn -=1;
                    goPage()
                }
                break;
            case "currentPage":
                $scope.page.pageOn = item;
                goPage();
                break;
            case "nextPage":
                if($scope.page.pageOn < $scope.pages.length){$scope.page.pageOn +=1;goPage()}
                break;
        }
    };
    function goPage() {
        $scope.isActive = 0;
        if($scope.page.type == 'null'){
            delete $scope.page.type;
        }
        $scope.page.status = $scope.isActive;
        $scope.page.pageSize = 9;
        resourceService.queryPost($scope, $filter('交互接口对照表')('我要报销列表'), $scope.page ,'我要报销列表');
    };
}]);