
/*静态页面主控*/
mainModule.controller('jtMenuCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService', function($rootScope,$scope,$location,$localStorage,$filter,resourceService) {
	var jsonUrl='/data/helpMenu1.json';
	// $rootScope.activeNav = 'aboutus';
	$rootScope.activeNav = 'new';
	resourceService.getJsonServer($scope,jsonUrl,{},'静态文本_菜单');
	$scope.$on('resourceService_GET_JSON.MYEVENT', function(event, data, type) {
		switch(type) {
			case "静态文本_菜单":
				$scope.menuItems = data.result;
			break;
		}
	});
	$scope.$on('myEvent.WHDR_Ctrl', function(event,data,type) {
                            $scope.activeText = data.name;
                            $scope.curUrl = data.url;
							$scope.memnTitle = data.memnTitle || '走进沪深';
                        });
	if($localStorage.activeText !=undefined){
		$scope.curUrl = $localStorage.activeText.url;
		$scope.activeText = $localStorage.activeText.name;
	}else {
		$scope.curUrl = $location.$$url.replace('/','').replace('main/jt/help', 'main.jt.');
		$scope.activeText = $scope.activeText = '帮助中心';
	};
}]);


/*帮助中心2*/
mainModule.controller('jt2MenuCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService', function($rootScope,$scope,$location,$localStorage,$filter,resourceService) {
	var jsonUrl='/data/helpMenu2.json';
	$rootScope.activeNav = 'help';
	resourceService.getJsonServer($scope,jsonUrl,{},'静态文本_菜单');
	$scope.$on('resourceService_GET_JSON.MYEVENT', function(event, data, type) {
		switch(type) {
			case "静态文本_菜单":
				$scope.menuItems = data.result;
			break;
		}
	});
	if($localStorage.activeText !=undefined){
		$scope.curUrl = $localStorage.activeText.url;
		$scope.activeText = $localStorage.activeText.name;
	}else
	{
		$scope.curUrl = $location.$$url.replace('/','').replace('main/help', 'main.jt2.');
		$scope.activeText = $scope.activeText = '帮助中心';
	};
}]);