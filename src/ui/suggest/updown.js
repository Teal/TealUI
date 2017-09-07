/**
 * @author xuld
 */

//#include ui/suggest/updown.css
//#include dom/keynav.js
//#include ui/suggest/picker.js

var UpDown = Picker.extend({

    /**
	 * @getter {String} tpl
	 * @protected virtual
	 */
    menuButtonTpl: '<button type="button" class="x-button x-updown-button-up">\
                        <span class="x-menubutton-arrow"></span>\
                    </button>\
                    <button type="button" class="x-button x-updown-button-down">\
                        <span class="x-menubutton-arrow"></span>\
                    </button>',

    changeSpeed: 90,

    holdDuration: 600,

    _bindEvent: function (d, fn) {
        var me = this;
        d = Dom.find('.x-updown-button-' + d, me.elem);

        d.onmousedown = function () {
            me[fn]();
            if (me.timer)
                clearInterval(me.timer);
            me.timer = setTimeout(function () {
                me.timer = setInterval(function () { me[fn](); }, me.changeSpeed);
            }, me.holdDuration);
        };

        d.onmouseout = d.onmouseup = function () {
            clearTimeout(me.timer);
            clearInterval(me.timer);
            me.timer = 0;
        };
    },

    init: function (options) {
    	Picker.prototype.init.call(this, options);
        this._bindEvent('up', 'onUp');
        this._bindEvent('down', 'onDown');

        Dom.keyNav(this.elem, {
            up: this.onUp,
            down: this.onDown
        }, this);
    },

    onUp: Function.empty,

    onDown: Function.empty

});