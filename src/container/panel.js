
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

    toggleCollapse: function (value) {

        value = value === undefined ? Dom.hasClass(this.elem, 'x-panel-collapsed') : !value;
        var body = Dom.find('.x-panel-body', this.elem);

        if (value) {

            // 切换折叠效果。
            Dom.addClass(this.elem, 'x-panel-expanded');
            Dom.removeClass(this.elem, 'x-panel-collapsed');

            Dom.slideDown(body);

        } else if (!Dom.hasClass(this.elem, 'x-panel-collapsing')) {

            Dom.addClass(this.elem, 'x-panel-collapsing');
            
            Dom.slideUp(body, null, null, function() {
                Dom.addClass(this.elem, 'x-panel-collapsed');
                Dom.removeClass(this.elem, 'x-panel-collapsing');
                Dom.removeClass(this.elem, 'x-panel-expanded');
            }.bind(this));

        }

        return this;
    }

});




