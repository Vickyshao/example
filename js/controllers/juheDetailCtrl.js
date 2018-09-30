mainModule.controller('juheDetailCtrl', ['$scope','$state',"$stateParams", function($scope,$state,$stateParams) {
    $scope.id=$stateParams.id;
    $scope.data = ['bandaoti','lvqingqi','chaye'];
    if($scope.id<1){$scope.id=1}
    if($scope.id>7){$scope.id=7}
    document.getElementsByTagName('html')[0].scrollTop = 0;
    document.getElementsByTagName('body')[0].scrollTop = 0;
    $scope.prev=function(){
        $state.go('main.juheDetail',{id:parseInt($scope.id)-1});
    };
    $scope.next=function(){
        $state.go('main.juheDetail',{id:parseInt($scope.id)+1});
    };
}]);
