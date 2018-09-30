mainModule.controller('reginviteCtrl', ['$rootScope','$scope', '$state', '$localStorage', 'resourceService','$filter','ngDialog','$location','storage',function($rootScope,$scope, $state, $localStorage,resourceService,$filter,ngDialog,$location,storage) {

	if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
        $localStorage.webFormPath = $location.$$search;
    }

    $scope.recommPhone = $location.$$search.recommPhone;

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
		switch(type.name){
			case "首页主数据":
				$scope.user = data.map;
				if (data.map.realName == '' || data.map.realName == undefined) {
					$scope.user.userName = '亲爱的用户';
				} else {
					$scope.user.userName = data.map.realName;
				}
				$localStorage.user = $scope.user;
			break;
		}
	});

	$scope.focusMobile = function() {
        $('#mobilephone').focus();
        if ($location.$$path == '/broadbandnew' && $scope.hasLogin) {
            $(window).scrollTop(0);
        }
    };

}])