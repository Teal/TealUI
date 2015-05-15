/**
 * @author xuld
 */

//#require ui/composite/progressbar.css
//#require ui/core/base.js

var ProgressBar = Control.extend({

	cssClass: 'x-progressbar',

	tpl: '<div class="{cssClass}">\
                <div class="{cssClass}-fore"></div>\
            </div>',

    setValue: function (value) {
    	Dom.find('.' + this.cssClass + '-fore', this.elem).style.width = value + '%';
        return this;
    },

    getValue: function () {
    	return parseInt(Dom.find('.' + this.cssClass + '-fore', this.elem).style.width);
    }

});