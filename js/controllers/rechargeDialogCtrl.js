/* 充值弹窗 */
mainModule.controller('rechargeDialogCtrl', ['$scope','ngDialog','$localStorage','$state' ,function($scope,ngDialog,$localStorage,$state) {
	$scope.goToPage = function(url, str) {
		ngDialog.closeAll();
		if (str == 'showQA') {
			$localStorage.showQA = true;
		} else if (str == 'reload') {
			$state.go('main.myAccount.recharge',null,{
			    reload:true
			});
			return;
		}
		$state.go(url);
	};
	ngDialog.close = function() {
		ngDialog.closeAll();
		$state.go('main.myAccount.recharge',null,{
		    reload:true
		});
	};
}]);