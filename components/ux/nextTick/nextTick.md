---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 下一帧执行
延时执行，类似 NodeJs 的 [`process.nextTick`](https://nodejs.org/dist/latest-v8.x/docs/api/process.html#process_process_nexttick_callback_args)。

## 什么时候需要用到 `nextTick`
`nextTick` 的意义相当于等待所有同步代码执行完成后执行指定的函数。

```js
let foo = 1;
let say = () => alert(foo);

say();          // => 1
nextTick(say);  // => 2，因为等待其它代码执行结束后再输出  
foo++;
```

如果绑定事件的代码尚未执行就直接触发事件，就会使触发失败，此时可以使用 `nextTick` 延时触发事件。

在基于 MVVM 开发的模型中，为了避免更改任一个数据就重新绑定界面，往往将绑定界面的操作延时，
这样可以一次性地更新多个数据的改变，提升绑定性能。

## `nextTick` vs `setTimeout`
`nextTick(fn)` 等价于 `setTimeout(fn, 0)`，但其性能上更高。
`nextTick` 设置的回调将比 `setTimeout` 优先执行。
