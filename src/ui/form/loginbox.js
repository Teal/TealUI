/**
 * @author xuld
 */

//#include ui/form/textbox.css
//#include ui/form/form.css
//#include ui/button/button.css
//#include ui/container/dialog.js


var LoginBox = Dialog.extend({

    contentTpl: '<form class="ui-form">\
                    <div class="ui-formfield">\
                        <label class="ui-formfield-label">�û���:</label>\
                        <div class="ui-formfield-content">\
                            <input type="text" class="ui-textbox">\
                            <span class="ui-tipbox ui-tipboui-error">AAA</span>\
                        </div>\
                    </div>\
                    <div class="ui-formfield">\
                        <label class="ui-formfield-label">����:</label>\
                        <div class="ui-formfield-content">\
                            <input type="text" class="ui-textbox">\
                            <span class="ui-tipbox ui-tipboui-success ui-tipboui-plain">&nbsp;</span>\
                        </div>\
                    </div>\
                    <div class="ui-formfield">\
                        <div class="ui-formfield-content">\
                            <button class="ui-button" type="submit">ȷ��</button>\
                        </div>\
                    </div>\
                </form>',

    init: function (options) {

        this.base('init');

        this.setHtml(this.contentTpl);


    }


});

