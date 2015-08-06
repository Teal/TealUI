/**
 * @author xuld
 */

// #require ui/button/buttongroup.css
// #require ui/button/splitbutton.css
// #require ui/button/menubutton.js

var SplitButton = Control.extend({

    role: "splitButton",

    init: function () {
        var me = this;
        me.dropDown = (Dom(me.menu).valueOf() || me.dom.next('.x-popover, .x-dropdownmenu')).role('popover', {
            target: me.dom.find('.x-button:last-child'),
            pinTarget: me.dom
        }).on('show', function () {
            me.dom.find('.x-button:last-child').addClass('x-button-actived');
        }).on('hide', function () {
            me.dom.find('.x-button:last-child').removeClass('x-button-actived');
        });
    }

});
