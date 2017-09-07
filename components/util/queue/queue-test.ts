import * as assert from "assert";
import Queue from "./queue";

export namespace queueTest {

    export function enqueueTest() {
        const q = new Queue<number>();
        assert.equal(q.length, 0);
        q.enqueue(1);
        assert.equal(q.length, 1);
        q.enqueue(2);
        assert.equal(q.length, 2);
    }

    export function emptyTest() {
        const q = new Queue<number>();
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

    export function topTest() {
        const q = new Queue<number>();
        assert.equal(q.top, undefined);
        q.enqueue(1);
        assert.equal(q.top, 1);
        q.enqueue(2);
        assert.equal(q.top, 1);
        q.dequeue();
        assert.equal(q.top, 2);
    }

    export function dequeueTest() {
        const q = new Queue<number>();
        assert.equal(q.dequeue(), undefined);
        q.enqueue(1);
        q.enqueue(2);
        q.enqueue(3);
        assert.equal(q.dequeue(), 1);
        assert.equal(q.dequeue(), 2);
        assert.equal(q.dequeue(), 3);
        assert.equal(q.dequeue(), undefined);
    }

    export function toArrayTest() {
        assert.deepEqual(new Queue<number>().toArray(), []);
        const q = new Queue<number>();
        q.enqueue(1);
        q.enqueue(2);
        q.enqueue(3);
        assert.deepEqual(q.toArray(), [1, 2, 3]);
        assert.deepEqual(q.toString(), [1, 2, 3].toString());
        (q as any).inspect();
    }

}
