// #todo

/**
 * @author xuld@vip.qq.com
 */

/**
 * 用于串联执行多个异步任务。
 * @class
 * @example 
 * var deferred = new AsyncQueue();
 * // 添加一个异步任务。
 * deferred.then(function () {
 * 
 *     // 挂起等待。
 *     deferred.suspend();
 * 
 *     // 使用 setTimeout 模拟异步执行的操作。
 *     setTimeout(function () {
 * 
 *         // 恢复执行、
 *         deferred.resume(1);
 *     }, 2000);
 * });
 * // 添加一个同步任务。
 * deferred.then(function (data) {
 *     alert('所有异步操作完成。返回的数据：' + data);
 * });
 */
function AsyncQueue() {
    this._queue = [];
}

AsyncQueue.prototype = {
    constructor: AsyncQueue,

    /**
	 * 通知当前异步任务已经完成，并继续执行下一个任务。
	 * @param {Object} ... 传递给下个异步任务的数据。
	 * @returns this
	 * @example new AsyncQueue().resume()
	 */
    resume: function () {

        var me = this;

        // 更新当前的回调数据。
        me.data = arguments;

        // 当前任务已执行完成，从队列移除。
        me._queue.shift();

        // 继续执行下一个任务。
        me._queue.length && me._progress();
    },

    /**
     * 挂起异步等待操作。
     * @param {Object} current 引发挂起的对象。将调用其 `abort` 方法恢复挂起。
	 * @example new AsyncQueue().suspend()
     */
    suspend: function (current) {
        this._waiting = current || true;
    },

    /**
     * 添加一个同步或异步任务。
     * @param {Function} fn 要添加的任务函数。函数的参数为上个异步调用传递的数据。
     * 如果是异步函数，则函数内部必须调用 @suspend 挂起队列，并在异步完成后调用 @resume 恢复队列。
     * 函数应该返回一个包含 `abort` 方法的对象，以便于终止此异步操作。
     * 
     * @param {String} [link="wait"] 定义正在执行其它异步任务时，@fn 的操作。
     * 
     * 值        | 意义
     * ----------|--------------------------------------------
     * wait(默认)| 等待之前的所有异步任务都完成后再执行当前任务。
     * abort     | 立即终止正在执行的异步任务并撤销等待的剩余任务，然后立即执行当前任务。
     * replace   | 立即终止正在执行的异步任务并立即执行当前任务，然后继续执行其它正在等待的异步任务。
     * insert    | 等待正在执行的异步任务完成后执行当前任务，然后继续执行其它正在等待的异步任务。
     * cancel    | 取消当前任务。
     * 
     * @returns this
	 * @example new AsyncQueue().then(function(){ });
     */
    then: function (fn, link) {
        typeof console === "object" && console.assert(typeof fn === "function", "taskQueue.then(fn: 必须是函数, [scope], link)");

        var me = this;
        if (me._queue.length) {
            switch (link) {

                case "abort":
                    // 清空队列，终止操作，然后立即执行。
                    me._queue.length = 1;
                    me._queue.push(fn);
                    me.skip();
                    break;

                case "insert":
                    // 插入队伍前面，等待当前任务完成后执行。
                    me._queue.splice(1, 0, fn);
                    break;

                case "replace":
                    // 替换队首，终止操作，然后恢复执行。
                    me._queue.splice(1, 0, fn);
                    me.skip();
                    // 继续向下执行。

                case "cancel":
                    // 忽略当前调用。
                    break;

                default:
                    // 插入队伍后面，等待当前任务完成后执行。
                    me._queue.push(fn);

            }
        } else {
            me._queue.push(fn);
            me._progress();
        }
        return me;
    },

    /**
     * 终止当前正在执行的异步任务并执行后续任务。
     * @returns this
	 * @example new AsyncQueue().abort();
     */
    skip: function () {
        var me = this;
        me._waiting && me._waiting.abort ? me._waiting.abort() : me.resume();
        return me;
    },

    /**
     * 执行当前队列的第一个异步任务。
     * @inner
     */
    _progress: function () {

        var me = this;
        me._waiting = null;

        // 执行指定的任务函数。
        me._queue[0].apply(me, me.data || []);

        // 如果当前对象未被挂起，继续执行下一个任务。
        if (!me._waiting) me.resume();
    }

};
