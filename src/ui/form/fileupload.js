/**
 * @author xuld
 */


//#include ui/button/button.css
//#include ui/form/fileupload.css
//#include ui/core/base.js
//#include ui/core/iinput.js


var FileUpload = Control.extend(IInput).implement({

    xtype: 'fileupload',

    tpl: '<span class="ui-control">\
			<input type="file" size="1">\
			<button class="ui-button">浏览...</button>\
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
            this.query('.ui-button').toggleClass('ui-button-disabled', value);
        } else {
            IInput.state.call(name, value);
        }

        return this;
    }

});