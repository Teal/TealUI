/**
 * @author xuld
 */

using("Controls.Form.ListBox");


/**
 * 表示一个列表框。
 * @extends ListBox
 */
var MultiListBox = ListBox.implement({

    /**
     * 重新设置当前高亮项。
     */
    setSelectedItems: function (items) {
        if(items) {
            items.addClass(clazz);
        } else {
            this.query('.x-' + this.xtype + '-selected').removeClasss('x-' + this.xtype + '-selected');
        }

        return this;
    },

    /**
     * 获取当前高亮项。
     */
    getSelectedItem: function () {
        return this.query('.x-' + this.xtype + '-selected');
    },

    /**
	 * 模拟用户选择某一项。
	 */
    selectItem: function (item) {
        if (this.trigger('selecting', item) !== false) {
            this.setSelectedItems(item);
            this.trigger('change');
        }
    }

});
