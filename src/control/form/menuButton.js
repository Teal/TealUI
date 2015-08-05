/**
 * @author  xuld
 */

// #require ../control/base
// #require ../control/dropDown

var MenuButton = Control.extend({

    role: "menuButton",

    init: function () {
        var me = this;
        me.dropDown = (Dom(me.menu).valueOf() || me.dom.next('.x-popover, .x-dropdownmenu')).role('popover', {
            target: me.dom,
            onShow: function () {
                me.dom.addClass('x-button-actived');
            },
            onHide: function () {
                me.dom.removeClass('x-button-actived');
            }
        });
    }

});
