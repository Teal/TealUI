define(["require", "exports", "assert", "./object"], function (require, exports, assert, object) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function assignIfTest() {
        assert.deepEqual(object.assignIf({ a: 1 }, { b: 2 }), { a: 1, b: 2 });
    }
    exports.assignIfTest = assignIfTest;
    function getPropertyDescriptorest() {
        assert.deepEqual(object.getPropertyDescriptor({ a: 1 }, "a").value, 1);
    }
    exports.getPropertyDescriptorest = getPropertyDescriptorest;
    function insertBeforeTest() {
        var a = { a: 1 };
        object.insertBefore(a, "b", 2, "a");
        assert.deepEqual(a, { b: 2, a: 1 });
    }
    exports.insertBeforeTest = insertBeforeTest;
    function eachTest() {
        var sum = 0;
        object.each({ a: 1, b: 2 }, function (v) { sum += v; });
        assert.strictEqual(sum, 3);
        var all = "";
        object.each(["a", "b"], function (v) { all += v; });
        assert.strictEqual(all, "ab");
        var all2 = "";
        object.each(["a", "b"], function (v) { all2 += v; return false; });
        assert.strictEqual(all2, "a");
        object.each([0, 1, 2], function (n, i) {
            assert.strictEqual(i, n, "Check array iteration");
        });
        object.each([5, 6, 7], function (n, i) {
            assert.strictEqual(i, n - 5, "Check array iteration");
        });
        object.each({ name: "name", lang: "lang" }, function (n, i) {
            assert.strictEqual(i, n, "Check object iteration");
        });
        var total = 0;
        object.each([1, 2, 3], function (v, i) { total += v; });
        assert.strictEqual(total, 6, "Looping over an array");
        total = 0;
        object.each([1, 2, 3], function (v, i) { total += v; if (i == 1)
            return false; });
        assert.strictEqual(total, 3, "Looping over an array, with break");
        total = 0;
        object.each({ "a": 1, "b": 2, "c": 3 }, function (v, i) { total += v; });
        assert.strictEqual(total, 6, "Looping over an object");
        total = 0;
        object.each({ "a": 3, "b": 3, "c": 3 }, function (v, i) { total += v; return false; });
        assert.strictEqual(total, 3, "Looping over an object, with break");
        // var f = function(){};
        // f.foo = "bar";
        // object.each(f, function(v, i){
        // 	f[i] = "baz";
        // });
        // assert.strictEqual( "baz", f.foo, "Loop over a function" );
        var stylesheetCount = 0;
        object.each(document.styleSheets, function (i) {
            stylesheetCount++;
        });
        assert.ok(stylesheetCount, "should not throw an error in IE while looping over document.styleSheets and return proper amount");
    }
    exports.eachTest = eachTest;
    function forEachTest() {
        var sum = 0;
        object.forEach({ a: 1, b: 2 }, function (v) { sum += v; });
        assert.strictEqual(sum, 3);
        var all = "";
        object.forEach(["a", "b"], function (v) { all += v; });
        assert.strictEqual(all, "ab");
    }
    exports.forEachTest = forEachTest;
    function filterTest() {
        assert.deepEqual(object.filter([1, 2], function (item) { return item > 1; }), [2]);
        assert.deepEqual(object.filter({ a: 1, b: 2 }, function (item) { return item > 1; }), { b: 2 });
    }
    exports.filterTest = filterTest;
    function mapTest() {
        assert.deepEqual(object.map(["a", "b"], function (a) { return a + a; }), ["aa", "bb"]);
        assert.deepEqual(object.map({ length: 1, 0: "a" }, function (a) { return a; }), ["a"]);
        assert.deepEqual(object.map({ a: "a", b: "b" }, function (a) { return a + a; }), { a: "aa", b: "bb" });
    }
    exports.mapTest = mapTest;
    function everyTest() {
        assert.strictEqual(object.every([1, 2], function (item) { return item > 0; }), true);
        assert.strictEqual(object.every([1, 2], function (item) { return item > 1; }), false);
        assert.strictEqual(object.every([1, 2], function (item) { return item > 2; }), false);
        assert.strictEqual(object.every({ a: 1, b: 2 }, function (item) { return item > 0; }), true);
        assert.strictEqual(object.every({ a: 1, b: 2 }, function (item) { return item > 1; }), false);
        assert.strictEqual(object.every({ a: 1, b: 2 }, function (item) { return item > 2; }), false);
    }
    exports.everyTest = everyTest;
    function someTest() {
        assert.strictEqual(object.some([1, 2], function (item) { return item > 0; }), true);
        assert.strictEqual(object.some([1, 2], function (item) { return item > 1; }), true);
        assert.strictEqual(object.some([1, 2], function (item) { return item > 2; }), false);
        assert.strictEqual(object.some({ a: 1, b: 2 }, function (item) { return item > 1; }), true);
        assert.strictEqual(object.some({ a: 1, b: 2 }, function (item) { return item > 1; }), true);
        assert.strictEqual(object.some({ a: 1, b: 2 }, function (item) { return item > 2; }), false);
    }
    exports.someTest = someTest;
    function findTest() {
        assert.strictEqual(object.find([1, 2], function (item) { return item > 1; }), 2);
        assert.strictEqual(object.find({ a: 1, b: 2 }, function (item) { return item > 1; }), 2);
    }
    exports.findTest = findTest;
    function findIndexTest() {
        assert.strictEqual(object.findIndex([1, 2], function (item) { return item > 1; }), 1);
        assert.strictEqual(object.findIndex([1, 2], function (item) { return item > 2; }), -1);
        assert.strictEqual(object.findIndex({ a: 1, b: 2 }, function (item) { return item > 1; }), "b");
        assert.strictEqual(object.findIndex({ a: 1, b: 2 }, function (item) { return item > 2; }), null);
    }
    exports.findIndexTest = findIndexTest;
    function reduceTest() {
        assert.strictEqual(object.reduce([1, 2], function (x, y) { return x + y; }), 3);
        assert.strictEqual(object.reduce([1, 2], function (x, y) { return x + y; }, 10), 13);
        assert.strictEqual(object.reduce({ a: 1, b: 2 }, function (x, y) { return x + y; }), 3);
        assert.strictEqual(object.reduce({ a: 1, b: 2 }, function (x, y) { return x + y; }, 10), 13);
    }
    exports.reduceTest = reduceTest;
    function reduceRightTest() {
        assert.strictEqual(object.reduceRight([1, 2], function (x, y) { return x + y; }), 3);
        assert.strictEqual(object.reduceRight([1, 2], function (x, y) { return x + y; }, 10), 13);
        assert.strictEqual(object.reduceRight({ a: 1, b: 2 }, function (x, y) { return x + y; }), 3);
        assert.strictEqual(object.reduceRight({ a: 1, b: 2 }, function (x, y) { return x + y; }, 10), 13);
    }
    exports.reduceRightTest = reduceRightTest;
    function containsTest() {
        assert.strictEqual(object.contains([1, 2, 3], 3), true);
        assert.strictEqual(object.contains([1, 2, 3], 4), false);
        assert.strictEqual(object.contains({ a: 1, b: 2, c: 3 }, 3), true);
        assert.strictEqual(object.contains({ a: 1, b: 2, c: 3 }, 4), false);
    }
    exports.containsTest = containsTest;
    function subsetTest() {
        assert.deepEqual(object.subset({ a: 1, b: 2 }, ["a"]), { a: 1 });
    }
    exports.subsetTest = subsetTest;
    function invertTest() {
        assert.deepEqual(object.invert({ a: 1, b: 2, c: 3 }), { 1: "a", 2: "b", 3: "c" });
    }
    exports.invertTest = invertTest;
    function isObjectTest() {
        assert.strictEqual(object.isObject({}), true);
        assert.strictEqual(object.isObject(null), false);
    }
    exports.isObjectTest = isObjectTest;
    function typeTest() {
        assert.strictEqual(object.type(null), "null");
        assert.strictEqual(object.type(undefined), "undefined");
        assert.strictEqual(object.type(new Function()), "function");
        assert.strictEqual(object.type(+"a"), "number");
        assert.strictEqual(object.type(/a/), "regexp");
        assert.strictEqual(object.type([]), "array");
        assert.strictEqual(object.type(null), "null", "null");
        assert.strictEqual(object.type(undefined), "undefined", "undefined");
        assert.strictEqual(object.type(true), "boolean", "Boolean");
        assert.strictEqual(object.type(false), "boolean", "Boolean");
        assert.strictEqual(object.type(Boolean(true)), "boolean", "Boolean");
        assert.strictEqual(object.type(0), "number", "Number");
        assert.strictEqual(object.type(1), "number", "Number");
        assert.strictEqual(object.type(Number(1)), "number", "Number");
        assert.strictEqual(object.type(""), "string", "String");
        assert.strictEqual(object.type("a"), "string", "String");
        assert.strictEqual(object.type(String("a")), "string", "String");
        assert.strictEqual(object.type({}), "object", "Object");
        assert.strictEqual(object.type(/foo/), "regexp", "RegExp");
        assert.strictEqual(object.type(new RegExp("asdf")), "regexp", "RegExp");
        assert.strictEqual(object.type([1]), "array", "Array");
        assert.strictEqual(object.type(new Date()), "date", "Date");
        assert.strictEqual(object.type(new Function("return;")), "function", "Function");
        assert.strictEqual(object.type(function () { }), "function", "Function");
        assert.strictEqual(object.type(window), "object", "Window");
        assert.strictEqual(object.type(document), "object", "Document");
        assert.strictEqual(object.type(document.createElement("div")), "object", "Element");
        assert.strictEqual(object.type(document.createTextNode("foo")), "object", "TextNode");
        // !Safari
        assert.strictEqual(object.type(document.getElementsByTagName("*")), "object", "DomList");
    }
    exports.typeTest = typeTest;
    function countTest() {
        assert.strictEqual(object.count({ a: 1, b: 2 }), 2);
        assert.strictEqual(object.count([0, 1]), 2);
    }
    exports.countTest = countTest;
    function isEmptyTest() {
        assert.strictEqual(object.isEmpty(null), true);
        assert.strictEqual(object.isEmpty(undefined), true);
        assert.strictEqual(object.isEmpty(""), true);
        assert.strictEqual(object.isEmpty(" "), false);
        assert.strictEqual(object.isEmpty([]), true);
        assert.strictEqual(object.isEmpty({}), true);
    }
    exports.isEmptyTest = isEmptyTest;
    function cloneTest() {
        assert.deepEqual(object.clone({ a: 3, b: [5] }), { a: 3, b: [5] });
    }
    exports.cloneTest = cloneTest;
    function deepCloneTest() {
        assert.deepEqual(object.deepClone({ a: 3, b: [5] }), { a: 3, b: [5] });
        var arr = [];
        arr[0] = arr;
        var cloned = object.deepClone(arr);
        assert.strictEqual(cloned[0], cloned[0][0]);
    }
    exports.deepCloneTest = deepCloneTest;
    function deepCloneFastTest() {
        assert.deepEqual(object.deepCloneFast({ a: 3, b: [5] }), { a: 3, b: [5] });
    }
    exports.deepCloneFastTest = deepCloneFastTest;
    function deepEqualTest() {
        assert.strictEqual(object.deepEqual([], []), true);
        assert.strictEqual(object.deepEqual([], [0]), false);
        assert.strictEqual(object.deepEqual({ 0: 0, length: 1 }, [0]), false);
    }
    exports.deepEqualTest = deepEqualTest;
    function diffTest() {
        assert.deepEqual(object.diff({ a: 1, c: 1 }, { b: 1, c: 2 }), { left: ["a"], right: ["b"], both: ["c"] });
    }
    exports.diffTest = diffTest;
    function deepDiffTest() {
        assert.deepEqual(object.deepDiff({ a: 1, c: 1 }, { b: 1, c: 2 }), { left: ["a"], right: ["b"], both: ["c"] });
    }
    exports.deepDiffTest = deepDiffTest;
    function cleanTest() {
        assert.deepEqual(object.clean({ a: undefined, b: null, c: 3 }), { c: 3 });
    }
    exports.cleanTest = cleanTest;
    function selectTest() {
        assert.deepEqual(object.select({ a: 1, b: 2, c: 3 }, "a", "c"), { a: 1, c: 3 });
    }
    exports.selectTest = selectTest;
    function pickTest() {
        assert.strictEqual(object.pick(undefined, null, 1), 1);
    }
    exports.pickTest = pickTest;
    function keyOfTest() {
        assert.strictEqual(object.keyOf({ a: 1, b: 1 }, 1), "a");
    }
    exports.keyOfTest = keyOfTest;
    function getTest() {
        assert.strictEqual(object.get({ a: { b: 1 } }, "a.b"), 1);
    }
    exports.getTest = getTest;
    function setTest() {
        var foo = {};
        object.set(foo, "a[1].b", 2);
        assert.deepEqual(foo, { a: [undefined, { b: 2 }] });
    }
    exports.setTest = setTest;
    function setPropertyTest() {
        var A = /** @class */ (function () {
            function A() {
            }
            Object.defineProperty(A.prototype, "prop", {
                get: function () { return 1; },
                set: function (value) { object.setProperty(this, "prop", value); },
                enumerable: true,
                configurable: true
            });
            return A;
        }());
        var a = new A();
        assert.equal(a.prop, 1);
        a.prop++;
        assert.equal(a.prop, 2);
        a.prop++;
        assert.equal(a.prop, 3);
    }
    exports.setPropertyTest = setPropertyTest;
    function addCallbackTest() {
        var A = /** @class */ (function () {
            function A() {
                this.func = null;
            }
            return A;
        }());
        var c = 0;
        var a = new A();
        object.addCallback(a, "func", function () {
            assert.equal(++c, 1);
        });
        object.addCallback(a, "func", function () {
            assert.equal(++c, 2);
            return false;
        });
        object.addCallback(a, "func", function () {
            assert.equal(++c, 3);
        });
        assert.equal(a.func(), false);
    }
    exports.addCallbackTest = addCallbackTest;
    function addSetCallback() {
        var A = /** @class */ (function () {
            function A() {
                this.func = 0;
            }
            return A;
        }());
        var c = 0;
        var a = new A();
        object.addSetCallback(a, "func", function () { return c++; });
        a.func = 2;
        assert.equal(c, 1);
        object.addSetCallback(a, "func", function () { return c++; });
        a.func = 3;
        assert.equal(c, 3);
    }
    exports.addSetCallback = addSetCallback;
});
//# sourceMappingURL=object-test.js.map