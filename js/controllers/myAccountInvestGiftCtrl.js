/*lee 我的投资*/
mainModule.controller('myAccountInvestGiftCtrl', ['$rootScope','$scope','$filter','resourceService','$state','$localStorage',function($rootScope,$scope,$filter,resourceService,$state,$localStorage) {
	if (!$filter('isRegister')().register) {
		$state.go('dl');
		return;
	}
	$rootScope.title = '我的资产-沪深理财';
	$rootScope.activeNav = 'account';

	var isSubmit = false;

	$scope.address = {};
	$scope.form = {};
	$scope.changeAddress = false;

	$scope.showNameError = false;
	$scope.showPhoneError = false;
	$scope.showAddressError = false;

	resourceService.queryPost($scope,$filter('交互接口对照表')('投即送投资记录'),{},'投即送投资记录');
	resourceService.queryPost($scope,$filter('交互接口对照表')('投即送获取默认地址'),{},'投即送获取默认地址');
	// resourceService.queryPost($scope,$filter('交互接口对照表')('投即送获取收货地址'),{},'投即送获取收货地址');
	
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case "投即送投资记录":
				if(data.success){
					$scope.logs = data.map.logsList;
					
					if ($scope.logs == undefined || $scope.logs.length == 0) {
						$scope.showLogs = false;
					} else {
						$scope.showLogs = true;
					}
				}
			break;
			case "投即送获取收货地址":
				if (data.success) {
					// $scope.address = data.map.jsMemberInfo;
					// if ($scope.address == '' || $scope.address == undefined || $scope.address == {}) {
					// 	$scope.changeText = '填写';
					// 	$scope.showChangeBtn = false;
					// } else {
					// 	$scope.changeText = '修改';
					// 	$scope.showChangeBtn = true;
					// }
				} 
			break;
			case "投即送修改收货地址":
				if (data.success) {
					$.qTip({
						'type': true,
						'text': '填写成功'
					});
					window.location.reload();
					// $scope.changeAddress = false;
					// $scope.address = $scope.form;
					// $scope.changeText = '修改';
					// $scope.showChangeBtn = true;
				} else {
					$.qTip({
						'type': false,
						'text': data.errorMsg
					});
					isSubmit = false;
				}
			break;
			case "投即送获取默认地址":
				if (data.success) {
					if (data.map.materialObject != undefined) {
						$scope.defaultAddress = data.map.materialObject;
					} else {
						$scope.defaultAddress = {
							address: '',
							name: '',
							phone: ''
						};
					}
					if (data.map.fictitious != undefined) {
						$scope.defaultmobile = data.map.fictitious.phone;
					} else {
						$scope.defaultmobile = '';
					}
				}
			break;
		};
	});

	$scope.changeFill = function(flag) {
		$scope.changeAddress = flag;
		$scope.showChangeBtn = !flag;
	};

	// $scope.saveAddress = function() {
	// 	if ($scope.form.name == '' || $scope.form.name == undefined) {

	// 		$scope.showNameError = true;
	// 		return;
	// 	} else if ($scope.form.phone == '' || $scope.form.phone == undefined) {
	// 		$scope.showNameError = false;
	// 		$scope.showPhoneError = true;
	// 		return;
	// 	} else if ($scope.form.address == '' || $scope.form.address == undefined) {
	// 		$scope.showNameError = false;
	// 		$scope.showPhoneError = false;
	// 		$scope.showAddressError = true;
	// 		return;
	// 	} else {
	// 		$scope.showNameError = false;
	// 		$scope.showPhoneError = false;
	// 		$scope.showAddressError = false;
	// 	}
	// 	if ($scope.changeText == '修改') {
	// 		resourceService.queryPost($scope,$filter('交互接口对照表')('投即送修改收货地址'),$scope.form,'投即送修改收货地址');
	// 	} else {
	// 		resourceService.queryPost($scope,$filter('交互接口对照表')('投即送添加收货地址'),$scope.form,'投即送修改收货地址');
	// 	}
	// };

	$scope.showForm = function(event) {
		event.stopPropagation();
		var $this = $(event.currentTarget);
		$this.parents('.c').find('.investgift-account-address').show();
		$this.hide();
	};

	$scope.stopP = function(event) {
		event.stopPropagation();
	};

	$('body').on('click',function() {
		$('.investgift-account-address').hide();
		$('.investgift-account-write').show();
	});

	$scope.vaildFUC = function(event) {
		var $this = $(event.currentTarget);
		if ($this.val() == '') {
			$this.parents('.input-box').find('.msg').show();
		} else {
			$this.parents('.input-box').find('.msg').hide();
		}
		$this.parents('.input-box').find('.msge').hide();
		if ($this.attr('class') == 'phone') {
			if (!/^1[3|4|5|7|8][0-9]{9}$/.test($this.val())) {
				$this.parents('.input-box').find('.msg').hide();
				$this.parents('.input-box').find('.msge').show();
			} else {
				$this.parents('.input-box').find('.msge').hide();
			}
		}
	};
	
	$scope.sureAddress = function(event,item) {
		
		var $this = $(event.currentTarget),
			$parent = $this.parents('.address'),
			$address = $parent.find('.area'),
			$name = $parent.find('.name'),
			$phone = $parent.find('.phone');
		if (item.prizeType == 0) {
			if ($address.val() == '' || $address.val() == undefined) {
				$address.focus();
				return;
			} else if ($name.val() == '' || $name.val() == undefined) {
				$name.focus();
				return;
			} else if ($phone.val() == '' || $phone.val() == undefined) {
				$phone.focus();
				return;
			} else if (!/^1[3|4|5|7|8][0-9]{9}$/.test($phone.val())) {
				$phone.focus();
				$phone.parents('.input-box').find('.msge').show();
				return;
			} else {
				if (isSubmit) {
					return;
				}
				isSubmit = true;
				resourceService.queryPost($scope,$filter('交互接口对照表')('投即送添加收货地址'),{
					address: $address.val(),
					name: $name.val(),
					phone: $phone.val(),
					investId: item.investId
				},'投即送修改收货地址');

			}
		} else if (item.prizeType == 1) {
			if ($phone.val() == '' || $phone.val() == undefined) {
				$phone.focus();
				return;
			} else if (!/^1[3|4|5|7|8][0-9]{9}$/.test($phone.val())) {
				$phone.focus();
				$phone.parents('.input-box').find('.msge').show();
				return;
			} else {
				if (isSubmit) {
					return;
				}
				isSubmit = true;
				resourceService.queryPost($scope,$filter('交互接口对照表')('投即送添加收货地址'),{
					phone: $phone.val(),
					investId: item.investId
				},'投即送修改收货地址');

			}
		}
	}
}])