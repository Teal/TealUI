/**
 * @fileOverview 实现类、类继承以及类事件。
 */

/**
 * 所有自定义类的基类。
 * @class
 */
function Base() { }

/**
 * 继承当前类创建派生类。
 * @param {Object} [prototype] 子类实例成员列表。其中 `contructor` 成员表示类型构造函数。
 * @returns {Function} 返回继承创建的子类。
 * @remark
 * #### 单继承
 * 此函数只实现单继承。不同于真正面向对象的语言，
 * 子类的构造函数默认不会调用父类构造函数，除非子类不存在新的构造函数。
 * 
 * `Base.extend` 实际上创建一个新的函数，其原型指向 `Base` 的原型。
 * 由于共享原型链，如果类的成员存在引用成员，则类所有实例将共享它们。
 * 因此创建类型时应避免直接声明引用成员，而是改在构造函数里创建。
 * 
 * @example
 * var MyClass = Base.extend({  // 创建一个子类。
 * 	  type: 'a'
 * });
 * 
 * var obj = new MyClass(); // 创建子类的实例。
 */
Base.extend = function (prototype) {

    // 未指定函数则使用默认构造函数(Object.prototype.constructor)。
    prototype = prototype || {};

    var subClass;

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
        var key;
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

};

//#region @事件

/**
 * 添加一个事件监听器。
 * @param {String} eventName 要添加的事件名。
 * @param {Function} eventListener 要添加的事件监听器。监听器返回 @false 则终止事件。
 * @returns this
 * @example
 * new Base().on('click', function (e) {
 * 		return true;
 * });
 */
Base.prototype.on = function (eventName, eventListener) {
    typeof console === "object" && console.assert(eventListener instanceof Function, "base.on(eventName, eventListener: 必须是函数)");

    var me = this;

    // 获取存储事件对象的空间。
    var events = me.__events__ || (me.__events__ = {});

    // 获取当前事件对应的函数监听器列表。
    var eventListeners = events[eventName];

    // 如果未绑定过这个事件, 则创建列表，否则添加到列表末尾。
    if (eventListeners) {
        eventListeners.push(eventListener);
    } else {
        events[eventName] = [eventListener];
    }

    return me;
};

/**
 * 删除一个或多个事件监听器。
 * @param {String} [eventName] 要删除的事件名。如果不传递此参数，则删除全部事件的全部监听器。
 * @param {Function} [eventListener] 要删除的事件处理函数。如果不传递此参数，在删除指定事件的全部监听器。
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
 *      var fn =  function () {};
 *      elem.on('click', fn);
 *      elem.off('click', fn); // fn  被成功删除。
 *
 * 如果同一个 *eventListener* 被增加多次，off 只删除第一个。
 * @example
 * var base = new Base(); // 创建一个实例。
 * function fn() { }
 * base.on('click', fn); // 绑定一个 click 事件。
 * base.off('click', fn); // 删除一个 click 事件。
 */
Base.prototype.off = function (eventName, eventListener) {

    // 获取本对象 本对象的数据内容 本事件值
    var me = this;
    var events = me.__events__;

    if (events) {

        // 获取指定事件的监听器。
        var eventListeners;
        if ((eventListeners = events[eventName])) {

            // 如果删除特定的处理函数。
            // 搜索特定的处理函数。
            if (eventListener) {
                var index = eventListeners.indexOf(eventListener);
                index >= 0 && eventListeners.splice(eventListener, index);
                eventListener = eventListeners.length;
            }

            // 如果不存在任何事件，则直接删除整个事件处理器。
            if (!eventListener) {
                delete events[eventName];
            }

        } else if (!eventName) {
            delete me.__events__;
        }

    }

    return me;
};

/**
 * 触发一个事件。
 * @param {String} eventName 要触发的事件名。
 * @param {Object} eventArgs 传递给监听器的参数。
 * @returns 如果事件被阻止则返回 @false，否则返回 @true。
 * @example
 * var base = new Base(); // 创建一个实例。
 * base.on('click', function (e) { alert("事件触发了"); }); // 绑定一个 click 事件。
 * base.trigger('click'); // 手动触发 click， 即执行  on('click') 过的函数。
 */
Base.prototype.trigger = function (eventName, eventArgs) {
    var eventListeners = this.__events__;
    if (eventListeners && (eventListeners = eventListeners[eventName])) {
        eventListeners = eventListeners.slice(0);
        for (var i = 0, eventListener; (eventListener = eventListeners[i]); i++) {
            if (eventListener.call(this, eventArgs) === false) {
                return false;
            }
        }
    }
    return true;
};

//#endregion
