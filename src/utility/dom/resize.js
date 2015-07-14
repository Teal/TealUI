/**
 * @author xuld
 */

// #require base

/**
 * 设置窗口改变大小后的回调。
 * @param {Function} callback 哈希值改变的事件回调。
 * @param {Number} [delay=50] 延时执行的时间。
 */
Dom.prototype.resize = function (callback, delay) {
    return this.each(function (elem) {
        var timer;
        Dom(elem.defaultView || elem).on('resize', function (e) {
            timer && clearTimeout(timer);
            timer = setTimeout(function () {
                timer = 0;
                callback && callback.call(elem, elem, e);
            }, delay || 150);
        });
    });
    callback.call(elem, elem);
};
