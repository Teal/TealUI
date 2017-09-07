/**
 * 表示一个委托。
 */
export class Delegate<T extends Function> {

    /**
     * 获取所有委托函数。
     */
    funcs: T[];

    /**
     * 初始化新的委托。
     * @param funcs 绑定的函数。
     */
    constructor(...funcs: T[]) {
        const delegate = function (this: any) {
            for (const handler of delegate.funcs) {
                handler.apply(this, arguments);
            }
        } as any as Delegate<T>;
        for (const key in Delegate.prototype) {
            (delegate as any)[key] = (Delegate.prototype as any)[key];
        }
        delegate.funcs = funcs;
        return delegate;
    }

    /**
     * 增加一个委托函数。
     * @param func 要增加的函数。
     * @example new Delegate().add(function () {})
     */
    add(func: T) {
        this.funcs.push(func);
        return this;
    }

    /**
     * 删除一个委托函数。
     * @param func 要删除的函数。
     * @example new Delegate().remove(function () {})
     */
    remove(func: T) {
        const index = this.funcs.indexOf(func);
        if (index >= 0) {
            this.funcs.splice(index, 1);
        }
        return this;
    }

    /**
     * 删除所有委托函数。
     * @example new Delegate().clear()
     */
    clear() {
        this.funcs.length = 0;
        return this;
    }

}

export interface Delegate<T extends Function> {
    (...args: any[]): void;
}

export default Delegate;
