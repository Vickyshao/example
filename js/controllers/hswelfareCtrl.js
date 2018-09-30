/* 沪深公益 */
mainModule.controller('hswelfareCtrl', ['$location','$rootScope','$localStorage','$scope','$http','resourceService','$filter','$sce','$window',function($location,$rootScope,$localStorage,$scope,$http,resourceService,$filter,$sce,$window) {
	$rootScope.title = '沪深公益-沪深理财';
	
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
        switch(type){
            case "沪深公益列表":
                $scope.dataList=data.map.dataList;
 				if($scope.dataList.length>2){
 					$scope.showmore=true;
 					$scope.dataList=data.map.dataList.slice(0,2);
                    $scope.dataLists=data.map.dataList;
 				}else{
 					$scope.showmore=false;
 				}
                
            break;
            case "沪深公益详情":
                $scope.info=data.map.jsActivityOffline;
                $scope.picList=data.map.picList;
                $scope.trustHtml = $sce.trustAsHtml(data.map.jsActivityOffline.contentPC);
                setTimeout(function(){
                    var mySwiper = new Swiper('.swiper-container', {
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                    slidesPerView: 3,
                    // centeredSlides: true,
                    // paginationClickable: true,
                    // width:334,
                    spaceBetween: 30,
                    });
                }, 100)
                
                     break;
            
        }
    });
    $scope.more=function(){
    	$scope.dataList=$scope.dataLists;
    	$scope.showmore=false;
    }

    if($location.$$path == '/main/hswelfare') {
        resourceService.queryPost($scope,$filter('交互接口对照表')('沪深公益列表'),{},'沪深公益列表');
    }else if($location.$$path == '/main/hswelfareDetail') {
        window._bd_share_config={
            "common":{
                "bdSnsKey":{},
                "bdText":"",
                "bdMini":"2",
                "bdMiniList":false,
                "bdPic":"",
                "bdStyle":"0",
                "bdSize":"16"
            },
            "share":{}
        };
        with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='/static/api/js/share.js?v=89860593.js?'];

        $scope.detailID = $location.$$search.id;
        // console.log($scope.detailID);
        resourceService.queryPost($scope,$filter('交互接口对照表')('沪深公益详情'),{id:$scope.detailID},'沪深公益详情');
    }

}])