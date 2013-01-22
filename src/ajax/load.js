//===========================================//  元素        A//===========================================using("System.Ajax.Base");using("System.Ajax.Html");using("System.Dom.Base");/** * 通过 Ajax 动态更新一个节点 */Dom.implement({	/**	 * 从一个地址，载入到本元素， 并使用 setHtml 设置内容。	 * @param {String} url 要载入的页面地址。	 * @param {Object} [data] 发送给服务器的数据。	 * @param {Function} [oncomplete] 数据返回完成后的回调。	 */	load: function(url, data, oncomplete) {
		if (typeof data === 'function') {
			complete = data;			data = null;
		}		var me = this;		Ajax.send({
			url: url,			data: data,			dataType: 'html',			success: function(data) {
				me.setHtml(data);
			},			complete: oncomplete
		});		return me;
	}
});