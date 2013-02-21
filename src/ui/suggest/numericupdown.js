/**
 * @author xuld
 */


//#include ui/suggest/updown.js

var NumericUpDown = UpDown.extend({

    delta: 1,

    onUp: function () {
    	this.setValue((parseFloat(this.getValue()) || 0) + this.delta);
    },

    onDown: function () {
    	this.setValue((parseFloat(this.getValue()) || 0) - this.delta);
    }

});