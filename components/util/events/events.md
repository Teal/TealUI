---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 事件
提供事件管理对象。

事件是一种设计模式。
程序可以通过触发事件的方式通知外部。
对此通知感兴趣的对象可以订阅事件并执行相应的回调函数。
通过事件的设计模式可以将触发事件和实际处理事件的逻辑完全分开，提升代码的可重用性。

> ##### 另参考
> [Node.js: Event](https://nodejs.org/api/events.html)