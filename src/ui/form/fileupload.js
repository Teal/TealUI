/**
 * @author xuld
 */


imports("Controls.Button.Button");
imports("Controls.Form.FileUpload");
using("Controls.Core.Base");
using("Controls.Core.IInput");


var FileUpload = Control.extend(IInput).implement({

    xtype: 'fileupload',

    tpl: '<span class="x-control">\
			<input type="file" size="1">\
			<button class="x-button">浏览...</button>\
    	</span>',

    init: function(){
        var textBox = this.prev('[type=text]') || this.next('[type=text]');
        if (textBox) {
            this.setTextBox(textBox);
        }
    },

    setTextBox: function(textBox){
        textBox = Dom.get(textBox).setAttr('readonly', true);
        this.find('[type=file]').node.onchange = function () {
            textBox.setText(this.value);
        };
    },

    state: function (name, value) {
        if (name === 'disabled' || name === 'readonly') {
            this.find('[type=file]').setAttr('disabled', value);
            this.query('.x-button').toggleClass('x-button-disabled', value);
        } else {
            IInput.state.call(name, value);
        }

        return this;
    }

});