
/**
 * 委托。
 * @class Delegate
 */
var Delegate = Class({
	
	/**
	 * 初始化一个委托。
	 * @param {Function} ... 创建委托的函数。
	 */
	constructor: function(){
		
		/**
		 * 执行委托。
		 * @return {Boolean} 是否成功调用所有委托成员。
		 */
		var fn = function(){
			arguments.callee.apply(this, arguments);
		};
		
		Object.extend(fn, this);
		fn.handlers = Array.create(arguments);
		return fn;
		
	},
	
	/**
	 * 增加一个函数。
	 * @param {Function} f 函数。
	 * @return {Delegate} this。
	 */
	add: function(f){
		this.handlers.push(f);
		return this;
	},

	/**
	 * 删除一个函数。
	 * @param {Function} f 函数。
	 * @return {Delegate} this。
	 */
	remove:  function(f){
		this.handlers.remove(f);
		return this;
	},
	
	/**
	 * 删除所有函数。
	 * @param {Function} f 函数。
	 * @return {Delegate} this。
	 */
	clear: function(){
		this.handlers.length = 0;
		return this;
	},
	
	/**
	 * 对一个对象调用委托。
	 * @param {Object} bind 对象。
	 * @param {Array} args 参数。
	 * @return {Boolean} 是否成功调用所有委托成员。
	 */
	apply: function(bind, args){
		return this.handlers.each(function(f){
			return f.apply(bind, args);
		});
	},
	
	/**
	 * 对一个对象调用委托。
	 * @param {Object} bind 对象。
	 * @param {Object} ... 参数。
	 * @return {Boolean} 是否成功调用所有委托成员。
	 */
	call: function(bind){
		return this.apply(bind, Array.create(arguments, 1));
	}
							   
});