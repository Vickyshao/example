/*注册*/
mainModule.controller('lanternCtrl', ['$scope',
    '$rootScope',
    '$http',
    '$state',
    '$stateParams',
    '$localStorage',
    '$location',
    'resourceService',
    'communicationService',
    '$filter',

    function($scope,
        $rootScope,
        $http,
        $state,
        $stateParams,
        $localStorage,
        $location,
        resourceService,
        communicationService,
        $filter) {

        $rootScope.title = '元宵灯惠 闹翻天';
        $localStorage.activityUrl = 'newlayout.lantern';
        $scope.isLogin = $filter('isRegister')().register;
        
        // 监听退出是否成功
        $rootScope.$on('exitSuccess', function(event, flag) {
            if (flag) {
                $scope.isLogin = false;
            }
        });

        var $list = $('.list ul');

        if($localStorage.user != undefined){
            $scope.uid = $localStorage.user.uid;
            resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},'首页主数据');
        }
        resourceService.queryPost($scope,$filter('交互接口对照表')('吃元宵领取记录'),{},'吃元宵领取记录');

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
            switch(type) {
                case "首页主数据":
                    $scope.user = data.map;
                    if (data.map.realName == '' || data.map.realName == undefined) {
                        $scope.user.userName = '亲爱的用户';
                    } else {
                        $scope.user.userName = data.map.realName;
                    }
                    $localStorage.user = $scope.user;
                break;
                case "吃元宵":
                    if (data.success) {
                        $scope.gift = data.map;
                        $filter('元宵弹窗')($scope);
                    } else {
                        if (data.errorCode == '9997' || data.errorCode == 9997) {
                            $.qTip({
                                'type': true,
                                'text': '不在活动时间内'
                            });
                        } else {

                            if (data.map.isReceive != undefined && data.map.isReceive) {
                                $filter('元宵未获奖弹窗')($scope);
                            }
                        }
                    }
                break;
                case "吃元宵领取记录":
                    if (data.success) {
                        $scope.list = data.map.drMemberLotteryLogList;
                        if ($scope.list.length > 4) {
                            setInterval(function() {
                                $list.animate({'margin-top':'-56px'},500,function() {
                                    $list.find('li').eq(0).appendTo($list);
                                    $list.css('margin-top',0);
                                });
                            }, 3000);
                        }
                    }
                break;
            }
        });

        $scope.getGift = function() {
            resourceService.queryPost($scope,$filter('交互接口对照表')('吃元宵'),{},'吃元宵');
        };


}])
