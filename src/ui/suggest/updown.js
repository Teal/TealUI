/**
 * @author xuld
 */


imports("Controls.Suggest.UpDown");
using("System.Dom.KeyNav");
using("Controls.Suggest.Picker");


var UpDown = Picker.extend({

    /**
	 * 当前控件下拉按钮的 HTML 模板字符串。
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
        d = this.find('.x-updown-button-' + d).node;

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
        this.base('init', options);
        this._bindEvent('up', 'onUp');
        this._bindEvent('down', 'onDown');

        this.keyNav({
            up: this.onUp,
            down: this.onDown
        });
    },

    onUp: Function.empty,

    onDown: Function.empty

});