


var Cookie = {
	
	/**
	 * 获取 Cookie 。
	 * @param {String} name 名字。
	 * @param {String} 值。
	 */
	get: function (name) {
		//assert.isString(name, "Cookie.get(name): 参数 {name} ~");
		var matches = document.cookie.match(new RegExp("(?:^|; )" + encodeURIComponent(name).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + "=([^;]*)"));
		return matches ? decodeURIComponent(matches[1]) : null;
	},
	
	/**
	 * 设置 Cookie 。
	 * @param {String} name 名字。
	 * @param {String} value 值。
	 * @param {Object} options 其它属性。如 domain, path, secure， expires    。
	 */
	set: function (name, value, options) {
		//assert.isString(name, "Cookie.get(name): 参数 {name} ~");
		var e = encodeURIComponent,
				updatedCookie = e(name) + "=" + e(value),
				expires = options && options.expires === undefined ?value === null ? -1 : 1000 : expires;
				t = new Date();

		t.setHours(t.getHours() + expires * 24);
		updatedCookie += '; expires=' + t.toGMTString();

		for (t in options) {
			updatedCookie = updatedCookie + "; " + t + "=" + e(options[t]);
		}
	
		//assert(updatedCookie.length < 4096, "Cookie.set(name, value, expires, props): value 内容过长(大于 4096)，操作失败。");

		document.cookie = updatedCookie;

		return value;
	}

};

