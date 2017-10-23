---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 倒计时
实现倒计时和正计时效果。

## 倒计时
```js demo
import countDown from "web/countDown";

countDown(new Date('2020/1/1'), (days, hours, minutes, seconds, total) => {
    __root__.innerHTML = `还有${days}天${hours}小时${minutes}分${seconds}秒`;
});
```

## 隐藏天数
```js demo
import countDown from "web/countDown";

countDown(new Date('2020/1/1'), (days, hours, minutes, seconds, total) => {
    __root__.innerHTML = `还有${+days * 24 + +hours}小时${minutes}分${seconds}秒`;
});
```

## 正计时
```js demo
import { countUp } from "web/countDown";

countUp(new Date('2011/8/12'), (years, days, hours, minutes, seconds, total) => {
    __root__.innerHTML = `TealUI 已发布：${years}年${days}天${hours}小时${minutes}分${seconds}秒`;
});
```
