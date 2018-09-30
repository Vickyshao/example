routerApp
    // 注册框 一步操作
    .directive('zcStepone', function () {
        return {
            restrict: "E",
            scope: true,
            templateUrl: 'js/ng/zhuce.html',
            controllerUrl: 'js/controllers/financeCtrl.js',
        };
    })

    // 专题页头部
    .directive('ztHeader', function () {
        return {
            restrict: "E",
            scope: true,
            templateUrl: 'js/ng/ztHeader.html',
            controllerUrl: 'js/controllers/mainCtrl.js',

        };
    })

    // 公共头部  非专题页
    .directive('commonHeader', function () {
        return {
            restrict: "E",
            scope: true,
            templateUrl: 'js/ng/commonHeader.html',
            controllerUrl: 'js/controllers/mainCtrl.js',

        };
    })

;
