/**
 * @author xuld
 */

typeof include === "function" && include("../typography/partial/arrow
");
typeof include === "function" && include("../control/popover
");

/**
 * 表示一个工具提示。
 * @extends Popover
 */
var ToolTip = Popover.extend({

    role: "toolTip",

    /**
     * 触发当前浮层显示的事件。可能的值为：
     * - "mouseover" 鼠标移上后显示。
     * - "hover" 鼠标悬停时显示。
     * - "click" 点击后显示。
     * - "active" 拥有焦点时显示。
     * - "focus" 获取焦点后显示。
     * - null 手动显示。
     * @inner
     */
    event: 'hover',

    /**
     * 如果为 @true，则自动对齐事件。
     * @type {Boolean}
     * @inner
     */
    pinEvent: true,

    /**
     * 自动定位的位置。如果为 @null 则不自动定位。默认为 'bl'。
     * @type {Boolean}
     * @inner
     */
    pinAlign: 'bl',

    /**
     * 自动从目标节点读取内容。
     */
    autoUpdate: false,

    /**
     * 初始化当前控件。
     * @inner
     */
    init: function() {
        Popover.prototype.init.call(this);
        this.dom.on('click', '.x-closebutton', this.hide, this);
    },

    onShow: function () {
        var me = this;
        if (me.autoUpdate) {
            var title = me.target.attr('x-title');
            if (title) {
                var arrow = me.dom.find('.x-arrow');
                me.dom.html(title).prepend(arrow);
            }
        }
    }

});

Dom.ready(function() {
    // 初始化所有 [x-title] 节点。
    var domNeedToolTip = Dom.find('[x-title]');
    if (domNeedToolTip.length) {
        ToolTip.global = Dom(document.body).append('<span class="x-tooltip"><span class="x-arrow x-arrow-bottom"></span></span>').role('toolTip', { target: domNeedToolTip, autoUpdate: true, pinEvent: false });
    }
});