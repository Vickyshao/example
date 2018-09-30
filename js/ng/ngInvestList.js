/*
 * @Author: lee
 * @Date:   2016-01-25 17:32:33
 * @Last Modified by:   Ellie
 * @Last Modified time: 2018-02-07 11:31:12
 */

'use strict';
 var loginModule = angular.module("loginModule", ['ngStorage']);
/**
 * 投资记录
 * 
 * @type {[type]}
 */
loginModule
    .directive(
        'ngInvestlist',
        function() {
            return {
                restrict: 'AE',
                templateUrl: 'js/ng/invest-list.html',
                replace: false,
                transclude: true,
                scope: true,
                controller: [
                    '$scope',
                    '$filter',
                    'resourceService',
                    function($scope,$filter,resourceService) {
                        $scope.invests={};
                        $scope.invests.investTitle = '投资记录';
                        // $scope.invests.listDatas = [{name:'138****0000',num:'123123.33'},{name:'138****1111',num:'$123123.33'},{name:'138****1111',num:'$123123.33'},{name:'138****1111',num:'$123123.33'},{name:'138****1111',num:'$123123.33'},{name:'138****1111',num:'$123123.33'}];
                        $scope.url='没有了';

                        resourceService.queryPost($scope,$filter('交互接口对照表')('投资记录'),{},'投资记录');
                        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                        switch(type){
                            case '投资记录':
                                if (data.success) {
                                    $scope.invests.listDatas = data.map.page.rows;
                                }
                                break;
                        };
                    });
                }]
                
            };
        }
    );
/**
 * 翻页
 * 
 * @type {[type]}
 */
loginModule
    .directive(
        'drPg',
        function() {
            return {
                restrict: 'AE',
                templateUrl: 'js/ng/page-wrap.html',
                replace: false,
                transclude: true,
                scope: true,
                controller: [
                    '$scope',
                    '$filter',
                    'resourceService',
                    function($scope,$filter,resourceService) {

                        $scope.onClickPage=function (type,pageNum,listtype) {
                            switch(type){
                                case "beforPage":
                                    if($scope.bill.pageOn > 1){$scope.bill.pageOn -=1;$scope.goPage($scope);};
                                break;
                                case "currentPage":
                                    $scope.bill.pageOn = pageNum;$scope.goPage($scope);
                                break;
                                case "nextPage":
                                    if($scope.bill.pageOn < $scope.bill.pages.length){$scope.bill.pageOn +=1;$scope.goPage($scope);};
                                break;
                            };
                        }
                }]
                
            };
        }
    );
/**
 * 新闻
 * 
 * @type {[type]}
 */
loginModule
	.directive(
		'drNew',
		function() {
            var temp='<div class="newBox">'+
                    '</div>';
			return {
				restrict: 'AE',
				template: temp,
				replace: false,
				transclude: true,
				scope: true,
				controller: [
                    '$location',
                    '$rootScope',
                    '$scope',
                    '$filter',
                    'resourceService',
					'$localStorage',
					function($location,$rootScope,$scope,$filter,resourceService,$localStorage) {
                         resourceService.queryPost($scope,$filter('交互接口对照表')('新闻详情'),{
                            id:$location.$$search.newId
                         },'新闻详情');
                        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                            switch(type){
                                case "新闻详情":
                                    var backURL;
                                    if( $localStorage.pathUrl != undefined){
                                        backURL =  $localStorage.pathUrl.replace(/\./,'') ;
                                        backURL = backURL.replace(/\./,'') ;
                                    }
                                    var tegUrl ;
                                    if($location.$$search.t == 1){
                                        backURL = 'main/jt/GSXW';
                                        tegUrl = 'main.jt.GSXW';
                                        $scope.$emit('myEvent.WHDR_Ctrl',{
                                            "memnTitle": "公司新闻",
                                            "name": "GSXW",
                                            "url":"main.jt.GSXW"
                                        });
                                    }else if($location.$$search.t==2){
                                        backURL = 'main/jt/GSGG';
                                        tegUrl = 'main.jt.GSGG';
                                        $scope.$emit('myEvent.WHDR_Ctrl',{
                                            "memnTitle": "网站公告",
                                            "name": "GSGG",
                                            "url":"main.jt.GSGG"
                                        });
                                    }else{
                                        backURL = 'main/jt/GSDT';
                                        tegUrl = 'main.jt.GSDT';
                                        $scope.$emit('myEvent.WHDR_Ctrl',{
                                            "memnTitle": "媒体动态",
                                            "name": "GSDT",
                                            "url":"main.jt.GSDT"
                                        });
                                    }
                                    
                                    /*$('.newBox').html(
                                        '<div class="news-title"><div class="title">'+ data.map.sysArticle.title +'</div><a class="return" href="/' + backURL + '">返回</a></div>'
                                        + data.map.sysArticle.content
                                    );*/
                                    $('.newBox').html(
                                        '<div class="news-title"><div class="title">'+ data.map.sysArticle.title +'</div><a class="return" href="/' + backURL + '">返回</a></div>'
                                        + data.map.sysArticle.content
                                    );
                                break;
                            };
                        });
				}]
				
			};
		}
	);
