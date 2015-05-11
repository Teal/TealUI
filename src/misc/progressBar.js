/**
 * @author xuld
 */

//#include ui/composite/progressbar.css
//#include ui/core/base.js

var ProgressBar = Control.extend({

	role: 'progressBar',

    setValue: function (value) {
        Dom.find('.x-progressbar-fore', this.elem).style.width = (value * 100) + '%';
        return this;
    },

    getValue: function () {
        return parseInt(Dom.find('.x-progressbar-fore', this.elem).style.width) / 100;
    }

});
