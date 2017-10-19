/**
 * @author xuld
 */

typeof include === "function" && include("ui/core/idropdownowner.js
");
typeof include === "function" && include("ui/suggest/dropdownmenu.js
");

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

    autoPopover: true,

    /**
     * 设置组件是否自动根据下拉菜单调整宽度。
     */
    autoResize: false,

    /**
     * 更新当前所有的提示项。
     * @param {Dom} item 
     * @returns {} 
     */
    suggest: function (items, matchOnly, hideMenuIfFound) {

        var me = this;

        // 找出提示项中匹配的项。
        var value = me.value().trim().toLowerCase();

        // 无过滤，直接显示全部项。
        if (!value) {
            me.menu.items(items);
            return me;
        }

        // 存在一项完全匹配，提示完成。
        if (hideMenuIfFound && ~items.indexOf(value)) {
            me.popover.hide();
            return me;
        }

        // 高亮并筛选全部符合要求的项。
        var html = '';
        for (var i = 0; i < items.length; i++) {
            if (items[i].toLowerCase().indexOf(value) === 0) {
                html += '<li><a href="javascript:;">' + value + "<strong>" + items[i].substr(value.length) + "</strong>" + '</a></li>';
            } else if (!matchOnly) {
                html += '<li><a href="javascript:;">' + items[i] + '</a></li>';
            }
        }
        me.menu.dom.html(html);

        // 默认选择第一个结果。
        me.menu.selectedItem(me.menu.dom.first());

        return me;
    },

    /**
	 * 当被子类重写时，负责将当前文本的值同步到下拉菜单。
	 * @protected 
	 * @virtual
	 */
    updateMenu: function () {
        this.suggest(this.items, true, true);
    }

});
