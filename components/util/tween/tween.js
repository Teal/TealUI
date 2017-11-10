define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 执行一个补间动画。
     * @param callback 要执行的动画回调函数。函数接收以下参数：
     * - value：变化因子，大小在 0-1 之间。可以根据此变化因子设置实际的样式。
     * @param duration 动画执行的总毫秒数。
     * @param timingFunction 渐变曲线。通过渐变曲线更改变化因子的变化方式。
     * @return 返回新补间动画对象。
     */
    function tween(callback, duration, timingFunction) {
        var r = new Tween();
        r.set = callback;
        if (duration != undefined)
            r.duration = duration;
        if (timingFunction != undefined)
            r.timingFunction = timingFunction;
        r.start();
        return r;
    }
    exports.default = tween;
    /**
     * 表示一个补间动画。
     * @example
     * var tween = new Tween();
     * tween.set = x => { console.log(x); }
     * tween.start();
     */
    var Tween = /** @class */ (function () {
        function Tween() {
            /**
             * 动画执行的总毫秒数。
             */
            this.duration = 300;
            /**
             * 每秒显示的帧数。
             */
            this.fps = 50;
            /**
             * 存储渐变的执行时间。
             */
            this._time = 0;
        }
        /**
         * 渐变曲线。通过渐变曲线更改变化因子的变化方式。
         * @param value 变化因子，大小在 0-1 之间。
         * @return 返回转换后的变化因子，大小在 0-1 之间。
         */
        Tween.prototype.timingFunction = function (value) {
            return -(Math.cos(Math.PI * value) - 1) / 2;
        };
        /**
         * 当被子类重写时负责根据变化因子设置实际的值。
         * @param value 变化因子，大小在 0-1 之间。可以根据此变化因子设置实际的样式。
         */
        Tween.prototype.set = function (value) { };
        /**
         * 开始执行动画。
         */
        Tween.prototype.start = function () {
            var _this = this;
            if (!this._timer) {
                this._time = Date.now() - this._time;
                this._timer = setInterval(function () {
                    _this.progress();
                }, Math.round(1000 / this.fps));
            }
        };
        /**
         * 停止执行动画。
         */
        Tween.prototype.stop = function () {
            if (this._timer) {
                this._time = Date.now() - this._time;
                clearInterval(this._timer);
                this._timer = 0;
            }
        };
        /**
         * 重置动画。
         */
        Tween.prototype.reset = function () {
            this._time = 0;
            this.set(0);
        };
        /**
         * 显示下一帧。
         */
        Tween.prototype.progress = function () {
            var time = Date.now() - this._time;
            if (time < this.duration) {
                this.set(this.timingFunction(time / this.duration));
            }
            else {
                this.stop();
                this.set(1);
                this.done && this.done();
            }
        };
        return Tween;
    }());
    exports.Tween = Tween;
});
//# sourceMappingURL=tween.js.map