/**
 * @author xuld
 */

// #require ../control/base

var Placeholder = Control.extend({

    init: function() {
        var me = this,
            input = me.elem.nextElementSibling;
        input.on('focus', function() {
            me.elem.hide();
        });
        input.on('blur', function() {
            !input.value && me.elem.show();
        });
    }

});