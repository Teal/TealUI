/**
 * @fileOverview 一个实现用于实现特效渐变的基类。
 * @author xuld
 */

typeof include === "function" && include("asyncQueue");

// 补齐 Date.now() 
if (!Date.now) {
    Date.now = function () { return +new Date; };
}

/**
 * 表示一个特效驱动。
 * @param {Object} options 特效的配置。具体见 `Fx.run`。
 * @class
 * @inner
 */
function Fx(options) {
    // 拷贝用户配置。
    for (var key in options) {
        this[key] = options[key];
    }
}

/**
 * 用于管理多个特效的队列。
 * @inner
 */
Fx.asyncQueue = new AsyncQueue;

Fx.prototype = {

    /**
     * 特效执行的总毫秒数。
     * @type {Number}
     */
    duration: 300,

    /**
     * 每秒的运行帧次。
     * @type {Number}
     */
    fps: 50,

    /**
     * 特效执行的渐变曲线。
     * * @param {Number} p 转换前的数值，大小在 0-1 之间。
     * * @returns {Number} 返回根据渐变曲线变换后的值，大小在 0-1 之间。
     * @type Function
     * @field
     */
    transition: function (p) {
        return -(Math.cos(Math.PI * p) - 1) / 2;
    },

    /**
     * 多个特效的串联方式。
     * @type {String}
     * @remark 取值的意义
     * 
     * 值        | 意义
     * ---------|-----------------
     * wait(默认)| 等待之前的所有特效都完成后再执行当前任务。
     * abort     | 立即终止正在执行的特效并撤销等待的剩余任务，然后立即执行当前任务。
     * replace   | 立即终止正在执行的特效并立即执行当前任务，然后继续执行其它正在等待的特效。
     * insert    | 等待正在执行的特效完成后执行当前任务，然后继续执行其它正在等待的特效。
     * cancel    | 取消当前任务。
     * 
     */
    link: "wait",

    /**
     * 开始运行当前设定的特效。
     * @returns this
     */
    run: function () {
        var me = this;
        Fx.asyncQueue.then(function () {
            if (!me.start || me.start() !== false) {
                Fx.asyncQueue.suspend(me);
                me.time = 0;
                me.set(0, 0);
                me.resume();
            }
        }, me, me.link);
        return me;
    },

    /**
     * 恢复执行当前特效。
     */
    resume: function () {
        var me = this, fps, intervals, cache;
        if (!me.timer) {

            // 计算当前剩余的时间。
            me.time = Date.now() - me.time;

            // 开始实时执行。
            cache = Fx._intervals || (Fx._intervals = {});
            intervals = cache[fps = me.fps];

            // 启用计时器。
            if (!intervals) {
                cache[fps] = intervals = [];
                intervals.timer = setInterval(function () {
                    var i = intervals.length;
                    while (--i >= 0)
                        intervals[i].step();
                }, Math.round(1000 / fps));
            }

            intervals.push(me);
            me.timer = intervals.timer;
        }
    },

    /**
     * 暂停执行当前特效。
     */
    pause: function () {
        var me = this, fps, intervals;
        if (me.timer) {

            // 计算当前剩余的时间。
            me.time = Date.now() - me.time;

            // 删除计时器。
            intervals = Fx._intervals[fps = me.fps];
            intervals.splice(intervals.indexOf(me), 1);

            if (!intervals.length) {
                clearInterval(intervals.timer);
                delete Fx._intervals[fps];
            }

            me.timer = 0;
        }
    },

    /**
     * 根据指定的变化量设置实际的效果值。
     * @param {Number} delta 当前的变化因子，大小在 0-1 之间。
     */
    set: function () { },

    /**
     * 进入变换的下步。
     * @protected
     */
    step: function () {
        var me = this,
            time = Date.now() - me.time;
        if (time < me.duration) {
            time /= me.duration;
            me.set(me.transition(time), time);
        } else {
            me.pause();
            me.set(1, 1);

            // 调用回调函数。
            me.complete && me.complete(isAbort);

            // 驱动下一个任务。
            Fx.asyncQueue.resume();
        }
    },

    /**
     * 强制终止执行当前效果。
     * @returns this
     */
    abort: function () {
        var me = this;
        me.pause();
        Fx.asyncQueue.resume();
        return me;
    }

};

/**
 * 立即执行一个特效。
 * @param {Object} options 特效的配置。支持的值有：
 * 
 * * @param {Function} [complete] 特效执行完成的回调。回调参数为一个布尔值，表示是否是强制终止执行。
 * * @param {Number} [duration=300] 特效执行的总毫秒数。
 * * @param {Number } [fps=50] 每秒的运行帧次。
 * * @param {Function} [transition] 特效执行的渐变曲线。默认为 sin 曲线变化。
 * * @param {String} [link] 多个特效的串联方式。可取值：
 * 值        | 意义
 * ---------|-----------------
 * wait(默认)| 等待之前的所有特效都完成后再执行当前任务。
 * abort     | 立即终止正在执行的特效并撤销等待的剩余任务，然后立即执行当前任务。
 * replace   | 立即终止正在执行的特效并立即执行当前任务，然后继续执行其它正在等待的特效。
 * insert    | 等待正在执行的特效完成后执行当前任务，然后继续执行其它正在等待的特效。
 * cancel    | 取消当前任务。
 * 
 * * @param {Function} [set] 根据指定的变化量设置实际的效果值。
 * * @param {Function} [start] 特效开始执行的回调。
 * @example 
 * Fx.run({
 *     set: function (value) {
 *         console.log(value);
 *     }
 * });
 */
Fx.run = function (options) {
    typeof console === "object" && console.assert(!options || !options.start || options.start instanceof Function, "Fx.run(options: start 必须是函数)");
    typeof console === "object" && console.assert(!options || !options.complete || options.complete instanceof Function, "Fx.run(options: complete 必须是函数)");
    typeof console === "object" && console.assert(!options || !options.set || options.set instanceof Function, "Fx.run(options: set 必须是函数)");
    return new Fx(options).run();
};
