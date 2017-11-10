define(["require", "exports", "assert", "./es5-shim", "./es6-shim", "./es7-shim"], function (require, exports, assert) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function Array_concatTest() {
        assert.deepEqual(["I", "love"].concat(["you"]), ["I", "love", "you"]);
    }
    exports.Array_concatTest = Array_concatTest;
    function Object_createTest() {
        function Parent() { }
        Parent.prototype = { foo: function () { }, bar: 2 };
        assert.deepEqual(Object.create(null), {}, "should return empty object when a non-object is provided");
        assert.ok(Object.create([]) instanceof Array, "should return new instance of array when array is provided");
        function Child() { }
        Child.prototype = Object.create(Parent.prototype);
        assert.ok(new Child() instanceof Parent, "object should inherit prototype");
        function func() { }
        Child.prototype = Object.create(Parent.prototype, { func: { value: func } });
        assert.strictEqual(Child.prototype.func, func, "properties should be added to object");
        Child.prototype = Object.create(Parent.prototype, { constructor: { value: Child } });
        assert.strictEqual(Child.prototype.constructor, Child);
        Child.prototype.foo = "foo";
        var created = Object.create(Child.prototype, new Child());
        assert.ok(!created.hasOwnProperty("foo"), "should only add own properties");
    }
    exports.Object_createTest = Object_createTest;
    function Object_keysTest() {
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
    exports.Object_keysTest = Object_keysTest;
    function Array_isArrayTest() {
        assert.strictEqual(Array.isArray([]), true);
        assert.strictEqual(Array.isArray(document.getElementsByTagName("div")), false);
        assert.strictEqual(Array.isArray(Array()), true);
    }
    exports.Array_isArrayTest = Array_isArrayTest;
    function Array_indexOfTest() {
        assert.strictEqual(["a", "b", "b", "c"].indexOf("b"), 1);
        assert.strictEqual(["a", "b", "b", "c"].indexOf("e"), -1);
    }
    exports.Array_indexOfTest = Array_indexOfTest;
    function Array_lastIndexOfTest() {
        assert.strictEqual(["a", "b", "b", "c"].lastIndexOf("b"), 2);
        assert.strictEqual(["a", "b", "b", "c"].lastIndexOf("e"), -1);
    }
    exports.Array_lastIndexOfTest = Array_lastIndexOfTest;
    function Array_forEachTest() {
        var all = "";
        ["a", "b"].forEach(function (v) { all += v; });
        assert.strictEqual(all, "ab");
    }
    exports.Array_forEachTest = Array_forEachTest;
    function Array_mapTest() {
        assert.deepEqual([1, 9, 9, 0].map(function (item) { return item + 1; }), [2, 10, 10, 1]);
    }
    exports.Array_mapTest = Array_mapTest;
    function Array_filterTest() {
        assert.deepEqual([1, 2].filter(function (item) { return item > 1; }), [2]);
    }
    exports.Array_filterTest = Array_filterTest;
    function Array_everyTest() {
        assert.strictEqual([1, 2].every(function (item) { return item > 0; }), true);
        assert.strictEqual([1, 2].every(function (item) { return item > 1; }), false);
        assert.strictEqual([1, 2].every(function (item) { return item > 2; }), false);
    }
    exports.Array_everyTest = Array_everyTest;
    function Array_someTest() {
        assert.strictEqual([1, 2].some(function (item) { return item > 0; }), true);
        assert.strictEqual([1, 2].some(function (item) { return item > 1; }), true);
        assert.strictEqual([1, 2].some(function (item) { return item > 2; }), false);
    }
    exports.Array_someTest = Array_someTest;
    function Array_reduceTest() {
        assert.strictEqual([1, 2].reduce(function (x, y) { return x + y; }), 3);
        assert.strictEqual([1, 2].reduce(function (x, y) { return x + y; }, 10), 13);
    }
    exports.Array_reduceTest = Array_reduceTest;
    function Array_reduceRightTest() {
        assert.strictEqual([1, 2].reduceRight(function (x, y) { return x + y; }), 3);
        assert.strictEqual([1, 2].reduceRight(function (x, y) { return x + y; }, 10), 13);
    }
    exports.Array_reduceRightTest = Array_reduceRightTest;
    function String_trimTest() {
        var nbsp = String.fromCharCode(160);
        assert.equal("hello  ".trim(), "hello", "尾部");
        assert.equal("  hello".trim(), "hello", "头部");
        assert.equal("  hello   ".trim(), "hello", "全部");
        assert.equal(("  " + nbsp + "hello  " + nbsp + " ").trim(), "hello", "&nbsp;");
        assert.equal("".trim(), "", "空字符串");
    }
    exports.String_trimTest = String_trimTest;
    function Date_nowTest() {
        assert.strictEqual(Date.now(), Date.now());
    }
    exports.Date_nowTest = Date_nowTest;
    function Function_bindTest() {
        assert.strictEqual(function () { return this; }.bind([0])()[0], 0);
        var test = function () { assert.equal(this, thisObject, "Make sure that scope is set properly."); };
        var thisObject = { foo: "bar", method: test };
        // Make sure normal works
        test.call(thisObject);
        // Basic scoping
        test.bind(thisObject)();
    }
    exports.Function_bindTest = Function_bindTest;
    function JSON_parseTest() {
        assert.strictEqual(JSON.parse(null), null, "Nothing in, null out.");
        assert.deepEqual(JSON.parse("{}"), {}, "Plain object parsing.");
        assert.deepEqual(JSON.parse("{\"test\":1}"), { "test": 1 }, "Plain object parsing.");
        assert.deepEqual(JSON.parse("\n{\"test\":1}"), { "test": 1 }, "Make sure leading whitespaces are handled.");
        try {
            JSON.parse("{a:1}");
            assert.ok(false, "Test malformed JSON string.");
        }
        catch (e) {
            assert.ok(true, "Test malformed JSON string.");
        }
        try {
            JSON.parse("{'a':1}");
            assert.ok(false, "Test malformed JSON string.");
        }
        catch (e) {
            assert.ok(true, "Test malformed JSON string.");
        }
    }
    exports.JSON_parseTest = JSON_parseTest;
    function Object_assignTest() {
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
        var subObj = new F();
        subObj.c = "d";
        assert.deepEqual(Object.assign({}, subObj), { c: "d" }, "copies own properties from source");
        assert.deepEqual(Object.assign({}, null, void 0, { a: 1 }), { a: 1 }, "should not error on `null` or `undefined` sources");
        assert.deepEqual(Object.assign({ a: 1, 0: 2, 1: "5", length: 6 }, { 0: 1, 1: 2, length: 2 }), { a: 1, 0: 1, 1: 2, length: 2 }, "should treat array-like objects like normal objects");
    }
    exports.Object_assignTest = Object_assignTest;
    function Array_fromTest() {
        assert.deepEqual(Array.from([1, 4]), [1, 4]);
        assert.deepEqual(Array.from((function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return arguments;
        })(0, 1, 2)), [0, 1, 2]);
        assert.deepEqual(Array.from({ length: 1, 0: "value" }), ["value"]);
        // assert.equal( Array.from(document.findAll("head")[0]s)[0].nodeName.toUpperCase(), "HEAD", "Pass makeArray a List object" );
        // assert.equal( Array.from(document.getElementsByName("PWD")).slice(0,1)[0].name, "PWD", "Pass makeArray a nodelist" );
        assert.equal(function () { return Array.from(arguments); }(1, 2).join(""), "12", "Pass makeArray an arguments array");
        assert.equal(Array.from([1, 2, 3]).join(""), "123", "Pass makeArray a real array");
        assert.equal(Array.from([0])[0], 0, "Pass makeArray a number");
        assert.equal(Array.from({ length: 2, 0: "a", 1: "b" }).join(""), "ab", "Pass makeArray an array like map (with length)");
        // assert.ok( !!Array.from( document.documentElement.childNodes ).slice(0,1)[0].nodeName, "Pass makeArray a childNodes array" );
        // assert.ok( Array.from(document.getElementById("form")).length >= 13, "Pass makeArray a form (treat as elements)" );
        assert.deepEqual(Array.from({ length: "0" }), [], "Make sure object is coerced properly.");
    }
    exports.Array_fromTest = Array_fromTest;
    function Array_findTest() {
        assert.strictEqual([1, 2].find(function (item) { return item > 1; }), 2);
    }
    exports.Array_findTest = Array_findTest;
    function Array_findIndexTest() {
        assert.strictEqual([1, 2].findIndex(function (item) { return item > 1; }), 1);
    }
    exports.Array_findIndexTest = Array_findIndexTest;
    function Array_fillTest() {
        var foo = [1, 2];
        foo.fill(1);
        assert.deepEqual(foo, [1, 1]);
    }
    exports.Array_fillTest = Array_fillTest;
    function String_startsWithTest() {
        assert.strictEqual("1234567".startsWith("123"), true);
    }
    exports.String_startsWithTest = String_startsWithTest;
    function String_endsWithTest() {
        assert.strictEqual("1234567".endsWith("67"), true);
    }
    exports.String_endsWithTest = String_endsWithTest;
    function String_repeatTest() {
        assert.strictEqual("a".repeat(4), "aaaa");
    }
    exports.String_repeatTest = String_repeatTest;
    function Object_valuesTest() {
        assert.deepEqual(Object.values({ one: 1, two: 2 }), [1, 2], "can extract the values from an object");
        assert.deepEqual(Object.values({ one: 1, two: 2, length: 3 }), [1, 2, 3], '... even when one of them is "length"');
    }
    exports.Object_valuesTest = Object_valuesTest;
    function Object_entriesTest() {
        assert.deepEqual(Object.entries({ one: 1, two: 2 }), [["one", 1], ["two", 2]], "can extract the values from an object");
        assert.deepEqual(Object.entries({ one: 1, two: 2, length: 3 }), [["one", 1], ["two", 2], ["length", 3]], '... even when one of them is "length"');
    }
    exports.Object_entriesTest = Object_entriesTest;
    function Array_includesTest() {
        assert.strictEqual([1, 2].includes(1), true);
        assert.strictEqual([1, 2].includes(0), false);
        assert.strictEqual([1, 2, NaN].includes(NaN), true);
    }
    exports.Array_includesTest = Array_includesTest;
    function String_padStartTest() {
        assert.strictEqual("6".padStart(3, "0"), "006");
    }
    exports.String_padStartTest = String_padStartTest;
    function String_padEndTest() {
        assert.strictEqual("6".padEnd(3, "0"), "600");
    }
    exports.String_padEndTest = String_padEndTest;
    function String_trimLeftTest() {
        assert.strictEqual("  a".trimLeft(), "a");
    }
    exports.String_trimLeftTest = String_trimLeftTest;
    function String_trimRightTest() {
        assert.strictEqual("a  ".trimRight(), "a");
    }
    exports.String_trimRightTest = String_trimRightTest;
});
//# sourceMappingURL=shim-test.js.map