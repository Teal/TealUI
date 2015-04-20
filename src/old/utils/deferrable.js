/**
 * @author xuld
 */

//#include core/class.js

/**
 * 用于异步执行任务时保证任务是串行的。
 * @class Deferrable
 */
var Deferrable = Base.extend({

	/**
	 * 让 *deferrable* 等待当前任务完成后继续执行。
	 * @param {Deferrable} deferrable 需要等待的 Deferrable 对象。
	 * @param {Object} args 执行 *deferrable* 时使用的参数。
	 */
	chain: function (deferrable, args) {
		var lastTask = [deferrable, args];

		if (this._firstTask) {
			this._lastTask[2] = lastTask;
		} else {
			this._firstTask = lastTask;
		}
		this._lastTask = lastTask;
	},

	/**
	 * 通知当前对象任务已经完成，并继续执行下一个任务。
	 * @protected
	 * @return this
	 */
	progress: function () {

		var firstTask = this._firstTask;
		this.isRunning = false;

		if (firstTask) {
			this._firstTask = firstTask[2];

			firstTask[0].run(firstTask[1]);
		}

		return this;

	},

	/**
	 * 检查当前的任务执行状态，防止任务同时执行。
	 * @param {Object} args 即将需要执行时使用的参数。
	 * @param {String} link="wait" 如果当前任务正在执行后的操作。
	 * 
	 * - wait: 等待上个任务完成。
	 * - ignore: 忽略新的任务。
	 * - stop: 正常中断上个任务，上个操作的回调被立即执行，然后执行当前任务。
	 * - abort: 强制停止上个任务，上个操作的回调被忽略，然后执行当前任务。
	 * - replace: 替换上个任务为新的任务，上个任务的回调将被复制。
	 * @return {Boolean} 返回一个值，指示是否可以执行新的操作。
	 * @protected
	 */
	defer: function (args, link) {

		var isRunning = this.isRunning;
		this.isRunning = true;

		if (!isRunning)
			return false;

		switch (link) {
			case undefined:
				break;
			case "abort":
			case "stop":
			case "skip":
				this[link]();
				this.isRunning = true;
				return false;
			case "replace":
				this.init(this.options = Object.extend(this.options, args));

				// fall through
			case "ignore":
				return true;
			default:
				////assert(link === "wait", "Deferred#defer(args, link): 成员 {link} 必须是 wait、abort、stop、ignore、replace 之一。", link);
		}

		this.chain(this, args);
		return true;
	},

	/**
	 * 让当前任务等待指定的 *deferred* 全部执行完毕后执行。
	 * @param {Deferrable} deferrable 需要预先执行的 Deferrable 对象。
	 * @return this
	 */
	wait: function (deferred) {
		if (this.isRunning) {
			this.stop();
		}

		this.defer = deferred.defer.bind(deferred);
		this.progress = deferred.progress.bind(deferred);
		return this;
	},

	/**
	 * 定义当前任务执行完成后的回调函数。
	 * @param {Deferrable} callback 需要等待执行的回调函数。
	 * @param {Object} args 执行 *callback* 时使用的参数。
	 */
	then: function (callback, args) {
		if (this.isRunning) {
			this.chain({
				owner: this,
				run: function (args) {
					if (callback.call(this.owner, args) !== false)
						this.owner.progress();
				}
			}, args);
		} else {
			callback.call(this, args);
		}
		return this;
	},

	/**
	 * 让当前任务推迟指定时间后执行。
	 * @param {Integer} duration 等待的毫秒数。
	 * @return this
	 */
	delay: function (duration) {
		return this.run({ duration: duration });
	},

	/**
	 * 当被子类重写时，用于暂停正在执行的任务。
	 * @protected virtual
	 * @method
	 */
	pause: Function.empty,

	/**
	 * 中止然后跳过正在执行的任务。
	 * @return this
	 */
	skip: function () {
		this.pause();
		this.progress();
		return this;
	},

	/**
	 * 强制中止正在执行的任务。
	 * @return this
	 */
	abort: function () {
		this.pause();
		this._firstTask = this._lastTask = null;
		this.isRunning = false;
		return this;
	},

	/**
	 * 正常中止正在执行的任务。
	 * @return this
	 * @virtual
	 */
	stop: function () {
		return this.abort();
	}

});
