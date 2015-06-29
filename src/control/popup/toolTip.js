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
     * 触发当前浮层显示的事件。
     * 可能的值为：
     * 'mouseover': 鼠标移上后显示。
     * 'hover': 鼠标悬停时显示。
     * 'click': 点击后显示。
     * 'active': 拥有焦点时显示。
     * 'focus': 获取焦点后显示。
     * null: 手动显示。
     */
    event: 'hover',

    /**
     * 如果为 true 则根据鼠标事件定位。
     * @type {Boolean}
     */
    pinEvent: true,

    /**
     * 自动定位的位置。如果为 null 则不自动定位。默认为 null。
     * @type {Boolean}
     */
    pinAlign: 'bl',

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
                    var arrow = me.elem.queryChild('.x-arrow');
                    me.elem.innerHTML = title;
                    me.elem.prepend(arrow);
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
        ToolTip.global = Control.get(document.body.append('<span class="x-tooltip"><span class="x-arrow x-arrow-bottom"></span></span>'), 'toolTip', { target: null }).setToolTip(domNeedToolTip);
    }

});
