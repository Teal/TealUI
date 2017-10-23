import * as assert from "assert";
import * as func from "./function";

export function emptyTest() {
    assert.ok(func.empty);
}

export function selfTest() {
    assert.strictEqual(func.self(1), 1);
}

export function fromTest() {
    assert.strictEqual(func.from(false)(), false);
}

export function isFunctionTest() {
    assert.strictEqual(func.isFunction(function () { }), true);
    assert.strictEqual(func.isFunction(null), false);
    assert.strictEqual(func.isFunction(new Function()), true);

    // Make sure that false values return false
    assert.ok(!func.isFunction(null), "null Value");
    assert.ok(!func.isFunction(undefined), "undefined Value");
    assert.ok(!func.isFunction(""), "Empty String Value");
    assert.ok(!func.isFunction(0), "0 Value");

    // Check built-ins
    // Safari uses "(Internal Function)"
    assert.ok(func.isFunction(String), "String Function(" + String + ")");
    assert.ok(func.isFunction(Array), "Array Function(" + Array + ")");
    assert.ok(func.isFunction(Object), "Object Function(" + Object + ")");
    assert.ok(func.isFunction(Function), "Function Function(" + Function + ")");

    // When stringified, this could be misinterpreted
    const mystr = "function";
    assert.ok(!func.isFunction(mystr), "Function String");

    // When stringified, this could be misinterpreted
    const myarr = ["function"];
    assert.ok(!func.isFunction(myarr), "Function Array");

    // When stringified, this could be misinterpreted
    const myfunction = { "function": "test" };
    assert.ok(!func.isFunction(myfunction), "Function Object");

    // Make sure normal functions still work
    const fn = function () { };
    assert.ok(func.isFunction(fn), "Normal Function");

    const obj = document.createElement("object");

    // Firefox says this is a function
    assert.ok(!func.isFunction(obj), "Object Element");

    // IE says this is an object
    // Since 1.3, this isn't supported (#2968)
    // assert.ok( func.isFunction(obj.getAttribute), "getAttribute Function" );

    const nodes = document.body.childNodes;

    // Safari says this is a function
    assert.ok(!func.isFunction(nodes), "childNodes Property");

    const first = document.body.firstChild;

    // Normal elements are reported ok everywhere
    assert.ok(!func.isFunction(first), "A normal DOM Element");

    const input = document.createElement("input");
    input.type = "text";
    document.body.appendChild(input);

    // IE says this is an object
    // Since 1.3, this isn't supported (#2968)
    // assert.ok( func.isFunction(input.focus), "A default function property" );

    document.body.removeChild(input);

    const a = document.createElement("a");
    a.href = "some-function";
    document.body.appendChild(a);

    // This serializes with the word 'function' in it
    assert.ok(!func.isFunction(a), "Anchor Element");

    document.body.removeChild(a);

    // Recursive function calls have lengths and array-like properties
    function callme(callback: any) {
        function fn(response: any) {
            callback(response);
        }

        assert.ok(func.isFunction(fn), "Recursive Function Call");

        fn({ some: "data" });
    }

    callme(function () {
        callme(function () { });
    });
}

export function concatTest() {
    assert.ok(func.concat(function () { }, function () { }));
}

export function repeatTest() {
    let i = 0;
    const fn = func.repeat(() => {
        i++;
    }, 2);
    fn();
    fn();
    assert.strictEqual(i, 4);
}

export function onceTest() {
    let i = 0;
    const fn = func.once(() => i++);
    fn();
    fn();
    assert.strictEqual(i, 1);
}

export function beforeTest() {
    let i = 0;
    const fn = func.before(() => i++, 2);
    fn();
    assert.strictEqual(i, 1);
    fn();
    assert.strictEqual(i, 1);
    fn();
    assert.strictEqual(i, 2);
}

export function afterTest() {
    let i = 0;
    const fn = func.after(() => i++, 2);
    fn();
    assert.strictEqual(i, 0);
    fn();
    assert.strictEqual(i, 1);
    fn();
    assert.strictEqual(i, 1);
    fn();
    assert.strictEqual(i, 2);
}

export function limitTest() {
    let i = 0;
    const fn = func.limit(() => i++, 1);
    fn();
    fn();
    assert.strictEqual(i, 1);
}

export function cacheTest() {
    let i = 0;
    const fn = func.cache(() => i++);
    fn();
    fn();
    assert.strictEqual(i, 1);
}

export function delayTest(done: Function) {
    func.delay(() => {
        assert.ok(true);
        done();
    }, 1)();
}

export function deferTest(done: Function) {
    func.defer(() => {
        assert.ok(true);
        done();
    }, 1)();
}

export function intervalTest(done: Function) {
    func.interval(count => {
        assert.strictEqual(count, 0);
        done();
    }, 1, 1);
}

export function tryTheseTest() {
    assert.strictEqual(func.tryThese(function () { throw new Error("x"); }, function () { return 1; }), 1);
}

export function getSourceTest() {
    assert.strictEqual(func.getSource(function (x: any) { return x; }).trim(), "return x;");
}
