/**
 * @author xuld
 */

//#include ui/form/listbox.js


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
            this.query('.ui-' + this.xtype + '-selected').removeClasss('ui-' + this.xtype + '-selected');
        }

        return this;
    },

    /**
     * 获取当前高亮项。
     */
    getSelectedItem: function () {
        return this.query('.ui-' + this.xtype + '-selected');
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
