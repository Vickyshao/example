mainModule.controller('zuduiCtrl', ['$scope',
    '$rootScope',
    '$http',
    '$state',
    '$stateParams',
    '$localStorage',
    '$location',
    'resourceService',
    'communicationService',
    '$filter',

    function ($scope,
              $rootScope,
              $http,
              $state,
              $stateParams,
              $localStorage,
              $location,
              resourceService,
              communicationService,
              $filter) {

        $rootScope.title = '大吉大利，组队夺金';

        $scope.isLogin = $filter('isRegister')().register;
        if ($localStorage.user != undefined) {
            $scope.user = $localStorage.user;
        }

        $scope.rewardList = [{teamReward: 10000,topReward: 200},{teamReward: 8000,topReward: 100},{teamReward: 5000,topReward: 100},{teamReward: 3000,topReward: 100},{teamReward: 2000,topReward: 50},{teamReward: 1000,topReward: 50},{teamReward: 1000,topReward: 50},{teamReward: 1000,topReward: 50},{teamReward: 1000,topReward: 50},{teamReward: 1000,topReward: 50}];
        
        var $table = $('.right .out .userlist');
        if($scope.isLogin){
            resourceService.queryPost($scope, $filter('交互接口对照表')('首次成为队长'), {}, {name: '首次成为队长'});
        }else{
            $localStorage.activityUrl = 'zudui';
        }
        //延迟加载
        setTimeout(function(){
            resourceService.queryPost($scope, $filter('交互接口对照表')('最新消息'), {}, {name: '最新消息'});
            resourceService.queryPost($scope, $filter('交互接口对照表')('排行榜'), {}, {name: '排行榜'});
        }, 100)
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '最新消息':
                    if (data.success) {
                        $scope.newslist = data.map.list;
                        var $table = $('.news ul');
                        if ($scope.newslist.length > 1) {
                            setInterval(function() {
                                $table.animate({'margin-top':'-85px'},500,function() {
                                    $table.find('li').eq(0).appendTo($table);
                                    $table.css('margin-top',0);
                                })
                            }, 3000);
                        }
                    }
                    break;
                case '排行榜':
                    if (data.success) {
                        
                        $scope.teamList = data.map.list;
                        $scope.teamList.forEach(function(item,index,array){
                            item.teamReward = $scope.rewardList[index].teamReward;
                            item.topReward = $scope.rewardList[index].topReward;
                        });

                    }
                    break;
                case '首次成为队长':
                    if (data.success) {
                        if(data.map.create==1){
                            $filter('恭喜成为队长')($scope);
                        }
                        resourceService.queryPost($scope, $filter('交互接口对照表')('我的战队'), {}, {name: '我的战队'});
                        resourceService.queryPost($scope, $filter('交互接口对照表')('我的队员'), {}, {name: '我的队员'});

                    }
                    break;
                case '我的战队':
                    if (data.success) {
                       $scope.info = data.map;
                       $scope.myInfo = data.map.myInfo;
                       $scope.teamId = data.map.myInfo.teamId;
                       if(data.map.myInfo.isCaptain==0){
                            $scope.isCaptain=false;
                       }else{
                            $scope.isCaptain=true;
                       }
                    }
                    break;
                case '我的队员':
                    if (data.success) {
                        $scope.myTeamMembers = data.map.myTeamMembers;
                        $scope.total=data.map.myTeamMembers.length;
                        if($scope.total>2){
                            $scope.full=true;
                            //滚动条样式
                            if($scope.total>3){
                                $('#member').slimScroll({
                                    width:'410px',
                                    height: '195px',
                                    color: '#c86f06',
                                    size: '7px',
                                    distance:'0px',
                                    railVisible: false,
                                    alwaysVisible: true
                                });
                                $('.slimScrollDiv').css('border','1px solid #e2ad60');
                                $('#member').css('border','none');  
                            }
                            
                        }else{
                            $scope.full=false;
                        }

                    }
                    break;

            }
            ;
        });
    

        // 监听退出是否成功
        $rootScope.$on('exitSuccess', function (event, flag) {
            if (flag) {
                $scope.isLogin = false;
                $localStorage.activityUrl = 'zudui';
            }
        });
        $scope.accountUserOut = function (event) {
            $filter('清空缓存')();
            resourceService.queryPost($scope, $filter('交互接口对照表')('退出接口'), {}, '退出');
            $rootScope.$emit('exitSuccess', true);
            $scope.isLogin = false;
        };

    }
])
