/**
 * @author xuld
 */

//#include ui/container/dialog.js

var MessageBox = Dialog.extend({

	onOk: function () {
		return this.trigger('ok');
	},

	onCancel: function () {
		return this.trigger('cancel');
	},

    onCloseButtonClick: function () {
        this.cancel();
    },

    ok: function(){
        if (this.onOk() !== false) {
            this.close();
        }
    },

    cancel: function () {
        if (this.onCancel() !== false) {
            this.close();
        }
    },

    setIcon: function (type) {

        // 获取 body 。
        // 获取 content 。
    	var body = this.body(), content = Dom.last(body) || body;

    	if (type == null) {
    		content.className = content.className.replace(this.cssClass + '-iconbox ', ' ').replace(/\s.*?-iconboui-\w+/, '');
        } else {
        	Dom.addClass(content, this.cssClass + '-iconbox ' + this.cssClass + '-iconboui-' + type);
        }

        return this;
    },

    /**
	 * 设置按钮。
	 * options：
	 * {文字： true} ->  确定按钮
	 * {文字： false} ->  取消按钮
	 * {文字： func} ->  自定义按钮
	 */
    setButtons: function (options) {

    	var footerClass = this.cssClass + '-footer';

        if (options == null) {
        	Dom.query('.' + footerClass, this.elem).forEach(Dom.remove);
        } else {

        	var footer = Dom.find('.' + footerClass, this.elem) || Dom.append(this.elem, '<div class="' + footerClass + '"></div>'),
                key,
                value,
                btn;

        	Dom.empty(footer);

            for (key in options) {
                value = options[key];
                btn = Dom.append(footer, '<button class="x-button"></button>');
                Dom.setText(btn, key);
                switch (typeof value) {
                    case 'boolean':
                        value = value ? this.ok : this.cancel;
                    case 'function':
                        Dom.on(btn, 'click', value, this);
                        break;
                }

                Dom.append(footer, '  ');
            }

        }

        return this;
    }

});

MessageBox.show = function (text, title, icon, buttons) {

    var messageBox = MessageBox.showInstance || (MessageBox.showInstance = new MessageBox());

    return messageBox
    	.un()
        .setContent(text)
        .setTitle(title || "提示")
        .setIcon(icon || null)
        .setButtons(buttons || {
            '确定': true
        })
        .showDialog();

};

MessageBox.alert = function (text, title) {
    return MessageBox.show(text, title, 'warning');
};

MessageBox.confirm = function (text, title, onOk, onCancel) {

	var buttonClass = MessageBox.prototype.cssClass,
		messageBox = MessageBox.show(text, title, 'confirm', {
        '确定': true,
        '取消': false
    });
    
    Dom.find('.' + messageBox.cssClass + '-footer .x-button', messageBox.elem).className += " x-button-info";

    if(onOk)
        messageBox.on('ok', onOk);
    if (onCancel)
        messageBox.on('cancel', onCancel);

    return messageBox;
};

MessageBox.tip = function (text, icon, timeout, callback) {

    var messageBox = MessageBox.tipInstance || (MessageBox.tipInstance = new MessageBox());
	
    messageBox.setContent(text).setIcon(icon).showDialog();

    messageBox.timer = setTimeout(function(){
    	messageBox.close();
    	if(callback){
    		callback.call(messageBox);
    	}
    }, timeout || 3000);

    return messageBox;
};