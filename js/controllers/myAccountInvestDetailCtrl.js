
/*lee 我的投资*/
mainModule.controller('myAccountInvestDetailCtrl', ['$rootScope','$scope','$filter','resourceService','$state','$localStorage','$location',function($rootScope,$scope,$filter,resourceService,$state,$localStorage,$location) {
    if (!$filter('isRegister')().register) {
            $state.go('dl');
            return;
    }
    
    $rootScope.title = '我的投资明细-沪深理财';
    $scope.id = $location.$$search.id;
    $scope.idx = $location.$$search.idx;

    resourceService.queryPost($scope,$filter('交互接口对照表')('我的投资明细'),{id:$scope.id},'我的投资明细');
    $scope.types = $filter('isType')();
    $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
        switch(type){
            case "我的投资明细":
                $scope.pro = data;
                $scope.proName = data.productName;
                $scope.list = data.result;
                $scope.proType = data.type;
            break;
        };
    });

    $scope.gotoPage = function(ids,index,type,item) {
        if(type){
            $localStorage.protocolIds = ids;
            var url = '';
            url = $state.href('loan',{idx:index});
            // if (item.prePid != undefined && item.sid != undefined) {
            //  url = $state.href('mytransfer',{idx:index});
            // } else if (item.prePid == undefined && item.sid != undefined) {
            //  url = $state.href('loan',{idx:index});
            // } else if (item.prePid == undefined && item.sid == undefined) {
            //  url = $state.href('qy',{idx:index});
            // }
            window.open(url,'_blank');
        }else{
            var url = "/agreement/download.do?pid="+ids.pid +"&uid="+ids.uid+"&investId="+ids.investId;
            window.open(url,'_blank');
        }
    }

}])