/**
 * @author xuld
 */

/**
 * 获取当前页面的哈希值。
 * @returns {String} 返回哈希值。
 */
Dom.hash = function () {
    var href = location.href,
        i = href.indexOf("#");
    return i >= 0 ? href.substr(i + 1) : '';
};

/**
 * 设置哈希值改变事件的回调。
 * @param {Function} callback 哈希值改变的事件回调。
 */
Dom.prototype.hashChange = function (callback) {
    this.on('hashchange', function (e) {
        callback.call(this, Dom.hash(), e);
    });
    callback.call(this[0], Dom.hash());
    return this;
};

// 并不是所有浏览器都支持 hashchange 事件，
// 当浏览器不支持的时候，使用自定义的监视器，每隔50ms监听当前hash是否被修改。
if (!('onhashchange' in window) || document.documentMode < 8) {
    (function () {
        var currentHash, timer;
        function poll() {
            var newToken = Dom.hash();

            if (currentHash !== newToken) {
                currentHash = newToken;
                Dom(window).trigger('hashchange');
            }
            timer = setTimeout(poll, 50);
        }
        Dom.eventFix.hashchange = {
            add: function (elem, eventName, eventListener) {
                if (!timer) {
                    currentHash = Dom.hash();
                    timer = setTimeout(poll, 50);
                }
                elem.addEventListener(eventName, eventListener, false);
            }
        };
    })();
}