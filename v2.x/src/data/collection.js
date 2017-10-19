/**
 * @fileOverview 集合的基类。
 * @author xuld
 */


//#include core/class.js
	
/**
 * 集合。
 * @class Collection
 */
var Collection = Base.extend({
	
	/**
	 * 获取当前的项数目。
	 */
	length: 0,
	
	/**
	 * 对项初始化。
	 * @protected
	 * @virtual
	 */
	initItem: function (item) {
		return item;
	},
	
	onAdd: function(item){
		this.onInsert(item, this.length);
	},

	onInsert: Function.empty,
	
	onRemove: Function.empty,
	
	onBeforeSet: Function.empty,
	
	onAfterSet: Function.empty,
	
	add: function(item){
		//assert.notNull(item, "Collection.prototype.add(item): 参数 {item} ~。");
		Array.prototype.push.call(this, item = this.initItem(item));
		this.onAdd(item);
		return item;
	},
	
	addRange: function(args){
		return Array.prototype.forEach.call(args && typeof args.length === 'number' ? args : arguments, this.add, this);
	},
	
	insert: function(index, item){
		//assert.notNull(item, "Collection.prototype.insert(item): 参数 {item} ~。");
		index = Array.prototype.insert.call(this, index, item = this.initItem(item));
		this.onInsert(item, index + 1);
		return item;
	},
	
	clear: function(){
		var me = this;
		me.onBeforeSet();
		while (me.length) {
			var item = me[--me.length];
			delete me[me.length];
			me.onRemove(item, me.length);
		}
		me.onAfterSet();
		return me;
	},
	
	remove: function(item){
		//assert.notNull(item, "Collection.prototype.remove(item): 参数 {item} ~。");
		var index = this.indexOf(item);
		this.removeAt(index);
		return index;
	},
	
	removeAt: function(index){
		var item = this[index];
		if(item){
			Array.prototype.splice.call(this, index, 1);
			delete this[this.length];
			this.onRemove(item, index);
		}
			
		return item;
	},
		
	set: function(index, item){
		var me = this;
		me.onBeforeSet();
		
		if(typeof index === 'number'){
			item = this.initItem(item);
			//assert.notNull(item, "Collection.prototype.set(item): 参数 {item} ~。");
			//assert(index >= 0 && index < me.length, 'Collection.prototype.set(index, item): 设置的 {index} 超出范围。请确保  0 <= index < ' + this.length, index);
			item = me.onInsert(item, index);
			me.onRemove(me[index], index);
			me[index] = item;
		} else{
			if(me.length)
				me.clear();
			index.forEach(me.add, me);
		}
		
		me.onAfterSet();
		return me;
	},


	/**
	 * 返回当前集合的副本。
	 */
	clone: function () {
		var list = new this.constructor();
		this.forEach(function (value) {
			list.add(value);
		});

		return list;
	},

	/**
	 * 将当前集合转为数组。
	 * @return Array 数组。
	 */
	toArray: function (index) {
		return [].slice.call(this, index);
	},

	/**
	 * 排序当前集合元素。
	 */
	sort: function () {
		for (var i = this.length; i--;)
			this.onRemove(i, this[i]);
		Array.prototype.sort.call(this);
		for (i = 0; i < this.length; i++)
			this.onAdd(i, this[i]);

		return this;
	}
	
});

Object.map("indexOf forEach each invoke lastIndexOf item filter", function(value){
	return Array.prototype[value];
}, Collection.prototype);

