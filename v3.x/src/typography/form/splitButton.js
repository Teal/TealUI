/**
 * @author xuld
 */

typeof include === "function" && include("ui/button/buttongroup.css
");
typeof include === "function" && include("ui/button/splitbutton.css
");
typeof include === "function" && include("ui/button/menubutton.js
");

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
