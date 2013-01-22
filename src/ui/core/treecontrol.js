/** * @author [作者] */
/**
 * 表示一个树结构的子组件。
 * @class TreeControl
 * @extends ListControl
 */
var TreeControl = ListControl.extend({

	// 树节点

	/**
	 * 将已有的 DOM 节点转为 {@link TreeControl.Item} 对象。
	 * @param {Dom} childControl 要转换的 DOM 对象。
	 * @param {Dom} parent=null DOM 对象的父节点。
	 * @protected virtual
	 */
	createTreeItem: function (childControl, li) {
		return new TreeControl.Item(childControl);
	},

	/**
	 * 初始化并返回每一个 TreeItem 对象。
	 * @param {Dom} li 包含树节点的  li 节点对象。
	 * @param {Dom} [childControl] 强制指定 li 内指定的子节点。
	 * @private
	 */
	initTreeItem: function (li, childControl) {

		// 获取第一个子节点。
		var subControl = li.addClass('x-' + this.xtype + '-item').find('>ul');

		// 如果没有指定 childControl，则使用 li.first()作为内容。
		if (!childControl) {
			childControl = (subControl ? (subControl.prev() || subControl.prev(null)) : (li.first() || li.first(null))) || Dom.parse('');
		}

		// 根据节点创建一个 MenuItem 对象。
		childControl = this.createTreeItem(childControl, li);

		// 插入创建的菜单项。
		li.prepend(childControl);

		// 如果存在子菜单，设置子菜单。
		if (subControl) {
			childControl.setSubControl(subControl);
		}

		// 保存 li -> childControl 的关联。
		li.dataField().item = childControl;

		// 绑定 parentControl。
		childControl.parentControl = this;

		return childControl;

	},

	/**
	 * 初始化 DOM 中已经存在的项。 
	 * @protected override
	 */
	init: function () {
		for (var c = this.first() ; c; c = c.next()) {
			this.initTreeItem(c);
		}
	},

	// 增删节点

	/**
	 * 当新控件被添加时执行。
	 * @param {Control} childControl 新添加的元素。
	 * @param {Control} refControl 元素被添加的位置。
	 * @protected override
	 */
	insertBefore: function (childControl, refControl) {

		var item;

		// 如果不是添加 <li> 标签，则创建一个。
		if (childControl.node.tagName !== 'LI') {

			// 作为 initTreeItem 的参数。
			item = childControl;

			// 生成一个 <li>
			childControl = Dom.create('LI');
		}

		// 插入 DOM 树。
		childControl.attach(this.node, refControl && refControl.node || null);

		// 返回 treeItem
		return this.initTreeItem(childControl, item);
	},

	/**
	 * 当新控件被移除时执行。
	 * @param {Object} childControl 新添加的元素。
	 * @protected override
	 */
	removeChild: function (childControl) {

		// 取消删除一个项(自动转到 <li>)。
		if (childControl = ListControl.prototype.removeChild.call(this, childControl)) {

			var data = childControl.dataField();

			delete data.item.parentControl;

			delete data.item;

		}

		// 返回被删除的子控件。
		return childControl;
	},

	// 项

	item: function (index) {
		if (index = this.child(index)) {
			index = index.dataField().item;
		}

		return index;
	}

});

/**
 * 表示 TreeControl 中的一项。
 * @class TreeControl.Item
 */
TreeControl.Item = ContentControl.extend({

	tpl: '<a class="x-control"></a>',

	/**
	 * 获取当前菜单管理的子菜单。
	 * @type {TreeControl}
	 */
	subControl: null,

	/**
	 * 当被子类重写时，用于创建子树。
	 * @param {TreeControl} treeControl 要初始化的子树。
	 * @return {TreeControl} 新的 {@link TreeControl} 对象。
	 * @protected virtual
	 */
	createSubControl: function (control) {
		return new TreeControl(control);
	},

	/**
	 * 当被子类重写时，用于初始化子树。
	 * @param {TreeControl} treeControl 要初始化的子树。
	 * @protected virtual
	 */
	initSubControl: Function.empty,

	/**
	 * 当被子类重写时，用于删除初始化子树。
	 * @param {TreeControl} treeControl 要删除初始化的子树。
	 * @protected virtual
	 */
	uninitSubControl: Function.empty,

	/**
	 * 获取当前项的子树控件。 
	 */
	getSubControl: function () {
		if (!this.subControl) {
			this.setSubControl(this.createSubControl());
		}
		return this.subControl;
	},

	/**
	 * 设置当前项的子树控件。
	 */
	setSubControl: function (treeControl) {
		if (treeControl) {

			if (!(treeControl instanceof TreeControl)) {
				treeControl = this.createSubControl(treeControl);
			}

			// 如果子控件不在 DOM 树中，插入到当前节点后。
			if (!treeControl.closest('body') && this.node.parentNode) {
				this.node.parentNode.appendChild(treeControl.node);
			}

			this.subControl = treeControl;
			this.initSubControl(treeControl);
			treeControl.owner = this;
		} else if (this.subControl) {
			this.subControl.remove();
			this.uninitSubControl(this.subControl);
			delete this.subControl.owner;
			this.subControl = null;
		}
		return this;
	},

	attach: function (parentNode, refNode) {

		parentNode.insertBefore(this.node, refNode);

		// 如果有关联的容器，添加容器。
		var subControl = this.subControl;
		if (subControl && !subControl.closest('body')) {
			parentNode.insertBefore(subControl.node, refNode);
		}
	},

	detach: function (parentNode) {

		if (this.node.parentNode === parentNode) {
			parentNode.removeChild(this.node);
		}

		// 如果有关联的容器，删除容器。
		var subControl = this.subControl;
		if (subControl) {
			parentNode.removeChild(subControl.node);
		}
	}

});

ListControl.aliasMethods(TreeControl.Item, 'getSubControl()', 'subControl');