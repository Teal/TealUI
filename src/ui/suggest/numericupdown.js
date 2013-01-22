/**
 * @author xuld
 */


using("Controls.Suggest.UpDown");

var NumericUpDown = UpDown.extend({

    delta: 1,

    onUp: function () {
        this.setText((parseFloat(this.getText()) || 0) + this.delta);
    },

    onDown: function () {
        this.setText((parseFloat(this.getText()) || 0) - this.delta);
    }

});