//===========================================
//  数组扩展        A
//===========================================


/**
 * 将一个伪数组对象转为原生数组。
 * @param {Object} iterable 一个伪数组对象。
 * @param {Number} startIndex=0 转换开始的位置。
 * @return {Array} 返回新数组，其值和 *value* 一一对应。
 * @memberOf Array
 * @remark iterable 不支持原生的 DomList 对象。
 * @example
 * <pre>
 * // 将 arguments 对象转为数组。
 * Array.create(arguments); // 返回一个数组
 *
 * // 获取数组的子集。
 * Array.create([4,6], 1); // [6]
 *
 * // 处理伪数组。
 * Array.create({length: 1, "0": "value"}); // ["value"]
 *
 * </pre>
 */
Array.create = function (iterable, startIndex) {
    // if(!iterable)
    // return [];

    // [DOM Object] 。
    // if(iterable.item) {
    // var r = [], len = iterable.length;
    // for(startIndex = startIndex || 0; startIndex < len;
    // startIndex++)
    // r[startIndex] = iterable[startIndex];
    // return r;
    // }

    assert(!iterable || toString.call(iterable) !== '[object HTMLCollection]' || typeof iterable.length !== 'number', 'Array.create(iterable, startIndex): {iterable} 不允许是 NodeList 。', iterable);

    // 调用 slice 实现。
    return iterable ? Array.prototype.slice.call(iterable, startIndex) : [];
};

/**
 * 数组。
 * @class Array
 */
Array.implementIf({
		
    /// TODO: clear

    /**
     * 将指定的 *value* 插入到当前数组的指定位置。
     * @param {Number} index 要插入的位置。索引从 0 开始。如果 *index* 大于数组的长度，则插入到末尾。
     * @param {Object} value 要插入的内容。
     * @return {Number} 返回实际插入到的位置。
     * @example
     * <pre>
     * ["I", "you"].insert(1, "love"); //   ["I", "love", "you"]
     * </pre>
     */
    insert: function (index, value) {
        assert.deprected("Array#insert 即将从 System.Core.Base 移除。要使用此函数，可引用 System.Utils.Array 组件。");
        assert.isNumber(index, "Array#insert(index, value): {index} ~");
        var me = this, tmp;
        if (index < 0 || index >= me.length) {
            me[index = me.length++] = value;
        } else {
            tmp = ap.slice.call(me, index);
            me.length = index + 1;
            this[index] = value;
            ap.push.apply(me, tmp);
        }
        return index;

    },
		
    /// TODO: clear
	
	/// #if SupportIE8

	/// <summary>
	/// 对数组每个元素判断一个函数返回true。
	/// </summary>
	/// <params name="fn" type="Function">函数。参数 value, index, this</params>
	/// <params name="bind" type="Object" optional="true">绑定的对象</params>
	/// <returns type="Boolean">全部返回 true则返回 true。</returns>
	every: function(fn, bind){
		bind = bind || this;
		for (var i = 0, l = this.length; i < l; i++){
			if (!fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},
	
	map: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++){
			//i 本来就是小于 this.length 还用判断么？
			if (i in this) results[i] = fn.call(bind, this[i], i, this);
		}
		return results;
	},

	some: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){//跟上边一样
			if ((i in this) && fn.call(bind, this[i], i, this)) return true;
		}
		return false;
	},

	/// <summary>
	/// 合并2个数组，第2个数组不覆盖原成员。
	/// </summary>
	/// <params name="array" type="Array">数组</params>
	/// <returns type="Array">数组</returns>
	concat: function(array){
		for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
		return this;
	},
	
	/// #endif

	/// <summary>
	/// 返回数组的副本
	/// </summary>
	/// <params name="start" type="Number" optional="true">位置</params>
	/// <params name="length" type="Number" optional="true">长度</params>
	/// <returns type="Array" > 拷贝的数组 </returns>
	clone : function(start,length){
//		var m = [];
//		for(var i = start || 0,len = length || this.length - i;i<len;i++)
//			m[i] = Object.clone(this[i]);
//		return m;
		var start = start || 0, len = length || 0;
		return len === 0 ? this.slice(start) : this.slice(start,start+len);
	},
	
	/// <summary>
	/// 删除数组中等价false的内容。
	/// </summary>
	/// <returns type="Boolean">全部返回 true则返回 true。</returns>
	clean: function(){
		return this.filter(function(x){return !x;});
	},

	/// <summary>
	/// 对数组链至对象
	/// </summary>
	/// <params name="fn" type="Function">函数。参数 value, index, this</params>
	/// <params name="bind" type="Object" optional="true">绑定的对象</params>
	/// <returns type="Array">数组</returns>
	link: function(object){
		var result = [];
		for (var i = 0, l = this.length; i < l; i++){
			for (var key in object){
				if (object[key](this[i])){
					result[key] = this[i];
					delete object[key];
					break;
				}
			}
		}
		return result;
	},

	/// <summary>
	/// 返回数组的随机位置的值。
	/// </summary>
	/// <returns type="Object">内容</returns>
	random : function(){
		return this.length > 0 ? this[Math.rand(0, this.length - 1)] : null;
	},

	/**
     * 没看懂这个函数的意义
     * sortFn:排序规则
     */
    sortByRandom: function(sortFn) {
        var result = [], array = this , sortFn = sortFn || function(){return Math.rand(0, array.length - 1);};
		while(array.length > 0){
			var index = sortFn();
			result.push(array[index]);
			array.remove(index);
		}
		return result;
    },
	
	// 是否包含某项
	contains:function(item){
		return RegExp("\\b"+item+"\\b").test(this);
	},

	associate: function(keys){
		var obj = {}, length = Math.min(this.length, keys.length);
		for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
		return obj;
	},

	clear: function(){
		this.length = 0;
		return this;
	},

	flatten: function(){
		var array = [];
		for (var i = 0, l = this.length; i < l; i++){
			var type = typeOf(this[i]);
			if (type == 'null') continue;
			array = array.concat((type == 'array' || type == 'collection' || type == 'arguments' || instanceOf(this[i], Array)) ? Array.flatten(this[i]) : this[i]);
		}
		return array;
	},

	pick: function(){
		for (var i = 0, l = this.length; i < l; i++){
			if (this[i] != null) return this[i];
		}
		return null;
	},
	
	/**
     * Perform a set difference A-B by subtracting all items in array B from array A.
     *
     * @param {Array} arrayA
     * @param {Array} arrayB
     * @return {Array} difference
     */
    difference: function(array) {
        var clone = slice.call(arrayA),
            ln = clone.length,
            i, j, lnB;

        for (i = 0,lnB = arrayB.length; i < lnB; i++) {
            for (j = 0; j < ln; j++) {
                if (clone[j] === arrayB[i]) {
                    erase(clone, j, 1);
                    j--;
                    ln--;
                }
            }
        }

        return clone;
    },

