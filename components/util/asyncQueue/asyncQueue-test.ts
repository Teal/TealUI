import * as assert from "assert";
import AsyncQueue from "./asyncQueue";

export function defferableTest(done: Function) {
    const deferred = new AsyncQueue();

    // 添加一个异步任务。
    deferred.then(() => {

        // 挂起等待。
        deferred.suspend();

        // 使用 setTimeout 模拟异步执行的操作。
        setTimeout(() => {

            // 恢复执行、
            deferred.resume(1);
        });
    });

    // 添加一个同步任务。
    deferred.then(function (data) {
        assert.equal(data, 1);
        done();
    });
}
