/**
 * @fileOverview 实现类、类继承以及类事件。
 * @author xuld@vip.qq.com
 */

/**
 * 所有自定义类的基类。
 * @remark
 * ### 创建最简单的类
 * ```let Animal = Class.extend();```
 * 
 * ### 为类添加字段和方法
 * 
 *      let Animal = Class.extend({
 *      
 *          // 我是字段（Field）
 *          name: '小黑',
 *      
 *          // 我是方法（Method）
 *          say: function () {
 *              alert(this.name + "调用了 say 方法");
 *          }
 *      });
 * 
 *      let ani = new Animal();  // 创建一个类的实例。
 *      ani.name = '大白';       // 为字段赋值。
 *      ani.say();               // 调用 Animal 类的 say 方法。
 * 
 * ### 为类添加构造函数
 * 
 *      let Animal = Class.extend({
 *          constructor: function (args) {
 *              alert("正在执行 Animal 类的构造函数。");
 *          }
 *      });
 * 
 *      let ani = new Animal(); // 创建一个类的实例时会调用类构造函数。
 * 
 * 如果子类未定义构造函数，则继承父类构造函数。
 * 
 * ### 继承
 * 
 *     <pre>
 *         let Animal = Class.extend({
 *             say: function () {
 *                 alert("正在执行 Animal 类的 say 方法");
 *             },
 *             constructor: function (args) {
 *                 alert("正在执行 Animal 类的构造函数。");
 *             }
 *         });
 *     </pre>
 *     <pre>
 *         // 继承 Animal 类创建子类。
 *         let Dog = Animal.extend({
 *             say2: function () {
 *                 alert("正在执行 Dog 类的 say 方法");
 *             }
 *         });
 *     </pre>
 *     <pre>
 *         let dog = new Dog(); // 创建一个类的实例。
 *         dog.say(); // 调用 Animal 类的 say 方法。
 *         dog.say2(); // 调用 Dog 类的 say2 方法。
 *     </pre>
 * 
 * 如果子类需要调用被覆盖的父类成员，可通过原型调用，如 `Animal.progress.say.apply(this, arguments)`。
 * 
 * ### 事件
 * 
 * 自定义类默认支持事件模型。
 * 
 *     <pre>
 *         let Animal = Class.extend();
 *         let ani = new Animal();
 *         ani.on('needsay', function (name) {
 *             alert("needsay事件被触发了， 参数 name=" + name);
 *         });
 *         ani.trigger('needsay', "触发needsay事件时的参数");
 *     </pre>
 */
export class Class {