/**
 * 我的资产引导菜单
 * 
 * @type {[type]}
 */
loginModule
    .directive(
        'menu',
        function() {
            var temp='<div class="side-mode" ng-class="{true: \'active-mode\', false: \'\'}[activeText == tool.memnTitle]" ng-repeat="tool in menuItems">'+
                        '<i ng-if="tool.children != undefined;" class="side-down"></i>'+
//                      '<span class="mode-title" ng-click="onClickMenuItem($event,tool)">{{tool.memnTitle}}</span>'+'<b ng-if="$index==7 && showXiaoBiao" ng-click="onClickMenuItem($event,tool)">1</b>'+
// 						'<span class="mode-title" ng-class="{true: \'{{tool.class}}\', false: \'\'}[tool.class]" ng-click="onClickMenuItem($event,tool)">{{tool.memnTitle}}</span>'+
						'<span class="mode-title {{tool.class}}" ng-click="onClickMenuItem($event,tool)">{{tool.memnTitle}}</span>'+
                        '<strong ng-if="$index==4 && isExperience" class="finance-ficon"></strong>'+
                        '<div class="mode-con" ng-if="tool.children.length > 0">'+
                            '<a href="" ng-click="childOnClick($event, child, tool)" ng-class="{true: \'actived\', false: \'\'}[curUrl == child.url]" ng-repeat="child in tool.children">{{child.memnTitle}}</a>'+
                        '</div>'+
                    '</div>';
            return {
                restrict : 'E',
                template:temp,
                replace: false,
                transclude: true,
                scope: false,
                controller: [
                    '$scope',
                    '$state',
                    'resourceService',
                    '$location',
                    '$localStorage',
                    '$rootScope',
                    function($scope,$state,resourceService,$location,$localStorage,$rootScope) {
                        $scope.messag={};
                        $scope.activeMode='active-mode';
                        if($location.$$search.menuName != undefined){
                            $scope.activeText = $location.$$search.menuName;
                            $scope.curUrl = $location.$$path.replace('/main/jt/', 'main.jt.');
                        }

                        if ($localStorage.showXiaoBiao != undefined) {
                            $scope.showXiaoBiao = $localStorage.showXiaoBiao;
                        } else {
                            $scope.showXiaoBiao = true;
                        }
                        
                        var beforEvent=null;
                        $scope.onClickMenuItem=function (event,item) {
                            var $this = $(event.currentTarget);
                            if(item.url != undefined){
                                $scope.curUrl = item.url;
                                $scope.activeText = item.memnTitle;
                                if (item.url == 'main.myAccount.myFriend') {
                                    $state.go(item.url,{toGet:true});
                                } else {
                                    $state.go(item.url);
                                }
                            } else if ($scope.activeText == item.memnTitle) {
                                $scope.activeText = '';
                            }else{
                                $scope.activeText = item.memnTitle;
                            }
                            if (item.memnTitle == '我的邀请') {
                                $scope.showXiaoBiao = false;
                                $localStorage.showXiaoBiao = false;
                            }
                        }
                        $scope.childOnClick = function(event,item,itemp) {
                            $scope.curUrl = item.url;
                            $scope.activeText = itemp.memnTitle;
                            $localStorage.activeText = {};
                            $localStorage.activeText.name = itemp.memnTitle;
                            $localStorage.activeText.url = item.url;

                            $state.go(item.url);
                        }
                }]
                
            };
        }
    );
