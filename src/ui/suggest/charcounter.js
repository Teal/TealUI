/**
 * @author xuld
 */

include("ui/suggest/charcounter.css");
include("ui/core/base.js");

var CharCounter = Control.extend({

	maxLength: 300,

	cssClass: 'ui-charcounter',

	tpl: '<span class="{cssClass}"></span>',

	message: '还可以输入<span class="{cssClass}-success"> {value} </span>个字符',

	errorMessage: '已超过<span class="{cssClass}-error"> {value} </span>个字符',
    
    isValidated: function(){
    	return this.target.getText().length <= this.maxLength;
    },

    update: function () {
        var len = this.target.getText().length - this.maxLength;
        if (len > 0) {
        	this.dom.setHtml(String.format(this.errorMessage, {
        		cssClass: this.cssClass,
        		value: len,
        		maxLength: this.maxLength
        	}));
        } else {
        	this.dom.setHtml(String.format(this.message, {
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
        tip = tip ? Dom.get(tip) : target.siblings('.ui-charcounter').item(0);
        if (tip.length) {
        	this.dom = tip;
        } else {
        	target.after(this.dom = this.create());
        }

        target.on('keyup', this.update, this);

        this.update();
    }

});
