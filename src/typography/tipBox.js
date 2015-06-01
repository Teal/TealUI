
var TipBox = Control.extend({

    init: function () {
        var me = this;
        Dom.on(this.elem, 'click', '.x-closebutton', function () {
            me.close();
        });
    },

    close: function() {
        Dom.hide(this.elem, 'height');
    }

});
