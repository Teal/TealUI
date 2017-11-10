define(["require", "exports", "assert", "./sort"], function (require, exports, assert, sort) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function bubbleSortTest() {
        var arr = [1, 3, 5, 4, 3];
        sort.bubbleSort(arr);
        assert.deepEqual(arr, [1, 3, 3, 4, 5]);
    }
    exports.bubbleSortTest = bubbleSortTest;
    function quickSortTest() {
        var arr = [1, 3, 5, 4, 3];
        sort.quickSort(arr);
        assert.deepEqual(arr, [1, 3, 3, 4, 5]);
    }
    exports.quickSortTest = quickSortTest;
    function shellSortTest() {
        var arr = [1, 3, 5, 4, 3];
        sort.shellSort(arr);
        assert.deepEqual(arr, [1, 3, 3, 4, 5]);
    }
    exports.shellSortTest = shellSortTest;
});
//# sourceMappingURL=sort-test.js.map