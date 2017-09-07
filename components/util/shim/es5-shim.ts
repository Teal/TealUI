import "./json-shim";

/**
 * 创建一个拥有指定原型和若干个指定属性的对象。
 * @param proto 原型对象。
 * @param properties 包含的属性。
 * @return 返回创建的对象。
 * @example Object.create({a: 3, b: 5}) // {a: 3, b: 5}
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
 */
Object.create = Object.create || function (proto: object | null, properties?: PropertyDescriptorMap & ThisType<any>) {
    function Temp() { }
    Temp.prototype = proto;
    const result = new (Temp as any)();
    for (const key in properties!) {
        Object.defineProperty(result, key, properties![key]);
    }
    return result;
};

/**
 * 直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
 * @param obj 要在其上定义属性的对象。
 * @param prop 要定义或修改的属性的名称。
 * @param descriptor 将被定义或修改的属性的描述符。
 * @return 返回创建的对象。
 * @example Object.defineProperty({}, "prop", {value: 1})
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
 */
Object.defineProperty = Object.defineProperty || function (obj: any, prop: string, descriptor: PropertyDescriptor) {
    if (descriptor.get) {
        obj.__defineGetter__(prop, descriptor.get);
    }
    if (descriptor.set) {
        obj.__defineSetter__(prop, descriptor.set);
    }
    if ("value" in descriptor) {
        obj[prop] = descriptor.value;
    }
};

/**
 * 在一个对象上定义新的属性或修改现有属性，并返回该对象。
 * @param obj 要在其上定义属性的对象。
 * @param props 该对象的一个或多个键值对定义了将要为对象添加或修改的属性的具体配置。
 * @return 返回创建的对象。
 * @example Object.defineProperties({}, { props: value: 1 })
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
 */
Object.defineProperties = Object.defineProperties || function (obj: any, props: PropertyDescriptorMap) {
    for (const key in props) {
        Object.defineProperty(obj, key, props[key]);
    }
};

/**
 * 返回指定对象的原型。
 * @param obj 要获取的对象。
 * @return 返回原型对象。
 * @example Object.getPrototypeOf({}) // Object.prototype
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf
 */
Object.getPrototypeOf = Object.getPrototypeOf || function (obj: any) {
    const proto = obj.__proto__;
    if (proto || proto === null) {
        return proto;
    }
    if (obj.constructor) {
        return obj.constructor.prototype;
    }
    return Object.prototype;
};

/**
 * 获取对象的所有键。
 * @param obj 要获取的对象。
 * @return 返回所有键组成的数组。
 * @example Object.keys({a: 3, b: 5}) // ["a", "b"]
 * @example Object.keys([0, 1]) // ["0", "1"]
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 */
Object.keys = Object.keys || function <T>(obj: T) {
    const result: (keyof T)[] = [];
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result.push(key);
        }
    }
    return result;
};

/**
 * 密封一个对象，禁止增删对象的属性。
 * @param obj 要被密封的对象。
 * @return 返回已密封的对象。
 * @example Object.seal({}) // {}
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal
 */
Object.seal = Object.seal || function <T>(obj: T) {
    return obj;
};

/**
 * 冻结一个对象，禁止增删改对象的属性。
 * @param obj 要被冻结的对象。
 * @return 返回已冻结的对象。
 * @example Object.freeze({}) // {}
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 */
Object.freeze = Object.freeze || function <T>(obj: T) {
    return obj;
};

/**
 * 让一个对象变的不可扩展。
 * @param obj 要被冻结的对象。
 * @return 返回已冻结的对象。
 * @example Object.freeze({}) // {}
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions
 */
Object.preventExtensions = Object.preventExtensions || function <T>(obj: T) {
    return obj;
};

/**
 * 判断一个对象是否被密封。
 * @param obj 要处理的对象。
 * @return 如果被密封则返回 true，否则返回 false。
 * @example Object.isSealed({}) // false
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed
 */
Object.isSealed = Object.isSealed || function (obj: any) {
    return false;
};

/**
 * 判断一个对象是否被冻结。
 * @param obj 要处理的对象。
 * @return 如果被密封则返回 true，否则返回 false。
 * @example Object.isFrozen({}) // false
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen
 */
Object.isFrozen = Object.isFrozen || function (obj: any) {
    return false;
};

/**
 * 判断一个对象是否可扩展。
 * @param obj 要处理的对象。
 * @return 如果被密封则返回 true，否则返回 false。
 * @example Object.isExtensible({}) // false
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible
 */
Object.isExtensible = Object.isExtensible || function (obj: any) {
    return obj instanceof Object;
};

/**
 * 返回指定对象上一个自有属性对应的属性描述符。
 * @param obj 要处理的对象。
 * @param prop 要获取的属性的名称。
 * @return 如果指定的属性存在于对象上，则返回其属性描述符（property descriptor），否则返回 undefined。
 * @example Object.getOwnPropertyDescriptor({}) // false
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor
 */
Object.getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor || function (obj: any, prop: string) {
    return obj.hasOwnProperty(prop) ? {
        get: obj.__lookupGetter__(prop),
        set: obj.__lookupSetter__(prop),
        value: obj[prop]
    } : undefined;
};

