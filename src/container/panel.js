/**
 * @author xuld
 */

//#require ../control/base.js

/**
 * 表示一个面板。
 */
var Panel = Control.extend({

    role: 'panel',

    init: function () {
        if (Dom.hasClass(this.elem, 'x-panel-collapsed') || Dom.hasClass(this.elem, 'x-panel-expanded')) {
            Dom.on(this.elem, 'click', '.x-panel-header', function () {
                this.toggleCollapse();
            }.bind(this));
        }
    },

    isCollapsed: function() {
        return Dom.hasClass(this.elem, 'x-panel-collapsed');
    },

    toggleCollapse: function (value) {

        var isCollapsed = this.isCollapsed();

        if (value == undefined) {
            value = !isCollapsed;
        } else if (value == isCollapsed) {
            return this;
        }

        // value 最终是 true: 表示即将折叠。
        // value 最终是 false: 表示即将展开。

        if (!Dom.hasClass(this.elem, 'x-panel-collapsing') && this.trigger('collapsing', value)) {

            var body = Dom.find('.x-panel-body', this.elem);

            if (value) {

                Dom.addClass(this.elem, 'x-panel-collapsing');

                Dom.slideUp(body, function () {
                    Dom.addClass(this.elem, 'x-panel-collapsed');
                    Dom.removeClass(this.elem, 'x-panel-collapsing');
                    Dom.removeClass(this.elem, 'x-panel-expanded');
                }.bind(this));

            } else {

                Dom.addClass(this.elem, 'x-panel-expanded');
                Dom.removeClass(this.elem, 'x-panel-collapsed');

                Dom.slideDown(body);

            }

            this.trigger('collapse', value);

        }
        return this;
    }

});




