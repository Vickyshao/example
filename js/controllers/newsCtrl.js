mainModule.controller('jtContCtrl', ['$scope', '$location', function($scope, $location) {
        var state = $location.$$path.substring($location.$$path.lastIndexOf('/') + 1);
        var data = {};
        switch (state) {
            case "JSGK":
                data = {
                    "memnTitle": "走进沪深",
                    "name": "JSGK",
                    "url": "main.jt.JSGK"
                };
                break;
            // case "GQXX":
            //     data = {
            //         "memnTitle": "股东介绍",
            //         "name": "GQXX",
            //         "url": "main.jt.GQXX"
            //     };
            //     break;
            // case "GLTD":
            //     data = {
            //         "memnTitle": "管理团队",
            //         "name": "GLTD",
            //         "url": "main.jt.GLTD"
            //     };
            //     break;
            case "GSZZ":
                data = {
                    "memnTitle": "公司资质",
                    "name": "GSZZ",
                    "url": "main.jt.GSZZ"
                };
                break;
            case "YYYZ":
                data = {
                    "memnTitle": "一亿验资",
                    "name": "YYYZ",
                    "url": "main.jt.YYYZ"
                };
                break;
            case "LXWM":
                data = {
                    "memnTitle": "联系我们",
                    "name": "LXWM",
                    "url": "main.jt.LXWM"
                };
                break;
        }
        $scope.$emit('myEvent.WHDR_Ctrl', data);
    }])
    /*新闻列表*/
// mainModule.controller('newsCtrl', ['$rootScope', '$scope', '$location', '$localStorage', '$filter', 'resourceService', function($rootScope, $scope, $location, $localStorage, $filter, resourceService) {
//     $rootScope.title = '公司新闻-沪深理财';
//     $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
//         switch (type) {
//             case "新闻列表":
//                 if (data.success) {
//                     $scope.news = data.map.page.rows;
//                     $scope.bill = data.map.page;
//                     $scope.bill.pages = [];
//                     for (var i = 0; i < parseInt($scope.bill.totalPage); i++) {
//                         $scope.bill.pages[i] = i + 1;
//                     };
//                 } else {

//                 }
//                 break;
//         };
//     });
//     resourceService.queryPost($scope, $filter('交互接口对照表')('新闻列表'), {
//         pageOn: 1,
//         pageSize: 10,
//         proId: 2
//     }, '新闻列表');

//     $scope.onXWclick = function(item) {
//         $localStorage.newsId = item.artiId;
//         $filter('跳转页面')('type', 'main.jt.GSXW', 'main.jt.XWXQ', item, '沪深新闻', { name: '沪深新闻', url: 'main.jt.GSXW' });
//     };
//     $scope.onClickPage = function(type, pageNum, listtype) {
//         switch (type) {
//             case "beforPage":
//                 if ($scope.bill.pageOn > 1) { $scope.bill.pageOn -= 1;
//                     goPage($scope.order, $scope.bill.pageOn); };
//                 break;
//             case "currentPage":
//                 $scope.bill.pageOn = pageNum;
//                 goPage($scope.order, $scope.bill.pageOn);
//                 break;
//             case "nextPage":
//                 if ($scope.bill.pageOn < $scope.bill.pages.length) { $scope.bill.pageOn += 1;
//                     goPage($scope.order, $scope.bill.pageOn); };
//                 break;
//         };
//     }

//     function goPage(order, pageOn, type) {
//         // 翻页
//         var obj = {}
//         obj.proId = 2;
//         obj.pageOn = pageOn;
//         obj.pageSize = 10;
//         resourceService.queryPost($scope, $filter('交互接口对照表')('新闻列表'), obj, '新闻列表');
//     };
// }]);
mainModule.controller('ggxqCtrl', ['$rootScope', '$scope', '$location', '$localStorage', '$filter', 'resourceService', function($rootScope, $scope, $location, $localStorage, $filter, resourceService) {
        $scope.noticeData = $localStorage.noticeData;
        $scope.$emit('myEvent.WHDR_Ctrl', {
            "memnTitle": "网站公告",
            "name": "GSGG",
            "url": "main.jt.GSGG"
        });
    }])
    .controller('gsggCtrl', ['$rootScope', '$scope', '$location', '$localStorage', '$filter', 'resourceService', '$state', function($rootScope, $scope, $location, $localStorage, $filter, resourceService, $state) {
        $rootScope.title = '公司公告-沪深理财';
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type) {
                case "公告列表":
                    if (data.success) {
                        $scope.notices = data.map.page.rows;
                        $scope.bill = data.map.page;
                        $scope.bill.pages = [];
                        for (var i = 0; i < parseInt($scope.bill.totalPage); i++) {
                            $scope.bill.pages[i] = i + 1;
                        };
                    } else {}
                    break;
            };
        });
        $scope.$emit('myEvent.WHDR_Ctrl', {
            "memnTitle": "网站公告",
            "name": "GSGG",
            "url": "main.jt.GSGG"
        });
        resourceService.queryPost($scope, $filter('交互接口对照表')('新闻列表'), {
            pageOn: 1,
            pageSize: 7,
            proId: 14
        }, '公告列表');

        $scope.onXWclick = function(item) {

        };
        $scope.gonotice = function(item) {
            $localStorage.noticeData = item;
            $state.go("main.jt.GGXQ");
        }
        $scope.onClickPage = function(type, pageNum, listtype) {
            switch (type) {
                case "beforPage":
                    if ($scope.bill.pageOn > 1) { $scope.bill.pageOn -= 1;
                        goPage($scope.order, $scope.bill.pageOn); };
                    break;
                case "currentPage":
                    $scope.bill.pageOn = pageNum;
                    goPage($scope.order, $scope.bill.pageOn);
                    break;
                case "nextPage":
                    if ($scope.bill.pageOn < $scope.bill.pages.length) { $scope.bill.pageOn += 1;
                        goPage($scope.order, $scope.bill.pageOn); };
                    break;
            };
        }

        function goPage(order, pageOn, type) {
            // 翻页
            var obj = {}
            obj.proId = 14;
            obj.pageOn = pageOn;
            obj.pageSize = 7;
            if (type != undefined) {
                obj.type = type;
            }
            resourceService.queryPost($scope, $filter('交互接口对照表')('新闻列表'), obj, '公告列表');
        };
    }])
