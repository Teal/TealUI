




using("Controls.Container.Dialog");

var MessageBox = Dialog.extend({

    onCloseButtonClick: function () {
        this.cancel();
    },

    onOk: function () {
        return this.trigger('ok');
    },

    onCancel: function () {
        return this.trigger('cancel');
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
        var body = this.body(), content = body.last();

        // 如果存在多个 content，使用 body 作为 content。
        if (!content || content.prev()) {
            content = body;
        }

        if (type == null) {
            content.node.className = content.node.className.replace(/x-dialog-iconbox\s+x-dialog-iconbox-\w+/, '');
        } else {
            content.addClass('x-dialog-iconbox x-dialog-iconbox-' + type);
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

        if (options == null) {
            this.query('.x-dialog-footer').remove();
        } else {

            var footer = this.find('.x-dialog-footer') || Dom.create('div', 'x-dialog-footer').appendTo(this),
                key,
                value,
                btn;

            footer.empty();

            for (key in options) {
                value = options[key];
                btn = footer.append('<button class="x-button"></button>').setText(key);
                switch (typeof value) {
                    case 'boolean':
                        value = value ? this.ok : this.cancel;
                    case 'function':
                        btn.on('click', value, this);
                        break;
                    case 'object':
                        btn.set(value);
                        break;
                }

                footer.append('  ');
            }

        }

        return this;
    }

});

MessageBox.show = function (text, title, icon, buttons) {

    var messageBox = MessageBox.showInstance || (MessageBox.showInstance = new MessageBox());

    return messageBox
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

    var messageBox = MessageBox.show(text, title, 'confirm', {
        '确定': {
            className: 'x-button x-button-info',
            onclick: function () {
                messageBox.ok();
            }
        },
        '取消': false
    });

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