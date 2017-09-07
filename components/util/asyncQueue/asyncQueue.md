---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 异步队列
串联异步任务，确保两个操作不会同时执行以避免临界资源冲突。

## 基本用法
不同于 `Promise`，`AsyncQueue` 是可以反复设置状态的。
要管理多个异步任务只需一个 `AsyncQueue` 示例。

```js
var deferred = new AsyncQueue();

// 添加一个异步任务。
deferred.then(function () {

    // 挂起等待。
    deferred.suspend();

    // 使用 setTimeout 模拟异步执行的操作。
    setTimeout(function () {

        // 恢复执行、
        deferred.resume(1);
    }, 1000);
});

// 添加一个同步任务。
deferred.then(function (data) {
    console.log('所有异步操作完成。返回的数据：' + data);
});
```