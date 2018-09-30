/*lee 我的账户*/
mainModule.controller('AccountaccountHomeCtrl', ['$rootScope','$scope', '$state', '$localStorage', 'resourceService','$filter','ngDialog','$location',function($rootScope,$scope, $state, $localStorage,resourceService,$filter,ngDialog,$location) {
	$filter('isLogin')($scope);
	document.getElementsByTagName('html')[0].scrollTop = 0;
	document.getElementsByTagName('body')[0].scrollTop = 0;
	$scope.summaryContents= $localStorage.summaryContents;
	$scope.user={};
	$scope.user.product = [];
	$localStorage.pathUrl = 'main.myAccount.accountHome';
	$rootScope.title='我的账户-沪深理财';
	$rootScope.activeNav = 'account';
	$localStorage.activeText = {name:'我的账户',url:'main.main.myAccount.accountHome'};
	if ($localStorage.user) {
		$scope.myPhone = $localStorage.user.mobilephone;
	}
	$scope.showPromoteTear = false;

	// 判断有红包可以拆
	if ($localStorage.promoteIsPayment != undefined && $localStorage.promoteIsPayment == true) {
		$scope.isPromote = true;
	} else {
		$scope.isPromote = false;
	}

    if(!$localStorage.isDs) {
        $scope.isDs = true;
    } else {
        $scope.isDs = false;
	}
	//专属标
	if($localStorage.exclusiveUser==1) {
        $scope.exclusiveUser = true;
    } else {
        $scope.exclusiveUser = false;
	}

	//充值提现
	$scope.toRecharge = function() {
		$filter('跳转页面')('','main.myAccount.accountHome','main.myAccount.recharge','',null,{name:'资金管理',url:'main.myAccount.recharge'});
	};
	$scope.toWithdraw = function() {
		$filter('跳转页面')('','main.myAccount.accountHome','main.myAccount.Withdraw','',null,{name:'资金管理',url:'main.myAccount.Withdraw'});
	};

    // var cntHeight = $('.my-account-wrap').height();
    // $('.my-account-side').height(cntHeight);

	$scope.onClickToBillDetail=function (item,name) {
		switch(name){
			case '投资新手':
				$filter('跳转页面')('投资新手','main.home','main.billDetail');
			break;
			default:
				$filter('跳转页面')('产品推荐','main.myAccount.accountHome','main.billDetail',item,{pathName:'产品推荐',url:'/mainmyAccountaccountHome'});
			break;
		};
	};
	// 领取奖励
	$scope.getReward = function() {
		resourceService.queryPost($scope,$filter('交互接口对照表')('领取奖金'),{afid: $scope.inviteInfo.activity.id},'领取奖金');
	};
	$scope.closeDialog = function() {
		resourceService.queryPost($scope, $filter('交互接口对照表')('我的资产首页数据'),{},'资产首页');
		resourceService.queryPost($scope,$filter('交互接口对照表')('邀请好友统计'),{afid: $location.$$search.id},'邀请好友统计');
		ngDialog.closeAll();
	};
	$scope.showPop = 1;
	$scope.share = function() {
		// ngDialog.closeAll();
		// $filter('微信二维码弹窗')($scope);
		var qrcode = new QRCode('codeqrcode', {
			text: 'http://m.hushenlc.cn/friendreg?frompc=true&recommCode=' + $scope.myPhone,
			render: 'table',
			width: 270,
			height: 270,
			colorDark : '#000000',
			colorLight : '#ffffff',
			correctLevel : QRCode.CorrectLevel.M
		});
		if(navigator.appName.indexOf("Microsoft") != -1){
			//IE
			if(navigator.appVersion.match(/8./i)=="8."){
				var qrcode = new QRCode('codeqrcode', {
					text: 'http://m.hushenlc.cn/friendreg?frompc=true&recommCode=' + $scope.myPhone,
					render: 'table',
					width: 110,
					height: 110,
					colorDark : '#000000',
					colorLight : '#ffffff',
					correctLevel : QRCode.CorrectLevel.M
				});
			}
		}
		$scope.showPop = 2;
	};

	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case '用户信息':
				if (data.success) {
					$localStorage.user = data.map;
					$scope.userId = $localStorage.user.uid;
				}
				break;
			case '风险评测弹窗显示':
				if (data.success) {
					$scope.riskResult=data.map;
				}
				break;
			case "资产首页":
				$scope.accuntHome = data.map;
				$scope.investList = data.map.investList;
				$scope.infoList = data.map.infoList;
				$scope.fundsRecord = data.map.fundsRecord;
				$localStorage.user.balance = $scope.balance = data.map.balance;
				$rootScope.isExperience = data.map.isExperience;
				$scope.drMemberFavourableList = data.map.drMemberFavourableList;
				$scope.experienceAmount = data.map.experienceAmount;
				$scope.bankVerify = data.map.bankVerify;
				$scope.isFuiou = data.map.isFuiou;
				$scope.backAmount = data.map.backAmount;
				if($scope.accuntHome.SpeciallyInvitedProduct) {
                    $localStorage.product = $scope.specialInvitedPro = $scope.accuntHome.SpeciallyInvitedProduct;
				}
				if ($scope.drMemberFavourableList.length > 0) {
					$scope.hasNoACT = true;
				} else {
					$scope.hasNoACT = false;
				}

				if (data.map.isPayment == true) {
					if ($scope.isPromote) {
						$scope.showPromoteTear = true;
					} else {
						$localStorage.promoteIsPayment = true;
						$filter('促复投红包弹窗')($scope,'showTear');
					}
				} else {
					if(!$localStorage.promotefirstTime){
				        $localStorage.promotefirstTime = new Date().getDate();
				        $localStorage.promoteUser = $localStorage.user.mobilephone;
						resourceService.queryPost($scope,$filter('交互接口对照表')('获取复投红包'),{},'获取复投红包');
				    }else{
				        var day = new Date().getDate();
				        if ($localStorage.promoteUser != undefined && $localStorage.promoteUser == $localStorage.user.mobilephone) {
					        if($localStorage.promotefirstTime != day){
					        	resourceService.queryPost($scope,$filter('交互接口对照表')('获取复投红包'),{},'获取复投红包');
					            $localStorage.promotefirstTime = day;
					        }
				        } else if ($localStorage.promoteUser != undefined && $localStorage.promoteUser != $localStorage.user.mobilephone) {
				        	$localStorage.promoteUser = $localStorage.user.mobilephone;
				        	$localStorage.promotefirstTime = day;
				        	resourceService.queryPost($scope,$filter('交互接口对照表')('获取复投红包'),{},'获取复投红包');
				        }
				    }
				}

                if($scope.userId && !$localStorage.zcFirstTime) {
                    $localStorage.zcFirstTime = new Date().getDate();
                    resourceService.queryPost($scope,$filter('交互接口对照表')('获取注册红包'),{uid:$scope.userId, applicableScenarios: 2},'获取注册红包');
                }
				$scope.echart();
			break;
			case "我的账户新手":
				$localStorage.product=$scope.newhand = data.map.newhand;
			break;
			case "邀请好友统计":
				if (data.success) {
					$scope.inviteInfo = data.map;
				}
			break;
			case "领取奖金":
				if (data.success) {
					$scope.amount = data.map.amount;
					$filter('奖金弹窗')($scope);
				}
			break;
			case "拆红包":
				if (data.success) {
					delete $localStorage.promoteIsPayment;
					ngDialog.closeAll();
					$scope.accountpromoteRedbags = data.map.redPacketList;
					$filter('促复投红包弹窗')($scope,'showRedBag');
					if (data.map.redMsg != undefined && data.map.redMsg.length > 0) {
						$scope.personList = data.map.redMsg;
						if ($scope.personList.length >= 6) {
							setInterval(function() {
								$('.promotelist').animate({'margin-top': '-233px'},1000,function() {
									$('.promotelist').find('li').eq(0).appendTo('.promotelist');
									$('.promotelist').find('li').eq(0).appendTo('.promotelist');
									$('.promotelist').find('li').eq(0).appendTo('.promotelist');
									$('.promotelist').css('margin-top','7px');
								});
							}, 5000);
						} else if ($scope.personList.length > 3 && $scope.personList.length < 6) {
							setInterval(function() {
								$('.promotelist').animate({'margin-top': '-73px'},1000,function() {
									$('.promotelist').find('li').eq(0).appendTo('.promotelist');
									$('.promotelist').css('margin-top','7px');
								});
							}, 5000);
						}
					}
				}
			break;
			// --------------促复投第一期-------------
			case '获取复投红包':
				if (data.success) {
					$rootScope.promoteGetCashFrom = false;
					if (data.map.isRedPacket) {
						if (data.map.returnedCount) {
							$rootScope.promoteHasReturn = true;
							$rootScope.returnedCount = data.map.returnedCount;
						} else {
							$rootScope.promoteHasReturn = false;
						}
						//复投红包
						$filter('红包弹窗')($rootScope);
					}
					$rootScope.promoteRedbags = data.map.redPacketList;
					if ($rootScope.promoteRedbags.length > 2) {
						$rootScope.promoteRedbags.length = 2;
					}
                    
				}
			break;
			case '获取注册红包':
                if (data.success) {
                    console.log(data);
                    $rootScope.promoteGetCashFrom = false;
                    if (data.map.isRedPacket) {
                        if (data.map.returnedCount) {
                            $rootScope.promoteHasReturn = true;
                            // $rootScope.returnedCount = data.map.returnedCount;
                        } else {
                            $rootScope.promoteHasReturn = false;
                        }
                    }

                    $rootScope.zcRedPackets = data.map.favourables;
                    if ($rootScope.zcRedPackets.length > 2) {
                        $rootScope.zcRedPackets.length = 2;
                    }
                    if($rootScope.promoteRedbags) {
                    	//复投红包
                    	$filter('红包弹窗')($rootScope);
                    } else if($rootScope.zcRedPackets.length>0){
                        $filter('注册红包弹窗')($rootScope);
					}

                }
		};
	});
	resourceService.queryPost($scope,$filter('交互接口对照表')('产品列表'),{},'我的账户新手');
	resourceService.queryPost($scope, $filter('交互接口对照表')('我的资产首页数据'),{},'资产首页');
	resourceService.queryPost($scope, $filter('交互接口对照表')('邀请好友统计'),{},'邀请好友统计');
	// 用户信息
	if($localStorage.user != undefined){
		resourceService.queryPost($scope,$filter('交互接口对照表')('Home主数据'),{},'用户信息');
		//首页风险评估提示弹窗
		resourceService.queryPost($scope,$filter('交互接口对照表')('风险评测弹窗显示'),{},'风险评测弹窗显示');
	}

	//重新评测弹窗
	$scope.riskAgain = function() {
		$filter('风险评测重新测评弹窗')($scope);
	};

	$scope.tearBag = function() {
		resourceService.queryPost($scope, $filter('交互接口对照表')('拆红包'),{},'拆红包');
	};

	$scope.showTearBag = function() {
		$filter('促复投红包弹窗')($scope,'showTear');
	};

	$scope.toreimtask = function () {
        $filter('跳转页面')('','main.myAccount.accountHome','main.myAccount.reimtask','','', '我要报销');
	};

	
	// 我的优惠券 
	//mainModule.controller('myCouPonCtrl', ['$rootScope','$scope', '$http', '$state', '$stateParams', '$localStorage','$sessionStorage', 'resourceService','$filter','communicationService',function($rootScope,$scope, $http, $state, $stateParams, $localStorage,$sessionStorage,resourceService,$filter,communicationService) {
	resourceService.queryPost($scope,$filter('交互接口对照表')('我的优惠券'),{flag:1},'我的优惠券');
	$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
		switch(type){
			case '我的优惠券':
				if (data.success) {
					$scope.HBList=[];
					$scope.QList=[];
					$scope.FBQList=[];
					$scope.TYJ={};
					for (var i = 0; i < data.map.list.length; i++) {
						switch(data.map.list[i].type){
							case 1:
								data.map.list[i].sel=false;
								$scope.HBList.push(data.map.list[i]);
							break;
							case 2:
								data.map.list[i].sel=false;
								$scope.QList.push(data.map.list[i]);
							break;
							case 3:
								// $scope.TYJ = data.map.list[i];
								data.map.list[i].sel=false;
								$scope.HBList.push(data.map.list[i]);
							break;
							case 4:
								// $scope.TYJ = data.map.list[i];
								data.map.list[i].sel=false;
								$scope.FBQList.push(data.map.list[i]);
							break;
						};
					}
					$scope.couponLength = 0;
					$scope.couponUsedLength = 0;
					$scope.couponDisabledLength = 0;
					for (var i = 0; i < $scope.QList.length; i++) {
						if ($scope.QList[i].status == 0) {
							$scope.couponLength ++;
						} else if ($scope.QList[i].status == 1) {
							$scope.couponUsedLength ++;
						} else if ($scope.QList[i].status == 2) {
							$scope.couponDisabledLength ++;
						}
					}
					$scope.tipsLength = 0;
					$scope.tipsUsedLength = 0;
					$scope.tipsDisabledLength = 0;
                    var currMillTimes = new Date().getTime();
					for (var i = 0; i < $scope.HBList.length; i++) {
						if ($scope.HBList[i].status == 0) {
                            if(currMillTimes <= $scope.HBList[i].expireDate){
                                $scope.tipsLength ++;
                            }else {
                                $scope.tipsDisabledLength ++;
                            }
						} else if ($scope.HBList[i].status == 1) {
							$scope.tipsUsedLength ++;
						} else if ($scope.HBList[i].status == 2) {
							$scope.tipsDisabledLength ++;
						}
					}
					$scope.fbqLength = 0;
					$scope.fbqUsedLength = 0;
					$scope.fbqDisabledLength = 0;

					for (var i = 0; i < $scope.FBQList.length; i++) {
						if ($scope.FBQList[i].status == 0) {
							$scope.fbqLength ++;
						} else if ($scope.FBQList[i].status == 1) {
							$scope.fbqUsedLength ++;
						} else if ($scope.FBQList[i].status == 2) {
							$scope.fbqDisabledLength ++;
						}
					}
				}
			break;
		}
	});
