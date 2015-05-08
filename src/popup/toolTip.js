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

    ///**
    // * 当指针在具有指定工具提示文本的控件内保持静止时，工具提示保持可见的时间期限。-1表示不自动隐藏。 0 表示始终不显示。
    // * @type Number
    // */
    //autoDelay: -1,

    /**
     * 工具提示显示之前经过的时间。
     * @type Integer
     */
    initialDelay: 500,

    /**
     * 指针从一个控件移到另一控件时，必须经过多长时间才会出现后面的工具提示窗口。
     * @type Integer
     */
    reshowDelay: 100,

    /**
	 * 显示时使用的特效持续时间。
	 */
    toggleTimeout: 100,

    /**
     * 隐藏当前工具提示。
     */
    hide: function () {
        this.dom.hide('opacity', this.toggleTimeout);
        return this.trigger('hide');
    },

    /**
     * 显示当前工具提示。
     */
    show: function () {
        this.dom.show('opacity', this.toggleTimeout);
        return this.trigger('show');
    },

    /**
     * 在指定位置显示当前工具提示。
     */
    showAt: function (position) {
        this.dom.setPosition(position);
        this.show();
        return this;
    },

    /**
     * 在指定节点附近显示当前工具提示。
     */
    showBy: function (target, offsetX, offsetY, e) {

        this.dom.appendTo(Dom.get(elem).parent());

        var configs = ({
            left: ['rr-yc', 15, 0],
            right: ['ll-yc', 15, 0],
            top: ['xc-bb', 0, 15],
            bottom: ['xc-tt', 0, 15]
        }[this.dom.getAttr('data-arrow')]) || ['xc-bb', 0, 5, 1];

        this.dom.pin(target, configs[0], offsetX === undefined ? configs[1] : offsetX, offsetY === undefined ? configs[2] : offsetY, false);
        this.show();

        if (configs[3] && e) {
            Dom.setPosition(this.elem, { x: e.pageX + (offsetX || 0) });
        }

        return this;

    },

    /**
     * 设置某个控件工具提示。
     */
    setToolTip: function (target, offsetX, offsetY) {
        var me = this;
        Dom.query(target).hover(function(e) {
            me.showBy(elem, offsetX, offsetY, e);
        }, me.hide.bind(me), me.initialDelay);
        return me;
    },

    init: function (options) {
        this.on('click', '.x-closebutton', this.hide.bind(this));
        this.setToolTip(options.target);
    }

});

/**
 * 获取或设置工具提示的默认方向。
 */
ToolTip.defaultArrow = 'none';

Dom.ready(function () {

    // 初始化所有 [data-title] 节点。
    var domNeedToolTip = Dom.query('[data-title]');
    if (domNeedToolTip.length) {
        ToolTip.global = Dom.parse('<span class="x-tooltip" />')
            .setAttr('data-arrow', ToolTip.defaultArrow)
            .toolTip({
                target: domNeedToolTip
            });
    }

    // 初始化所有 [data-tooltip] 节点。
    Dom.query('[data-tooltip]').each(function (elem) {
        Dom.query(Dom.get(elem).getAttr('data-tooltip')).toolTip({
            target: elem
        })
    });

});

