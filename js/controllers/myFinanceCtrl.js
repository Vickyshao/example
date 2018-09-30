/*lee 我的优惠券*/
mainModule.controller('myFinanceCtrl', ['$rootScope','$scope', '$http', '$state', '$stateParams', '$localStorage','$sessionStorage', 'resourceService','$filter','communicationService',function($rootScope,$scope, $http, $state, $stateParams, $localStorage,$sessionStorage,resourceService,$filter,communicationService) {
	$rootScope.title="体验金-沪深理财";
	resourceService.queryPost($scope,$filter('交互接口对照表')('我的优惠券'),{flag:0},'我的体验金');
	$rootScope.activeNav = 'account';
	$localStorage.activeText = {name:'我的福利',url:'main.myAccount.myFinance'};
	$scope.activeLength = $scope.usedLength = $scope.disabledLength = 0;
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case '我的体验金':
				if (data.success) {
					$scope.tyj = data.map.list;
					$scope.length = $scope.tyj.length;
                    var currMillTimes = new Date().getTime();
					for (var i=0; i<$scope.length; i++) {
						if ($scope.tyj[i].status == 0) {
							if(currMillTimes <= $scope.tyj[i].expireDate){
								$scope.activeLength ++;
							}else{
                                $scope.disabledLength ++;
							}
						} else if ($scope.tyj[i].status == 1) {
							$scope.usedLength ++;
						} else if ($scope.tyj[i].status == 2) {
							$scope.disabledLength ++;
						}
					}
				}
			break;
		}
	});

}])