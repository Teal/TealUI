/**
 * @fileOverview CTRL 回车事件。
 * @author xuld
 */

typeof include === "function" && include("base");

/**
 * 绑定 CTRL 回车事件。
 * @param {Function} callback 设置 CTRL 回车的回调。函数参数为：
 * * @this {Element} 引发事件的节点。
 * * @param {Event} e 发生的事件对象。
 * @returns this
 * @example $("#elem").ctrlEnter(function(){ alert("CTRL+ENTER"); });
 */
Dom.prototype.ctrlEnter = function (callback) {
    return this.on("keypress", function (e) {
        if (e.ctrlKey && (e.which === 13 || e.which === 10)) {
            return callback.call(this, e);
        }
    });
};
