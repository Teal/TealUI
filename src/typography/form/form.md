<link rel="stylesheet" type="text/css" href="../form/textBox.css"> <link rel="stylesheet" type="text/css" href="../form/button.css"> <link rel="stylesheet" type="text/css" href="../misc/tipBox.css"> <link rel="stylesheet" type="text/css" href="../misc/tip.css"> <link rel="stylesheet" type="text/css" href="../../typography/partial/icon.css">

表单布局主要基于 [12栅格布局(grid12)](../core/grid12.html) 完成。表单的各个元素分别都是独立的组件。表单布局主要实现层和文本框的垂直对齐效果。

## 水平布局

<aside class="doc-demo">

<form class="x-form x-form-horizontal" action="###">

<div class="x-row"><label class="x-col x-col-3">账号名<span class="x-form-required">*</span>:</label>

<div class="x-col x-col-9"><input type="text" class="x-textbox"></div>

</div>

<div class="x-row"><label class="x-col x-col-3">(选填)附加信息:</label>

<div class="x-col x-col-9"><input type="text" class="x-textbox"> <span class="x-tipbox x-tipbox-error">错误提示</span>
<span class="x-tip">如：hello world</span></div>

</div>

<div class="x-row"><label class="x-col x-col-3">默认或其他:</label>

<div class="x-col x-col-9"><label><input type="radio" name="radio" checked="checked"> 默认</label>    <label><input type="radio" name="radio"> 自定义</label> <input type="text" class="x-textbox"></div>

</div>

<div class="x-row"><label class="x-col x-col-3">多字段:</label>

<div class="x-col x-col-9"><input type="text" class="x-textbox">
<input type="text" class="x-textbox">
<select class="x-textbox"><option>选项</option></select>
<select class="x-textbox"><option>选项</option></select></div>

</div>

<div class="x-row"><label class="x-col x-col-3">大段内容:</label>

<div class="x-col x-col-9"><textarea class="x-textbox"></textarea></div>

</div>

<div class="x-row"><label class="x-col x-col-3">验证码:</label>

<div class="x-col x-col-9"><input type="text" class="x-textbox x-form-short"> [![](../../../assets/resources/100x100.png)](###) [看不清，换一张](###)</div>

</div>

<div class="x-row"><label class="x-col x-col-3"></label>

<div class="x-col x-col-9"><label><input type="checkbox" checked=""> 同意[用户协议](###)</label></div>

</div>

<div class="x-row"><label class="x-col x-col-3"></label>

<div class="x-col x-col-9"><button type="submit" class="x-button">确定</button></div>

</div>

</form>

</aside>

当在手机上，水平布局会自动改为垂直布局。

## 垂直布局

<aside class="doc-demo">

<form class="x-form x-form-vertical" action="###">

<div class="x-row"><label class="x-col x-col-12">账号名<span class="x-form-required">*</span>:</label>

<div class="x-col x-col-12"><input type="text" class="x-textbox"></div>

</div>

<div class="x-row"><label class="x-col x-col-12">账号名<span class="x-form-required">*</span>:</label>

<div class="x-col x-col-12"><input type="text" class="x-textbox"></div>

</div>

<div class="x-row"><label class="x-col x-col-12">(选填)附加信息:</label>

<div class="x-col x-col-12"><input type="text" class="x-textbox"> <span class="x-tipbox x-tipbox-error">错误提示</span>
<span class="x-tip">如：hello world</span></div>

</div>

<div class="x-row"><label class="x-col x-col-12">默认或其他:</label>

<div class="x-col x-col-12"><label><input type="radio" name="radio" checked="checked"> 默认</label>    <label><input type="radio" name="radio"> 自定义</label> <input type="text" class="x-textbox"></div>

</div>

<div class="x-row"><label class="x-col x-col-12">多字段:</label>

<div class="x-col x-col-12"><input type="text" class="x-textbox">
<input type="text" class="x-textbox">
<select class="x-textbox"><option>选项</option></select>
<select class="x-textbox"><option>选项</option></select></div>

</div>

<div class="x-row"><label class="x-col x-col-12">大段内容:</label>

<div class="x-col x-col-12"><textarea class="x-textbox"></textarea></div>

</div>

<div class="x-row"><label class="x-col x-col-12">验证码:</label>

<div class="x-col x-col-12"><input type="text" class="x-textbox x-form-short"> [![](../../../assets/resources/100x100.png)](###) [看不清，换一张](###)</div>

</div>

<div class="x-row">

<div class="x-col x-col-12"><label><input type="checkbox" checked=""> 同意[用户协议](###)</label></div>

</div>

<div class="x-row">

<div class="x-col x-col-12"><button type="submit" class="x-button">确定</button></div>

</div>

</form>

</aside>

## 内联表单

<aside class="doc-demo">

<form class="x-form x-form-inline" action="###">

<div class="x-row">

<div class="x-col"><input type="text" class="x-textbox" placeholder="用户名"></div>

</div>

<div class="x-row">

<div class="x-col"><input type="text" class="x-textbox" placeholder="密码"></div>

</div>

<div class="x-row">

<div class="x-col"><label><input type="checkbox"> 记住密码</label></div>

</div>

<div class="x-row">

<div class="x-col"><button type="submit" class="x-button">登陆</button></div>

</div>

</form>

</aside>

当在手机上，内联表单会自动改为垂直布局。

## 字段长度

使用 `.x-form-short` 和 `.x-form-long` 生成超短或超长的表单字段。

<aside class="doc-demo">

<form class="x-form x-form-horizontal" action="###">

<div class="x-row"><label class="x-col x-col-3">字段:</label>

<div class="x-col x-col-9"><input type="text" class="x-textbox x-form-short"> <input type="text" class="x-textbox"> <input type="text" class="x-textbox x-form-long"></div>

</div>

</form>

</aside>

> 另参考 [表单验证(validator)](validator.html)。