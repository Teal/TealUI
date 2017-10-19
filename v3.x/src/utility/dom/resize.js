/**
 * @author xuld
 */

typeof include === "function" && include("base");

/**
 * 设置窗口改变大小后的回调。
 * @param {Function} callback 哈希值改变的事件回调。函数参数为：
 * * @this {Element} 引发事件的节点。
 * * @param {Event} e 发生的事件对象。
 * @param {Number} [delay=50] 延时执行的时间。
 * @returns this
 * @example $(window).resize(function(){ alert("窗口大小改变了"); });
 */
Dom.prototype.resize = function (callback, delay) {
    var timer;
    delay = delay || 150;
    return this.on("resize", function (e) {
        var elem = this;
        timer && clearTimeout(timer);
        timer = setTimeout(function () {
            timer = 0;
            callback.call(elem, e);
        }, delay);
    });
};
