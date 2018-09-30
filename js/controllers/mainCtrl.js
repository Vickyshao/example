var mainModule = angular.module('mainModule', [ 'ngStorage' ]);
/*后台接口测试*/
mainModule.controller('serverTestCtrl', [ '$scope', '$rootScope', '$http', '$state', '$stateParams', '$localStorage','$location', 'resourceService','communicationService','$filter',function($scope, $rootScope, $http, $state, $stateParams, $localStorage,$location,resourceService,communicationService,$filter) {
	$rootScope.title="test";
	resourceService.queryPost($scope,$filter('交互接口对照表')('后台测试用'),{},'后台测试');
		$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
			switch(type){
				case "后台测试":
					if(data.success){
						$scope.test = data;
					}
				break;
			};
		});
}])

/*mian*/
mainModule.controller('mainCtrl', [ '$scope', '$rootScope', '$http', '$state', '$stateParams', '$localStorage','$location', 'resourceService','communicationService','$filter','ngDialog','$timeout',function($scope, $rootScope, $http, $state, $stateParams, $localStorage,$location,resourceService,communicationService,$filter,ngDialog,$timeout) {

	$scope.version='test 0.01';
	$scope.state=$state.current.name;
	$rootScope.title="沪深理财—网贷投资，国企控股平台";
	$filter('isLogin')($scope);

	$rootScope.activeNav = 'home';
	$rootScope.listFlag = false;
	$rootScope.listTimer = null;

	$scope.showEggTag = 1;
	$scope.finishShare = false;

    $scope.rechargePros = $localStorage.rechargePros;
    $scope.fullProcess = $localStorage.fullProcess;

	//绑卡页面没有菜单
    $scope.$watch(function(){
		if($location.$$path == '/main/bindcard' || $location.$$path == '/main/bindcardSuccess' || $location.$$path == '/main/bindcardFail' || $location.$$path == '/main/investConfirm') {
		    $scope.noMenu = true;
		    //有投资信息时显示进度条
		    $scope.investInfo=false;
			if($localStorage.product!=undefined && $localStorage.product!=""){
				if($localStorage.product.nowNum!=undefined && $localStorage.product.nowNum!=""){
					$scope.investInfo=true;
				}
			}
			if($location.$$path == "/main/investConfirm") {
                $scope.rechargePros = true;
			} else if ($localStorage.product.investTime) {
                $scope.rechargePros = false;
                $scope.fullProcess = true;
			} else {
                $scope.rechargePros = false;
                $scope.fullProcess = false;
			}
		}else{
			$scope.noMenu = false;
		}
	})

	//营销QQ
    $scope.mouseover = function () {
        $scope.count = true;
    };
    $scope.mouseout = function () {
        $timeout(function(){
            $scope.count = false;
		},2000);
    };

    $('html, body').scrollTop(0);

    if($localStorage.exclusiveUser) {
        $scope.exclusiveUser = $localStorage.exclusiveUser;
	}

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case "资产首页":
				if(data.success){
					$filter("clickTouZiGotoWhere")($scope,'main.myAccount.accountHome');
				}
			break;
			case "砸金蛋加息券":
				if (data.success) {
					$scope.newEgg = data.map.newActivityCoupon;
					$localStorage.eggProItem.maxActivityCoupon = $scope.newEgg.raisedRates;
					if (data.map.oldActivityCoupon) {
						$scope.oldEgg = data.map.oldActivityCoupon;
					}
				} else {
					$.qTip({
						'type': false,
						'text': data.errorMsg
					});
					$scope.closeEggDialog();
				}
			break;
		};
	});
	$scope.$on('MAIN_MENU.MYEVENT', function(event,name,type) {
		$rootScope.activeNav =name;
	});
	$scope.gotoLoginPage = function (type,event) {
		$rootScope.activeNav =type;
		switch(type){
			case "AX"://安选
				$scope.$broadcast('main.TOList',{},'安选');
				$filter("跳转页面")(type,'main.home','main.bankBillList');
			break;
			case "home"://
				$rootScope.activeNav ='home';
			break;
			// case "新手指引"://优选
			// 	$filter('跳转页面')('','main.home','main.guide','新手指引',null,{name:'',url:'main.guide'});
			// break;
			//
			case "安全保障"://优选
				$filter('跳转页面')('','main.home','main.guarantee','安全保障',null,{name:'安全保障',url:'main.guarantee'});
			break;
			case "myAccount"://我的资产
				// resourceService.queryPost($scope,$filter('交互接口对照表')('我的资产首页数据'),{},'资产首页');
				$filter("clickTouZiGotoWhere")($scope,'main.myAccount.accountHome');
			break;
			case "帮助中心"://我的资产
				$localStorage.showQA = false;
				$filter('跳转页面')('','main.home','main.jt.help','帮助中心',null,{name:'帮助中心',url:'main.jt.help'});
			break;
			case "投资课堂"://我的资产
				$filter('跳转页面')('','main.home','main.jt.LCZS','帮助中心',null,{name:'帮助中心',url:'main.jt.LCZS'});
			break;
			case "新手指引"://我的资产
				$filter('跳转页面')('','main.home','main.guide','新手指引',null,{name:'新手指引',url:'main.guide'});
			break;

			case "信息披露"://我的资产
				$filter('跳转页面')('','main.home','main.jt.JSGK','信息披露',null,{name:'信息披露',url:'main.jt.JSGK'});
			break;
			case "沪深概况"://我的资产
				$filter('跳转页面')('','main.home','main.jt.JSGK','信息披露',null,{name:'信息披露',url:'main.jt.JSGK'});
			break;
			case "法律法规"://我的资产
				$filter('跳转页面')('','main.home','main.jt.FLFG','信息披露',null,{name:'信息披露',url:'main.jt.FLFG'});
			break;
			case "联系我们"://我的资产
				$filter('跳转页面')('','main.home','main.jt.LXWM','LXWM',null,{name:'信息披露',url:'main.jt.LXWM'});
			break;
			case "aboutus"://我的资产
				$filter('跳转页面')('','main.home','main.jt.JSGK','JSGK',null,{name:'信息披露',url:'main.jt.JSGK'});
			break;
			// case "new"://我的资产
			// 	$filter('跳转页面')('','main.home','main.jt2.XSZY','XSZY',null,{name:'帮助中心',url:'main.jt2.XSZY'});
			// break;
			
			default:
				$filter("跳转页面")(type,'main.home','dl');
			break;
		};
	};