/**
 * 信息披露引导菜单
 *
 * @type {[type]}
 */
loginModule
    .directive(
        'menu1',
        function() {
            var temp='<div class="side-mode" ng-repeat="tool in menuItems">'+
                        '<i ng-if="tool.children != undefined;" class="side-down"></i>'+
                        '<a ng-class="{true: \'parentActived\', false: \'\'}[activeText == tool.memnTitle || activeText == tool.name || tool.status]" class="mode-title parentMenu" ng-click="onClickMenuItem($event,tool)">{{tool.memnTitle}}' +
                            '<div ng-if="tool.children != undefined;" class="child-mode-title"  ng-repeat="childMenu in tool.children">' +
                              '<a ng-class="{true: \'childActived\', false: \'\'}[activeText == childMenu.memnTitle || childMenu.status]" class="mode-title childMenu" ng-click="childOnClick($event,childMenu)">{{childMenu.memnTitle}}' +
                               '</a>'+
                            '</div>'+
                        '</a>'+
                    '</div>';
            return {
                restrict : 'E',
                template:temp,
                replace: false,
                transclude: true,
                scope: true,
                controller: [
                    '$scope',
                    '$state',
                    'resourceService',
                    '$location',
                    '$localStorage',
                    '$rootScope',
                    function($scope,$state,resourceService,$location,$localStorage,$rootScope) {
                        $scope.messag={};
                        $scope.activeMode='active-mode';
                        if($location.$$search.menuName != undefined){
                            $scope.activeText = $location.$$search.menuName;
                            $scope.curUrl = $location.$$path.replace('/main/jt/', 'main.jt.');
                        }

                        var beforEvent=null;

                        $scope.onClickMenuItem = function (event,item) {
                            angular.forEach($scope.menuItems, function (value, index) {
                                if(item.memnTitle == value.memnTitle) {
                                    value.status == true;
                                    if (value.children) {
                                        var firstChild = value.children[0];
                                        firstChild.status = true;
                                        $scope.curUrl = firstChild.url;
                                    } else {
                                        $scope.curUrl = value.url;
                                    }
                                } else {
                                    value.status = false;
                                    angular.forEach(value.children, function (v, i) {
                                        v.status = false;
                                    });
                                }
                            });
                            $state.go($scope.curUrl);
                            // $rootScope.$on('myEvent.WHDR_Ctrl', function(event,data,type) {
                            //     $scope.activeText = data.name;
                            //     $scope.curUrl = data.url;
                            // });

                            var $this = $(event.currentTarget);
                            if(item.url != undefined){
                                $scope.curUrl = item.url;
                                $scope.activeText = item.memnTitle;
                                $state.go(item.url);
                            } else if ($scope.activeText == item.memnTitle) {
                                $scope.activeText = '';
                            }else{
                                $scope.activeText = item.memnTitle;
                            }
                        }
                        $scope.childOnClick = function(event,item) {
                            $scope.curUrl = item.url;
                            $scope.activeText = item.memnTitle;
                            $localStorage.activeText = {};
                            $localStorage.activeText.name = item.memnTitle;
                            $localStorage.activeText.url = item.url;

                            angular.forEach($scope.menuItems, function (value, index) {
                                value.status = false;
                                angular.forEach(value.children, function (v, i) {
                                    if(item.memnTitle == v.memnTitle) {
                                        v.status = true;
                                    } else {
                                        v.status = false;
                                    }
                                    if (item.memnTitle == v.memnTitle) {
                                        value.status = true;
                                    }
                                });
                            });
                            $state.go(item.url);
                        }
                }]

            };
        }
    );
/**
 * 帮助中心引导菜单
 * 
 * @type {[type]}
 */
