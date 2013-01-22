

Object.extendIf(navigator, (function(ua) {

	var w = this,
	
		//检查信息
		engine = window.opera ? 'Presto' : w.ActiveXObject ? 'Trident' : document.getBoxObjectFor != null || w.mozInnerScreenX != null ? 'Gecko' : document.childNodes && !document.all && !navigator.taintEnabled ? 'Webkit' : 'Other',

		//平台
		platform = (ua.match(/(?:Webos|Android)/i) || [window.orientation ? 'Ipod' : navigator.platform])[0];
	
	navigator["is" + platform] = navigator["is" + engine] = true;
	
	//结果
	return {
		
		/**
		 * 是否是标准CSS模式。
		 * @type {Boolean}
		 */
		isStrict: document.compatMode == "CSS1Compat",

		/**
		 * 浏览器平台。
		 * @type String
		 */
		platform: platform,
		
		/**
		 * 浏览器引擎名。
		 * @type String
		 */
		engine: engine
		
	}
})(navigator.userAgent));
