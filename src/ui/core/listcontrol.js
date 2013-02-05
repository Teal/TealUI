/**
 * @author  xuld
 */

include("ui/core/base.js");

/**
 * 表示所有管理多个有序列的子控件的控件基类。
 * @abstract class
 * @extends Control
 */
var ListControl = Control.extend({

	/**
	 * 当前控件的 HTML 模板字符串。
	 * @getter {String} tpl
	 * @protected virtual
	 */
	tpl: '<ul class="{cssClass}"/>',

	//#region 增删项

	/**
	 * 添加一个子控件到当前控件末尾。
	 * @param {Dom/String} ... 要添加的子节点。
	 * @return {Dom/this} 返回新添加的子控件，如果有多个参数，则返回 this。
	 */
	add: function (item) {
		
		var ret = new Dom();

		// 如果有多个参数，按顺序插入。
		if (arguments.length > 1) {
			Object.each(arguments, function (item) {
				ret.add(this.insert(item));
			}, this);
		} else {
			ret = this.insert(item);
		}

		return ret;

	},

	/**
	 * 在指定位置插入一个子控件。
	 * @param {Integer} index 添加的子控件的索引。
	 * @param {Dom} item 要添加的子控件。
	 * @return {Dom} 返回新添加的子控件。
	 */
	addAt: function (index, item) {
		return this.insert(item, this.item(index));
	},

	/**
	 * 当新控件被添加时执行。
	 * @param {Dom} childControl 新添加的元素。
	 * @param {Dom} refControl 元素被添加的位置。
	 * @protected override
	 */
	insert: function (newChild, refChild) {

		// newChild 不一定是一个标准的 <li> 标签。
		// 先处理 newChild 为标准 Dom 对象。

		// 处理字符串。
		newChild = Dom.parse(newChild, this.dom[0]);

		if (newChild.length) {

			// 如果 childControl 不是 <li>, 则包装一个 <li> 标签。
			if (newChild[0].tagName !== 'LI') {
				var li = Dom.create('LI');
				li.append(newChild);
				newChild = li;
			}

			if (refChild && refChild.length) {
				refChild.before(newChild);
			} else {
				this.dom.append(newChild);
			}

		}

		// 返回新创建的子控件。
		return newChild;
	},

	/**
	 * 当新控件被移除时执行。
	 * @param {Dom} childControl 新添加的元素。
	 * @protected override
	 */
	remove: function (child) {

		// 无参数，则删除本身。
		if (!arguments.length) {
			this.detach();
			return this;
		}

		// 返回被删除的子控件。
		return child ? child.remove() : child;
	},

	/**
	 * 删除指定索引的子控件。
	 * @param {Integer} index 删除的子控件的索引。
	 * @return {Dom} 返回删除的子控件。如果删除失败（如索引超出范围）则返回 null 。
	 */
	removeAt: function (index) {
		return this.remove(this.item(index));
	},

	empty: function () {
		this.dom.empty();
		return this;
	},

	/**
	 * 批量设置当前的项列表。
     * @param {Array/Object} items 要设置的项的数组。
     * @return this
     * @protected override
	 */
	set: function (items) {

		// 如果 items 为数组，则批量设置当前的项。
		if (Array.isArray(items)) {
			this.empty().add.apply(this, items);
			return this;
		}

		// 否则，继承父类的 set 功能。
		return Control.prototype.set.apply(this, arguments);
	},

	//#endregion

	//#region 获取和遍历

	/**
	 * 获取指定索引的项。
	 * @param {Integer} index 索引值。如果值小于 0, 则表示倒数的项。
	 * @return {Dom} 指定容器控件包装的真实子控件。如果不存在相应的子控件，则返回自身。
	 */
	item: function (index) {
		return this.dom.child(index);
	},

	/**
	 * 获取某一项在列表中的索引。
     * @param {Dom} item 要获取索引的项。
	 * @return {Integer} 返回索引。如果不存在指定的子控件，则返回 -1 。
	 */
	indexOf: function (item) {
		return item && item.parent && item.parent('ul')[0] === this.dom[0] ? item.index() : -1;
	},

	count: function () {
		return this.dom.children().length;
	},

	each: function (fn, scope) {
		for (var c = this.item(0) || [], next, i = 0 ; c.length ; c = next) {
			next = c.next();

			if (fn.call(scope, c, i++, this) === false) {
				return false;
			}
		}

		return true;
	},

	/**
	 * 设置子控件某个事件发生之后，执行某个函数.
	 * @param {String} eventName 事件名。
	 * @param {String} fn 执行的函数。
	 * @param {Object} scope 函数执行时的作用域。
     * @return this
     * @protected
	 */
	itemOn: function (eventName, fn, scope) {
		return this.dom.on(eventName, function (e) {
			for (var c = this.firstChild, target = e.target; c; c = c.nextSibling) {
				if (c === target || Dom.contains(c, target)) {
					return fn.call(scope || c, new Dom([c]), e);
				}
			}
		}, this.dom[0]);
	}

	//#endregion

});