loginModule
	.directive(
		'menu2',
		function() {
			var temp='<div class="side-mode helpCenter" ng-class="{true: \'active-mode\', false: \'\'}[activeText == tool.name]" ng-repeat="tool in menuItems">'+
						'<i ng-if="tool.children != undefined;" class="side-down"></i>'+
						'<a class="mode-title" ng-class="{true: \'actived\', false: \'\'}[curUrl == url]" ng-click="onClickMenuItem($event,tool)">{{tool.memnTitle}}</a>'+
						/*'<div class="mode-con" ng-if="tool.children.length > 0">'+
							'<a href="" ng-click="childOnClick($event, child, tool)" ng-class="{true: \'actived\', false: \'\'}[curUrl == child.url]" ng-repeat="child in tool.children">{{child.memnTitle}}</a>'+
						'</div>'+*/
					'</div>';
			return {
		        restrict : 'E',
		        template:temp,
		       
				replace: false,
				transclude: true,
				scope: true,
				controller: [
					'$scope',
					'$state',
					'resourceService',
                    '$location',
                    '$localStorage',
                    '$rootScope',
					function($scope,$state,resourceService,$location,$localStorage,$rootScope) {
						$scope.messag={};
						$scope.activeMode='active-mode';
                        if($location.$$search.menuName != undefined){
                            $scope.activeText = $location.$$search.menuName;
    						$scope.curUrl = $location.$$path.replace('/main/jt/', 'main.jt.');
                        }
                        $rootScope.$on('myEvent.WHDR_Ctrl', function(event,data,type) {
                            $scope.activeText = data.name;
                            $scope.curUrl = data.url;
                        }); 
						
						var beforEvent=null;
						$scope.onClickMenuItem=function (event,item) {
                            var $this = $(event.currentTarget);
                            if(item.url != undefined){
                                $scope.curUrl = item.url;
                                // $scope.activeText = item.memnTitle;
                                $scope.activeText = item.name;
								$state.go(item.url);
							} else if ($scope.activeText == item.memnTitle) {
                                $scope.activeText = '';
							}else{
                                $scope.activeText = item.memnTitle;
                            }
						}
                        $scope.childOnClick = function(event,item,itemp) {
                            $scope.curUrl = item.url;
                            $scope.activeText = itemp.memnTitle;
                            $localStorage.activeText = {};
                            $localStorage.activeText.name = itemp.memnTitle;
                            $localStorage.activeText.url = item.url;

                            $state.go(item.url);
                        }
				}]
				
			};
		}
	);
/**
 * 我的banner
 * 
 * @type {[type]}
 */
loginModule
    .directive(
        'myBanner',
        function() {
            var temp='<ul class="banner-img"><li ng-repeat="slide in slides" ng-init="test()">'+
                '<a target="_blank" href="{{slide.location}}">'+
                '<img ng-src="{{slide.imgUrl}}" alt="">'+
                '</a>'+
                // '<a ng-if="slide.location.length<1" href="{{slide.location}}">'+
                //     '<img src="{{slide.imgUrl}}" alt="">'+
                // '</a>'+
                '</li></ul>';
            return {
                restrict : 'E',
                template:temp,
                replace: false,
                transclude: true,
                scope: true,
                controller: [
                    '$scope',
                    '$state',
                    'resourceService',
                    '$filter',
                    '$element',
                    function($scope,$state,resourceService,$filter,$element) {
                        resourceService.queryPost($scope,$filter('交互接口对照表')('banner'),{},'banner');

                        $scope.slides = [];
                        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                            switch(type){
                                case "banner":
                                    $scope.slides=data.map.banner;
                                    var length = $scope.slides.length,
                                        i=0,
                                        browser = navigator.appName,
                                        b_version = navigator.appVersion,
                                        version = b_version.split(";"),
                                        hrefUrl='/',
                                        trim_Version; 
                                    if(version[1]!=undefined){
                                        trim_Version = version[1].replace(/[ ]/g,""); 
                                    }else{
                                        trim_Version = version[0].replace(/[ ]/g,""); 
                                    }
                                    if (browser == "Microsoft Internet Explorer" && trim_Version=="MSIE8.0") { 
                                        for (var j=0; j<length; j++) {
                                            if ($scope.slides[j].location.indexOf('192.168.1.246') > -1) {
                                                $scope.slides[j].location = $scope.slides[j].location.replace('192.168.1.246','192.168.1.246/#');
                                            } else if ($scope.slides[j].location.indexOf('hushenlc.cn') > -1) {
                                                $scope.slides[j].location = $scope.slides[j].location.replace('hushenlc.cn','hushenlc.cn/#')
                                            }
                                        }
                                    }
                                    $scope.test=function () {
                                        i++;
                                        if(i == $scope.slides.length){
                                            var banner;
                                            banner = new Slider({
                                                element: '.banner-img ul',
                                                effect: 'fade',
                                                interval: 3000,
                                                duration: 1000,
                                                triggerWrap: '.banner-img .trigger-box',
                                                onChange: function(active) {
                                                }
                                            });
                                        }
                                    }
                                break;
                            };
                        });
                }]
                
            };
        }
    );

