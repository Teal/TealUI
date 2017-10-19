define(["require", "exports", "assert", "./asyncQueue"], function (require, exports, assert, asyncQueue_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function defferableTest(done) {
        var deferred = new asyncQueue_1.default();
        // 添加一个异步任务。
        deferred.then(function () {
            // 挂起等待。
            deferred.suspend();
            // 使用 setTimeout 模拟异步执行的操作。
            setTimeout(function () {
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
    exports.defferableTest = defferableTest;
});
//# sourceMappingURL=asyncQueue-test.js.map