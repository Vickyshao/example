/* 风险评测 */
mainModule.controller('riskAssessCtrl', ['$location','$rootScope','$localStorage','$scope','$http','resourceService','$filter','ngDialog','$window','$state',function($location,$rootScope,$localStorage,$scope,$http,resourceService,$filter,ngDialog,$window,$state) {
	$rootScope.title = '风险评测-沪深理财';
	$scope.answer = [];
    resourceService.queryPost($scope,$filter('交互接口对照表')('风险评测题目'),{},'风险评测题目');

    //选择变化时
    $scope.sendList = [];
    $scope.optionItem = function (id,oid) {
        var optionObj = {
            id: id,
            oid:oid
        };
        for (var i = 0; i < $scope.sendList.length; i++) {
            if($scope.sendList[i].id==id){
                $scope.sendList.splice(i,1);
                i--; 
            }
            
        };
        $scope.sendList.push(optionObj);
        // console.log($scope.sendList);
        // console.log(angular.toJson($scope.sendList));
    };

    //提交
    $scope.subClick=function(clickName,tegForm){
       
        if($scope.sendList.length==$scope.subjects){
            var str='';
            for (var i = 0; i < $scope.sendList.length; i++) {
                str+=$scope.sendList[i].id+','+$scope.sendList[i].oid+';';
            };
            // console.log(str);
            resourceService.queryPost($scope,$filter('交互接口对照表')('风险评测提交'),{itemListStr:str},'风险评测提交');
        }else{
            for (var i = 0; i < $scope.subjects; i++) {
               
                if($scope.answer[i]==null){
                    // var s='#'+'locate'+i+'';
                    // console.log("s");
                    //定位锚点
                    $("html, body").animate({  
                        scrollTop: $('#'+'locate'+i+'').offset().top-30 }, {duration: 100,easing: "linear"}); 
                    //未完成弹窗显示3秒消失
                    $filter('风险评测未完成弹窗')($scope);
                    setTimeout(function () {
                         ngDialog.closeAll();
                    }, 2000);

                    break;
                }
            };
        }

    };

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
        switch(type){
            case "风险评测题目":
                $scope.list=data.map.list;
 				$scope.subjects=data.map.list.length;
            break;
            case "风险评测提交":
                $scope.riskResult=data.map;
                $filter('风险评测结果弹窗')($scope);
                
            break;
            
        }
    });

    //结果弹窗立即投资
    $scope.toInvest=function(){
        ngDialog.closeAll();
        if($localStorage.pathUrl != undefined && $localStorage.pathUrl == 'main.investConfirm'){
            $state.go($localStorage.pathUrl);
        }else{
            $state.go('main.bankBillList');
        }
    };

    //结果弹窗重新评测
    $scope.assessAgain=function(){
        ngDialog.closeAll();
        $window.location.reload();
        setTimeout(function () {
             $(window).scrollTop(0);
        }, 0);
        
    };




}])

mainModule.controller('riskTipPromiseCtrl', ['$location','$rootScope','$scope','$filter',function($location,$rootScope,$scope,$filter) {
    $rootScope.title = '风险提示书与承诺书-沪深理财';
    
    $scope.toInvest=function(){
        $filter("跳转页面")('', 'main.riskTipPromise','main.billDetail', null,'');
        // $filter('跳转页面')('','main.myAccount.recharge','main.bindcard','',null,{name:'实名绑卡',url:'main.bindcard'});
    }
    

}])
