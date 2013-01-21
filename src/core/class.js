/**
 * @author xuld
 * @fileOverview 提供类的支持。
 */


include("core/base.js");

var Class = (function () {
	
	/**
	 * 空对象。
	 * @type Object
	 */
	var emptyObj = {};

	/**
	 * 创建一个类。
	 * @param {Object/Function} [methods] 类成员列表对象或类构造函数。
	 * @return {Function} 返回创建的类。
	 * @see JPlus.Base
	 * @see JPlus.Base.extend
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
	 * 所有自定义类的基类。
	 */
	function Base() {

	}

	Base.prototype = {

		/**
		 * 获取当前类对应的数据字段。
		 * @proteced virtual
		 * @returns {Object} 一个可存储数据的对象。
		 * @remark 默认地， 此返回返回 this 。
		 * 此函数的意义在于将类对象和真实的数据对象分离。
		 * 这样可以让多个类实例共享一个数据对象。
		 * @example
		 * <pre>
		 *
		 * // 创建一个类 A
		 * var A = new Class({
		 *    fn: function (a, b) {
		 * 	    alert(a + b);
		 *    }
		 * });
		 *
		 * // 创建一个变量。
		 * var a = new A();
		 *
		 * a.dataField().myData = 2;
		 * </pre>
		 */
		dataField: function () {
			return this.$data || (this.$data = {});
		},

		/**
		 * 调用父类的成员函数。
		 * @param {String} fnName 调用的函数名。
		 * @param {Object} [...] 调用的参数。如果不填写此项，则自动将当前函数的全部参数传递给父类的函数。
		 * @return {Object} 返回父类函数的返回值。
		 * @protected
		 * @example
		 * <pre>
		 *
		 * // 创建一个类 A
		 * var A = new Class({
		 *    fn: function (a, b) {
		 * 	    alert(a + b);
		 *    }
		 * });
		 *
		 * // 创建一个子类 B
		 * var B = A.extend({
		 * 	  fn: function (a, b) {
		 * 	    this.base('fn'); // 子类 B#a 调用父类 A#a
		 * 	    this.base('fn', 2, 4); // 子类 B#a 调用父类 A#a
		 *    }
		 * });
		 *
		 * new B().fn(1, 2); // 输出 3 和 6
		 * </pre>
		 */
		base: function (fnName) {

			var me = this.constructor,

				fn = this[fnName],

				oldFn = fn,

				args = arguments;

			assert(fn, "Class.Base#base(fnName, args): 子类不存在 {fnName} 的属性或方法。", fnName);

			// 标记当前类的 fn 已执行。
			fn.$bubble = true;

			assert(!me || me.prototype[fnName], "Class.Base#base(fnName, args): 父类不存在 {fnName} 的方法。", fnName);

			// 保证得到的是父类的成员。

			do {
				me = me.base;
				assert(me && me.prototype[fnName], "Class.Base#base(fnName, args): 父类不存在 {fnName} 的方法。", fnName);
			} while ('$bubble' in (fn = me.prototype[fnName]));

			assert.isFunction(fn, "Class.Base#base(fnName, args): 父类的成员 {fn}不是一个函数。  ");

			fn.$bubble = true;

			// 确保 bubble 记号被移除。
			try {
				if (args.length <= 1)
					return fn.apply(this, args.callee.caller.arguments);
				args[0] = this;
				return fn.call.apply(fn, args);
			} finally {
				delete fn.$bubble;
				delete oldFn.$bubble;
			}
		},

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
		on: function (eventName, eventHandler, scope) {

			assert.isFunction(eventHandler, 'JPlus.Base#on(eventName, eventHandler, scope): {eventHandler} ~');

			// 获取本对象 本对象的数据内容 本事件值
			var me = this,
				data = me.dataField(),
				eventListener,
				eventManager;

			// 获取存储事件对象的空间。
			data = data.$event || (data.$event = {});

			// 获取当前事件对应的函数监听器。
			eventListener = data[eventName];

			// 生成默认的事件作用域。
			scope = [eventHandler, scope || me];

			// 如果未绑定过这个事件, 则不存在监听器，先创建一个有关的监听器。
			if (!eventListener) {

				// 获取事件管理对象。
				eventManager = getMgr(me, eventName);

				// 生成实际处理事件的监听器。
				data[eventName] = eventListener = function (e) {
					var eventListener = arguments.callee,
						handlers = eventListener.handlers.slice(0),
						handler,
						i = -1,
						length = handlers.length;

					// 循环直到 return false。
					while (++i < length) {
						handler = handlers[i];
						if (handler[0].call(handler[1], e) === false) {

							// 如果存在 stopEvent 处理函数，则调用。
							// 如果当前函数是因为 initEvent 返回 false 引起，则不执行 stopEvent 。
							if (handler[2] !== true && (handler = eventListener.stop)) {
								handler[0].call(handler[1], e);
							}
							return false;
						}
					}

					return true;
				};

				// 当前事件的全部函数。
				eventListener.handlers = eventManager.initEvent ?
					[[eventManager.initEvent, me, true], scope] :
					[scope];

				// 如果事件允许阻止，则存储字段。
				if (eventManager.stopEvent) {
					eventListener.stop = [eventManager.stopEvent, me];
				}

				// 如果事件支持自定义的添加方式，则先添加。
				if (eventManager.add) {
					eventManager.add(me, eventName, eventListener);
				}

			} else {

				// 添加到 handlers 。
				eventListener.handlers.push(scope);
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
		trigger: function (eventName, e) {

			// 获取本对象 本对象的数据内容 本事件值 。
			var me = this,
				data = me.dataField().$event,
				eventManager;

			// 执行事件。
			return !data || !(data = data[eventName]) || ((eventManager = getMgr(me, eventName)).dispatch ? eventManager.dispatch(me, eventName, data, e) : data(e));

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
		un: function (eventName, eventHandler) {

			assert(!eventHandler || typeof eventHandler === 'function', 'JPlus.Base#un(eventName, eventHandler): {eventHandler} 必须是函数。', eventHandler);

			// 获取本对象 本对象的数据内容 本事件值
			var me = this,
				data = me.dataField().$event,
				eventListener,
				handlers,
				i;

			if (data) {

				// 获取指定事件的监听器。
				if (eventListener = data[eventName]) {

					// 如果删除特定的处理函数。
					// 搜索特定的处理函数。
					if (eventHandler) {

						handlers = eventListener.handlers;
						i = handlers.length;

						// 根据常见的需求，这里逆序搜索有助于提高效率。
						while (i-- > 0) {

							if (handlers[i][0] === eventHandler) {

								// 删除 hander 。
								handlers.splice(i, 1);

								// 如果删除后只剩 0 个句柄，或只剩 1个 initEvent 句柄，则删除全部数据。
								if (!i || (i === 1 && handlers[0] === true)) {
									eventHandler = 0;
								}

								break;
							}
						}

					}

					// 检查是否存在其它函数或没设置删除的函数。
					if (!eventHandler) {

						// 删除对事件处理句柄的全部引用，以允许内存回收。
						delete data[eventName];

						// 获取事件管理对象。
						data = getMgr(me, eventName);

						// 内部事件管理的删除。
						if (data.remove)
							data.remove(me, eventName, eventListener);
					}
				} else if (!eventName) {
					for (eventName in data)
						me.un(eventName);
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
		once: function (eventName, eventHandler, scope) {

			assert.isFunction(eventHandler, 'JPlus.Base#once(eventName, eventHandler): {eventHandler} ~');

			// 先插入一个用于删除句柄的函数。
			return this.on(eventName, function () {
				this.un(eventName, eventHandler).un(eventName, arguments.callee);
			}).on(eventName, eventHandler, scope);
		},

		toString: function () {
			for (var item in window) {
				if (window[item] === this.constructor)
					return item;
			}

			return Object.prototype.toString.call(this);
		}

	};

	/**
	 * 类成员方法。
	 * @type Object
	 * @namespace JPlus.Base
	 */
	Class.staticMembers = {

		// 在支持 __proto__ 的浏览器使用。
		__proto__: Function.prototype,

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
		implement: function (members) {

			assert(this.prototype, "MyClass.implement(members): 无法扩展当前类，因为当前类的 prototype 为空。");

			// 直接将成员复制到原型上即可 。
			Object.extend(this.prototype, members);

			return this;
		},

		/**
		 * 添加当前类的动态方法，该方法基于某个属性的同名方法实现。
		 * @param {String} targetProperty 要基于的属性名。
		 * @param {String} setters=undefined 设置函数的方法名数组，用空格隔开。
		 * @param {String} getters=undefined 获取函数的方法名数组，用空格隔开。
		 * @remark 使用此函数只能传递最多 3 个参数。
		 * @example <pre>
		 * MyClass.defineMethods('field', 'fn1 fn2 fn3');
		 * </pre>
		 * 等价于 <pre>
		 * MyClass.implement({
		 * 		fn1:  function(){ 
		 * 			return this.field.fn1();  
		 * 		},
		 * 		fn2:  function(){ 
		 * 			return this.field.fn2();  
		 * 		},
		 * 		fn3:  function(){ 
		 * 			this.field.fn();
		 * 			return this;
		 * 		}
		 * 	// 如果源函数返回 this, 将更新为当前的 this 。
		 * });
		 * </pre>
		 */
		defineMethods: function (targetProperty, methods, args) {

			assert.isString(methods, "MyClass.defineMethods(targetProperty, methods): {methods} ~");

			var propertyGetterFunc;

			if (/\(\)$/.test(targetProperty)) {
				propertyGetterFunc = targetProperty.substr(0, targetProperty.length - 2);
			}

			// 最后使用 implement 添加成员。
			return this.implement(Object.map(methods, function (fnName) {
				return function (arg0, arg1, arg2) {

					// 获取实际调用的函数目标对象。
					var target = propertyGetterFunc ? this[propertyGetterFunc]() : this[targetProperty],
						r;

					assert(target, "#" + targetProperty + " 不能为空。");
					assert(!target || target[fnName], "#" + targetProperty + "." + fnName + "(): 不是函数。");

					r = target[fnName];

					// 调用被代理的实际函数。
					// 不能使用 .apply: IE 6/7 原生函数不是 function 。
					r = r.apply ? r.apply(target, arguments) : r(arg0, arg1, arg2);

					// 如果不是 getter，返回 this 链式引用。
					return target === r || r === undefined ? this : r;
				};
			}, {}), args);  // 支持 Dom.implement, 传递第二个参数。
		},

		/**
		 * 为当前类注册一个事件。
		 * @param {String} eventName 事件名。如果多个事件使用空格隔开。
		 * @param {Object} properties={} 事件信息。 具体见备注。
		 * @return this
		 * @remark
		 * 事件信息是一个JSON对象，它表明了一个事件在绑定、删除和触发后的一些操作。
		 *
		 * 事件信息的原型如:
		 * <pre>
		 * ({
		 *
		 *  // 当用户执行 target.on(type, fn) 时执行下列函数:
		 * 	add: function(target, type, fn){
		 * 		// 其中 target 是目标对象，type是事件名， fn是执行的函数。
		 *  },
		 *
		 *  // 当用户执行 target.un(type, fn) 时执行下列函数:
		 *  remove: function(target, type, fn){
		 * 		// 其中 target 是目标对象，type是事件名， fn是执行的函数。
		 *  },
		 *
		 *  // 当用户执行 target.trigger(e) 时执行下列函数:
		 *  dispatch: function(target, type, fn, e){
		 * 		// 其中 target 是目标对象，type是事件名， fn是执行的函数。e 是参数。
		 *  }
		 *
		 * });
		 * </pre>
		 *
		 * 当用户使用 obj.on('事件名', 函数) 时， 系统会判断这个事件是否已经绑定过， 如果之前未绑定事件，则会创建新的函数
		 * evtTrigger， evtTrigger 函数将遍历并执行 evtTrigger.handlers 里的成员,
		 * 如果其中一个函数执行后返回 false， 则中止执行，并返回 false， 否则返回 true。
		 * evtTrigger.handlers 表示 当前这个事件的所有实际调用的函数的数组。
		 * 然后系统会调用 add(obj, '事件名', evtTrigger) 然后把 evtTrigger 保存在 obj.dataField().$event['事件名'] 中。
		 * 如果 之前已经绑定了这个事件，则 evtTrigger 已存在，无需创建。 这时系统只需把 函数 放到 evtTrigger.handlers 即可。
		 *
		 * 真正的事件触发函数是 evtTrigger， evtTrigger会执行 initEvent 和用户定义的一个事件全部函数。
		 *
		 * 当用户使用 obj.un('事件名', 函数) 时， 系统会找到相应 evtTrigger， 并从
		 * evtTrigger.handlers 删除 函数。 如果 evtTrigger.handlers 是空数组， 则使用
		 * remove(obj, '事件名', evtTrigger) 移除事件。
		 *
		 * 当用户使用 obj.trigger(参数) 时， 系统会找到相应 evtTrigger， 如果事件有trigger， 则使用
		 * dispatch(obj, '事件名', evtTrigger, 参数) 触发事件。 如果没有， 则直接调用
		 * evtTrigger(参数)。
		 *
		 * 下面分别介绍各函数的具体内容。
		 *
		 * add 表示 事件被绑定时的操作。 原型为:
		 *
		 * <pre>
		 * function add(elem, type, fn) {
		 * 	   // 对于标准的 DOM 事件， 它会调用 elem.addEventListener(type, fn, false);
		 * }
		 * </pre>
		 *
		 * elem表示绑定事件的对象，即类实例。 type 是事件类型， 它就是事件名，因为多个事件的 add 函数肯能一样的，
		 * 因此 type 是区分事件类型的关键。fn 则是绑定事件的函数。
		 *
		 * remove 类似 add。
		 *
		 * $default 是特殊的事件名，它的各个信息将会覆盖同类中其它事件未定义的信息。
		 *
		 * @example 下面代码演示了如何给一个类自定义事件，并创建类的实例，然后绑定触发这个事件。
		 * <pre>
		 * // 创建一个新的类。
		 * var MyCls = new Class();
		 *
		 * MyCls.addEvents('click', {
		 *
		 * 		add:  function (elem, type, fn) {
		 * 	   		alert("为  elem 绑定 事件 " + type );
		 * 		}
		 *
		 * });
		 *
		 * var m = new MyCls;
		 * m.on('myEvt', function () {  //  输出 为  elem 绑定 事件  myEvt
		 * 	  alert(' 事件 触发 ');
		 * });
		 *
		 * m.trigger('myEvt', 2);
		 *
		 * </pre>
		 */
		addEvents: function (eventName, properties) {

			assert.isString(eventName, "MyClass.addEvents(eventName, properties): {eventName} ~");

			// 获取存储事件信息的变量。如果不存在则创建。
			var eventObj = this.$event || (this.$event = {}),
				defaultEvent = eventObj.$default;

			if (properties) {
				Object.extendIf(properties, defaultEvent);

				// 处理 base: 'event' 字段，自动生成 add 和 remove 函数。
				if (properties.base) {
					assert(defaultEvent, "使用 base 字段功能必须预先定义 $default 事件。");
					properties.add = function (obj, type, fn) {
						defaultEvent.add(obj, this.base, fn);
					};

					properties.remove = function (obj, type, fn) {
						defaultEvent.remove(obj, this.base, fn);
					};
				}
			} else {
				properties = defaultEvent || emptyObj;
			}

			// 将 eventName 指定的事件对象都赋值为 properties。
			Object.map(eventName, properties, eventObj);

			return this;
		},

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
		extend: function (members) {

			// 未指定函数 使用默认构造函数(Object.prototype.constructor);

			// 生成子类 。
			var subClass = members && members.hasOwnProperty("constructor") ? members.constructor : function () {

				// 调用父类构造函数 。
				arguments.callee.base.apply(this, arguments);

			}, emptyFn = Function.empty;

			// 代理类 。
			emptyFn.prototype = (subClass.base = this).prototype;

			// 指定成员 。
			subClass.prototype = Object.extend(new emptyFn, members);

			// 覆盖构造函数。
			subClass.prototype.constructor = subClass;

			// 清空临时对象。
			emptyFn.prototype = null;

			// 创建类 。
			return Class.Native(subClass);

		}

	};

	/**
	 * 将一个原生的 Javascript 函数对象转换为一个类。
	 * @param {Function/Class} constructor 用于转换的对象，将修改此对象，让它看上去和普通的类一样。
	 * @return {Function} 返回生成的类。
	 * @remark 转换后的类将有继承、扩展等功能。
	 * @example <pre>
	 * function myFunc(){}
	 * 
	 * JPlus.Native(myFunc);
	 * 
	 * // 现在可以直接使用 implement 函数了。
	 * myFunc.implement({
	 * 	  a: 2
	 * });
	 * </pre>
	 */
	Class.Native = function (constructor) {

		assert.notNull(constructor, "Class.Native(constructor): constructor ~");

		// 在高级浏览器优先使用 __proto__ 以节约内存。
		if (constructor.__proto__) {
			constructor.__proto__ = Class.staticMembers;
			return constructor;
		}

		return Object.extend(constructor, Class.staticMembers);
	};

	/**
	 * 所有类的基类。
	 * @abstract class
	 * {@link Class.Base} 提供了全部类都具有的基本函数。
	 */
	Class.Base = Class.Native(Base);

	/**
	 * 获取指定的对象所有的事件管理器。
	 * @param {Object} obj 要使用的对象。
	 * @param {String} type 事件名。
	 * @return {Object} 符合要求的事件管理器，如果找不到合适的，返回默认的事件管理器。
	 */
	function getMgr(obj, eventName) {
		var clazz = obj.constructor,
			t;

		// 遍历父类，找到指定事件。
		while (!(t = clazz.$event) || !(eventName in t)) {
			if (!(clazz = clazz.base)) {
				return emptyObj;
			}
		}

		return t[eventName];
	}

	return Class;

})();




