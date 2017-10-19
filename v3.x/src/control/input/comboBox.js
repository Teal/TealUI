/**
 * @author xuld
 */

typeof include === "function" && include("picker
");
typeof include === "function" && include("dropdownMenu
");

/**
 * 表示一个组合框。
 * @extends Picker
 * @example
 * var comboBox = new ComboBox();
 * comboBox.add("aaa");
 * comboBox.add("bbb");
 * comboBox.setSelectedIndex(0);
 */
var ComboBox = Picker.extend({

    role: "comboBox",

    menuRole: "comboBox.menu",

    menuWidth: "100%",

    /**
     * 设置组件是否自动根据下拉菜单调整宽度。
     */
    autoResize: true,

    autoResizePadding: 20,

    tpl: '<button class="x-button x-dropdownlist" x-role="{role}" x-generated="true"><span> </span> <i class="x-icon">&#9662;</i></button>',

    init: function () {

        var me = this;

        // 处理 <select>
        var fromSelect;
        if (me.dom.is("select")) {
            me.input = me.dom.hide();
            me.dom = me.dom.after(me.tpl);
            fromSelect = true;
        }

        // 初始化文本框
        Picker.prototype.init.apply(me, arguments);

        // 隐藏空菜单。
        me.popover.on("show", function (e) {
            if (!me.menu.dom.first().length) {
                me.popover.hide(e);
            }
        });
        
        if (fromSelect && me.menu.copySelect) {
            me.menu.copySelect(me.input);
            me.menu.selectItem(me.menu.selectedItem());
        }

        if (me.autoResize) {
            me.resizeToFitItems();
        }
    },

    resizeToFitItems: function () {
        var me = this;
        var menu = me.menu.dom;
        var oldDisplay = menu.css('display');
        menu.css('display', 'inline-block');
        me.dom.rect({ width: menu.rect().width + me.autoResizePadding });
        menu.css('display', oldDisplay);
        return me;
    }

});

ComboBox.Menu = ListBox.extend({

    role: 'comboBox.menu',

    multiple: false,

    getInput: function () {
        // 浮层模式不需要自带隐藏域。
        return Dom();
    },

    init: function () {
        var me = this;

        // 追加浮层样式。
        me.dom.addClass("x-popover");

        // 浮层模式下鼠标移上后直接高亮节点。
        me.dom.on('mouseenter', 'li', function (e) {
            me.selectedItem(this, e);
        });

        // 浮层模式下鼠标点击后真正选择节点。
        me.dom.on('click', 'li', function (e) {
            // 禁用链接。
            e.preventDefault();
            me.selectItem(this, e);
        });

    },

    updateValue: function() {
        return this;
    }

});