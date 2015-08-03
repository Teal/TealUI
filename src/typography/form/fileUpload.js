/**
 * @author xuld
 */

// #require ../form/button
// #require ../core/base

Control.extend({

    role: 'fileUpload',

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
