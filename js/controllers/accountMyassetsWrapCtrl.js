
/*lee 资产记录*/
mainModule.controller('accountMyassetsWrapCtrl', ['$rootScope','$scope','$filter','resourceService',function($rootScope,$scope,$filter,resourceService) {
	$scope.page={};
	$scope.page.pageOn=1;
	$scope.page.pageSize=5;
	// $scope.format = "yyyy-MM-dd";
	// $scope.altInputFormats = ['d!/M!/yyyy'];
	// $scope.page.tradeType = '';
	$scope.types = $filter('tradeType')();
	$rootScope.title = '资产记录-沪深理财';
	$rootScope.activeNav = 'account';
	resourceService.queryPost($scope,$filter('交互接口对照表')('我的投资-资产记录'),$scope.page,'资产记录');
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case "资产记录":
				if(data.success){
					$scope.page.pageOn = data.map.page.pageOn;
					$scope.pages = [];
					$scope.page.totalPage = data.map.page.totalPage;
					for(var i=0;i<parseInt(data.map.page.totalPage);i++){
						$scope.pages[i]=i+1;
					};
					$scope.accountMyassetsWrapList = data.map.page.rows;
				}else{
				}
			break;
		};
	});
	$scope.onClick = function(type,item){
		switch(type) {
			case "资产记录":
				$scope.page.pageOn = 1;
				if ($scope.page.tradeTypeVal == null) {
					delete $scope.page.tradeType;
				} else {
					$scope.page.tradeType = $scope.page.tradeTypeVal.code;
				}
				goPage();
			break;
			case "beforePage":
				if($scope.page.pageOn > 1){$scope.page.pageOn -=1;goPage()};
			break;
			case "currentPage":
				$scope.page.pageOn = item;goPage();
			break;
			case "nextPage":
				if($scope.page.pageOn < $scope.pages.length){$scope.page.pageOn +=1;goPage()};
			break;
		}
	};
	$scope.goPG=function(){
		$scope.page={};
		$scope.page.pageOn=1;
		$scope.page.pageSize=5;
		goPage();
	};
	function goPage() {
		if($scope.page.tradeType == '' || $scope.page.tradeType == undefined){
			delete $scope.page.tradeType;
		}
		resourceService.queryPost($scope,$filter('交互接口对照表')('我的投资-资产记录'),$scope.page,'资产记录');
	}
	$scope.today = function() {
    	$scope.startDate = new Date();
  	};
  	$scope.today();

	$scope.clear = function() {
	   $scope.startDate = null;
	};
	$scope.open1 = function() {
		$scope.popup1.opened = true;
	};

	$scope.open2 = function() {
		$scope.popup2.opened = true;
	};

	$scope.popup1 = {
		opened: false
	};

	$scope.popup2 = {
		opened: false
	};
}]);
