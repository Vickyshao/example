/*lee 修改用户密码*/
mainModule.controller('resetPswCtrl', ['$rootScope','$scope','$filter','resourceService',function($rootScope,$scope,$filter,resourceService) {
	$scope.isRestPSWOne=true;
	$scope.isRestPSWTwo=false;
	$scope.isErrorPassWord=false;
	// $scope.isupPswdok=false;
	// $scope.isupPswdError=false;
	$scope.disabledPhoneBtn = true;
	$scope.isSubMin=true;
	$scope.smsFrom={};
	$scope.passwd={};
	$scope.bool=true;
	$rootScope.title = '找回密码-沪深理财';
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		if (type.name == '手机验证') {
			if(data.success){
				if (type.isvoice) {
					$scope.isGetVoice = true;
				} else {
					$scope.isGetVoice = false;
				}
				if (parseInt(type.nowTimer) <= 0 || type.nowTimer == undefined || type.nowTimer == '') {
					$filter('60秒倒计时')($scope,60);
				}
			}else{
				$scope.bool=false;
				// $scope.stop();
				subform.phone.$error.serverError = true;
				if (data.errorCode == '8888') {
					$scope.voiceRepeat = true; 
				} else {
					$scope.serverErrorCode = data.errorCode;
				}
				$scope.isGetCode = false;
			}
		}
		switch(type){
			// case "手机验证":
			// 	if(data.success){
			// 	}else{
			// 		$scope.stop();
			// 		subform.phone.$error.serverError = true;
			// 		$scope.serverErrorCode = data.errorCode;
			// 	}
			// break;
			case "提交验证":
				if(data.success){
					$scope.isRestPSWOne=false;
					$scope.isRestPSWTwo = true;
				}else{
					subform.pcode.$error.serverError = true;
					// $scope.isSuccess = data.success;
				}
			break;
			case "提交密码":
				$scope.isRestPSWTwo = false;
				if(data.success){
					$scope.isupPswdok=true;
				}else{
					$scope.isupPswdError=true;
				}
				$filter('6秒倒计时自动跳转')($scope,6);
			break;
		};
	});
	var subform;
	$scope.isGetVoice = false;
	$scope.onClick = function(type,form,isvoice,event){
		switch(type) {
			case "checkPassWord":
				resourceService.queryPost($scope,$filter('交互接口对照表')('修改用户密码-提交密码'),$scope.passwd,'提交密码');
			break;
			case "next":
				subform = form;
				resourceService.queryPost($scope,$filter('交互接口对照表')('修改用户密码-提交手机验证'),$scope.smsFrom,'提交验证');
			break;
			case "获取验证码":
				if(!$scope.nowTimer&&$scope.bool){
					$scope.bool=false;
					$scope.disabledPhoneBtn = true;
					if (!form.phone.$dirty) {
						$('.phone-box input').focus();
						$scope.bool=true;

					}
					if($scope.isSubMin && form.phone.$valid == false && form.phone.$dirty){
						if (!isvoice && parseInt($scope.nowTimer) > 0) {
							return;
						}
						var $this = $(event.currentTarget);
						if ($this.hasClass('getcode-disabled')) {
							return;
						}
						$scope.isGetCode = true;
						$scope.voiceRepeat = false;
						$scope.isvoice = isvoice;
						subform = form;
						$scope.smsFrom.type = isvoice + 1;
						resourceService.queryPost($scope,$filter('交互接口对照表')('修改用户密码-手机验证'),$scope.smsFrom,{name: '手机验证',isvoice: isvoice,nowTimer: $scope.nowTimer});
					}
				}
			break;
			case "toLogin":
				$scope.stopTimerout();
				$filter('跳转页面')('denLu','main.home','dl');
			break;
		}
	}
}])