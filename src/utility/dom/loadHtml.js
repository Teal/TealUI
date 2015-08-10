/**
 * @author xuld
 */

typeof include === "function" && include("base");
typeof include === "function" && include("../misc/ajax");

/**
 * 从一个地址载入 HTML 片段并设为当前节点的内容。
 * @param {String} url 要载入的页面地址。
 * @param {Object} [data] 发送给服务器的数据。
 * @param {Function} [callback] 数据返回完成后的回调。
 * @returns this
 * @example $("#elem1").loadHtml("../../../assets/resources/ajax/test.txt")
 */
Dom.prototype.loadHtml = function(url, data, callback) {
    if (data && data.constructor === Function) {
        callback = data;
        data = null;
    }
    var me = this;
    Ajax.send({
        url: url,
        data: data,
        dataType: "html",
        success: function(content) {
            me.html(content);
            callback && callback.apply(this, arguments);
        }
    });
    return me;
};