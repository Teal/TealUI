/**
 * @fileOverview CTRL 回车事件。
 * @author xuld
 */

/**
 * 绑定 CTRL 回车事件。
 * @param {Function} callback 设置回车的回调。
 * @param {Object} [scope] 设置回调函数中 this 的指向。
 */
Dom.prototype.ctrlEnter = function (callback) {
    return this.on('keypress', function (e) {
        if (e.ctrlKey && (e.which == 13 || e.which == 10)) {
            return callback.call(this, e);
        }
    });
};
