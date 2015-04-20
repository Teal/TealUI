/**
 * @author xuld
 */

//#include ui/composite/monthcalender.css
//#include utils/date.js
//#include fx/animate.js

var MonthCalender = Control.extend({

	cssClass: 'x-monthcalender',

	tpl: '<div class="{cssClass}">\
		       <div class="{cssClass}-main">\
		        <div class="{cssClass}-header">\
		            <a class="{cssClass}-next" href="javascript://下一页">▸</a>\
		            <a class="{cssClass}-prev" href="javascript://上一页">◂</a>\
		            <a class="{cssClass}-title" href="javascript://返回上一级"></a>\
		        </div>\
		        <div class="{cssClass}-body">\
		            <div class="{cssClass}-content">\
		                <div style="left:1px; top:1px;"></div>\
						<div style="left:172px; top:1px;"></div>\
					</div>\
		        </div>\
		    	<div class="{cssClass}-footer">\
		    		<a href="javascript://选择今天"></a>\
		    	</div>\
		      </div>\
			</div>',

	duration: -1,

	/**
     * 渐变切换视图。
     */
	_toggleContentBySlide: function (oldLeft, sliderLeft, newLeft, tweenLeft, duration) {
		var oldContent = this.contentNode,
            newContent = this.contentProxyNode,
            slider = Dom.parent(newContent);

		oldContent.style.left = oldLeft + 'px';
		slider.style.left = sliderLeft + 'px';
		newContent.style.left = newLeft + 'px';
		Dom.animate(slider, { left: tweenLeft }, duration, null, 'replace');

		this.contentNode = newContent;
		this.contentProxyNode = oldContent;
	},

	_toggleContentByFade: function (duration) {
		var me = this,
            oldContent = me.contentNode,
            newContent = me.contentProxyNode,
            slider = newContent.parentNode,
            newStyle = newContent.style,
            oldStyle = oldContent.style;

		Dom.setStyle(newContent, 'opacity', 0);
		slider.style.left = oldStyle.left = newStyle.left = '1px';
		newStyle.zIndex = 2;
		oldStyle.zIndex = 1;
		Dom.animate(newContent, { opacity: 1 }, duration, null, 'replace');
		Dom.animate(oldContent, { opacity: 0 }, duration, function () {
			newStyle.left = '1px';
			oldStyle.left = me._widthCache + 'px';
			Dom.setStyle(oldContent, 'opacity', 1);
		}, 'replace');

		me.contentNode = newContent;
		me.contentProxyNode = oldContent;
	},

	/**
     * 当用户点击某一项时执行。
     * @param {Dom} item 正在被点击的项。
     * @protected virtual
     */
	onItemClick: function (item) {

		// 如果此项是允许点击的。则生成新的日期对象，并设置为当前值。
		if (!Dom.hasClass(item, this.cssClass + '-disabled')) {
			this.selectItem(item);
		}

		return false;
	},

	onPrevClick: function () {

		var me = this;

		me.view.move(me, -1);

		// 渲染到代理。
		me.view.render(me, true);

		// 特效显示。
		me._toggleContentBySlide(me._widthCache, -me._widthCache, 1, 1, this.duration);

		return false;
	},

	onNextClick: function () {

		var me = this;

		me.view.move(me, 1);

		// 渲染到代理。
		me.view.render(me, true);

		// 特效显示。
		me._toggleContentBySlide(1, 1, me._widthCache, -me._widthCache, this.duration);

		return false;
	},

	onTitleClick: function () {

		// 切换显示到父视图。
		this.setView(MonthCalender[this.view.parentView]);
	},

	onTodayClick: function () {

		// 获取今天的日期。
		var today = this.getToday();

		// 如果是在范围内。
		if (!(today < this.minValue || today > this.maxValue)) {

			// 更新 UI，显示当前值。
			this.setValue(today);

			// 触发相关的点击事件。
			this.onItemClick(Dom.find('.' + this.cssClass + '-selected', this.elem));
		}

		return this;
	},

	value: null,

	today: null,

	init: function (options) {
		var me = this;
		Dom.setStyle(this.elem, 'user-select', 'none');
		Dom.on(me.elem, 'click', '.' + this.cssClass + '-title', me.onTitleClick, me);
		Dom.on(me.elem, 'click', '.' + this.cssClass + '-prev', me.onPrevClick, me);
		Dom.on(me.elem, 'click', '.' + this.cssClass + '-next', me.onNextClick, me);
		Dom.on(me.elem, 'click', '.' + this.cssClass + '-footer a', me.onTodayClick, me);
		Dom.on(me.elem, 'click', '.' + this.cssClass + '-content a', function () {
			return me.view.select(me, this);
		});

		var contents = Dom.find('.' + this.cssClass + '-content', this.elem);
		me.contentNode = Dom.first(contents);
		me.contentProxyNode = Dom.last(contents);

		options.today = options.today || new Date();

		options.value = options.value || new Date();

		me._widthCache = Dom.getWidth(this.elem) || 172;

		this.displayedValue = options.value;

		this.setToday(options.today);
		this.setValue(options.value);

	},

	setToday: function (value) {
		Dom.setHtml(Dom.find('.' + this.cssClass + '-footer a', this.elem), value.toString(MonthCalender.todayFormat));
		this.today = value;
	},

	getToday: function () {
		return this.today;
	},

	/**
     * 切换当前显示的界面。
     */
	setView: function (view, duration) {
		if (duration !== 0) {
			view.render(this, true);
			this.view = view;
			this._toggleContentByFade(duration || this.duration);
		} else {
			view.render(this);
			this.view = view;
		}

		return this;
	},

	/**
     * 模拟用户选中某一项。
     * @param {Dom} item 需要选中的项。
     */
	selectItem: function (item) {

		// 根据 item 取得 value 。
		var value = new Date(this.displayedValue.getFullYear(), this.displayedValue.getMonth(), parseInt(Dom.getText(item)));

		// 如果允许选中。
		if (this.trigger('selecting', value)) {

			// 获取原值。
			var oldValue = this.getValue();

			// 设置值。
			this.setValue(value);

			// 检测值是否改变。
			if (value - oldValue > 0) {
				this.trigger('change');
			}

		}

		return this;

	},

	/**
     * 设置当前日历的值。
     * @param {Date} value 要设置的值。
     */
	setValue: function (value) {

		// 设置值。
		this.value = value;

		// 当前正在显示的值。
		this.displayedValue = value.clone();

		// 更新视图。
		this.setView(MonthCalender.DayView, 0);

		return this;
	},

	/**
     * 获取当前日历的值。
     */
	getValue: function (fn) {
		return this.value;
	},

	limit: function (minValue, maxValue) {
		this.minValue = minValue;
		this.maxValue = maxValue;
		this.view.render(this);
		return this;
	}

});

