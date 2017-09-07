import * as assert from "assert";
import "./es5-shim";
import "./es6-shim";
import "./es7-shim";

export function assignTest() {
    assert.strictEqual(Object.assign({}, { a: "b" }).a, "b", "can extend an object with the attributes of another");
    assert.strictEqual(Object.assign({ a: "x" }, { a: "b" }).a, "b", "properties in source override destination");
    assert.strictEqual(Object.assign({ x: "x" }, { a: "b" }).x, "x", "properties not in source don't get overriden");
    assert.deepEqual(Object.assign({ a: 1, 0: 2, 1: "5", length: 6 }, { 0: 1, 1: 2, length: 2 }), { a: 1, 0: 1, 1: 2, length: 2 }, "should treat array-like objects like normal objects");

    assert.strictEqual(Object.assign({}, { a: "b" })["a"], "b", "can extend an object with the attributes of another");
    assert.strictEqual(Object.assign({ a: "x" }, { a: "b" }).a, "b", "properties in source override destination");
    assert.strictEqual(Object.assign({ x: "x" }, { a: "b" }).x, "x", "properties not in source don't get overriden");
    if (Object.assign.length == 1) {
        assert.deepEqual(Object.assign({ x: "x" }, { a: "a" }, { b: "b" }), { x: "x", a: "a", b: "b" }, "can extend from multiple source objects");
        assert.deepEqual(Object.assign({ x: "x" }, { a: "a", x: 2 }, { a: "b" }), { x: 2, a: "b" }, "extending from multiple source objects last property trumps");
    }
    assert.deepEqual(Object.assign({}, { a: void 0, b: null }), { a: void 0, b: null }, "copies undefined values");

    var F = function () { };
    F.prototype = { a: "b" };
    var subObj = new (F as any)();
    subObj.c = "d";
    assert.deepEqual(Object.assign({}, subObj), { c: "d" }, "copies own properties from source");

    assert.deepEqual(Object.assign({}, null, void 0, { a: 1 }), { a: 1 }, "should not error on `null` or `undefined` sources");

    assert.deepEqual(Object.assign({ a: 1, 0: 2, 1: "5", length: 6 }, { 0: 1, 1: 2, length: 2 }), { a: 1, 0: 1, 1: 2, length: 2 }, "should treat array-like objects like normal objects");
}

export function createTest() {
    function Parent() { };
    Parent.prototype = { foo: function () { }, bar: 2 };
    assert.deepEqual(Object.create(null), {}, "should return empty object when a non-object is provided");

    assert.ok(Object.create([]) instanceof Array, "should return new instance of array when array is provided");

    function Child() { };
    Child.prototype = Object.create(Parent.prototype);
    assert.ok(new (Child as any)() instanceof Parent, "object should inherit prototype");

    function func() { };
    Child.prototype = Object.create(Parent.prototype, { func: { value: func } });

    assert.strictEqual(Child.prototype.func, func, "properties should be added to object");

    Child.prototype = Object.create(Parent.prototype, { constructor: { value: Child } });
    assert.strictEqual(Child.prototype.constructor, Child);

    Child.prototype.foo = "foo";
    var created = Object.create(Child.prototype, new (Child as any)());
    assert.ok(!created.hasOwnProperty("foo"), "should only add own properties");
}

export function keysTest(this: any) {
    assert.deepEqual(Object.keys({ one: 1, two: 2 }), ["one", "two"], "can extract the keys from an object");
    // the test above is not safe because it relies on for-in enumeration order
    assert.deepEqual(Object.keys([0]), ["0"], "is not fooled by sparse arrays");
    assert.deepEqual(Object.keys(1), []);
    assert.deepEqual(Object.keys("a"), ["0"]);
    assert.deepEqual(Object.keys(true), []);

    assert.deepEqual(Object.keys({
        constructor: Object,
        valueOf: function () { },
        hasOwnProperty: null,
        toString: 5,
        toLocaleString: void 0,
        propertyIsEnumerable: /a/,
        isPrototypeOf: this,
        __defineGetter__: Boolean,
        __defineSetter__: {},
        __lookupSetter__: false,
        __lookupGetter__: []
    }), ["constructor", "valueOf", "hasOwnProperty", "toString", "toLocaleString", "propertyIsEnumerable",
            "isPrototypeOf", "__defineGetter__", "__defineSetter__", "__lookupSetter__", "__lookupGetter__"], "matches non-enumerable properties");
}

export function valuesTest() {
    assert.deepEqual(Object.values({ one: 1, two: 2 }), [1, 2], "can extract the values from an object");
    assert.deepEqual(Object.values({ one: 1, two: 2, length: 3 }), [1, 2, 3], '... even when one of them is "length"');
}

