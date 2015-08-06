/**
 * @author xuld
 */

// #require ../control/base
// #require ../utility/dom/pin

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
     * @returns {Menu} 返回父菜单。如果不存在父菜单则返回 @null。 
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

        // 设置为右键菜单。
        if (me.dom.is(".x-contextmenu")) {
            (me.target || me.dom.prev()).on('contextmenu', function (e) {
                e.preventDefault();
                e.stopPropagation();
                me.selectedItem(null).show(e);
            });
        }

        // 设置为下拉菜单。
        if (me.dom.is(".x-dropdownmenu") || Dom.data(me.dom[0], 'roles').popover) {
            me.popover = me.dom.role("popover");
            me.popover.on('show', function () {
                me.hideSub().selectedItem(null);
            });
            me.dom.on('click', function (e) {
                me.popover.hide(e);
            });
            me.popover.target.keyNav && me.popover.target.keyNav(me.keyBindings());
        } else if (!me.parent()) {

            // 如果不是子菜单，则绑定点击隐藏事件。
            // x-dropdownmenu 的子菜单显示与否由 Popover 管理。
            function hideCore(e) {
                me.dom.is(".x-contextmenu, .x-popover") ? me.hide(e) : me.hideSub(e);
            }
            Dom(document).on('mousedown', function (e) {
                me.dom.contains(e.target) || hideCore(e);
            });
            me.dom.on('click', hideCore);
        }
    },

    /**
     * 模拟用户选择一项。
     * @param {Dom} item 要选择的项。 
     * @param {Event} [e] 相关的事件对象。 
     * @returns this 
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
     * @returns this 
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
     * @returns this
     */
    show: function (pos) {
        this.dom.show('opacity', null, this.duration);
        pos && this.dom.pin(pos, "rt", 0, -5);
        return this;
    },

    /**
     * 隐藏当前菜单。
     * @returns this
     */
    hide: function () {
        this.dom.hide();
        return this.hideSub();
    },

    /**
     * 关闭当前菜单的所有子菜单。
     * @returns this
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
     * @returns {Object} 返回各个键盘绑定对象。
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