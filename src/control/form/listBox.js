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
     * 设置当前列表框是否是多选的。
     */
    multiple: true,

    init: function () {
        var me = this;

        // 从 <select> 生成项。
        if (me.dom.is("select")) {
            me._input = me.dom;
            me.dom = me._input.hide().after('<ul class="x-listbox"><ul>');
            me.copyItemsFromSelect(me._input);
        }

        var rendered = false;

        // 鼠标点击选中。
        me.dom.on('click', 'li', function (e) {
            e.preventDefault();
            if (!rendered) {
                me.selectItem(this, e);
            }
            rendered = false;
        });

        // 如果是多选框。则支持用户拖动选择功能。
        if (me.multiple) {
            me.dom.on('mousedown', 'li', function (e) {
                e.preventDefault();
                var start = Dom(this);
                function selectRange(e) {
                    var range = me.range(start, Dom(this));
                    if (rendered || range.length > 1) {
                        rendered = true;
                        me.selectItem(range, e);
                    }
                }
                me.dom.on('mousemove', 'li', selectRange);
                Dom(document).on('mouseup', function () {
                    me.dom.off('mousemove', selectRange);
                    Dom(document).off('mouseup', arguments.callee);
                });
            });
        }

        // 初始化列表值。
        me.value(me.value());

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
        return this.dom.children().slice(start, end + 1);
    },

    /**
	 * 选中当前列表的指定项。
     * @param {Dom} item 要选择的项。 
     * @param {Event} [e] 相关的事件参数。 
	 */
    selectItem: function (item, e) {
        var me = this;
        // 支持批量选择。
        if (e && e.shiftKey) {
            item = me.range(me.selectedItem(), Dom(item));
        }
        // 判断是否禁用。
        if (!me.state('disabled') && !me.state('readOnly') && me.trigger('select', item)) {
            me.selectedItem(item, e && e.ctrlKey);
        }
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
        var me = this;
        item.toggleClass('x-listbox-selected', value);
        me.selectedItem(me.selectedItem());
        return me;
    },

    /**
     * 获取或设置当前选中的项。
     * @param {Dom} [item] 要选择的项。如果是多选则传递包含多个项的列表。
     * @param {Boolean} [multiple] 设置是否支持多选。
     * @returns {mixed} 返回 @this 或当前选择的项。 
     */
    selectedItem: function (item, multiple) {
        var me = this;
        var selected = me.dom.children('.x-listbox-selected');
        if (item === undefined) {
            return selected;
        }
        item = Dom(item);

        // 多选模式下，清空当前项选中状态。
        // FIXME: 支持完美多选复选效果。
        if (multiple && me.multiple && item.length === 1 && ~selected.indexOf(item[0])) {
            return me.selected(item, false);
        }

        // 设置样式。
        multiple || selected.removeClass('x-listbox-selected');
        item.addClass('x-listbox-selected');

        // 更新值。
        var values = [];
        me.dom.children('.x-listbox-selected').each(function (item, index) {
            values[index] = me.getValueOf(Dom(item));
        });
        me.input().text(values.join(","));

        me.trigger('change');
        return me;
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
                if (~value.indexOf(me.getValueOf(Dom(item)))) {
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
     * 获取指定项对应的值。
     * @param {Dom} item 
     * @returns {String} 要获取的文本。 
     */
    getValueOf: function (item) {
        return item.attr("data-value") || item.text();
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
    
    copyItemsFromSelect: function (select) {
        var me = this;
        me.multiple = select[0].multiple;
        if (select[0].readOnly) {
            me.state('readOnly');
        }
        if (select[0].disbaled) {
            me.state('disbaled');
        }

        var html = '';
        select.children("option").each(function (item) {
            html += '<li data-value="' + item.value + '"' + (item.selected ? ' selected' : '') + '><a href="javascript:;">' + Dom(item).text() + '</a></li>';
        });
        me.dom.html(html)[0].onclick = select[0].onclick;
        if (me._input.onchange) {
            me.on('change', select[0].onchange);
        }
    }

});
