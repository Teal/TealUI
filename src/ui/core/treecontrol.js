/**
 * @author xuld
 */

include("ui/core/listcontrol.js");
include("ui/core/contentcontrol.js");

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
	initNode: function (li) {

		// 获取第一个子节点。
		var sub = li.find('>ul');

		// 如果不存在子树，也不需要创建子节点，则退出。
		if (sub.length) {

			// 为了设置子菜单，将 li 转为 Node 对象。
			// 根据节点创建一个 TreeControl.Node 对象。
			if (!(li instanceof TreeControl.Node)) {
				li = this.createNode(li);
			}

			// 设置子菜单。
			li.setSub(sub);

		}

	},

	/**
	 * 初始化 DOM 中已经存在的项。 
	 * @protected override
	 */
	init: function () {
		for (var c = this.dom.first() ; c.length; c = c.next()) {
			this.initNode(c);
		}
	},

	/**
	 * 当新控件被添加时执行。
	 * @param {Control} childControl 新添加的元素。
	 * @param {Control} refControl 元素被添加的位置。
	 * @protected override
	 */
	insert: function (newChild, refChild) {
		
		// 将参数转为 Node 对象。
		if (!(newChild instanceof TreeControl.Node)) {
			var t = newChild;
			newChild = this.createNode();
			newChild.content().append(t);
		}

		// 如果其内部有子树，则进行初始化。
		this.initNode(newChild.dom);

		newChild.attach(this.dom, refChild);

		return newChild;
	},

	item: function (index) {
		index = this.dom.child(index);
		return index.length ? this.createNode(index) : null;
	}

});

/**
 * 表示 TreeControl 中的一项。
 * @class TreeControl.Node
 */
TreeControl.Node = ContentControl.extend({

	cssClass: "ui-treecontrol-node",

	tpl: '<li><a class="ui-control"></a></li>',

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

	parent: function () {
		var li = this.dom.parent('ul').parent('li');
		return li.length ? new this.constructor(li) : null;
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
		return Dom.data(this.dom[0]).treeControlSub || null;
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
			if (!treeControl.dom.closest('body').length) {
				this.dom.append(treeControl.dom);
			}

			// 保存当前节点的子树对象。
			Dom.data(this.dom[0]).treeControlSub = treeControl;

			// 初始化子树。
			this.initSub(treeControl);

		// setSub(null)
		} else if (treeControl = this.getSub()) {

			// 删除子树的 DOM 。
			treeControl.remove();

			// 删除对象。
			delete Dom.dataField(this.dom[0]).treeControlSub;

			// 取消初始化子树。
			this.uninitSub(treeControl);
		}
		return this;
	}

});
