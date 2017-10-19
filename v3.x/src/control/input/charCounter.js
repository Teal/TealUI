/**
 * @author xuld
 */

typeof include === "function" && include("../core/control.js");

var CharCounter = Control.extend({

    role: "charcounter",

    maxLength: 300,

    init: function () {
        var me = this;
        me.target = (Dom(me.target).valueOf() || me.dom.prev()).on("input", function () {
            me.update();
        });
        me.contentTpl = me.dom.html();
        me.update();
    },

    update: function () {
        var me = this;
        var length = me.target.text().length;
        var left = me.maxLength - length;
        me.dom.toggleClass('x-tip-error', left < 0).html(me.contentTpl.replace('{input}', length).replace('{total}', me.maxLength).replace('{left}', left));
    }

});
