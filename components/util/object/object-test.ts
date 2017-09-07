import * as assert from "assert";
import * as object from "./object";

export function assignIfTest() {
    assert.deepEqual(object.assignIf({ a: 1 }, { b: 2 }), { a: 1, b: 2 });
}

export function eachTest() {
    let sum = 0;
    object.each({ a: 1, b: 2 }, v => { sum += v; });
    assert.strictEqual(sum, 3);

    let all = "";
    object.each(["a", "b"], v => { all += v; });
    assert.strictEqual(all, "ab");

    let all2 = "";
    object.each(["a", "b"], v => { all2 += v; return false; });
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
    object.each([1, 2, 3], function (v, i) { total += v; if (i == 1) return false; });
    assert.strictEqual(total, 3, "Looping over an array, with break");

    total = 0;
    object.each({ "a": 1, "b": 2, "c": 3 }, function (v, i) { total += v; });
    assert.strictEqual(total, 6, "Looping over an object");

    total = 0;
    object.each({ "a": 3, "b": 3, "c": 3 }, function (v, i) { total += v; return false; });
    assert.strictEqual(total, 3, "Looping over an object, with break");

    //var f = function(){};
    //f.foo = "bar";
    //object.each(f, function(v, i){
    //	f[i] = "baz";
    //});
    //assert.strictEqual( "baz", f.foo, "Loop over a function" );

    var stylesheet_count = 0;
    object.each(document.styleSheets, function (i) {
        stylesheet_count++;
    });
    assert.ok(stylesheet_count, "should not throw an error in IE while looping over document.styleSheets and return proper amount");

}

export function forEachTest() {
    let sum = 0;
    object.forEach({ a: 1, b: 2 }, v => { sum += v; });
    assert.strictEqual(sum, 3);

    let all = "";
    object.forEach(["a", "b"], v => { all += v; });
    assert.strictEqual(all, "ab");
}

export function filterTest() {
    assert.deepEqual(object.filter([1, 2], function (item) { return item > 1; }), [2]);
    assert.deepEqual(object.filter({ a: 1, b: 2 }, function (item) { return item > 1; }), { b: 2 });
}

export function mapTest() {
    assert.deepEqual(object.map(["a", "b"], function (a) { return a + a; }), ["aa", "bb"]);
    assert.deepEqual(object.map({ length: 1, 0: "a" }, function (a) { return a; }), ["a"]);
    assert.deepEqual(object.map({ a: "a", b: "b" }, function (a) { return a + a; }), { a: "aa", b: "bb" });
}

export function everyTest() {
    assert.strictEqual(object.every([1, 2], function (item) { return item > 0; }), true);
    assert.strictEqual(object.every([1, 2], function (item) { return item > 1; }), false);
    assert.strictEqual(object.every([1, 2], function (item) { return item > 2; }), false);
    assert.strictEqual(object.every({ a: 1, b: 2 }, function (item) { return item > 0; }), true);
    assert.strictEqual(object.every({ a: 1, b: 2 }, function (item) { return item > 1; }), false);
    assert.strictEqual(object.every({ a: 1, b: 2 }, function (item) { return item > 2; }), false);
}

export function someTest() {
    assert.strictEqual(object.some([1, 2], function (item) { return item > 0; }), true);
    assert.strictEqual(object.some([1, 2], function (item) { return item > 1; }), true);
    assert.strictEqual(object.some([1, 2], function (item) { return item > 2; }), false);
    assert.strictEqual(object.some({ a: 1, b: 2 }, function (item) { return item > 1; }), true);
    assert.strictEqual(object.some({ a: 1, b: 2 }, function (item) { return item > 1; }), true);
    assert.strictEqual(object.some({ a: 1, b: 2 }, function (item) { return item > 2; }), false);
}

export function findTest() {
    assert.strictEqual(object.find([1, 2], function (item) { return item > 1; }), 2);
    assert.strictEqual(object.find({ a: 1, b: 2 }, function (item) { return item > 1; }), 2);
}

export function findIndexTest() {
    assert.strictEqual(object.findIndex([1, 2], function (item) { return item > 1; }), 1);
    assert.strictEqual(object.findIndex([1, 2], function (item) { return item > 2; }), -1);
    assert.strictEqual(object.findIndex({ a: 1, b: 2 }, function (item) { return item > 1; }), "b");
    assert.strictEqual(object.findIndex({ a: 1, b: 2 }, function (item) { return item > 2; }), undefined);
}

