function ZoomPic ()
{
	this.initialize.apply(this, arguments)	
}
ZoomPic.prototype = 
{
	initialize : function (id)
	{
		var _this = this;
		this.wrap = typeof id === "string" ? document.getElementById(id) : id;
		this.oUl = this.wrap.getElementsByTagName("ul")[0];
		this.aLi = this.wrap.getElementsByTagName("li");
		// this.prev = this.wrap.getElementsByTagName("span")[0];
		// this.next = this.wrap.getElementsByTagName("span")[1];
		// this.timer = 1000;
		this.aSort = [];
		this.iCenter = 2;
		this._doPrev = function () {return _this.doPrev.apply(_this)};
		this._doNext = function () {return _this.doNext.apply(_this)};
		if($(window).width() <= 320) {
			this.options = [
				{width:120, height:170, top:10, left:30, zIndex:2},
				{width:140, height:199, top:0, left:55, zIndex:3},
				{width:120, height:170, top:10, left:100, zIndex:2},
				{width:100, height:142, top:23, left:140, zIndex:1}
			];
			if(id == 'focus_Boxb') {
				this.options = [
					{width:140, height:199, top:0, left:55, zIndex:3}
				];
			}
		} else if ($(window).width() <= 375 && $(window).width() > 320) {
			this.options = [
				{width:150, height:213, top:10, left:26, zIndex:2},
				{width:165, height:234, top:0, left:66, zIndex:3},
				{width:150, height:213, top:10, left:120, zIndex:2},
				{width:140, height:199, top:16, left:155, zIndex:1}
			];
			if(id == 'focus_Boxb') {
				this.options = [
					{width:165, height:234, top:0, left:66, zIndex:3}
				];
			}
		}else if ($(window).width() < 384 && $(window).width() > 375) {
			this.options = [
				{width:180, height:255, top:15, left:10, zIndex:2},
				{width:200, height:283, top:0, left:65, zIndex:3},
				{width:180, height:255, top:15, left:140, zIndex:2},
				{width:165, height:234, top:25, left:180, zIndex:1}
			];
			if(id == 'focus_Boxb') {
				this.options = [
					{width:200, height:283, top:0, left:65, zIndex:3}
				];
			}
		} else if ($(window).width() < 600 && $(window).width() >= 384) {
			this.options = [
				{width:180, height:255, top:15, left:20, zIndex:2},
				{width:200, height:283, top:0, left:55, zIndex:3},
				{width:180, height:255, top:15, left:110, zIndex:2},
				{width:165, height:234, top:25, left:150, zIndex:1}
			];
			if(id == 'focus_Boxb') {
				this.options = [
					{width:200, height:283, top:0, left:55, zIndex:3}
				];
			}
		} else if ($(window).width() >= 600) {
			this.options = [
				/*{width:476, height:210, top:40, left:0, zIndex:1},
				{width:426, height:250, top:20, left:50, zIndex:2},
				{width:654, height:290, top:0, left:150, zIndex:3},
				{width:426, height:250, top:20, left:480, zIndex:2},
				{width:476, height:210, top:40, left:476, zIndex:1},*/
				// {width:204, height:288, top:40, left:0, zIndex:1},
				{width:226, height:320, top:20, left:40, zIndex:2},
				{width:249, height:352, top:0, left:130, zIndex:3},
				{width:226, height:320, top:20, left:240, zIndex:2},
				{width:204, height:288, top:40, left:304, zIndex:1}
			];
			if(id == 'focus_Boxb') {
				this.options = [
					{width:249, height:352, top:0, left:130, zIndex:3}
				];
			}
		}
		for (var i = 0; i < this.aLi.length; i++) this.aSort[i] = this.aLi[i];
		this.aSort.unshift(this.aSort.pop());
		this.setUp();
		// this.addEvent(this.prev, "click", this._doPrev);
		// this.addEvent(this.next, "click", this._doNext);
		// this.addEvent(this.wrap, "touchmove", this._doNext);
		touch.on('#focus_Boxa', 'swipeleft swiperight', function(ev){
			if (ev.type == 'swiperight') {
				return _this.doPrev.apply(_this);
			} else if (ev.type == 'swipeleft') {
				return _this.doNext.apply(_this);
			}
		});
		touch.on('#focus_Boxb', 'swipeleft swiperight', function(ev){
			if (ev.type == 'swiperight') {
				return _this.doPrev.apply(_this);
			} else if (ev.type == 'swipeleft') {
				return _this.doNext.apply(_this);
			}
		});
		touch.on('#focus_Boxc', 'swipeleft swiperight', function(ev){
			if (ev.type == 'swiperight') {
				return _this.doPrev.apply(_this);
			} else if (ev.type == 'swipeleft') {
				return _this.doNext.apply(_this);
			}
		});
		touch.on('#focus_Boxd', 'swipeleft swiperight', function(ev){
			if (ev.type == 'swiperight') {
				return _this.doPrev.apply(_this);
			} else if (ev.type == 'swipeleft') {
				return _this.doNext.apply(_this);
			}
		});
		// this.doImgClick();		
		// this.timer = setInterval(function ()
		// {
		// 	_this.doNext()	
		// }, 3000);		
		// this.wrap.onmouseover = function ()
		// {
		// 	clearInterval(_this.timer)	
		// };
		// this.wrap.onmouseout = function ()
		// {
		// 	_this.timer = setInterval(function ()
		// 	{
		// 		_this.doNext()	
		// 	}, 3000);	
		// }
	},
	doPrev : function ()
	{
		this.aSort.unshift(this.aSort.pop());
		this.setUp()
	},
	doNext : function ()
	{
		this.aSort.push(this.aSort.shift());
		this.setUp()
	},
	doImgClick : function ()
	{
		var _this = this;
		for (var i = 0; i < this.aSort.length; i++)
		{
			this.aSort[i].onclick = function ()
			{
				if (this.index > _this.iCenter)
				{
					for (var i = 0; i < this.index - _this.iCenter; i++) _this.aSort.push(_this.aSort.shift());
					_this.setUp()
				}
				else if(this.index < _this.iCenter)
				{
					for (var i = 0; i < _this.iCenter - this.index; i++) _this.aSort.unshift(_this.aSort.pop());
					_this.setUp()
				}
			}
		}
	},
	setUp : function ()
	{
		var _this = this;
		var i = 0;
		for (i = 0; i < this.aSort.length; i++) this.oUl.appendChild(this.aSort[i]);
		for (i = 0; i < this.aSort.length; i++)
		{
			this.aSort[i].index = i;
			if (i < 5)
			{
				this.css(this.aSort[i], "display", "block");
				this.doMove(this.aSort[i], this.options[i], function ()
				{
					_this.doMove(_this.aSort[_this.iCenter] && _this.aSort[_this.iCenter].getElementsByTagName("img")[0], {opacity:100}, function ()
					{
						_this.doMove(_this.aSort[_this.iCenter].getElementsByTagName("img")[0], {opacity:100}, function ()
						{
							_this.aSort[_this.iCenter].onmouseover = function ()
							{
								_this.doMove(this.getElementsByTagName("div")[0], {bottom:0})
							};
							_this.aSort[_this.iCenter].onmouseout = function ()
							{
								_this.doMove(this.getElementsByTagName("div")[0], {bottom:-100})
							}
						})
					})
				});
			}
			else
			{
				this.css(this.aSort[i], "display", "none");
				this.css(this.aSort[i], "width", 0);
				this.css(this.aSort[i], "height", 0);
				this.css(this.aSort[i], "top", 37);
				this.css(this.aSort[i], "left", this.oUl.offsetWidth / 2)
			}
			if (i < this.iCenter || i > this.iCenter)
			{
				this.css(this.aSort[i].getElementsByTagName("img")[0], "opacity", 100)
				this.aSort[i].onmouseover = function ()
				{
					_this.doMove(this.getElementsByTagName("img")[0], {opacity:100})	
				};
				this.aSort[i].onmouseout = function ()
				{
					_this.doMove(this.getElementsByTagName("img")[0], {opacity:100})
				};
				this.aSort[i].onmouseout();
			}
			else
			{
				this.aSort[i].onmouseover = this.aSort[i].onmouseout = null
			}
		}		
	},
	addEvent : function (oElement, sEventType, fnHandler)
	{
		return oElement.addEventListener ? oElement.addEventListener(sEventType, fnHandler, false) : oElement.attachEvent("on" + sEventType, fnHandler)
	},
	css : function (oElement, attr, value)
	{
		if (arguments.length == 2)
		{
			return oElement.currentStyle ? oElement.currentStyle[attr] : getComputedStyle(oElement, null)[attr]
		}
		else if (arguments.length == 3)
		{
			switch (attr)
			{
				case "width":
				case "height":
				case "top":
				case "left":
				case "bottom":
					oElement.style[attr] = value + "px";
					break;
				case "opacity" :
					oElement.style.filter = "alpha(opacity=" + value + ")";
					oElement.style.opacity = value / 100;
					break;
				default :
					oElement.style[attr] = value;
					break
			}	
		}
	},
	doMove : function (oElement, oAttr, fnCallBack)
	{
		var _this = this;
		clearInterval(oElement.timer);
		oElement.timer = setInterval(function ()
		{
			var bStop = true;
			for (var property in oAttr)
			{
				var iCur = parseFloat(_this.css(oElement, property));
				property == "opacity" && (iCur = parseInt(iCur.toFixed(2) * 100));
				var iSpeed = (oAttr[property] - iCur) / 5;
				iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
				
				if (iCur != oAttr[property])
				{
					bStop = false;
					_this.css(oElement, property, iCur + iSpeed)
				}
			}
			if (bStop)
			{
				clearInterval(oElement.timer);
				fnCallBack && fnCallBack.apply(_this, arguments)	
			}
		}, 30)
	}
};
window.onload = function ()
{
	var ZoomPic1 = new ZoomPic("focus_Boxa");
	var ZoomPic2 = new ZoomPic("focus_Boxb");
	var ZoomPic3 = new ZoomPic("focus_Boxc");
	var ZoomPic4 = new ZoomPic("focus_Boxd");
};