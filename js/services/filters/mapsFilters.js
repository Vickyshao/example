/* 
* @Author: lee
* @Date:   2015-09-25 10:37:01
* @Last Modified by:   lee
* @Last Modified time: 2015-07-02 19:16:49
*/

'use strict';
routerApp
/*网站公共静态字段*/
.filter('web',function(){
	return function(){
		var web ={} ;
		web.phone = '400-031-9909';
		web.phoneLabel = '热线电话';

		return web;
	};
})

/*网站公共静态字段*/
.filter('getBtnColor',function(){
	return function(type){
		var bgColor ='';
		if(type){
			bgColor='background:red!important!important';
		}else{
			bgColor='background:#000!important!important';

		}
		return bgColor;
	};
})

/*判断ie8*/
.filter('webIE8',function(){
	return function(p){
		var browser = navigator.appName;
        var b_version = navigator.appVersion;
        var version = b_version.split(";");
        var hrefUrl='/';
        var trim_Version; 
        if(version[1]!=undefined){
            trim_Version = version[1].replace(/[ ]/g,""); 
        }else{
            trim_Version = version[0].replace(/[ ]/g,""); 
        }
        if (browser == "Microsoft Internet Explorer" && trim_Version=="MSIE8.0") { 
            hrefUrl = '/#/';
        } else {
            hrefUrl = '/';
        };
		return hrefUrl;
	};
})
/*文章字段截取段落*/
.filter('截取段落',function(){
	return function(p){
		var arr= p.split('^');
		return arr;
	};
})

// /*网站 数字转换*/
.filter('isAmountToStr',function(){
	return function(num){
		if(num >= 10000){ num = num / 10000 + '万';}
		return num ;
	};
})
/*ispassword type 变化*/
.filter('ispassword',function(){
	return function(type){
		if(type){ return 'text'}else{ return 'passWord'}
	};
})
/*ispassword type 变化*/
.filter('isNumber2',function(){
	return function(num,type,flag){
		if(num==undefined || isNaN(num)){
//			if (flag == undefined) {
				return '0.00'
//			}
		}else{
			if(isNaN(num)){
//				if (flag == undefined) {
					return '0.00'
//				}
			}else{
				var num =new Number(num);
				var num=num.toFixed(3);
				if(type!=undefined){
					num= num.substring(0,num.lastIndexOf('.')+0) // 123456.78
				}else{
					num= num.substring(0,num.lastIndexOf('.')+3) // 123456.78
				}
			}
			return num;
		}
	};
})

.filter('setProgress',function() {
	return function(num) {
		if (num == undefined) {
			return 0 ;
		} else {
			if (isNaN(num)) {
				return 0;
			} else {
				if (num > 0 && num <= 1) {
					num =  1;
				} else if (num >= 99 && num < 100) {
					num = 99;
				} else {
					num = parseInt(num);
				}
			}
			return num;
		}
	}
})

/*优惠券类型*/
.filter('mapsFilters_couponType',function(){
	return function(code){
		var maps = [
		            {code :1,cnvalue  :"代金券"}
		            ];
		if(code != undefined){
			code--;
			return maps[code].cnvalue;
		}else{
			return maps;
		}
	};
})
/*票据产品类型*/
.filter('isProductType',function(){
	return function(code){
		var maps = [
		             {code :0,cnvalue  :"" , disabled:true}
		            ,{code :1,cnvalue  :"待审核" , disabled:true}
		            ,{code :2,cnvalue  :"已审核", disabled:true}
		            ,{code :3,cnvalue  :"已驳回", disabled:true}
		            ,{code :4,cnvalue  :"已作废", disabled:true}
		            ,{code :5,cnvalue  :"立即投资", disabled:false}
		            // ,{code :6,cnvalue  :"募集完成", disabled:true}
		            ,{code :6,cnvalue  :"已售罄", disabled:true}
		            ,{code :7,cnvalue  :"募集失败", disabled:true}
		            ,{code :8,cnvalue  :"待还款", disabled:true}
		            ,{code :9,cnvalue  :"已还款", disabled:true}
		            ];
		return maps[code];
	};
})

/*我的资产类型*/
.filter('我的资产',function(){
	return function(code){
		var maps = [
		             {code :0,cnvalue  :"票据安选"}
		            ,{code :1,cnvalue  :"票据优选"}
		            ,{code :3,cnvalue  :"冻结资金"}
		            ];
		if(code != undefined){
			return maps[code].cnvalue;
		}else{
			return maps;
		}
	};
})
/*判断数值类型*/
.filter('isNaN',function(){
	return function(v){
		if(isNaN(v)){
			return 0;
		}else{
			return v;
		}
	};
})

/*我的投资-产品类型*/
.filter('isType',function(){
	return function(code){
		var maps = [{code :1,cnvalue  :"新手标"},{code :2,cnvalue  :"优选投资"}
            // {code :'null',cnvalue  :"全部"}
            // ,{code :2,cnvalue  :"票据安选"}
		            // ,{code :3,cnvalue  :"票据优选"}
		            ];
		if(code != undefined){
			return maps[code].cnvalue;
		}else{
			return maps;
		}
	};
})

/*我的资产-资产记录*/
.filter('tradeType',function(){
	return function(code){
		var maps = [
		             // {code :'',cnvalue  :"全部"}
		            {code :1,cnvalue  :"充值"}
		            ,{code :2,cnvalue  :"提现"}
		            ,{code :3,cnvalue  :"投资"}
		            ,{code :4,cnvalue  :"活动"}
		            ,{code :5,cnvalue  :"提现手续费"}
		            ,{code :6,cnvalue  :"回款"}
		            ];
		if(code != undefined){
			return maps[code].cnvalue;
		}else{
			return maps;
		}
	};
})

