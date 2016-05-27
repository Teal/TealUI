> <link rel="stylesheet" type="text/css" href="../../control/popup/messageBox.css">         

> 如果需要一个空的对话框，请使用 [对话框（dialog）](messageBox.html) 组件。

## 基本用法

##### 警告框(模拟 alert)

<script class="doc-demo">MessageBox.alert('<em>内容</em>', '我是标题');</script>

##### 确认框(模拟 confirm)

<pre>MessageBox.confirm('_内容_', '我是标题', function(){alert("点击了确定")});</pre>

### 输入框

<pre>MessageBox.prompt('请输入文字', '我是标题', function(content){alert(content)});</pre>

### 简单提示

<pre>MessageBox.toast('发送成功。
_{time} 秒后刷新页面..._', null, 3000, function(){location.reload()});</pre>

## 纯HTML实现

<aside class="doc-demo">

<section class="x-panel x-dialog" x-role="dialog">

<header class="x-panel-header"><a class="x-closebutton x-dialog-close">×</a>

#### 我是标题

</header>

<div class="x-panel-body x-dialog-icon x-dialog-icon-warning">我是内容</div>

<div class="x-dialog-buttons"><button class="x-button x-button-info">确定</button> <button class="x-button">取消</button></div>

</section>

</aside>

> 其它 API　请参考信息框的基类： [对话框（dialog）](messageBox.html) 组件。