// 新闻
loginModule
    .directive(
    'news',
    function() {
        var temp = '<div class="con my-swiper-container">'+
                        '<div class="pics swiper-container-news">'+
                            '<div class="swiper-wrapper"></div>'+
                            '<div class="swiper-pagination swiper-pagination-news"></div>'+
                        '</div>'+
                        '<ul>'+
                            '<li><a href=""></a></li>'+
                        '</ul>'+
                    '</div>';
        return {
            restrict: 'E',
            template: temp,
            replace: true,
            scope: {
                news:'='
            },
            controller: [
                '$scope',
                '$state',
                'resourceService',
                '$filter',
                '$timeout',
                '$element',
                '$localStorage',
                '$compile',
                function($scope,$state,resourceService,$filter,$timeout,$element,$localStorage,$compile) {
                    var strPics = '',
                        strNews = '';
                    $scope.$watch(function(){return $scope.news},function(n,o){
                        if(n&&n.length>0){
                            for(var i=0; i<n.length; i++){
                                if (n[i].litpic == undefined) {
                                    strPics += '<div class="swiper-slide"><a target="_blank" href="/main/jt/XWXQ?newId='+n[i].artiId+'&t=0"><img src="images/area/xwmr.png"></a></div>';
                                } else {
                                    strPics += '<div class="swiper-slide"><a target="_blank" href="/main/jt/XWXQ?newId='+n[i].artiId+'&t=0"><img src="'+n[i].litpic+'"></a></div>';
                                }
                                if (i == 0) {
                                    strNews += '<li><i class="home-dot"></i><a href="/main/jt/XWXQ?newId='+n[i].artiId+'&t=0">'+n[i].title+'</a></li>';
                                } else {
                                    strNews += '<li><i class="home-dot"></i><a href="/main/jt/XWXQ?newId='+n[i].artiId+'&t=0">'+n[i].title+'</a></li>';
                                }
                            }

                            $element[0].childNodes[0].childNodes[0].innerHTML = strPics;
                            $element[0].childNodes[1].innerHTML = strNews;
                            $compile($element[0].childNodes[0].childNodes[0])($scope);
                            $compile($element[0].childNodes[1])($scope);
                            $timeout(function(){
                                var swiperNews = new Swiper('.swiper-container-news', {
                                    pagination: '.swiper-pagination-news',
                                    paginationClickable: true,
                                    loop: true,
                                    autoplay: 3000,
                                    onSlideChangeStart: function(swiper){
                                        $('.my-swiper-container li').attr('class','');
                                        $element[0].childNodes[1].childNodes[swiper.realIndex].className = 'active';
                                    },
                                    onInit: function(swiper){
                                        $('.my-swiper-container li').on('mouseover', function() {
                                            swiper.stopAutoplay();
                                            swiper.slideTo($(this).index()+1, 1000, true);
                                        }).on('mouseout', function() {
                                            swiper.startAutoplay();
                                        });
                                    }
                                });
                            });
                        }
                    })
                }],
            };
        }
    );

