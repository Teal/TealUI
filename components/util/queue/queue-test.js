define(["require", "exports", "assert", "./queue"], function (require, exports, assert, queue_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function enqueueTest() {
        var q = new queue_1.default();
        assert.equal(q.length, 0);
        q.enqueue(1);
        assert.equal(q.length, 1);
        q.enqueue(2);
        assert.equal(q.length, 2);
    }
    exports.enqueueTest = enqueueTest;
    function dequeueTest() {
        var q = new queue_1.default();
        assert.equal(q.dequeue(), undefined);
        q.enqueue(1);
        q.enqueue(2);
        q.enqueue(3);
        assert.equal(q.dequeue(), 1);
        assert.equal(q.dequeue(), 2);
        assert.equal(q.dequeue(), 3);
        assert.equal(q.dequeue(), undefined);
    }
    exports.dequeueTest = dequeueTest;
    function topTest() {
        var q = new queue_1.default();
        assert.equal(q.top, undefined);
        q.enqueue(1);
        assert.equal(q.top, 1);
        q.enqueue(2);
        assert.equal(q.top, 1);
        q.dequeue();
        assert.equal(q.top, 2);
    }
    exports.topTest = topTest;
    function emptyTest() {
        var q = new queue_1.default();
        assert.equal(q.empty, true);
        q.enqueue(1);
        assert.equal(q.empty, false);
        q.enqueue(2);
        assert.equal(q.empty, false);
        q.dequeue();
        assert.equal(q.empty, false);
        q.dequeue();
        assert.equal(q.empty, true);
        q.dequeue();
        assert.equal(q.empty, true);
    }
    exports.emptyTest = emptyTest;
    function toArrayTest() {
        assert.deepEqual(new queue_1.default().toArray(), []);
        var q = new queue_1.default();
        q.enqueue(1);
        q.enqueue(2);
        q.enqueue(3);
        assert.deepEqual(q.toArray(), [1, 2, 3]);
        assert.deepEqual(q.toString(), [1, 2, 3].toString());
        q.inspect();
    }
    exports.toArrayTest = toArrayTest;
});
//# sourceMappingURL=queue-test.js.map