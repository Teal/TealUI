/**
 * @author xuld
 */

// #require ui/composite/calender.css
// #require utils/date.js
// #require fx/animate.js

var Calender = Control.extend({

    duration: -1,

    tpl: '<div class="x-calender-main">\
            <div class="x-calender-header">\
                <a href="javascript://下一页" title="下一页" class="x-calender-next x-icon">▸</a>\
                <a href="javascript://上一页" title="上一页" class="x-calender-prev x-icon">◂</a>\
                <a href="javascript://上一级" title="返回上一级" class="x-calender-title"></a>\
            </div>\
            <div class="x-calender-body"><table class="x-calender-days"></table></div>\
            <div class="x-calender-time">\
                时间: \
                <input type="number" value="0" min="0" max="24" maxlength="2" />\
                :<input type="number" value="0" min="0" max="60" maxlength="2" />\
                :<input type="number" value="0" min="0" max="60" maxlength="2" />\
            </div>\
            <div class="x-calender-footer">\
                <a href="javascript://今天" class="x-calender-today">今天: 2010年10月20日</a>\
            </div>\
        </div>',

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
	    this.elem.innerHTML = this.tpl;
	    this.displayedValue = new Date();
	    this.setView('day', 'none');
	    return;
	    this.today = options.today ? new Date(options.today) : new Date();

		var me = this;
		Dom.on(me.elem, 'click', '.x-calender-title', function(e) { me.onTitleClick(e);  });
		Dom.on(me.elem, 'click', '.x-calender-prev', function(e) { me.onPrevClick(e); });
		Dom.on(me.elem, 'click', '.x-calender-next', function (e) { me.onNextClick(e); });
		Dom.on(me.elem, 'click', '.x-calender-footer a', function (e) { me.onTodayClick(e); });
		Dom.on(me.elem, 'click', '.x-calender-content a', function () {
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
	setView: function (view, animation) {
        
        // 保存当前显示的视图。
	    this.view = view;
        
	    var body = Dom.find('.x-calender-body', this.elem);

	    // 渲染视图。
	    var table = document.createElement('table');

	    Calender.views[view].render(this, table, Dom.find('.x-calender-title', this.elem), animation);

	    if (animation === 'none') {
	        body.innerHTML = '';
	        body.appendChild(table);
	    } else {
	        var currentTable = body.firstChild;
	        Dom.animate(currentTable, {
	            transform: 'scale(2, 2) translate(-100px, 0)',
                //opacity: '0'
	        }, 1000);
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
		this.displayedValue = new Date(+value);

		// 更新视图。
		this.setView('day', 'none');

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
	},

    /**
     * 当被用户重写时，负责返回指定的日期的类名。
     */
    getClassName: function(date) {
        return '';
    }

});

Calender._isMonthOf = function(date, displayedYear, displayedMonth) {
    return date.getFullYear() === displayedYear && date.getMonth() === displayedMonth;
};

Calender._renderContentOfMonthYears = function (calender, useProxy, contentGetter) {

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

};

Calender.views = {

    day: {

        /**
         * 向指定的 *calender* 内的 *contentNode* 节点渲染日视图。
         * @param {MonthCalender} calender 要渲染的目标日历对象。
         */
        render: function (calender, table, title) {

            // 用于计算的日期。
            var displayedValue = calender.displayedValue,
                
                // 临时日期对象。
                tmpDate = new Date(displayedValue.getFullYear(), displayedValue.getMonth(), 1),

                // 最后生成的最后日期。
                html = '',

                // 一次绘制会存在3个月，此序号标记正在绘制哪一月。
                monthDelta = 0,

                i,

                j,
                    
                day;

            // 调整日期为星期天。
            day = tmpDate.getDay();
            tmpDate.addDay(day === 0 ? -7 : -day);

            // 绘制星期。
            html += '<tr class="x-calender-weeks">';
            for (i = 0; i < Calender.texts.weeks.length; i++) {
                html += '<th>' + Calender.texts.weeks[i] + '</th>';
            }
            html += '</tr>';

            // 绘制日。
            for (i = 0; i < 6; i++) {
                html += '<tr>';
                for (j = 0; j < 7; j++) {

                    // 如果是第一天，切换 是否当前月 。
                    day = tmpDate.getDate();
                    if (day == 1) {
                        monthDelta++;
                    }

                    html += '<td class="' + calender.getClassName(tmpDate);

                    // 超过日期范围。
                    if (tmpDate < calender.min || tmpDate > calender.max) {
                        html += ' x-calender-invalid';
                    }

                    // 当前选中的日期。
                    if (+tmpDate === +calender.value) {
                        html += ' x-calender-selected';
                    }

                    // 今天。
                    if (+tmpDate === +calender.today) {
                        html += ' x-calender-actived';
                    }

                    if (monthDelta !== 1) {
                        html += ' x-calender-alt ' + (monthDelta ? 'x-calender-alt-prev' : 'x-calender-alt-next');
                    }

                    html += '">' + (monthDelta === 1 ? '<a href="javascript:;">' + day + '</a>' : day) + '</td>';

                    // 计算下一天。
                    tmpDate.setDate(day + 1);
                }
                html += '</tr>';
            }

            // 设置内容。
            table.className = 'x-calender-days';
            table.innerHTML = html;

            // 设置顶部标题。
            title.innerHTML = displayedValue.format(Calender.texts.month);
        },

        parentView: 'month',

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

    month: {

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

    year: {

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

    decade: {

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
    }

};

Calender.texts = {

    months: "一月 二月 三月 四月 五月 六月 七月 八月 九月 十月 十一月 十二月".split(' '),

    weeks: '日 一 二 三 四 五 六'.split(' '),

    month: 'yyyy年M月',

    today: '今天: yyyy年M月d日',

    now: '现在: yyyy年M月d日 HH时mm分',

    date: 'yyyy/MM/dd',

    time: 'yyyy/MM/dd hh:mm:ss'
};
