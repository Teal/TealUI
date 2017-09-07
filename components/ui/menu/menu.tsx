import { Control, VNode, bind } from "control";
import "./menu.scss";

/**
 * 表示一个菜单。
 */
export class Menu extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-menu"></div>;
    }

}

export default Menu;
// #todo

/**
 * @author xuld@vip.qq.com
 */

typeof include === "function" && include("../control/base");
typeof include === "function" && include("../utility/dom/pin");

/**
 * 表示一个菜单。
 * @class
 * @extends Control
 * @remark 菜单可以以三种方式显示：
 * 1. 右键菜单。
 * 2. 下拉菜单。
 * 3. 静态菜单。
 */
var Menu = Control.extend({
    role: "menu",

    /**
     * 获取当前菜单的父菜单。
     * @return {Menu} 返回父菜单。如果不存在父菜单则返回 @null。 
     */
    parent: function () {
        var parent = this.dom.parent().closest(".x-menu");
        return parent.length ? parent.role("menu") : null;
    },

    init: function () {
        var me = this;

        // 鼠标移到每一项高亮相关项。
        me.dom.on('mouseover', function (e) {
            var item = Dom(e.target);
            if (item.is(".x-menu > li > a")) {
                item = item.parent();
                if (item.parent()[0] === me.dom[0]) {
                    me.selectItem(item);
                }
            }
        });

        // 子菜单：菜单的显示和隐藏由父菜单管理。
        if (!me.parent()) {
            // 主菜单：如果是浮动菜单，则交由浮动处理。
            if (me.dom.is(".x-popover") || Dom.data(me.dom[0], 'roles').popover) {
                var popover = me.dom.role('popover');
                // 设置为右键或下拉菜单。
                me.popover = popover.on('show', function () {
                    me.hideSub().selectedItem(null);
                });
                me.dom.on('click', function (e) {
                    e.preventDefault();
                    // 如果是禁用或展开菜单，则点击无效。
                    if (me.onItemClick(e)) {
                        me.popover.hide(e);
                    }
                });
                me.popover.target.keyNav(me.keyBindings());
            } else {
                // 如果不是子菜单，则绑定点击隐藏事件。
                Dom(document).on('click', function (e) {
                    if (!me.dom.contains(e.target) || me.onItemClick(e)) {
                        me.hideSub(e);
                    }
                });
            }
        }
    },

    onItemClick: function (e) {
        var target = Dom(e.target).closest('li');
        // 禁用无法点击。
        // 有子菜单无法点击。
        return !target.is(".x-menu-disbaled,.x-menu-arrow") && !target.children(".x-menu").length;
    },

    /**
     * 模拟用户选择一项。
     * @param {Dom} item 要选择的项。 
     * @param {Event} [e] 相关的事件对象。 
     * @return this 
     */
    selectItem: function (item) {
        var me = this.selectedItem(item);
        var subMenu = Dom(item).children('.x-menu');
        if (subMenu.length) {
            me._subMenu = subMenu.role('menu').selectedItem(null).show(item);
        }
        return me;
    },

    /**
     * 获取或设置当前选中的项。
     * @param {Dom} item 要选择的项。 
     * @return this 
     */
    selectedItem: function (item) {
        var me = this;
        var selected = me.dom.children('.x-menu-selected');
        if (item === undefined) {
            return selected;
        }
        item = Dom(item);
        if (item[0] === selected[0]) {
            return me;
        }
        selected.removeClass('x-menu-selected');
        item.addClass('x-menu-selected');
        return me.hideSub();
    },

    /**
     * 显示当前菜单。
     * @param {mixed} [pos] 显示的位置或依靠的节点或事件对象。
     * @return this
     */
    show: function (pos) {
        this.dom.show('opacity', null, this.duration);
        pos && this.dom.pin(pos, "rt", 0, -5);
        return this;
    },

    /**
     * 隐藏当前菜单。
     * @return this
     */
    hide: function () {
        this.dom.hide();
        return this.hideSub();
    },

    /**
     * 关闭当前菜单的所有子菜单。
     * @return this
     */
    hideSub: function () {
        var me = this;
        if (me._subMenu) {
            me._subMenu.hide();
            me._subMenu = null;
        }
        return me;
    },

    /**
     * 获取当前菜单的默认键盘绑定。
     * @return {Object} 返回各个键盘绑定对象。
     */
    keyBindings: function () {
        var me = this;

        function activeMenu() {
            var currentMenu = me._activeMenu;
            return currentMenu && !currentMenu.dom.isHidden() ? currentMenu : me;
        }

        function upDown(isUp, prev, end) {
            var currentMenu = activeMenu();

            currentMenu.show();

            // 定位当前选中项。
            var current = prev || currentMenu.selectedItem();

            // 执行移动。
            current = isUp ? current.prev() : current.next();

            // 如果移动到末尾则回到第一项。
            if (!current.length) {
                current = isUp ? currentMenu.dom.last() : currentMenu.dom.first();
            }

            // 跳过禁用项和分隔符。
            // 避免终找不到正确的菜单发生死循环。
            if (current.is(".x-menu-disabled, .x-menu-divider") && (!end || current[0] !== end[0])) {
                current = upDown(isUp, current, end || current);
            }

            // 内部获取实际项。
            if (prev) {
                return current;
            }

            // 选中指定项。
            currentMenu.selectedItem(current);

        }

        return {
            up: function () {
                upDown(true);
            },
            down: function () {
                upDown(false);
            },
            right: function () {
                var currentMenu = activeMenu();
                currentMenu.selectItem(currentMenu.selectedItem());
                if (currentMenu._subMenu) {
                    me._activeMenu = currentMenu._subMenu;
                    upDown(false);
                    return false;
                }
                return true;
            },
            left: function () {
                var currentMenu = activeMenu();
                if (currentMenu !== me) {
                    me._activeMenu = currentMenu.parent() || me;
                    me._activeMenu.hideSub();
                    if (me._activeMenu === me) {
                        delete _activeMenu;
                    }
                    return false;
                }
                return true;
            },
            enter: function () {
                activeMenu().selectedItem().click();
            },
            esc: function () {
                me.hide();
            }
        };
    }

});

