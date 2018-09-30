mainModule.controller('opendayCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService','$state','ngDialog','storage',function($rootScope,$scope,$location,$localStorage,$filter,resourceService,$state,ngDialog,storage) {
	$rootScope.title = '开放日-沪深理财';
    var galleryTop,
        galleryThumbs;

    if ($filter('isRegister')().register) {
        resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},'首页主数据');
    }

    $scope.galleryTopFinish = function() {
    	galleryTop = new Swiper('.gallery-top', {
            spaceBetween: 40,
            // loop: true,
            slidesPerView: 1,
            autoplay: 3000,
            onSlideChangeStart: function(swiper){
            	if (galleryThumbs != undefined) {
            		galleryThumbs.slideTo(swiper.realIndex, 1000, true);
                    $('.gallery-thumbs .swiper-slide').removeClass('thumbs-active').eq(swiper.realIndex).addClass('thumbs-active');
            	    galleryTop.startAutoplay();
                }
    		}
        });
    };
    $scope.galleryThumbsFinish = function() {
        $('.gallery-thumbs .swiper-slide').eq(0).addClass('thumbs-active');
        galleryThumbs = new Swiper('.gallery-thumbs', {
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            spaceBetween: 20,
            slidesPerView: 5,
            // slideToClickedSlide: true,
            // loop: true,
            onSlideChangeStart: function(swiper){
                if (galleryTop != undefined) {
            	   galleryTop.slideTo(swiper.realIndex, 1000, true);
                   galleryTop.startAutoplay();
                }
    		}
            // normalizeSlideIndex:false
        });
    };
    // galleryTop.params.control = galleryThumbs;
    // galleryThumbs.params.control = galleryTop;

    $scope.changeGalleryTop = function(index) {
        if (galleryTop != undefined) {
            galleryTop.slideTo(index, 1000, true);
        }
    };

    $scope.goSign = function(flag) {
        if (!flag && $scope.noSign) {
            $scope.noSign = false;
            resourceService.queryPost($scope,$filter('交互接口对照表')('开放日报名'),{
                userName:$scope.opendayForm.username,
                sex:$scope.opendayForm.sex,
                city:$scope.opendayForm.area,
                uid:$localStorage.user.uid,
                openDayId:$scope.jsSpecial.openDayId
            },'开放日报名');
        }
    };

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
            case "开放日活动页详情":
                $scope.jsSpecial = data.map.jsSpecial;
                if ($scope.jsSpecial != undefined) {
                    $('.detail .con').html($scope.jsSpecial.context);
                }
            break;
            case "开放日往期列表":
                $scope.openlist = data.map.page.rows;
                $scope.firOpenList = $scope.openlist[0];
            break;
            case "开放日详情":
                $scope.openDetail = data.map.sysArticle;
                if ($scope.openDetail != undefined) {
                    $('.content').html($scope.openDetail.content);
                }
                $scope.upOpenDayId = data.map.upOpenDayId;
                $scope.downOpenDayId = data.map.downOpenDayId;
            break;
            case "开放日报名":
                if (data.success) {
                    $scope.noSign = true;
                    $.qTip({
                        'type': true,
                        'text': '报名成功'
                    });
                    window.location.reload();
                    // $scope.opendayForm = {};
                    // $scope.opendayForm.sex = 0;
                } else {
                    $scope.noSign = true;
                    $.qTip({
                        'type': false,
                        'text': data.errorMsg
                    });
                }
            break;
        }
    });

    if ($location.$$path == '/main/openday') {
        $scope.opendayForm = {};
        $scope.opendayForm.sex = 0;
        $scope.noSign = true;
        $localStorage.activityUrl = 'main.openday';
        $('body,html').animate({scrollTop:0});
        resourceService.queryPost($scope,$filter('交互接口对照表')('开放日活动页详情'),{},'开放日活动页详情');
        resourceService.queryPost($scope,$filter('交互接口对照表')('开放日往期列表'),{status:2},'开放日往期列表');
    } else if ($location.$$path == '/main/opendaylist') {
        $('body,html').animate({scrollTop:0});
        resourceService.queryPost($scope,$filter('交互接口对照表')('开放日往期列表'),{status:2,pageOn:1,pageSize:100},'开放日往期列表');
    } else if ($location.$$path == '/main/opendaydetail') {
        $('body,html').animate({scrollTop:0});
        $scope.nowId = parseInt($location.$$search.id);
        resourceService.queryPost($scope,$filter('交互接口对照表')('开放日详情'),{openDayId:$scope.nowId},'开放日详情');
    }

}])