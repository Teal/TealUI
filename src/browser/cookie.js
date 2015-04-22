
var Cookie = {

    /**
     * 获取一个 Cookie 值。
     * @param {String} name 名字。
     * @returns {String} 值。
     */
    get: function (name) {
        var matches = document.cookie.match(new RegExp("(?:^|; )" + encodeURIComponent(name).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : null;
    },

    /**
     * 设置一个 Cookie 值。
     * @param {String} name 名字。
     * @param {String} value 值。
     * @param {Object} expires 过期的分钟数。
     * @param {Object} path 路径。
     * @param {Object} domain 域名。
     * @param {Object} secure 安全限制。
     * @returns {String} 返回 value。
     */
    set: function (name, value, expires, path, domain, secure) {
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

        //if (updatedCookie.length > 4096) {
        //    console.warn('Cookie 过长（超过 4096 字节），可能导致 Cookie 写入失败');
        //}

        document.cookie = updatedCookie;
        return value;
    }

};
