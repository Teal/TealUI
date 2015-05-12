
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
            Dom.removeClass(this.elem, 'x-panel-collapsed');
            Dom.addClass(this.elem, 'x-panel-expanded');

            Dom.animate(body, {
                height: 0,
                paddingTop: 0,
                paddingBottom: 0
            }, {
                height: 'auto',
                paddingTop: 'auto',
                paddingBottom: 'auto'
            }, 4000);

        } else {
            Dom.addClass(this.elem, 'x-panel-collapsed');
            Dom.removeClass(this.elem, 'x-panel-expanded');

            //Dom.hide(Dom.find('.x-panel-body', this.elem));

            //this.dom.addClass('x-panel-collapsing');
            //this.dom.find('.x-panel-body').hide('top', function () {
            //    this.dom.removeClass('x-panel-collapsing').addClass('x-panel-collapsed').removeClass('x-panel-expanded');
            //}.bind(this));
        }
    }

});




