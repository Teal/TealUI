import * as assert from "assert";
import * as sort from "./sort";

export function bubbleSortTest() {
    const arr = [1, 3, 5, 4, 3];
    sort.bubbleSort(arr);
    assert.deepEqual(arr, [1, 3, 3, 4, 5]);
}

export function quickSortTest() {
    const arr = [1, 3, 5, 4, 3];
    sort.quickSort(arr);
    assert.deepEqual(arr, [1, 3, 3, 4, 5]);
}

export function shellSortTest() {
    const arr = [1, 3, 5, 4, 3];
    sort.shellSort(arr);
    assert.deepEqual(arr, [1, 3, 3, 4, 5]);
}
