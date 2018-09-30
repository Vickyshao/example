/* si 存管账户 */
mainModule.controller('storagedetailCtrl', ['$rootScope','$scope','$filter','resourceService','$interval','$localStorage','$state','ngDialog','$location', function($rootScope,$scope,$filter,resourceService,$interval,$localStorage,$state,ngDialog,$location) {
	$scope.member = {};
	$rootScope.title = '存管账户-沪深理财';
	$rootScope.activeNav = 'account';

	var $storageForm = $('#storageForm'),
		isSubmit = false;

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {

		switch(type) {

			case "存管账户信息":
				if (data.success) {
					$scope.member = data.map;
					$scope.isFuiou = data.map.isFuiou;
				}
			break;
			case "修改存管交易密码":
				if (data.success) {
					if ($localStorage.hasChangePWD!=undefined) {
						delete $localStorage.hasChangePWD;
					}
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

	$scope.changeTradeCode = function() {
		if (!isSubmit) {
			isSubmit = true;
			resourceService.queryPost($scope, $filter('交互接口对照表')('修改存管交易密码'),{busi_tp:3},'修改存管交易密码');
		}
	};

	// 存管充值成功或失败弹窗
	if ($location.$$search.success != undefined && $localStorage.hasChangePWD==undefined) {
		$localStorage.hasChangePWD = true;
		if ($location.$$search.success == 'true') {
			$.qTip({
				'type': true,
				'text': '修改成功'
			});
		} else if ($location.$$search.success == 'false') {
			$.qTip({
				'type': false,
				'text': $location.$$search.errorMsg
			});
		}
	}

	function getStorageForm(json) {
		json = JSON.parse(json);
		for(var key in json.message){
			if(key !="signature") {
				$storageForm.prepend('<input type="hidden" name="'+key+'" value="'+json.message[key]+'" /><br/>');
			}
		}
		$storageForm.prepend('<input type="hidden" name="signature" value="'+json.signature+'" /><br/>');
	}

	resourceService.queryPost($scope, $filter('交互接口对照表')('存管账户信息'),{},'存管账户信息');
}])