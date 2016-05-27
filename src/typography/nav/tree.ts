
typeof include === "function" && include("../control/base
");

var Tree = Control.extend({

    init: function () {
        var me = this;
        me.elem.on('click', 'a', function (e) {
            me.onIconClick(this, e);
        });
        var selected = me.elem.querySelector('.x-tree-selected');
        NodeList.each(me.elem.querySelectorAll('a'), function (icon) {
            me.setCollapsed(icon, selected || me.getCollapsed(icon));
        });
        while (selected) {
            me.setCollapsed(selected.querySelector('a'), false);
            selected = selected.parentNode.closest('li', me.elem);
        }
    },

    onIconClick: function (treeItem, e) {
        e.stopPropagation();
        this.toggleCollapse(treeItem);
    },

    /**
     * 获取指定树节点的子树。
     */
    getSubTree: function (treeItem) {
        return treeItem.nextElementSibling;
    },

    /**
     * 判断指定节点是否是折叠状态。
     * @returns {Boolean}
     */
    getCollapsed: function (treeItem) {
        var subTree = this.getSubTree(treeItem);
        return !subTree || subTree.isHidden();
    },

    /**
     * 设置当前面板是否是折叠状态。
     * @param {Boolean} value 如果指定为 true，则强制折叠，如果指定为 false，则强制展开。
     */
    setCollapsed: function (treeItem, value) {
        var icon = treeItem.querySelector('.x-icon:first-child'),
            subTree = this.getSubTree(treeItem);
        icon && icon.setStyle('transform', value !== false ? 'rotate(-90deg)' : 'rotate(0)');
        subTree && subTree.toggle(value === false);
        return this;
    },

    /**
     * 切换折叠指定的节点。
     */
    toggleCollapse: function (treeItem, value) {
        var icon = treeItem.querySelector('.x-icon:first-child'),
            subTree = this.getSubTree(treeItem);
        if (value == null ? this.getCollapsed(treeItem) : value) {
            icon && icon.animate({ transform: 'rotate(0)' });
            subTree && subTree.show('height');
        } else {
            icon && icon.animate({ transform: 'rotate(-90deg)' });
            subTree && subTree.hide('height');
        }
    }

});