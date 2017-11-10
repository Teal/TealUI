define(["require", "exports", "assert", "./rect"], function (require, exports, assert, drawing) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function inRectTest() {
        assert.deepEqual(drawing.inRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: 20 }), false);
        assert.deepEqual(drawing.inRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5 }), true);
        assert.deepEqual(drawing.inRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 0, y: 0 }), true);
    }
    exports.inRectTest = inRectTest;
    function onRectTest() {
        assert.deepEqual(drawing.onRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: 20 }), false);
        assert.deepEqual(drawing.onRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5 }), false);
        assert.deepEqual(drawing.onRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 0, y: 0 }), true);
        assert.deepEqual(drawing.onRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 0, y: 3 }), true);
        assert.deepEqual(drawing.onRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 0, y: 22 }), false);
    }
    exports.onRectTest = onRectTest;
    function offsetRectTest() {
        assert.deepEqual(drawing.offsetRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 20 }), { x: 10, y: 20, width: 10, height: 10 });
    }
    exports.offsetRectTest = offsetRectTest;
    function intersectRectTest() {
        assert.deepEqual(drawing.intersectRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 }), { x: 5, y: 5, width: 5, height: 5 });
        assert.deepEqual(drawing.intersectRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 11, y: 11, width: 10, height: 10 }), { x: 0, y: 0, width: 0, height: 0 });
    }
    exports.intersectRectTest = intersectRectTest;
    function unionRectTest() {
        assert.deepEqual(drawing.unionRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 }), { x: 0, y: 0, width: 15, height: 15 });
        assert.deepEqual(drawing.unionRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 2, height: 2 }), { x: 0, y: 0, width: 10, height: 10 });
        assert.deepEqual(drawing.unionRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 15, y: 15, width: 10, height: 10 }), { x: 0, y: 0, width: 25, height: 25 });
    }
    exports.unionRectTest = unionRectTest;
    function inCircleTest() {
        assert.deepEqual(drawing.inCircle({ x: 2, y: 2, r: 1 }, { x: 2, y: 2 }), true);
        assert.deepEqual(drawing.inCircle({ x: 2, y: 2, r: 1 }, { x: 3, y: 2 }), true);
        assert.deepEqual(drawing.inCircle({ x: 2, y: 2, r: 1 }, { x: 4, y: 2 }), false);
        assert.deepEqual(drawing.inCircle({ x: 2, y: 2, r: 1 }, { x: 3, y: 3 }), false);
    }
    exports.inCircleTest = inCircleTest;
    function onCircleTest() {
        assert.deepEqual(drawing.onCircle({ x: 2, y: 2, r: 1 }, { x: 3, y: 2 }), true);
        assert.deepEqual(drawing.onCircle({ x: 2, y: 2, r: 1 }, { x: 2, y: 2 }), false);
        assert.deepEqual(drawing.onCircle({ x: 2, y: 2, r: 1 }, { x: 4, y: 2 }), false);
        assert.deepEqual(drawing.onCircle({ x: 2, y: 2, r: 1 }, { x: 3, y: 3 }), false);
    }
    exports.onCircleTest = onCircleTest;
});
//# sourceMappingURL=rect-test.js.map