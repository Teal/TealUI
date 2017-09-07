---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 文件上传域

## 基本用法

```htm
<FileUpload />
```
# 文件上传域
文件上传域，可用于选择文件。
<link rel="stylesheet" href="reset.scss" />
<link rel="stylesheet" href="../form/button.scss" />
<link rel="stylesheet" href="../form/fileUpload.scss" />
<link rel="stylesheet" href="../form/textBox.scss" />

## 原生风格
```htm
<input type="file" size="1" name="upload">
```


## 美化效果
```htm
<span class="x-fileupload">
    <input type="file" size="1" name="upload">
    <button class="x-button">浏览...</button>
</span>
```


## 文本框绑定
```htm
请选择文件：
<span class="x-fileupload">
    <input type="file" size="1" name="upload" onchange="document.getElementById('fileUpload1').value=this.value">
    <button class="x-button">浏览...</button>
</span>
<input type="text" class="x-textbox" readonly="readonly" id="fileUpload1" />
```


## 自动绑定
```htm
请选择文件：
<span class="x-fileupload" x-role="fileUpload">
    <input type="file" size="1" name="upload">
    <button class="x-button">浏览...</button>
</span>
<input type="text" class="x-textbox" readonly="readonly" />
```
