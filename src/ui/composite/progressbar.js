/**
 * @author xuld
 */

include("ui/composite/progressbar.css");
include("ui/core/base.js");


var ProgressBar = Control.extend({

    xtype: 'progressbar',

    tpl: '<div class="x-control">\
                <div class="x-progressbar-fore"></div>\
            </div>',

    setValue: function (value) {
        this.find('.x-progressbar-fore').node.style.width = value + '%';
        return this;
    },

    getValue: function () {
        return parseInt(this.find('.x-progressbar-fore').node.style.width);
    }

});