/*新年活动*/
mainModule.controller('newyearCtrl', [ '$scope', '$rootScope', '$http', '$state', '$stateParams', '$localStorage','$location', 'resourceService','communicationService','$filter','ngDialog',function($scope, $rootScope, $http, $state, $stateParams, $localStorage,$location,resourceService,communicationService,$filter,ngDialog) {
	$scope.showMode = 'a';
	var day = new Date().getDate(),
		month = new Date().getMonth() + 1;
	if (day >= 18 && day <= 26) {
		$scope.showMode = 'a';
	} else if (day >= 27 || day < 9) {
		$scope.showMode = 'b';
	} else {
		if (month > 1 && day >= 9) {
			$scope.showMode = 'c';
		}
	}
	$scope.goDetail = function(deadline){
        resourceService.queryPost($rootScope,$filter('交互接口对照表')('获取变现产品'),{deadline: deadline},'获取变现产品');
    }
    $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
        switch (type) {
        	case '获取变现产品':
                if (data.success) {
                    if (data.map.pid) {
                        if (data.map.pid == -1) {
                            $state.go('main.bankBillList');
                        } else {
                            $state.go('main.billDetail',{id:data.map.pid});
                        }
                    }
                }
            break;
        }
    });
}])