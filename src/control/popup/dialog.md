## 基本用法

<script class="doc-demo">var dialog = new Dialog().content('<em>我是内容</em>').title('我是标题').show();</script>

## 基于已有的 HTML 创建对话框

<aside class="doc-demo">

<section class="x-panel x-dialog" x-role="dialog">

<header class="x-panel-header"><a class="x-closebutton x-dialog-close">×</a>

#### 我是标题

</header>

<div class="x-panel-body">我是内容</div>

</section>

</aside>

## 常用 API

### 自定义遮罩层（模式对话框）

##### 不显示遮罩层

<pre>$('[x-role="dialog"]').role().setMask(null);</pre>

##### 显示透明度为 0.1 的遮罩层

<pre>$('[x-role="dialog"]').role().setMask(0.1);</pre>

### 关闭按钮

##### 手动关闭对话框

<pre>$('[x-role="dialog"]').role().close();</pre>

##### 设置用户关闭对话框后的回调

<pre>        $('[x-role="dialog"]').role().on("close", function(){
            alert("对话框已经关闭了");
        });
    </pre>

##### 不显示关闭按钮

<pre>$('[x-role="dialog"]').role().removeCloseButton();</pre>

##### 设置用户关闭对话框后的回调，并阻止关闭事件

<pre>        $('[x-role="dialog"]').role().on("closing", function(){
            alert("对话框即将关闭");
            return false; // return false 阻止事件，这样将关闭不了对话框。
        });
    </pre>

> 如果需要一个含有确定/取消按钮或者含有一个图标的对话框，请使用 [信息框（messageBox）](messageBox.html) 组件。