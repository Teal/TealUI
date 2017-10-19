/**
 * @author xuld
 */

typeof include === "function" && include("../form/button");
typeof include === "function" && include("../core/base");

Control.extend({

    role: 'fileupload',

    init: function () {
        var dom = this.dom;
        dom.find('[type=file]').on('change', function () {
            var textBox = dom.next('[type=text]');
            if (!textBox.length) {
                textBox = dom.prev('[type=text]');
            }
            textBox.text(this.value);
        });
    }

});
