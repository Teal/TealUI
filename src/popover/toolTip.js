/**
 * @author xuld
 */

// #require ui/part/arrow.css
// #require ui/tip/tooltip.css
// #require ui/core/contentcontrol.js
// #require ui/core/itooltip.js

/**
 * 表示一个工具提示。
 * @extends Control
 */
var ToolTip = Popover.extend({

    /**
     * 初始化当前控件。
     */
    init: function (options) {
        Popover.prototype.init.call(this, options);
        Dom.on(this.elem, 'click', '.x-closebutton', this.hide.bind(this));
    },

    /**
     * 设置某个控件的工具提示为当前工具提示。
     * @param {Dom} targets 要设置的目标节点。
     */
    setToolTip: function (targets) {
        var me = this;
        Dom.each(Dom.query(targets), function (target) {
            Dom.hover(target, function (e) {

                me.target = target;

                // 根据目标节点的 data-title 自动绑定当前节点的属性。
                var title = target.getAttribute('data-title');
                if (title) {
                    var arrow = Dom.find('.x-arrow', me.elem);
                    me.elem.innerHTML = title;
                    arrow && Dom.prepend(me.elem, arrow);
                }

                // 显示工具提示。
                me.show(e);
            }, me.hide.bind(me), me.initialDelay);
        });
        return me;
    }

});

Dom.ready(function () {

    // 初始化所有 [data-title] 节点。
    var domNeedToolTip = Dom.query('[data-title]');
    if (domNeedToolTip.length) {
        ToolTip.global = Control.get(Dom.append(document.body, '<span class="x-tooltip" />'), 'toolTip').setAlign('top').setToolTip(domNeedToolTip);
    }

});
