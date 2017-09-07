import * as assert from "assert";
import * as array from "./array";

export function rangeTest() {
    assert.deepEqual(array.range(0, 6), [0, 1, 2, 3, 4, 5]);
    assert.deepEqual(array.range(2, 11, 3), [2, 5, 8]);
}

export function pushIfTest() {
    const foo = [1, 9, 0];
    array.pushIf(foo, 1);
    assert.deepEqual(foo, [1, 9, 0]);
    array.pushIf(foo, 2);
    assert.deepEqual(foo, [1, 9, 0, 2]);
}

export function insertTest() {
    const foo = ["I", "you"];
    array.insert(foo, 1, "love");
    assert.deepEqual(foo, ["I", "love", "you"]);
}

export function removeTest() {
    const foo = [1, 9, 9, 0];
    assert.strictEqual(array.remove(foo, 9), 1);
    assert.deepEqual(foo, [1, 9, 0]);
    assert.strictEqual(array.remove(foo, 9), 1);
    assert.deepEqual(foo, [1, 0]);
    assert.strictEqual(array.remove(foo, 9), -1);
    assert.deepEqual(foo, [1, 0]);
}

export function removeAllTest() {
    const foo = [1, 9, 9, 0];
    array.removeAll(foo, 9);
    assert.deepEqual(foo, [1, 0]);
}

export function cleanTest() {
    const foo = ["", false, 0, undefined, null, {}];
    array.clean(foo);
    assert.deepEqual(foo, [{}]);
}

export function clearTest() {
    const foo = [1, 2];
    array.clear(foo);
    assert.deepEqual(foo, []);
}

export function swapTest() {
    const item = ["a", "b"];
    array.swap(item, 0, 1);
    assert.deepEqual(item, ["b", "a"]);
}

export function sortByTest() {
    const arr = [
        { "user": "fred", "age": 48 },
        { "user": "barney", "age": 36 },
        { "user": "fred", "age": 40 },
        { "user": "barney", "age": 34 }
    ];

    array.sortBy(arr, item => item.user, item => item.age);
    assert.deepEqual(arr, [
        { "user": "barney", "age": 34 },
        { "user": "barney", "age": 36 },
        { "user": "fred", "age": 40 },
        { "user": "fred", "age": 48 },
    ]);

    array.sortBy(arr, "user", "age");
    assert.deepEqual(arr, [
        { "user": "barney", "age": 34 },
        { "user": "barney", "age": 36 },
        { "user": "fred", "age": 40 },
        { "user": "fred", "age": 48 },
    ]);

    array.sortBy(arr, "user", item => -item.age);
    assert.deepEqual(arr, [
        { "user": "barney", "age": 36 },
        { "user": "barney", "age": 34 },
        { "user": "fred", "age": 48 },
        { "user": "fred", "age": 40 },
    ]);
}

export function sortByDescTest() {
    const arr = [
        { "user": "fred", "age": 48 },
        { "user": "barney", "age": 36 },
        { "user": "fred", "age": 40 },
        { "user": "barney", "age": 34 }
    ];

    array.sortByDesc(arr, item => item.user, item => item.age);
    assert.deepEqual(arr, [
        { "user": "fred", "age": 48 },
        { "user": "fred", "age": 40 },
        { "user": "barney", "age": 36 },
        { "user": "barney", "age": 34 },
    ]);

    array.sortByDesc(arr, "user", "age");
    assert.deepEqual(arr, [
        { "user": "fred", "age": 48 },
        { "user": "fred", "age": 40 },
        { "user": "barney", "age": 36 },
        { "user": "barney", "age": 34 },
    ]);

    array.sortByDesc(arr, "user", item => -item.age);
    assert.deepEqual(arr, [
        { "user": "fred", "age": 40 },
        { "user": "fred", "age": 48 },
        { "user": "barney", "age": 34 },
        { "user": "barney", "age": 36 },
    ]);
}

export function shuffleTest() {
    const foo = [1, 2];
    array.shuffle(foo);
    assert.strictEqual(foo[0] + foo[1], 3);
}

export function itemTest() {
    assert.strictEqual(array.item(["a", "b"], 0), "a");
    assert.strictEqual(array.item(["a", "b"], -1), "b");
}

export function pickTest() {
    assert.strictEqual(array.pick([undefined, null, 1, 2]), 1);
}

export function randomTest() {
    const item = array.random([1, 2, 3]);
    assert.ok(item === 1 || item === 2 || item === 3);
}

export function countTest() {
    assert.strictEqual(array.count(["a", "b"], "a"), 1);
}

export function isUniqueTest() {
    assert.strictEqual(array.isUnique([1, 9, 0]), true);
    assert.strictEqual(array.isUnique([1, 9, 9, 0]), false);
}

export function uniqueTest() {
    assert.deepEqual(array.unique([1, 9, 9, 0]), [1, 9, 0]);
}

export function flattenTest() {
    assert.deepEqual(array.flatten([[1, 2], [[[3]]]]), [1, 2, 3]);
}

export function subTest() {
    assert.deepEqual(array.sub([1, 2], [1]), [2]);
}

export function permuteTest() {
    assert.deepEqual(array.permute([1, 2, 3]), [
        [1, 2, 3],
        [1, 3, 2],
        [2, 1, 3],
        [2, 3, 1],
        [3, 1, 2],
        [3, 2, 1]
    ]);
}

export function associateTest() {
    assert.deepEqual(array.associate([1, 2], ["a", "b"]), { a: 1, b: 2 });
}

export function invokeTest() {
    assert.deepEqual(array.invoke(["I", "you"], "length"), [1, 3]);
}

export function selectTest() {
    assert.deepEqual(array.select([
        { "user": "fred", "age": 48 },
        { "user": "barney", "age": 36 },
        { "user": "fred", "age": 40 },
        { "user": "barney", "age": 34 }
    ], item => item.user), ["fred", "barney", "fred", "barney"]);
    assert.deepEqual(array.select([
        { "user": "fred", "age": 48 },
        { "user": "barney", "age": 36 },
        { "user": "fred", "age": 40 },
        { "user": "barney", "age": 34 }
    ], "user"), ["fred", "barney", "fred", "barney"]);
}

export function minTest() {
    assert.strictEqual(array.min([1, 2]), 1);
}

export function maxTest() {
    assert.strictEqual(array.max([1, 2]), 2);
}

export function sumTest() {
    assert.strictEqual(array.sum([1, 2]), 3);
}

export function avgTest() {
    assert.strictEqual(array.avg([1, 2]), 1.5);
}
