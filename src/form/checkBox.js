
var CheckBox = Control.extend({

    role: 'checkbox',

    init: function (elem, options) {

        // 为单选复选框自动插入图标。
        var next = elem.next();
        if ((!next || !next.hasClass('x-icon') || !(next = next.next()) || !next.hasClass('x-icon'))) {
            elem.after(elem.type === 'radio' ? '<i class="x-icon">&#9675;</i><i class="x-icon">&#8857;</i>' : '<i class="x-icon">&#9746;</i><i class="x-icon">&#9745;</i>');
        }

    }

});
