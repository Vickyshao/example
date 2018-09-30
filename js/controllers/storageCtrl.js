/* si 个人中心 */
mainModule.controller('storageCtrl', ['$rootScope','$scope','$filter','resourceService','$location', function($rootScope,$scope,$filter,resourceService,$location) {
	$rootScope.title = '开通存管账户-沪深理财';
	$rootScope.activeNav = 'account';
	document.getElementsByTagName('html')[0].scrollTop = 0;
	document.getElementsByTagName('body')[0].scrollTop = 0;
	var $storageForm = $('#storageForm'),
		isSubmit = false;
	$scope.user = {};
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type) {
			case "资产首页":
				if (data.success) {
					$scope.accuntHome = data.map;
					$scope.isFuiou = data.map.isFuiou;
				}
			break;
			case "个人中心":
				if (data.success) {
					$scope.member = data.map;
					if ($scope.member.idCards != '') {
						$scope.user.realName = $scope.member.realName;
						$scope.user.idCards = $scope.member.idCards;
					}
				}
			break;
			case "存管信息":
				if (data.success) {
					$scope.storage = data.map;
					getStorageForm($scope.storage.signature);
					// $('#storageJson').val($scope.storage.signature);
					$('#storageForm')[0].action = $scope.storage.fuiouUrl;
    				$('#storageForm')[0].submit();
				} else {
    				isSubmit = false;
					$.qTip({
						'type': false,
						'text': data.errorMsg
					});
				}
			break;
		}
	});
	resourceService.queryPost($scope, $filter('交互接口对照表')('我的资产首页数据'),{},'资产首页');
	if ($location.$$path == '/main/myAccount/openStorage') {
		resourceService.queryPost($scope, $filter('交互接口对照表')('个人中心'),{},'个人中心');
	} else if ($location.$$path == '/main/myAccount/storageSuccess') {
		$scope.successType = true;
		if ($location.$$search.success == 'true') {
			$scope.successType = true;
		} else if ($location.$$search.success == 'false') {
			$scope.successType = false;
			if ($location.$$search.errorMsg!=undefined && $location.$$search.errorMsg!='') {
				$scope.errorMsg = $location.$$search.errorMsg;
			} else {
				$scope.errorMsg = '开通失败';
			}
		}
	}
	$scope.storageSubmit = function() {
		if (!isSubmit) {
			isSubmit = true;
			resourceService.queryPost($scope, $filter('交互接口对照表')('存管信息'),{
				realName:$scope.user.realName,
				idCards:$scope.user.idCards
			},'存管信息');
		}
    };

	function getStorageForm(json) {
		json = JSON.parse(json);
		for(var key in json.message){
			if(key !="signature") {
				$storageForm.prepend('<input type="hidden" name="'+key+'" value="'+json.message[key]+'" /><br/>');
			}
		}
		$storageForm.prepend('<input type="hidden" name="signature" value="'+json.signature+'" /><br/>');
	}
}]);