/**
 * @author xuld
 */


include("ui/menu/menu.css");
include("dom/pin.js");
include("ui/core/treecontrol.js");


var Menu = TreeControl.extend({

    xtype: 'menu',
    
    showDuration: null,

    /**
	 * 表示当前菜单是否为浮动的菜单。 
	 */
    floating: false,

    createTreeItem: function (childControl) {

        if (!(childControl instanceof MenuItem)) {

            // 如果是文本。
            if (childControl.node.nodeType === 3) {

                // - => MenuSeperator
                if (/^\s*-\s*$/.test(childControl.getText())) {

                    childControl.remove();

                    childControl = new MenuSeperator;

                    // 其它 => 添加到 MenuItem
                } else {

                    // 保存原有 childControl 。
                    var t = childControl;
                    childControl = new MenuItem;
                    childControl.append(t);
                }
            } else if (childControl.hasClass('ui-menuseperator')) {
                childControl = new MenuSeperator(childControl);
            } else {

                // 创建对应的 MenuItem 。
                childControl = new MenuItem(childControl);
            }

        }

        return childControl;

    },

    init: function () {

        // 绑定节点和控件，方便发生事件后，根据事件源得到控件。
        this.dataField().control = this;

        // 根据已有的 DOM 结构初始化菜单。
        TreeControl.prototype.init.call(this);
    },

    show: function () {
        Dom.prototype.show.call(this, arguments, {
        	duration: this.showDuration	
        });

        // 如果菜单是浮动的，则点击后关闭菜单，否则，只关闭子菜单。
        if (this.floating)
            document.once('mouseup', this.hide, this);
        this.trigger('show');
        return this;
    },

    /**
	 * 关闭本菜单。
	 */
    hide: function () {
        Dom.prototype.hide.call(this, arguments, {
        	duration: this.showDuration	
        });

        // 先关闭子菜单。
        this.hideSubMenu();
        this.trigger('hide');
        return this;
    },

    /**
	 * 当前菜单依靠某个控件显示。
	 * @param {Control} ctrl 方向。
	 */
    showAt: function (x, y) {

        // 确保菜单已添加到文档内。
        if (!this.closest('body')) {
            this.appendTo();
        }

        // 显示节点。
        this.show();

        this.setPosition(x, y);

        return this;
    },

    /**
	 * 当前菜单依靠某个控件显示。
	 * @param {Control} ctrl 方向。
	 */
    showBy: function (ctrl, pos, offsetX, offsetY, enableReset) {

        // 确保菜单已添加到文档内。
        if (!this.closest('body')) {
            this.appendTo(ctrl.parent());
        }

        // 显示节点。
        this.show();

        this.pin(ctrl, pos || 'r', offsetX != null ? offsetX : -5, offsetY != null ? offsetY : -5, enableReset);

        return this;
    },

    /**
	 * 显示指定项的子菜单。
	 * @param {MenuItem} menuItem 子菜单项。
	 * @protected
	 */
    showSubMenu: function (menuItem) {

        // 如果不是右键的菜单，在打开子菜单后监听点击，并关闭此子菜单。
        if (!this.floating)
            document.once('mouseup', this.hideSubMenu, this);

        // 隐藏当前项子菜单。
        this.hideSubMenu();

        // 激活本项。
        menuItem.state("hover", true);

        // 如果指定的项存在子菜单。
        if (menuItem.subControl) {

            // 设置当前激活的项。
            this.currentSubMenu = menuItem;

            // 显示子菜单。
            menuItem.subControl.showBy(menuItem);

        }

    },

    /**
	 * 关闭本菜单打开的子菜单。
	 * @protected
	 */
    hideSubMenu: function () {

        // 如果有子菜单，就隐藏。
        if (this.currentSubMenu) {

            // 关闭子菜单。
            this.currentSubMenu.subControl.hide();

            // 取消激活菜单。
            this.currentSubMenu.state("hover", false);
            this.currentSubMenu = null;
        }

    }

});



/**
 * 表示菜单项。 
 */
var MenuItem = TreeControl.Item.extend({

	xtype: 'menuitem',

	/**
	 * 当被子类重写时，用于创建子树。
	 * @param {TreeControl} treeControl 要初始化的子树。
	 * @return {TreeControl} 新的 {@link TreeControl} 对象。
	 * @protected override
	 */
	createSubControl: function(treeControl){
		return new Menu(treeControl);
	},
	
	/**
	 * 当被子类重写时，用于初始化子树。
	 * @param {TreeControl} treeControl 要初始化的子树。
	 * @protected override
	 */
	initSubControl: function(treeControl){
		treeControl.hide();
		treeControl.floating = false;
		this.prepend('<i class="ui-menuitem-arrow"></i>');
		this.on('mouseup', this._cancelHideMenu);
	},
	
	/**
	 * 当被子类重写时，用于删除初始化子树。
	 * @param {TreeControl} treeControl 要删除初始化的子树。
	 * @protected override
	 */
	uninitSubControl: function(treeControl){
		treeControl.floating = true;
		this.remove('ui-menuitem-arrow');
		this.un('mouseup', this._cancelHideMenu);
	},

	onMouseOver: function() {
		this.state("hover", true);
		if (this.subControl)
			this.showSubMenu();
		else if(this.parentControl)
			this.parentControl.hideSubMenu();
	},
	
	onMouseOut: function() {

		// 没子菜单，需要自取消激活。
		// 否则，由父菜单取消当前菜单的状态。
		// 因为如果有子菜单，必须在子菜单关闭后才能关闭激活。

		if (!this.subControl)
			this.state("hover", false);

	},
	
	/**
	 *
	 */
	init: function() {
		if(this.hasClass('ui-' + this.xtype)) {
			this.unselectable();
			this.on('mouseover', this.onMouseOver);
			this.on('mouseout', this.onMouseOut);
		}
	},
	
	_cancelHideMenu: function(e) {
		e.stopPropagation();
	},

	_hideTargetMenu: function(e) {
		var tg = e.relatedTarget;
		while (tg && !Dom.hasClass(tg, 'ui-menu')) {
			tg = tg.parentNode;
		}

		if (tg) {
			new Dom(tg).dataField().control.hideSubMenu();
		}

	},

	getSubMenu: TreeControl.Item.prototype.getSubControl,
	
	setSubMenu: TreeControl.Item.prototype.setSubControl,

	showSubMenu: function(){

		// 使用父菜单打开本菜单，显示子菜单。
		this.parentControl && this.parentControl.showSubMenu(this);
		
		return this;
	},
	
	hideSubMenu: function(){

		// 使用父菜单打开本菜单，显示子菜单。
		this.parentControl && this.parentControl.hideSubMenu(this);
		
		return this;
	}

});

var MenuSeperator = MenuItem.extend({

	tpl: '<div class="ui-menuseperator"></div>',

	init: Function.empty

});