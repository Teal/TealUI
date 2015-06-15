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
     * 自动定位悬浮层。
     * @type {Boolean}
     */
    autoAlign: true,

    /**
     * 初始化当前控件。
     */
    init: function (options) {
        Popover.prototype.init.call(this, options);
        this.elem.on('click', '.x-closebutton', this.hide, this);
    },

    /**
     * 设置某个控件的工具提示为当前工具提示。
     * @param {Dom} targets 要设置的目标节点。
     */
    setToolTip: function (targets) {
        var me = this;
        NodeList.each(document.queryAll(targets), function (target) {
            
            target.hover(function (e) {
                
                me.target = target;

                // 根据目标节点的 data-title 自动绑定当前节点的属性。
                var title = target.getAttribute('data-title');
                if (title) {
                    me.elem.innerHTML = title;
                }

                // 显示工具提示。
                me.show(e);
            }, me.hide, me.initialDelay, me);
        });
        return me;
    }

});

document.ready(function () {
    // 初始化所有 [data-title] 节点。
    var domNeedToolTip = document.querySelectorAll('[data-title]');
    if (domNeedToolTip.length) {
        ToolTip.global = Control.get(document.body.append('<span class="x-tooltip" />'), 'toolTip', { target: null }).setAlign('top').setToolTip(domNeedToolTip);
    }

});
