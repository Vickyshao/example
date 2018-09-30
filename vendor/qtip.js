/*
 * @description: qTip v1.0
 * @author: Tony
 * @update: 2013-07-22 by Tony
 */
 
// define(function(require, exports, module) {

// 	var $ = require('$'),
	var	$win = $(window);
		
	var COLOR_NORMAL = '#5dad52';
	var COLOR_ERROR = '#f84a4a';
	
	var defaults = {
		text: '',
		type: true,
		top: 0,
		delayTime: 10000,
		fadeTime: 500
	};
		
	var Tips = {
		init: function(opts) {
			opts = $.extend({}, defaults, opts);
			
			!this.DOM && (this.DOM = this.__getDOM());
			
			this.wrap = this.DOM['wrap'];
			this.main = this.DOM['main'];
			this.clear();
			this.setText(opts.text);
			this.setType(opts.type);
			this.setDelay(opts.delayTime, opts.fadeTime);
			this.setTop(opts.top);
			return this.wrap.show();
		},
		
		__getDOM: function() {
			var _wrap = $('<div id="qTip" style="position:absolute;z-index:10001;width:100%;text-align:center;" />').prependTo(document.body),
				_main = $('<span style="display:inline-block;color:#fff;padding:3px 30px 6px;" />').appendTo(_wrap);
			this._bindFixed();	
			return {"wrap": _wrap, "main": _main};
		},
		
		_bindFixed: function() {
			$win.scroll(function() {
				$win.trigger('fixed-wrap');
			});
		},
		
		setText: function(text) {
			this.main.html(text);
		},
		
		setType: function(isNormal) {
			var className = isNormal ? 'qtip-ok': 'qtip-error',
				bgColor = isNormal ? COLOR_NORMAL: COLOR_ERROR;
				
			this.main.removeClass().addClass(className);
			this.main.css('background-color', bgColor);
		},
		
		setTop: function(top) {
			var that = this,
				top = parseInt(top, 10);
			$win.off('fixed-wrap').on('fixed-wrap', function() {
				that.wrap.css('top', ($win.scrollTop() + top) + 'px');
			}).trigger('scroll');
		},
		
		setDelay: function(delayTime, fadeTime) {
			var that = this;
			this.delay = setTimeout(function() {
				that.animate = that.wrap.fadeOut(fadeTime);
			},
			delayTime);
		},
		
		clear: function() {
			this.delay && clearTimeout(this.delay);
			this.animate && this.animate.stop(true, true);
		}
	};
	
	$.qTip = $.qtip = function (opts) {
		return Tips.init(opts);
	};

// });