mainModule.controller('manageCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService','$state','ngDialog','storage','$timeout',function($rootScope,$scope,$location,$localStorage,$filter,resourceService,$state,ngDialog,storage,$timeout) {
	$rootScope.title = '全民寻钱记 3000元现金任你拿';
    var $list = $('.foruser ul');
    $scope.isLogin = $filter('isRegister')().register;

    if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined||$location.$$search.tid != undefined) {
        $localStorage.webFormPath = $location.$$search;
    }
    
    if (!$scope.isLogin) {
        $localStorage.activityUrl = 'extend.manage';
    } else {
        resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},'首页主数据');
    }
    resourceService.queryPost($scope,$filter('交互接口对照表')('518活动信息'),{},'518活动信息');
    resourceService.queryPost($scope,$filter('交互接口对照表')('活动页产品列表'),{},'活动页产品列表');

    // 监听退出是否成功
    $rootScope.$on('exitSuccess', function(event, flag) {
        if (flag) {
            $scope.isLogin = false;
        }
    });

    $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
        switch(type){
            case "首页主数据":
                $scope.user = data.map;
                if (data.map.realName == '' || data.map.realName == undefined) {
                    $scope.user.userName = '亲爱的用户';
                } else {
                    $scope.user.userName = data.map.realName;
                }
                $localStorage.user = $scope.user;
            break;
            case "518活动信息":
                if (data.success) {
                    $scope.amount = data.map.amount;
                    $scope.count = data.map.count;
                    $scope.list = data.map.activList;
                    if ($scope.list.length > 5) {
                        setInterval(function() {
                            $list.animate({'marginTop':'-46px'},800,function() {
                                $list.find('li').eq(0).appendTo($list);
                                $list.css({'marginTop':0});
                            });
                        }, 3000);
                    }
                }
            break;
            case "活动页产品列表":
                if (data.success) {
                    $scope.proList = data.map.list;
                    var proLength = $scope.proList.length;
                    for (var i=0;i<proLength;i++) {
                        if ($scope.proList[i].deadline == 60) {
                            $scope.pro60 = $scope.proList[i];
                        } else if ($scope.proList[i].deadline == 180) {
                            $scope.pro180 = $scope.proList[i];
                        }
                    }
                }
            break;
        }
    });

    $('body,html').animate({scrollTop:0});

}])