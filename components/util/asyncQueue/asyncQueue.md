---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 异步队列
统一管理异步任务，确保所有异步任务有序执行。

## 基本用法
`AsyncQueue` 就像是一个密室，每个任务函数都可以通过 [`then()`](#api/AsyncQueue/then) 按顺序进入密室执行。
```js
import AsyncQueue from "util/asyncQueue";

var deferred = new AsyncQueue();    // 创建新的异步队列。

deferred.then(() => {               // 添加一个任务。
    console.log("A");
});

deferred.then(() => {               // 再添加一个任务。这个任务会等待上个任务。
    console.log("B");
});

deferred.then(() => {               // 再添加一个任务。这个任务会等待上个任务。
    console.log("C");
});
```

正在执行的函数可以通过 [`suspend()`](#api/AsyncQueue/suspend) 关上密室的门，这时其它任务函数都会进入等待状态。
当函数通过 [`resume()`](#api/AsyncQueue/resume) 打开密室的门后，下一个任务函数再进入密室执行。
```js {11-14}
import AsyncQueue from "util/asyncQueue";

var deferred = new AsyncQueue();

deferred.then(() => {
    console.log("A");
});

deferred.then(() => {
    console.log("B");
    deferred.suspend();             // 挂起队列，其它任务将开始等待。
    setTimeout(() => { 
        deferred.resume();          // 1 秒后：恢复队列，即执行下一个任务。
    }, 1000);
});

deferred.then(() => {
    console.log("C");
});
```

## 传递数据
上一个任务函数可通过 [`resume()`](#api/AsyncQueue/resume) 传递一个数据给下一个任务函数。
```js {13,18}
import AsyncQueue from "util/asyncQueue";

var deferred = new AsyncQueue();

deferred.then(() => {
    console.log("A");
});

deferred.then(() => {
    console.log("B");
    deferred.suspend();
    setTimeout(() => { 
        deferred.resume(1);         // 传递数据 1。
    }, 1000);
});

deferred.then(data => {
    console.log("C", data);         // 此处 data 为 1。
});
```

## 插队
除了让新任务等待当前正在执行的任务，还可以通过 [`then()`](#api/AsyncQueue/then) 的[第二参数](#api/AsyncQueue/then)让新任务插队执行。

比如现在正在执行将方块从 A 点移动到 B 点的动画，
如果此时需求改成从 A 点移动到 C 点，那么应该立即终止 A 点移动到 B 点的动画转而移向 C 点。

被插队的任务可能会被强制终止执行。
但不是所有任务都能强制终止的，如果一个任务希望支持强制终止，必须在 [`suspend()`](#api/AsyncQueue/suspend) 传递一个对象，可通过调用其 [`abort()`](#api/Abortable/abort) 方法来强制终止任务。

```html demo {15-18} doc
<button onclick="move(box, -offset.value)">左移</button>
<input type="number" id="offset" value="200" style="width: 6rem;">
<button onclick="move(box, +offset.value)">右移</button>
<div id="box" class="doc-box" style="position: relative; left: 300px;"></div>
<script>
    import AsyncQueue from "util/asyncQueue";

    var deferred = new AsyncQueue();

    export function move(box, delta) {
        var y = parseInt(box.style.left) + delta;           // 计算最终位置。

        deferred.then(() => {
            deferred.suspend({                              // 挂起队列，避免方块同时执行多个动画函数。
                abort(){                                    // 提供一个对象，使得当前动画可被终止。
                    clearInterval(timer);
                    deferred.resume();
                }
            });

            var current = parseInt(box.style.left);         // 计算初始位置。
            var timer = setInterval(() => {                 
                if (current < y) {                          // 移动方块，每次移动 1 像素。
                    current++;
                } else {
                    current--;
                }
                if (current == y) {                         // 已经移到最终位置，停止动画。
                    clearInterval(timer);
                    deferred.resume();
                } else {
                    box.style.left = current + "px";
                }
            }, 20);
        }, "abort");                                        // 如果在动画期间用户又设置了新终点，则需要终止当前的动画。

        deferred.then(() => {
            box.className += " doc-box-blue";
        });
    }
</script>
```

## `AsyncQueue` vs `Promise`
`AsyncQueue` 和 `Promise` 都用于解决异步任务并发的问题。

但它们解决问题的思路不同：

`Promise` 类似多米诺骨牌。
每个 `Promise` 对象都有一个状态，当 `Promise` 对象状态切换为已完成后，
它将执行所有通过 `then()` 添加的回调函数，并将状态传递给下一个 `Promise` 对象，
以此确保所有回调函数都是按顺序执行的。

`AsyncQueue` 类似排队。
`AsyncQueue` 统一管理了队列内所有回调函数并一一通知执行。

如果程序中只需确保函数的执行顺序，建议使用更灵活的 `Promise`。
如果程序需要人工干预等待列表（如插队执行），需要使用 `AsyncQueue`。

`AsyncQueue` 和  `Promise` 对象可以互相转换：
```js
function asyncQueueToPromise(asyncQueue) { 
    return new Promise(resolve => {
        asyncQueue.then(resolve);
    });
}

function promiseToAsyncQueue(promise) {
    const asyncQueue = new AsyncQueue();
    asyncQueue.suspend();
    promise.then(() => {
        asyncQueue.resume();
    });
    return asyncQueue;
}
```
