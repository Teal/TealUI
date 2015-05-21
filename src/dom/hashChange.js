/**
 * @author xuld
 */

// #require base.js

/**
 * 设置哈希值改变事件的回调。
 * @param {Function} callback 哈希值改变的事件回调。
 */
Dom.hashChange = function(callback) {
    if (callback.constructor === Function) {
        Dom.on(window, 'hashchange', function () {
            callback(Dom.getHash());
        });
        callback(Dom.getHash());
    } else {
        Dom.trigger(win, 'hashchange');
    }
};

Dom.getHash = function() {
    var href = location.href,
        i = href.indexOf("#");
    return i >= 0 ? href.substr(i + 1) : '';
};

// #region lte IE 8

// 并不是所有浏览器都支持 hashchange 事件，
// 当浏览器不支持的时候，使用自定义的监视器，每隔50ms监听当前hash是否被修改。
/*@cc_on if (!('on' + hashchange in window) || document.documentMode < 8) {

(function(){

    var currentHash, timer;

    function poll() {
        var newToken = Dom.getHash();

        if (currentHash !== newToken) {
            currentHash = newToken;
            Dom.hashChange();
        }
        timer = setTimeout(poll, 50);
    }

    Dom.eventFix.hashchange = {
        proxy: function(elem, eventName, eventListener){
            if(!timer) {
                currentHash = Dom.getHash();
                timer = setTimeout(poll, 50);
            }
            return eventListener;
        }
    };

})();

}  @*/

// #endregion
