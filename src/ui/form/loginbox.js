/** * @author xuld */imports("Controls.Form.TextBox");imports("Controls.Form.Form");imports("Controls.Button.Button");using("Controls.Container.Dialog");var LoginBox = Dialog.extend({

    contentTpl: '<form class="x-form">\
                    <div class="x-formfield">\
                        <label class="x-formfield-label">用户名:</label>\
                        <div class="x-formfield-content">\
                            <input type="text" class="x-textbox">\
                            <span class="x-tipbox x-tipbox-error">AAA</span>\
                        </div>\
                    </div>\
                    <div class="x-formfield">\
                        <label class="x-formfield-label">密码:</label>\
                        <div class="x-formfield-content">\
                            <input type="text" class="x-textbox">\
                            <span class="x-tipbox x-tipbox-success x-tipbox-plain">&nbsp;</span>\
                        </div>\
                    </div>\
                    <div class="x-formfield">\
                        <div class="x-formfield-content">\
                            <button class="x-button" type="submit">确定</button>\
                        </div>\
                    </div>\
                </form>',
    init: function (options) {
        this.base('init');        this.setHtml(this.contentTpl);    }});