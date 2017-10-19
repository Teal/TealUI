/**
 * @author xuld
 */

//#include dom/base.js
//#include ajax/base.js
//#include ajax/html.js

/**
 * 从一个地址，载入到本元素， 并使用 setHtml 设置内容。
 * @param {String} url 要载入的页面地址。
 * @param {Object} [data] 发送给服务器的数据。
 * @param {Function} [oncomplete] 数据返回完成后的回调。
 */
Dom.prototype.load = function (url, data, oncomplete) {
	if (typeof data === 'function') {
		complete = data;
		data = null;
	}

	var me = this;

	Ajax.send({
		url: url,
		data: data,
		dataType: 'html',
		success: function () {
			me.iterate(Dom.setHtml, arguments);
		},
		complete: oncomplete
	});

	return me;
};
