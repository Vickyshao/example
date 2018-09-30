
/*lee 我的投资*/
mainModule.controller('myAccountmyInvestCtrl', ['$rootScope','$scope','$filter','resourceService','$state','$localStorage',function($rootScope,$scope,$filter,resourceService,$state,$localStorage) {
	if (!$filter('isRegister')().register) {
			$state.go('dl');
			return;
	}
	
	$scope.page={};
	$scope.page.pageOn=1;
	$scope.page.pageSize=5;
	$scope.isActive = 0;
	$rootScope.title = '我的资产-沪深理财';
	$scope.page.status = 0;
	$rootScope.activeNav = 'account';
	resourceService.queryPost($scope,$filter('交互接口对照表')('我的投资'),{},'我的投资');
	$scope.types = $filter('isType')();
	
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case "我的投资":
				if(data.success){
					$scope.userInvest = data.map;
				}else{
				}
				resourceService.queryPost($scope,$filter('交互接口对照表')('我的投资-收益中的产品'),$scope.page,'收益中的产品');
			break;
			case "收益中的产品":
				if(data.success){
					$localStorage.inProfitProductList = $scope.inProfitProductList = data.map.page.rows;
					$scope.pages=[];
					$scope.page.pageOn = data.map.page.pageOn;
					$scope.total = data.map.page.total;
					$scope.page.totalPage = data.map.page.totalPage;
					for(var i=0;i<parseInt(data.map.page.totalPage);i++){
						$scope.pages[i]=i+1;
					};
				}else{
				}
			break;
		};
	});
	$scope.lv = 1;
	$scope.qx = 3;
	$scope.onClick = function(type,item){
		switch(type) {
			case "收益中查询":
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
		if($scope.page.type == 'null'){
			delete $scope.page.type;
		}
		$scope.page.status = $scope.isActive;
		resourceService.queryPost($scope,$filter('交互接口对照表')('我的投资-收益中的产品'),$scope.page,'收益中的产品');
	};

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
	$scope.gotoPage = function(ids,index,type,item) {
		if(type){
			$localStorage.protocolIds = ids;
			var url = '';
			url = $state.href('loan',{idx:index});
			// if (item.prePid != undefined && item.sid != undefined) {
			// 	url = $state.href('mytransfer',{idx:index});
			// } else if (item.prePid == undefined && item.sid != undefined) {
			// 	url = $state.href('loan',{idx:index});
			// } else if (item.prePid == undefined && item.sid == undefined) {
			// 	url = $state.href('qy',{idx:index});
			// }
			window.open(url,'_blank');
		}else{
			var url = "/agreement/download.do?pid="+ids.pid +"&uid="+ids.uid+"&investId="+ids.investId;
			window.open(url,'_blank');
		}
	}

}])