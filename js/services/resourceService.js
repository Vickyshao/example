/*
    username注意
    grid = 表格数据

 */

routerApp.factory(
		'resourceService', 
		['$state','$resource', '$http','$rootScope', 'ngDialog','$filter','$localStorage',function($state,$resource, $http,$rootScope,ngDialog,$filter,$localStorage) {
	return new resourceService($resource, $http,$state,$rootScope,ngDialog,$filter,$localStorage);
}]);
routerApp.factory('storage',function(){
	return {
		storageData:null
	}
})
/*缓存要跳转到页面名*/
routerApp.factory(
		'communicationService', 
		['$state','$resource', '$http','$rootScope', 'ngDialog','$filter','$localStorage',function($state,$resource, $http,$rootScope,ngDialog,$filter,$localStorage) {
	return new function(){
		var tag = {};
		/*路径*/
		this.setTagPage=function(name,url){
			tag.name=name;
			tag.url=url;
		};
		this.getTagPage=function(){
			return tag;
		};
		/*产品*/
		this.setProduct=function(item){	tag.product = item;}
		this.getProduct=function(){return tag.product;}
	};
}]);
/*缓存要跳转到页面名*/
routerApp.factory(
		'MAIN_MENU', 
		['$state','$resource', '$http','$rootScope', 'ngDialog','$filter','$localStorage',function($state,$resource, $http,$rootScope,ngDialog,$filter,$localStorage) {
	return new function(){

		this.menuname = function(name,type){
			$rootScope.$broadcast('MAIN_MENU.MYEVENT',name,type);
		}
	};
}]);


function resourceService(resource, http , $state, $rootScope, ngDialog, $filter,$localStorage) {
	var actions = {
		'query':{
            method:'GET'
        },
        'queryPost':{
        	method:'POST'
        	// headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'} 
        },
        'formGet':{
        	method:'GET',
        	async:false
        	// headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'} 
        }
    };
	//加载json模板页面
	this.getJsonServer = function(scope,url,data,type) {
		showMask($rootScope);
		var queryResource = resource(url, {}, actions);
		queryResource.query(data, function(data) {
			removeMask($rootScope);
				scope.$broadcast('resourceService_GET_JSON.MYEVENT',data,type);
		}, function(error) {
			removeMask($rootScope);
			$filter('errorUserMessages')('netErro', ngDialog,scope);
		});
	};
		//查找
	this.queryPost = function(scope,url,data,type) {
				showMask($rootScope);
				/*临时改变时间*/
				if ($filter('isOnLine')()) {
					var queryResource = resource(url, {}, actions);
					queryResource.queryPost(data, function(data) {
						removeMask($rootScope);
						if(data.success){
							scope.$broadcast('resourceService.QUERY_POST_MYEVENT',data,type);
						}else{
							if(data.errorCode == '9999'){
                                ngDialog.open({
                                    template: '<div class="operateError" style="padding: 80px 55px; font-size: 15px;">操作失败！平台暂不支持您的银行卡<br/>请联系客服更换银行卡，给您带来不便深表歉意。<br/><br/>客服热线：400-031-9909（周一至周五 09:00-18:00）<div class="ngdialog-close" style="position: absolute; top:15px; right: 15px; cursor:pointer;"></div></div>',
                                    showClose: false,
                                    closeByDocument: true,
                                    plain: true
                                });
								// $state.go('404');
							}else if (data.errorCode == 'XTWH') {
								ngDialog.closeAll();
								$state.go('500');
							}else{
								scope.$broadcast('resourceService.QUERY_POST_MYEVENT',data,type);
							}
						}

					}, function(error) {
						removeMask($rootScope);
						// $filter('服务器信息')(type, scope,'y');
					});
				}else{
					if(type=='票据详情'){
						$filter('获取产品详情错误')(data.errorCode)
					}else{
						test(scope,url,data,type);
					}
				};
	};
		//查找
	this.formGet = function(scope,url,data,type) {
				showMask($rootScope);
				/*临时改变时间*/
				if ($filter('isOnLine')()) {
					var queryResource = resource(url, {}, actions);
					queryResource.queryPost(data, function(data) {
						removeMask($rootScope);
						if(data.success){
							scope.$broadcast('resourceService.QUERY_POST_MYEVENT',data,type);
						}else{
							if(data.errorCode == '9999'){
								$state.go('404');
							}else if (data.errorCode == 'XTWH') {
								ngDialog.closeAll();
								$state.go('500');
							}else{
								scope.$broadcast('resourceService.QUERY_POST_MYEVENT',data,type);
							}
						}

					}, function(error) {
						removeMask($rootScope);
						// $filter('服务器信息')(type, scope,'y');
					});
				}else{
					test(scope,url,data,type);
				};
	};


	var testnum =0;
	/*静态调试模块*/
	function test(scope,url,data,type) {
		removeMask($rootScope);
		switch(type){
			case '登录': 
				/*
				name:用户姓名
				phone:用户手机号
				balance:用户帐户余额
				earningsNum：用户已投资产品数量
				userType:用户状态 0=普通登录;1=已绑卡；2=已绑手机
				*/
				var data ={name:'lee',phone:13661836696,balance:100.05,earningsNum:3,userType:0};
				$localStorage.user = data;
				data.name +='，';
		 		scope.$broadcast('resourceService.QUERY_POST_MYEVENT',data,type);
			break;
			case '注册':  
				var data ={name:'lee',phone:13661836696,balance:100.05,earningsNum:3,userType:0};
		 		scope.$broadcast('resourceService.QUERY_POST_MYEVENT',data,type);
			break;
			case '实名认证完成':  
				var data ={name:'lee',phone:13661836696,balance:100.05,earningsNum:3,userType:1};
		 		scope.$broadcast('resourceService.QUERY_POST_MYEVENT',data,type);
			break;
			case '安全认证数据':  
				var data = {
						truename:{type: false,data: {name: "",idcard: ""}},
						passwd:{type: true}
					};
		 		scope.$broadcast('resourceService.QUERY_POST_MYEVENT',data,type);
			break;
			case '安全认证实名认证表单提交':  
				var data ={status: true};
		 		scope.$broadcast('resourceService.QUERY_POST_MYEVENT',data,type);
			break;
			case '安全认证原始密码验证':
				var data ={status: false};
		 		scope.$broadcast('resourceService.QUERY_POST_MYEVENT',data,type);
			default:
				showMask($rootScope);
				var queryResource = resource(url, {}, actions);
				queryResource.query(data, function(data) {
					removeMask($rootScope);
					if(type == '实时更新注册人数'){
						testnum++;
						data.result.register += testnum;
						data.result.successfulTrade += (testnum + 1);
					}
						scope.$broadcast('resourceService.QUERY_POST_MYEVENT',data,type);
				}, function(error) {
					removeMask($rootScope);
					$filter('errorUserMessages')('netErro', ngDialog,scope);
				});
			break; 
		};
	}
	/******静态调结束*******/
	function showMask(rootSp){
		rootSp.maskHidde = true;
	};
	function removeMask(rootSp){
		rootSp.maskHidde = false;
	};
};
