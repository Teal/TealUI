/**
 * @author xuld
 */

// #require ui/suggest/combobox.js

/**
 * 表示一个下拉列表。
 * @abstract class
 * @extends Control
 */
var DropDownList = ComboBox.extend({

	/**
	 * 当前控件的 HTML 模板字符串。
	 * @getter {String} tpl
	 * @protected override
	 */
	tpl: '<span class="x-picker">\
			<a href="javascript:;" class="x-button">A</a>\
		</span>',

	/**
	 * 获取当前输入域实际用于提交数据的表单域。
	 * @returns {Dom} 一个用于提交表单的数据域。
     * @remark 此函数会在当前控件内搜索可用于提交的表单域，如果找不到，则创建返回一个 input[type=hidden] 表单域。
	 * @protected override
	 */
	input: function () {
		return this.selectNode || (this.selectNode = Dom.append(this.elem, '<select name="' + (Dom.getAttr(this.elem, 'name') || "") + '" style="display:none">'));
	},

	init: function (options) {
		options.listMode = true;
		ComboBox.prototype.init.call(this, options);
	},

	/**
	 * 设置当前选中的项。
	 * @param {Dom} item 选中的项。
	 */
	setSelectedItem: function (item) {

		var text,
            input = this.input();

		if (item) {
			var option = Dom.data(item).option;
			if (!option) {
				Dom.data(item).option = option = new Option(Dom.getText(item), this.getValueOfItem(item));
				input.add(option);
			}
			option.selected = true;
			text = Dom.getText(option);
		} else {
			input.selectedIndex = -1;
			text = Dom.getAttr(input, 'placeholder');
		}

		// 无隐藏域，仅设置按钮的文本。
		Dom.setText(Dom.first(this.elem), text);

		return this;
	},

	getValueOfItem: function (item) {
		//assert.notNull(item, "ComboBox#getValueOfItem(item): {item} ~", item);
		var option = Dom.data(item).option;
		return option ? option.value : (Dom.getAttr(item, 'data-value') || Dom.getText(item));
	},

	setValue: function (value) {

		// 设置 value 。
		Dom.setText(this.input(), value);

		// 根据 value 获得新决定的选中项设置选中项。
		return this.setSelectedItem(this.getSelectedItem());

	},

	/**
	 * 模拟用户选择某一个项。
	 */
	selectItem: function (item) {

		var me = this, old;

		if (me.trigger('selecting', item)) {
			old = me.getSelectedItem();
			me.setSelectedItem(item);
			if (!(old ? old === item : item)) {
				me.trigger('change');
			}
			me.hideDropDown();
		}

		return me;
	},

	/**
	 * 获取当前选中的项。如果不存在选中的项，则返回 null 。
	 * @returns {Control} 选中的项。
	 */
	getSelectedItem: function () {

		// 获取选中的索引。
		var value = Dom.getAttr(this.input(), 'selectedIndex');

		return value < 0 ? null : this.dropDown.item(value);
	}

});
