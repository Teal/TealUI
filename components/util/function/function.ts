/**
 * 空函数。
 */
export function empty() { }

/**
 * 始终返回第一个参数值的函数。
 * @param value 值。
 * @return 返回值。
 */
export function self<T>(value: T) {
    return value;
}

/**
 * 创建一个始终返回指定值的函数。
 * @param value 新函数要返回的值。
 * @return 返回一个新函数，该函数始终返回指定值。
 * @example from(false)() // false
 */
export function from<T>(value: T) {
    return () => value;
}

/**
 * 判断对象是否是函数。
 * @param obj 对象。
 * @return 如果对象是函数则返回 true，否则返回 false。
 * @example isFunction(function () {}) // true
 * @example isFunction(null) // false
 * @example isFunction(new Function()) // true
 */
export function isFunction(obj: any): obj is Function {
    return Object.prototype.toString.call(obj) === "[object Function]";
}

/**
 * 创建一个新函数，调用该函数后会依次调用所有原函数。
 * @param funcs 要调用的所有原函数。
 * @return 返回一个新函数。该函数无返回值。
 * @example concat(function (){}, function (){})()
 */
export function concat<T extends (...args: any[]) => void>(...funcs: T[]) {
    return function (this: any) {
        for (const fn of funcs) {
            fn && fn.apply(this, arguments);
        }
    } as any as T;
}

/**
 * 创建一个新函数，调用该函数后，重复调用原函数指定次数。
 * @param fn 要调用的原函数。
 * @param count 要调用的次数。
 * @return 返回一个新函数。
 * @example repeat(()=> console.log("hello"), 3)() // 输出 3 个 hello
 */
export function repeat<T extends Function>(fn: T, count = 0) {
    return function (this: any) {
        for (let i = 0; i < count; i++) {
            fn.apply(this, arguments);
        }
    };
}

/**
 * 创建一个新函数，仅在第一次调用该函数时调用原函数。
 * @param fn 要调用的原函数。
 * @return 返回一个新函数。
 */
export function once<T extends Function>(fn: T) {
    let called = false;
    let r: any;
    return function (this: any) {
        if (called) {
            return r;
        }
        called = true;
        return r = fn.apply(this, arguments);
    } as any as T;
}

/**
 * 创建一个新函数，多次调用该函数时，仅在第一次调用原函数。
 * @param fn 要调用的原函数。
 * @param count 调用的次数。
 * @return 返回一个新函数。
 * @example
 * var done = before(() => console.log("hello"), 2);
 * done();  // 输出 hello
 * done();  // 不输出
 */
export function before<T extends Function>(fn: T, count: number) {
    let i = -1;
    return function (this: any) {
        if (++i === count) {
            i = 0;
        }
        if (i === 0) {
            return fn.apply(this, arguments);
        }
    } as any as T;
}

/**
 * 创建一个新函数，多次调用该函数时，仅在最后一次调用原函数。
 * @param fn 要调用的原函数。
 * @param count 调用的次数。
 * @return 返回一个新函数。
 * @example
 * var done = after(() => console.log("hello"), 2);
 * done();  // 不输出
 * done();  // 输出 hello
 */
export function after<T extends Function>(fn: T, count: number) {
    let i = 0;
    return function (this: any) {
        if (++i === count) {
            i = 0;
            return fn.apply(this, arguments);
        }
    } as any as T;
}

/**
 * 创建一个新函数，在指定时间内多次调用该函数时，仅在第一次调用原函数。
 * @param fn 要调用的原函数。
 * @param timeout 超时的毫秒数。
 * @return 返回一个新函数。
 */
export function limit<T extends Function>(fn: T, timeout = 0) {
    let last: number;
    let timer: any;
    return function (this: any) {
        const remaining = last ? timeout - (Date.now() - last) : -1;
        if (remaining < 0) {
            last = Date.now();
            return fn.apply(this, arguments);
        }
        if (!timer) {
            const args = arguments;
            timer = setTimeout(() => {
                timer = 0;
                fn.apply(this, args);
            }, remaining);
        }
    };
}

