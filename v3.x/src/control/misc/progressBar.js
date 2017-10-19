/**
 * @fileOverview 序業訳。
 * @author xuld
 */

typeof include === "function" && include("../control/base");

/**
 * 序業訳。
 */
Control.extend({

    role: "progressBar",

    value: function (value) {
        var fore = this.dom.find('.x-progressbar-fore');
        if (value === undefined) {
            return Dom.calc(fore[0], "width") / 100;
        }

        fore.css('width', value = (value < 0 ? 0 : value > 1 ? 100 : (value * 100).toFixed(0)) + '%');
	    if (fore.text()) {
	        fore.text(value);
	    }
        return this.trigger('change');
    }

});
