/**
 * @author xuld
 */

//#include ui/suggest/combobox.js

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
    tpl: '<span class="ui-picker">\
			<a href="javascript:;" class="ui-button">A</a>\
		</span>',

    /**
	 * 获取当前输入域实际用于提交数据的表单域。
	 * @return {Dom} 一个用于提交表单的数据域。
     * @remark 此函数会在当前控件内搜索可用于提交的表单域，如果找不到，则创建返回一个 input[type=hidden] 表单域。
	 * @protected override
	 */
    input: function () {
        return this.selectDom || (this.selectDom = Dom.create('select').setAttr('name', Dom.getAttr(this.node, 'name')).hide().appendTo(this));
    },

    init: function (options) {
        options.listMode = true;
        this.base('init');
    },

    /**
	 * 设置当前选中的项。
	 * @param {Dom} item 选中的项。
	 */
    setSelectedItem: function (item) {

        var text,
            input = this.input();

        if (item) {
            var option = item.dataField().option;
            if (!option) {
                item.dataField().option = option = new Option(item.getText(), this.getValueOfItem(item));
                input.node.add(option);
            }
            option.selected = true;
            text = Dom.getText(option);
        } else {
            input.node.selectedIndex = -1;
            text = input.getAttr('placeholder');
        }

        // 无隐藏域，仅设置按钮的文本。
        this.first().setText(text);

        return this;
    },

    getValueOfItem: function (item) {
        //assert.notNull(item, "ComboBox#getValueOfItem(item): {item} ~", item);
        var option = item.dataField().option;
        return option ? option.value : (item.getAttr('data-value') || item.getText());
    },

    setText: function (value) {

        // 设置 value 。
        this.input().setText(value);

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
            if (!(old ? old.equals(item) : item)) {
                me.trigger('change');
            }
            me.hideDropDown();
        }

        return me;
    },

    /**
	 * 获取当前选中的项。如果不存在选中的项，则返回 null 。
	 * @return {Control} 选中的项。
	 */
    getSelectedItem: function () {

        // 获取选中的索引。
        var value = this.input().getAttr('selectedIndex');

        return value < 0 ? null : this.dropDown.item(value);
    }

});