Object.extend(MonthCalender, {

	_isMonthOf: function (date, displayedYear, displayedMonth) {
		return date.getFullYear() === displayedYear && date.getMonth() === displayedMonth;
	},

	_renderContentOfMonthYears: function (calender, useProxy, contentGetter) {

		var html = '',

            c = 0,

            i = 0,

            j;

		while (i++ < 3) {
			html += '<div>';
			for (j = 0; j < 4; j++) {
				html += contentGetter(c++);
			}
			html += '</div>';
		}

		// 设置内容。
		var n = calender[useProxy ? 'contentProxyNode' : 'contentNode'];
		Dom.setHtml(n, html);
		n.className = calender.cssClass + '-monthyears';

	},

	DayView: {

		/**
         * 向指定的 *calender* 内的 *contentNode* 节点渲染日视图。
         * @param {MonthCalender} calender 要渲染的目标日历对象。
         */
		render: function (calender, useProxy) {

			// 获取当前的值。用于添加 selected 属性。
			var currentValue = calender.getValue(),

                // 获取今天。用于添加 actived 属性。
                today = calender.getToday(),

                // 获取当前年 。
                displayedYear = calender.displayedValue.getFullYear(),

                // 获取当前月。
                displayedMonth = calender.displayedValue.getMonth(),

                // 要渲染的日期的最小值。
                minValue = calender.minValue,

                // 要渲染的日期的最大值。
                maxValue = calender.maxValue,

                // 需要添加 selected 的日期值。
                selectedDate = MonthCalender._isMonthOf(currentValue, displayedYear, displayedMonth) ? currentValue.getDate() : 0,

                // 需要添加 actived 的日期值。
                activedDate = MonthCalender._isMonthOf(today, displayedYear, displayedMonth) ? today.getDate() : 0,

                html = '',

                i = 0,

                j,

                day,

                // 每项的样式，对于非当前月显示时需要 disabled。
                altClassType = -1,

                // 先获得月初。
                value = new Date(displayedYear, displayedMonth, 1);

			// 绘制星期。
			html += '<div class="' + this.cssClass + '-week">';
			for (j in MonthCalender.weeks) {
				html += '<span class="' + this.cssClass + '-' + j + '">' + MonthCalender.weeks[j] + '</span>';
			}
			html += '</div>';

			// 调整为星期天。
			day = value.getDay();
			value.addDay(day === 0 ? -7 : -day);

			// 绘制日。

			while (i++ < 6) {
				html += '<div>';
				for (j = 0; j < 7; j++) {
					html += '<a href="javascript:;" class="';

					// 获取当前日期。
					day = value.getDate();

					// 如果是第一天，切换 是否当前月 。
					if (day == 1) {
						altClassType++;
					}

					if (value < minValue || value > maxValue) {
						html += '' + calender.cssClass + '-disabled ';
					} else if (altClassType !== 0) {
						html += '' + calender.cssClass + '-alt ' + (altClassType ? '' + calender.cssClass + '-alt-prev ' : '' + calender.cssClass + '-alt-next ');
					} else {

						if (activedDate == day) {
							html += '' + calender.cssClass + '-actived ';
						}

						if (selectedDate == day) {
							html += '' + calender.cssClass + '-selected ';
						}

					}

					html += '">' + day + '</a>';

					// 计算下一天。
					value.setDate(day + 1);
				}
				html += '</div>';
			}

			// 设置内容。
			var n = calender[useProxy ? 'contentProxyNode' : 'contentNode'];
			Dom.setHtml(n, html);
			n.className = calender.cssClass + '-days';

			// 设置顶部标题。
			Dom.setText(Dom.find('.' + calender.cssClass + '-title', calender.elem), calender.displayedValue.toString(MonthCalender.monthFormat));
		},

		parentView: 'MonthView',

		select: function (calender, item) {

			// 如果是 alt， 则是上个月或下个月, 则切换为新视图。
			// 否则，设置并更新当前的值。
			if (Dom.hasClass(item, calender.cssClass + '-alt')) {

				var day = parseInt(Dom.getText(item));
				calender.value = new Date(calender.displayedValue.getFullYear(), calender.displayedValue.getMonth() + (day < 15 ? 1 : -1), day);
				return calender[day < 15 ? 'onNextClick' : 'onPrevClick']();

			}

			return calender.onItemClick(item);
		},

		move: function (calender, delta) {
			calender.displayedValue.addMonth(delta);
		}

	},

	MonthView: {

		/**
         * 向指定的 *calender* 内的 *contentNode* 节点渲染日视图。
         * @param {MonthCalender} calender 要渲染的目标日历对象。
         */
		render: function (calender, useProxy) {

			// 获取当前年 。
			var displayedYear = calender.displayedValue.getFullYear(),

                // 获取当前月。
                displayedMonth = calender.displayedValue.getMonth(),

                // 要渲染的日期的最小值。
                minValue = calender.minValue,

                // 要渲染的日期的最大值。
                maxValue = calender.maxValue,

                // 需要添加 selected 的日期值。
                selectedMonth = MonthCalender._isMonthOf(calender.getValue(), displayedYear, displayedMonth) ? displayedMonth : -1,

                // 需要添加 actived 的日期值。
                activedMonth = MonthCalender._isMonthOf(calender.getToday(), displayedYear, displayedMonth) ? displayedMonth : -1,

                // 显示所有月 。
                months = MonthCalender.months,

                // 用于第一个月的值。
                value = new Date(displayedYear, 0);

			MonthCalender._renderContentOfMonthYears(calender, useProxy, function (c) {

				value.setMonth(c);

				var html = '<a href="javascript:;" data-value="' + c + '" class="';

				if (value < minValue || value > maxValue) {
					html += '' + calender.cssClass + '-disabled ';
				}

				if (selectedMonth == c) {
					html += '' + calender.cssClass + '-selected ';
				}

				html += '">' + months[c] + '</a>';

				return html;

			});

			// 设置顶部标题。
			Dom.setText(Dom.find('.' + calender.cssClass + '-title', calender.elem), displayedYear);
		},

		select: function (calender, item) {

			calender.displayedValue.setMonth(+Dom.getAttr(item, 'data-value'));

			calender.setView(MonthCalender.DayView);

		},

		parentView: 'YearView',

		move: function (calender, delta) {
			calender.displayedValue.addYear(delta);
		}

	},

	YearView: {

		render: function (calender, useProxy) {

			// 获取当前年 。
			var displayedYear = calender.displayedValue.getFullYear(),

                // 要渲染的日期的最小值。
                minValue = calender.minValue && calender.minValue.getFullYear(),

                // 要渲染的日期的最大值。
                maxValue = calender.maxValue && calender.maxValue.getFullYear(),

                // 需要添加 selected 的日期值。
                selectedYear = calender.getValue().getFullYear(),

                // 需要添加 actived 的日期值。
                activedYear = calender.getToday().getFullYear(),

                value = ((displayedYear / 10) | 0) * 10;

			// 设置顶部标题。
			Dom.setText(Dom.find('.' + calender.cssClass + '-title', calender.elem), value + '-' + (value + 9));

			value--;

			MonthCalender._renderContentOfMonthYears(calender, useProxy, function (c) {

				var html = '<a href="javascript:;" class="';

				if (value < minValue || value > maxValue) {
					html += '' + calender.cssClass + '-disabled ';
				}

				if (c === 0 || c === 11) {
					html += '' + calender.cssClass + '-alt ';
				}

				if (selectedYear == value) {
					html += '' + calender.cssClass + '-selected ';
				}

				if (activedYear == value) {
					html += '' + calender.cssClass + '-selected ';
				}

				html += '">' + value + '</a>';

				value++;

				return html;

			});
		},

		select: function (calender, item) {

			calender.displayedValue.setYear(+Dom.getText(item));

			calender.setView(MonthCalender.MonthView);

		},

		parentView: 'DecadeView',

		move: function (calender, delta) {
			calender.displayedValue.addYear(delta * 10);
		}

	},

	DecadeView: {

		render: function (calender, useProxy) {

			// 获取当前年 。
			var displayedYear = calender.displayedValue.getFullYear(),

                // 要渲染的日期的最小值。
                minValue = calender.minValue && calender.minValue.getFullYear(),

                // 要渲染的日期的最大值。
                maxValue = calender.maxValue && calender.maxValue.getFullYear(),

                // 需要添加 selected 的日期值。
                selectedYear = calender.getValue().getFullYear(),

                // 需要添加 actived 的日期值。
                activedYear = calender.getToday().getFullYear(),

                value = ((displayedYear / 100) | 0) * 100;

			// 设置顶部标题。
			Dom.setText(Dom.find('.' + calender.cssClass + '-title', calender.elem), value + '-' + (value + 99));

			value--;

			MonthCalender._renderContentOfMonthYears(calender, useProxy, function (c) {

				var html = '<a href="javascript:;" data-value="' + (value + 5) + '" class="' + calender.cssClass + '-decade ';

				if (value + 10 < minValue || value > maxValue) {
					html += '' + calender.cssClass + '-disabled ';
				}

				if (c === 0 || c === 11) {
					html += '' + calender.cssClass + '-alt ';
				}

				if (selectedYear >= value && selectedYear <= value + 9) {
					html += '' + calender.cssClass + '-selected ';
				}

				if (activedYear >= value && activedYear <= value + 9) {
					html += '' + calender.cssClass + '-selected ';
				}

				html += '">' + value + '-<br>' + (value + 9) + '&nbsp;</a>';

				value += 10;

				return html;

			});

		},

		parentView: 'DecadeView',

		select: function (calender, item) {

			calender.displayedValue.setYear(+Dom.getAttr(item, 'data-value'));

			calender.setView(MonthCalender.YearView);

		},

		move: function (calender, delta) {
			calender.displayedValue.addYear(delta * 100);
		}
	},

	months: "一月 二月 三月 四月 五月 六月 七月 八月 九月 十月 十一月 十二月".split(' '),

	weeks: {
		sunday: '日',
		monday: '一',
		tuesday: '二',
		wednesday: '三',
		thursday: '四',
		friday: '五',
		saturday: '六'
	},

	monthFormat: 'yyyy年M月',

	todayFormat: '今天: yyyy年M月d日'

});