export function reduceTest() {
    assert.strictEqual(object.reduce([1, 2], function (x: number, y: number) { return x + y; }), 3);
    assert.strictEqual(object.reduce([1, 2], function (x: number, y: number) { return x + y; }, 10), 13);
    assert.strictEqual(object.reduce({ a: 1, b: 2 }, function (x: number, y: number) { return x + y; }), 3);
    assert.strictEqual(object.reduce({ a: 1, b: 2 }, function (x: number, y: number) { return x + y; }, 10), 13);
}

export function reduceRightTest() {
    assert.strictEqual(object.reduceRight([1, 2], function (x: number, y: number) { return x + y; }), 3);
    assert.strictEqual(object.reduceRight([1, 2], function (x: number, y: number) { return x + y; }, 10), 13);
    assert.strictEqual(object.reduceRight({ a: 1, b: 2 }, function (x: number, y: number) { return x + y; }), 3);
    assert.strictEqual(object.reduceRight({ a: 1, b: 2 }, function (x: number, y: number) { return x + y; }, 10), 13);
}

export function subsetTest() {
    assert.deepEqual(object.subset({ a: 1, b: 2 }, ["a"]), { a: 1 });
}

export function typeTest() {
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

export function isEmptyTest() {
    assert.strictEqual(object.isEmpty(null), true);
    assert.strictEqual(object.isEmpty(undefined), true);
    assert.strictEqual(object.isEmpty(""), true);
    assert.strictEqual(object.isEmpty(" "), false);
    assert.strictEqual(object.isEmpty([]), true);
    assert.strictEqual(object.isEmpty({}), true);
}

export function isObjectTest() {
    assert.strictEqual(object.isObject({}), true);
    assert.strictEqual(object.isObject(null), false);
}

export function cloneTest() {
    assert.deepEqual(object.clone({ a: 3, b: [5] }), { a: 3, b: [5] });
}

export function deepCloneTest() {
    assert.deepEqual(object.deepClone({ a: 3, b: [5] }), { a: 3, b: [5] });
}

export function deepCloneSafeTest() {
    assert.deepEqual(object.deepCloneSafe({ a: 3, b: [5] }), { a: 3, b: [5] });

    const arr: any[] = [];
    arr[0] = arr;
    const cloned = object.deepCloneSafe(arr);
    assert.strictEqual(cloned[0], cloned[0][0]);
}

export function sizeTest() {
    assert.strictEqual(object.size({ a: 1, b: 2 }), 2);
    assert.strictEqual(object.size([0, 1]), 2);
}

export function deepEqualTest() {
    assert.strictEqual(object.deepEqual([], []), true);
    assert.strictEqual(object.deepEqual([], [0]), false);
    assert.strictEqual(object.deepEqual({ 0: 0, length: 1 }, [0]), false);
}

export function diffTest() {
    assert.deepEqual(object.diff({ a: 1, c: 1 }, { b: 1, c: 2 }), { left: ["a"], right: ["b"], both: ["c"] });
}

export function deepDiffTest() {
    assert.deepEqual(object.deepDiff({ a: 1, c: 1 }, { b: 1, c: 2 }), { left: ["a"], right: ["b"], both: ["c"] });
}

export function pickTest() {
    assert.strictEqual(object.pick(undefined, null, 1), 1);
}

export function keyOfTest() {
    assert.strictEqual(object.keyOf({ a: 1, b: 1 }, 1), "a");
}

export function getTest() {
    assert.strictEqual(object.get({ a: { b: 1 } }, "a.b"), 1);
}

export function setTest() {
    const foo = {};
    object.set(foo, "a[1].b", 2);
    assert.deepEqual(foo, { a: [undefined, { b: 2 }] });
}

export function insertBeforeTest() {
    assert.deepEqual(object.insertBefore({ a: 1 }, "b", 2, "a"), { b: 2, a: 1 });
}

export function setPropTest() {
    class A {
        get prop() { return 1; }
        set prop(value) { object.setProperty(this, "prop", value); }
    }
    const a = new A();
    assert.equal(a.prop, 1);
    a.prop++;
    assert.equal(a.prop, 2);
    a.prop++;
    assert.equal(a.prop, 3);
}

export function addCallbackTest() {
    class A {
        func = null;
    }
    let c = 0;
    const a = new A();
    object.addCallback(a, "func", () => {
        assert.equal(++c, 1);
    });
    object.addCallback(a, "func", () => {
        assert.equal(++c, 2);
        return false;
    });
    object.addCallback(a, "func", () => {
        assert.equal(++c, 3);
    });
    assert.equal(a.func!(), false);
}
