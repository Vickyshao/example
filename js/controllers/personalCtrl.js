/* si 个人中心 */
mainModule.controller('personalCtrl', ['$rootScope','$scope','$filter','resourceService', function($rootScope,$scope,$filter,resourceService) {
	$rootScope.title = '个人中心-沪深理财';
	$rootScope.activeNav = 'account';
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type) {

			case "个人中心":
				if (data.success) {
					$scope.user = data.map;
					if (data.map.sex == 1) {
						$scope.user.sexInfo = '男';
					} else if (data.map.sex == 2) {
						$scope.user.sexInfo = '女';
					} else if (data.map.sex == undefined) {
						$scope.user.sexInfo = '';
					}
					if (data.map.realName == '' || data.map.realName == undefined) {
						$scope.user.verify = false;
					} else {
						$scope.user.verify = true;
					}
				} else {
				}
				break;
		}
	});
	resourceService.queryPost($scope, $filter('交互接口对照表')('个人中心'),{},'个人中心');
}]);