imports("Controls.Button.Menu");
using("System.Dom.Align");
using("Controls.Core.TreeControl");



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
		this.addClass('x-menuitem-submenu');
		this.on('mouseup', this._cancelHideMenu);
	},
	
	/**
	 * 当被子类重写时，用于删除初始化子树。
	 * @param {TreeControl} treeControl 要删除初始化的子树。
	 * @protected override
	 */
	uninitSubControl: function(treeControl){
		treeControl.floating = true;
		this.removeClass('x-menuitem-submenu');
		this.un('mouseup', this._cancelHideMenu);
	},

	onMouseOver: function() {
		this.hovering(true);
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
			this.hovering(false);

	},
	
	/**
	 *
	 */
	init: function() {
		if(this.hasClass('x-' + this.xtype)) {
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
		while (tg && !Dom.hasClass(tg, 'x-menu')) {
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

	tpl: '<div class="x-menuseperator"></div>',

	init: Function.empty

});

var Menu = TreeControl.extend({

	xtype: 'menu',
	
	/**
	 * 表示当前菜单是否为浮动的菜单。 
	 */
	floating: false,

	createTreeItem: function(childControl, parent) {
		
		if(!(childControl instanceof MenuItem)){
	
			// 如果是文本。
			if (childControl.node.nodeType === 3) {
	
				// - => MenuSeperator
				if (/^\s*-\s*$/.test(childControl.getText())) {
	
					// 删除文本节点。
					if (parent) {
						parent.remove(childControl);
					}
	
					childControl = new MenuSeperator;
	
					// 其它 => 添加到 MenuItem
				} else {
	
					// 保存原有 childControl 。
					var t = childControl;
					childControl = new MenuItem;
					childControl.content().replaceWith(t);
				}
				if (parent) {
					parent.prepend(childControl);
				}
			} else if(childControl.hasClass('x-menuseperator')){
				childControl = new MenuSeperator;
			} else {
	
				// 创建对应的 MenuItem 。
				childControl = new MenuItem(childControl);
			}
				
		}

		return childControl;

	},

	init: function() {

		// 绑定节点和控件，方便发生事件后，根据事件源得到控件。
		this.dataField().control = this;

		// 根据已有的 DOM 结构初始化菜单。
		this.initItems();
	},

	onShow: function() {
		
		// 如果菜单是浮动的，则点击后关闭菜单，否则，只关闭子菜单。
		if(this.floating)
			document.once('mouseup', this.hide, this);
		this.trigger('show');
	},

	/**
	 * 关闭本菜单。
	 */
	onHide: function() {

		// 先关闭子菜单。
		this.hideSubMenu();
		this.trigger('hide');
	},

	show: function() {
		Dom.show(this.node);
		this.onShow();
		return this;
	},

	hide: function() {
		Dom.hide(this.node);
		this.onHide();
		return this;
	},
	
	/**
	 * 当前菜单依靠某个控件显示。
	 * @param {Control} ctrl 方向。
	 */
	showAt: function(x, y) {
		
		// 确保菜单已添加到文档内。
		if (!this.parent('body')) {
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
	showBy: function(ctrl, pos, offsetX, offsetY, enableReset) {

		// 确保菜单已添加到文档内。
		if (!this.parent('body')) {
			this.appendTo(ctrl.parent());
		}

		// 显示节点。
		this.show();

		this.align(ctrl, pos || 'rt', offsetX != null ? offsetX : -5, offsetY != null ? offsetY : -5, enableReset);

		return this;
	},

	/**
	 * 显示指定项的子菜单。
	 * @param {MenuItem} menuItem 子菜单项。
	 * @protected
	 */
	showSubMenu: function(menuItem) {

		// 如果不是右键的菜单，在打开子菜单后监听点击，并关闭此子菜单。
		if (!this.floating)
			document.once('mouseup', this.hideSubMenu, this);

		// 隐藏当前项子菜单。
		this.hideSubMenu();

		// 激活本项。
		menuItem.hovering(true);

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
	hideSubMenu: function() {

		// 如果有子菜单，就隐藏。
		if (this.currentSubMenu) {

			// 关闭子菜单。
			this.currentSubMenu.subControl.hide();

			// 取消激活菜单。
			this.currentSubMenu.hovering(false);
			this.currentSubMenu = null;
		}
		
	}

});


/**
 * @author xuld
 */


imports("Controls.Button.Menu-Alt");
using("System.Dom.Align");
using("Controls.Core.TreeControl");



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
		this.addClass('x-menuitem-submenu');
		this.on('mouseup', this._cancelHideMenu);
	},
	
	/**
	 * 当被子类重写时，用于删除初始化子树。
	 * @param {TreeControl} treeControl 要删除初始化的子树。
	 * @protected override
	 */
	uninitSubControl: function(treeControl){
		treeControl.floating = true;
		this.removeClass('x-menuitem-submenu');
		this.un('mouseup', this._cancelHideMenu);
	},

	onMouseOver: function() {
		this.hovering(true);
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
			this.hovering(false);

	},
	
	/**
	 *
	 */
	init: function() {
		if(this.hasClass('x-' + this.xtype)) {
			this.unselectable();
			this.on('mouseover', this.onMouseOver);
			this.on('mouseout', this.onMouseOut);
			if(!this.icon()){
				this.setIcon('none');
			}
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
	},
	
	hovering: function(value){
		this.parent().toggleClass("x-menu-hover", value !== false);
		this.toggleClass("x-menuitem-hover", value !== false);
	}

});

var MenuSeperator = MenuItem.extend({

	tpl: '<div class="x-menuseperator"></div>',

	init: Function.empty

});

var Menu = TreeControl.extend({

	xtype: 'menu',
	
	/**
	 * 表示当前菜单是否为浮动的菜单。 
	 */
	floating: false,

	createTreeItem: function(childControl, parent) {
		
		if(!(childControl instanceof MenuItem)){
	
			// 如果是文本。
			if (childControl.node.nodeType === 3) {
	
				// - => MenuSeperator
				if (/^\s*-\s*$/.test(childControl.getText())) {
	
					// 删除文本节点。
					if (parent) {
						parent.remove(childControl);
					}
	
					childControl = new MenuSeperator;
	
					// 其它 => 添加到 MenuItem
				} else {
	
					// 保存原有 childControl 。
					var t = childControl;
					childControl = new MenuItem;
					childControl.content().replaceWith(t);
				}
				if (parent) {
					parent.prepend(childControl);
				}
			} else if(childControl.hasClass('x-menuseperator')){
				childControl = new MenuSeperator;
			} else {
	
				// 创建对应的 MenuItem 。
				childControl = new MenuItem(childControl);
			}
				
		}

		return childControl;

	},

	init: function() {

		// 绑定节点和控件，方便发生事件后，根据事件源得到控件。
		this.dataField().control = this;

		// 根据已有的 DOM 结构初始化菜单。
		this.initItems();
	},

	onShow: function() {
		
		// 如果菜单是浮动的，则点击后关闭菜单，否则，只关闭子菜单。
		if(this.floating)
			document.once('mouseup', this.hide, this);
		this.trigger('show');
	},

	/**
	 * 关闭本菜单。
	 */
	onHide: function() {

		// 先关闭子菜单。
		this.hideSubMenu();
		this.trigger('hide');
	},

	show: function() {
		Dom.show(this.node);
		this.onShow();
		return this;
	},

	hide: function() {
		Dom.hide(this.node);
		this.onHide();
		return this;
	},
	
	/**
	 * 当前菜单依靠某个控件显示。
	 * @param {Control} ctrl 方向。
	 */
	showAt: function(x, y) {
		
		// 确保菜单已添加到文档内。
		if (!this.parent('body')) {
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
	showBy: function(ctrl, pos, offsetX, offsetY, enableReset) {

		// 确保菜单已添加到文档内。
		if (!this.parent('body')) {
			this.appendTo(ctrl.parent());
		}

		// 显示节点。
		this.show();

		this.align(ctrl, pos || 'rt', offsetX != null ? offsetX : -5, offsetY != null ? offsetY : -5, enableReset);

		return this;
	},

	/**
	 * 显示指定项的子菜单。
	 * @param {MenuItem} menuItem 子菜单项。
	 * @protected
	 */
	showSubMenu: function(menuItem) {

		// 如果不是右键的菜单，在打开子菜单后监听点击，并关闭此子菜单。
		if (!this.floating)
			document.once('mouseup', this.hideSubMenu, this);

		// 隐藏当前项子菜单。
		this.hideSubMenu();

		// 激活本项。
		menuItem.hovering(true);

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
	hideSubMenu: function() {

		// 如果有子菜单，就隐藏。
		if (this.currentSubMenu) {

			// 关闭子菜单。
			this.currentSubMenu.subControl.hide();

			// 取消激活菜单。
			this.currentSubMenu.hovering(false);
			this.currentSubMenu = null;
		}
		
	}

});







