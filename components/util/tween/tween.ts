/**
 * 表示一个补间动画。
 * @example
 * var tween = new Tween();
 * tween.set = x => { console.log(x); }
 * tween.start();
 */
export default class Tween {

    /**
     * 渐变执行的总毫秒数。
     */
    duration = 300;

    /**
     * 每秒的显示帧数。
     */
    fps = 50;

    /**
     * 当被子类重写时负责重写渐变曲线。
     * @param x 转换前的数值，大小在 0-1 之间。
     * @return 返回根据渐变曲线变换后的值，大小在 0-1 之间。
     */
    transition(x: number) {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }

    /**
     * 当被子类重写时负责根据指定的变化量设置实际的效果值。
     * @param x 当前的变化因子，大小在 0-1 之间。
     */
    set(x: number) { }

    /**
     * 当效果结束后执行。
     */
    done: () => void;

    /**
     * 开始执行渐变。
     */
    start() {
        if (!this.timer) {
            this.time = Date.now() - this.time;
            this.timer = setInterval(() => {
                this.step();
            }, Math.round(1000 / this.fps)) as any;
        }
    }

    /**
     * 停止执行渐变。
     */
    stop() {
        if (this.timer) {
            this.time = Date.now() - this.time;
            clearInterval(this.timer);
            delete this.timer;
        }
    }

    /**
     * 重置执行渐变。
     */
    reset() {
        this.time = 0;
        this.set(0);
    }

    /**
     * 存储当前渐变的计时器。
     */
    private timer: number;

    /**
     * 存储当前渐变的执行时间。
     */
    private time = 0;

    /**
     * 进入变换的下步。
     */
    protected step() {
        const time = Date.now() - this.time;
        if (time < this.duration) {
            this.set(this.transition(time / this.duration));
        } else {
            this.stop();
            this.set(1);
            this.done && this.done();
        }
    }

}
