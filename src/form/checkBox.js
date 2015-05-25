
var CheckBox = Control.extend({

    init: function (options) {
        // 为单选复选框自动插入图标。
        var next = this.elem.nextElementSibling;
        if ((!next || !next.classList.contains('x-icon') || !(next = next.nextElementSibling) || !next.classList.contains('x-icon'))) {
            Dom.after(this.elem, this.elem.type === 'radio' ? '<i class="x-icon">&#9675;</i><i class="x-icon">&#8857;</i>' : '<i class="x-icon">&#9746;</i><i class="x-icon">&#9745;</i>');
        }
    }

});
