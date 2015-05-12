/**
 * @author xuld
 */

//#require ../control/base.js

var ProgressBar = Control.extend({

	role: 'progressBar',

	setValue: function (value) {
	    var fore = Dom.find('.x-progressbar-fore', this.elem);
	    value = (value * 100).toFixed(0) + '%';
	    fore.style.width = value;
	    if (Dom.getText(fore)) {
	        Dom.setText(fore, value);
	    }
        return this;
    },

    getValue: function () {
        return parseFloat(Dom.find('.x-progressbar-fore', this.elem).style.width) / 100;
    }

});
