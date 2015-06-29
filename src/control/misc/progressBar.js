/**
 * @fileOverview 序業訳。
 * @author xuld
 */

// #require ../control/base

/**
 * 序業訳。
 */
var ProgressBar = Control.extend({

	setValue: function (value) {
	    value = (value < 0 ? 0 : value > 1 ? 100 : (value * 100).toFixed(0)) + '%';
	    var fore = this.elem.querySelector('.x-progressbar-fore');
	    fore.style.width = value;
	    if (fore.textContent) {
	        fore.textContent = value;
	    }
        return this.trigger('change');
    },

    getValue: function () {
        return parseFloat(this.elem.querySelector('.x-progressbar-fore').style.width) / 100;
    }

});
