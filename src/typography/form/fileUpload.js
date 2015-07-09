/**
 * @author xuld
 */

// #require ui/button/button.css
// #require ui/form/fileupload.css
// #require ui/core/base.js
// #require ui/core/iinput.js

var FileUpload = Control.extend({

    init: function () {
        var me = this;
        this.elem.query('[type=file]').on('change', function () {
            var textBox = me.elem.nextElementSibling;
            if (textBox.matches('[type=text]') || ((textBox = me.elem.previousElementSibling) && textBox.matches('[type=text]'))) {
                textBox.value = this.value;
            }
        });
    }

});
