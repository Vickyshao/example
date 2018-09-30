
/* cpa */
mainModule.controller('cpaCtrl', ['$rootScope','$scope','$filter','resourceService','$localStorage','$state','$location','ngDialog',function($rootScope,$scope,$filter,resourceService,$localStorage,$state,$location,ngDialog) {
	$localStorage.pathUrl = 'main.home';
	$scope.XQ = {};
	$scope.playSound=true;
	var isSubmin =true;

	if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined){
		$localStorage.webFormPath = $location.$$search;
	};
	// 忘记交易密码--去安全认证页面找回
	$scope.forgetTradeCode = function() {
		ngDialog.closeAll();
		$filter('跳转页面')('','main.home','main.myAccount.security','forgetTradeCode',null,{name:'账户管理',url:'main.myAccount.security'});
	};
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type) {
			case "cpa票据详情":
				if (data.success) {
					$scope.product = data.map.info;
					$scope.XQ = data.map;
					if(data.map.funds != undefined){
					$scope.account={};
					$scope.account = data.map.funds;//用户资金
					balance = $scope.account.balance;
					if($scope.account.investAmount <= 0 && $scope.product.type == 1){
						$scope.isNewGay = true;
					}else{
						$scope.isNewGay = false;
					};
				}else{
					delete $localStorage.user;
				}
					$scope.product = data.map.info;
					$scope.product.nowNum = $scope.product.leastaAmount;
				} else {
					if(data.errorCode == 1001){
						$scope.errorText = '产品不存在或下架';
					}
				}
			break;
			case "用户可用优惠券":
				if(data.success){
					$scope.HBList=[];
					$scope.QList=[];
					$scope.clickBox = true;
					for (var i = 0; i < data.map.list.length; i++) {
						switch(data.map.list[i].type){
							case 1:
								data.map.list[i].sel=false;
								$scope.HBList.push(data.map.list[i]);
							break;
							case 2:
								data.map.list[i].sel=false;
								$scope.QList.push(data.map.list[i]);
							break;
						};
					}
					$scope.isShowOver = true;
				}else{
				}
			break;
			case "确认投资":
				isSubmin = true;
				$scope.isShowOver=false;
				$scope.success = data.success;
				$scope.product.tpwd=null;
				if(data.success){
					$scope.pText = '恭喜您！投资成功！';
					$scope.statusCode = 'success';
					resourceService.queryPost($scope,$filter('交互接口对照表')('票据详情'),$scope.product,'票据详情');
				}else{
					$scope.statusCode = $filter('确认投资服务器Error')(data.errorCode).classCode;
					$scope.pText = $filter('确认投资服务器Error')(data.errorCode).text;
				}
			break;
		};
	});
	$scope.onClick=function(type){
		switch(type) {
			case "返回":
				$scope.isShowOver = true;
			break;
			case "注册":
				var url = $state.href('zhuce');
				window.open(url,'_blank');
			break;
			case "密码未设":
				var url = $state.href('main.myAccount.security');
				window.open(url,'_blank');
			break;
			case "立即投资":
				$scope.isShowOver = true;
				Qtrget=null;
				$filter('投资确认弹窗')($scope);
			break;
			case "确认投资":
				if(isSubmin){
					isSubmin=false;
					var obj = {};
					obj.pid = $scope.product.id;
					obj.tpwd = $scope.product.tpwd;
					obj.amount = $scope.product.nowNum;
					if(Qtrget!=null){
						obj.fid = Qtrget.id;
					}else if ($scope.isNewGay) {
						obj.fid = $scope.TYJ.id;
					};
					resourceService.queryPost($scope,$filter('交互接口对照表')('确认投资'),obj,'确认投资');
				}
			break;
		};
	};
	resourceService.queryPost($scope,$filter('交互接口对照表')('票据详情'),{type:4},'cpa票据详情');
	if($localStorage.user != undefined){
		resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},'用户信息');
	}
}]);