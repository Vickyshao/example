/*lee 票据列表*/
mainModule.controller('bankBillCtrl', ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$localStorage','$sessionStorage', 'resourceService','$filter','communicationService','MAIN_MENU','ngDialog','$location',function($scope, $rootScope, $http, $state, $stateParams, $localStorage,$sessionStorage,resourceService,$filter,communicationService,MAINMENU,ngDialog,$location) {
	$filter('isLogin')($scope);
	$scope.order = 0;
	var pageSize = 10;
	$scope.bill={};
	$scope.bill.pageOn = 1;
	$scope.bill.statuses = [5];

	$scope.ju={};
	$scope.ju.pageOn = 1;
	$scope.ju.statuses = [5];
	
	$scope.youList = [];
	$scope.actList = [];

	$scope.path=$localStorage.pathObj;
	$rootScope.title = "投资产品列表-沪深理财";
	$scope.title = "票据投资";
	MAINMENU.menuname('bill','menu');

	if ($location.$$path == '/main/exclusiveBillList') {
        if ($localStorage.exclusiveUser == 1){
            $rootScope.activeNav ='exclusivePro';
            var exclusive = {};
            exclusive.order = 0;
            exclusive.pageOn = 1;
            exclusive.pageSize = 14;
            exclusive.type = 2;
            exclusive.statuses = [5]
            exclusive.isActivity = 2;
            exclusive.productUseType = 2;
            resourceService.queryPost($scope,$filter('交互接口对照表')('票据列表'),exclusive,'特邀专属标');
        }

        //专属标用户弹框显示不可参加活动
        $scope.showTip = function() {
        	ngDialog.open({
		        template: '<div class="operateError" style="width: 300px;font-size: 22px;padding: 25px 40px;background:rgba(0,0,0,0.7);color:#fff;border-radius:5px;-webkit-border-radius:5px;-moz-border-radius:5px;-ms-border-radius:5px;-o-border-radius:5px;">专属标不参加其它活动哦</div>',
		        showClose: false,
		        closeByDocument: true,
		        plain: true
		    });
		    setTimeout(function(){
		    	ngDialog.closeAll();
		    }, 3000);
		}
        $scope.now = new Date().getDate();
	    if($localStorage.exclusiveFirClick != undefined && $localStorage.exclusiveFirClick != ""){
	    	if($scope.now != $localStorage.exclusiveFirClick){
	    		$scope.showTip();
	    		$localStorage.exclusiveFirClick=$scope.now;
	    	}
	    }else{
	    	$scope.showTip();
	    	$localStorage.exclusiveFirClick=$scope.now;

	    }  

	}

    if ($location.$$path == '/main/bankBillList') {
		goPage($scope.order,$scope.bill.pageOn,2);
		goPage($scope.order,$scope.bill.pageOn,3);
		goPage($scope.order,$scope.ju.pageOn,'聚划算产品列表');
    }

	if ($location.$$path == '/main/pastBillList') {
		if ($location.$$search.type == undefined || $location.$$search.type == 1) {
			$scope.pastType = '往期优选投资';
			goPage($scope.order,$scope.bill.pageOn,'往期优选投资');
		} else if ($location.$$search.type == 2) {
			$scope.pastType = '往期90天活动标';
			goPage($scope.order,$scope.bill.pageOn,'往期90天活动标');
		} else if ($location.$$search.type == 3) {
			$scope.pastType = '往期聚划算';
			goPage($scope.order,$scope.ju.pageOn,'往期聚划算');
		}

    }

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case '用户信息':
				if (data.success) {
					$localStorage.user = data.map;
				}
				break;
			case "优选投资":
				$scope.map = data.map;
				$scope.youList = data.map.page.rows;
				var listLength = $scope.youList.length;
				
				for (var i=0; i<listLength; i++) {
					if ($scope.youList[i].prizeId != undefined) {
						$scope.youList[i].goUrl = 'main.investgiftBillDetail';
					} else {
						$scope.youList[i].goUrl = 'main.billDetail';
					}
				}
				/*
					双旦判断
				*/
				data.map.activity_60 = Number(data.map.activity_60);
				data.map.activity_180 = Number(data.map.activity_180);
				if(data.map.activity_60>0){
					$scope.shuangDanActivity=true;
				}else if(data.map.activity_180>0){
					$scope.shuangDanActivity=true;
				}else{
					$scope.shuangDanActivity=false;
				}
			break;
            case "特邀专属标":
                $scope.map = data.map;
                $scope.exclusive = data.map.page.rows;
                var exclusiveLength = $scope.exclusive.length;
                break;
			case "聚划算产品列表":
				$scope.juList = data.map.pi.rows;
			break;
			case "往期聚划算":
				$scope.juListPast = data.map.pi.rows;
				$scope.bill = data.map.pi;
				$scope.bill.pages = [];
				for(var i=0;i<parseInt($scope.bill.totalPage);i++){
					$scope.bill.pages[i]=i+1;
				}
			break;
			case "90天活动标":
				$scope.actList = data.map.page.rows;
				var actListLength = $scope.actList.length;
				
				for (var i=0; i<actListLength; i++) {
					if ($scope.actList[i].prizeId != undefined) {
						$scope.actList[i].goUrl = 'main.investgiftBillDetail';
					} else {
						$scope.actList[i].goUrl = 'main.billDetail';
					}
				}
			break;
			case "往期优选投资":
				$scope.youListPast = data.map.page.rows;
				$scope.bill = data.map.page;
				$scope.bill.pages = [];
				for(var i=0;i<parseInt($scope.bill.totalPage);i++){
					$scope.bill.pages[i]=i+1;
				}
				var youListPastLength = $scope.youListPast.length;
				for (var i=0; i<youListPastLength; i++) {
					if ($scope.youListPast[i].prizeId != undefined) {
						$scope.youListPast[i].goUrl = 'main.investgiftBillDetail';
					} else {
						$scope.youListPast[i].goUrl = 'main.billDetail';
					}
				}
			break;
			case "往期90天活动标":
				$scope.actListPast = data.map.page.rows;
				$scope.bill = data.map.page;
				$scope.bill.pages = [];
				for(var i=0;i<parseInt($scope.bill.totalPage);i++){
					$scope.bill.pages[i]=i+1;
				}
				var actListPastLength = $scope.actListPast.length;
				for (var i=0; i<actListPastLength; i++) {
					if ($scope.actListPast[i].prizeId != undefined) {
						$scope.actListPast[i].goUrl = 'main.investgiftBillDetail';
					} else {
						$scope.actListPast[i].goUrl = 'main.billDetail';
					}
				}
			break;
		};
	});

	// 用户信息
	if($localStorage.user != undefined){
		resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},'用户信息');
	}
	$scope.onClickToBillDetail=function (item) {$filter('跳转页面')('票据安选','main.bankBillList','main.billDetail',item,{pathName:'票据投资',url:'/main/bankBillList'});}
	$scope.an = {
		lv: 1,
		qx: 3,
		order: 0
	};
	$scope.ju = {
		lv: 1,
		qx: 3,
		order: 0
	};
	$scope.act = {
		least: 5,
		order: 0
	};
	$scope.past = {
		lv: 1,
		qx: 3,
		order: 0
	};
	$scope.pastan = {
		lv: 1,
		qx: 3,
		order: 0
	};
	$scope.pastju = {
		lv: 1,
		qx: 3,
		order: 0
	};
	$scope.pastact = {
		least: 5,
		order: 0
	};
	$scope.onClickPage=function (type,pageNum,listtype) {
		switch(type){
			case "beforPage":
				if($scope.bill.pageOn > 1){$scope.bill.pageOn -=1;goPage($scope.order,$scope.bill.pageOn,$scope.pastType);};
			break;
			case "currentPage":
				$scope.bill.pageOn = pageNum;goPage($scope.order,$scope.bill.pageOn,$scope.pastType);
			break;
			case "nextPage":
				if($scope.bill.pageOn < $scope.bill.pages.length){$scope.bill.pageOn +=1;goPage($scope.order,$scope.bill.pageOn,$scope.pastType);};
			break;
			case "期限":
				switch (listtype) {
					case 2:
						if($scope.an.qx == 3){
							$scope.an.qx = $scope.an.order = 4;
						}else{
							$scope.an.qx = $scope.an.order = 3;
						}
						$scope.an.lv = 1;
						goPage($scope.an.order,1,2);
					break;
					case '聚划算':
						if($scope.ju.qx == 3){
							$scope.ju.qx = $scope.ju.order = 4;
						}else{
							$scope.ju.qx = $scope.ju.order = 3;
						}
						$scope.ju.lv = 1;
						goPage($scope.ju.order,1,'聚划算产品列表');
					break;
					case '往期优选投资':
						if($scope.pastan.qx == 3){
							$scope.pastan.qx = $scope.pastan.order = 4;
						}else{
							$scope.pastan.qx = $scope.pastan.order = 3;
						}
						$scope.pastan.lv = 1;
						$scope.bill.pageOn = 1;
						$scope.order = $scope.pastan.order;
						goPage($scope.pastan.order,$scope.bill.pageOn,'往期优选投资');
					break;
					case '往期聚划算':
						if($scope.pastju.qx == 3){
							$scope.pastju.qx = $scope.pastju.order = 4;
						}else{
							$scope.pastju.qx = $scope.pastju.order = 3;
						}
						$scope.pastju.lv = 1;
						$scope.bill.pageOn = 1;
						$scope.order = $scope.pastju.order;
						goPage($scope.pastju.order,$scope.bill.pageOn,'往期聚划算');
					break;
				}
			break;
			case "利率":
				switch (listtype) {
					case 2:
						if($scope.an.lv == 1){
							$scope.an.lv = $scope.an.order = 2;
						}else{
							$scope.an.lv = $scope.an.order = 1;
						}
						$scope.an.qx = 3;
						goPage($scope.an.order,1,2);
					break;
					case '聚划算':
						if($scope.ju.lv == 1){
							$scope.ju.lv = $scope.ju.order = 2;
						}else{
							$scope.ju.lv = $scope.ju.order = 1;
						}
						$scope.ju.qx = 3;
						goPage($scope.ju.order,1,'聚划算产品列表');
					break;
					case '往期优选投资':
						if($scope.pastan.lv == 1){
							$scope.pastan.lv = $scope.pastan.order = 2;
						}else{
							$scope.pastan.lv = $scope.pastan.order = 1;
						}
						$scope.pastan.qx = 3;
						$scope.bill.pageOn = 1;
						$scope.order = $scope.pastan.order;
						goPage($scope.pastan.order,$scope.bill.pageOn,'往期优选投资');
					break;
					case '往期聚划算':
						if($scope.pastju.lv == 1){
							$scope.pastju.lv = $scope.pastju.order = 2;
						}else{
							$scope.pastju.lv = $scope.pastju.order = 1;
						}
						$scope.pastju.qx = 3;
						$scope.bill.pageOn = 1;
						$scope.order = $scope.pastju.order;
						goPage($scope.pastju.order,$scope.bill.pageOn,'往期聚划算');
					break;
				}
			break;
			case "起投金额":
				switch (listtype) {
					case 3:
						if($scope.act.least == 5){
							$scope.act.least = $scope.act.order = 6;
						}else{
							$scope.act.least = $scope.act.order = 5;
						}
						goPage($scope.act.order,1,3);
					break;
					case '往期90天活动标':
						if($scope.pastact.least == 5){
							$scope.pastact.least = $scope.pastact.order = 6;
						}else{
							$scope.pastact.least = $scope.pastact.order = 5;
						}
						$scope.bill.pageOn = 1;
						$scope.order = $scope.pastact.order;
						goPage($scope.pastact.order,$scope.bill.pageOn,'往期90天活动标');
					break;
				}
			break;
			case "默认":
				switch (listtype) {
					case 2:
						$scope.an.lv = 1;
						$scope.an.qx = 3;
						$scope.an.order=0;
						goPage($scope.an.order,1,2);
					break;
					case '聚划算':
						$scope.ju.lv = 1;
						$scope.ju.qx = 3;
						$scope.ju.order=0;
						goPage($scope.ju.order,1,'聚划算产品列表');
					break;
					case 3:
						$scope.act.least = 5;
						$scope.act.order = 0;
						goPage($scope.act.order,1,3);
					break;
					case '往期优选投资':
						$scope.pastan.lv = 1;
						$scope.pastan.qx = 3;
						$scope.pastan.order=0;
						$scope.bill.pageOn = 1;
						$scope.order = $scope.pastan.order;
						goPage($scope.pastan.order,$scope.bill.pageOn,'往期优选投资');
					break;
					case '往期聚划算':
						$scope.pastju.lv = 1;
						$scope.pastju.qx = 3;
						$scope.pastju.order=0;
						$scope.bill.pageOn = 1;
						$scope.order = $scope.pastju.order;
						goPage($scope.pastju.order,$scope.bill.pageOn,'往期聚划算');
					break;
					case '往期90天活动标':
						$scope.pastact.least=5;
						$scope.pastact.order=0;
						$scope.bill.pageOn = 1;
						$scope.order = $scope.pastact.order;
						goPage($scope.pastact.order,$scope.bill.pageOn,'往期90天活动标');
					break;
				}
			break;
		};
	}
	function goPage(order,pageOn,type) {
		// 翻页
		var obj = {},
			str = '';
		obj.order = order; 
		obj.pageOn = pageOn; 
		obj.pageSize = 14;
		obj.productPrize = 1;
		if (type != undefined) {
			// obj.type = type; // 不传type过去并且在页面中把type为1的隐藏
		}
		obj.statuses = [5];
		if (type == 2) {
			str = '优选投资';
			obj.pageSize = 100;
			obj.isActivity = 2;
			delete obj.productPrize;
		} else if (type == 3) {
			str = '90天活动标';
			obj.pageSize = 100;
			obj.isActivity = 1;
			if (order == 0) {
				obj.productPrize = 1;
			} else {
				delete obj.productPrize;
			}
		} else if (type == '聚划算产品列表') {
			str = '聚划算产品列表';
			obj.pageSize = 100;
			obj.isActivity = 2;
			delete obj.productPrize;
		} else if (type == '往期优选投资') {
			obj.pageSize = 10;
			obj.statuses = [6,8,9];
			obj.isActivity = 2;
			str = '往期优选投资';
			delete obj.productPrize;
		} else if (type == '往期聚划算') {
			obj.pageSize = 10;
			obj.statuses = [6,8,9];
			obj.isActivity = 2;
			str = '往期聚划算';
			delete obj.productPrize;
		} else if (type == '往期90天活动标') {
			obj.pageSize = 10;
			obj.statuses = [6,8,9];
			obj.isActivity = 1;
			str = '往期90天活动标';
			if (order == 0) {
				obj.productPrize = 1;
			} else {
				delete obj.productPrize;
			}
		}
		if (type == '聚划算产品列表' || type == '往期聚划算') {
			resourceService.queryPost($scope,$filter('交互接口对照表')('聚划算产品列表'),obj,str);
		} else {
			resourceService.queryPost($scope,$filter('交互接口对照表')('票据列表'),obj,str);
		}
	};

	// 监听关闭砸金蛋弹窗
	$rootScope.$on('closeEgg', function(event, flag) {
		if (flag) {
			if ($localStorage.eggProItem && $localStorage.eggEnroll) {
				if ($localStorage.eggEnroll == 'list') {
					var listLength = $scope.listDatas.length;
					for (var i=0; i<listLength; i++) {
						if ($scope.listDatas[i].id == $localStorage.eggProItem.id) {
							$scope.listDatas[i].isEgg = 2;
							$scope.listDatas[i].maxActivityCoupon = $localStorage.eggProItem.maxActivityCoupon;
							$('.list-mode .egg-box').eq(i).find('.shake-rotate').hide();
							$('.list-mode .egg-box').eq(i).find('.num').eq(0).hide();

							$('.list-mode .egg-box').eq(i).find('.egg-sopenegg').show().removeClass('ng-hide');
							$('.list-mode .egg-box').eq(i).find('.num').eq(1).show().removeClass('ng-hide');
							delete $localStorage.eggProItem;
							delete $localStorage.eggEnroll;
							break;
						}
					}
				}
			}
			ngDialog.closeAll();
		}
	});
	$scope.ifGoDetail = function(e,item) {
		if (item.isEgg == 1) {
			e.stopPropagation();
		}
	};
	$scope.noGoDetail = function(e) {
		e.stopPropagation();
	};

	// $scope.anShow = 1;
	// $scope.changeTo = function(item) {
	// 	switch(item) {
	// 		case 'an':
	// 			$scope.anShow = 1;
	// 		break;
	// 		case 'you':
	// 			$scope.anShow = 0;
	// 		break;
	// 	};
	// }
}])
