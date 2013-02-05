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

	//#region Internal

	/**
	 * 当前控件的 HTML 模板字符串。
	 * @getter {String} tpl
	 * @protected virtual
	 */
	tpl: '<div class="{cssClass}">\
			<div class="{cssClass}-body"></div>\
		</div>',

	/**
	 * 当前控件顶部的 HTML 模板字符串。
	 * @getter {String} tpl
	 * @protected virtual
	 */
	headerTpl: '<div class="{cssClass}-header"><h4></h4></div>',

	/**
	 * 获取当前容器用于存放标题的 Dom 对象。
	 * @return {Dom}
     * @protected virtual
	 */
	header: function () {
		return this.dom.find('.' + this.cssClass + '-header');
	},

	/**
	 * 获取当前容器用于存放内容的 Dom 对象。
	 * @return {Dom}
     * @protected virtual
	 */
	body: function () {
	    return this.dom.find('.' + this.cssClass + '-body') || this.dom;
	},

	//#endregion

	//#region Public

	/**
	 * 获取当前容器显示的标题。
	 * @param {Boolean} valueAsText 如果为 true，则编码标题中的 HTML 。否则返回原始的 HTML 源码。
	 */
	getTitle: function (valueAsText) {

		// 获取 header 。
		var header = this.header(), title = header.last();

		// 如果存在 header， 最后一个节点即  title 标签 。
		return (title.length ? title : header)[valueAsText ? 'getText' : 'getHtml']();
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
			if (!header.length) {
				this.dom.prepend(String.format(this.headerTpl, this));
				header = this.header();
			}

			// 获取或创建 title 。
			title = header.last();

			// 设置内容。
			(title.length ? title : header)[valueAsText ? 'setText' : 'setHtml'](value);

		}
		return this;
	},

	/**
	 * 获取当前容器显示的内容。
	 * @param {Boolean} valueAsText 是否编码 *value* 中的 HTML 字符串。
	 */
	getContent: function (valueAsText) {

		var body = this.body(),
			content = body.children('.' + this.cssClass + '-content');

		// 如果不存在 content，则使用 body 作为 content。
		if (!content.length) {
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
			contentClass = this.cssClass + '-content',

			// 获取 content 。
			content = body.find('.' + contentClass);

		// 如果不存在 content，则创建一个。
		if (!content.length) {
			body.setHtml('<div class="' + contentClass + '"></div>');
			content = body.first();
		}

		// 设置文本内容。
		content[valueAsText ? 'setText' : 'setHtml'](value);
		return this;

	}

	//#endregion

});