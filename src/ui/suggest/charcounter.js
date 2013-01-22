/**
 * @author xuld
 */


var CharCounter = Control.extend({

    maxLength: 300,

    tpl: '<span class="x-charcounter"></span>',

    message: '还可以输入<span class="x-charcounter-success"> {0} </span>个字符',

    errorMessage: '已超过<span class="x-charcounter-error"> {0} </span>个字符',
    
    isValidated: function(){
    	return this.target.getText().length <= this.maxLength;
    },

    update: function () {
        var len = this.target.getText().length - this.maxLength;
        if (len > 0) {
            this.setHtml(String.format(this.errorMessage, len, this.maxLength));
        } else {
            this.setHtml(String.format(this.message, -len, this.maxLength));
        }
    },

    constructor: function (target, maxLength, tip) {
        this.target = target = Dom.get(target);
        if (maxLength)
            maxLength = this.maxLength;
        tip = (tip ? Dom.get(tip) : target.siblings('.x-charcounter').item(0)) || target.after(this.tpl);
        this.node = tip.node;

        target.on('keyup', this.update, this);

        this.update();
    }

});