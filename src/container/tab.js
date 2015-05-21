/**
 * @author xuld
 */

// #require ../control/base.js

/**
 * 表示一个选项卡。
 */
var Tab = Control.extend({

    role: 'tab',

    init: function () {
        var me = this;
        Dom.on(this.elem, 'click', '.x-tab > li', function(e) {
            if (Dom.hasClass(this, 'x-tab-actived')) {
                return;
            }
            me.setActivedIndex(Dom.getIndex(this));
        });

        // 设置初始值。
        var body = this.getBody();
        if (body) {
            Dom.each(Dom.getProp(body, 'children'), Dom.hide);
            var content = Dom.getProp(body, 'children')[this.getActivedIndex()];
            content && Dom.show(content);
        }
    },

    /**
     * 当被子类重写时，负责获取选项卡的主体。
     */
    getBody: function() {
        var body = Dom.getProp(this.elem, 'nextElementSibling');
        if (!Dom.hasClass(body, 'x-tab-body')) {
            body = Dom.getProp(this.elem, 'previousElementSibling');
            if (!Dom.hasClass(body, 'x-tab-body')) {
                body = null;
            }
        }
        return body;
    },

    getActivedIndex: function () {
        var actived = Dom.find('.x-tab-actived', this.elem);
        return actived ? Dom.getIndex(actived) : 0;
    },

    setActivedIndex: function (index) {

        if (this.trigger('changing', index)) {

            // 撤销高亮原标签。
            var actived = Dom.find('.x-tab-actived', this.elem);
            actived && Dom.removeClass(actived, 'x-tab-actived');

            // 高亮新标签。
            Dom.addClass(Dom.getProp(this.elem, 'children')[index], 'x-tab-actived');

            // 滑入新内容。
            var body = this.getBody();
            if (body) {
                Dom.each(Dom.getProp(body, 'children'), Dom.hide);
                var content = Dom.getProp(body, 'children')[this.getActivedIndex()];
                content && Dom.show(content);
            }

        }

        return this;
    }

});