//}])
	// 我的优惠券
	
	//我的投资
	
	/*lee 我的投资*/
//	mainModule.controller('myAccountmyInvestCtrl', ['$rootScope','$scope','$filter','resourceService','$state','$localStorage',function($rootScope,$scope,$filter,resourceService,$state,$localStorage) {
		if (!$filter('isRegister')().register) {
				$state.go('dl');
				return;
		}
		
		$scope.page={};
		$scope.page.pageOn=1;
		$scope.page.pageSize=5;
		$scope.isActive = 0;
		$rootScope.title = '我的资产-沪深理财';
		$scope.page.status = 0;
		$rootScope.activeNav = 'account';
		resourceService.queryPost($scope,$filter('交互接口对照表')('我的投资'),{},'我的投资');
		$scope.types = $filter('isType')();
		
		$scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
			switch(type){
				case "我的投资":
					if(data.success){
						$scope.userInvest = data.map;
					}else{
					}
					resourceService.queryPost($scope,$filter('交互接口对照表')('我的投资-收益中的产品'),$scope.page,'收益中的产品');
				break;
				case "收益中的产品":
					if(data.success){
						$localStorage.inProfitProductList = $scope.inProfitProductList = data.map.page.rows;
						$scope.pages=[];
						$scope.page.pageOn = data.map.page.pageOn;
						$scope.total = data.map.page.total;
						$scope.page.totalPage = data.map.page.totalPage;
						for(var i=0;i<parseInt(data.map.page.totalPage);i++){
							$scope.pages[i]=i+1;
						};
					}else{
					}
				break;
			};
		});
		$scope.lv = 1;
		$scope.qx = 3;
		$scope.onClick = function(type,item){
			switch(type) {
				case "收益中查询":
					goPage();
				break;
				case "beforePage":
					if($scope.page.pageOn > 1){$scope.page.pageOn -=1;goPage()};
				break;
				case "currentPage":
					$scope.page.pageOn = item;goPage();
				break;
				case "nextPage":
					if($scope.page.pageOn < $scope.pages.length){$scope.page.pageOn +=1;goPage()};
				break;
			}
		};
		$scope.goPG=function(){
			$scope.page={};
			$scope.page.pageOn=1;
			$scope.page.pageSize=5;
			goPage();
		};
		function goPage() {
			if($scope.page.type == 'null'){
				delete $scope.page.type;
			}
			$scope.page.status = $scope.isActive;
			resourceService.queryPost($scope,$filter('交互接口对照表')('我的投资-收益中的产品'),$scope.page,'收益中的产品');
		};
	
		$scope.today = function() {
	    	$scope.startDate = new Date();
	  	};
	  	$scope.today();
	
		$scope.clear = function() {
		   $scope.startDate = null;
		};
		$scope.open1 = function() {
			$scope.popup1.opened = true;
		};
	
		$scope.open2 = function() {
			$scope.popup2.opened = true;
		};
	
		$scope.popup1 = {
			opened: false
		};
	
		$scope.popup2 = {
			opened: false
		};
		$scope.gotoPage = function(ids,index,type,item) {
			if(type){
				$localStorage.protocolIds = ids;
				var url = '';
				url = $state.href('loan',{idx:index});
				// if (item.prePid != undefined && item.sid != undefined) {
				// 	url = $state.href('mytransfer',{idx:index});
				// } else if (item.prePid == undefined && item.sid != undefined) {
				// 	url = $state.href('loan',{idx:index});
				// } else if (item.prePid == undefined && item.sid == undefined) {
				// 	url = $state.href('qy',{idx:index});
				// }
				window.open(url,'_blank');
			}else{
				var url = "/agreement/download.do?pid="+ids.pid +"&uid="+ids.uid+"&investId="+ids.investId;
				window.open(url,'_blank');
			}
		}
