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
	 * 获取指定位置的选项卡。
	 * @return {Dom} 返回选项卡。
	 */
	item: function (index) {
		return this.dom.item(index);
	},

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
		return this.removeChild(this.item(index));
	},

	//#endregion

	//#region 切换选项卡

	/**
     * 当被子类重写时，实现选项卡切换逻辑。
     * @param {Dom} to 切换的目标选项卡。
     * @param {Dom} from 切换的源选项卡。
     * @param {Function} callback 切换完成后的回调函数。
     * @protected abstract
     */
	onToggleTab: Function.empty,

	/**
	 * 模拟选中一个选项卡。
	 * @param {Dom} value 要选中的选项卡。
	 * @return this
	 */
	selectTab: function (value) {
		var me = this, old;
		if (me.trigger('selecting', value) !== false) {
			old = me.getSelectedTab();
			me.onToggleTab(old, value);
			if (!(old ? old.equals(value) : value)) {
				me.trigger('change');
			}
		}
		return me;
	},

	/**
	 * 获取当前选中的选项卡。
	 * @return {Dom} 选中的选项卡。
	 */
	getSelectedTab: Function.empty,

	/**
	 * 设置当前选中的选项卡。
	 * @param {Dom} value 要选中的选项卡。
	 * @return this
	 */
	setSelectedTab: function (value) {
		this.onToggleTab(this.getSelectedTab(), value);
		return this;
	},

	/**
	 * 获取当前选中的选项卡位置。
	 * @return {Integer} 选中的选项卡位置。
	 */
	getSelectedIndex: function () {
		var tab = this.getSelectedTab();
		return tab ? tab.index() : -1;
	},

	/**
	 * 设置当前选中的选项卡位置。
	 * @param {Integer} value 需要选中的位置。
	 * @return this
	 */
	setSelectedIndex: function (value) {
		return this.setSelectedTab(this.item(value));
	}

	//#endregion

});