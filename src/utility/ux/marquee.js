/**
 * @author xuld
 */


typeof include === "function" && include("fx/animate.js");
typeof include === "function" && include("dom/dom.js");

var Marquee = Base.extend({

	/**
	 * 每次滚动的效果时间。
	 */
	duration: -1,

	/**
	 * 自动滚动的延时时间。
	 */
	delay: 3000,

	/**
	 * 移动的方向。
	 * @config
	 */
	direction: 'left',

	/**
	 * 每次移动的张数。
	 * @config
	 */
	delta: 1,

	/**
	 * 是否循环播放。
	 * @config
	 */
	loop: true,

	/**
	 * 是否保证平滑滚动。
	 * @config
	 */
	flow: true,

	/**
     * 当前正在显示的索引。
     */
	currentIndex: 0,

	/**
	 * 是否循环。
	 * @property {Boolean} loop
	 */

	_getWidthBefore: function (ctrl, xy) {
		return ctrl && (ctrl = Dom.prev(ctrl)) ? Dom.calc(ctrl, xy) + this._getWidthBefore(ctrl, xy) : 0;
	},

	_getScrollByIndex: function (value) {
		return this._getWidthBefore(Dom.child(this.elem, value), this._horizonal ? 'marginLeft+marginRight+width' : 'marginTop+marginBottom+height');
	},

	_getTotalSize: function () {
		var size = 0;
		var xy = this._horizonal ? "marginLeft+marginRight+width" : "marginTop+marginBottom+height";
		Dom.children(this.elem).each(function (child) {
			size += Dom.calc(child, xy);
		});
		return size;
	},

	/**
	 * 内部实现移动到指定位置的效果。
	 */
	_animateToWithoutLoop: function (index, lt) {

		var me = this,
			oldIndex = me._fixIndex(me.currentIndex),
			obj;

		if (me.beforeChange(index, oldIndex) !== false) {

			// 暂停自动播放，防止出现抢资源问题。
			me.pause();

			// 记录当前正在转向的目标索引。
			me.currentIndex = index;

			// 计算滚动坐标。

			obj = {};
			obj[me._horizonal ? 'marginLeft' : 'marginTop'] = -me._getScrollByIndex(index);
			Dom.animate(me.elem, {
				params: obj,
				duration: me.duration,
				complete: function () {

					// 滚动完成后触发事件。
					me.afterChange(index, oldIndex);

					// 如果本来正在自动播放中，这里恢复自动播放。
					if (me.step)
						me.resume();
				},
				link: 'abort'
			});
		}

	},

	/**
	 * 内部实现移动到指定位置的效果。
	 * @param {Number} index 滚动的目标索引。
	 * @param {Boolean} lt 回滚还是继续滚。
	 */
	_animateToWithLoop: function (index, lt) {

		var me = this,
			oldIndex = me._fixIndex(me.currentIndex);

		if (me.beforeChange(index, oldIndex) !== false) {

			// 暂停自动播放，防止出现抢资源问题。
			me.pause();

			Dom.animate(me.elem, {
				params: {},
				duration: me.duration,
				complete: function () {

					// 效果结束。
					me._animatingTargetIndex = null;

					// 滚动完成后触发事件。
					me.afterChange(index, oldIndex);

					// 如果本来正在自动播放中，这里恢复自动播放。
					if (me.step)
						me.resume();
				},
				start: function (options) {

					// 实际所滚动的区域。
					var actualIndex = index + me.length,
							prop = me._horizonal ? 'marginLeft' : 'marginTop',
							from = Dom.styleNumber(me.elem, prop),
							to = -me._getScrollByIndex(actualIndex);

					// 如果保证是平滑滚动，则修正错误的位置。
					if (me.flow) {

						// 如果是往上、左方向滚。
						if (lt) {

							// 确保 from > to
							if (from > to) {
								from -= me._size;
							}

						} else {

							// 确保 from < to
							if (from < to) {
								from += me._size;
							}
						}

					}

					options.params[prop] = from + '-' + to;

					// 记录当前正在转向的目标索引。
					me.currentIndex = index;
				},
				link: 'stop'
			});
		}
		return this;

	},

	_fixIndex: function (index) {
		return index = index >= 0 ? index % this.length : index + this.length;
	},

	beforeChange: function (newIndex, oldIndex) {
		return !this.disabled && this.trigger('changing', {
			from: oldIndex,
			to: newIndex
		});
	},

	afterChange: function (newIndex, oldIndex) {
		this.trigger('changed', {
			from: oldIndex,
			to: newIndex
		});
	},

	/**
	 * 更新节点状态。
	 */
	update: function () {
		var children = Dom.children(this.elem),
			size,
			xy = this._horizonal ? 'Width' : 'Height';

		if (!this.cloned) {

			// 设置大小。
			this.length = children.length;

			// 如果不需要滚动，自动设为 disabled 属性。
			this.disabled = Dom['get' + xy](Dom.parent(this.elem)) >= size;
			//  this.disabled = Dom.getScrollSize(this.elem)[this._horizonal ? 'x' : 'y'] > size;

			if (!this.disabled && this.loop) {
				children.each(function (elem) {
					Dom.append(this.elem, Dom.clone(elem));
				}, this);
				children.each(function (elem) {
					Dom.append(this.elem, Dom.clone(elem));
				}, this);
				this.cloned = true;
			}
		}

		size = this._getTotalSize();
		this._size = this.cloned ? size / 3 : size;

		Dom['set' + xy](this.elem, size);
		this.set(this.currentIndex);
	},

	pause: function () {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = 0;
		}

	},

	resume: function () {
		if (!this.timer) {
			this.timer = setTimeout(this.step, this.delay);
		}
	},

	constructor: function (elem, direction, loop, deferUpdate) {
		elem = Dom.find(elem);
		this.elem = Dom.find('ul', elem) || elem;
		Dom.setStyle(Dom.parent(this.elem), 'overflow', 'hidden');

		if (loop === false) {
			this.loop = false;
		}

		this.setDirection(direction || this.direction);

		this.update();

		// Chrome 无法直接获取图片大小。
		if (deferUpdate !== false && !Dom.isLoaded) {
			Dom.load(this.update.bind(this));
		}
	},

	/**
	 * 暂停滚动
	 * @method pause
	 */
	stop: function () {
		clearInterval(this.timer);
		this.timer = 0;
		this.step = null;
		return this;
	},

	setDirection: function (direction) {
		this.direction = direction;
		this._lt = /^[rb]/.test(direction);
		this._horizonal = /^[lr]/.test(direction);
	},

	/**
	 * (重新)开始滚动
	 * @method start
	 */
	start: function (delta) {
		var me = this.stop();
		delta = delta || me.delta;
		if (delta < 0) {
			me._lt = !me._lt;
			delta = -delta;
		}

		if (me._lt) {
			delta = -delta;
		}

		// 如果不延时。
		if (me.delay === 0) {

			me.moving = function () {

				var value = me._current - delta;

				if (value <= me._min) {
					value += me._unit;
				} else if (value >= me._max) {
					value -= me._unit;
				}

				me._current = value;

				me.elem.style[me._prop] = value + 'px';

				me.timer = setTimeout(me.moving, me.duration);

			};

			me.step = function () {

				me._prop = me._horizonal ? 'marginLeft' : 'marginTop';
				me._current = Dom.styleNumber(me.elem, me._prop);
				me._unit = me._getScrollByIndex(me.length + 1);

				if (me.loop) {
					me._min = -me._unit * 2;
					me._max = -me._unit;
				} else {
					me._min = -me._unit;
					me._max = 0;
				}
				me.moving();
			};

		} else {

			// 设置单步的执行函数。
			me.step = function () {
				var index = me.currentIndex + delta;
				index = me._fixIndex(index);
				me[me.loop ? '_animateToWithLoop' : '_animateToWithoutLoop'](index, me._lt);
				me.timer = setTimeout(me.step, me.delay);
			};

		}

		// 正式开始。
		me.resume();

		return me;
	},

	set: function (index) {
		var newIndex = index = this._fixIndex(index);
		if (this.loop) {
			index += this.length;
		}
		Dom.setStyle(this.elem, this._horizonal ? 'marginLeft' : 'marginTop', -this._getScrollByIndex(index));
		this.afterChange(index, this.currentIndex);
		this.currentIndex = newIndex;
		return this;
	},

	moveTo: function (index, lt) {
		index = this._fixIndex(index);
		this[this.loop ? '_animateToWithLoop' : '_animateToWithoutLoop'](index, lt === undefined ? index < this.currentIndex : lt);
		return this;
	},

	moveBy: function (index) {
		return this.moveTo(this.currentIndex + index % this.length, index < 0);
	},

	prev: function () {
		return this.moveTo(this.currentIndex - 1, true);
	},

	next: function () {
		return this.moveTo(this.currentIndex + 1, false);
	}

});
