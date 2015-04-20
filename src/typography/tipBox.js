
var TipBox = Control.extend({

    init: function() {
        this.dom.on('click', '.x-closebutton', function() {
            $(this).hide();
        });
    },

    close: function() {
        this.dom.slideUp();
    }

});
