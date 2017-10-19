/**
 * @author xuld
 */

//#include ui/core/base.js

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
		return Dom.find('.' + this.cssClass + '-header', this.elem);
	},

	/**
	 * 获取当前容器用于存放内容的 Dom 对象。
	 * @return {Dom}
     * @protected virtual
	 */
	body: function () {
		return Dom.find('.' + this.cssClass + '-body', this.elem) || this.elem;
	},

	//#endregion

	//#region Public

	/**
	 * 获取当前容器显示的标题。
	 * @param {Boolean} valueAsText 如果为 true，则编码标题中的 HTML 。否则返回原始的 HTML 源码。
	 */
	getTitle: function (valueAsText) {

		// 获取 header 。
		var header = this.header();

		// 如果存在 header， 最后一个节点即  title 标签 。
		return Dom[valueAsText ? 'getText' : 'getHtml'](header && Dom.last(header) || header);
	},

	/**
	 * 设置当前容器显示的标题。
	 * @param {String} value 要设置的标题内容。
	 * @param {Boolean} valueAsText 如果为 true，则编码 *value* 中的 HTML 。否则 *value* 将被直接设置。
	 */
	setTitle: function (value, valueAsText) {

		// 获取 header 。
		var header = this.header();

		if (value === null) {
			header && Dom.remove(header);
		} else {

			// 如果不存在标题，则创建一个。
			if (!header) {
				header = Dom.prepend(this.elem, String.format(this.headerTpl, this));
			}

			// 设置内容。
			Dom[valueAsText ? 'setText' : 'setHtml'](header && Dom.last(header) || header, value);

		}
		return this;
	},

	/**
	 * 获取当前容器显示的内容。
	 * @param {Boolean} valueAsText 是否编码 *value* 中的 HTML 字符串。
	 */
	getContent: function (valueAsText) {

		var body = this.body();

		// 获取实际的内容。
		return Dom[valueAsText ? 'getText' : 'getHtml'](Dom.find('>.' + this.cssClass + '-content', body) || body);

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
			content = Dom.find('.' + contentClass, body);

		// 如果不存在 content，则创建一个。
		if (!content) {
			Dom.setHtml(body, '<div class="' + contentClass + '"></div>');
			content = body.firstChild;
		}

		// 设置文本内容。
		Dom[valueAsText ? 'setText' : 'setHtml'](content, value);
		return this;

	}

	//#endregion

});
