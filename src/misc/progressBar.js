/**
 * @author xuld
 * @fileOverview 序業訳。
 */

//#require ../control/base.js

/**
 * 序業訳。
 */
var ProgressBar = Control.extend({

	role: 'progressBar',

	setValue: function (value) {
	    value = (value < 0 ? 0 : value > 1 ? 100 : (value * 100).toFixed(0)) + '%';
	    var fore = Dom.find('.x-progressbar-fore', this.elem);
	    fore.style.width = value;
	    if (Dom.getText(fore)) {
	        Dom.setText(fore, value);
	    }
        return this.trigger('change');
    },

    getValue: function () {
        return parseFloat(Dom.find('.x-progressbar-fore', this.elem).style.width) / 100;
    }

});
