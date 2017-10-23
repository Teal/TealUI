---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 下一帧执行
延时执行，类似 NodeJs 的 [`process.nextTick`](https://nodejs.org/dist/latest-v8.x/docs/api/process.html#process_process_nexttick_callback_args)。

## 什么时候需要 `nextTick`
`nextTick` 的意义相当于等待所有同步代码执行完成后执行指定的函数。
```js
var foo = 1;
nextTick(() => {
    console.log(foo);       // => 2，因为等待其它代码执行结束后再输出  
});  
foo++;
```

有时为了确保事件先绑定再触发，就需要用 `nextTick` 延时触发事件。

在基于 MVVM 开发的模型中，为了避免更改任一个数据就重新渲染界面，往往将渲染界面的操作延时，
这样可以一次更新多个数据，但只渲染一次界面。

## `nextTick` vs `setTimeout`
`nextTick(fn)` 等价于 `setTimeout(fn, 0)`，但其性能上更高。
`nextTick` 设置的回调将比 `setTimeout(fn, 0)` 优先执行。

> ##### 另参考
> - [`process.nextTick`](https://nodejs.org/dist/latest-v8.x/docs/api/process.html#process_process_nexttick_callback_args)
> - [`window.setImmediate`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setImmediate)