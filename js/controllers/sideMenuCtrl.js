/*我的资产主控*/
mainModule.controller('sideMenuCtrl', ['$rootScope', '$scope', '$location', '$filter', '$localStorage', 'resourceService', function ($rootScope, $scope, $location, $filter, $localStorage, resourceService) {
    var jsonUrl = '/data/menu.json';
    $scope.summaryContents = $localStorage.summaryContents;

    resourceService.queryPost($scope, $filter('交互接口对照表')('我的资产首页数据'), {}, '体验金');
    resourceService.getJsonServer($scope, jsonUrl, {}, '我的账户_菜单');

    $scope.$on('resourceService_GET_JSON.MYEVENT', function (event, data, type) {
        $scope.menuItems = data.result;
        if(!$localStorage.isDs) {
            angular.forEach($scope.menuItems, function (v, i) {
                if(v.memnTitle == '我要报销') {
                    $scope.menuItems.splice(i, 1);
                }
            });
        }
    });
    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
        switch (type) {
            case '体验金':
                if (data.success) {
                    $rootScope.isExperience = data.map.isExperience;
                }
                break;
        }
    });

    $scope.$on('myEvent.WHDR_Ctrl', function (event, data, type) {
        $scope.activeText = data.activeText;
        $scope.curUrl = data.url;
        //$scope.memnTitle = data.memnTitle || '走进沪深';
    });


    if ($localStorage.activeText != undefined) {
        $scope.curUrl = $localStorage.activeText.url;
        $scope.activeText = $localStorage.activeText.name;
    } else {
        $scope.curUrl = $location.$$url.replace('/', '').replace('mainmyAccount', 'main.myAccount.');
        $scope.activeText = $scope.activeText = '我的账户';
    }
    ;
}]);