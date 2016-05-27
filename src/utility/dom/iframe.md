## IFrame 操作 <small>(源码: [utility/dom/iframe.js](../../utility/dom/iframe.js))</small>

<iframe id="a" src="./iframe.html?frame=none"></iframe><script>var iframe = new IFrame("a"); iframe.ready(function () { trace(this.window.document.title); iframe.document.setStyle('color', 'red'); }).load(function () { trace(this.window.document.title); }); iframe.autoResize();</script>

## IFrame 跨域通信 <small>(源码: [utility/dom/messager.js](../../utility/dom/messager.js))</small>

Domain of the parent page <script>document.write('(' + location.protocol + '//' + location.host + ')');</script>

<iframe id="iframe" src="messager.html" width="500"></iframe>

<input id="message" onkeypress="if(event.keyCode === 13){sendMessage();}"> <input type="button" value="send" onclick="sendMessage();">

<script class="demo">var messenger = Messenger.initInParent(document.getElementById('iframe')); messenger.onmessage = function (data) { var newline = '\n'; var text = document.createTextNode(data + newline); document.getElementById('output').appendChild(text); }; function sendMessage() { var message = document.getElementById('message'); messenger.send(message.value); message.value = ''; }</script>