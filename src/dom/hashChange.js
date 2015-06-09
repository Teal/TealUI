/**
 * @author xuld
 */

// #require base

/**
 * 设置哈希值改变事件的回调。
 * @param {Function} callback 哈希值改变的事件回调。
 */
Document.prototype.hashChange = function(callback) {
    Element.prototype.on.call(window, 'hashchange', function () {
        callback(document.getHash());
    });
    callback(document.getHash());
};

/**
 * 获取当前页面的哈希值。
 * @returns {String} 返回哈希值。
 */
Document.prototype.getHash = function () {
    var href = this.location.href,
        i = href.indexOf("#");
    return i >= 0 ? href.substr(i + 1) : '';
};

// 并不是所有浏览器都支持 hashchange 事件，
// 当浏览器不支持的时候，使用自定义的监视器，每隔50ms监听当前hash是否被修改。
if (!('onhashchange' in window) || document.documentMode < 8 || 1) {
    (function () {
        var currentHash, timer;
        function poll() {
            var newToken = document.getHash();

            if (currentHash !== newToken) {
                currentHash = newToken;
                Element.prototype.trigger.call(window, 'hashchange');
            }
            timer = setTimeout(poll, 50);
        }
        Element.eventFix.hashchange = {
            add: function (elem, eventName, eventListener) {
                if (!timer) {
                    currentHash = document.getHash();
                    timer = setTimeout(poll, 50);
                }
                elem.addEventListener(eventName, eventListener, false);
            }
        };
    })();
}