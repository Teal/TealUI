

var Http = require('http'),
	Path = require('path'),
	Url = require('url'),
	HttpUtility = require('./httputility');

/**
 * 提供创建和操作各 HTTP Cookie 的类型安全方法。
 * @class
 */
function HttpCookie(name, value, options){
	this.name = name;
	this.value = value;
	for(var key in options){
		this[key] = options[key];
	}
}

HttpCookie.prototype = {
	
	/**
	 * 获取或设置将此 Cookie 与其关联的域。默认值为当前域。
	 * @type {String}
	 */
	domain: null,
	
	/**
	 * 获取或设置此 Cookie 的过期日期和时间。
	 * @type {Date}
	 */
	expires: null,
	
	/**
	 * 获取或设置 Cookie 的名称。
	 * @type {String}
	 */
	name: null,
	
	/**
	 * 获取或设置要与当前 Cookie 一起传输的虚拟路径。默认值为当前请求的路径。
	 * @type {String}
	 */
	path: null,
	
	/**
	 * 获取或设置一个值，该值指示是否使用安全套接字层 (SSL)（即仅通过 HTTPS）传输 Cookie。默认为 false。
	 * @type {Boolean}
	 */
	secure: false,
	
	/**
	 * 获取或设置一个值，该值指示是否使用仅在传输时使用此 Cookie。
	 * @type {Boolean}
	 */
	httpOnly: false,
	
	/**
	 * 获取或设置单个 Cookie 值。
	 * @type {String}
	 */
	get value(){
		if(this._value)
			return this._value;
		
		if(this._values) {
			return this._values.toString('&');
		}
			
		return null;
	},
	
	/**
	 * 获取或设置单个 Cookie 值。
	 * @type {String}
	 */
	set value(value){
		this._value = value;
	},
	
	/**
	 * 获取单个 Cookie 对象所包含的键值对的集合。
	 * @type {HttpValueCollection}
	 */
	get values(){
		if(this._values){
			return this._values;
		}
		
		var HttpCookieCollection = require('./httpcookiecollection');
		
		var r = new HttpCookieCollection();
		
		this._values = r;
		
		return r;
	},
	
	toString: function(){
		return this.value;
	},
	
	toFullString: function(){
		var value = HttpUtility.urlPathEncode(this.name + '=' + this.value);
		if (this.path ) value += "; Path=" + HttpUtility.urlPathEncode(this.path);
		if (this.expires ) value += "; Expires=" + this.expires.toUTCString();
		if (this.domain ) value += "; Domain=" + HttpUtility.urlPathEncode(this.domain);
		if (this.secure ) value += "; Secure";
		if (this.httpOnly ) value += "; HttpOnly";
		return value;
		
	}
	
};

HttpCookie.parse = function(s){
	s = s.trim();
	var cookie = {__proto__: HttpCookie.prototype};
	var eq = s.indexOf('=');
	if(eq < 0){
		cookie.name = s;
	} else {
		cookie.name = s.substr(0, eq);
		s = s.substr(eq + 1);
		if(s.indexOf('&') < 0){
			cookie.value = HttpUtility.urlPathDecode(s);
		} else {
			s = s.split('&');
			for(var i = 0 ; i < s.length; i++){
				var subcookie = HttpCookie.parse(s[i]);
				cookie.values[subcookie.name] = subcookie;
			}
		}
	}
	return cookie;
};


module.exports = HttpCookie;