export function isArrayTest() {
    assert.strictEqual(Array.isArray([]), true);
    assert.strictEqual(Array.isArray(document.getElementsByTagName("div")), false);
    assert.strictEqual(Array.isArray(Array()), true);
}

export function indexOfTest() {
    assert.strictEqual(["a", "b", "b", "c"].indexOf("b"), 1);
    assert.strictEqual(["a", "b", "b", "c"].indexOf("e"), -1);
}

export function lastIndexOfTest() {
    assert.strictEqual(["a", "b", "b", "c"].lastIndexOf("b"), 2);
    assert.strictEqual(["a", "b", "b", "c"].lastIndexOf("e"), -1);
}

export function concatTest() {
    assert.deepEqual(["I", "love"].concat(["you"]), ["I", "love", "you"]);
}

export function forEachTest() {
    let all = "";
    ["a", "b"].forEach(v => { all += v; });
    assert.strictEqual(all, "ab");
}

export function filterTest() {
    assert.deepEqual([1, 2].filter(function (item) { return item > 1; }), [2]);
}

export function mapTest() {
    assert.deepEqual([1, 9, 9, 0].map(function (item) { return item + 1; }), [2, 10, 10, 1]);
}

export function everyTest() {
    assert.strictEqual([1, 2].every(function (item) { return item > 0; }), true);
    assert.strictEqual([1, 2].every(function (item) { return item > 1; }), false);
    assert.strictEqual([1, 2].every(function (item) { return item > 2; }), false);
}

export function someTest() {
    assert.strictEqual([1, 2].some(function (item) { return item > 0; }), true);
    assert.strictEqual([1, 2].some(function (item) { return item > 1; }), true);
    assert.strictEqual([1, 2].some(function (item) { return item > 2; }), false);
}

export function reduceTest() {
    assert.strictEqual([1, 2].reduce(function (x: number, y: number) { return x + y; }), 3);
    assert.strictEqual([1, 2].reduce(function (x, y) { return x + y; }, 10), 13);
}

export function reduceRightTest() {
    assert.strictEqual([1, 2].reduceRight(function (x: number, y: number) { return x + y; }), 3);
    assert.strictEqual([1, 2].reduceRight(function (x: number, y: number) { return x + y; }, 10), 13);
}

export function findTest() {
    assert.strictEqual([1, 2].find(function (item) { return item > 1; }), 2);
}

export function findIndexTest() {
    assert.strictEqual([1, 2].findIndex(function (item) { return item > 1; }), 1);
}

export function includesTest() {
    assert.strictEqual([1, 2].includes(1), true);
    assert.strictEqual([1, 2].includes(0), false);
    assert.strictEqual([1, 2, NaN].includes(NaN), true);
}

export function fillTest() {
    const foo = [1, 2];
    foo.fill(1);
    assert.deepEqual(foo, [1, 1]);
}

export function fromTest() {
    assert.deepEqual(Array.from([1, 4]), [1, 4]);
    assert.deepEqual(Array.from((function (...args) { return arguments; })(0, 1, 2)), [0, 1, 2]);
    assert.deepEqual(Array.from({ length: 1, 0: "value" }), ["value"]);
}

export function startsWithTest() {
    assert.strictEqual("1234567".startsWith("123"), true);
}

export function endsWithTest() {
    assert.strictEqual("1234567".endsWith("67"), true);
}

export function trimLeftTest() {
    assert.strictEqual("  a".trimLeft(), "a");
}

export function trimRightTest() {
    assert.strictEqual("a  ".trimRight(), "a");
}

export function repeatTest() {
    assert.strictEqual("a".repeat(4), "aaaa");
}

export function padStartTest() {
    assert.strictEqual("6".padStart(3, "0"), "006");
}

export function padEndTest() {
    assert.strictEqual("6".padEnd(3, "0"), "600");
}

export function nowTest() {
    assert.strictEqual(Date.now(), Date.now());
}

// test("JSON.decode", function () {
//     return
//     expect(8);

//     equal(JSON.decode(), null, "Nothing in, null out.");
//     equal(JSON.decode(null), null, "Nothing in, null out.");
//     equal(JSON.decode(""), null, "Nothing in, null out.");

//     deepEqual(JSON.decode("{}"), {}, "Plain object parsing.");
//     deepEqual(JSON.decode("{\"test\":1}"), { "test": 1 }, "Plain object parsing.");

//     deepEqual(JSON.decode("\n{\"test\":1}"), { "test": 1 }, "Make sure leading whitespaces are handled.");

//     try {
//         JSON.decode("{a:1}");
//         ok(false, "Test malformed JSON string.");
//     } catch (e) {
//         ok(true, "Test malformed JSON string.");
//     }

//     try {
//         JSON.decode("{'a':1}");
//         ok(false, "Test malformed JSON string.");
//     } catch (e) {
//         ok(true, "Test malformed JSON string.");
//     }
// });




// test("String.prototype.trim", function () {

