/**
 * @author xuld
 */

typeof include === "function" && include("base");

/**
 * 获取当前页面的哈希值。
 * @returns {String} 返回当前页面的哈希值。
 * @example Dom.hash()
 */
Dom.hash = function () {
    var href = location.href,
        i = href.indexOf("#");
    return i >= 0 ? href.substr(i + 1) : "";
};

/**
 * 设置哈希值改变事件的回调。
 * @param {Function} callback 哈希值改变的事件回调。函数参数为：
 * * @this {Element} 引发事件的节点（一般为 window）。
 * * @param {mixed} e 发生的事件对象。如果事件不存在则为空。
 * @returns this
 * @example $(window).hashChange(function(hash){ alert("哈希值改变为：" + hash); });
 */
Dom.prototype.hashChange = function (callback) {
    var me = this.on("hashchange", function (e) {
        callback.call(me, Dom.hash(), e);
    });

    function trigger() {
        me.each(function (elem) {
            callback.call(elem, Dom.hash());
        });
    }

    trigger();

    // 并不是所有浏览器都支持 hashchange 事件，
    // 当浏览器不支持的时候，使用自定义的监视器，每隔50ms监听当前hash是否被修改。
    if (!("onhashchange" in window) || document.documentMode < 8) {
        var currentHash = Dom.hash();
        setInterval(function () {
            var newHash = Dom.hash();
            if (currentHash !== newHash) {
                currentHash = newHash;
                trigger();
            }
        }, 50);
    }

    return me;
};
