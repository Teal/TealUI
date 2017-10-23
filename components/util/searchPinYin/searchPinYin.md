---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 拼音模糊搜索
模糊搜索匹配项，支持全拼和简拼搜索。

```html demo hide doc
<textarea id="input" placholder="输入所有项，一行一个。">你好
你好啊
很好
</textarea>
<input type="search" id="search" placeholder="输入搜索的内容" value="nih" />
<button onclick="output.innerHTML = searchPinYin(input.value.split('\n'), search.value, '<strong>', '</strong>').map(function (v){ return v.r; }).join('<br>')">搜索</button>
<div id="output"></div>
```