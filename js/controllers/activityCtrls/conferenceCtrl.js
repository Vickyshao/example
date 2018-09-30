/*注册*/
mainModule.controller('conferenceCtrl', ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$localStorage', '$location', 'resourceService', 'communicationService', '$filter','$sce', function($scope, $rootScope, $http, $state, $stateParams, $localStorage, $location, resourceService, communicationService, $filter,$sce) {

            $rootScope.title = '发布会-沪深理财';

            var day1=Date.parse(new Date('2018/02/01 00:00:01'));
            var day2=Date.parse(new Date());
            if(day1>day2){
                $scope.theDay=false;
                $scope.day=Math.ceil((day1-day2)/24/3600/1000); 
            }else{
                $scope.theDay=true;
            }

            $scope.getVideo = function () {
                var day3=Date.parse(new Date('2018/02/01 10:15:00'));
                if(day2>day3){
                    resourceService.queryPost($scope, $filter('交互接口对照表')('发布会视频'), {} , '发布会视频');
                }
            };
    
            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case "发布会视频":
                        if(data.success){
                            if(data.map.windowsUrl!=undefined && data.map.windowsUrl!=''){
                                $scope.video =  $sce .trustAsResourceUrl(data.map.windowsUrl);
                                $scope.showVideo=true;
                                with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='/vendor/video.min.js'];
                                with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='/vendor/videojs-contrib-hls.js'];
                                // videojs.options.flash.swf = "/vendor/video-js.swf";
                                setTimeout(function(){
                                    videojs('my_video_1', {}, function() {
                                  
                                    });
                                }, 0)
                                
                                // videojs('my_video_1', {}, function() {
                                  
                                // });
                                // var myPlayer = videojs('my_video_1');
                                // videojs("my-player").ready(function(){
                                //     var myPlayer = this;
                                //     myPlayer.play();
                                // });
                            }
                            
                        }
                        break;
                    
                }
            });


    $scope.playTitle = 1;
    $scope.changePlayTitle = function (num) {
        $scope.playTitle = num;
        console.log($scope.playTitle);
    };

    Caroursel.init($('.caroursel'));

    /*// 发布会现场
    $scope.playTitle1 = [
            {index:1, picUrl:"/images/conference/11.jpg", picTxt:"发布会现场"},
            {index:2, picUrl:"/images/conference/12.jpg", picTxt:"发布会现场"},
            {index:3, picUrl:"/images/conference/13.jpg", picTxt:"发布会现场"},
            {index:4, picUrl:"/images/conference/14.jpg", picTxt:"发布会现场"},
            {index:5, picUrl:"/images/conference/15.jpg", picTxt:"发布会现场"},

    ];
    // 沪深行政总裁发言
    $scope.playTitle2 = [
            {index:1, picUrl:"/images/conference/31.jpg", picTxt:"发布会现场"},
            {index:2, picUrl:"/images/conference/32.jpg", picTxt:"发布会现场"},
            {index:3, picUrl:"/images/conference/33.jpg", picTxt:"发布会现场"},

    ];
    // 泰和小贷副总经理发言
    $scope.playTitle3 = [
            {index:1, picUrl:"/images/conference/41.jpg", picTxt:"发布会现场"},
            {index:2, picUrl:"/images/conference/42.jpg", picTxt:"发布会现场"},
            {index:3, picUrl:"/images/conference/43.jpg", picTxt:"发布会现场"},
    ];
    // 沪深首席市场官发言
    $scope.playTitle4 = [
            {index:1, picUrl:"/images/conference/51.jpg", picTxt:"发布会现场"},
            {index:2, picUrl:"/images/conference/52.jpg", picTxt:"发布会现场"},
            {index:3, picUrl:"/images/conference/53.jpg", picTxt:"发布会现场"},
    ];
    // 合作仪式
    $scope.playTitle5 = [
            {index:1, picUrl:"/images/conference/61.jpg", picTxt:"发布会现场"},
            {index:2, picUrl:"/images/conference/62.jpg", picTxt:"发布会现场"},
            {index:3, picUrl:"/images/conference/63.jpg", picTxt:"发布会现场"},

    ];

    $scope.step1 = 1;
    $scope.next = function () {
        ++$scope.step1;
        if($scope.step1 >= $scope.playTitle1.length) {
            $scope.step1 = 1;
        }
    };
    $scope.prev1 = function () {
        --$scope.step1;
        if($scope.step1 <= 1) {
            $scope.step1 = 1;
        }
    };


    $scope.step= 1;
    $scope.nextSame = function () {
        ++$scope.step;
        if($scope.step >= 4) {
            $scope.step = 1;
        }
    };
    $scope.prev = function () {
        --$scope.step;
        if($scope.step <= 1) {
            $scope.step = 1;
        }
    };*/
            
    }
])
