/**
 * @author xuld
 */

// #require ui/button/buttongroup.css
// #require ui/button/splitbutton.css
// #require ui/button/menubutton.js

var SplitButton = Control.extend({

    init: function () {
        var me = this;
        me.dropDown = Control.get(me.elem.nextElementSibling, 'dropDown', {
            target: me.elem.querySelector('.x-button:last-child')
        });
        me.dropDown.on('show', function () {
            me.dropDown.elem.pin(me.elem, 'bl');
            me.elem.querySelector('.x-button:last-child').classList.add('x-button-actived');
        });
        me.dropDown.on('hide', function () {
            me.elem.querySelector('.x-button:last-child').classList.remove('x-button-actived');
        });
        me.dropDown.elem.on('click', function () {
            me.dropDown.hide();
        });
    }

});
