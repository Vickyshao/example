mainModule.controller('newguideCtrl', ['$location','$rootScope','$localStorage','$scope','$http','resourceService','$filter',function($location,$rootScope,$localStorage,$scope,$http,resourceService,$filter) {
	$scope.showStep = 1;
	
	$scope.next = function() {
		if ($scope.showStep < 4) {
			$scope.showStep ++;
			// $scope.showImg($scope.showStep);
		} else {
			$scope.showStep = 1;
		}
	};
	$scope.prev = function() {
		if ($scope.showStep > 1) {
			$scope.showStep --;
			// $scope.showImg($scope.showStep);
		} else {
			$scope.showStep = 4;
		}
	};
	var $wrap = $('.newguide-window ul');
	$scope.showImg = function(step) {
		$wrap.animate({'marginLeft': -(step-1)*827},300);
	}
	// $scope.newHandId = $localStorage.newHandId;
}])