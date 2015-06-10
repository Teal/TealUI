/** * @fileOverview 鼠标悬浮事件。 * @author xuld */

/**
 * 定义鼠标移上后的操作。
 * @param {Function} mouseEnter 鼠标移上后的操作。
 * @param {Function} mouseLeave 鼠标移上后的操作。
 * @param {Function} [delay = 100] 延时执行的毫秒数。鼠标进入后指定时间内不触发函数。
 * @param {Object} [scope] 设置回调函数中 this 的指向。
 */
Document.prototype.hover = Element.prototype.hover = function (mouseEnter, mouseLeave, delay, scope) {

    var elem = this,
        timer,
        mouseEvent;

    if (delay == undefined) {
        delay = 100;
    }

    elem.on('mouseenter', function (e) {
        timer = setTimeout(function() {
            timer = 0;
            mouseEnter.call(scope || elem, mouseEvent || e);
        }, delay);
    });

    elem.on('mousemove', function (e) {
        mouseEvent = e;
    });

    elem.on('mouseleave', function (e) {
        timer ? clearTimeout(timer) : mouseLeave.call(this, e);
        timer = mouseEvent = 0;
    }, scope);

};
