/**
 * @author xuld
 */

//#include ui/core/base.js

/**
 * 表示一个可以切换的选项卡。
 * @abstract class TabbableControl
 * @extends Control
 */
var TabbableControl = Control.extend({

	/**
	 * 折叠效果使用的时间。
	 */
	collapseDuration: 200,

	//#region 增删选项卡

	/**
	 * 添加一个选项卡到列表末尾。
	 * @param {String} title 添加的标题。
	 * @param {String} content 添加的内容。
	 */
	add: function (title, content) {
		return this.addAt(1 / 0, title, content);
	},

	/**
	 * 添加一个选项卡到指定位置。
	 * @param {Integer} index 添加的位置。
	 * @param {String} title 添加的标题。
	 * @param {String} content 添加的内容。
	 */
	addAt: Function.empty,

	/**
	 * 删除指定位置选项卡。
	 * @param {Integer} index 删除的位置。
	 * @return {Dom} 被删除的选项卡。
	 */
	removeAt: function (index) {
		if (this.getSelectedIndex() === index) {
			this.setSelectedIndex(index + 1);
		}

		if (index = Dom.child(this.elem, index)) {
			Dom.remove(index);
		}

		return this;
	},

	//#endregion

	//#region 切换选项卡

	/**
	 * 模拟选中一个选项卡。
	 * @param {Dom} index 要选中的选项卡。
	 * @return this
	 */
	select: function (value) {
		var me = this, old;
		if (me.trigger('selecting', value) !== false) {
			old = me.getSelectedIndex();
			me.setSelectedIndex(value);
			if (old !== value) {
				me.trigger('change');
			}
		}
		return me;
	},

	/**
	 * 获取当前选中的选项卡位置。
	 * @return {Integer} 选中的选项卡位置。
	 */
	getSelectedIndex: Function.empty,

	/**
	 * 设置当前选中的选项卡位置。
	 * @param {Integer} value 需要选中的位置。
	 * @return this
	 */
	setSelectedIndex: Function.empty

	//#endregion

});