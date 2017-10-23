/**
 * 执行一个补间动画。
 * @param callback 要执行的动画回调函数。函数接收以下参数：
 * - value：变化因子，大小在 0-1 之间。可以根据此变化因子设置实际的样式。
 * @param duration 动画执行的总毫秒数。
 * @param timingFunction 渐变曲线。通过渐变曲线更改变化因子的变化方式。
 * @return 返回新补间动画对象。
 */
export default function tween(callback: Tween["set"], duration?: Tween["duration"], timingFunction?: Tween["timingFunction"]) {
    const r = new Tween();
    r.set = callback;
    if (duration != undefined) r.duration = duration;
    if (timingFunction != undefined) r.timingFunction = timingFunction;
    r.start();
    return r;
}

/**
 * 表示一个补间动画。
 * @example
 * var tween = new Tween();
 * tween.set = x => { console.log(x); }
 * tween.start();
 */
export class Tween {

    /**
     * 动画执行的总毫秒数。
     */
    duration = 300;

    /**
     * 每秒显示的帧数。
     */
    fps = 50;

    /**
     * 渐变曲线。通过渐变曲线更改变化因子的变化方式。
     * @param value 变化因子，大小在 0-1 之间。
     * @return 返回转换后的变化因子，大小在 0-1 之间。
     */
    timingFunction(value: number) {
        return -(Math.cos(Math.PI * value) - 1) / 2;
    }

    /**
     * 当被子类重写时负责根据变化因子设置实际的值。
     * @param value 变化因子，大小在 0-1 之间。可以根据此变化因子设置实际的样式。
     */
    set(value: number) { }

    /**
     * 动画结束后执行的回调函数。
     */
    done?: () => void;

    /**
     * 开始执行动画。
     */
    start() {
        if (!this._timer) {
            this._time = Date.now() - this._time;
            this._timer = setInterval(() => {
                this.progress();
            }, Math.round(1000 / this.fps)) as any;
        }
    }

    /**
     * 停止执行动画。
     */
    stop() {
        if (this._timer) {
            this._time = Date.now() - this._time;
            clearInterval(this._timer);
            this._timer = 0;
        }
    }

    /**
     * 重置动画。
     */
    reset() {
        this._time = 0;
        this.set(0);
    }

    /**
     * 存储渐变的计时器。
     */
    private _timer: number;

    /**
     * 存储渐变的执行时间。
     */
    private _time = 0;

    /**
     * 显示下一帧。
     */
    protected progress() {
        const time = Date.now() - this._time;
        if (time < this.duration) {
            this.set(this.timingFunction(time / this.duration));
        } else {
            this.stop();
            this.set(1);
            this.done && this.done();
        }
    }

}
