/**
 * @author  xuld
 */

// #require ../control/base
// #require ../control/dropDown

var MenuButton = Control.extend({

    init: function () {
        var me = this;
        me.dropDown = Control.get(me.elem.nextElementSibling, 'dropDown', {
            target: me.elem
        });
        me.dropDown.on('show', function () {
            me.dropDown.elem.pin(me.elem, 'bl');
            me.elem.classList.add('x-button-actived');
        });
        me.dropDown.on('hide', function () {
            me.elem.classList.remove('x-button-actived');
        });
        me.dropDown.elem.on('click', function() {
            me.dropDown.hide();
        });
    }

});
