
Control.CheckBox = Control.extend({
    init: function () {
        this.elem.classList.add('x-checkbox-proxy');
        this.elem.after(this.elem.type === 'radio' ? '<span><span class="x-icon">&#9675;</span><span class="x-icon">&#8857;</span></span>' : '<span><span class="x-icon">&#9746;</span><span class="x-icon">&#9745;</span></span>');
    }
});
