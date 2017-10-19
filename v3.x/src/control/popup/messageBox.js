/**
 * @author xuld
 */

typeof include === "function" && include("dialog");

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

    ok: function () {
        if (this.onOk() !== false) {
            this.close();
        }
    },

    cancel: function () {
        if (this.onCancel() !== false) {
            this.close();
        }
    },

    icon: function (value) {
        var body = this.dom.find('.x-panel-body');
        if (value != null) {
            body
                .addClass('x-dialog-icon')
                .addClass('x-dialog-icon-' + value);
        } else if (body[0]) {
            body[0].className = body[0].className.replace(/x-dialog-icon(-\w+)?/g, '');
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
    buttons: function (options) {

        var me = this;
        var buttons = me.dom.find('.x-dialog-buttons');

        if (options != null) {
            if (!buttons.length) {
                buttons = me.dom.append('<div class="x-dialog-buttons"></div>');
            }

            // 清空节点。
            buttons.html('');

            for (var key in options) {
                var value = options[key];
                buttons.append('<button class="x-button' + (value === true ? ' x-button-primary' : '') + '"></button>')
                    .text(key)
                    .on('click', value === true ? this.ok : value === false ? this.cancel : (value || this.close), this);
                buttons.append('  ');
            }
        } else {
            buttons.remove();
        }

        return me;
    }

});

MessageBox.show = function (content, title, buttons, icon, onOk, onCancel) {
    var messageBox = new MessageBox()
        .content(content || null)
        .title(title || "提示")
        .icon(icon || null)
        .buttons(buttons || { '确定': false })
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
    }, null, function () {
        onOk && onOk.call(this, this.dom.find('.x-panel-body .x-textbox').text());
    }, onCancel);
    messageBox.dom.find('.x-panel-body .x-textbox').val(content);
    return messageBox;
};

MessageBox.toast = function (content, icon, timeout, callback) {

    var messageBox = new MessageBox();
    messageBox.dom.find('.x-panel-header').remove();
    messageBox.content(content).icon(icon).show();
    timeout = timeout || 3000;
    messageBox.timer = setTimeout(function () {
        clearInterval(messageBox.updater);
        messageBox.close();
        if (callback) {
            callback.call(messageBox);
        }
    }, timeout);

    // 自动更新文本中的 {time} 
    if (~content.indexOf("{time}")) {
        var counter = Math.floor(timeout / 1000);
        function updateTime() {
            messageBox.content(content.replace("{time}", counter--));
        }
        updateTime();
        messageBox.updater = setInterval(updateTime, 1000);
    }

    return messageBox;
};