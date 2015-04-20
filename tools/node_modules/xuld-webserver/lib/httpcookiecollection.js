

var Http = require('http'),
	Path = require('path'),
	Url = require('url'),
	HttpUtility = require('./httputility'),
	HttpCookie = require('./httpcookie');

/**
 * 提供操作 HTTP Cookie 的类型安全方法。
 * @class
 */
function HttpCookieCollection(){
}

HttpCookieCollection.prototype = {
	
	/**
	 * 将指定的 Cookie 添加到此 Cookie 集合中。
	 * @param {String/HttpCookie} name 创建的 Cookie 名字。
	 * @param {String} name 创建的 Cookie 值。
	 * @param {Object} options 创建的 Cookie 其它属性。
	 */
	add: function(name, value, options){
		if(!(name instanceof HttpCookie)){
			name = new HttpCookie(name, value, options);
		}
		
		return this[name] = name;
	},
	
	/**
	 * 将指定的 Cookie 添加到此 Cookie 集合中。
	 * @param {String/HttpCookie} name 要从集合中移除的 Cookie 名称。
	 */
	remove: function(name){
		if(name instanceof HttpCookie){
			name = name.name;
		}
		
		delete this[name];
	},
	
	/**
	 * 清除 Cookie 集合中的所有 Cookie。
	 */
	clear: function(){
		for(var key in this){
			if(this.hasOwnProperty(key)){
				delete this[key];
			}
		}
	},
	
	/**
	 * 确定是否存在指定名字的 Cookie 。
	 * @param {String/HttpCookie} name 要检索的 Cookie 名。
	 * @return {Boolean} 如果存在则返回 true, 否则为 false 。
	 */
	contains: function(name){
		if(name instanceof HttpCookie){
			name = name.name;
		}
		
		return !!this[name];
	},
	
	toString: function(sep){
		var values = [];
		for(var key in this){
			if(this.hasOwnProperty(key)){
				values.push(key + '=' + HttpUtility.urlPathEncode(key.toString()));
			}
		}
		
		return values.join(sep || '; ');
	}
	
};

HttpCookieCollection.parse = function(s){
	var r = new HttpCookieCollection();
	if(s) {
		s = s.split(/\s*;\s*/);
		for(var i = 0; i < s.length; i++){
			var cookie = HttpCookie.parse(s[i]);
			r[cookie.name] = cookie;
		}
		
	}
	return r;
};


module.exports = HttpCookieCollection;