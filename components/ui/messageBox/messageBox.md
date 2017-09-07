---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 消息框

## 基本用法
```html demo doc
<button onclick="MessageBox.alert('警告')">警告</button>
<button onclick="MessageBox.confirm('确认删除吗？', '标题', function(){ alert('点击了确定') })">确认框</button>
<button onclick="MessageBox.prompt('请输入文字', '标题', function(text){ alert(text) })">输入框</button>
```

## 样式
```html demo
<div class="x-dialog" style="display: none;">
    <section class="x-panel">
        <header class="x-panel-header">
            <a class="x-close x-dialog-close" href="javascript:;">✖</a>
            <h5>顶部</h5>
        </header>
        <div class="x-panel-icon x-icon x-tip-warning">⚠</div>
        <div class="x-panel-body">
            内容
        </div>
        <div class="x-panel-buttons">
            <button class="x-button x-button-primary">确定</button>
            <button class="x-button">取消</button>
        </div>
    </section>
</div>
```
