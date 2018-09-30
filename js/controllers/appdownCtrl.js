/*注册*/
mainModule.controller('appdownCtrl', ['$scope',
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

        $scope.isFan = false;
        var mySwiper = new Swiper('.center-slide .swiper-container',{
            loop:true,
            grabCursor: true,
            paginationClickable: true,
            autoplay: 3000,
            pagination: '.center-slide .trigger'
        });

    }
])
