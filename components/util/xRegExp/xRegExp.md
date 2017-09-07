---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 正则表达式扩展
扩展更多功能的正则表达式。

```js
var date = XRegExp('(?&lt;year>  [0-9]{4} ) -?  # year  \n' +
        '(?&lt;month> [0-9]{2} ) -?  # month \n' +
        '(?&lt;day>   [0-9]{2} )     # day     ', 'x');

XRegExp.exec('2012-06-10', date).year; // => '2012'

XRegExp.replace('2012-06-10', date, '${month}/${day}/${year}'); // => '06/10/2012'

XRegExp.matchChain('&lt;a href="http://xregexp.com/api/">XRegExp&lt;/a>&lt;a href="http://www.google.com/">Google&lt;/a>', [
    {regex: /&lt;a href="([^"]+)">/i, backref: 1},
    {regex: XRegExp('(?i)^https?://(?&lt;domain>[^/?#]+)'), backref: 'domain'}
]); // => ['xregexp.com', 'www.google.com']
```

> ##### 另参考
> - [XRegExp 官网](http://xregexp.com/)
