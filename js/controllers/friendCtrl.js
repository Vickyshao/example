
/*好友推荐*/
mainModule.controller('friendCtrl', ['$location','$rootScope','$localStorage','$scope','$http','resourceService','$filter','$window',function($location,$rootScope,$localStorage,$scope,$http,resourceService,$filter,$window) {
	$rootScope.title = '邀请好友-沪深理财';
	if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined){
		$localStorage.webFormPath = $location.$$search;
	};
	$scope.login = 0;
	if (!$filter('isRegister')().register) {
		$scope.login = 0;
		window._bd_share_config = {
			"common":{
				"bdSnsKey":{},
				"bdText":"春暖花开季，沪深送万金。壕友喊你领钱拉！10000元体验金等你来领。https://www.duorongcf.com/zhuce?recommCode=",
				"bdMini":"2",
				"bdMiniList":[],
				"bdPic":"",
				"bdStyle":"0",
				"bdSize":"32",
				"bdUrl": "https://www.duorongcf.com/zhuce?recommCode="
			},
			"share":{}
		};
		if ($('#share-script').length) {
			$('#share-script').remove();
		}
		with(document)0[$('<script id="share-script" src="static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)+'"></script>').appendTo('body')];
	} else {
		$scope.login = 1;
	}
	$scope.rules = [
		{
			enableAmount: 500,
			amount: 5
		},
		{
			enableAmount: 1000,
			amount: 8
		},
		{
			enableAmount: 2000,
			amount: 15
		},
		{
			enableAmount: 5000,
			amount: 25
		},
		{
			enableAmount: 10000,
			amount: 40
		},
		{
			enableAmount: 50000,
			amount: 180
		},
		{
			enableAmount: 100000,
			amount: 888
		}
	];
	// $localStorage.pathUrl='newFriend';
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type) {

			case "我的好友":
				if (data.success) {
					$scope.user = data.map;
					window._bd_share_config = {
						"common":{
							"bdSnsKey":{},
							"bdText":"春暖花开季，沪深送万金。壕友喊你领钱拉！10000元体验金等你来领。https://www.duorongcf.com/zhuce?recommCode=" + $scope.user.recommCodes,
							"bdMini":"2",
							"bdMiniList":[],
							"bdPic":"",
							"bdStyle":"0",
							"bdSize":"32",
							"bdUrl": "https://www.duorongcf.com/zhuce?recommCode=" + $scope.user.recommCodes
						},
						"share":{}
					};
					if ($('#share-script').length) {
						$('#share-script').remove();
					}
					with(document)0[$('<script id="share-script" src="static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)+'"></script>').appendTo('body')];
				} else {
					
				}
				break;
		}
	});
	if ($scope.login == 1) {
		resourceService.queryPost($scope, $filter('交互接口对照表')('我的好友'),{},'我的好友');
	}

	$scope.copy = function() {
		if ($scope.login == 0) {
			$filter("跳转页面")('denLu','main.home','dl');
			return;
		}
		$('#mycopy').select(); // 选择对象
		document.execCommand("Copy"); // 执行浏览器复制命令
		alert("已复制好，可贴粘。");
	};

	$scope.gotoLoginPage = function (type) {
		$filter("跳转页面")(type,'main.home','dl');
	};
	/*退出*/
	$scope.userOut = function (event) {
		$filter('清空缓存')();
		resourceService.queryPost($scope,$filter('交互接口对照表')('退出接口'),{},'退出');

		if($location.$$url.indexOf('myAccount') != -1){
			$filter("跳转页面")('denLu','main.myAccount.accountHome','dl');
		};
	};
	$scope.gotoPage = function() {
		$filter("clickTouZiGotoWhere")($scope,'main.myAccount.accountHome');
	};
}])