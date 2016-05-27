<link rel="stylesheet" type="text/css" href="../form/textBox.css">

## 原生风格

<aside class="doc-demo"><input type="file" size="1" name="upload"></aside>

## 美化效果

<aside class="doc-demo"><span class="x-fileupload"><input type="file" size="1" name="upload"> <button class="x-button">浏览...</button></span> </aside>

## 文本框绑定

<aside class="doc-demo">请选择文件： <span class="x-fileupload"><input type="file" size="1" name="upload" onchange="document.getElementById('fileUpload1').value=this.value"> <button class="x-button">浏览...</button> </span> <input type="text" class="x-textbox" readonly="readonly" id="fileUpload1"></aside>

## 自动绑定

<aside class="doc-demo">请选择文件： <span class="x-fileupload" x-role="fileUpload"><input type="file" size="1" name="upload"> <button class="x-button">浏览...</button> </span> <input type="text" class="x-textbox" readonly="readonly"></aside>