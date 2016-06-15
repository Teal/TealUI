QUnit.test("Object.assign", function (assert) {
    var result;
    assert.equal(Object.assign({}, { a: 'b' }).a, 'b', 'can extend an object with the attributes of another');
    assert.equal(Object.assign({ a: 'x' }, { a: 'b' }).a, 'b', 'properties in source override destination');
    assert.equal(Object.assign({ x: 'x' }, { a: 'b' }).x, 'x', "properties not in source don't get overriden");
    result = Object.assign({ x: 'x' }, { a: 'a' }, { b: 'b' });
    assert.deepEqual(result, { x: 'x', a: 'a', b: 'b' }, 'can extend from multiple source objects');
    result = Object.assign({ x: 'x' }, { a: 'a', x: 2 }, { a: 'b' });
    assert.deepEqual(result, { x: 2, a: 'b' }, 'extending from multiple source objects last property trumps');
    assert.deepEqual(Object.assign({}, { a: void 0, b: null }), { a: void 0, b: null }, 'copies undefined values');

    var F = function () { };
    F.prototype = { a: 'b' };
    var subObj = new F();
    subObj.c = 'd';
    assert.deepEqual(Object.assign({}, subObj), { c: 'd' }, 'copies own properties from source');

    result = {};
    assert.deepEqual(Object.assign(result, null, void 0, { a: 1 }), { a: 1 }, 'should not error on `null` or `undefined` sources');

    //Object.each(['a', 5, null, false], function (val) {
    //    assert.strictEqual(Object.assign(val, { a: 1 }), val, 'extending non-objects results in returning the non-object value');
    //});

    //assert.strictEqual(Object.assign(void 0, { a: 1 }), void 0, 'extending undefined results in undefined');

    result = Object.assign({ a: 1, 0: 2, 1: '5', length: 6 }, { 0: 1, 1: 2, length: 2 });
    assert.deepEqual(result, { a: 1, 0: 1, 1: 2, length: 2 }, 'should treat array-like objects like normal objects');
});
QUnit.test("Object.assign_simple", function (assert) {
    var result;
    assert.strictEqual(Object.assign_simple({}, { a: 'b' }).a, 'b', 'can extend an object with the attributes of another');
    assert.strictEqual(Object.assign_simple({ a: 'x' }, { a: 'b' }).a, 'b', 'properties in source override destination');
    assert.strictEqual(Object.assign_simple({ x: 'x' }, { a: 'b' }).x, 'x', "properties not in source don't get overriden");
    assert.deepEqual(Object.assign_simple({ a: 1, 0: 2, 1: '5', length: 6 }, { 0: 1, 1: 2, length: 2 }), { a: 1, 0: 1, 1: 2, length: 2 }, 'should treat array-like objects like normal objects');
});
QUnit.test('Object.keys', function (assert) {
    assert.deepEqual(Object.keys({ one: 1, two: 2 }), ['one', 'two'], 'can extract the keys from an object');
    // the test above is not safe because it relies on for-in enumeration order
    var a = []; a[1] = 0;
    assert.deepEqual(Object.keys(a), ['1'], 'is not fooled by sparse arrays; see issue #95');
    assert.deepEqual(Object.keys(null), []);
    assert.deepEqual(Object.keys(void 0), []);
    assert.deepEqual(Object.keys(1), []);
    assert.deepEqual(Object.keys('a'), ['0']);
    assert.deepEqual(Object.keys(true), []);

    // keys that may be missed if the implementation isn't careful
    var trouble = {
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
    };
    var troubleKeys = ['constructor', 'valueOf', 'hasOwnProperty', 'toString', 'toLocaleString', 'propertyIsEnumerable',
                  'isPrototypeOf', '__defineGetter__', '__defineSetter__', '__lookupSetter__', '__lookupGetter__'].sort();
    assert.deepEqual(Object.keys(trouble).sort(), troubleKeys, 'matches non-enumerable properties');
});
QUnit.test('Object.values', function (assert) {
    assert.deepEqual(Object.values({ one: 1, two: 2 }), [1, 2], 'can extract the values from an object');
    assert.deepEqual(Object.values({ one: 1, two: 2, length: 3 }), [1, 2, 3], '... even when one of them is "length"');
});
QUnit.test('Object.create', function (assert) {
    var Parent = function () { };
    Parent.prototype = { foo: function () { }, bar: 2 };

    _.each(['foo', null, void 0, 1], function (val) {
        assert.deepEqual(_.create(val), {}, 'should return empty object when a non-object is provided');
    });

    assert.ok(_.create([]) instanceof Array, 'should return new instance of array when array is provided');

    var Child = function () { };
    Child.prototype = _.create(Parent.prototype);
    assert.ok(new Child instanceof Parent, 'object should inherit prototype');

    var func = function () { };
    Child.prototype = _.create(Parent.prototype, { func: func });
    assert.strictEqual(Child.prototype.func, func, 'properties should be added to object');

    Child.prototype = _.create(Parent.prototype, { constructor: Child });
    assert.strictEqual(Child.prototype.constructor, Child);

    Child.prototype.foo = 'foo';
    var created = _.create(Child.prototype, new Child);
    assert.notOk(created.hasOwnProperty('foo'), 'should only add own properties');
});