/*银/商票LOGO*/
.filter('isBankLogo',function(){
	return function(code){
		var maps = [
		             {code :0,cnvalue  :"common-yin"}//银票LOGO
		            ,{code :1,cnvalue  :"common-shang"}//商票LOGO
		            ];
		if(code != undefined){
			return maps[code].cnvalue;
		}else{
			return maps;
		}
	};
})

/*银/商票还款方式*/
.filter('isRepayType',function(){
	return function(code){
		var maps = [
		             {code:0,cnvalue:""}
		            ,{code:1,cnvalue:"到期一次还本付息"}
		            ,{code:2,cnvalue:"按月付息到期还本"}
		            ,{code:3,cnvalue:"等本等息 按周回款"}
		            ,{code:4,cnvalue:"等本等息 按月回款"}
		            ,{code:5,cnvalue:"其他"}
		            ];
		return maps[code];
	};
})
/*银/商票还款方式*/
.filter('isSex',function(){
	return function(code){
		var maps = {
		             1:'先生'
		            ,2:'女士'
		           };
		return maps[code];
	};
})
/*银/商票计息方式*/
.filter('isInterestType',function(){
	return function(code){
		var maps = [
		             {code :0,cnvalue  :"次日起息"}
		            ,{code :1,cnvalue  :""}
		           ];
		return maps[code];	
	};
})
/*银/商票查询方式*/
.filter('isInterestType',function(){
	return function(code){
		var maps = {
			 '默认':0
			,"利率降序":1
			,"利率升序":2
			,"期限降序":3
			,"期限升序":4
		};
		return maps[code];	
	};
})
/*交易记录-交易类别*/
.filter('investListTradeType',function(){
	return function(code){
		var maps = {
			 1:'充值'
			,2:'提现'
			,3:'投资'
			,4:'活动'
			,5:'提现手续费'
			,6:'回款'
			,7:'体验金'
		};
		return maps[code];	
	};
})

/*用户认证状态*/
        .filter('isUserRegister', function($localStorage) {

            return function(code,name) {
                var type;
                switch(name){
                    case "card":
                        type=  { 
                                    1 : "my-card-set",
                                    0 : "my-no-card"
                                };
                    break;
                    case "phone":
                        type=  { 
                                    0 : "my-no-phone",
                                    1 : "my-phone-set"
                                };
                    break; 
                    case "cardId":
                        type=  { 
                                    1 : "my-bank-set",
                                    0 : "my-no-bank"
                                };
                    break;
                };
                
                return type[code];
            }
        }) 
/*翻页*/
        .filter('isUserRegister', function($localStorage) {

            return function(code,name) {
             $scope.onClickPage=function (type,pageNum,listtype) {
             	switch(type){
             		case "beforPage":
             			if($scope.bill.pageOn > 1){$scope.bill.pageOn -=1;goPage($scope.order,$scope.bill.pageOn);};
             		break;
             		case "currentPage":
             			$scope.bill.pageOn = pageNum;goPage($scope.order,$scope.bill.pageOn);
             		break;
             		case "nextPage":
             			if($scope.bill.pageOn < $scope.bill.pages.length){$scope.bill.pageOn +=1;goPage($scope.order,$scope.bill.pageOn);};
             		break;
             	};
             }
             function goPage(order,pageOn,type) {
             	// 翻页
             	var obj = {},
             		str = '';
             	obj.order = order; 
             	obj.pageOn = pageOn; 
             	obj.pageSize = 10;
             	if (type != undefined) {
             		obj.type = type;
             	}
             	obj.statuses = [5];
             	if (type == 2) {
             		str = '票据安选';
             	} else if (type == 3) {
             		str = '票据优选';
             	} else {
             		obj.pageSize = 5;
             		obj.statuses = [6,8,9];
             		str = '往期产品';
             	}
             	resourceService.queryPost($scope,$filter('交互接口对照表')('票据列表'),obj,str);
             };
            }
        })

         /*cp076 投资次日——产品 成立之间显示标签“计息中”*/
        .filter('isInvestTime', function() {

            return function(time) {

            	var t = '';
            	var qtDay=new Date(time).getDate();
            	var today=new Date().getDate();
				if(qtDay !=today){
					t ='计息中';
				}else{
					t ='投资成功';
				}
            	return t;
            }
        })
        .filter('prizeStatus',function(){
        	return function(code){
        		var map={
        			0:'待开奖',
        			1:'未中奖',
        			2:'恭喜，中奖了'
        		};
        		if(code>=0&&map[code]){return map[code]};
        		return '无数据';
        	}
        })
		/*我的优惠券过滤器 flag:  0:可使用   1:已使用  其他:已失效*/
		.filter('filterCoupon',function(){
        	return function(coupons,flag){
        		var currMillTimes = new Date().getTime();
        		var avaiCoupons = [];  //可使用优惠券
                var usedCoupons = [];  //已使用优惠券
        		var invalidCoupons = []; //已失效优惠券
        		$.each(coupons,function(key,value){
        			if(value.status == 0){
        				if(currMillTimes <= value.expireDate){
                            avaiCoupons.push(value);
						}else{
                            value.status = 2;
                            invalidCoupons.push(value);
						}
					}else if(value.status == 1){
                        usedCoupons.push(value);
					}else{
                        invalidCoupons.push(value);
					}
				});
        		if(flag==0){
        			return avaiCoupons;
				}else if(flag ==1){
        			return usedCoupons;
				}else {
                    return invalidCoupons;
                }
        	}
        })