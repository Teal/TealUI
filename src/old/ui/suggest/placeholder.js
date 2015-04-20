/**
 * @author xuld
 */

// #include ui/suggest/placeholder.css
// #include fx/animate.js
// #include ui/core/base.js

var Placholder = Control.extend({

	maxLength: 300,

	cssClass: 'x-placeholder',

	tpl: '<span class="{cssClass}"></span>',

    update: function () {
    	if (Dom.getText(this.target)) {
            Dom.hide(this.elem);
    	} else {
    		Dom.show(this.elem);
    		Dom.setPosition(this.elem, Dom.getPosition(this.target));
        }
    },

    constructor: function (target, content, placeholder) {
        this.target = target = Dom.find(target);
        placeholder = (placeholder ? Dom.find(placeholder) : Dom.next(target, '.x-placeholder')) || Dom.after(target, this.create());
        this.elem = placeholder;

        if (content) {
            Dom.setHtml(this.elem, content);
        }

        Dom.on(target, 'focus', function () {
        	Dom.hide(this.elem);
        }, this);
        Dom.on(target, 'blur', this.update, this);

        Dom.on(this.elem, navigator.isIE6 ? 'click' : 'mousedown', function (e) {
            try {
                this.focus();
            } catch (e) {

            }
            return false;
        }, target);

        Dom.setStyle(placeholder, 'fontSize', Dom.getStyle(target, 'fontSize'));
        Dom.setStyle(placeholder, 'lineHeight', Dom.getStyle(target, target.tagName === 'INPUT' ? 'height' : 'lineHeight'));
        Dom.setStyle(placeholder, 'paddingLeft', Dom.calc(target, 'paddingLeft+borderLeftWidth'));
        Dom.setStyle(placeholder, 'paddingTop', Dom.calc(target, 'paddingTop+borderTopWidth'));

        this.update();

    }

});