///<summary>获取数组中的最小值。语法：min()</summary>
		///<returns type="number">返回数组中的最小值。</returns>
	min: function(){
		return Math.min.apply(null, this);
	},

///<summary>获取数组中的最大值。语法：max()</summary>
		///<returns type="number">返回数组中的最大值。</returns>
	max: function(){
		return Math.max.apply(null, this);
	},

	average: function(){
		return this.length ? this.sum() / this.length : 0;
	},

	sum: function(){
		var result = 0, l = this.length;
		if (l){
			while (l--) result += this[l];
		}
		return result;
	},

	checkRepeat : function() {
		///<summary>检查数组中是否存在重复值。语法：checkRepeat()</summary>
		///<returns type="boolean">若数组中存在重复值，则返回 true，否则返回 false。</returns>
	    for (var i = 0; i < this.length - 1; i++) {
	        for (var j = i + 1; j < this.length; j++) {
	            if (this[i] == this[j]) {
	                return true;
	            }
	        }
	    }
	
	    return false;
	},
	
	findFirstNotOf : function(a){
		var o = this;
		for ( var i=0,length=o.length; i<length; i++)
			if(o[i] != a)
				return i;
		return -1;
	},

	findLastNotOf : function(a){
		var o = this;
		for ( var i=o.length-1; i>=0; i--)
			if(o[i] != a)
				return i;
		return -1;
	},

	shuffle: function(){
		for (var i = this.length; i && --i;){
			var temp = this[i], r = Math.floor(Math.random() * ( i + 1 ));
			this[i] = this[r];
			this[r] = temp;
		}
		return this;
	},

	/**
	 * 复制到另一个数组。
	 * @param {Object} o 位置。
	 * @return {Array} 参数的内容。
	 */
	copyTo: function(o) {
		var i = o.length;
		forEach.call(this, function(x) {
			o[i++] = x;
		});
		return o;
	}
		

});


