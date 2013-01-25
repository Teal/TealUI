

(function(ua) {
	
	//检查信息
	var engine = window.opera ? 'Presto' : window.ActiveXObject ? 'Trident' : document.getBoxObjectFor != null || window.mozInnerScreenX != null ? 'Gecko' : document.childNodes && !document.all && !navigator.taintEnabled ? 'Webkit' : 'Other',

		//平台
		platform = (ua.match(/(?:Webos|Android)/i) || [window.orientation ? 'Ipod' : 'Other'])[0];
	
	navigator["is" + platform] = navigator["is" + engine] = true;

	/**
	 * 浏览器平台。
	 * @type String
	 */
	navigator.platform = platform;

	/**
	 * 浏览器引擎名。
	 * @type String
	 */
	navigator.engine = engine;

})(navigator.userAgent);
