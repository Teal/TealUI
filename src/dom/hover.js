/** * @author xuld */

/**
 * 定义鼠标移上后的操作。
 * @param {Element} elem 要绑定的元素。
 * @param {Function} mouseEnter 鼠标移上后的操作。
 * @param {Function} mouseLeave 鼠标移上后的操作。
 * @param {Function} [delay = 100] 延时执行的毫秒数。鼠标进入后指定时间内不触发函数。
 */
Dom.hover = function (elem, mouseEnter, mouseLeave, delay) {

    var timer, mouseEvent;

    if (delay == undefined) {
        delay = 100;
    }

    Dom.on(elem, 'mouseenter', function (e) {
        timer = setTimeout(function() {
            timer = 0;
            mouseEnter.call(elem, mouseEvent || e);
        }, delay);
    });

    Dom.on(elem, 'mousemove', function (e) {
        mouseEvent = e;
    });

    Dom.on(elem, 'mouseleave', function (e) {
        timer ? clearTimeout(timer) : mouseLeave.call(this, e);
        timer = mouseEvent = 0;
    });

};