// banner
loginModule
    .directive(
    'banner',
    function() {
        var temp='<div class="swiper-container swiper-container-h" style="width:100%;height:350px;">'+
            '<div class="swiper-wrapper">'+
            '</div>'+
            '<div class="swiper-pagination trigger-wrap"><div class="trigger-box swiper-pagination-h"></div></div>'+
            '<div class="button-box">'+
                '<div class="swiper-button-next btn-next"></div>'+
                '<div class="swiper-button-prev btn-prev"></div>'+
            '</div>'+
        '</div>';
        return {
            restrict: 'E',
            template: temp,
            replace: true,
            scope: {
                banner:'='
            },
            controller: [
                '$scope',
                '$state',
                'resourceService',
                '$filter',
                '$timeout',
                '$element',
                '$localStorage',
                '$compile',
                function($scope,$state,resourceService,$filter,$timeout,$element,$localStorage,$compile) {
                    var str="";
                    $scope.$watch(function(){return $scope.banner},function(n,o){
                        if(n&&n.length>0){
                            for(var i=0;i<n.length;i++){
                                str+='<div class="swiper-slide" style="background:url('+n[i].imgUrl+') no-repeat center top"><a target="_blank" href="'+n[i].location+'"></a></div>';//<img ng-src="'+n[i].imgUrl+'">
                            }
                            $element[0].childNodes[0].innerHTML=str;
                            $compile($element[0].childNodes[0])($scope);
                            $timeout(function(){
                                var swiperH = new Swiper('.swiper-container-h', {
                                    pagination: '.swiper-pagination-h',
                                    paginationClickable: true,
                                    loop: true,
                                    autoplay: 5000,
                                    nextButton: '.swiper-button-next',
                                    prevButton: '.swiper-button-prev',
                                    preventClicks: false,
                                    onPaginationRendered: function(swiper){
                                        var length = $scope.banner.length,
                                            spanStr = '';
                                        for (var i=0; i<length; i++) {
                                            // $('.swiper-pagination-h .swiper-pagination-bullet').eq(i).text(i+1);
                                            $('.swiper-pagination-h .swiper-pagination-bullet').eq(i).text($scope.banner[i].title);
                                        }
                                    }
                                });
                            });
                        }
                    })
                }],
            };
        }
    );


// 验证银行卡号是否正确
loginModule.directive('valbankcardno', function() {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelController) {

        	ngModelController.$parsers.unshift(function(viewVal) {
                if(viewVal.length<=0){
                	ngModelController.$setValidity("valbankcardno", true);
                    return false;
                }
                var lastNum=viewVal.substr(viewVal.length-1,1);//取出最后一位（与luhm进行比较）

                var first15Num=viewVal.substr(0,viewVal.length-1);//前15或18位
                var newArr=new Array();
                for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
                    newArr.push(first15Num.substr(i,1));
                }
                var arrJiShu=new Array();  //奇数位*2的积 <9
                var arrJiShu2=new Array(); //奇数位*2的积 >9

                var arrOuShu=new Array();  //偶数位数组
                for(var j=0;j<newArr.length;j++){
                    if((j+1)%2==1){//奇数位
                        if(parseInt(newArr[j])*2<9)
                            arrJiShu.push(parseInt(newArr[j])*2);
                        else
                            arrJiShu2.push(parseInt(newArr[j])*2);
                    }
                    else //偶数位
                        arrOuShu.push(newArr[j]);
                }

                var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
                var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
                for(var h=0;h<arrJiShu2.length;h++){
                    jishu_child1.push(parseInt(arrJiShu2[h])%10);
                    jishu_child2.push(parseInt(arrJiShu2[h])/10);
                }

                var sumJiShu=0; //奇数位*2 < 9 的数组之和
                var sumOuShu=0; //偶数位数组之和
                var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
                var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
                var sumTotal=0;
                for(var m=0;m<arrJiShu.length;m++){
                    sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
                }

                for(var n=0;n<arrOuShu.length;n++){
                    sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
                }

                for(var p=0;p<jishu_child1.length;p++){
                    sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
                    sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
                }
                //计算总和
                sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);

                //计算Luhm值
                var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;
                var luhm= 10-k;

                if(lastNum==luhm){
                	ngModelController.$setValidity("valbankcardno", true);
                	return viewVal;
                }
                else{
                	ngModelController.$setValidity("valbankcardno", false);
                	return undefined;
        		}
		        		
	        });
        }
    };
})

