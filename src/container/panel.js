
var Panel = Control.extend({

    type: 'panel',

    init: function (options) {
        this.dom.on('click', '.x-panel-header', function() {
            this.toggleCollapse();
        }.bind(this));
    },

    toggleCollapse: function (value) {
        value = value === undefined ? this.dom.hasClass('x-panel-collapsed') : !value;
        if (value) {
            this.dom.addClass('x-panel-expanded').removeClass('x-panel-collapsed');
            this.dom.find('.x-panel-body').show('top');
        } else {
            this.dom.addClass('x-panel-collapsing');
            this.dom.find('.x-panel-body').hide('top', function () {
                this.dom.removeClass('x-panel-collapsing').addClass('x-panel-collapsed').removeClass('x-panel-expanded');
            }.bind(this));
        }
    }

});
