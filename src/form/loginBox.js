/**
 * @author xuld
 */

//#require ui/input/textBox.css
//#require ui/form/form.css
//#require ui/button/button.css
//#require ui/container/dialog.js


var LoginBox = Dialog.extend({

    contentTpl: '<form class="x-form">\
                    <div class="x-formfield">\
                        <label class="x-formfield-label">�û���:</label>\
                        <div class="x-formfield-content">\
                            <input type="text" class="x-textbox">\
                            <span class="x-tipbox x-tipboui-error">AAA</span>\
                        </div>\
                    </div>\
                    <div class="x-formfield">\
                        <label class="x-formfield-label">����:</label>\
                        <div class="x-formfield-content">\
                            <input type="text" class="x-textbox">\
                            <span class="x-tipbox x-tipboui-success x-tipboui-plain">&nbsp;</span>\
                        </div>\
                    </div>\
                    <div class="x-formfield">\
                        <div class="x-formfield-content">\
                            <button class="x-button" type="submit">ȷ��</button>\
                        </div>\
                    </div>\
                </form>',

    init: function (options) {

        this.base('init');

        this.setHtml(this.contentTpl);


    }


});

