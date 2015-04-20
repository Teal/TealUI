
$.fn.panelToggleCollapse = function (value) {
    value = value === undefined ? this.hasClass('x-panel-collapsed') : !value;
    if (value) {
        this.addClass('x-panel-expanded').removeClass('x-panel-collapsed');
        this.find('.x-panel-body').slideDown();
    } else {
        var me = this.addClass('x-panel-collapsing');
        this.find('.x-panel-body').slideUp(function () {
            me.addClass('x-panel-collapsed').removeClass('x-panel-expanded x-panel-collapsing');
        });
    }
};

$(document).on('click', '.x-panel-collapsed .x-panel-header, .x-panel-expanded .x-panel-header', function () {
    $(this).parent().panelToggleCollapse();
});
