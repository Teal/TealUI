
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
    * @param {Object} expires 过期时间。单位：分钟
    * @param {Object} path 路径。
    * @param {Object} domain 域名。
    * @param {Object} secure 安全限制。
    */
    set: function (name, value, expires, path, domain, secure) {
        //assert.isString(name, "Cookie.set(name): 参数 {name} ~");
        var e = encodeURIComponent,
        updatedCookie = e(name) + "=" + e(value),
        options = { path: path, domain: domain, secure: secure },
        t = new Date();
        expires = expires != undefined ? expires : value === null ? -1 : 365 * 60 * 24;
        t.setMinutes(t.getMinutes() + expires);
        updatedCookie += '; expires=' + t.toGMTString();
        for (t in options) {
            if (options[t] !== undefined) {
                updatedCookie = updatedCookie + "; " + t + "=" + e(options[t]);
            }
        }
        //assert(updatedCookie.length < 4096, "Cookie.set(name, value, expires, path, domain, secure): value 内容过长(大于 4096)，操作失败。");
        document.cookie = updatedCookie;
        return value;
    }
};
