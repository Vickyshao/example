routerApp.directive('ngDraw',['$compile',function($compile){
	return {
		restrict: "A",
		scope:{
			drawdata:"=",
			drawvalue:"="
		},
		link:function(scope,element,attr){
			var str='';
			if(scope.drawdata.indexOf(scope.drawvalue)!=-1){
				str=scope.drawdata.replace(scope.drawvalue,'<font color="red">'+scope.drawvalue+'</font>');
			}else{
				str=scope.drawdata;
			}
			element.html(str);
			$compile(element)(scope);
		}
	}
}]);