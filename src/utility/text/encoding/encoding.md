编码转换
========================================================
@description 提供字符串编码和转码功能。

HTML 编码
--------------------------------------------------------
@doc encoing/encodeHTML
@doc encoing/encodeHTMLAttribute
@doc encoing/decodeHTML

<input type="text" id="html_value" placeholder="输入 HTML 片段..." />
<input type="button" value="HTML 编码" onclick="document.getElementById('html_value').value = encodeHTML(document.getElementById('html_value').value || '<html>')" />
<input type="button" value="HTML 属性编码" onclick="document.getElementById('html_value').value = encodeHTMLAttribute(document.getElementById('html_value').value || '<html>')" />
<input type="button" value="HTML 解码" onclick="document.getElementById('html_value').value = decodeHTML(document.getElementById('html_value').value || '<html>')" />

UTF8 编码
--------------------------------------------------------
@doc encoing/encodeUTF8
@doc encoing/decodeUTF8

<input type="text" id="utf8_value" placeholder="输入任意文本..." />
<input type="button" value="UTF8 编码" onclick="document.getElementById('utf8_value').value = encodeUTF8(document.getElementById('utf8_value').value || '你好')" />
<input type="button" value="UTF8 解码" onclick="document.getElementById('utf8_value').value = decodeUTF8(document.getElementById('utf8_value').value || '你好')" />

GB2312 编码
--------------------------------------------------------
@doc encoing/encodeGB2312
@doc encoing/decodeGB2312

## GB2312 编码

<input type="text" id="gb2312_value" placeholder="输入任意文本...">
<input type="button" value="GB2312 编码" onclick="document.getElementById('gb2312_value').value = encodeGB2312(document.getElementById('gb2312_value').value || '你好')">
<input type="button" value="GB2312 解码" onclick="document.getElementById('gb2312_value').value = decodeGB2312(document.getElementById('gb2312_value').value || '你好')">

Base64 编码
--------------------------------------------------------
@doc encoing/btoa
@doc encoing/atob
@doc encoing/encodeBase64
@doc encoing/decodeBase64

<input type="text" id="gb2312_value" placeholder="输入任意文本...">
<input type="button" value="Base64 编码(仅支持英文)" onclick="document.getElementById('gb2312_value').value = btoa(document.getElementById('gb2312_value').value || '你好')">
<input type="button" value="Base64 解码(仅支持英文)" onclick="document.getElementById('gb2312_value').value = atob(document.getElementById('gb2312_value').value || '你好')">
<input type="button" value="Base64 编码" onclick="document.getElementById('gb2312_value').value = encodeBase64(document.getElementById('gb2312_value').value || '你好')">
<input type="button" value="Base64 解码" onclick="document.getElementById('gb2312_value').value = decodeBase64(document.getElementById('gb2312_value').value || '你好')">

> 提示：除了 IE6-7 其它浏览器已内置 btoa/atob。