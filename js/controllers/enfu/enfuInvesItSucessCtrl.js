/*lee 产品详情页*/
mainModule.controller('enfuInvestSucessCtrl', ['$rootScope', '$scope', '$state', '$localStorage', 'resourceService', '$filter', 'communicationService', '$timeout', '$location', 'ngDialog', '$element', 'MAIN_MENU', 'storage', '$stateParams', function ($rootScope, $scope, $state, $localStorage, resourceService, $filter, communicationService, $timeout, $location, ngDialog, $element, MAINMENU, storage, $stateParams) {
    $filter('isLogin')($scope);
    $(window).scrollTop(0);
    MAINMENU.menuname('bill', 'menu');
    $scope.path = $localStorage.pathObj;
    $scope.title = '投资成功';
    $scope.portName = '投资记录';
    $scope.playSound = true;

    $scope.enfu = $localStorage.enfuInvestResults;

    $scope.gotoDetail=function(id){
        storage.storageData=true;
        $state.go('main.enfu',{id:id}); 
    };


}]);
