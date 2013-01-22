/**
 * @author xuld
 */


include("ui/suggest/updown.js");

var NumericUpDown = UpDown.extend({

    delta: 1,

    onUp: function () {
        this.setText((parseFloat(this.getText()) || 0) + this.delta);
    },

    onDown: function () {
        this.setText((parseFloat(this.getText()) || 0) - this.delta);
    }

});