// 验证两次输入的密码是否相同
loginModule.directive('match', function() {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelController) {

        	var firstPassword = '#' + attrs.match;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val()===$(firstPassword).val();
                    ngModelController.$setValidity('match', v);
                });
            });
        }
    };
})

// 输入金额大于1
loginModule.directive('morethan', function() {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelController) {
        	ngModelController.$parsers.unshift(function(viewVal) {
        		if (viewVal == '') {
        			ngModelController.$setValidity("morethan", true);
                	return viewVal;
        		}
        		if (viewVal >= 1) {
                	ngModelController.$setValidity("morethan", true);
                	return viewVal;
                } else {
                	ngModelController.$setValidity("morethan", false);
                	return undefined;
        		}
        	});
        }
    };
})

// 充值金额限制
loginModule.directive('rechargemore', function() {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelController) {
            ngModelController.$parsers.unshift(function(viewVal) {
                if (viewVal == '') {
                    ngModelController.$setValidity("rechargemore", true);
                    return viewVal;
                }
                if (viewVal >= scope.rechargemore) {
                    ngModelController.$setValidity("rechargemore", true);
                    return viewVal;
                } else {
                    ngModelController.$setValidity("rechargemore", false);
                    return undefined;
                }
            });
        }
    };
})

loginModule.directive('morethan3', function() {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelController) {
        	ngModelController.$parsers.unshift(function(viewVal) {
        		if (viewVal == '') {
        			ngModelController.$setValidity("morethan3", true);
                	return viewVal;
        		}
        		if (viewVal >= 3) {
                	ngModelController.$setValidity("morethan3", true);
                	return viewVal;
                } else {
                	ngModelController.$setValidity("morethan3", false);
                	return undefined;
        		}
        	});
        }
    };
})

// 充值金额最高限额
loginModule.directive('rechargelimit', function() {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelController) {

        	ngModelController.$parsers.unshift(function(viewVal) {
        		if (viewVal == '') {
        			ngModelController.$setValidity("rechargelimit", true);
                	return viewVal;
        		}
        		if(viewVal <= scope.user.quota){
                	ngModelController.$setValidity("rechargelimit", true);
                	return viewVal;
                }
                else{
                	ngModelController.$setValidity("rechargelimit", false);
                	return undefined;
        		}
        	});
        }
    };
})

// 提现金额小于余额
loginModule.directive('withdrawlimit', function() {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelController) {

        	ngModelController.$parsers.unshift(function(viewVal) {
        		if (scope.user.funds <= 500000) {
	        		if (viewVal == '') {
	        			ngModelController.$setValidity("withdrawlimit", true);
	                	return viewVal;
	        		}
	        		if(viewVal <= scope.user.funds){
	                	ngModelController.$setValidity("withdrawlimit", true);
	                	return viewVal;
	                }
	                else{
	                	ngModelController.$setValidity("withdrawlimit", false);
	                	return undefined;
	        		}
        		} else {
        			ngModelController.$setValidity("withdrawlimit", true);
	                return viewVal;
        		}
        	});
        }
    };
})

// 提现金额单笔最高限额
loginModule.directive('maxlimit', function() {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelController) {

        	ngModelController.$parsers.unshift(function(viewVal) {
        		if (scope.user.funds > 500000) {
	        		if (viewVal == '' || scope.cashForm.cash.$error.withdrawlimit) {
	        			ngModelController.$setValidity("maxlimit", true);
	                	return viewVal;
	        		}
	        		if(viewVal <= 500000){
	                	ngModelController.$setValidity("maxlimit", true);
	                	return viewVal;
	                }
	                else{
	                	ngModelController.$setValidity("maxlimit", false);
	                	return undefined;
	        		}
	        	} else {
	        		ngModelController.$setValidity("maxlimit", true);
	                return viewVal;
	        	}
        	});
        }
    };
})

