/**
 * 用于快速定义一个类。
 */
export class Class {

    /**
     * 继承当前类创建派生类。
     * @param prototype 子类实例成员列表。其中 `contructor` 成员表示类型构造函数。
     * @return 返回继承创建的子类。
     * @desc
     * 此函数只实现单继承。不同于真正面向对象的语言，
     * 子类的构造函数默认不会调用父类构造函数，除非子类不存在新的构造函数。
     *
     * `Class.extend` 实际上创建一个新的函数，其原型指向 `Class` 的原型。
     * 由于共享原型链，如果类的成员存在引用成员，则类所有实例将共享它们。
     * 因此创建类型时应避免直接声明引用成员，而是改在构造函数里创建。
     * @example
     * var MyClass = Class.extend({  // 创建一个子类。
     * 	  type: 'a'
     * });
     *
     * var obj = new MyClass(); // 创建子类的实例。
     */
    static extend(prototype?: any) {

        // 未指定函数则使用默认构造函数(Object.prototype.constructor)。
        prototype = prototype || {};

        let subClass: { new(...args: any[]): any; extend: (typeof Class)["extend"] };

        // 生成缺省构造函数：直接调用父类构造函数 。
        if (!Object.prototype.hasOwnProperty.call(prototype, "constructor")) {
            prototype.constructor = function Class() {
                return (subClass as any).__proto__.apply(this, arguments);
            };
        }

        // 直接使用构造函数作为类型本身。
        subClass = prototype.constructor;

        // 设置派生类的原型。
        subClass.prototype = prototype;

        /*@cc_on

        // IE6-9: 不支持 __proto__
        if (!('__proto__' in Object.prototype)) {
            let key;
            function BaseClass() {
                for (key in prototype) {
                    this[key] = prototype[key];
                }
                // IE6-8 无法遍历 JS 内置 constructor 属性，这里手动覆盖。
                this.constructor = subClass;
            };
            for (key in this) {
                subClass[key] = this[key];
            }
            BaseClass.prototype = this.prototype;
            subClass.prototype = new BaseClass;
        }

        @*/

        (subClass as any).__proto__ = this;
        prototype.__proto__ = this.prototype;

        return subClass;

    }

}
