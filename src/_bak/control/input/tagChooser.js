/**
 * @author  xuld
 */

typeof include === "function" && include("../control/base");

/**
 * 一个标签选择器。
 */
var TagChooser = Control.extend({

    role: 'tagchooser',

    selectItem: function (tag, e) {
        var me = this;
        var values = me.target.text().split(/\s+/);
        var value = Dom(tag).text();
        var index = values.indexOf(value);
        if (index < 0) {
            values.push(value)
        } else {
            values.splice(index, 1);
        }
        me.target.text(values.join(' ').trim());
        me.update();
    },

    update: function () {
        var me = this;
        var values = me.target.text().split(/\s+/);
        me.dom.find("a").each(function (elem) {
            elem = Dom(elem);
            elem.toggleClass('x-tagchooser-selected', values.indexOf(elem.text()) >= 0);
        });
        return me;
    },

    init: function () {
        var me = this;
        me.target = (Dom(me.target).valueOf() || me.dom.prev()).on("input", function () {
            me.update();
        });
        me.dom.on("click", "a", function (e) {
            me.selectItem(this, e);
        });
        me.update();
    }

});