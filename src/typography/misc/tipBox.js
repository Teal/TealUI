
Control.TipBox = Control.extend({

    init: function () {
        var me = this;
        this.elem.on('click', '.x-closebutton', function () {
            me.close();
        });
    },

    close: function() {
        this.elem.hide('height');
    }

});
