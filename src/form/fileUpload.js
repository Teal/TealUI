/**
 * @author xuld
 */

//#include ui/button/button.css
//#include ui/form/fileupload.css
//#include ui/core/base.js
//#include ui/core/iinput.js

var FileUpload = Control.extend(IInput).implement({

	cssClass: 'x-fileupload',

	tpl: '<span class="{cssClass}">\
			<input type="file" size="1">\
			<button class="x-button">浏览...</button>\
    	</span>',

    init: function(){
    	var textBox = Dom.prev(this.elem, '[type=text]') || Dom.next(this.elem, '[type=text]');
        if (textBox) {
            this.setTextBox(textBox);
        }
    },

    setTextBox: function(textBox){
    	textBox = Dom.find(textBox);

    	textBox.readOnly = true;
    	this.input().onchange = function () {
        	textBox.value = this.value;
        };
    },

    input: function () {
    	return Dom.find('[type=file]', this.elem);
    },

    state: function (name, value) {
        if (name === 'disabled' || name === 'readonly') {
        	Dom.setAttr(this.input(), 'disabled', value);
            Dom.toggleClass(this.find('.x-button'), 'x-button-disabled', value);
        } else {
            IInput.state.call(name, value);
        }
    }

});
