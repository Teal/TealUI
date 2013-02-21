/**
 * @author xuld
 */

//#include ui/composite/progressbar.css
//#include ui/core/base.js


var ProgressBar = Control.extend({

    xtype: 'progressbar',

    tpl: '<div class="ui-control">\
                <div class="ui-progressbar-fore"></div>\
            </div>',

    setValue: function (value) {
        this.find('.ui-progressbar-fore').node.style.width = value + '%';
        return this;
    },

    getValue: function () {
        return parseInt(this.find('.ui-progressbar-fore').node.style.width);
    }

});