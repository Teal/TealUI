/** * @author xuld */
/**
 * 所有内容控件的基类。
 * @abstract class
 * @extends Control
 */
var ContentControl = Control.extend({

	/**
	 * 当前控件的 HTML 模板字符串。
	 * @getter {String} tpl
	 * @protected virtual
	 */
	tpl: '<div class="ui">\
			<div class="ui-content"></div>\
		</div>',

	/**
	 * 获取当前容器用于存放内容的 Dom 对象。
	 * @return {Dom}
     * @protected virtual
	 */
	content: function () {
		return this.dom.find('.' + this.ui + '-content') || this.dom;
	},

	/**
	 * 获取当前容器显示的内容。
	 * @param {Boolean} valueAsText 是否编码 *value* 中的 HTML 字符串。
	 */
	getContent: function (valueAsText) {
		return this.content()[valueAsText ? 'getText' : 'getHtml']();
	},

	/**
	 * 设置当前容器显示的内容。
	 * @param {String} value 要设置的标题。
	 * @param {Boolean} valueAsText 如果为 true，则编码内容中的 HTML 。否则返回原始的 HTML 源码。
	 */
	setContent: function (value, valueAsText) {
		this.content()[valueAsText ? 'setText' : 'setHtml'](value);
		return this;
	}

});