/**
 * 返回指定对象上一个自有属性对应的属性描述符。
 * @param obj 要处理的对象。
 * @param prop 要获取的属性的名称。
 * @return 如果指定的属性存在于对象上，则返回其属性描述符（property descriptor），否则返回 undefined。
 * @example Object.getOwnPropertyNames({}) // []
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
 */
Object.getOwnPropertyNames = Object.getOwnPropertyNames || function (obj: any) {
    return Object.keys(obj).filter(key => obj.hasOwnProperty(key));
};

/**
 * 判断一个对象是否是数组。
 * @param obj 要判断的对象。
 * @return 如果 *obj* 是数组则返回 true，否则返回 false。
 * @example Array.isArray([]) // true
 * @example Array.isArray(document.getElementsByTagName("div")) // false
 * @example Array.isArray(new Array) // true
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
 */
Array.isArray = Array.isArray || function (obj: any): obj is any[] {
    return Object.prototype.toString.call(obj) === "[object Array]";
};

/**
 * 获取指定项在当前数组内的第一个索引。
 * @param value 一个类数组对象。
 * @param startIndex 搜索开始的位置。
 * @return 返回索引。如果找不到则返回 -1。
 * @example ["a", "b", "b", "c"].indexOf("b") // 1
 * @example ["a", "b", "b", "c"].indexOf("e") // -1
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 */
Array.prototype.indexOf = Array.prototype.indexOf || function <T>(this: T[], value: T, startIndex = 0) {
    for (; startIndex < this.length; startIndex++) {
        if (this[startIndex] === value) {
            return startIndex;
        }
    }
    return -1;
};

/**
 * 获取指定项在当前数组内的最后一个索引。
 * @param value 一个类数组对象。
 * @param startIndex=0 搜索开始的位置。
 * @return 返回索引。如果找不到则返回 -1。
 * @example ["a", "b", "b", "c"].lastIndexOf("b") // 2
 * @example ["a", "b", "b", "c"].lastIndexOf("e") // -1
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 */
Array.prototype.lastIndexOf = Array.prototype.lastIndexOf || function <T>(this: T[], value: T, startIndex = 0) {
    for (let i = this.length - 1; i >= startIndex; i--) {
        if (this[i] === value) {
            return i;
        }
    }
    return -1;
};

/**
 * 判断当前数组是否每一项都满足指定条件。
 * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
 * - value：当前项的值。
 * - index：当前项的索引或键。
 * - target：当前正在遍历的数组。
 * - 返回：如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @return 如果所有项满足条件则返回 true，否则返回 false。
 * @example [1, 2].every(function(item) {return item > 0}) // true
 * @example [1, 2].every(function(item) {return item > 1}) // false
 * @example [1, 2].every(function(item) {return item > 2}) // false
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every
 */
Array.prototype.every = Array.prototype.every || function <T>(this: T[], callback: (value: T, index: number, target: T[]) => boolean, scope?: any) {
    for (let i = 0; i < this.length; i++) {
        if ((i in this) && !callback.call(scope, this[i], i, this)) {
            return false;
        }
    }
    return true;
};

/**
 * 判断当前数组是否至少存在一项满足指定条件。
 * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
 * - value：当前项的值。
 * - index：当前项的索引或键。
 * - target：当前正在遍历的数组。
 * - 返回：如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @return 如果至少存在一项满足条件则返回 true，否则返回 false。
 * @example [1, 2].some(function(item) {return item > 0}) // true
 * @example [1, 2].some(function(item) {return item > 1}) // true
 * @example [1, 2].some(function(item) {return item > 2}) // false
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some
 */
Array.prototype.some = Array.prototype.some || function <T>(this: T[], callback: (value: T, index: number, target: T[]) => boolean, scope?: any) {
    for (let i = 0; i < this.length; i++) {
        if ((i in this) && callback.call(scope, this[i], i, this)) {
            return true;
        }
    }
    return false;
};

/**
 * 遍历当前数组，并对每一项执行 *callback*。
 * @param callback 对每一项执行的回调函数。
 * - value：当前项的值。
 * - index：当前项的索引或键。
 * - target：当前正在遍历的数组。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @example ["a", "b"].forEach(console.log, console) // 打印 '0  a' 和 '1  b'
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 */
Array.prototype.forEach = Array.prototype.forEach || function <T>(this: T[], callback: (value: T, index: number, target: T[]) => void, scope?: any) {
    for (let i = 0; i < this.length; i++) {
        if (i in this) {
            callback.call(scope, this[i], i, this);
        }
    }
};

/**
 * 筛选当前数组中符合要求的项并组成一个新数组。
 * @param callback 对每一项执行的回调函数，用于确定每一项是否符合条件。
 * - value：当前项的值。
 * - index：当前项的索引或键。
 * - target：当前正在遍历的数组。
 * - 返回：如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @return 返回一个新数组。
 * @example [1, 2].filter(function(item) { return item > 1; }) // [2]
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 */
Array.prototype.filter = Array.prototype.filter || function <T>(this: T[], callback: (value: T, index: number, target: T[]) => boolean, scope?: any) {
    const result: T[] = [];
    for (let i = 0; i < this.length; i++) {
        if ((i in this) && callback.call(scope, this[i], i, this)) {
            result.push(this[i]);
        }
    }
    return result;
};

