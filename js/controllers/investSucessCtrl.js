/*lee 产品详情页*/
mainModule.controller('investSucessCtrl', ['$rootScope', '$scope', '$state', '$localStorage', 'resourceService', '$filter', 'communicationService', '$timeout', '$location', 'ngDialog', '$element', 'MAIN_MENU', 'storage', '$stateParams', function ($rootScope, $scope, $state, $localStorage, resourceService, $filter, communicationService, $timeout, $location, ngDialog, $element, MAINMENU, storage, $stateParams) {
    // $filter('isLogin')($scope);
    // $(window).scrollTop(0);
    // MAINMENU.menuname('bill', 'menu');
    // $scope.product = $localStorage.product;
    // $scope.path = $localStorage.pathObj;
    // $scope.title = '项目详情';
    // $scope.portName = '投资记录';
    //
    // $scope.isShowOver = $location.$$search.isShowOver;
    // $scope.isRepeats = $location.$$search.isRepeats;
    // $scope.comInvestSuc = $location.$$search.comInvestSuc;
    // $scope.redbag = $location.$$search.redbag;
    // $scope.statusCode = $location.$$search.statusCode;
    // $scope.isSuc = $location.$$search.isSuc;
    // $scope.pText = $location.$$search.pText;
    // $scope.product = $localStorage.product;
    // if ($location.$$path ==  "/main/investSucess") {
    // // if ($scope.statusCode=='succes') {
    //         $localStorage.fullProcess = true;
    //     } else {
    //         $localStorage.fullProcess = false;
    //     }
    // }
    //
    // $scope.selectMyWinning = function () {
    //     $filter('跳转页面')('', 'main.billDetail', 'main.myAccount.winningRecord', '', null, {
    //         name: '活动中心',
    //         url: 'main.myAccount.winningRecord'
    //     });
    //     ngDialog.closeAll();
    // }
}]);
