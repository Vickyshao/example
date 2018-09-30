/* 沪深送财 */
mainModule.controller('yhtgCtrl', ['$rootScope','$scope','$filter','$location','$localStorage',function($rootScope,$scope,$filter,$location,$localStorage) {
	$rootScope.title = '资金安全-沪深理财';
	$scope.checkImg = function (type) {
		$filter("图片放大弹窗")($scope);
		$localStorage.bigimgType = type;
	};
	// var $smallImgTable = $('.small-img table'),
 //        $triggerL = $('.trigger-l'),
 //        $triggerR = $('.trigger-r');
	// $triggerR.on('click', function() {
 //        if ($triggerR.hasClass('nouse')) {
 //            return;
 //        } else {
 //            $smallImgTable.animate({'margin-left': '-101px'}, 500, function() {
 //                $triggerR.addClass('nouse');
 //                $triggerL.removeClass('nouse');
 //            });
 //        }
 //    });
 //    $triggerL.on('click', function() {
 //        if ($triggerL.hasClass('nouse')) {
 //            return;
 //        } else {
 //            $smallImgTable.animate({'margin-left': 0}, 500, function() {
 //                $triggerL.addClass('nouse');
 //                $triggerR.removeClass('nouse');
 //            });
 //        }
 //    });
}]);