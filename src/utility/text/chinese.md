## 中文（简体）转拼音

输入中文: <input type="text" id="pinyin_value" value="中文"> <input type="button" value="转为拼音" onclick="document.getElementById('pinyin_result').innerHTML = getPinYin(document.getElementById('pinyin_value').value)"> <span id="pinyin_result"></span>

<script x-doc="utility/text/pinYin.js">Doc.writeApi({ path: "utility/text/pinYin.js", apis: [{ name: "getPinYin", summary: "<p>根据简体中文获取拼音。</p>", params: [{ type: "String", name: "value", summary: "<p>要获取的中文。</p>" }, { type: "Boolean", name: "firstLetterOnly", defaultValue: "false", optional: true, summary: "<p>如果为 <strong>true</strong> 则只获取首字母，否则获取全拼。</p>" }, { type: "String", name: "joinChar", defaultValue: "' '", optional: true, summary: "<p>用于连接各组成部分的字符。如果设置为 null，则不连接。</p>" }], returns: { type: "String", summary: "<p>返回结果拼音字符串。如果 <em>joinChar</em> 为 null 则返回数组。</p>" }, example: "<pre>getPinYin(\"你好\") // \"Ni Hao\"</pre>", line: 6, col: 1 }] });</script>

> #### 实现原理
> 
> 在库文件中有一个拼音字母表，函数会查询此表并返回对应拼音。

> #### 注意
> 
> 不支持多音字。

## 中文（繁体）转拼音

输入中文: <input type="text" id="pinyin_gbk_value" value="中文"> <input type="button" value="转为拼音" onclick="document.getElementById('pinyin_gbk_result').innerHTML = getPinYin(document.getElementById('pinyin_gbk_value').value)"> <span id="pinyin_gbk_result"></span>

<script x-doc="utility/text/pinYin-gbk.js">Doc.writeApi({ path: "utility/text/pinYin-gbk.js", apis: [{ name: "getPinYin", summary: "<p>根据繁体中文获取拼音。</p>", params: [{ type: "String", name: "value", summary: "<p>要获取的中文。</p>" }, { type: "Boolean", name: "firstLetterOnly", defaultValue: "false", optional: true, summary: "<p>如果为 <strong>true</strong> 则只获取首字母，否则获取全拼。</p>" }, { type: "String", name: "joinChar", defaultValue: "' '", optional: true, summary: "<p>用于连接各组成部分的字符。如果设置为 null，则不连接。</p>" }], returns: { type: "String", summary: "<p>返回结果拼音字符串。如果 <em>joinChar</em> 为 null 则返回数组。</p>" }, example: "<pre>getPinYin(\"你好\") // \"Ni Hao\"</pre>", line: 6, col: 1 }] });</script>

> #### 实现原理
> 
> 在库文件中有一个拼音字母表，函数会查询此表并返回对应拼音。

> #### 注意
> 
> 不支持多音字。

## 中文简繁体转换

输入中文: <input type="text" id="tradionalChinese_value" value="中文简繁体转换"> <input type="button" value="转繁体" onclick="document.getElementById('tradionalChinese_value').value = TradionalChinese.toTradionalChinese(document.getElementById('tradionalChinese_value').value)"> <input type="button" value="转简体" onclick="document.getElementById('tradionalChinese_value').value = TradionalChinese.toSimpleChinese(document.getElementById('tradionalChinese_value').value)">

<script x-doc="utility/text/tradionalChinese.js">Doc.writeApi({ path: "utility/text/tradionalChinese.js", apis: [{ memberOf: "TradionalChinese", name: "toTradionalChinese", summary: "<p>将简体中文转为繁体中文。</p>", params: [{ type: "String", name: "value", summary: "<p>要处理的中文。</p>" }], returns: { type: "String", summary: "<p>返回转换后的中文。</p>" }, example: "<pre>TradionalChinese.toTradionalChinese(\"简\") // \"簡\"</pre>", line: 28, col: 1 }, { memberOf: "TradionalChinese", name: "toSimpleChinese", summary: "<p>将繁体中文转为简体中文。</p>", params: [{ type: "String", name: "value", summary: "<p>要处理的中文。</p>" }], returns: { type: "String", summary: "<p>返回转换后的中文。</p>" }, example: "<pre>TradionalChinese.toSimpleChinese(\"簡\") // \"简\"</pre>", line: 38, col: 1 }] });</script>

> #### 实现原理
> 
> 在库文件中有一个繁简字数据表，函数会查询此表并返回对应繁体/简体。