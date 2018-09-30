/*lee 我的优惠券*/
mainModule.controller('myCouPonCtrl', ['$rootScope','$scope', '$http', '$state', '$stateParams', '$localStorage','$sessionStorage', 'resourceService','$filter','communicationService',function($rootScope,$scope, $http, $state, $stateParams, $localStorage,$sessionStorage,resourceService,$filter,communicationService) {
	$rootScope.title="优惠券-沪深理财";
	resourceService.queryPost($scope,$filter('交互接口对照表')('我的优惠券'),{flag:1},'我的优惠券');
	$rootScope.activeNav = 'account';
	$('html, body').scrollTop(0);
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case '我的优惠券':
				if (data.success) {
					$scope.HBList=[];
					$scope.QList=[];
					$scope.FBQList=[];
					$scope.TYJ={};
					for (var i = 0; i < data.map.list.length; i++) {
						switch(data.map.list[i].type){
							case 1:
								data.map.list[i].sel=false;
								$scope.HBList.push(data.map.list[i]);
							break;
							case 2:
								data.map.list[i].sel=false;
								$scope.QList.push(data.map.list[i]);
							break;
							case 3:
								// $scope.TYJ = data.map.list[i];
								data.map.list[i].sel=false;
								$scope.HBList.push(data.map.list[i]);
							break;
							case 4:
								// $scope.TYJ = data.map.list[i];
								data.map.list[i].sel=false;
								$scope.FBQList.push(data.map.list[i]);
							break;
						};
					}
					$scope.couponLength = 0;
					$scope.couponUsedLength = 0;
					$scope.couponDisabledLength = 0;
					for (var i = 0; i < $scope.QList.length; i++) {
						if ($scope.QList[i].status == 0) {
							$scope.couponLength ++;
						} else if ($scope.QList[i].status == 1) {
							$scope.couponUsedLength ++;
						} else if ($scope.QList[i].status == 2) {
							$scope.couponDisabledLength ++;
						}
					}
					$scope.tipsLength = 0;
					$scope.tipsUsedLength = 0;
					$scope.tipsDisabledLength = 0;
					var currMillTimes = new Date().getTime();
					for (var i = 0; i < $scope.HBList.length; i++) {
						if ($scope.HBList[i].status == 0) {
							if(currMillTimes <= $scope.HBList[i].expireDate){
                                $scope.tipsLength ++;
							}else {
                                $scope.tipsDisabledLength ++;
                            }

						} else if ($scope.HBList[i].status == 1) {
							$scope.tipsUsedLength ++;
						} else if ($scope.HBList[i].status == 2) {
							$scope.tipsDisabledLength ++;
						}
					}
					$scope.fbqLength = 0;
					$scope.fbqUsedLength = 0;
					$scope.fbqDisabledLength = 0;

					for (var i = 0; i < $scope.FBQList.length; i++) {
						if ($scope.FBQList[i].status == 0) {
							$scope.fbqLength ++;
						} else if ($scope.FBQList[i].status == 1) {
							$scope.fbqUsedLength ++;
						} else if ($scope.FBQList[i].status == 2) {
							$scope.fbqDisabledLength ++;
						}
					}

				}
			break;
		}
	});
	 /*所有的点击事件*/
    $scope.onClick=function(name){
         switch(name){
            case '立即使用':
                $state.go('main.bankBillList');
            break;
        };
    };
}])