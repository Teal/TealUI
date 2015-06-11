/**
 * @author xuld
 */


// #require ui/suggest/updown.js

var NumericUpDown = UpDown.extend({

    step: 1,

    onUpDown: function (delta) {
        this.elem.querySelector('input').value = (+this.elem.querySelector('input').value || 0) + delta * this.step;
    }

});