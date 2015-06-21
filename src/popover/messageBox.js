/**
 * @author xuld
 */

// #require dialog

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

    setIcon: function (value) {
        var body = this.elem.querySelector('.x-panel-body');
        if (value == null) {
            body.className = body.className.replace(/x-dialog-icon(-\w+)?/g, '');
        } else {
            body.classList.add('x-dialog-icon');
            body.classList.add('x-dialog-icon-' + value);
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

        var buttons = this.elem.querySelector('.x-dialog-buttons'),
            key,
            value,
            button;

        if (options == null) {
            buttons && buttons.removeSelf();
        } else {
            buttons = buttons || this.elem.append('<div class="x-dialog-buttons"></div>');

            // 清空节点。
            while (buttons.firstChild) {
                buttons.removeChild(buttons.firstChild);
            }

            for (key in options) {
                value = options[key];
                button = buttons.append('<button class="x-button' + (value === true ? ' x-button-primary' : '') + '"></button>');
                button.textContent = key;

                button.on('click', value === true ?this.ok: value === false ? this.cancel : (value || this.close)  , this);
                buttons.append('  ');
            }

        }

        return this;
    }

});

MessageBox.show = function (content, title, buttons, icon, onOk, onCancel) {
    var messageBox = new MessageBox()
        .setContent(content)
        .setTitle(title || "提示")
        .setIcon(icon)
        .setButtons(buttons || { '确定': false })
        .show();
    onOk && messageBox.on('ok', onOk);
    onCancel && messageBox.on('cancel', onCancel);
    return messageBox;
};

MessageBox.alert = function (content, title, onOk) {
    return MessageBox.show(content, title, { '确定': false }, 'warning', onOk, onOk);
};

MessageBox.confirm = function (content, title, onOk, onCancel) {
	return MessageBox.show(content, title, {
		    '确定': true,
		    '取消': false
	}, 'confirm', onOk, onCancel);
};

MessageBox.prompt = function (content, title, onOk, onCancel) {
    var messageBox = MessageBox.show('<input type="text" class="x-textbox">', title, {
        '确定': true,
        '取消': false
    }, null, function() {
        onOk && onOk.call(this, this.elem.querySelector('.x-panel-body .x-textbox').value);
    }, onCancel);
    messageBox.elem.querySelector('.x-panel-body .x-textbox').value = content || '';
    return messageBox;
};

MessageBox.tip = function (content, icon, timeout, callback) {

    var messageBox = new MessageBox();
    messageBox.elem.querySelector('.x-panel-header').removeSelf();
    messageBox.setContent(content).setIcon(icon).show();
    messageBox.timer = setTimeout(function(){
    	messageBox.close();
    	if(callback){
    		callback.call(messageBox);
    	}
    }, timeout || 3000);

    return messageBox;
};