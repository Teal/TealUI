/**
 * @fileOverview 提供底层的 特效算法支持。
 * @author xuld
 */

//#include utils/deferrable.js

/**
 * 特效算法基类。
 * @class Fx
 * @extends Deferrable
 * @abstract
 */
var Fx = (function() {
	
	/// #region interval
	
	var cache = {};
	
	/**
	 * 定时执行的函数。
	 */
	function interval(){
		var i = this.length;
		while(--i >= 0)
			this[i].step();
	}
	
	/// #endregion
		
	return Deferrable.extend({

		/**
		 * 当前 FX 对象的默认配置。
		 */
		options: {

			/**
			 * 特效执行毫秒数。
			 * @type {Number}
			 */
			duration: 300,

			/**
			 * 每秒的运行帧次。
			 * @type {Number}
			 */
			fps: 50,

			/**
			 * 用于实现渐变曲线的计算函数。函数的参数为：
			 *
			 * - @param {Object} p 转换前的数值，0-1 之间。
			 *
			 * 返回值是一个数字，表示转换后的值，0-1 之间。
			 * @field
			 * @type Function
			 * @remark
			 */
			transition: function(p) {
				return -(Math.cos(Math.PI * p) - 1) / 2;
			}

		},
		
		/**
		 * 当被子类重写时，实现生成当前变化所进行的初始状态。
		 * @param {Object} from 开始位置。
		 * @param {Object} to 结束位置。
		 * @return {Base} this
		 * @protected virtual
		 */
		init: Function.empty,
		
		/**
		 * 根据指定变化量设置值。
		 * @param {Number} delta 变化量。 0 - 1 。
		 * @protected abstract
		 */
		set: Function.empty,
		
		/**
		 * 进入变换的下步。
		 * @protected
		 */
		step: function() {
			var me = this,
				time = Date.now() - me.time,
				options = me.options;
			if (time < options.duration) {
				me.set(options.transition(time / options.duration));
			}  else {
				me.end(false);
			}
		},
		
		/**
		 * 开始运行特效。
		 * @param {Object} from 开始位置。
		 * @param {Object} to 结束位置。
		 * @param {Number} duration=-1 变化的时间。
		 * @param {Function} [onComplete] 停止回调。
		 * @param {String} link='wait' 变化串联的方法。 可以为 wait, 等待当前队列完成。 restart 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。
		 * @return {Base} this
		 */
		run: function (options, link) {
			var me = this, defaultOptions, duration;
			if (!me.defer(options, link)) {

				defaultOptions = me.options;

				// options
				me.options = options = Object.extend({
					transition: defaultOptions.transition,
					fps: defaultOptions.fps
				}, options);

				// duration
				duration = options.duration;
				//assert(duration == undefined || duration === 0 || +duration, "Fx#run(options, link): {duration} 必须是数字。如果需要使用默认的时间，使用 -1 。",  duration);
				options.duration = duration !== -1 && duration != undefined ? duration < 0 ? -defaultOptions.duration / duration : duration : defaultOptions.duration;

				// start
				if (options.start && options.start.call(options.elem, options, me) === false) {
					me.progress();
				} else {
					
					me.init(options);
					me.set(0);
					me.time = 0;
					me.resume();
				}
			}

			return me;
		},

		/**
		 * 由应用程序通知当前 Fx 对象特效执行完。
		 * @param {Boolean} isAbort 如果是强制中止则为 true, 否则是 false 。
		 * @protected
		 */
		end: function(isAbort) {
			var me = this;
			me.pause();
			me.set(1);
			try {

				// 调用回调函数。
				if (me.options.complete) {
					me.options.complete.call(me.options.elem, isAbort, me);
				}
			} finally {

				// 删除配置对象。恢复默认的配置对象。
				delete me.options;
				me.progress();
			}
			return me;
		},
		
		/**
		 * 中断当前效果。
		 * @protected override
		 * @return this
		 */
		stop: function() {
			this.abort();
			this.end(true);
			return this;
		},
		
		/**
		 * 暂停当前效果。
		 * @protected override
		 */
		pause: function() {
			var me = this, fps, intervals;
			if (me.timer) {
				me.time = Date.now() - me.time;
				fps = me.options.fps;
				intervals = cache[fps];
				intervals.remove(me);
				if (intervals.length === 0) {
					clearInterval(me.timer);
					delete cache[fps];
				}
				me.timer = 0;
			}
		},
		
		/**
		 * 恢复当前效果。
		 */
		resume: function() {
			var me = this, fps, intervals;
			if (!me.timer) {
				me.time = Date.now() - me.time;
				fps = me.options.fps;
				intervals = cache[fps];
				if (intervals) {
					intervals.push(me);
					me.timer = intervals[0].timer;
				} else {
					me.timer = setInterval(interval.bind(cache[fps] = [me]), Math.round(1000 / fps ));
				}
			}
			return me;
		}
		
	});
	

})();