//	}])
	//我的投资


	// $filter('促复投红包弹窗')($scope,'showRedBag');
	
	$scope.echart = function(){
		$('.my-goldq').on('mouseenter focus', function(){
		$('.finance_tip').removeClass('hide');
		});
		
		$('.my-goldq').on('mouseout', function(){
			setTimeout(function(){
				$('.finance_tip').addClass('hide');
				},  2000);
		});
		
		var mails = $('.mails').html();
		if(mails > 0 ) {
			$('.newmsg').css({'display': 'block'});
		}
	
		var myChart = echarts.init(document.getElementById('echart'));
		$scope.option = {
		    tooltip: {
		        trigger: 'item',
		        formatter: "{a} <br/>{b}: {c} ({d}%)"
		    },
		    color:['#aec539', '#ec6333','#aecdfe','#749416'] ,
		    legend: {
		        orient: 'vertical',
		        x: 'left',
		        data:['可用余额','待收本金','冻结金额','待收收益']
		    },
		    series: [
		        {
		            name:'可用余额',
		            type:'pie',
		            radius: ['50%', '70%'],
		            avoidLabelOverlap: false,
		            label: {
		                normal: {
		                    show: false,
		                    position: 'center'
		                },
		                emphasis: {
		                    show: true,
		                    textStyle: {
		                        fontSize: '30',
		                        fontWeight: 'bold'
		                    }
		                }
		            },
		            labelLine: {
		                normal: {
		                    show: false
		                }
		            },
		            data:[ 
		                {value:$filter("isNumber2")($scope.accuntHome.balance), name:'可用余额'},
		                {value:$filter("isNumber2")($scope.accuntHome.axInvestSum),name:'待收本金'},
		                {value:$filter("isNumber2")($scope.accuntHome.free), name:'冻结金额'},
		                {value:$filter("isNumber2")($scope.accuntHome.winterest), name:'待收收益'}
		            ]
		        }
		    ]
		};
		// 使用刚指定的配置项和数据显示图表。
	    myChart.setOption($scope.option);
	}
	
}])