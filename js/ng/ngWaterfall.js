routerApp.directive('ngWaterfall', ['$timeout', function($timeout) {
    return {
        restrict: "A",
        scope: {
            config: "="
        },
        link: function(scope, element, attr) {
            scope.defaultConfig = {
                cloumns: 3,
                item: ".itembox",
                marginTop: 0,
                readyloading: false
            };
            if (!scope.config) { scope.config = scope.defaultConfig; };

            element.css({ "position": 'relative', 'overflow': 'hidden' });
            scope.config.initWater = function() {
                $timeout(function() {
                    var lefts = [];
                    var tops = [0, 0, 0];
                    lefts.push(0);
                    lefts.push(parseInt(element.outerWidth()) / 3-1);
                    lefts.push(parseInt(element.outerWidth()) / 3 * 2-2);
                    element.find(scope.config.item).css({ width: parseInt(element.width()) / 3, 'box-sizing': 'border-box', 'float': 'left' });
                    element.find(scope.config.item).each(function() {
                        var index = $(this).index() + 1;
                        var i = index % 3 == 0 ? 2 : index % 3 - 1;
                        /*var maxTop = tops[0];
	                    for (var c = 1; c < tops.length; c++) {
	                        if (maxTop < tops[c]){
	                        	maxTop = tops[c];
	                        	i=c;
	                        }
	                    }*/
                        if (index > 3) {
                            $(this).css({ 'position': 'absolute', left: lefts[i], top: tops[i] });
                        }
                        tops[i] += parseInt($(this).outerHeight())-1;//scope.config.marginTop + + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom')) + parseInt($(this).css('border-top-width')) + parseInt($(this).css('border-bottom-width'));
                    })
                    var height = tops[0];
                    for (var c = 1; c < tops.length; c++) {
                        if (height < tops[c]) height = tops[c];
                    }
                    element.height(height);
                })
            };
            if (scope.config.readyloading) {
                scope.config.initWater();
            }
        }
    }
}]);
routerApp.directive('onFinishRender', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
});
