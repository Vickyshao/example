routerApp.directive('floatMenu', function() {
    return {
        restrict: "E",
        scope: true,
        template: ['<div class="float-window">',
            '<div class="float-mod" ng-mouseenter="enter($event)" ng-mouseleave="leave($event)">',
            // '<div class="absolute text">工作日：9:00 - 21:00<br />周末及节假日：9:00 - 18:00</div>',
            '<div class="absolute text">客服QQ：800822411<br />周一至周五：09:00-18:00</div>',
            '<div><div class="float-ico zxkf"></div>',
            '<div class="float-text"><a href="http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDgyMjQxMV80NzQ2ODdfODAwODIyNDExXw" target="_blank">客服<br />QQ</a></div></div>',
            '</div>',
            '<div class="float-mod" ng-mouseenter="enter($event)" ng-mouseleave="leave($event)">',
            '<img class="absolute" src="images/weixincode.jpg" />',
            '<div><div class="float-ico weixin"></div>',
            '<div class="float-text">微信<br />扫码</div></div>',
            '</div>',
            '<div class="float-mod" ng-mouseenter="enter($event)" ng-mouseleave="leave($event)">',
            '<img class="absolute" src="images/appcode.png" />',
            '<div><div class="float-ico app"></div>',
            '<div class="float-text">下载<br />APP</div></div>',
            '</div>',
            '<div ng-if="(a | isRegister).register" class="float-mod msg-mod" ng-mouseenter="enter($event)" ng-mouseleave="leave($event)" ng-click="showMsg()">',
            '<div><div class="float-ico msg"></div>',
            '<div class="float-text msg"></div></div>',
            '</div>',
            // '<div class="float-mod up" ng-click="goTop()" ng-mouseenter="enter($event)" ng-mouseleave="leave($event)">',
            '<div class="float-mod" ng-click="goTop()" ng-mouseenter="enter($event)" ng-mouseleave="leave($event)">',
            '<div><div class="float-ico top"></div>',
            '<div class="float-text">返回<br />顶部</div></div>',
            '</div>',
            '</div>'
        ].join(""),
        link: function(scope, element, attr) {
            scope.enter = function(e) {
                var obj = $(e.currentTarget);
                obj.find('.float-ico').stop().animate({ 'margin-top': -45 }, 150);
                e.stopPropagation();
                e.isDefaultPrevented();
                e.preventDefault();
            };
            scope.leave = function(e) {
                var obj = $(e.currentTarget);
                obj.find('.float-ico').stop().animate({ 'margin-top': 0 }, 150);
                e.stopPropagation();
                e.isDefaultPrevented();
                e.preventDefault();
            };
            scope.goTop = function() {
                $('html,body').animate({ scrollTop: 0 }, 500);
            };
            var $window = $(window),
                $up = element.find('.up');
            $window.on('load scroll', function() {
                var scrollTop = $window.scrollTop();
                if (scrollTop > 200) {
                    $up.show();
                } else {
                    $up.hide();
                }
            });
        },
        controller:[
            '$scope',
            '$filter',
            'ngDialog',
            '$localStorage',
            'resourceService',
            function($scope,$filter,ngDialog,$localStorage,resourceService) {

                $scope.showMsg = function() {
                    $filter('意见弹窗')($scope);
                };
                $scope.subDialog = function() {
                    var value = $('#opinion').val();
                    if (value == '') {
                        $('#opinion').focus();
                    } else {
                        var user = $localStorage.user;
                        resourceService.queryPost($scope, $filter('交互接口对照表')('意见反馈'), {
                            uid: user.uid,
                            content: value//,
                            // contactInformation: user.mobilephone
                        }, '意见反馈');
                    }
                };
                $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
                    switch (type) {
                        case "意见反馈":
                            ngDialog.closeAll();
                        break;
                    };
                });
            }
        ]
    }
})
