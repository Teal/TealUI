/**
 * @author xuld
 */

//#include ui/menu/menu.css
//#include dom/pin.js
//#include fx/animate.js
//#include ui/core/treecontrol.js

var Menu = TreeControl.extend({

	cssClass: 'x-menu',
    
	showArgs: null,

	floating: false,

    createNode: function (existDom) {
    	return new MenuItem(existDom);
    },

	/**
	 * 初始化并返回每一个 TreeItem 对象。
	 * @param {Dom} li 包含树节点的  li 节点对象。
	 * @param {Dom} [childControl] 强制指定 li 内指定的子节点。
	 * @private
	 */
    initChildNode: function (li) {
    	this.itemOf(li);
    	TreeControl.prototype.initChildNode.call(this, li);
    },

    insertBefore: function (newItem, refItem) {

    	// 将 - 转为分隔符。
    	if (newItem === "-") {
    		newItem = new MenuSeperator();
    	}

    	return TreeControl.prototype.insertBefore.call(this, newItem, refItem);
    },

    show: function () {
    	Dom.show(this.elem, this.showArgs);

        // 如果菜单是浮动的，则点击后关闭菜单，否则，只关闭子菜单。
    	if (this.floating)
    		Dom.on(document, 'mouseup', function () {
    			Dom.un(document, 'mouseup', arguments.callee);
    			this.hide();
    		}, this);
        this.trigger('show');
        return this;
    },

    /**
	 * 关闭本菜单。
	 */
    hide: function () {
    	Dom.hide(this.elem, this.showArgs);

        // 先关闭子菜单。
        this.hideSub();
        this.trigger('hide');
        return this;
    },

    /**
	 * 当前菜单依靠某个控件显示。
	 * @param {Control} ctrl 方向。
	 */
    showAt: function (p) {

        // 确保菜单已添加到文档内。
        Dom.render(this.elem);

        // 显示节点。
        this.show();

        Dom.setPosition(this.elem, p);

        return this;
    },

    /**
	 * 当前菜单依靠某个控件显示。
	 * @param {Control} ctrl 方向。
	 */
    showBy: function (ctrl, pos, offsetX, offsetY, enableReset) {

        // 确保菜单已添加到文档内。
    	if (!Dom.contains(document.body, this.elem)) {
    		Dom.append(ctrl.parentNode, this.elem);
        }

        // 显示节点。
        this.show();

        Dom.pin(this.elem, ctrl.elem ||ctrl, pos || 'r', offsetX != null ? offsetX : -5, offsetY != null ? offsetY : -5, enableReset);

        return this;
    },

    /**
	 * 显示指定项的子菜单。
	 * @param {MenuItem} menuItem 子菜单项。
	 * @protected
	 */
    showSub: function (menuItem) {

    	// 如果不是右键的菜单，在打开子菜单后监听点击，并关闭此子菜单。
    	if (!this.floating) {
    		Dom.on(document, 'mouseup', function () {
    			Dom.un(document, 'mouseup', arguments.callee);
    			this.hideSub();
    		}, this);
    	}

        // 隐藏当前项子菜单。
        this.hideSub();

        // 激活本项。
        Dom.addClass(menuItem.elem, "x-menuitem-hover");

        // 如果指定的项存在子菜单。
        if (menuItem.getSub()) {

            // 设置当前激活的项。
            this.currentSub = menuItem;

            // 显示子菜单。
            menuItem.getSub().showBy(menuItem);

        }

    },

    /**
	 * 关闭本菜单打开的子菜单。
	 * @protected
	 */
    hideSub: function () {

        // 如果有子菜单，就隐藏。
        if (this.currentSub) {

            // 关闭子菜单。
        	this.currentSub.getSub().hide();

        	// 取消激活菜单。
        	Dom.removeClass(this.currentSub.elem, "x-menuitem-hover");
            this.currentSub = null;
        }

    }

});

/**
 * 表示菜单项。 
 */
var MenuItem = TreeControl.Node.extend({

	cssClass: 'x-menuitem',

	/**
	 * 当被子类重写时，用于创建子树。
	 * @param {TreeControl} treeControl 要初始化的子树。
	 * @return {TreeControl} 新的 {@link TreeControl} 对象。
	 * @protected override
	 */
	createSub: function(treeControl){
		return new Menu(treeControl);
	},
	
	/**
	 * 当被子类重写时，用于初始化子树。
	 * @param {TreeControl} treeControl 要初始化的子树。
	 * @protected override
	 */
	initSub: function (treeControl) {
		treeControl.hide();
		treeControl.floating = false;
		Dom.prepend(this.elem, '<i class="x-menuitem-arrow"></i>');
		Dom.on(this.elem, 'mouseup', this._cancelHideMenu, this);
	},
	
	/**
	 * 当被子类重写时，用于删除初始化子树。
	 * @param {TreeControl} treeControl 要删除初始化的子树。
	 * @protected override
	 */
	uninitSub: function (treeControl) {
		treeControl.floating = true;
		Dom.remove(Dom.find('x-menuitem-arrow'));
		Dom.un(this.elem, 'mouseup', this._cancelHideMenu);
	},

	onMouseOver: function () {
		Dom.addClass(this.elem, "x-menuitem-hover");
		if (this.getSub())
			this.showSub();
		else if(this.owner())
			this.owner().hideSub();
	},
	
	onMouseOut: function() {

		// 没子菜单，需要自取消激活。
		// 否则，由父菜单取消当前菜单的状态。
		// 因为如果有子菜单，必须在子菜单关闭后才能关闭激活。

		if (!this.getSub()) {
			Dom.removeClass(this.elem, "x-menuitem-hover");
		}

	},
	
	/**
	 *
	 */
	init: function (options) {
		TreeControl.Node.prototype.init.call(this, options);
		if(Dom.hasClass(this.elem, this.cssClass)) {
			Dom.setStyle(this.elem, 'user-select', 'none');
			Dom.on(this.elem, 'mouseover', this.onMouseOver, this);
			Dom.on(this.elem, 'mouseout', this.onMouseOut, this);
		}
	},
	
	_cancelHideMenu: function(e) {
		e.stopPropagation();
	},

	_hideTargetMenu: function(e) {
		var tg = e.relatedTarget;
		while (tg && !Dom.hasClass(tg, 'x-menu')) {
			tg = tg.parentNode;
		}

		if (tg) {
			Dom.data(tg).treeControl.hideSub();
		}

	},

	showSub: function(){

		var owner = this.owner();

		// 使用父菜单打开本菜单，显示子菜单。
		owner && owner.showSub(this);
		
		return this;
	},
	
	hideSub: function () {

		var owner = this.owner();

		// 使用父菜单打开本菜单，显示子菜单。
		owner && owner.hideSub(this);
		
		return this;
	}

});

var MenuSeperator = MenuItem.extend({

	cssClass: 'x-menuseperator',

	tpl: '<div class="{cssClass}"></div>',

	init: Function.empty

});
