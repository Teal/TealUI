/**
 * @fileOverview CTRL 回车事件。
 * @author xuld
 */

/**
 * 绑定 CTRL 回车事件。
 * @param {Function} callback 设置回车的回调。
 */
Element.prototype.ctrlEnter = function (callback) {
    var elem = this;
    elem.addEventListener('keypress', function (e) {
        if (e.ctrlKey && (e.which == 13 || e.which == 10)) {
            return callback.call(elem, e);
        }
    }, false);
};