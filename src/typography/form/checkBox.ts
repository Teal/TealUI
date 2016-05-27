
Control.extend({
    role: 'checkBox',
    init: function () {
        this.dom.addClass('x-checkbox-proxy').after(this.dom[0].type === 'radio' ? '<span><span class="x-icon">&#9675;</span><span class="x-icon">&#8857;</span></span>' : '<span><span class="x-icon">&#9746;</span><span class="x-icon">&#9745;</span></span>');
    }
});
