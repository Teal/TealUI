/**
 * @author xuld
 */

//#include ui/core/listcontrol.js
//#include ui/core/contentcontrol.js

/**
 * 表示一个树结构的子组件。
 * @class TreeControl
 * @extends ListControl
 */
var TreeControl = ListControl.extend({

	/**
	 * 将已有的 DOM 节点转为 {@link TreeControl.Node} 对象。
	 * @param {Dom} childControl 要转换的 DOM 对象。
	 * @param {Dom} parent=null DOM 对象的父节点。
	 * @protected virtual
	 */
	createNode: function (existsNode) {
		return new TreeControl.Node(existsNode);
	},

	/**
	 * 初始化并返回每一个 TreeItem 对象。
	 * @param {Dom} li 包含树节点的  li 节点对象。
	 * @param {Dom} [childControl] 强制指定 li 内指定的子节点。
	 * @private
	 */
	initChildNode: function (li) {

		// 获取第一个子节点。
		var sub = Dom.find('>ul', li);

		// 如果不存在子树，也不需要创建子节点，则退出。
		if (sub) {

			// 创建子节点的示例并设置子菜单。
			this.itemOf(li).setSub(sub);

		}

	},

	/**
	 * 初始化 DOM 中已经存在的项。 
	 * @protected override
	 */
	init: function () {
		for (var c = Dom.first(this.elem) ; c; c = Dom.next(c)) {
			this.initChildNode(c);
		}

		Dom.data(this.elem).treeControl = this;
	},

	/**
	 * 当新控件被添加时执行。
	 * @param {Control} childControl 新添加的元素。
	 * @param {Control} refControl 元素被添加的位置。
	 * @protected override
	 */
	insertBefore: function (newItem, refItem) {
		
		// 将参数转为 Node 对象。
		if (!(newItem instanceof TreeControl.Node)) {
			var t = newItem;
			newItem = this.createNode();
			Dom.append(newItem.content(), t);
		}

		// 插入当前节点。
		ListControl.prototype.insertBefore.call(this, newItem.elem, refItem);

		// 获取插入的 <li>
		refItem = newItem.elem.parentNode;

		Dom.data(refItem).treeNode = newItem;

		// 如果其内部有子树，则进行初始化。
		this.initChildNode(refItem);

		return newItem;
	},

	removeChild: function (item) {

		if (item.getSub()) {
			item.getSub().remove();
		}

		Dom.remove(item.elem || item);
		return item;
	},

	owner: function () {
		var li = this.elem.parentNode;
		return li ? Dom.data(li).treeNode : null;
	},

	parent: function () {
		var li = this.owner();
		return li ? li.owner() : null;
	},

	itemOf: function (node) {
		var data = Dom.data(node);
		return data.treeNode || (data.treeNode = this.createNode(Dom.first(node)));
	},

	item: function (index) {
		index = Dom.child(this.elem, index);
		return index && this.itemOf(index);
	}

});

/**
 * 表示 TreeControl 中的一项。
 * @class TreeControl.Node
 */
TreeControl.Node = ContentControl.extend({

	cssClass: "x-treecontrol-node",

	tpl: '<a class="{cssClass}"></a>',

	/**
	 * 当前节点的子树。
	 */
	_subTree: null,

	/**
	 * 当被子类重写时，用于创建子树。
	 * @param {TreeControl} treeControl 要初始化的子树。
	 * @return {TreeControl} 新的 {@link TreeControl} 对象。
	 * @protected virtual
	 */
	createSub: function (existDom) {
		return new TreeControl(existDom);
	},

	/**
	 * 当被子类重写时，用于初始化子树。
	 * @param {TreeControl} treeControl 要初始化的子树。
	 * @protected virtual
	 */
	initSub: Function.empty,

	/**
	 * 当被子类重写时，用于删除初始化子树。
	 * @param {TreeControl} treeControl 要删除初始化的子树。
	 * @protected virtual
	 */
	uninitSub: Function.empty,

	owner: function () {
		var li = this.elem.parentNode;

		if (li && (li = li.parentNode)) {

			// 找到所有者的 li 节点。
			li = Dom.data(li).treeControl;
		}

		return li;
	},

	parent: function () {
		var owner = this.owner();
		return owner && owner.owner();
	},

	tree: function () {
		var n = this;
		while (n.parent())
			n = n.parent();

		return n;
	},

	/**
	 * 获取或当前节点的子树。 
	 */
	sub: function () {

		// 获取子树。
		var sub = this.getSub();

		// 如果不存在，则创建并设置一个。
		if (!sub) {
			sub = this.createSub();
			this.setSub(sub);
		}

		return sub;
	},

	/**
	 * 获取当前项的子树控件。 
	 */
	getSub: function () {
		// 子树的信息存在当前节点中。
		return this._subTree;
	},

	/**
	 * 设置当前项的子树控件。
	 */
	setSub: function (treeControl) {
		if (treeControl !== null) {

			// 如果参数不是一个合法的树，则先创建一个。
			if (!(treeControl instanceof TreeControl)) {
				treeControl = this.createSub(treeControl);
			}

			// 插入子树节点。
			Dom.after(this.elem, treeControl.elem);

			// 保存当前节点的子树对象。
			this._subTree = treeControl;

			// 初始化子树。
			this.initSub(treeControl);

			// setSub(null)
		} else if (treeControl = this.getSub()) {

			// 删除子树的 DOM 。
			treeControl.remove();

			// 删除对象。
			this._subTree = null;

			// 取消初始化子树。
			this.uninitSub(treeControl);
		}
		return this;
	}

});

ListControl.alias(TreeControl.Node, "sub");