/**
 * 遍历当前数组，并对每一项执行 *callback*，然后返回每个结果组成的新数组或对象。
 * @param callback 对每一项执行的回调函数，用于计算每一项的返回值。
 * - value：当前项的值。
 * - index：当前项的索引或键。
 * - target：当前正在遍历的数组。
 * - 返回：返回结果。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @return 返回一个新数组。
 * @example [1, 9, 9, 0].map(function(item) { return item + 1; }) // [2, 10, 10, 1]
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 */
Array.prototype.map = Array.prototype.map || function <T, R>(this: T[], callback: (value: T, index: number, target: T[]) => R, scope?: any) {
    const result: T[] = [];
    for (let i = 0; i < this.length; i++) {
        if (i in this) {
            result[i] = callback.call(scope, this[i], i, this);
        }
    }
    return result;
};

/**
 * 从左往右依次合并当前数组中的每一项并最终返回一个值。
 * @param callback 对每一项执行的回调函数，每次合并两项为一项。
 * - previousValue：要合并的前一项。
 * - currentValue：要合并的当前项。
 * - index：当前项的索引或键。
 * - target：当前正在遍历的数组。
 * - 返回：返回合并的结果。
 * @param initialValue 用于合并第一项的初始值。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @return 返回合并后的最终结果值。
 * @example [1, 2].reduce(function(x, y) { return x + y; }) // 3
 * @example [1, 2].reduce(function(x, y) { return x + y; }, 10) // 13
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 */
Array.prototype.reduce = Array.prototype.reduce || function <T, R>(this: T[], callback: (previousValue: R, currentValue: T, index: number, target: T[]) => R, initialValue?: R) {
    let result: R | undefined;
    let first = true;
    for (let i = 0; i < this.length; i++) {
        if (i in this) {
            if (first) {
                first = false;
                result = initialValue === undefined ? this[i] as any : callback(initialValue, this[i], i, this);
            } else {
                result = callback(result!, this[i], i, this);
            }
        }
    }
    return result;
};

/**
 * 从右往左依次合并当前数组中的每一项并最终返回一个值。
 * @param callback 对每一项执行的回调函数，每次合并两项为一项。
 * - previousValue：要合并的前一项。
 * - currentValue：要合并的当前项。
 * - index：当前项的索引或键。
 * - target：当前正在遍历的数组。
 * - 返回：返回合并的结果。
 * @param initialValue 用于合并第一项的初始值。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @return 返回合并后的最终结果值。
 * @example [1, 2].reduceRight(function(x, y) {return x + y}) // 3
 * @example [1, 2].reduceRight(function(x, y) {return x + y}, 10) // 13
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
 */
Array.prototype.reduceRight = Array.prototype.reduceRight || function <T, R>(this: T[], callback: (previousValue: R, currentValue: T, index: number, target: T[]) => R, initialValue?: R) {
    let result: R | undefined;
    let first = true;
    for (let i = this.length; --i >= 0;) {
        if (i in this) {
            if (first) {
                first = false;
                result = initialValue === undefined ? this[i] as any : callback(initialValue, this[i], i, this);
            } else {
                result = callback(result!, this[i], i, this);
            }
        }
    }
    return result;
};

/**
 * 去除当前字符串首尾空格。
 * @return 返回新字符串。
 * @example "  a".trim() // "a"
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/trim
 */
String.prototype.trim = String.prototype.trim || function (this: string) {
    return this.replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, "");
};

/**
 * 获取当前时间的时间戳。
 * @return 返回当前时间的时间戳。
 * @example Date.now() // 相当于 new Date().getTime()
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/now
 */
Date.now = Date.now || function () {
    return +new Date();
};

/**
 * 返回一个 ISO（ISO 8601 Extended Format）格式的字符串： YYYY-MM-DDTHH:mm:ss.sssZ。时区总是UTC（协调世界时），加一个后缀“Z”标识。
 * @param 返回 ISO 式的字符串。
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
 */
Date.prototype.toISOString = Date.prototype.toISOString || function (this: Date) {
    return `${this.getUTCFullYear()}-${this.getUTCMonth() + 1}-${this.getUTCDate()}T${this.getUTCHours()}:${this.getUTCMinutes()}:${this.getUTCSeconds()}.${(this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5)}Z`.replace(/([-T:])(\d\D)/g, "$10$2");
};

/**
 * 返回一个新函数，这个函数执行时 this 始终为指定的 scope。
 * @param scope 要绑定的 *this* 的值。
 * @return 返回一个新函数。
 * @example (function(){ return this; }).bind([0])()[0] // 0
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */
Function.prototype.bind = Function.prototype.bind || function (scope: any, ...args: any[]) {
    return (...args2: any[]) => {
        return this.apply(scope, args.concat(args2));
    };
};
