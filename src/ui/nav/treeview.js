/**
 * @author xuld
 */

//#include ui/nav/treeview.css
//#include ui/core/treecontrol.js
//#include ui/core/icollapsable.js

var TreeView = TreeControl.extend({

    cssClass: 'x-treeview',

    depth: 0,

    createNode: function (exitsNode) {
    	return new TreeNode(exitsNode);
    },

    initChildNode: function (li) {
    	TreeControl.prototype.initChildNode.call(this, li);

		// 更新子节点的深度。
    	this.itemOf(li).setDepth(this.depth + 1);

		// 如果当前树是子树，则更新所在节点的 + - 标记。
    	if (this.owner()) {
    		this.owner().update();
    	}
    },

	/**
	 * 点击时触发。
	 */
    onClick: function (e) {
		
    	var target = e.target;

    	if (/\bui-treenode-(minus|plus|loading)\b/.test(target.className))
    		return;

    	target = Dom.closest(target, "li");

    	if (target = Dom.data(target).treeNode) {
    		this.selectNode(target);
    		return false;
    	}

    },

    init: function () {

        // 根据已有的 DOM 结构初始化菜单。
    	TreeControl.prototype.init.call(this);

		// 点击后展开/折叠子节点。
        Dom.on(this.elem, 'click', this.onClick, this);
    },

    invoke: function (funcName, args) {
        var i, node;
        args = args || [];
        for (i = 0 ; node = this.item(i) ; i++) {
        	node[funcName].apply(node, args);
        }
        return this;
    },

    collapse: function (duration) {
        return this.invoke('collapse', [duration]);
    },

    collapseAll: function (duration) {
        return this.invoke('collapseAll', [duration]);
    },

    expand: function (duration) {
        return this.invoke('expand', [duration]);
    },

    expandAll: function (duration) {
        return this.invoke('expandAll', [duration]);
    },

    collapseTo: function (depth, duration) {
        return this.invoke('collapseTo', [--depth, duration]);
    },

    /**
	 * 模拟点击一项。
	 */
    selectNode: function (node) {
        if (this.trigger('selecting', node)) {
            var old = this.getSelectedNode();
            this.setSelectedNode(node);
            if (old !== node)
                this.trigger('change');
        }
        return this;
    },

    getSelectedNode: function () {
    	return this.selectedNode;
    },

    setSelectedNode: function (node) {

        // 先反选当前选择项。
        if (this.selectedNode)
        	Dom.removeClass(this.selectedNode.elem, 'x-treenode-selected');

        // 更新选择项。
        this.selectedNode = node;

        if (node != null) {
        	Dom.addClass(node.elem, 'x-treenode-selected');
        }

        return this;
    }

});

/**
 * 表示是 {@link TreeView} 中的一个节点。
 */
