/**
 * @fileOverview 鼠标悬浮事件。
 * @author xuld
 */

typeof include === "function" && include("base");

/**
 * 绑定鼠标移上后的操作。
 * @param {Function} [mouseEnter] 鼠标移上后的操作。函数参数为：
 * * @this {Element} 引发事件的节点。
 * * @param {Event} e 发生的事件对象。
 * @param {Function} [mouseLeave] 鼠标移上后的操作。函数参数为：
 * * @this {Element} 引发事件的节点。
 * * @param {Event} e 发生的事件对象。
 * @param {Function} [delay=100] 触发事件延时执行的毫秒数。鼠标进入后指定时间内不触发函数。
 * @returns this
 * @example $("#elem").hover(function(){ alert("鼠标进来了") }, function(){ alert("鼠标出去了") });
 */
Dom.prototype.hover = function (mouseEnter, mouseLeave, delay) {
    if (delay == null) delay = 100;
    return this.each(function (elem) {
        var timer,
            mouseEvent;
        Dom(elem).on('mouseenter', function (e) {
            timer = setTimeout(function () {
                timer = 0;
                mouseEnter && mouseEnter.call(elem, mouseEvent || e);
            }, delay);
        }).on('mousemove', function (e) {
            mouseEvent = e;
        }).on('mouseleave', function (e) {
            timer ? clearTimeout(timer) : mouseLeave && mouseLeave.call(this, e);
            timer = mouseEvent = 0;
        });
    });
};