//     var nbsp = String.fromCharCode(160);

//     equal("hello  ".trim(), "hello", "尾部");
//     equal("  hello".trim(), "hello", "头部");
//     equal("  hello   ".trim(), "hello", "全部");
//     equal(("  " + nbsp + "hello  " + nbsp + " ").trim(), "hello", "&nbsp;");

//     equal("".trim(), "", "空字符串");
// });

// test("Function.prototype.bind", function () {

//     var test = function () { equal(this, thisObject, "Make sure that scope is set properly."); };
//     var thisObject = { foo: "bar", method: test };

//     // Make sure normal works
//     test.call(thisObject);

//     // Basic scoping
//     test.bind(thisObject)();
// });

// test("Object.isArray", function () {
//     expect(17);

//     // Make sure that false values return false
//     ok(!Object.isArray(), "No Value");
//     ok(!Object.isArray(null), "null Value");
//     ok(!Object.isArray(undefined), "undefined Value");
//     ok(!Object.isArray(""), "Empty String Value");
//     ok(!Object.isArray(0), "0 Value");

//     // Check built-ins
//     // Safari uses "(Internal Function)"
//     ok(!Object.isArray(String), "String Function(" + String + ")");
//     ok(!Object.isArray(Array), "Array Function(" + Array + ")");
//     ok(!Object.isArray(Object), "Object Function(" + Object + ")");
//     ok(!Object.isArray(Function), "Function Function(" + Function + ")");

//     // When stringified, this could be misinterpreted
//     var mystr = "function";
//     ok(!Object.isArray(mystr), "Function String");

//     // When stringified, this could be misinterpreted
//     var myarr = ["function"];
//     ok(Object.isArray(myarr), "Function Array");

//     // When stringified, this could be misinterpreted
//     var myArray = { "function": "test", length: 3 };
//     ok(!Object.isArray(myArray), "Function Object");

//     // Make sure normal functions still work
//     var fn = function () { };
//     ok(!Object.isArray(fn), "Normal Function");

//     var obj = document.createElement("object");

//     // Firefox says this is a function
//     ok(!Object.isArray(obj), "Object Element");

//     // IE says this is an object
//     // Since 1.3, this isn't supported (#2968)
//     //ok( Object.isArray(obj.getAttribute), "getAttribute Function" );

//     var nodes = document.body.childNodes;

//     ok(!Object.isArray(nodes), "childNodes Property");

//     var first = document.body.firstChild;

//     // Normal elements are reported ok everywhere
//     ok(!Object.isArray(first), "A normal DOM Element");

//     var input = document.createElement("input");
//     input.type = "text";
//     document.body.appendChild(input);

//     // IE says this is an object
//     // Since 1.3, this isn't supported (#2968)
//     //ok( Object.isArray(input.focus), "A default function property" );

//     document.body.removeChild(input);

//     var a = document.createElement("a");
//     a.href = "some-function";
//     document.body.appendChild(a);

//     // This serializes with the word 'function' in it
//     ok(!Object.isArray(a), "Anchor Element");

//     document.body.removeChild(a);
// });

// test("Array.create", function () {

//     // equal( Array.create(document.findAll("head")[0]s)[0].nodeName.toUpperCase(), "HEAD", "Pass makeArray a List object" );

//     // equal( Array.create(document.getElementsByName("PWD")).slice(0,1)[0].name, "PWD", "Pass makeArray a nodelist" );

//     equal((function () { return Array.create(arguments); })(1, 2).join(""), "12", "Pass makeArray an arguments array");

//     equal(Array.create([1, 2, 3]).join(""), "123", "Pass makeArray a real array");

//     equal(Array.create().length, 0, "Pass nothing to makeArray and expect an empty array");

//     equal(Array.create([0])[0], 0, "Pass makeArray a number");

//     equal(Array.create({ length: 2, 0: "a", 1: "b" }).join(""), "ab", "Pass makeArray an array like map (with length)");

//     // ok( !!Array.create( document.documentElement.childNodes ).slice(0,1)[0].nodeName, "Pass makeArray a childNodes array" );

//     // ok( Array.create(document.getElementById("form")).length >= 13, "Pass makeArray a form (treat as elements)" );

//     deepEqual(Array.create({ length: "0" }), [], "Make sure object is coerced properly.");
// });

export function bindTest() {
    assert.strictEqual(function (this: any) { return this; }.bind([0])()[0], 0);
}

// Promise.deferred = Promise.defer = function () {
//     var dfd = {}
//     dfd.promise = new Promise(function (resolve, reject) {
//         dfd.resolve = resolve
//         dfd.reject = reject
//     })
//     return dfd
// }

// try { // CommonJS compliance
//     module.exports = Promise
// } catch (e) { }

// npm install -g promises-aplus-tests

// promises-aplus-tests ./promise-shim.js