// 
// 
// 		
		// /**
		 // * 如果目标数组不存在值，则拷贝，否则忽略。
		 // * @static
		 // * @param {Array} src 来源数组。
		 // * @param {Array} dest 目标数组。
		 // * @example
		 // * <code>
		 // * Array.copyIf([4,6], [4, 7]); // [4, 7, 6]
		 // * </code>
		 // */
		// copyIf: function(src, dest) {
// 			
			// for(var i = 0; i < src.length; i++)
				// dest.include(src[i]);
		// },
// 		
// 
		// /**
		 // * 把传入的值连接为新的数组。如果元素本身是数组，则合并。此函数会过滤存在的值。
		 // * @static
		 // * @param {Object} ... 数据成员。
		 // * @return {Array} 新数组。
		 // * @example
		 // * <code>
		 // * Array.plain([4,6], [[4], 7]); // [4, 7, 6]
		 // * </code>
		 // */
		// plain: function() {
// 
			// var r = [];
// 			
			// // 对每个参数
			// ap.forEach.call(arguments, function(d) {
// 				
// 				
				// // 如果数组，把内部元素压入r。
				// if (Array.isArray(d)) Array.copyIf(d, r);
// 				
				// // 不是数组，直接压入 r 。
				// else r.include(d);
			// });
// 
			// return r;
		// },
// 
// 
// ,
// 		
		// /**
		 // * 创建当前 Object 的浅表副本。
		 // * @return {Object} 当前变量的副本。
		 // * @protected
		 // * @example
		 // * <code>
		 // * var MyBa = new Class({
		 // *    clone: function() {
		 // * 	     return this.memberwiseClone();
		 // *    }
		 // * });
		 // * </code>
		 // */
		// memberwiseClone : function() {
// 			
			// // 创建一个同类。
			// var me = this, newObject = new me.constructor(), i;
// 			
			// // 复制自身。
			// for(i in me) {
				// if(hasOwnProperty.call(me, i)) {
					// newObject[i] = me[i];
				// }
			// }
// 			
			// return newObject;
		// }
// 



		
/**
		 * 如果目标数组不存在值，则拷贝，否则忽略。
		 * @static
		 * @param {Array} src 来源数组。
		 * @param {Array} dest 目标数组。
		 * @example
		 * <code>
		 * Array.copyIf([4,6], [4, 7]); // [4, 7, 6]
		 * </code>
		 */
copyIf: function(src, dest) {
			
	for(var i = 0; i < src.length; i++)
		dest.include(src[i]);
},
		

/**
		 * 把传入的值连接为新的数组。如果元素本身是数组，则合并。此函数会过滤存在的值。
		 * @static
		 * @param {Object} ... 数据成员。
		 * @return {Array} 新数组。
		 * @example
		 * <code>
		 * Array.plain([4,6], [[4], 7]); // [4, 7, 6]
		 * </code>
		 */
plain: function() {

	var r = [];
			
	// 对每个参数
	ap.forEach.call(arguments, function(d) {
				
				
		// 如果数组，把内部元素压入r。
		if (Array.isArray(d)) Array.copyIf(d, r);
				
			// 不是数组，直接压入 r 。
		else r.include(d);
	});

	return r;
},


,
		
/**
		 * 创建当前 Object 的浅表副本。
		 * @return {Object} 当前变量的副本。
		 * @protected
		 * @example
		 * <code>
		 * var MyBa = new Class({
		 *    clone: function() {
		 * 	     return this.memberwiseClone();
		 *    }
		 * });
		 * </code>
		 */
memberwiseClone : function() {
			
		// 创建一个同类。
	var me = this, newObject = new me.constructor(), i;
			
	// 复制自身。
	for(i in me) {
		if(hasOwnProperty.call(me, i)) {
			newObject[i] = me[i];
		}
	}
			
	return newObject;
}
