/**
 * @author xuld
 */

// #require ui/form/listbox.css
// #require ui/core/listcontrol.js

/**
 * 表示一个单选或多选列表框。
 */
var ListBox = Input.extend({

    role: 'listBox',

    /**
     * 设置当前列表框是否允许多选。
     */
    multiple: true,

    init: function () {
        var me = this;

        // 从 <select> 生成项。
        if (me.dom.is("select")) {
            me.input(me.dom);
            me.dom = me._input.hide().after('<ul class="x-listbox"><ul>');
            me.copyFrom(me.input());
        }

        // 禁用 CTRL 点击跳转。
        me.dom.on('click', function (e) {
            e.preventDefault();
        });

        // 鼠标按下后选中当前项。
        me.dom.on('mousedown', 'li', function (e) {
            e.preventDefault();

            var startItem = Dom(this);
            me.selectItem(startItem, e);
            var selectedItem = e.ctrlKey && me.selectedItem();
            var deselectMode = e.ctrlKey && !me.selected(startItem);

            function select(e) {
                me.selectItem(this, e, startItem, selectedItem, deselectMode);
            }

            me.dom.on('mouseenter', 'li', select);
            Dom(document).on('mouseup', function () {
                me.dom.off('mouseenter', 'li', select);
                Dom(document).off('mouseup', arguments.callee);
            });
        });

        // 初始化列表值。
        me.value(me.value());

    },

    /**
	 * 选中当前列表的指定项。
     * @param {Dom} item 要选择的项。 
     * @param {Event} [e] 相关的事件参数。 
	 */
    selectItem: function (item, e, startItem, startSelectedItem, deselectMode) {
        var me = this;

        // 判断是否只读或禁用。
        if (!me.state('disabled') && !me.state('readOnly') && me.trigger("select", item)) {

            // 多选功能。
            if (e && me.multiple) {
                // 批量选择。
                if (e.shiftKey) {
                    item = me.range(me.selectedItem(), Dom(item));
                } else if (startItem) {
                    var range = me.range(startItem, Dom(item));
                    item = deselectMode ? startSelectedItem.filter(function (item) {
                        return range.indexOf(item) < 0;
                    }) : range.add(startSelectedItem);
                } else if (e.ctrlKey) {
                    return me.selected(item, !me.selected(item));
                }
            }

            me.selectedItem(item);
        }

        return me;

    },

    /**
     * 获取选中指定两个节点及中间所有节点。
     * @param {Dom} from 选区的第一个节点。
     * @param {Dom} to 选区的最后一个节点。
     * @returns {Dom} 返回一个节点列表。
     */
    range: function (from, to) {
        var start = from.index();
        var end = to.index();
        if (end < start) {
            start = end;
            end = Dom(from[from.length - 1]).index();
        }
        return Dom(this.dom.children().slice(start, end + 1));
    },

    /**
     * 当选中项发生改变时负责更新最新的值到 this.input()。
     * @protected
     * @virtual
     */
    updateValue: function () {
        var me = this;
        var values = [];
        me.dom.children('.x-listbox-selected').each(function (item, index) {
            values[index] = me.getValueOf(item);
        });
        me.input().text(values.join(","));
        me.trigger('change');
        return me;
    },

    /**
     * 获取指定项对应的值。
     * @param {Dom} item 
     * @returns {String} 要获取的文本。 
     */
    getValueOf: function (item) {
        item = Dom(item);
        return item.attr("data-value") || item.text();
    },

    /**
     * 判断或设置指定的项是否被选中。
     * @param {Dom} item 要选择的项。如果是多选则传递包含多个项的列表。
     * @param {Boolean} value 要设置是否选中。
     * @returns {mixed} 返回选中状态或 this。
     */
    selected: function (item, value) {
        item = Dom(item);
        if (value === undefined) {
            return item.is('.x-listbox-selected');
        }
        item.toggleClass('x-listbox-selected', value);
        return this.updateValue();
    },

    /**
     * 获取或设置当前选中的项。
     * @param {Dom} [item] 要选择的项。如果是多选则传递包含多个项的列表。
     * @param {Boolean} [multiple] 设置是否支持多选。
     * @returns {mixed} 返回 @this 或当前选择的项。 
     */
    selectedItem: function (item) {
        var me = this;
        var selected = me.dom.children('.x-listbox-selected');
        if (item === undefined) {
            return selected;
        }
        item = Dom(item);

        // 设置样式。
        selected.removeClass('x-listbox-selected');
        item.addClass('x-listbox-selected');

        // 更新值。
        return me.updateValue();
    },

    /**
     * 获取或设置当前输入框的值。
     * @param {String} [value] 要设置的文本。
     * @returns this
     */
    value: function (value) {
        var me = this;
        if (value === undefined) {
            return me.input().text();
        }
        if (value) {
            if (typeof value === "string") {
                value = value.split(",");
            }
            var items = Dom();
            me.dom.children().each(function (item) {
                if (~value.indexOf(me.getValueOf(item))) {
                    items.add(item);
                }
            });
            me.selectedItem(items);
        }
        return me;
    },

    /**
     * 获取或设置当前列表的全部项。
     * @param {} item 
     * @returns {} 
     */
    items: function (item) {
        if (items === undefined) {
            return this.dom.children();
        }
        this.dom.html('');
        this.dom.append(item);
        return this;
    },

    /**
     * 获取当前菜单的默认键盘绑定。
     * @returns {Object} 返回各个键盘绑定对象。
     */
    keyBindings: function () {
        var me = this;
        function upDown(isUp) {

            // 定位当前选中项。
            var current = Dom(me.selectedItem()[0]);

            // 执行移动。
            current = isUp ? current.prev() : current.next();

            // 如果移动到末尾则回到第一项。
            if (!current.length) {
                current = isUp ? me.dom.last() : me.dom.first();
            }

            // 选中指定项。
            me.selectedItem(current);

        }
        return {
            up: function () {
                upDown(true);
            },
            down: function () {
                upDown(false);
            },
            enter: function () {
                me.selectedItem().click();
            }
        };
    },

    copyFrom: function (select) {
        var me = this;

        // 拷贝所有项。
        var html = '';
        select.find("option").each(function (item) {
            html += '<li data-value="' + item.value + '"' + (item.selected ? ' class="x-listbox-selected"' : '') + '><a href="javascript:;">' + Dom(item).text() + '</a></li>';
        });
        me.dom.html(html);

        // 拷贝基本属性。
        select = select[0];
        me.multiple = select.multiple;
        if (select.readOnly) {
            me.state('readOnly');
        }
        if (select.disbaled) {
            me.state('disbaled');
        }
        me.dom[0].onclick = select.onclick;
        if (select.onchange) {
            me.on('change', select.onchange);
        }
    }

});
