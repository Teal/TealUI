# IFrame 操作
提供 IFrame 操作的相关功能。

## IFrame 操作 (源码: [utility/dom/iframe.js](../../utility/dom/iframe.js))

        var iframe = new IFrame("a");
        iframe.ready(function () {
            trace(this.window.document.title);
            iframe.document.setStyle('color', 'red');
        }).load(function () {
            trace(this.window.document.title);
        });
        iframe.autoResize();

## IFrame 跨域通信 (源码: [utility/dom/messager.js](../../utility/dom/messager.js))

        Domain of the parent page
        document.write('(' + location.protocol + '//' + location.host + ')');

        var messenger = Messenger.initInParent(document.getElementById('iframe'));
        messenger.onmessage = function (data) {
            var newline = '\n';
            var text = document.createTextNode(data + newline);
            document.getElementById('output').appendChild(text);
        };

        function sendMessage() {
            var message = document.getElementById('message');
            messenger.send(message.value);
            message.value = '';
        }