/*退出*/
	$scope.userOut = function (event) {
		$filter('清空缓存')();
		resourceService.queryPost($scope,$filter('交互接口对照表')('退出接口'),{},'退出');
        $localStorage.exclusiveUser = $scope.exclusiveUser = null;
        delete $localStorage.exclusiveUser ;
        delete $localStorage.enfuInvestResults ;

        //删除绑卡失败的信息
        if($localStorage.errorbank != undefined){
        	delete $localStorage.errorbank;
        }
        //删除投资充值进度条
        if($localStorage.rechargePros != undefined){
        	delete $localStorage.rechargePros;
        }
        //删除投资充值进度条
        if($localStorage.fullProcess != undefined){
        	delete $localStorage.fullProcess;
        }

        
		if($location.$$url.indexOf('myAccount') != -1 || ($location.$$url.indexOf('bindcard') != -1)){
//			$filter("跳转页面")('denLu','main.myAccount.accountHome','dl');
//			$filter("跳转页面")('denLu','main.home','dl');
			$filter("跳转页面")('','main.home','main.home');
		};
		$rootScope.$emit('exitSuccess',true);
	};
	var obj ={'pageOn':2,'pageSize':10,'order':0,'type':2};
		// $filter('砸金蛋弹窗')($scope);

	// 砸金蛋活动
	$scope.showEggDialog = function(item,enroll) {

		// $scope.showMainEggDialog = true;
		$localStorage.eggProItem = item;
		$localStorage.eggEnroll = enroll;

		if ($localStorage.eggProItem.isZa == undefined) {
			$localStorage.eggProItem.isZa = true;
			$scope.showEggTag = 1;
			$scope.finishShare = false;
			resourceService.queryPost($scope,$filter('交互接口对照表')('砸金蛋加息券'),{id: item.id},'砸金蛋加息券');
			// $localStorage.eggProItem = item;
			$scope.showEggTag = 1;
			$filter('砸金蛋弹窗')($scope);
			$scope.eggPID = item.id;
			if (enroll == 'detail') {
				$scope.eggEnrollIsDetail = true;
			} else {
				$scope.eggEnrollIsDetail = false;
			}
			if ($localStorage.user) {
				$scope.eggMobilePhone = $localStorage.user.mobilephone;
			}
		}
	};
	$scope.closeEggDialog = function() {
		$rootScope.$emit('closeEgg',true);
		// $scope.showMainEggDialog = false;
	};
	$scope.closeEggDialogOnly = function() {
		// $scope.showMainEggDialog = false;
		ngDialog.closeAll();
	};
	$scope.showEggShare = function() {
		$scope.showEggTag = 2;
		setTimeout(function() {
			$scope.$apply(function() {
				$scope.finishShare = true;
			});
		}, 8000);

		var qrcode = new QRCode('eggqrcode', {
			text: 'http://m.hushenlc.cn/newcomer?wap=true&toFrom=zjdfxfx&fromPcWindow=true&recommCode=' + $scope.eggMobilePhone,
			render: 'table',
			width: 170,
			height: 170,
			colorDark : '#000000',
			colorLight : '#ffffff',
			correctLevel : QRCode.CorrectLevel.M
		});
		if(navigator.appName.indexOf("Microsoft") != -1){
			//IE
			if(navigator.appVersion.match(/8./i)=="8."){
				var qrcode = new QRCode('eggqrcode', {
					text: 'http://m.hushenlc.cn/newcomer?wap=true&toFrom=zjdfxfx&fromPcWindow=true&recommCode=' + $scope.eggMobilePhone,
					render: 'table',
					width: 110,
					height: 110,
					colorDark : '#000000',
					colorLight : '#ffffff',
					correctLevel : QRCode.CorrectLevel.M
				});
			}
		}
	};
	$scope.getSecEgg = function(id) {
		// $('.egg-lhammer').addClass('.lhammer');
		if ($localStorage.eggProItem.isZaSec == undefined) {
			$localStorage.eggProItem.isZaSec = true;
			resourceService.queryPost($scope,$filter('交互接口对照表')('砸金蛋加息券'),{id: id},'砸金蛋加息券');
		}
	};

}])


/* si 404页面 */
mainModule.controller('falseCtrl', ['$scope', function($scope) {
	$('.false-wrapper').height($(window).height());
}]);
// 图片弹窗
mainModule.controller('bigimgDialogCtrl', ['$rootScope','$scope','$filter','$location','$localStorage',function($rootScope,$scope,$filter,$location,$localStorage) {
	$scope.bigimgType = $localStorage.bigimgType;
}]);













