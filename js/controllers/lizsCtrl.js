/*静态页面_投资知识*/
// mainModule.controller('lizsCtrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService', '$animate', function($rootScope,$scope,$location,$localStorage,$filter,resourceService,$animate) {
// 		$rootScope.title = '投资知识-沪深理财';
// 		resourceService.getJsonServer($scope,$filter('静态接口对照表')('投资知识'),{},'投资知识');
// 		$scope.$on('resourceService_GET_JSON.MYEVENT', function(event, data, type) {
// 			switch(type) {
// 				case "投资知识":
// 					$scope.helps = data.result;
// 					for (var i = 0; i < $scope.helps.length; i++) {
// 						$scope.helps[i].text = $scope.helps[i].text;
// 					}
// 				break;
// 			}
// 		});
// }]);
/* 静态页面_安全保障 */
mainModule.controller('aqbzCtrl', ['$rootScope','$scope','$location', function($rootScope,$scope,$location) {
	$rootScope.title = '安全保障-沪深理财';
	if($location.$$search.menuName != undefined) {
		var obj={};
		obj.name=$location.$$search.menuName;
		$rootScope.$broadcast('myEvent.WHDR_Ctrl',obj);
    }
}]);

/* 静态页面_沪深概况 */
mainModule.controller('JSGKCtrl', ['$rootScope','$scope','$location','$filter', function($rootScope,$scope,$location,$filter) {
	$rootScope.title = '公司简介-沪深理财';
	if($location.$$search.menuName != undefined){
		var obj={};
		obj.name=$location.$$search.menuName;

        console.log(obj.name);
		$rootScope.$broadcast('myEvent.WHDR_Ctrl',obj);
    }
	if($location.$$url == "/main/jt/GSJJ"){
		var obj={};
        obj.name=$filter('limitTo')($location.$$url, -4);
        console.log(obj.name);
		$rootScope.$broadcast('myEvent.WHDR_Ctrl',obj);
    }

    var mySwiper1 = new Swiper('.dcsh-box .swiper-container', {
        slidesPerView: 3,
        loop: true,
		nextButton: '.dcsh-box .swiper-button-next',
    	prevButton: '.dcsh-box .swiper-button-prev',
		spaceBetween:30
    });

	var mySwiper2 = new Swiper('.bghj-box .swiper-container', {
        slidesPerView: 3,
        loop: true,
		nextButton: '.bghj-box .swiper-button-next',
    	prevButton: '.bghj-box .swiper-button-prev',
		spaceBetween:30
    });

	var mySwiper3 = new Swiper('.sbdd-box .swiper-container', {
        slidesPerView: 3,
        loop: true,
		nextButton: '.sbdd-box .swiper-button-next',
    	prevButton: '.sbdd-box .swiper-button-prev',
		spaceBetween:30
    });

}]);

/* 静态页面_沪深概况 */
mainModule.controller('YYYZCtrl', ['$rootScope','$scope','$location', function($rootScope,$scope,$location) {
	$rootScope.title = '公司简介-沪深理财';
	if($location.$$search.menuName != undefined){
		var obj={};
		obj.name=$location.$$search.menuName;
		$rootScope.$broadcast('myEvent.WHDR_Ctrl',obj);
    }
}]);

/* 企业荣誉 */
mainModule.controller('qyryCtrl', ['$rootScope','$scope','$location', function($rootScope,$scope,$location) {
	$rootScope.title = '企业荣誉-沪深理财';
	if($location.$$search.menuName != undefined){
		var obj={};
		obj.name=$location.$$search.menuName;
		$rootScope.$broadcast('myEvent.WHDR_Ctrl',obj);
    }

    $scope.$emit('myEvent.WHDR_Ctrl', {
        "activeText": '企业荣誉',
        "curUrl": 'main.jt.QYRY',
        "memnTitle": '企业荣誉',
    });
}]);


/* 运营报告页面 */
mainModule.controller('YYBGCtrl', ['$rootScope','$scope','$location','$filter','resourceService', function($rootScope,$scope,$location,$filter,resourceService) {
	$rootScope.title = '运营报告-沪深理财';
	if($location.$$search.menuName != undefined){
		var obj={};
		obj.name=$location.$$search.menuName;
		$rootScope.$broadcast('myEvent.WHDR_Ctrl',obj);
    }
    $scope.$emit('myEvent.WHDR_Ctrl', {
        "activeText": '运营报告',
        "curUrl": 'main.jt.YYBG',
        "memnTitle": '运营报告',
        });
    $scope.action=2;
    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
        switch (type) {
            case "新闻列表":
            	$scope.reports = data.map.page.rows;
                for (var i = 0; i < $scope.reports.length; i++) {
                    if($scope.reports[i].year=="2018"){
                        $scope.action=1;
                    }
                    
                };

                break;
        }
        ;
    });
    resourceService.queryPost($scope, $filter('交互接口对照表')('新闻列表'),{
        pageOn:1,
        pageSize:999,
        proId: 21
    },'新闻列表');
}]);

/* 运营报告详情*/
mainModule.controller('reportDetailCtrl', ['$rootScope','$scope','$location','$filter','resourceService','$sce', function($rootScope,$scope,$location,$filter,resourceService,$sce) {
    $rootScope.title = '运营报告-沪深理财';
    
    $scope.artiId = $location.$$search.artiId;
    
    resourceService.queryPost($scope, $filter('交互接口对照表')('新闻详情'),{id:$scope.artiId},'新闻详情');
    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
        switch (type) {
            case "新闻详情":
                $scope.trustHtml = $sce.trustAsHtml(data.map.sysArticle.content);
                break;
        }
        ;
    });
    
}]);



/* 监管法规页面 */
mainModule.controller('jgfgCtrl', ['$rootScope','$scope','$location','$filter','resourceService', function($rootScope,$scope,$location,$filter,resourceService) {
	$rootScope.title = '监管法规-沪深理财';
	if($location.$$search.menuName != undefined){
		var obj={};
		obj.name=$location.$$search.menuName;
		$rootScope.$broadcast('myEvent.WHDR_Ctrl',obj);
    }
    $scope.$emit('myEvent.WHDR_Ctrl', {
        "activeText": '监管法规',
        "curUrl": 'main.jt.JGFG',
        "memnTitle":'监管法规',
    });

    $('.jgfgCnt .detail').css('display','none');
	$scope.OpenShow = function (item, event, index) {
        item.isOpen = !item.isOpen;
        $('.jgfgCnt .detail').eq(index).slideToggle('slow');
        $('.jgfgCnt .detail').eq(index).css('display','block');
    };

    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
        switch (type) {
            case "新闻列表":
                $scope.regulations = data.map.page.rows;
                break;
        };
    });
    resourceService.queryPost($scope, $filter('交互接口对照表')('新闻列表'),{
        pageOn:1,
        pageSize:5,
        proId: 6
    },'新闻列表');

}]);

/* 静态页面_法律法规 */
mainModule.controller('flfgCtrl', ['$rootScope','$scope', function($rootScope,$scope) {
	$rootScope.title = '法律保障-沪深理财';
}]);

/* 静态页面_联系我们 */
mainModule.controller('lxwmCtrl', ['$rootScope','$scope', function($rootScope,$scope) {
	$rootScope.title = '联系我们-沪深理财';
}]);

/* 静态页面_联系我们 */
mainModule.controller('gltdCtrl', ['$rootScope','$scope', function($rootScope,$scope) {
	$rootScope.title = '信息披露-管理团队';
}]);
