/**
 * @author xuld
 * @fileOverview 提供类的支持。
 */

include("core/base.js");

var Class = (function () {

    /**
	 * 所有自定义类的基类。
	 */
    function Base() {

    }

    Base.prototype = {

        constructor: Base,

        toString: function () {
            for (var item in window) {
                if (window[item] === this.constructor)
                    return item;
            }

            return Object.prototype.toString.call(this);
        },

        //#region Event

        /**
         * 增加一个事件监听者。
         * @param {String} eventName 事件名。
         * @param {Function} eventHandler 监听函数。当事件被处罚时会执行此函数。
         * @param {Object} scope=this *eventHandler* 执行时的作用域。
         * @return this
         * @example
         * <pre>
         *
         * // 创建一个类 A
         * var A = new Class({
         *
         * });
         *
         * // 创建一个变量。
         * var a = new A();
         *
         * // 绑定一个 click 事件。
         * a.on('click', function (e) {
         * 		return true;
         * });
         * </pre>
         */
        on: function (type, fn, scope) {

            assert.isFunction(fn, 'Class.Base#on(eventName, eventHandler, scope): {eventHandler} ~');

            // 获取本对象 本对象的数据内容 本事件值
            var me = this,

                // 获取存储事件对象的空间。
                data = me.$event || (me.$event = {}),

                // 获取当前事件对应的函数监听器。
                eventHandler = data[type];

            // 生成默认的事件作用域。
            scope = [fn, scope || me];

            // 如果未绑定过这个事件, 则不存在监听器，先创建一个有关的监听器。
            if (!eventHandler) {

                // 生成实际处理事件的监听器。
                data[type] = eventHandler = function () {
                    var handlers = arguments.callee.handlers.slice(0),
                        handler,
                        i = 0,
                        length = handlers.length;

                    // 循环直到 return false。
                    while (i < length) {
                        handler = handlers[i++];
                        if (handler[0].apply(handler[1], arguments) === false) {
                            return false;
                        }
                    }

                    return true;
                };

                // 当前事件的全部函数。
                eventHandler.handlers = [scope];

            } else {

                // 添加到 handlers 。
            	eventHandler.handlers.push(scope);
            }


            return me;
        },

        /**
         * 手动触发一个监听器。
         * @param {String} eventName 监听名字。
         * @param {Object} [e] 传递给监听器的事件对象。
         * @return this
         * @example <pre>
         *
         * // 创建一个类 A
         * var A = new Class({
         *
         * });
         *
         * // 创建一个变量。
         * var a = new A();
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
        trigger: function (type) {

            // 获取本对象 本对象的数据内容 本事件值 。
            var data = this.$event;

            // 执行事件。
            return !data || !(data = data[type]) || (arguments.length <= 1 ? data() : data.apply(null, [].slice.call(arguments, 1)));

        },

        /**
         * 删除一个或多个事件监听器。
         * @param {String} [eventName] 事件名。如果不传递此参数，则删除全部事件的全部监听器。
         * @param {Function} [eventHandler] 回调器。如果不传递此参数，在删除指定事件的全部监听器。
         * @return this
         * @remark
         * 注意: `function () {} !== function () {}`, 这意味着下列代码的 un 将失败:
         * <pre>
         * elem.on('click', function () {});
         * elem.un('click', function () {});   // 无法删除 on 绑定的函数。
         * </pre>
         * 正确的做法是把函数保存起来。 <pre>
         * var fn =  function () {};
         * elem.on('click', fn);
         * elem.un('click', fn); // fn  被成功删除。
         *
         * 如果同一个 *eventListener* 被增加多次， un 只删除第一个。
         * </pre>
         * @example
         * <pre>
         *
         * // 创建一个类 A
         * var A = new Class({
         *
         * });
         *
         * // 创建一个变量。
         * var a = new A();
         *
         * var fn = function (e) {
         * 		return true;
         * };
         *
         * // 绑定一个 click 事件。
         * a.on('click', fn);
         *
         * // 删除一个 click 事件。
         * a.un('click', fn);
         * </pre>
         */
        un: function (type, fn) {

            assert(!fn || typeof fn === 'function', 'Class.Base#un(eventName, eventHandler): {eventHandler} 必须是函数。', fn);

            // 获取本对象 本对象的数据内容 本事件值
            var me = this,
                data = me.$event,
                eventHandler,
                handlers,
                i;

            if (data) {

                // 获取指定事件的监听器。
                if (eventHandler = data[type]) {

                    // 如果删除特定的处理函数。
                    // 搜索特定的处理函数。
                    if (fn) {

                        handlers = eventHandler.handlers;
                        i = handlers.length;

                        // 根据常见的需求，这里逆序搜索有助于提高效率。
                        while (i-- > 0) {

                            if (handlers[i][0] === eventHandler) {

                                // 删除 hander 。
                                handlers.splice(i, 1);

                                // 如果删除后只剩 0 个句柄，则删除全部数据。
                                fn = handlers.length;

                                break;
                            }
                        }

                    }

                    // 检查是否存在其它函数或没设置删除的函数。
                    if (!fn) {

                        // 删除对事件处理句柄的全部引用，以允许内存回收。
                        delete data[type];
                    }
                } else if (!type) {
                    for (type in data)
                        delete data[type];
                }
            }
            return me;
        },

        /**
         * 增加一个仅监听一次的事件监听者。
         * @param {String} type 事件名。
         * @param {Function} listener 监听函数。当事件被处罚时会执行此函数。
         * @param {Object} scope=this *listener* 执行时的作用域。
         * @return this
         * @example <pre>
         *
         * // 创建一个类 A
         * var A = new Class({
         *
         * });
         *
         * // 创建一个变量。
         * var a = new A();
         *
         * a.once('click', function (e) {
         * 		trace('click 被触发了');
         * });
         *
         * a.trigger('click');   //  输出  click 被触发了
         * a.trigger('click');   //  没有输出
         * </pre>
         */
        once: function (type, fn, scope) {

            assert.isFunction(fn, 'Class.Base#once(type, fn): {fn} ~');

            // 先插入一个用于删除句柄的函数。
            return this.on(type, function () {
                this.un(type, fn).un(type, arguments.callee);
            }, this).on(type, fn, scope);
        }

        //#endregion

    };

    /**
	 * 扩展当前类的动态方法。
	 * @param {Object} members 用于扩展的成员列表。
	 * @return this
	 * @see #implementIf
	 * @example 以下示例演示了如何扩展 Number 类的成员。<pre>
	 * Number.implement({
	 *      sin: function () {
	 * 	        return Math.sin(this);
	 *      }
	 * });
	 *
	 * (1).sin();  //  Math.sin(1);
	 * </pre>
	 */
    Base.implement = function (members) {

        assert(this.prototype, "MyClass.implement(members): 无法扩展当前类，因为当前类的 prototype 为空。");

        // 直接将成员复制到原型上即可 。
        Object.extend(this.prototype, members);

        return this;
    };

    /**
	 * 继承当前类创建并返回子类。
	 * @param {Object/Function} [methods] 子类的员或构造函数。
	 * @return {Function} 返回继承出来的子类。
	 * @remark
	 * 在 Javascript 中，继承是依靠原型链实现的， 这个函数仅仅是对它的包装，而没有做额外的动作。
	 *
	 * 成员中的 constructor 成员 被认为是构造函数。
	 *
	 * 这个函数实现的是 单继承。如果子类有定义构造函数，则仅调用子类的构造函数，否则调用父类的构造函数。
	 *
	 * 要想在子类的构造函数调用父类的构造函数，可以使用 {@link JPlus.Base#base} 调用。
	 *
	 * 这个函数返回的类实际是一个函数，但它被 {@link Class.Native} 修饰过。
	 *
	 * 由于原型链的关系， 肯能存在共享的引用。 如: 类 A ， A.prototype.c = []; 那么，A的实例 b ,
	 * d 都有 c 成员， 但它们共享一个 A.prototype.c 成员。 这显然是不正确的。所以你应该把 参数 quick
	 * 置为 false ， 这样， A创建实例的时候，会自动解除共享的引用成员。 当然，这是一个比较费时的操作，因此，默认
	 * quick 是 true 。
	 *
	 * 也可以把动态成员的定义放到 构造函数， 如: this.c = []; 这是最好的解决方案。
	 *
	 * @example 下面示例演示了如何创建一个子类。
	 * <pre>
	 * var MyClass = new Class(); //创建一个类。
	 *
	 * var Child = MyClass.extend({  // 创建一个子类。
	 * 	  type: 'a'
	 * });
	 *
	 * var obj = new Child(); // 创建子类的实例。
	 * </pre>
	 */
    Base.extend = function (members) {

        // 未指定函数 使用默认构造函数(Object.prototype.constructor);

        // 生成子类 。
        var subClass = members && members.hasOwnProperty("constructor") ? members.constructor : function () {

            // 调用父类构造函数 。
            return arguments.callee.base.apply(this, arguments);

        }, delegateClass = function () {

        	// 覆盖构造函数。
        	this.constructor = subClass;
        };

    	// 在高级浏览器优先使用 __proto__ 以节约内存。
        if (subClass.__proto__) {
        	subClass.__proto__ = Base;
        } else {
        	Object.extend(subClass, Base);
        }

        // 代理类 。
        delegateClass.prototype = this.prototype;

        // 指定成员 。
        subClass.prototype = Object.extend(new delegateClass, members);

		// 绑定父类。
        subClass.base = this;

        // 创建类 。
        return subClass;

    };

    /**
	 * 创建一个类。
	 * @param {Object/Function} [methods] 类成员列表对象或类构造函数。
	 * @return {Function} 返回创建的类。
	 * @see Class.Base
	 * @see Class.Base.extend
	 * @example 以下代码演示了如何创建一个类:
	 * <pre>
	 * var MyCls = Class({
	 *
	 *    constructor: function (a, b) {
	 * 	      alert('构造函数执行了 ' + a + b);
	 *    },
	 *
	 *    say: function(){
	 *    	alert('调用了 say 函数');
	 *    }
	 *
	 * });
	 *
	 *
	 * var c = new MyCls('参数1', '参数2');  // 创建类。
	 * c.say();  //  调用 say 方法。
	 * </pre>
	 */
    function Class(members) {

        // 所有类都是继承 Class.Base 创建的。
        return Base.extend(members);
    }

    /**
	 * 所有类的基类。
	 * @abstract class
	 * {@link Class.Base} 提供了全部类都具有的基本函数。
	 */
    Class.Base = Base;

    return Class;

})();
