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

    dropDownRole: "comboBox.menu",

    autoResize: true,

    tpl: '<button class="x-button x-dropdownlist" data-role="comboBox"><span></span> <i class="x-icon">&#9662;</i></button>',

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
        Picker.prototype.init.apply(this, arguments);

        if (fromSelect) {
            me.dropDown.copyFromSelect(me.input);
            me.dropDown.selectItem(me.dropDown.selectedItem());
        }

        if (me.autoResize) {
            me.resizeToFitItems();
        }
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

    init: function () {
        var me = this;

        me.popover = me.dom.addClass("x-popover").role('popover');

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

    updateValue: function () { }

});