/**
 * @author xuld
 * @fileOverview 提供类的支持。
 */


include("core/base.js");

var Class = (function () {

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
	 * a.data().myData = 2;
	 * </pre>
	 */
    Base.prototype.data = function () {
        return this.$data || (this.$data = {});
    };

    Base.prototype.toString = function () {
        for (var item in window) {
            if (window[item] === this.constructor)
                return item;
        }

        return Object.prototype.toString.call(this);
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

    };

    ///**
    // * 添加当前类的动态方法，该方法基于某个属性的同名方法实现。
    // * @param {String} targetProperty 要基于的属性名。
    // * @param {String} setters=undefined 设置函数的方法名数组，用空格隔开。
    // * @param {String} getters=undefined 获取函数的方法名数组，用空格隔开。
    // * @remark 使用此函数只能传递最多 3 个参数。
    // * @example <pre>
    // * MyClass.defineMethods('field', 'fn1 fn2 fn3');
    // * </pre>
    // * 等价于 <pre>
    // * MyClass.implement({
    // * 		fn1:  function(){ 
    // * 			return this.field.fn1();  
    // * 		},
    // * 		fn2:  function(){ 
    // * 			return this.field.fn2();  
    // * 		},
    // * 		fn3:  function(){ 
    // * 			this.field.fn();
    // * 			return this;
    // * 		}
    // * 	// 如果源函数返回 this, 将更新为当前的 this 。
    // * });
    // * </pre>
    // */
    //defineMethods: function (targetProperty, methods, args) {

    //	assert.isString(methods, "MyClass.defineMethods(targetProperty, methods): {methods} ~");

    //	var propertyGetterFunc;

    //	if (/\(\)$/.test(targetProperty)) {
    //		propertyGetterFunc = targetProperty.substr(0, targetProperty.length - 2);
    //	}

    //	// 最后使用 implement 添加成员。
    //	return this.implement(Object.map(methods, function (fnName) {
    //		return function (arg0, arg1, arg2) {

    //			// 获取实际调用的函数目标对象。
    //			var target = propertyGetterFunc ? this[propertyGetterFunc]() : this[targetProperty],
    //				r;

    //			assert(target, "#" + targetProperty + " 不能为空。");
    //			assert(!target || target[fnName], "#" + targetProperty + "." + fnName + "(): 不是函数。");

    //			r = target[fnName];

    //			// 调用被代理的实际函数。
    //			// 不能使用 .apply: IE 6/7 原生函数不是 function 。
    //			r = r.apply ? r.apply(target, arguments) : r(arg0, arg1, arg2);

    //			// 如果不是 getter，返回 this 链式引用。
    //			return target === r || r === undefined ? this : r;
    //		};
    //	}, {}), args);  // 支持 Dom.implement, 传递第二个参数。
    //},

    /**
	 * 所有类的基类。
	 * @abstract class
	 * {@link Class.Base} 提供了全部类都具有的基本函数。
	 */
    Class.Base = Base;

    /**
	 * 将一个原生的 Javascript 函数对象转换为一个类。
	 * @param {Function/Class} constructor 用于转换的对象，将修改此对象，让它看上去和普通的类一样。
	 * @return {Function} 返回生成的类。
	 * @remark 转换后的类将有继承、扩展等功能。
	 * @example <pre>
	 * function myFunc(){}
	 * 
	 * Class.Native(myFunc);
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
            constructor.__proto__ = Class.Base;
            return constructor;
        }

        return Object.extend(constructor, Class.Base);
    };

    return Class;

})();
