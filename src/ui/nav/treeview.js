/**
 * @author xuld
 */


include("ui/nav/treeview.css");
include("ui/core/treecontrol.js");
include("ui/core/icollapsable.js");


var TreeView = TreeControl.extend({

    cssClass: 'ui-treeview',

    depth: 0,

    createNode: function (child) {

        if (!(childControl instanceof TreeNode)) {

            // 保存原有 childControl 。
            var t = childControl;

            childControl = new TreeNode();

            childControl.content().append(t);

        }

        // 设置子节点的位置。
        childControl.setDepth(this.depth + 1);

        // 更新当前树的父节点。
        if (this.owner) {
            this.owner.update();
            childControl.parentNode = this.owner;
        }

        return childControl;

    },

    /**
	 * 获取一个值，该值指示当前节点是否为最后一个节点。
	 * @return {Boolean}
	 * @protected
	 */
    isLastNode: function () {
        return false;
    },

    init: function () {

        // 根据已有的 DOM 结构初始化菜单。
        TreeControl.prototype.init.call(this);

        this.on('click', this.onClick);
    },

    invoke: function (funcName, args) {
        var subTree = this, c, target;
        args = args || [];
        for (var c = subTree.first() ; c; c = c.next()) {
            target = c.dataField().item;
            target[funcName].apply(target, args);
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
	 * 点击时触发。
	 */
    onClick: function (e) {

        var target = e.target;

        if (/\bui-treenode-(minus|plus|loading)\b/.test(target.className))
            return;

        if ((target = new Dom(target).closest('.ui-treenode')) && (target = target.dataField().control)) {
            this.selectNode(target);
            return false;
        }


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

    setSelectedNode: function (node) {

        // 先反选当前选择项。
        if (this.selectedNode)
            this.selectedNode.state('selected', false);

        // 更新选择项。
        this.selectedNode = node;

        if (node != null) {
            node.state('selected', true);
        }

        return this;
    },

    getSelectedNode: function () {
        return this.selectedNode;
    }

});

/**
 * 表示是 {@link TreeView} 中的一个节点。
 */
var TreeNode = TreeControl.Item.extend(ICollapsable).implement({
	
	cssClass: 'ui-treenode',
	
	tpl: '<a class="ui-control"><span></span></a>',
	
	/**
	 * 获取当前用于折叠的容器对象。
	 * @return {Control} 折叠的容器对象。
	 * @protected override
	 */
	body: function () {
		return this.subControl;
	},
	
	/**
	 * 获取当前的文字对象。
	 * @return {Control} 文字对象。
	 * @protected override
	 */
	content: function(){
		return this.last('span');
	},
	
	/**
	 * 当被子类重写时，用于创建子树。
	 * @param {TreeControl} treeControl 要初始化的子树。
	 * @return {TreeControl} 新的 {@link TreeControl} 对象。
	 * @protected override
	 */
	createSubControl: function(control){
		return new TreeView(control).removeClass('ui-treeview').addClass('ui-treeview-subtree');
	},
	
	/**
	 * 当被子类重写时，用于初始化子树。
	 * @param {TreeControl} treeControl 要初始化的子树。
	 * @protected override
	 */
	initSubControl: function(treeControl){
	    treeControl.depth = this.depth;

        // 子树不需要选择节点的功能。
	    treeControl.un('click', treeControl.onClick);
	},
	
	// 树节点的控制。
	
	/**
	 * 更新一个节点前面指定的占位符的类名。
	 * @private
	 */
	_setSpan: function(depth, className){
		
		this.each(function(node){
			var first = node.first(depth).node;
			if(first.tagName == 'SPAN')
				first.className = className;
			node._setSpan(depth, className);
		});
		
	},
	
	_markAsLastNode: function(){
		this.addClass('ui-treenode-last');
		this._setSpan(this.depth - 1, 'ui-treenode-space ui-treenode-none');
	},
	
	_clearMarkAsLastNode: function(){
		this.removeClass('ui-treenode-last');
		this._setSpan(this.depth - 1, 'ui-treenode-space');
	},

	/**
	 * 获取当前节点的占位 span 。
	 * @param {Integer} index 要获取的索引， 最靠近右的索引为 0 。
	 * @protected
	 */
	span: function(index){
		return this.content().prev(index);
	},
	
	/**
	 * 由于子节点的改变刷新本节点和子节点状态。
	 * @protected
	 */
	update: function(){
		
		// 更新图标。
		this.updateNodeType();
		
		var last = this.subControl.item(-1), lastNode;
		
		// 更新 lastNode
		if(last){
			lastNode = this._lastNode;
			if (!lastNode || lastNode.node !== last.node) {
				last._markAsLastNode();
				this._lastNode = last;
				if (lastNode) lastNode._clearMarkAsLastNode();
			}
		}
		
	},
	
	/**
	 * 根据当前的节点情况更新当前节点的图标。
	 * @protected
	 */
	updateNodeType: function(){
		this.setNodeType(this.subControl && this.subControl.first() ? this.isCollapsed() ? 'plus' : 'minus' : 'normal');
	},
	
	/**
	 * 获取一个值，该值指示当前节点是否为最后一个节点。
	 * @return {Boolean}
	 * @protected
	 */
	isLastNode: function(){
		return this.parentNode &&  this.parentNode._lastNode === this;
	},
	
	onDblClick: function(e){
		this.toggleCollapse();
		e.preventDefault();
		e.stopPropagation();
	},
	
	init: function(options){
		this.unselectable();
		this.on('dblclick', this.onDblClick, this);

		// 绑定节点和控件，方便发生事件后，根据事件源得到控件。
		this.dataField().control = this;
	},
	
	/**
	 * 获取当前节点的图标。
	 */
	getNodeType: function(){
		var span = this.span(0);
		return span ? (/ui-treenode-(.+)/.exec(span.node.className.replace(/\bui-treenode-space\b/, '')) || [0, "line"])[1] : null;
	},
	
	/**
	 * 设置当前节点的图标。
	 * @param {String} type 类型。肯能的值如： 'normal' 'plus' 'minus' 'none' 'loading' 'line'。
	 * @return this
	 */
	setNodeType: function(type){
		var span = this.span(0);
		if(span) {
			span.node.className = 'ui-treenode-space ui-treenode-' + type;
		}
		return this;
	},
	
	onCollapse: function () {
	    ICollapsable.onCollapse.call(this);
	    this.updateNodeType();
	},
	
	onExpanding: function(){
	    this.setNodeType(this.subControl && this.subControl.first() ? 'minus' : 'normal');
	    ICollapsable.onExpanding.call(this);
	},
	
	onExpand: function(){
		if(this.subControl) {
			this.subControl.node.style.height = 'auto';
		}
		ICollapsable.onExpand.call(this);
	},
	
	/**
	 * 展开当前节点及子节点。
	 * @param {Integer} duration 折叠动画使用的毫米数。
	 * @param {Integer} maxDepth=0 最大折叠的深度。默认为 -1 表示全部折叠。
	 * @return this
	 */
	expandAll: function(duration, maxDepth){
		if (this.subControl && !(maxDepth === 0)) {
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
		if (this.subControl && !(maxDepth === 0)) {
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
	
	invoke: function(funcName, args){
		if(this.subControl){
			this.subControl.invoke(funcName, args);
		}
		return this;
	},

	/**
	 * 获取当前节点的深度。
	 * @return {Integer} 返回节点深度。
	 */
	getDepth: function(){
		return Dom.dataField(this.dom[0]).treeViewDepth;
	},

	/**
	 * 设置当前节点的深度。
	 * @param {Integer} value 要设置的深度。
	 * @return this
	 */
	setDepth: function(value){
		
		assert(value >= 0, "TreeNode#setDepth(value): {value} 必须是不小于 0 的整数", value);
		
		var me = this,
			currentDepth = me.getDepth(),
			span,
			current = me;
		
		// 删除多余的占位符。
		
		while(currentDepth > value){
			me.removeChild(elem.first());
			currentDepth--;
		}
	
		// 补上不够的占位符。
		
		while(currentDepth < value){
			me.prepend(Dom.createNode('span', 'ui-treenode-space'));
			currentDepth++;
		}
		
		// 更新深度。
		
		Dom.dataField(this.dom[0]).treeViewDepth = value;
		
		// 绑定最后一个 span 的点击事件。
		
		span = this.span(0);
		
		if(currentDepth) {
			span.un('click', this.onDblClick).on('click', this.onDblClick, this);
		}
		
		// 更新 spans 的 class 状态。
		
		while((current = current.parentNode) && (span = span.prev())){
			span.node.className = current.isLastNode() ? 'ui-treenode-space ui-treenode-none' : 'ui-treenode-space';
		}
		
		me.updateNodeType();
		
		// 对子节点设置深度+1
		me.invoke('setDepth', [++value]);
	},
	
	getTreeView: function(){
		var n = this;
		while(n)
			n = n.parentNode;
		
		return n ? n.parentControl : null;
	},
	
	ensureVisible: function(duration){
		var n = this;
		while(n = n.parentNode) {
			n.expand(duration);
		}

		//   this.scrollIntoView();
		
		return this;
	}

});