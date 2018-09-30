// routerApp.directive('ngScrolltop',['$timeout','$interval',function($timeout,$interval){
// 	return {
// 		restrict: "A",
// 		scope:{
// 			ngScrolltopSpeed:"@"
// 		},
// 		link:function(scope,element,attr){
// 			if(!scope.ngScrolltopSpeed){scope.ngScrolltopSpeed=60;}
// 			var timer;
// 			$timeout(function(){
// 				 timer= $interval(function(){
// 				 	var top=parseInt(element.css('margin-top'));
// 				 	if(top>-parseInt(element.height())+parseInt(element.parent().height())-parseInt(element.css("padding-top"))-parseInt(element.css("padding-bottom"))){
// 						element.css({"margin-top":top-1});
// 				 	}else{
// 				 		element.css({"margin-top":0});
// 				 	}
// 				},scope.ngScrolltopSpeed);
// 			})
// 			scope.$on("$destroy", function() {
//                 if (timer) {
//                     timer();
//                 }
//             });
// 		}
// 	}
// }])

/*关闭弹框特效*/
routerApp.directive('ngScrolltop',['$timeout','$interval',function($timeout,$interval){
	return {
		restrict: "A",
		scope:{
			ngScrolltopSpeed:"@"
		},
		link:function(scope,element,attr){
			if(!scope.ngScrolltopSpeed){scope.ngScrolltopSpeed=60;}
			var timer;
			$timeout(function(){
				 timer= $interval(function(){
				 	var top=parseInt(element.css('margin-top'));
				 	if(top>-parseInt(element.height())+parseInt(element.parent().height())-parseInt(element.css("padding-top"))-parseInt(element.css("padding-bottom"))){
						element.css({"margin-top":top-1});
				 	}else{
				 		element.css({"margin-top":0});
				 	}
				},scope.ngScrolltopSpeed);
			})
			scope.$on("$destroy", function() {
                if (timer) {
                    timer();
                }
            });
		}
	}
}])