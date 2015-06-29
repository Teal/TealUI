/**
 * @author xuld
 */

// #require base

/**
 * 设置窗口改变大小后的回调。
 * @param {Function} callback 哈希值改变的事件回调。
 * @param {Number} [delay=50] 延时执行的时间。
 */
Document.prototype.resize = function (callback, delay) {
    var timer;
    Element.prototype.on.call(window, 'resize', function (e) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            timer = 0;
            callback(e);
        }, delay || 50);
    });
    callback();
};
