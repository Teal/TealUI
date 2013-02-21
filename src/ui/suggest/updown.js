/**
 * @author xuld
 */


//#include ui/suggest/updown.css
//#include dom/keynav.js
//#include ui/suggest/picker.js


var UpDown = Picker.extend({

    /**
	 * ��ǰ�ؼ�������ť�� HTML ģ���ַ�����
	 * @getter {String} tpl
	 * @protected virtual
	 */
    menuButtonTpl: '<button type="button" class="ui-button ui-updown-button-up">\
                        <span class="ui-menubutton-arrow"></span>\
                    </button>\
                    <button type="button" class="ui-button ui-updown-button-down">\
                        <span class="ui-menubutton-arrow"></span>\
                    </button>',

    changeSpeed: 90,

    holdDuration: 600,

    _bindEvent: function (d, fn) {
        var me = this;
        d = this.find('.ui-updown-button-' + d).node;

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