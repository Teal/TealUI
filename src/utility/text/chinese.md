中文处理
========================================================
@description 提供中文处理相关功能。

@doc chinese/pinYin.ts

<input type="text" id="pinyin_value" placeholder="输入中文...">
<input type="button" value="转为拼音" onclick="document.getElementById('pinyin_result').innerHTML = getPinYin(document.getElementById('pinyin_value').value || (document.getElementById('pinyin_value').value = '中文'))">
<span id="pinyin_result"></span>

> 实现原理：在源码中有一个拼音检索表，函数会检索此表得到拼音。

> 注意：不支持多音字。

@doc chinese/pinYin-gbk.ts

<input type="text" id="pinyin_gbk_value" placeholder="输入中文...">
<input type="button" value="转为拼音" onclick="document.getElementById('pinyin_gbk_result').innerHTML = getPinYin(document.getElementById('pinyin_gbk_value').value || (document.getElementById('pinyin_gbk_value').value='中文'))">
<span id="pinyin_gbk_result"></span>

> 实现原理：在源码中有一个拼音检索表，函数会检索此表得到拼音。

> 注意：不支持多音字。

@doc chinese/tradionalChinese.ts

<input type="text" id="tradionalChinese_value" placeholder="输入中文...">
<input type="button" value="转繁体" onclick="document.getElementById('tradionalChinese_value').value = TradionalChinese.toTradionalChinese(document.getElementById('tradionalChinese_value').value || '简体')">
<input type="button" value="转简体" onclick="document.getElementById('tradionalChinese_value').value = TradionalChinese.toSimpleChinese(document.getElementById('tradionalChinese_value').value || '简体')">

> 实现原理：在源码中有一个繁简字检索表，函数会检索此表得到对应繁体或简体。
