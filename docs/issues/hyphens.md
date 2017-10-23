---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 单词换行后自动追加 "-"
目前浏览器实现的功能较弱，在语言为 `en` 的上下文中设置 `hyphens: manual`，然后插入 `&shy;`，如果需要浏览器会将之显示为 "-"。
```html demo
<div lang="en" style="width: 55px; -webkit-hyphens: manual; -moz-hyphens: manual; -ms-hyphens: manual; hyphens: manual;">
    An extreme&shy;ly long English word
</div>
```

> ##### 另参考
> - [`hyphens` 属性](https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens)