/**
 * @author xuld
 */

typeof include === "function" && include("../control/base");

/**
 * 表示一个选项卡。
 * @class
 */
Control.extend({

    role: 'tab',

    init: function () {
        var me = this;

        // 绑定 TAB 切换事件。
        me.dom.on('click', '.x-tab > li', function (e) {
            me.selectTab(this, e);
        });

        // 设置初始选项卡。
        var body = me.body().css('position', 'relative');
        Dom(body.children().hide()[me.selectedIndex()]).show();
    },

    /**
     * 当被子类重写时，负责获取选项卡的主体。
     * @protected
     */
    body: function () {
        return this.dom.next('.x-tab-body').valueOf() || this.dom.prev('.x-tab-body');
    },

    /**
     * 当新标签被选中时触发。
     * @param {Dom} tab 要选择的标签页。
     * @event select
     */

    /**
     * 当选中的标签改变时触发。
     * @event change
     */

    /**
     * 模拟用户选择指定的标签页。
     * @param {Dom} tab 要选择的标签页。
     * @param {Event} [e] 引发选择操作的原始 DOM 事件。
     * @returns this
     * @example $("#elem1").role("tab").selectTab($("elem1_tab_1"))
     */
    selectTab: function (tab, e) {
        var me = this;
        tab = Dom(tab);
        return me.trigger('select', tab) ?  me.selectedIndex(tab.index()) : me;
    },

    /**
     * 获取或设置当前选项卡的选中标签索引。
     * @param {Number} [index] 要设置的索引。
     * @returns {mixed}
     * @example $("#elem1").role("tab").selectedIndex(1)
     */
    selectedIndex: function (value) {

        var me = this;

        var oldIndex = me.dom.find('.x-tab-actived').index() || 0;

        // 只获取索引。
        if (value === undefined) {
            return oldIndex;
        }

        // 设置索引。
        if (oldIndex !== value) {

            var children = me.dom.children();

            // 切换高亮标签。
            Dom(children[oldIndex]).removeClass('x-tab-actived');
            Dom(children[value]).addClass('x-tab-actived');

            // 切换主体。
            var body = me.body();
            if (body.length) {
                children = body.children();

                body = Dom(children[oldIndex]).css('position', 'absolute');
                if (body.length) {
                    var rect = body.offset();
                    body
                        .css('left', rect.left)
                        .css('top', rect.top)
                        .hide('opacity', null, me.duration);
                }
                
                Dom(children[value])
                    .css('position', null)
                    .css('left', null)
                    .css('top', null)
                    .show('opacity', null, me.duration);
                
            }

            me.trigger('change');
        }

        return me;
    }

});
