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
	 * 将已有的 DOM 节点转为 {@link TreeControl.Item} 对象。
	 * @param {Dom} childControl 要转换的 DOM 对象。
	 * @param {Dom} parent=null DOM 对象的父节点。
	 * @protected virtual
	 */
	createNode: function (existsDom) {
		return new TreeControl.Node(existsDom);
	},

	/**
	 * 初始化并返回每一个 TreeItem 对象。
	 * @param {Dom} li 包含树节点的  li 节点对象。
	 * @param {Dom} [childControl] 强制指定 li 内指定的子节点。
	 * @private
	 */
	initChild: function (li) {

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
			this.initChild(c);
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
			Dom.data(newItem.elem).treeNode = newItem;
		}

		// 如果其内部有子树，则进行初始化。
		this.initChild(newItem.elem);

		Dom.render(newItem.elem, this.elem, refItem && refItem.elem || refItem);

		return newItem;
	},

	removeChild: function (newItem) {
		Dom.remove(newItem.elem || newItem);
		return newItem;
	},

	parent: function () {
		var li = this.elem.parentNode;
		return li ? Dom.data(li.parentNode).treeControl : null;
	},

	itemOf: function (node) {
		var data = Dom.data(node);
		return data.treeNode || (data.treeNode = this.createNode(node));
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

	cssClass: "ui-treecontrol-node",

	tpl: '<li><a class="ui-control"></a></li>',

	subTree: null,

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
		return Dom.data(this.elem.parentNode).treeControl;
	},

	parent: function () {
		var li = this.elem.parentNode.parentNode;
		return li ? Dom.data(li).treeNode : null;
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
		return this.subTree;
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

			// 如果子树不在 DOM 树中，插入到当前节点后。
			Dom.append(this.elem, treeControl.elem);

			// 保存当前节点的子树对象。
			this.subTree = treeControl;

			// 初始化子树。
			this.initSub(treeControl);

		// setSub(null)
		} else if (treeControl = this.getSub()) {

			// 删除子树的 DOM 。
			treeControl.remove();

			// 删除对象。
			this.subTree = null;

			// 取消初始化子树。
			this.uninitSub(treeControl);
		}
		return this;
	}

});