var TreeNode = TreeControl.Node.extend(ICollapsable).implement({
	
	cssClass: 'x-treenode',
	
	tpl: '<a class="{cssClass}"><span></span></a>',

	depth: 0,
	
	/**
	 * 获取当前用于折叠的容器对象。
	 * @return {Control} 折叠的容器对象。
	 * @protected override
	 */
	body: function () {
		var sub = this.getSub();
		return sub && sub.elem;
	},
	
	/**
	 * 获取当前的文字对象。
	 * @return {Control} 文字对象。
	 * @protected override
	 */
	content: function(){
		return Dom.last(this.elem);
	},
	
	/**
	 * 当被子类重写时，用于创建子树。
	 * @param {TreeControl} treeControl 要初始化的子树。
	 * @return {TreeControl} 新的 {@link TreeControl} 对象。
	 * @protected override
	 */
	createSub: function (existNode) {
		return new TreeView(existNode);
	},
	
	/**
	 * 当被子类重写时，用于初始化子树。
	 * @param {TreeControl} treeControl 要初始化的子树。
	 * @protected override
	 */
	initSub: function (treeControl) {

		// 更新子树的类。
		Dom.removeClass(treeControl.elem, 'x-treeview');
		Dom.addClass(treeControl.elem, 'x-treeview-subtree');

		// 标记子树的深度。
	    treeControl.depth = this.depth;

		// 子树不需要选择节点的功能。
	    Dom.un(treeControl.elem, 'click', treeControl.onClick);
	},

	uninitSub: function (treeControl) {

		// 更新子树的类。
		Dom.addClass(treeControl.elem, 'x-treeview');
		Dom.removeClass(treeControl.elem, 'x-treeview-subtree');

		// 将树设为独立的树。
		treeControl.depth = 0;

		// 子树不需要选择节点的功能。
		Dom.on(treeControl.elem, 'click', treeControl.onClick, treeControl);

	},
	
	/**
	 * 更新一个节点前面指定的占位符的类名。
	 * @private
	 */
	_setSpan: function(depth, className){
		this.sub().each(function(node){
			var first = Dom.first(node.elem, depth);
			if(first.tagName == 'SPAN')
				first.className = className;
			node._setSpan(depth, className);
		});
	},
	
	_markAsLastNode: function(){
		Dom.addClass(this.elem, 'x-treenode-last');
		this._setSpan(this.depth - 1, 'x-treenode-space x-treenode-none');
	},
	
	_clearMarkAsLastNode: function(){
		Dom.removeClass(this.elem, 'x-treenode-last');
		this._setSpan(this.depth - 1, 'x-treenode-space');
	},

	/**
	 * 获取当前节点的占位 span 。
	 * @param {Integer} index 要获取的索引， 最靠近右的索引为 0 。
	 * @protected
	 */
	span: function(index){
		return Dom.prev(this.content(), index);
	},
	
	/**
	 * 由于子节点的改变刷新本节点和子节点状态。
	 * @protected
	 */
	update: function(){
		
		// 更新图标。
		this.updateType();

		var sub = this.getSub();

		if (sub) {

			var last = sub.item(-1), lastNode;

			// 更新 lastNode
			if (last) {
				lastNode = this._lastNode;
				if (lastNode !== last.elem) {
					last._markAsLastNode();
					this._lastNode = last;
					if (lastNode) lastNode._clearMarkAsLastNode();
				}
			}

		}
		
	},
	
	/**
	 * 根据当前的节点情况更新当前节点的图标。
	 * @protected
	 */
	updateType: function () {
		var sub = this.getSub();
		this.setType(sub && Dom.first(sub.elem) ? (this.isCollapsed() ? 'plus' : 'minus') : 'normal');
	},
	
	/**
	 * 获取一个值，该值指示当前节点是否为最后一个节点。
	 * @return {Boolean}
	 * @protected
	 */
	isLastNode: function () {
		var parent = this.parent();
		return parent && parent._lastNode === this;
	},
	
	onDblClick: function(e){
		this.toggleCollapse();
		e.preventDefault();
		e.stopPropagation();
	},

	onCollapse: function () {
		ICollapsable.onCollapse.call(this);
		this.updateType();
	},

	onExpanding: function () {
		this.setType(this.isCollapsed() ? 'minus' : 'plus');
		ICollapsable.onExpanding.call(this);
	},

	init: function (options) {
		TreeControl.Node.prototype.init.call(this, options);
		Dom.setStyle(this.elem, 'user-select', 'none');
		Dom.on(this.elem, 'dblclick', this.onDblClick, this);
	},
	
	/**
	 * 获取当前节点的图标。
	 */
	getType: function(){
		var span = this.span(0);
		return span ? (/x-treenode-(.+)/.exec(span.className.replace(/\bui-treenode-space\b/, '')) || [0, "line"])[1] : null;
	},
	
	/**
	 * 设置当前节点的图标。
	 * @param {String} type 类型。肯能的值如： 'normal' 'plus' 'minus' 'none' 'loading' 'line'。
	 * @return this
	 */
	setType: function(type){
		var span = this.span(0);
		if(span) {
			span.className = 'x-treenode-space x-treenode-' + type;
		}
		return this;
	},
	
	/**
	 * 展开当前节点及子节点。
	 * @param {Integer} duration 折叠动画使用的毫米数。
	 * @param {Integer} maxDepth=0 最大折叠的深度。默认为 -1 表示全部折叠。
	 * @return this
	 */
	expandAll: function(duration, maxDepth){
		if (this.getSub() && !(maxDepth === 0)) {
			this.expand(duration);
			this.invoke('expandAll', [duration, --maxDepth]);
		}
		return this;
	},
	
	/**
	 * 折叠当前节点及子节点。
	 * @param {Integer} duration 折叠动画使用的毫米数。
	 * @param {Integer} maxDepth=0 最大折叠的深度。默认为 -1 表示全部折叠。
	 * @return this
	 */
	collapseAll: function(duration, maxDepth){
		if (this.getSub() && !(maxDepth === 0)) {
			this.invoke('collapseAll', [duration, --maxDepth]);
			this.collapse(duration);
		}
		return this;
	},
	
	/**
	 * 展开当前节点，但折叠指定深度以后的节点。
	 */
	collapseTo: function(depth, duration){
		duration = duration === undefined ? 0 : duration;
		depth = depth === undefined ? 1 : depth;
		
		if(depth > 0){
			this.expand(duration);
		} else {
			this.collapse(duration);
		}
		
		this.invoke('collapseTo', [--depth, duration]);
	},
	
	invoke: function (funcName, args) {
		var sub = this.getSub();
		if (sub) {
			sub.invoke(funcName, args);
		}
		return this;
	},

	/**
	 * 获取当前节点的深度。
	 * @return {Integer} 返回节点深度。
	 */
	getDepth: function(){
		return this.depth;
	},

	/**
	 * 设置当前节点的深度。
	 * @param {Integer} value 要设置的深度。
	 * @return this
	 */
	setDepth: function(value){
		
		//assert(value >= 0, "TreeNode#setDepth(value): {value} 必须是不小于 0 的整数", value);
		
		var me = this,
			currentDepth = me.getDepth(),
			span,
			current = me;
		
		// 删除多余的占位符。
		
		while(currentDepth > value){
			Dom.remove(Dom.first(this.elem));
			currentDepth--;
		}
	
		// 补上不够的占位符。
		
		while(currentDepth < value){
			Dom.prepend(this.elem, '<span class="x-treenode-space"></span>');
			currentDepth++;
		}
		
		// 更新深度。
		
		this.depth = value;
		
		// 绑定最后一个 span 的点击事件。
		
		// 获取第一个占位符。
		span = this.span(0);
		
		if(currentDepth) {
			Dom.un(span, 'click', this.onDblClick);
			Dom.on(span, 'click', this.onDblClick, this);
		}
		
		// 更新 spans 的 class 状态。
		
		while ((current = current.parent()) && (span = Dom.prev(span))) {
			span.className = current.isLastNode && current.isLastNode() ? 'x-treenode-space x-treenode-none' : 'x-treenode-space';
		}
		
		me.updateType();
		
		// 对子节点设置深度+1
		me.invoke('setDepth', [++value]);
	},
	
	ensureVisible: function(duration){
		var n = this;
		while(n = n.parent()) {
			n.expand(duration);
		}

		//   this.scrollIntoView();
		
		return this;
	}

});