mainModule.controller('cp079Ctrl', ['$rootScope','$scope','$location','$localStorage','$filter','resourceService',function($rootScope,$scope,$location,$localStorage,$filter,resourceService) {
	$rootScope.title = '缤纷盛夏，乐在沪深';
	var end='';
	var start='';
	var zDate=[
		{strTitle:'7月4日--7月10日',dateNum:4,startDate:'2016-07-04 00:00:00',endDate:'2016-07-10 23:59:59'},
		{strTitle:'7月11日--7月17日',dateNum:11,startDate:'2016-07-11 00:00:00',endDate:'2016-07-17 23:59:59'},
		{strTitle:'7月18日--7月24日',dateNum:18,startDate:'2016-07-18 00:00:00',endDate:'2016-07-24 23:59:59'},
		{strTitle:'7月25日--7月31日',dateNum:25,startDate:'2016-07-25 00:00:00',endDate:'2016-07-31 23:59:59'}
	];
	var zDate1=[
		{strTitle:'7月4日--7月10日',dateNum:10,startDate:'2016-07-04 00:00:00',endDate:'2016-07-10 23:59:59'},
		{strTitle:'7月11日--7月17日',dateNum:17,startDate:'2016-07-11 00:00:00',endDate:'2016-07-17 23:59:59'},
		{strTitle:'7月18日--7月24日',dateNum:24,startDate:'2016-07-18 00:00:00',endDate:'2016-07-24 23:59:59'},
		{strTitle:'7月25日--7月31日',dateNum:31,startDate:'2016-07-25 00:00:00',endDate:'2016-07-31 23:59:59'}
	];
	var dDate=[];
	for (var i = 4; i <= 31; i++) {
		var obj={};
		obj.strTitle='7月'+i+'日';
		obj.dateNum = i;
		obj.startDate='2016-07-'+i+' 00:00:00';
		obj.endDate='2016-07-'+i+' 23:59:59';
		dDate.push(obj);
	};

	if($location.$$search.toFrom != undefined || $location.$$search.recommCode!= undefined){
		$localStorage.webFormPath = $location.$$search;
	};
	getStartEnd(true,15,'获取投资数据');
	/*
		活动页面主数据
	*/
	function getStartEnd(bool,topNum,type){

		if(bool){
		//当日
			start= $filter('date')(new Date(),"yyyy-MM-dd 00:00:00");
			$scope.end= end= $filter('date')(new Date(),"yyyy-MM-dd HH:mm:ss");

		}else{
		//本周
			var dayDate= new Date().getDate();
			if(dayDate>=4&&dayDate<=10){
				start=zDate[0].startDate;
				end=zDate[0].endDate;
			}else
			if(dayDate>=11&&dayDate<=18){
				start=zDate[1].startDate;
				end=zDate[1].endDate;
			}else if(dayDate>=18&&dayDate<=25){
				start=zDate[2].startDate;
				end=zDate[2].endDate;
			}else{
				start=zDate[3].startDate;
				end=zDate[3].endDate;
			}
			}
		resourceService.queryPost($scope,$filter('交互接口对照表')('cp079获取投资数据'),
		{
			type:1,
			topNum:topNum,
			startDate:start,
			endDate:end
		},
		type);
	}
	
/*
	排行榜记录
*/
	$scope.dpageNum=1;
	$scope.zpageNum=1;
	$scope.zpageTotle=zDate.length;
	$scope.dpageTotle=dDate.length;
	$scope.listLs={};
	function getStartDates(bool,topNum,type){
			var dayDate= new Date().getDate();
			var mm= new Date().getMonth()+1;
			$scope.listLs.investList=[];
		if(bool){
		//当日
			$scope.dDatetitle=dDate[$scope.dpageNum-1].strTitle;
			dayDate-=1;
			if(dayDate >= dDate[$scope.dpageNum-1].dateNum){
				resourceService.queryPost($scope,$filter('交互接口对照表')('cp079获取投资数据'),
				{
					type:1,
					topNum:topNum,
					startDate:dDate[$scope.dpageNum-1].startDate,
					endDate:dDate[$scope.dpageNum-1].endDate
				},type);
			}else if(mm==8){
				resourceService.queryPost($scope,$filter('交互接口对照表')('cp079获取投资数据'),
				{
					type:1,
					topNum:topNum,
					startDate:dDate[$scope.dpageNum-1].startDate,
					endDate:dDate[$scope.dpageNum-1].endDate
				},type);
			}
		}else{
		//本周
			$scope.mDatetitle=zDate[$scope.zpageNum-1].strTitle;
			$scope.listLs.investList=[];
			var bool = false;
			var startDate;
			var endDate;
			if(dayDate>=11&&$scope.zpageNum==1){
				bool=true;
			}else if(dayDate>=18&&$scope.zpageNum==2){
				bool=true;
			}else if(dayDate>=25&&$scope.zpageNum==3){
				bool=true;
			}
			if(mm==8){
				bool=true;
			}
			if(bool){
				resourceService.queryPost($scope,$filter('交互接口对照表')('cp079获取投资数据'),
				{
					type:1,
					topNum:topNum,
					startDate:zDate[$scope.zpageNum-1].startDate,
					endDate:zDate[$scope.zpageNum-1].endDate
				},type);
			}
		}
	};
	/*翻页*/
	$scope.onResat=function(bool){
		getStartEnd(bool,15,'获取投资数据');
	};

	$scope.goPage=function(type){
		switch(type) {
			case "上一日":
				if($scope.dpageNum>1){
					$scope.listLs.investList=[];
					$scope.dpageNum--;
					getStartDates(true,3,'获取投资数据历史');
				};
			break;
			case "下一日":
				if($scope.dpageNum<$scope.dpageTotle){
					$scope.listLs.investList=[];
					$scope.dpageNum++;
					getStartDates(true,3,'获取投资数据历史');
				};
			break;
			case "上一周":
				if($scope.zpageNum>1){
					$scope.listLs.investList=[];
					$scope.zpageNum--;
					getStartDates(false,8,'获取投资数据历史');
				};
			break;
			case "下一周":
				if($scope.zpageNum<zDate.length){
					$scope.listLs.investList=[];
					$scope.zpageNum++;
					getStartDates(false,8,'获取投资数据历史');
				};
			break;
		}
	};

	
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type) {
			case "获取投资数据":
				$scope.redbagFlag = data.flag;
				$scope.phList = data.map;
				clearInterval(timer);
				if (data.map.investList.length > 9) {
					timer = setInterval(function() {
						$('.my-list').animate({'margin-top':'-' + 40 + 'px'},500,function() {
								var $clone = $('.my-list tr').eq(0);
								$('.my-list tr').eq(0).remove();
								$clone.appendTo('.my-list');
								$('.my-list').css('margin-top',0);
						});
					}, 3000);
				}
			break;
			case "获取投资数据历史":
				$scope.listLs = data.map;
			break;
		}
	});
	var mySwiper = new Swiper('.swiper-container', {
        slidesPerView: 6,
        paginationClickable: true
    });


    var nogiftarr = [1,2,3],
		commonHeight = $('.show-list').height()/5,
		timer;

    /*选择*/
	$scope.onClick = function (bool) {
		$scope.flag = bool;
		getStartEnd(bool,15,'获取投资数据');
	}; 
	/*选择活动解释*/
	$scope.onGo = function (type) {
		switch(type){
			case '日活动说明':
				$filter('弹窗')($scope,'../html/dialog/cp079/dayHelp.html');
			break;
			case "日中奖名单":
				$filter('弹窗')($scope,'../html/dialog/cp079/dList.html');
				getStartDates(true,3,'获取投资数据历史');
			break;
			case "周活动说明":
				$filter('弹窗')($scope,'../html/dialog/cp079/mHelp.html');
			break;
			case "周中奖名单":
				$filter('弹窗')($scope,'../html/dialog/cp079/mList.html');
				getStartDates(false,8,'获取投资数据历史');
			break;
		};
	};
	$('.partners .swiper-button-prev').on('click', function(e){
		e.preventDefault();
		mySwiper.swipePrev();
	});
	$('.partners .swiper-button-next').on('click', function(e){
		e.preventDefault();
		mySwiper.swipeNext();
	});
}])
