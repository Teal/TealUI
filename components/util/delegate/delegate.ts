/**
 * 表示一个委托。
 */
export default class Delegate extends Function {

    /**
     * 获取所有委托的函数。
     */
    funcs: Function[];

    /**
     * 初始化新的委托。
     * @param funcs 所有委托的函数。
     */
    constructor(...funcs: Function[]) {
        super();
    }

    /**
     * 添加一个委托函数。
     * @param func 要添加的函数。
     * @example
     * var del = new Delegate()
     * del.add(() => { console.log("teal") })
     * del() // 控制台输出 teal
     */
    add(func: Function) {
        this.funcs.push(func);
    }

    /**
     * 删除一个委托函数。
     * @param func 要删除的函数。
     * @example
     * var fn = () => { console.log("teal") }
     * var del = new Delegate()
     * del.add(fn)
     * del.remove(fn)
     * del() // 控制台不输出
     */
    remove(func: Function) {
        const index = this.funcs.indexOf(func);
        if (index >= 0) {
            this.funcs.splice(index, 1);
        }
    }

    /**
     * 删除所有委托函数。
     * var del = new Delegate()
     * del.add(() => { console.log("teal") })
     * del.clear()
     * del() // 控制台不输出
     */
    clear() {
        this.funcs.length = 0;
    }

}

const prototype = Delegate.prototype;
const func = exports.default = function Delegate(...funcs: Function[]) {
    const delegate = function (this: any) {
        for (const handler of delegate.funcs) {
            handler.apply(this, arguments);
        }
    } as any as Delegate;
    if ((delegate as any).__proto__) {
        (delegate as any).__proto__ = func.prototype;
    } else {
        for (const key in func.prototype) {
            (delegate as any)[key] = func.prototype[key];
        }
    }
    delegate.funcs = funcs;
    return delegate;
};
func.prototype = prototype;
