# 输入框组
输入框组。
<link rel="stylesheet" href="reset.scss" />
<link rel="stylesheet" href="tipBox.scss" />
<link rel="stylesheet" href="icon.scss" />
<link rel="stylesheet" href="textBox.scss" />
<link rel="stylesheet" href="button.scss" />
<link rel="stylesheet" href="inputGroup.scss" />
<link rel="stylesheet" href="utility.scss" />
<link rel="stylesheet" href="../form/buttonGroup.scss" />

        .doc-demo {
            line-height: 40px;
        }

在一个 `x-textbox` 前后追加一个 `x-tipbox` 或 `x-buttongroup`。

## 追加提示框
```htm
<span class="x-inputgroup">
    <span class="x-tipbox">邮箱: </span>
    <input type="text" class="x-textbox" />
</span>

<br />

<span class="x-inputgroup">
    <input type="text" class="x-textbox" />
    <span class="x-tipbox">@example.com</span>
</span>

<br />

<span class="x-inputgroup">
    <span class="x-tipbox">邮箱: </span>
    <input type="text" class="x-textbox" />
    <span class="x-tipbox">@example.com</span>
</span>
```


## 复选框
```htm
<span class="x-inputgroup">
    <span class="x-tipbox">
        <input type="checkbox">
    </span>
    <input type="text" class="x-textbox" />
</span>
```


## 按钮
```htm
<span class="x-inputgroup">
    <input type="text" class="x-textbox" />
    <span><button class="x-button"><span class="x-icon">&#9662;</span></button></span>
</span>
```
```htm
<span class="x-inputgroup">
    <span><button class="x-button">百度 <span class="x-icon">&#9662;</span></button></span>
    <input type="text" class="x-textbox" />
    <span><button class="x-button"><span class="x-icon">☌</span></button></span>
</span>
```


## 多个按钮
```htm
<span class="x-inputgroup">
    <input type="text" class="x-textbox" />
    <span>
        <button class="x-button">更多菜单</button>
        <button class="x-button"><span class="x-icon">&#9662;</span></button>
    </span>
</span>
```


## 占满一行

当使用 `div` 时，输入框组将占满一行。
```htm
<div class="x-inputgroup">
    <span class="x-tipbox">邮箱: </span>
    <input type="text" class="x-textbox" />
    <span>
        <button class="x-button">更多菜单</button>
    </span>
</div>
```
# 按钮组
将多个按钮组成一个整体。
<link rel="stylesheet" href="reset.scss" />
<link rel="stylesheet" href="../form/button.scss" />
<link rel="stylesheet" href="../form/buttonGroup.scss" />

        .doc-demo {
            line-height: 40px;
        }

## 基本用法
```htm
<span class="x-buttongroup">
    <a href="###" class="x-button">左</a>
    <a href="###" class="x-button">中</a>
    <a href="###" class="x-button">右</a>
</span>
<span class="x-buttongroup">
    <a href="###" class="x-button">上</a>
    <a href="###" class="x-button">中</a>
    <a href="###" class="x-button">下</a>
</span>
```


## 占满一行

当使用 `div` 时，按钮组将占满一行。
```htm
<div class="x-buttongroup">
    <a href="###" class="x-button x-button-active">左边</a>
    <a href="###" class="x-button">中间的</a>
    <a href="###" class="x-button">右边</a>
</div>
```
