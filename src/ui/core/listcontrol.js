/**
 * @author  xuld
 */


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
	tpl: '<ul class="ui-control"/>',

	cssClass: 'ui-listcontrol',

	// 增删项

	/**
	 * 添加一个子控件到当前控件末尾。
	 * @param {Dom/String} ... 要添加的子节点。
	 * @return {Dom/this} 返回新添加的子控件，如果有多个参数，则返回 this。
	 */
	add: function (item) {

		// 如果有多个参数，按顺序插入。
		if (arguments.length > 1) {
			Object.each(arguments, this.insert, this);
			return this;
		}

		// 调用插入。
		return this.insert(item);

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
		newChild = Dom.parse(newChild);

		// 如果 childControl 不是 <li>, 则包装一个 <li> 标签。
		if (newChild[0].tagName !== 'LI') {
			var li = Dom.create('LI');
			li.append(newChild);
			newChild = li;
		}

		if (refChild && refChild.before) {
			refChild.before(newChild);
		} else {
			this.dom.append(newChild);
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

		// 仅处理存在 child 的情况。
		if (child) {

			// 如果 child 不是 <li>, 则肯能是 <li> 的子节点。尝试获取它的 父 <li> 标签。
			if (child.parent()[0] !== this.dom[0]) {

				// 获取包装的 <li>
				var li = child.parent('li');

				// 如果父节点不是 <li>, 说明是非法的子节点，不再继续处理。
				if (!li) {
					return null;
				}

				// 从 <li> 删除节点。
				child.remove(li);

				// 用于等下删除 <li> 自己。
				child = li;
			}

			// 从 DOM 树删除。
			this.dom.remove(child);

		}

		// 返回被删除的子控件。
		return child || null;
	},

	/**
	 * 删除指定索引的子控件。
	 * @param {Integer} index 删除的子控件的索引。
	 * @return {Dom} 返回删除的子控件。如果删除失败（如索引超出范围）则返回 null 。
	 */
	removeAt: function (index) {
		return this.remove(this.item(index));
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
			this.dom.empty();
			this.add.apply(this, items);
			return this;
		}

		// 否则，继承父类的 set 功能。
		return Control.prototype.set.apply(this, arguments);
	},

	// 获取和查询

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
		return this.dom.children().each(fn, scope);
	},

	///**
	// * 设置子控件某个事件发生之后，执行某个函数.
	// * @param {String} eventName 事件名。
	// * @param {String} fn 执行的函数。
	// * @param {Object} scope 函数执行时的作用域。
    // * @return this
    // * @protected
	// */
	//itemOn: function (eventName, fn, scope) {
	//	return this.dom.on(eventName, function (e) {
	//		for (var c = this[0].firstChild, target = e.target; c; c = c.nextSibling) {
	//			if (c === target || Dom.has(c, target)) {
	//				return fn.call(scope || this, new Dom(c), e);
	//			}
	//		}
	//	});
	//}

});

///**
// * 为非 ListControl 对象扩展 ListControl 的6个方法: add addAt remove removeAt set item
// */
//ListControl.aliasMethods = function (controlClass, targetProperty, removeChildProperty) {
//	controlClass.delegateMethods(targetProperty, 'add addAt removeAt item');

//	removeChildProperty = removeChildProperty || targetProperty;

//	controlClass.prototype.set = function (items) {
//		if (Array.isArray(items)) {

//			// 尝试在代理的列表中删除项。
//			var child = this[removeChildProperty];
//			if (child)
//				child.empty();

//			// 通过 this.add 添加项。
//			this.add.apply(this, items);

//			return this;
//		}

//		return this.base('set');
//	};

//	controlClass.prototype.removeChild = function (childControl) {

//		// 尝试在代理的列表中删除项。
//		var child = this[removeChildProperty];
//		if (child)
//			childControl.remove(childControl);

//		// 尝试在当前节点中正常删除。
//		childControl.detach(this.node);

//		return childControl;
//	};

//};