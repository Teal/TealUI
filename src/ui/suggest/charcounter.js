/**
 * @author xuld
 */

//#include ui/suggest/charcounter.css
//#include ui/core/base.js

var CharCounter = Control.extend({

	maxLength: 300,

	cssClass: 'ui-charcounter',

	tpl: '<span class="{cssClass}"></span>',

	message: '还可以输入<span class="{cssClass}-success"> {value} </span>个字符',

	errorMessage: '已超过<span class="{cssClass}-error"> {value} </span>个字符',
    
    isValidated: function(){
    	return Dom.getText(this.target).length <= this.maxLength;
    },

    update: function () {
    	var len = Dom.getText(this.target).length - this.maxLength;
        if (len > 0) {
        	Dom.setHtml(this.elem, String.format(this.errorMessage, {
        		cssClass: this.cssClass,
        		value: len,
        		maxLength: this.maxLength
        	}));
        } else {
        	Dom.setHtml(this.elem, String.format(this.message, {
        		cssClass: this.cssClass,
        		value: -len,
        		maxLength: this.maxLength
        	}));
        }
    },

    constructor: function (target, maxLength, tip) {
        this.target = target = Dom.find(target);
        if (maxLength)
            maxLength = this.maxLength;
        this.elem = tip = Dom.find(tip) || Dom.nextAll(target, '.ui-charcounter')[0] || Dom.prevAll(target, '.ui-charcounter')[0] || Dom.after(target, this.create());

        Dom.on(target, 'keyup', this.update, this);

        this.update();
    }

});
