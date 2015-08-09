/**
 * @author xuld
 */

// #require ui/core/idropdownowner.js
// #require ui/suggest/dropdownmenu.js

/**
 * 智能提示组件。
 * @extends Control
 */
var Suggest = ComboBox.extend({

    role: 'suggest',

    /**
     * 获取或设置所有可用于提示的项。
     */
    items: null,

    autoPopup: true,

    /**
     * 更新当前正在提示的项。
     * @param {} item 
     * @returns {} 
     */
    update: function(items) {
        
        // 找出提示项中匹配的项。
        var value = this.value().trim().toLowerCase();

        var html = '';
        for (var i = 0; i < items.length; i++) {
            if (items[i].toLowerCase().indexOf(value) === 0) {
                html += '<li><a href="javascript:;">' + value + "<strong>" + items[i].substr(value.length) + "</strong>" + '</a></li>';
            }
        }

        this.dropDown.dom.html(html);
        this.dropDown.selectedItem(this.dropDown.dom.first());

    },

    /**
	 * 当被子类重写时，负责将当前文本的值同步到下拉菜单。
	 * @protected 
	 * @virtual
	 */
    updateDropDown: function () {

        var items = this.items;
        var value = this.value().trim();

        // 无过滤，直接显示全部项。
        if (!value) {
            this.dropDown.items(items);
            return;
        }

        // 存在一项完全匹配，提示完成。
        if (~items.indexOf(value)) {
            this.popover.hide();
            return;
        }

        this.update(items);
    }

});
