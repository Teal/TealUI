/**
 * 表示一个异步任务队列。
 */
export default class AsyncQueue extends Array<Function> {

    /**
     * 添加一个任务函数。
     * @param callback 要添加的任务函数。
     * @param link 如果当前队列正在等待其它异步任务函数，使用的处理方式，可以是以下值之一：
     * - wait：等待之前所有异步任务都完成后再执行当前任务。
     * - abort：终止正在执行和其它正在等待的任务并立即执行当前任务。
     * - replace：终止正在执行的异步任务并立即执行当前任务，然后继续执行其它正在等待的异步任务。
     * - insert：等待正在执行的异步任务完成后执行当前任务，然后继续执行其它正在等待的异步任务。
     * - cancel：取消当前任务。
     */
    then(callback: (data: any) => void, link: "wait" | "abort" | "insert" | "replace" | "cancel" = "wait") {
        if (this._suspendCount && link !== "wait") {
            switch (link) {
                case "abort":
                    this[0] = callback;
                    this.length = 1;
                    this.skip();
                    break;
                case "insert":
                    this.splice(1, 0, callback);
                    break;
                case "replace":
                    this.splice(1, 0, callback);
                    this.skip();
                    break;
            }
        } else {
            this.push(callback);
            this._progress();
        }
    }

    /**
     * 终止当前正在执行的异步任务并执行其它正在等待的任务。
     */
    skip() {
        if (this._abortable) {
            this._abortable.abort();
        } else {
            this.resume();
        }
    }

    /**
     * 挂起当前队列。所有后续任务都将开始等待。
     * @param abortable 引发挂起的对象。其提供一个 `abort()` 函数可立即终止执行。
     */
    suspend(abortable?: Abortable) {
        this._suspendCount++;
        if (abortable) {
            this._abortable = abortable;
        }
    }

    /**
     * 通知当前异步任务已经完成，并继续执行下一个任务。
     * @param data 传递给下个异步任务的数据。
     */
    resume(data?: any) {
        this._suspendCount--;
        if (data !== undefined) {
            this._data = data;
        }
        this._progress();
    }

    /**
     * 判断当前队列是否已被阻止。
     */
    get suspended() { return !!this._suspendCount; }

    /**
     * 被挂起的次数。
     */
    private _suspendCount = 0;

    /**
     * 存储终止当前任务的关联对象。
     */
    private _abortable?: Abortable;

    /**
     * 存储传递给下一个异步任务的参数列表。
     */
    private _data: any;

    /**
     * 执行队首的异步任务。
     */
    private _progress() {
        while (this.length && !this._suspendCount) {
            this._abortable = undefined;
            this.shift()!(this._data);
        }
    }

}

/**
 * 表示一个可终止的异步操作。
 */
export interface Abortable {

    /**
     * 终止当前异步操作。
     */
    abort(): void;

}
