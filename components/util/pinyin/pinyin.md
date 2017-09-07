---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 汉字转拼音
查询汉字对应的拼音。

```html demo doc hide
<input type="text" id="input" placeholder="输入中文" value="中文" />
<button onclick="input.value = getPinYin(input.value).map(x=>x.join('|')).join(' ')">转为拼音</button>
```

> ##### (!)仅支持简体中文
> 如果需要支持繁体参考[[util/pinyin/pinyin-gbk]]。
> 如果需要支持音调和多音字自动识别请参考[Node: Pinyin](https://www.npmjs.com/package/pinyin)、[Node: fast-pinyin](https://www.npmjs.com/package/fast-pinyin)。

> ##### (i)实现原理
> 在源码中有一个拼音检索表，函数会检索此表查询拼音。
