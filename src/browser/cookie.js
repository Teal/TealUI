


include("browser/base.js");


/**
 * 获取 Cookies 。
 * @param {String} name 名字。
 * @param {String} 值。
 */
Browser.getCookie = function (name) {
	assert.isString(name, "Browser.getCookie(name): 参数 {name} ~");
	var matches = document.cookie.match(new RegExp("(?:^|; )" + encodeURIComponent(name).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : null;
};
	
/**
 * 设置 Cookies 。
 * @param {String} name 名字。
 * @param {String} value 值。
 * @param {Number} expires 有效天数。天。-1表示无限。
 * @param {Object} props 其它属性。如 domain, path, secure    。
 */
Browser.setCookie = function (name, value, expires, props) {
	var e = encodeURIComponent,
		    updatedCookie = e(name) + "=" + e(value),
		    t;

	if (expires == undefined)
		expires = value === null ? -1 : 1000;

	if (expires) {
		t = new Date();
		t.setHours(t.getHours() + expires * 24);
		updatedCookie += '; expires=' + t.toGMTString();
	}

	for (t in props) {
		updatedCookie = String.concat(updatedCookie, "; " + t, "=", e(props[t]));
	}
	
	assert(updatedCookie.length < 4096, "Browser.setCookie(name, value, expires, props): 参数  value 内容过长(大于 4096)，操作失败。");

	document.cookie = updatedCookie;

	return value;
};


