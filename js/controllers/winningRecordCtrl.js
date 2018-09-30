mainModule.controller('winningRecordCtrl', ['$scope','$filter','$location','$localStorage','resourceService','$state','storage',function($scope,$filter,$location,$localStorage,resourceService,$state,storage) {
	$scope.action=1;
	$scope.page={};
	$scope.page.pageOn=1;
	$scope.page.pageSize=10;
	$scope.status=null;
	$scope.showInfo=function(e){
		var obj=$(e.currentTarget);
		obj.parent().siblings().stop().slideToggle(200);
		if(obj.html()=='查看'){
			obj.html("收起");
		}else{
			obj.html("查看");
		}
	}
	var init=function(){
		var obj={};
		obj.pageOn=$scope.page.pageOn;
		obj.pageSize=$scope.page.pageSize;
		if($scope.status>=0){obj.prizeStatus=$scope.status;}
		resourceService.queryPost($scope,$filter('交互接口对照表')('getMyPrizeRecords'),obj,'中奖记录');
	}
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case '中奖记录':
				$scope.data=data.map.pageInfo.rows;
				$scope.totalPage=data.map.pageInfo.totalPage;
				for (var i = 0; i < $scope.data.length; i++) {
					$scope.data[i].luckCodes=$scope.data[i].luckCodes.split(',');
				};
			break;
		}
	})
	init();
	$scope.onClick=function(type,page){
		if(page&&page>0&&page<=$scope.totalPage){
			$scope.page.pageOn=page;
			init();
		}
	};
	$scope.gotoDetail=function(id){
		storage.storageData=true;
		$state.go('main.billDetail',{id:id}); 
	};
	$scope.clickStatus=function(status){
		$scope.action=status;
		if(status==1){delete $scope.status;}
		if(status==2){$scope.status=0;}
		if(status==3){$scope.status=1;}
		init();
	}
}]);