/**
 * 创建一个新函数，多次调用该函数时，仅在参数发生变化后调用原函数。
 * @param fn 要调用的原函数。
 * @return 返回一个新函数。
 */
export function cache<T extends Function>(fn: T) {
    const caches: any[] = [];
    return function (...args: any[]) {
        for (const cache of caches) {
            if (args.length === cache.length) {
                let allSame = true;
                for (let i = 0; i < cache.length; i++) {
                    if (cache[i] !== args[i]) {
                        allSame = false;
                        break;
                    }
                }
                if (allSame) {
                    return cache.r;
                }
            }
        }
        caches.push(args);
        return (args as any).r = fn(...args);
    } as any as T;
}

/**
 * 创建一个新函数，调用该函数后，延时调用原函数。
 * @param fn 要调用的原函数。
 * @param timeout 延时的毫秒数。
 * @return 返回一个新函数。
 * @example delay(() => console.log("延时执行"), 100)()
 */
export function delay<T extends Function>(fn: T, timeout = 0) {
    return function (this: any) {
        const args = arguments;
        setTimeout(() => {
            fn.apply(this, args);
        }, timeout);
    } as any as T;
}

/**
 * 创建一个新函数，调用该函数后，延时调用原函数。如果在延时等待期间有新的调用，则重新开始计时。
 * @param fn 要调用的原函数。
 * @param timeout 延时的毫秒数。
 * @return 返回一个新函数。
 * @example document.onscroll = defer(() => console.log("延时执行"), 100);
 */
export function defer<T extends Function>(fn: T, duration = 0) {
    let timer: number;
    return function (this: any) {
        const args = arguments;
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            timer = 0;
            fn.apply(this, args);
        }, duration) as any;
    } as any as T;
}

/**
 * 创建一个新函数，调用该函数后每隔指定时间调用一次原函数。
 * @param fn 要调用的原函数，函数接收以下参数：
 * - count：当前执行的次数。
 *
 * 如果函数返回 false 则停止执行。
 * @param count 执行的次数。如果指定为 -1 则无限次执行。
 * @param timeout 每次执行之间的间隔毫秒数。
 * @example interval(function (a) { console.log(a) }, 10, 400)
 */
export function interval(fn: (count: number) => boolean | void, count = -1, timeout = 0) {
    progress(0);
    function progress(value: number) {
        if (value !== count && fn(value) !== false) {
            setTimeout(progress, timeout, value + 1);
        }
    }
}

/**
 * 依次执行多个函数，如果函数没有发生异常则返回，否则继续执行下一个函数。
 * @param funcs 要调用的所有函数。
 * @return 返回第一个未发生异常的函数的返回值。如果所有函数都发生异常则返回 undefined。
 * @example
 * var xhr = tryThese(() => new ActiveXObject("Microsoft.XMLHttp"), () => new XMLHttpRequest())
 */
export function tryThese(...funcs: Function[]) {
    for (const fn of funcs) {
        try {
            return fn();
        } catch (e) { }
    }
}

/**
 * 获取函数不含参数部分的源码。
 * @param fn 函数。
 * @return 返回源码。根据执行环境的不同，其中可能包含注释。
 * @example getSource(x => x)
 */
export function getSource(fn: Function) {
    return fn.toString().replace(/^function\s+[^(]*\s*\(.*?\)\s*\{[\r\n]*/, "").replace(/\s*\}\s*$/, "").replace(/^(?:\([^)]*\)|[^=]+)\s*=>\s*/, "").replace(/\\u([0-9a-f]{3})([0-9a-f])/gi, (a: string, b: string, c: string) => String.fromCharCode((parseInt(b, 16) * 16 + parseInt(c, 16))));
}
