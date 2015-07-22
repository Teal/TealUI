/**
 * @author xuld
 */

// #require ../net/ajax
// #require ../dom/base

/**
 * 从一个地址，载入到本元素， 并使用 setHtml 设置内容。
 * @param {String} url 要载入的页面地址。
 * @param {Object} [data] 发送给服务器的数据。
 * @param {Function} [oncomplete] 数据返回完成后的回调。
 */
Dom.prototype.loadHtml = function (url, data, onsuccess) {
	if (typeof data === 'function') {
	    onsuccess = data;
		data = null;
	}
	var me = this;
	Ajax.send({
		url: url,
		data: data,
		dataType: 'html',
		success: function (content) {
		    me.html(content);
		    onsuccess && onsuccess.apply(this, arguments);
		}
	});
	return me;
};
