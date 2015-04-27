
var TipBox = Control.extend({

    init: function () {
        Dom.on(this.elem, 'click', '.x-closebutton', this.close.bind(this));
    },

    close: function() {
        Dom.slideDown(this.elem);
    }

});