// 存管提现金额小于余额
loginModule.directive('storagewithdrawlimit', function() {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelController) {

            ngModelController.$parsers.unshift(function(viewVal) {
                if (scope.user.fuiou_balance <= 500000) {
                    if (viewVal == '') {
                        ngModelController.$setValidity("storagewithdrawlimit", true);
                        return viewVal;
                    }
                    if(viewVal <= scope.user.fuiou_balance){
                        ngModelController.$setValidity("storagewithdrawlimit", true);
                        return viewVal;
                    }
                    else{
                        ngModelController.$setValidity("storagewithdrawlimit", false);
                        return undefined;
                    }
                } else {
                    ngModelController.$setValidity("storagewithdrawlimit", true);
                    return viewVal;
                }
            });
        }
    };
})

// 存管提现金额单笔最高限额
loginModule.directive('storagemaxlimit', function() {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelController) {

            ngModelController.$parsers.unshift(function(viewVal) {
                if (scope.user.fuiou_balance > 500000) {
                    if (viewVal == '' || scope.cashForm.storagecash.$error.storagewithdrawlimit) {
                        ngModelController.$setValidity("storagemaxlimit", true);
                        return viewVal;
                    }
                    if(viewVal <= 500000){
                        ngModelController.$setValidity("storagemaxlimit", true);
                        return viewVal;
                    }
                    else{
                        ngModelController.$setValidity("storagemaxlimit", false);
                        return undefined;
                    }
                } else {
                    ngModelController.$setValidity("storagemaxlimit", true);
                    return viewVal;
                }
            });
        }
    };
})

loginModule.directive("csDateToIso", function () {

    var linkFunction = function (scope, element, attrs, ngModelCtrl) {

        ngModelCtrl.$parsers.push(function (datepickerValue) {
            return moment(datepickerValue).format("");
        });
    };

    return {
        restrict: "A",
        require: "ngModel",
        link: linkFunction
    };
});
loginModule.directive('placeholder', function(){
    return {
        restrict: 'A',
        scope: {},
        link: function(scope, ele, attr) {
            var input = document.createElement('input'),
                isSupportPlaceholder = 'placeholder' in input;
            if (!isSupportPlaceholder) {
                var fakePlaceholder = angular.element(
                    '<span class="placeholder">' + attr['placeholder'] + '</span>');
                fakePlaceholder.on('click', function(e){
                    e.stopPropagation();
                    ele.focus();
                });
                ele.before(fakePlaceholder);
                scope.hasValue = function(){
                    return ele.val();
                };
                scope.$watch(scope.hasValue, function(){
                    if (ele.val()) {
                        fakePlaceholder.hide();
                    } else {
                        fakePlaceholder.show();
                    }
                });

                scope.getElementPosition = function() {
                    return ele.position();
                };
                scope.$watch(scope.getElementPosition, function(){
                    fakePlaceholder.css({
                        'position': 'absolute',
                        'top': ele.position().top + 'px',
                        'left': ele.position().left + 'px',
                        'color': '#aaa'
                    });
                }, true);
                scope.getElementHeight = function() {
                    return ele.outerHeight();
                };
                scope.$watch(scope.getElementHeight, function(){
                    fakePlaceholder.css('line-height', ele.outerHeight() + 'px');
                });
                if (ele.css('font-size')){
                    fakePlaceholder.css('font-size', ele.css('font-size'));
                }
                if (ele.css('text-indent')){
                    fakePlaceholder.css('text-indent',
                        parseInt(ele.css('text-indent')) +
                        parseInt(ele.css('border-left-width'))
                    );
                }
                if (ele.css('padding-left')){
                    fakePlaceholder.css('padding-left', ele.css('padding-left'));
                }
                if (ele.css('margin-top')){
                    fakePlaceholder.css('margin-top', ele.css('margin-top'));
                }
                scope.isElementVisible = function(){
                    return ele.is(':visible');
                };
                scope.$watch(scope.isElementVisible, function(){
                    var displayVal = ele.is(':visible') ? 'block' : 'none';
                    fakePlaceholder.css('display', displayVal);
                    if (displayVal === 'blcok' && ele.val()) {
                        fakePlaceholder.hide();
                    }
                });
            }
        }
    };
});

loginModule.directive("repeatFinish", function () {
    return {
        link: function(scope,element,attr){
            if(scope.$last == true){
                scope.$eval(attr.repeatFinish);
            }
        }
    }
});

