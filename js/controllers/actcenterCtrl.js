/*lee 我的优惠券*/
mainModule.controller('actcenterCtrl', ['$rootScope','$scope', '$http', '$state', '$stateParams', '$localStorage','$sessionStorage', 'resourceService','$filter','communicationService',function($rootScope,$scope, $http, $state, $stateParams, $localStorage,$sessionStorage,resourceService,$filter,communicationService) {
	$rootScope.title="活动中心-沪深理财";
	$scope.status=1;
	resourceService.queryPost($scope,$filter('交互接口对照表')('获取所有活动'),{pageOn:1,pageSize:99999,status:$scope.status},'获取所有活动');

	$('html, body').scrollTop(0);
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case '获取所有活动':
				if (data.success) {
					
					$scope.infolist = data.map.pageInfo.rows;
					if($scope.infolist.length>3){
	 					$scope.showmore=true;
	 					$scope.infolist=data.map.pageInfo.rows.slice(0,3);
	                    $scope.infolists=data.map.pageInfo.rows;
	 				}else{
	 					$scope.showmore=false;
	 				}
				}
			break;
		}
	});

	//切换
    $scope.change=function(action){
    	$scope.status=action;
    	resourceService.queryPost($scope,$filter('交互接口对照表')('获取所有活动'),{pageOn:1,pageSize:99999,status:$scope.status},'获取所有活动');
    }
	//查看更多
    $scope.more=function(){
    	$scope.infolist=$scope.infolists;
    	$scope.showmore=false;
    }
}])