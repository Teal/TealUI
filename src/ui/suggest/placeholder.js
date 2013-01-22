/** * @author xuld */var Placholder = Control.extend({
    maxLength: 300,    tpl: '<span class="x-placeholder"></span>',    update: function () {
        if (this.target.getText()) {
            this.hide();
        } else {
            this.show().setPosition(this.target.getPosition());
        }
    },    constructor: function (target, content, placeholder) {
        this.target = target = Dom.get(target);        placeholder = (placeholder ? Dom.get(placeholder) : target.next('.x-placeholder')) || target.after(this.tpl);        this.node = placeholder.node;        if (content) {
            this.setHtml(content);        }
        target.on('focus', this.hide, this).on('blur', this.update, this);

        this.on(navigator.isIE6 ? 'click' : 'mousedown', function (e) {
            try {
                this.focus();
            } catch (e) {

            }
            return false;
        }, target);

        placeholder.setStyle('fontSize', target.getStyle('fontSize'));
        placeholder.setStyle('lineHeight', target.getStyle(target.node.tagName === 'INPUT' ? 'height' : 'lineHeight'));
        placeholder.setStyle('paddingLeft', Dom.calc(target.node, 'pl+bl'));
        placeholder.setStyle('paddingTop', Dom.calc(target.node, 'pt+bt'));

        this.update();

    }
});