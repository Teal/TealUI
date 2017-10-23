---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 计划时间
解析 CRON 表达式实现计划任务。

## 基本用法
```js
import cronJob from "util/cron";

// 每月 5 号凌晨执行一次任务。
var job = cronJob("0 0 5 * *", () => {
    console.log("tick");
});

// 停用任务：
// job.stop();
```

> ##### [!]限制
> 1. 仅支持标准格式。不支持 L、W、C 等扩展语法。
> 2. 星期天使用 0 表示，不支持使用 7 表示。
> 3. 不支持超时超过 2147483647ms 的计划任务。
> 4. 不支持时区。

> ##### 另参考
> [Cron](https://en.wikipedia.org/wiki/Cron)