---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 强制打开
防止新开窗口被浏览器拦截。

```html demo doc
<button onclick="forceOpen('http://tealui.com/')">强制打开网页</button>
```

> ##### (i)原理
> 默认地，在点击事件中新开窗口不会被浏览器拦截。
> 如果发现新窗口被拦截，则捕获首次点击事件强制打开页面。