    /**
     * 继承当前类创建派生类。
     * @param {Object} [prototype] 子类实例成员列表。其中 `contructor` 成员表示类型构造函数。
     * @returns {Function} 返回继承创建的子类。
     * @remark
     * #### 单继承
     * 此函数只实现单继承。不同于真正面向对象的语言，
     * 子类的构造函数默认不会调用父类构造函数，除非子类不存在新的构造函数。
     * 
     * `Class.extend` 实际上创建一个新的函数，其原型指向 `Class` 的原型。
     * 由于共享原型链，如果类的成员存在引用成员，则类所有实例将共享它们。
     * 因此创建类型时应避免直接声明引用成员，而是改在构造函数里创建。
     * 
     * @example
     * let MyClass = Class.extend({  // 创建一个子类。
     * 	  type: 'a'
     * });
     * 
     * let obj = new MyClass(); // 创建子类的实例。
     */
    static extend(prototype: { __proto__?: {} }) {

        // 未指定函数则使用默认构造函数(Object.prototype.constructor)。
        prototype = prototype || {};

        let subClass;

        // 生成缺省构造函数：直接调用父类构造函数 。
        if (!Object.prototype.hasOwnProperty.call(prototype, "constructor")) {
            prototype.constructor = function Class() {
                // 缺省构造函数：直接调用父类构造函数。
                return subClass.__proto__.apply(this, arguments);
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

        subClass.__proto__ = this;
        prototype.__proto__ = this.prototype;

        return subClass;

    }

    //#region 事件

    /**
     * 存储当前对象的所有事件。
     */
    private _events: { [eventName: string]: Function[] }

    /**
     * 添加一个事件监听器。
     * @param eventName 要添加的事件名。
     * @param eventListener 要添加的事件监听器。监听器返回 @false 则终止事件。
     * @returns this
     * @example
     * new Class().on('click', function (e) {
     * 		return true;
     * });
     */
    on(eventName: string, eventListener: Function) {

        // 获取存储事件对象的空间。
        let events = this._events || (this._events = {});

        // 获取当前事件对应的函数监听器列表。
        let eventListeners = events[eventName];

        // 如果未绑定过这个事件, 则创建列表，否则添加到列表末尾。
        if (eventListeners) {
            eventListeners.push(eventListener);
        } else {
            events[eventName] = [eventListener];
        }

        return this;
    }

    /**
     * 删除一个或多个事件监听器。
     * @param eventName 要删除的事件名。如果不传递此参数，则删除全部事件的全部监听器。
     * @param eventListener 要删除的事件处理函数。如果不传递此参数，在删除指定事件的全部监听器。
     * @returns this
     * @remark
     * #### 绑定引用
     * 注意: `function () {} !== function () {}`, 这意味着下列代码的 off 将失败:
     * 
     *      base.on('click', function () {});
     *      base.off('click', function () {});   // 无法删除 on 绑定的函数。
     * 
     * 正确的做法是把函数保存起来。 
     * 
     *      let fn =  function () {};
     *      elem.on('click', fn);
     *      elem.off('click', fn); // fn  被成功删除。
     *
     * 如果同一个 *eventListener* 被增加多次，off 只删除第一个。
     * @example
     * let base = new Class(); // 创建一个实例。
     * function fn() { }
     * base.on('click', fn); // 绑定一个 click 事件。
     * base.off('click', fn); // 删除一个 click 事件。
     */
    off(eventName: string, eventListener: Function) {

        // 获取本对象 本对象的数据内容 本事件值
        let events = this._events;
        if (events) {

            // 获取指定事件的监听器。
            let listeners = events[eventName];
            if (listeners) {

                // 如果删除特定的处理函数。
                // 搜索特定的处理函数。
                if (eventListener) {
                    let index = listeners.indexOf(eventListener);
                    index >= 0 && listeners.splice(index, 1);
                    eventListener = listeners.length as any;
                }

                // 如果不存在任何事件，则直接删除整个事件处理器。
                if (!eventListener) {
                    delete events[eventName];
                }

            } else if (!eventName) {
                delete this._events;
            }

        }
        return this;
    }

    /**
     * 触发一个事件。
     * @param {String} eventName 要触发的事件名。
     * @param {Object} eventArgs 传递给监听器的参数。
     * @returns 如果事件被阻止则返回 @false，否则返回 @true。
     * @example
     * let base = new Class(); // 创建一个实例。
     * base.on('click', function (e) { alert("事件触发了"); }); // 绑定一个 click 事件。
     * base.trigger('click'); // 手动触发 click， 即执行  on('click') 过的函数。
     */
    trigger(eventName, eventArgs) {
        let listeners = this._events as any;
        if (listeners && (listeners = listeners[eventName])) {
            // 加速仅 1 个处理函数的情况。
            if (listeners.length === 1) {
                switch (arguments.length) {
                    case 1:
                        return listeners[0].call(this) !== false;
                    case 2:
                        return listeners[0].call(this, arguments[1]) !== false;
                    default:
                        return listeners[0].apply(this, Array.prototype.slice.call(arguments, 1)) !== false;
                }
            }
            listeners = listeners.slice(0);
            for (let i = 0, listener, args = Array.prototype.slice.call(arguments, 1); (listener = listeners[i]); i++) {
                if (listener.apply(this, args) === false) {
                    return false;
                }
            }
        }
        return true;
    }

    //#endregion

}
