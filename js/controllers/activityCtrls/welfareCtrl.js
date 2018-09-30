mainModule.controller('welfareCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService','$state','ngDialog','storage','$timeout',function($rootScope,$scope,$location,$localStorage,$filter,resourceService,$state,ngDialog,storage,$timeout) {
	$rootScope.title = '公益活动-沪深理财';
    $scope.bill = {
        pageOn:1,
        pageSize:4
    }
    if ($filter('isRegister')().register) {
        resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},'首页主数据');
    }

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
            case "公益活动列表":
                $scope.bill = data.map.page;
                $scope.bill.pages = [];
                for(var i=0;i<parseInt($scope.bill.totalPage);i++){
                    $scope.bill.pages[i]=i+1;
                }
                $scope.welfareList = data.map.page.rows;
                var myLength = $scope.welfareList.length;
                for(var i=0;i<myLength;i++) {
                    if ($scope.welfareList[i].imgUrls != undefined) {
                        $scope.welfareList[i].imgUrls = $scope.welfareList[i].imgUrls.split(',');
                        if ($scope.welfareList[i].imgUrls.length > 3) {
                            $scope.welfareList[i].imgUrls.length = 3;
                        }
                    }
                }
            break;
            case "公益活动详情":
                $scope.info = data.map.jsActivityOffline;
                $scope.picList = data.map.picList;
                var listStr = '',
                    picLength = $scope.picList.length;
                for (var i=0; i<picLength; i++) {
                    listStr += '<li class="poster-item"><i></i><img src="'+ $scope.picList[i].imgUrl +'" width="100%" height="100%"></li>';
                }
                if ($scope.info.videoUrl != undefined && $scope.info.videoUrl != '') {
                    $('.content .detail').html('<div class="video" style="background: url('+$scope.info.imgUrl+')"><a target="_blank" href="'+$scope.info.videoUrl+'"><img class="hide" src="'+$scope.info.imgUrl+'"></a></div>'+$scope.info.content);
                } else {
                    $('.content .detail').html('<div class="video"><img src="'+$scope.info.imgUrl+'"></div>'+$scope.info.content);
                }
                $('.welfaredetail-wrapper .live-wrap .poster-list').html(listStr);
                $timeout(function(){
                    Carousel.init($(".pictureSlider"));
                });
            break;
        }
    });

    $scope.goPage = function (scope) {
        var obj={};
        obj.pageOn =  scope.bill.pageOn;
        obj.pageSize = scope.bill.pageSize;
        resourceService.queryPost($scope,$filter('交互接口对照表')('公益活动列表'),obj,'公益活动列表');
    };

    $('body,html').animate({scrollTop:0});
    if ($location.$$path == '/main/welfarelist') {
        $scope.goPage($scope);
    } else if ($location.$$path == '/main/welfaredetail') {
        $scope.detailID = $location.$$search.id;
        resourceService.queryPost($scope,$filter('交互接口对照表')('公益活动详情'),{id:$scope.detailID},'公益活动详情');
    }

}])