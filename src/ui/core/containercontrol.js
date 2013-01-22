/**
 * @author  xuld
 */


include("ui/core/base.js");


/**
 * 所有容器控件的基类。
 * @abstract class 
 * @extends Control
 */
var ContainerControl = Control.extend({

	// 基本属性

	/**
	 * 当前控件的 HTML 模板字符串。
	 * @getter {String} tpl
	 * @protected virtual
	 */
	tpl: '<div class="xtype">\
			<div class="xtype-body"></div>\
		</div>',

	/**
	 * 当前控件顶部的 HTML 模板字符串。
	 * @getter {String} tpl
	 * @protected virtual
	 */
	headerTpl: '<div class="xtype-header"><h4></h4></div>',

	/**
	 * 获取当前容器用于存放标题的 Dom 对象。
	 * @return {Dom}
     * @protected virtual
	 */
	header: function () {
		return this.dom.find('.' + this.xtype + '-header');
	},

	/**
	 * 获取当前容器用于存放内容的 Dom 对象。
	 * @return {Dom}
     * @protected virtual
	 */
	body: function () {
		return this.dom.find('.' + this.xtype + '-body') || this.dom;
	},

	// 基本操作

	/**
	 * 获取当前容器显示的标题。
	 * @param {Boolean} valueAsText 如果为 true，则编码标题中的 HTML 。否则返回原始的 HTML 源码。
	 */
	getTitle: function (valueAsText) {

		// 获取 header 。
		var header = this.header();

		// 如果存在 header， 最后一个节点即  title 标签 。
		return header ? (header.last() || header)[valueAsText ? 'getText' : 'getHtml']() : null;
	},

	/**
	 * 设置当前容器显示的标题。
	 * @param {String} value 要设置的标题内容。
	 * @param {Boolean} valueAsText 如果为 true，则编码 *value* 中的 HTML 。否则 *value* 将被直接设置。
	 */
	setTitle: function (value, valueAsText) {

		// 获取 header 。
		var header = this.header(), title;

		if (value === null) {
			header && header.remove();
		} else {

			// 如果不存在标题，则创建一个。
			if (!header) {
				header = this.dom.prepend(this.headerTpl.replace(/xtype/g, this.xtype));
			}

			// 获取或创建 title 。
			title = header.last() || header;

			// 设置内容。
			title[valueAsText ? 'setText' : 'setHtml'](value);

		}
		return this;
	},

	/**
	 * 获取当前容器显示的内容。
	 * @param {Boolean} valueAsText 是否编码 *value* 中的 HTML 字符串。
	 */
	getContent: function (valueAsText) {

		// 获取 body 。
		// 获取 content 。
		var body = this.body(), content = body.last();

		// 如果存在多个 content，使用 body 作为 content。
		if (!content || content.prev()) {
			content = body;
		}

		// 获取实际的内容。
		return content[valueAsText ? 'getText' : 'getHtml']();

	},

	/**
	 * 设置当前容器显示的内容。
	 * @param {String} value 要设置的标题。
	 * @param {Boolean} valueAsText 如果为 true，则编码内容中的 HTML 。否则返回原始的 HTML 源码。
	 */
	setContent: function (value, valueAsText) {

		// 获取 body 。
		var body = this.body(),
			contentClass = this.xtype + '-content',

			// 获取 content 。
			content = body.find('.' + contentClass);

		// 如果不存在 content，则创建一个。
		if (!content) {
			body.setHtml('<div class="' + contentClass + '"></div>');
			content = body.first();
		}

		// 设置文本内容。
		content[valueAsText ? 'setText' : 'setHtml'](value);
		return this;

	}

});