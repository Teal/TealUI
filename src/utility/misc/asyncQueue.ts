/**
 * 异步队列
 * @author xuld@vip.qq.com
 */

type Abortable = { abort?: () => void };

/**
 * 表示一个异步执行的任务队列。
 * @example
 * var deferred = new AsyncQueue();
 *
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
 *
 * // 添加一个同步任务。
 * deferred.then(function (data) {
 *     alert('所有异步操作完成。返回的数据：' + data);
 * });
 */
export class AsyncQueue {

    /**
     * 存储所有异步任务队列。
     */
    private _queue: Function[] = [];

    /**
     * 存储当前队列正在等待的异步任务。
     */
    private _waiting: Abortable;

    /**
     * 判断当前队列是否已被阻止。
     */
    get suspended() { return !!this._waiting };

    /**
     * 存储传递给下一个异步任务的参数列表。
     */
    private _datas: IArguments;

    /**
     * 执行当前队列的第一个异步任务。
     */
    private _progress() {

        // 不再等待任务对象。
        this._waiting = null;

        // 执行第一个回调函数。
        let fn = this._queue.shift();
        if (fn) fn.apply(this, this._datas || []);

        // 如果当前对象未被挂起，继续执行下一个任务。
        if (!this._waiting) this._progress();
    }

    /**
     * 挂起异步等待操作。
     * @param abortable 引发挂起的对象。将调用其 `abort()` 方法恢复挂起。
	 * @example new AsyncQueue().suspend()
     */
    suspend(abortable: Abortable) {
        this._waiting = abortable || true;
    }

    /**
	 * 通知当前异步任务已经完成，并继续执行下一个任务。
	 * @param datas 传递给下个异步任务的数据。
	 * @example new AsyncQueue().resume()
	 */
    resume(...datas: any[]) {

        // 更新当前的回调数据。
        this._datas = arguments;

        // 继续执行下一个任务。
        this._progress();
    }

    /**
     * 添加一个同步或异步任务。
     * @param callback 要添加的任务函数。函数的参数为上个异步调用传递的数据。
     * 如果是异步函数，则函数内部必须调用 @suspend 挂起队列，并在异步完成后调用 @resume 恢复队列。
     * 函数应该返回一个包含 `abort` 方法的对象，以便于终止此异步操作。
     * 
     * @param link = "wait" 定义正在执行其它异步任务时，@fn 的操作。
     * 
     * 值        | 意义
     * ----------|--------------------------------------------
     * wait(默认)| 等待之前的所有异步任务都完成后再执行当前任务。
     * abort     | 立即终止正在执行的异步任务并撤销等待的剩余任务，然后立即执行当前任务。
     * replace   | 立即终止正在执行的异步任务并立即执行当前任务，然后继续执行其它正在等待的异步任务。
     * insert    | 等待正在执行的异步任务完成后执行当前任务，然后继续执行其它正在等待的异步任务。
     * cancel    | 取消当前任务。
     * 
	 * @example new AsyncQueue().then(function(){ });
     */
    then(callback: Function, link?: "wait" | "abort" | "insert" | "replace" | "cancel") {
        if (this._queue.length) {
            switch (link) {

                // 终止之前的所有任务，重新开始队列。
                case "abort":
                    this._queue.length = 1;
                    this._queue[0] = callback;
                    this.skip();
                    break;

                // 插入队伍前面，等待当前任务完成后执行。
                case "insert":
                    this._queue.splice(1, 0, callback);
                    break;

                // 立即终止正在执行的任务，并替换为任务。
                case "replace":
                    this._queue.splice(1, 0, callback);
                    this.skip();
                // 继续向下执行。

                // 忽略当前调用。
                case "cancel":
                    break;

                // 插入队伍后面，等待当前任务完成后执行。
                default:
                    this._queue.push(callback);

            }
        } else {
            this._queue.push(callback);
            this._progress();
        }
        return this;
    }

    /**
     * 终止当前正在执行的异步任务并执行后续任务。
	 * @example new AsyncQueue().abort();
     */
    skip() {
        this._waiting && this._waiting.abort ? this._waiting.abort() : this._progress();
        return this;
    }

}
