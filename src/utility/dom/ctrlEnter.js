/**
 * @fileOverview CTRL 回车事件。
 * @author xuld
 */

/**
 * 绑定 CTRL 回车事件。
 * @param {Function} callback 设置回车的回调。
 * @param {Object} [scope] 设置回调函数中 this 的指向。
 */
Element.prototype.ctrlEnter = function (callback, scope) {
    var elem = this;
    elem.addEventListener('keypress', function (e) {
        if (e.ctrlKey && (e.which == 13 || e.which == 10)) {
            return callback.call(scope || elem, e);
        }
    }, false);
};
