## HTML 编码

<script x-doc="utility/text/html.js">Doc.writeApi({ path: "utility/text/html.js", apis: [{ name: "encodeHTML", summary: "<p>编码 HTML 特殊字符。</p>", params: [{ type: "String", name: "str", summary: "<p>要编码的字符串。</p>" }], returns: { type: "String", summary: "<p>返回已编码的字符串。</p>" }, remark: "<p>此函数主要将 &amp; &lt; > &#8217; &#8221; 分别编码成 &amp; &lt; &gt; &#39; &quot; 。</p>", example: "<pre>encodeHTML(\"&lt;a&gt;&lt;/a&gt;\") // &amp;lt;a&amp;gt;&amp;lt;/a&amp;gt;</pre>", line: 4, col: 1 }, { name: "encodeHTMLAttribute", summary: "<p>编码 HTML 属性特殊字符。</p>", params: [{ type: "String", name: "str", summary: "<p>要编码的字符串。</p>" }], returns: { type: "String", summary: "<p>返回已编码的字符串。</p>" }, remark: "<p>此函数主要将 &#8217; &#8221; 分别编码成 &#39; &quot; 。</p>", example: "<pre>encodeHTML(\"'\") // &amp;#39;</pre>", line: 27, col: 1 }, { name: "decodeHTML", summary: "<p>解码 HTML 特殊字符。</p>", params: [{ type: "String", name: "str", summary: "<p>要解码的字符串。</p>" }], returns: { type: "String", summary: "<p>返回已解码的字符串。</p>" }, example: "<pre>decodeHTML(\"&lt;a&gt;&lt;/a&gt;\") // &amp;lt;a&amp;gt;&amp;lt;/a&amp;gt;</pre>", line: 47, col: 1 }] });</script>

## UTF8 编码

<input type="text" id="utf8_value" value="你好"> <input type="button" value="UTF8 编码" onclick=" document.getElementById('utf8_value').value = encodeUTF8(document.getElementById('utf8_value').value)"> <input type="button" value="UTF8 解码" onclick=" document.getElementById('utf8_value').value = decodeUTF8(document.getElementById('utf8_value').value)">

<script x-doc="utility/text/utf8.js">Doc.writeApi({ path: "utility/text/utf8.js", apis: [{ name: "encodeUTF8", summary: "<p>对指定的字符串进行 UTF-8 编码。</p>", params: [{ type: "String", name: "str", summary: "<p>要转换的字符串。</p>" }], returns: { type: "String", summary: "<p>转换后的字符串。</p>" }, example: "<pre>encodeUTF8(\"你\") // \"\\u4f60\"</pre>", line: 7, col: 1 }, { name: "decodeUTF8", summary: "<p>对指定的字符串进行 UTF-8 解码。</p>", params: [{ type: "String", name: "str", summary: "<p>要转换的字符串。</p>" }], returns: { type: "String", summary: "<p>转换后的字符串。</p>" }, example: "<pre>decodeUTF8(\"\\u4f60\") // \"你\"</pre>", line: 26, col: 1 }] });</script>

## GB2312 编码

<input type="text" id="gb2312_value" value="你好"> <input type="button" value="GB2312 编码" onclick=" document.getElementById('gb2312_value').value = encodeGB2312(document.getElementById('gb2312_value').value)"> <input type="button" value="GB2312 解码" onclick=" document.getElementById('gb2312_value').value = decodeGB2312(document.getElementById('gb2312_value').value)">

<script x-doc="utility/text/gb2312.js">Doc.writeApi({ path: "utility/text/gb2312.js", apis: [{ name: "encodeGB2312", summary: "<p>对指定的字符串进行 GB2312 编码。</p>", params: [{ type: "String", name: "str", summary: "<p>要转换的字符串。</p>" }], returns: { type: "String", summary: "<p>转换后的字符串。</p>" }, example: "<pre>encodeGB2312(\"你\") // \"%C4%E3\"</pre>", line: 6, col: 1 }, { name: "decodeGB2312", summary: "<p>对指定的字符串进行 GB2312 解码。</p>", params: [{ type: "String", name: "str", summary: "<p>要转换的字符串。</p>" }], returns: { type: "String", summary: "<p>转换后的字符串。</p>" }, example: "<pre>decodeGB2312(\"%C4%E3\") // \"你\"</pre>", line: 35, col: 1 }] });</script>

## Base64 编码

输入英文: <input type="text" id="base64_value" value="abcefg"> <input type="button" value="Base64 编码" onclick="document.getElementById('base64_value').value = btoa(document.getElementById('base64_value').value)"> <input type="button" value="Base64 解码" onclick="document.getElementById('base64_value').value = atob(document.getElementById('base64_value').value)">

<script x-doc="utility/text/base64.js">Doc.writeApi({ path: "utility/text/base64.js", apis: [{ name: "btoa", summary: "<p>Base64 解码。</p>", params: [{ type: "String", name: "str", summary: "<p>要转换的文本。</p>" }], returns: { type: "String", summary: "<p>转换后的文本。</p>" }, see: ["https://gist.github.com/999166"], author: "https://github.com/nignag", example: "<pre>btoa(\"abcefg\")</pre>", since: "ES4", line: 15, col: 1 }, { name: "atob", summary: "<p>Base64 编码。</p>", params: [{ type: "String", name: "str", summary: "<p>要转换的文本。</p>" }], returns: { type: "String", summary: "<p>转换后的文本。</p>" }, see: ["https://gist.github.com/1020396"], author: "https://github.com/atk", example: "<pre>atob(\"abcefg\")</pre>", since: "ES4", line: 42, col: 1 }] });</script>

> 目前主流浏览器已内置此 btoa/atob。