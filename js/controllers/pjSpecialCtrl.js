
/* 票据专题 */
mainModule.controller('pjSpecialCtrl', ['$rootScope','$scope','$filter','resourceService','$localStorage','$location', function($rootScope,$scope,$filter,resourceService,$localStorage,$location) {
	$rootScope.title = '票据投资';
	var $win = $(window);
	$win.on('load resize scroll', function() {
    	$('.mask-imgs').height($win.height()).width($win.width());
        $('.mask-imgs li').height($win.height()).width($win.width());
        $('.mask-imgs li img').css('max-height',$win.height()).css('max-width',$win.width());
    });

	$('.left').on('click', function() {
    	var index = $(this).index();
    	if(!mySwiper.browser.ie8) {
	    	mySwiper.swipeTo(index, 1000, false);
	    }
    	$('.mask-imgs').addClass('show-mask');
    });
    
    $('.mask-imgs .close').on('click', function() {
    	$(this).parents('.mask-imgs').removeClass('show-mask');
    });
	var mySwiper = new Swiper('.swiper-container', {
		slidesPerView: 1,
        paginationClickable: true
    });
}]);