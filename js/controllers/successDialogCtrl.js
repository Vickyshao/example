
/* si 充值提现弹窗 */
mainModule.controller('successDialogCtrl', ['$scope','ngDialog','$localStorage','$state' ,function($scope,ngDialog,$localStorage,$state) {
	$scope.status = $localStorage.dialogStatus;
	$scope.type = $localStorage.dialogType;
	$scope.msg = $localStorage.dialogMsg;
	switch($scope.status) {
		case 'success':
			$scope.text = '成功';
			break;
		case 'ing':
			$scope.text = '处理中';
			break;
		case 'error':
			$scope.text = '失败';
			break;
	}
	$scope.closeDialog = function(bool) {
		ngDialog.closeAll();
		if(!bool){
			if ($scope.type === '充值') {
				// $state.go('main.myAccount.recharge',null,{
				//     reload:true
				// });
				$scope.isSubmit = false;
			} else if ($scope.type === '提现') {
				$state.go('main.myAccount.Withdraw',null,{
				    reload:true
				});
			}
		}
	};
}]);