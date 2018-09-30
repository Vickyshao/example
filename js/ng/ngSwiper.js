routerApp.directive(
    'ngSwiper',
    function() {
        var temp = '<div class="swiper-container {{ngSwiper.name}}" ng-transclude>' +

            '</div>';
        return {
            restrict: 'A',
            template: temp,
            replace: true,
            scope: {
                ngSwiperConf: '=',
                ngSwiper:"="
            },
            transclude:true,
            controller: [
                '$scope',
                '$timeout',
                '$element',
                '$compile',
                function($scope, $timeout, $element, $compile) {
                    $scope.ngSwiper.initSwiper=function(){
                        $timeout(function() {
                            $scope.ngSwiper.swiper = new Swiper("."+$scope.ngSwiper.name,$scope.ngSwiperConf);
                        });
                    }
                    if($scope.ngSwiper.readyLoading){
                        $scope.ngSwiper.initSwiper();
                    }
                }
            ],
        };
    });