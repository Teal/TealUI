/**
 * @fileOverview 实现类、类继承以及类事件。
 */

//#include core/core.js

/**
 * 所有自定义类的基类。
 * @class
 */
function Base() { }

/**
 * 继承当前类创建派生类。
 * @param {Object?} members 子类实例成员列表。其中 contructor 表示类型构造函数。
 * @return {Function} 返回继承出来的子类。
 * @remark
 * 此函数只实现单继承。不同于真正面向对象的语言，
 * 子类的构造函数默认不会调用父类构造函数，除非子类不存在新的构造函数。
 * 
 * Base.extend 实际上创建一个新的函数，其原型指向 Base 的原型。
 * 由于共享原型链，如果类的成员存在引用成员，则类所有实例将共享它们。
 * 因此创建类型时应避免直接声明引用成员，而是改在构造函数里创建。
 * 
 * 要想在子类的构造函数调用父类的构造函数，可以使用 {@link Base#base} 属性。
 *
 * @example 下面示例演示了如何创建一个子类。
 * <pre>
 *
 * var MyClass = Base.extend({  // 创建一个子类。
 * 	  type: 'a'
 * });
 *
 * var obj = new MyClass(); // 创建子类的实例。
 * </pre>
 */
Base.extend = function (members) {

    // 未指定函数则使用默认构造函数(Object.prototype.constructor)。
    members = members || {};

    // 生成缺省构造函数：直接调用父类构造函数 。
    if (!members.hasOwnProperty("constructor")) {
        members.constructor = function () {
            // 缺省构造函数：直接调用父类构造函数。
            return this.constructor.__proto__.apply(this, arguments);
        };
    }

    // 直接使用构造函数作为类型本身。
    var subClass = members.constructor;

    // 设置派生类的原型。
    subClass.__proto__ = this;
    members.__proto__ = this.prototype;
    subClass.prototype = members;

    // #if CompactMode

    // IE6-9: 不支持 __proto__
    if (!Object.prototype.__proto__) {
        Object.extend(subClass, this);
        var delegateClass = function() { };
        delegateClass.prototype = this.prototype;
        subClass.prototype = Object.extend(new delegateClass, members);
        subClass.prototype.constructor = subClass;
    }

    // #endif

    return subClass;

};

//#region 事件支持

/**
 * 添加一个事件监听器。
 * @param {String} eventName 要添加的事件名。
 * @param {Function} eventListener 要添加的事件监听器。
 * @return this
 * @example
 * <pre>
 *
 * // 创建一个变量。
 * var a = new Base();
 *
 * // 绑定一个 click 事件。
 * a.on('click', function (e) {
 * 		return true;
 * });
 * </pre>
 */
Base.prototype.on = function (eventName, /*Function*/eventListener) {

    var me = this,

        // 获取存储事件对象的空间。
        events = me.__events__ || (me.__events__ = {}),

        // 获取当前事件对应的函数监听器列表。
        eventListeners = events[eventName];

    // 如果未绑定过这个事件, 则创建列表，否则添加到列表末尾。
    if (eventListeners) {
        eventListeners.push(eventListener);
    } else {
        events[eventName] = [eventListener];
    }

    return me;
};

/**
 * 手动触发一个监听器。
 * @param {String} eventName 要触发的事件名。
 * @param {Object} eventArgs 传递给监听器的事件对象。
 * @return 如果事件被阻止则返回 false，否则返回 true。
 * @example <pre>
 *
 * // 创建一个实例。
 * var a = new Base();
 *
 * // 绑定一个 click 事件。
 * a.on('click', function (e) {
 * 		return true;
 * });
 *
 * // 手动触发 click， 即执行  on('click') 过的函数。
 * a.trigger('click');
 * </pre>
 */
Base.prototype.trigger = function (eventName, eventArgs) {

    // 检索所有绑定的事件监听器。
    var eventListeners = this.__events__;
    if (eventListeners && (eventListeners = eventListeners[eventName])) {
        eventListeners = eventListeners.slice(0);
        for (var eventListener, i = 0; eventListener = eventListeners[i]; i++) {
            if (eventListener.call(this, eventArgs) === false) {
                return false;
            }
        }
    }

    return true;

};

/**
 * 删除一个或多个事件监听器。
 * @param {String?} eventName 要删除的事件名。如果不传递此参数，则删除全部事件的全部监听器。
 * @param {Function?} eventListener 要删除的事件处理函数。如果不传递此参数，在删除指定事件的全部监听器。
 * @return this
 * @remark
 * 注意: `function () {} !== function () {}`, 这意味着下列代码的 off 将失败:
 * <pre>
 * elem.on('click', function () {});
 * elem.off('click', function () {});   // 无法删除 on 绑定的函数。
 * </pre>
 * 正确的做法是把函数保存起来。 <pre>
 * var fn =  function () {};
 * elem.on('click', fn);
 * elem.off('click', fn); // fn  被成功删除。
 *
 * 如果同一个 *eventListener* 被增加多次， off 只删除第一个。
 * </pre>
 * @example
 * <pre>
 *
 * // 创建一个实例。
 * var a = new Base();
 *
 * var fn = function (e) {
 * 		return true;
 * };
 *
 * // 绑定一个 click 事件。
 * a.on('click', fn);
 *
 * // 删除一个 click 事件。
 * a.off('click', fn);
 * 
 * </pre>
 */
Base.prototype.off = function (eventName, /*Function?*/eventListener) {

    // 获取本对象 本对象的数据内容 本事件值
    var me = this,
        events = me.__events__,
        eventListeners;

    if (events) {

        // 获取指定事件的监听器。
        if (eventListeners = events[eventName]) {

            // 如果删除特定的处理函数。
            // 搜索特定的处理函数。
            if (eventListener) {
                eventListeners.remove(eventListener);
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

//#endregion
