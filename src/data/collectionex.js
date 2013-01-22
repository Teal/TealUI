//===========================================
//  集合的扩展   collection.js         A
//===========================================

JPlus.CollectionBase.implement({
	
	/**
	 * 返回当前集合的副本。
	 */
	clone: function(){
		var list = new this.constructor();
		this.forEach(function(value){
			list.add(value);
		});
		
		return list;
	},
	
	/**
	 * 将当前集合转为数组。
	 * @return Array 数组。
	 */
	toArray: function(){
		return Array.create( this);
	},
	
	/**
	 * 排序当前集合元素。
	 */
	sort: function(){
		for(var i = this.length; i--; )
			this.onRemove(i, this[i]);
		Array.prototype.sort.call(this);
		for(i = 0; i < this.length; i++)
			this.onAdd(i, this[i]);
			
		return this;
	},
	
	/**
	 * 获取当前集合数目。
	 * @return Number 个数。
	 */
	getCount: function(){
		return this.length;
	}
});
