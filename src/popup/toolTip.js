/**
 * @author xuld
 */

//#include ui/part/arrow.css
//#include ui/tip/tooltip.css
//#include ui/core/contentcontrol.js
//#include ui/core/itooltip.js

/**
 * 表示一个工具提示。
 * @extends ContentControl
 */
var ToolTip = Control.extend({

    /**
     * 设置当前控件的角色。
     */
    role: 'toolTip',

    /**
     * 当前工具提示和目标文本的距离。
     */
    distance: 15,

    /**
     * 工具提示显示之前经过的时间。
     * @type Integer
     */
    initialDelay: 300,

    /**
     * 初始化当前控件。
     * @param {Object} options 传入的只读选项。
     */
    init: function (options) {

        // 设置关闭按钮事件。
        Dom.on(this.elem, 'click', '.x-closebutton', this.hide.bind(this));

        // 绑定目标节点的工具提示。
        this.setToolTip(options.target);
    },

    /**
     * 设置某个控件的工具提示为当前工具提示。
     * @param {Dom} targets 要设置的目标节点。
     */
    setToolTip: function (targets) {
        var me = this;
        Dom.query(targets).each(function(target) {
            Dom.hover(function (e) {

                // 根据目标节点的 data-title 自动绑定当前节点的属性。
                var title = Dom.getAttr(target, 'data-title');
                if (title) {
                    Dom.setHtml(target, title);
                }

                // 显示工具提示。
                me.show(me.getArrow() ? target : e);
            }, me.hide.bind(me), me.initialDelay);
        });
        return me;
    },

    /**
     * 获取当前工具提示的箭头。
     */
    getArrow: function () {
        var arrowDom = Dom.first(this.elem);
        return arrowDom && (/\bx-arrow-(\w+)\b/.exec(arrowDom.className) || [])[1] || null;
    },

    /**
     * 设置当前工具提示的箭头。
     * @param {String} arrow 要设置的箭头方向。可以是 null, 'top', 'bottom', 'center', 'right'。
     */
    setArrow: function (arrow) {
        var arrowDom = Dom.first(this.elem);
        if (arrow) {
            (arrowDom || Dom.prepend(this.elem, '<i></i>')).className = 'x-arrow x-arrow-' + arrow;
        } else {
            arrowDom && Dom.remove(arrowDom);
        }
        return this;
    },

    /**
     * 在指定节点附近显示当前工具提示。
     * @param {Object/Dom/Event} target 依靠的元素位置。可以是 {left: 100, top: 400} 或一个节点或一个事件节点。
     */
    show: function (target) {

        // 渲染当前节点。
        Dom.render(this.elem, Dom.offsetParent(target));

        // 设置箭头。
        var currentArrow = this.getArrow();
        if (currentArrow !== arrow) {
            this.setArrow(currentArrow = arrow);
        }

        // 显示当前元素。
        Dom.show(this.elem, 'opacity');

        // 设置位置。
        if (target) {
            Dom.pin(this.elem, target, currentArrow, this.distance);
        }
        
        return this.trigger('show', target);

    },

    /**
     * 隐藏当前工具提示。
     */
    hide: function () {
        Dom.hide(this.elem, 'opacity');
        return this.trigger('hide');
    }

});

Dom.ready(function () {

    // 初始化所有 [data-title] 节点。
    var domNeedToolTip = Dom.query('[data-title]');
    if (domNeedToolTip.length) {
        ToolTip.global = Dom.parse('<span class="x-tooltip" />').toolTip().setToolTip(domNeedToolTip);
    }

});
