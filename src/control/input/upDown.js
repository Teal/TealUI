/**
 * @author xuld
 */

typeof include === "function" && include("../dom/keyNav");
typeof include === "function" && include("../control/base");

var UpDown = Control.extend({

    changeSpeed: 90,

    holdDuration: 600,

    init: function (options) {
        var me = this;
        bindEvent('up', -1);
        bindEvent('down', 1);

        this.elem.keyNav({
            up: function() {
                me.onUpDown(-1);
            },
            down: function () {
                me.onUpDown(1);
            }
        });

        function bindEvent(d, delta) {
            d = me.elem.querySelector('.x-updown-' + d);

            d.onmousedown = function () {
                me.onUpDown(delta);
                if (me.timer)
                    clearInterval(me.timer);
                me.timer = setTimeout(function () {
                    me.timer = setInterval(function () { me.onUpDown(delta); }, me.changeSpeed);
                }, me.holdDuration);
            };

            d.onmouseout = d.onmouseup = function () {
                clearTimeout(me.timer);
                clearInterval(me.timer);
                me.timer = 0;
            };
        }
    },

    onUpDown: function (delta) {}

});
