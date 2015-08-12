/**
 * @author xuld
 */

typeof include === "function" && include("../control/base
");

/**
 * 表示一个面板。
 * @class Panel
 */
Control.extend({

    role: 'panel',

    init: function () {
        var me = this;
        if (me.dom.is('.x-panel-collapsed, .x-panel-expanded')) {
            me.dom.on('click', '.x-panel-header', function () {
                me.toggleCollapse();
            });
        }
    },

    /**
     * 判断或设置当前面板是否是折叠状态。
     * @param {Boolean} [value] 如果指定为 @true，则强制折叠，如果指定为 @false，则强制展开。
     * @returns {mixed} 返回面板折叠状态或 @this。
     */
    collapsed: function (value) {
        if (value === undefined) {
            return this.dom.is('.x-panel-collapsed');
        }
        this.dom.toggleClass('x-panel-collapsed', value);
        return this;
    },

    /**
     * 切换当前面板的折叠状态。
     * @param {Boolean} [value] 如果指定为 @true，则强制折叠，如果指定为 @false，则强制展开。否则切换当前折叠状态。
     * @returns this
     */
    toggleCollapse: function (value) {

        var me = this;
        var isCollapsed = me.collapsed();

        // 如果折叠结果无变化则忽略。
        if (value === undefined) {
            value = !isCollapsed;
        } else if (value == isCollapsed) {
            return this;
        }

        // value 最终是 true: 表示即将折叠。
        // value 最终是 false: 表示即将展开。

        if (!me.dom.is('.x-panel-collapsing') && me.trigger('collapsing', value)) {

            var body = me.dom.find('.x-panel-body');

            if (value) {
                me.dom.addClass('x-panel-collapsing');
                body.hide('height', function () {
                    me.dom
                        .addClass('x-panel-collapsed')
                        .removeClass('x-panel-collapsing')
                        .removeClass('x-panel-expanded');
                });
            } else {
                me.dom
                    .addClass('x-panel-expanded')
                    .removeClass('x-panel-collapsed');
                body.show('height');
            }

            me.trigger('collapse', value);

        }
        return me;
    }

});


