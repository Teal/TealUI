/**
 * @author xuld
 */

// #require picker
// #require dropdownMenu

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

    autoResize: true,

    initDropDown: function () {
        var me = this;

        me.list = me.dropDown.dom.addClass("x-listbox").role('comboBox.menu');

        // 鼠标移上后直接选中节点。
        me.list.dom.on('mouseenter', 'li', function (e) {
            me.list.selectedItem(this, e);
        });

        // 列表选中项事件。
        me.list.on('select', function (item) {
            me.selectItem(item);
            me.dropDown.hide();
        });

        // 绑定键盘导航。
        if (me.input().keyNav) {
            var bindings = me.list.keyBindings();
            me.input().keyNav({
                up: function () {
                    if (me.dropDown.isHidden()) {
                        me.dropDown.show();
                    } else {
                        bindings.up();
                    }
                },
                down: function () {
                    if (me.dropDown.isHidden()) {
                        me.dropDown.show();
                    } else {
                        bindings.down();
                    }
                },
                enter: function () {
                    if (!me.dropDown.isHidden()) {
                        me.list.trigger('select', me.list.selectedItem());
                    }
                },
                esc: function () {
                    me.dropDown.hide();
                }
            });
        }

    },

    /**
	 * 将当前文本的值同步到下拉菜单。
	 * @protected override
	 */
    updateDropDown: function () {
        this.list.selectedItem(this.selectedItem());
    },

    tpl: '<button class="x-button x-dropdownlist" data-role="comboBox"><span></span> <i class="x-icon">&#9662;</i></button>',

    init: function () {

        var me = this;
        
        // 处理 <select>
        var fromSelect;
        if (me.dom.is("select")) {
            me.input(me.dom);
            me.dom = me.input().hide().after(me.tpl);
            fromSelect = true;
        }
        
        // 初始化文本框
        Picker.prototype.init.apply(this, arguments);

        if (fromSelect) {
            me.list.copyFrom(me.input());
            me.list.trigger('select', me.list.selectedItem());
        }

        if (me.autoResize) {
            me.resizeToFitItems();
        }
    },

    /**
	 * 模拟用户选择某一个项。
	 */
    selectItem: function (item) {
        var me = this;
        if (me.trigger('select', item)) {
            me.selectedItem(item);
            me.trigger('change');
        }
        return me;
    },

    /**
	 * 获取或设置当前选中的项。
	 * @param {Dom} item 选中的项。
	 * @returns this 如果不存在选中的项，则返回 null 。
	 */
    selectedItem: function (value) {
        var me = this;
        if (value === undefined) {
            var result = null;
            value = me.value();
            me.list.items().each(function (item) {
                if (me.list.getValueOf(item) === value) {
                    result = Dom(item);
                    return false;
                }
            });
            return result;
        }
        return me.value(me.list.getValueOf(value));
    },

    items: function (items) {
        var result = this.list.items(items);
        return items === undefined ? result : this;
    },

    resizeToFitItems: function () {
        var dropDown = this.dropDown,
			oldWidth = dropDown.dom.css('width'),
			oldDisplay = dropDown.dom.css('display');

        dropDown.dom.css('display', 'inline-block');
        dropDown.dom.css('width', 'auto');

        this.dom.rect({ width: dropDown.dom.rect().width + 20 });
        
        dropDown.dom.css('width', oldWidth);
        dropDown.dom.css('display', oldDisplay);
        return this;
    }

});

ComboBox.Menu = ListBox.extend({

    role: 'comboBox.menu',

    multiple: false,

    updateValue: function () { }

});