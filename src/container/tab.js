/**
 * @author xuld
 */

//#require ../control/base.js

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

        // Dom.getChildren(this.elem)

        //if (Dom.hasClass(this.elem, 'x-panel-collapsed') || Dom.hasClass(this.elem, 'x-panel-expanded')) {
        //    Dom.on(this.elem, 'click', '.x-panel-header', function () {
        //        this.toggleCollapse();
        //    }.bind(this));
        //}
    },

    setActivedIndex: function (index) {

        if (this.trigger('changing', index)) {

            // 撤销高亮原标签。
            var actived = Dom.find('.x-tab-actived', this.elem);
            actived && Dom.removeClass(actived, 'x-tab-actived');

            // 高亮新标签。
            Dom.addClass(Dom.getChildren(this.elem)[index], 'x-tab-actived');

            // 滑入新内容。
            var body = Dom.getNext(this.elem);
            if (!Dom.hasClass(body, '.x-tab-body')) {
                body = Dom.getPrev(this.elem);
            }

            if (Dom.hasClass(body, '.x-tab-body')) {

            }

        }

        return this;
    }

});




