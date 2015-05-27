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
                <a href="javascript://选择今天" class="x-calender-today"></a>\
            </div>\
        </div>',

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
        Calender.views[this.view].move(this, -1);
        this.setView(this.view, 'slideLeft');
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
        this.setView(Calender.views[this.view].parentView, 'zoomIn');
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

    /**
     * 获取或设置现在选中的日期时间。
     */
    value: null,

    /**
     * 获取或设置现在时间。现在时间在日历中将被高亮显示。
     */
    now: null,

    /**
     * 获取或设置当前日历显示的时间。
     */
    displayValue: null,

    /**
     * 指示当前选择的范围。可以是 'year', 'month', 'day'（默认）, 'time'。
     */
    picker: 'day',

    init: function () {

        // 初始化 3 个时间。
        this.now = Date.from(this.now) || new Date();
        this.value = Date.from(this.value);
        this.displayValue = Date.from(this.displayValue) || this.value || this.now;

        // 绑定事件。
        var me = this;
        Dom.on(me.elem, 'click', '.x-calender-title', function (e) { me.onTitleClick(e); });
        Dom.on(me.elem, 'click', '.x-calender-prev', function (e) { me.onPrevClick(e); });
        Dom.on(me.elem, 'click', '.x-calender-next', function (e) { me.onNextClick(e); });
        Dom.on(me.elem, 'click', '.x-calender-today', function (e) { me.onTodayClick(e); });
        Dom.on(me.elem, 'click', '.x-calender-content a', function (e) { me.onItemClick(this, e); });

        // 初始化界面。
        this.elem.innerHTML = this.tpl;
        Dom.toggle(Dom.find('.x-calender-time', this.elem), this.picker === 'time');
        Dom.find('.x-calender-today', this.elem).innerHTML = this.now.format(this.picker === 'time' ? Calender.locale.now : Calender.locale.today);
        this.setView('day');

    },

    /**
     * 切换当前显示的界面。
     */
    setView: function (view, animation) {

        // 保存当前显示的视图。
        this.view = view;

        var body = Dom.find('.x-calender-body', this.elem);

        // 渲染视图。
        var newTable = document.createElement('table');

        Calender.views[view].render(this, newTable, Dom.find('.x-calender-title', this.elem), animation);

        var oldTable = body.lastChild;
        body.appendChild(newTable);

        if (oldTable) {
            if (animation) {
                var actived = Dom.find('.x-calender-actived', newTable);
                if (animation === 'zoomIn') {
                    //Dom.animate(oldTable, {
                    //    transform: 'scale(0, 0) translate(0, 0)',
                    //    opacity: '0'
                    //}, 3000);

                    Dom.hide(oldTable);

                    Dom.animate(newTable, {
                        transform: 'scale(3, 3) translate(100px, 0)',
                    }, {
                        transform: 'scale(1, 1) translate(0, 0)',
                    }, 3000);
                }
            } else {
                Dom.remove(oldTable);
            }
        }

        return this;
    },

    /**
     * 模拟用户选中某一项。
     * @param {Dom} item 需要选中的项。
     */
    selectItem: function (item) {

        // 根据 item 取得 value 。
        var value = new Date(this.displayValue.getFullYear(), this.displayValue.getMonth(), parseInt(Dom.getText(item)));

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
        this.displayValue = new Date(+value);

        // 更新视图。
        this.setView('day');

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
    getClassName: function (date) {
        return '';
    },

    /**
     * 当被用户重写时，负责返回指定的日期的节日。
     */
    getHoliday: function (date) {
        return '';
    }

});

Calender._isMonthOf = function (date, displayedYear, displayedMonth) {
    return date.getFullYear() === displayedYear && date.getMonth() === displayedMonth;
};

Calender._generateTable = function (rowCount, colCount, generator) {
    var html = '', rowIndex, colIndex, index = 0;
    for (rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        html += '<tr>';
        for (colIndex = 0; colIndex < colCount; colIndex++) {
            html += generator(index++);
        }
        html += '</tr>';
    }
    return html;
};

Calender.views = {

    day: {

        /**
         * 向指定的 *calender* 内的 *contentNode* 节点渲染日视图。
         * @param {MonthCalender} calender 要渲染的目标日历对象。
         */
        render: function (calender, table, title) {

            var displayValue = calender.displayValue,
                value = calender.value,
                min = calender.min ? +calender.min.toDay() : NaN,
                max = calender.max ? +calender.max.toDay() : NaN,
                value = calender.value ? +calender.value.toDay() : 0,
                now = +calender.now.toDay(),
                tmpDate = new Date(displayValue.getFullYear(), displayValue.getMonth(), 1),
                weekHtml = '',

                // 一次绘制会存在3个月，此序号标记正在绘制哪一月。
                monthDelta = 0,

                tmpDateValue,
                day;

            // 调整日期为星期天。
            day = tmpDate.getDay();
            tmpDate = tmpDate.addDay(day === 0 ? -7 : -day);

            // 设置顶部标题。
            title.innerHTML = displayValue.format(Calender.locale.month);

            // 绘制星期。
            weekHtml += '<tr class="x-calender-weeks">';
            for (i = 0; i < Calender.locale.weeks.length; i++) {
                weekHtml += '<th>' + Calender.locale.weeks[i] + '</th>';
            }
            weekHtml += '</tr>';

            // 设置内容。
            table.className = 'x-calender-days';
            table.innerHTML = weekHtml + Calender._generateTable(6, 7, function () {

                tmpDateValue = +tmpDate;

                // 如果是第一天，切换 是否当前月 。
                day = tmpDate.getDate();
                if (day == 1) {
                    monthDelta++;
                }

                var holiday = Calender.locale.holidays[tmpDate.format('M-d')] || calender.getHoliday(tmpDate),
                    html = '';

                html += '<td data-value="' + tmpDateValue + '"' + (holiday ? ' title="' + holiday + '"' : '') + ' class="' + calender.getClassName(tmpDate);

                if (holiday) { html += ' x-calender-holiday'; }

                // 超过日期范围。
                if (tmpDateValue < min || tmpDateValue > max) { html += ' x-calender-invalid'; }

                // 当前选中的日期。
                if (tmpDateValue === value) { html += ' x-calender-selected'; }

                // 今天。
                if (tmpDateValue === now) { html += ' x-calender-actived';  }

                html += monthDelta !== 1 ? ' x-calender-alt">' + day + '</td>' : '"><a href="javascript:;">' + day + '</a></td>';

                // 计算下一天。
                tmpDate.setDate(day + 1);

                return html;

            });

        },

        parentView: 'month',

        select: function (calender, item) {

            // 如果是 alt， 则是上个月或下个月, 则切换为新视图。
            // 否则，设置并更新当前的值。
            if (Dom.hasClass(item, calender.cssClass + '-alt')) {

                var day = parseInt(Dom.getText(item));
                calender.value = new Date(calender.displayValue.getFullYear(), calender.displayValue.getMonth() + (day < 15 ? 1 : -1), day);
                return calender[day < 15 ? 'onNextClick' : 'onPrevClick']();

            }

            return calender.onItemClick(item);
        },

        move: function (calender, delta) {
            calender.displayValue = calender.displayValue.addMonth(delta);
        }

    },

    month: {

        /**
         * 向指定的 *calender* 内的 *contentNode* 节点渲染日视图。
         * @param {MonthCalender} calender 要渲染的目标日历对象。
         */
        render: function (calender, table, title) {

            var displayValue = calender.displayValue,
                value = this.picker === 'month' && calender.value,
                year = displayValue.getFullYear();

            // 设置顶部标题。
            title.innerHTML = year;

            // 设置内容。
            table.className = 'x-calender-months';
            table.innerHTML = Calender._generateTable(3, 4, function (month) {

                function compare(date) {
                    return date ? year === date.getFullYear() ? month - date.getMonth() : year - date.getFullYear() : NaN;
                }

                var html = '<td data-value="' + month + '" class="';

                // 超过日期范围。
                if (compare(calender.min) < 0 || compare(calender.max) > 0) { html += ' x-calender-invalid'; }

                // 当前选中的日期。
                if (compare(value) === 0) { html += ' x-calender-selected'; }

                // 今天。
                if (compare(displayValue) === 0) { html += ' x-calender-actived'; }

                html += '"><a href="javascript:;">' + Calender.locale.months[month] + '</a></td>';

                return html;

            });

        },

        select: function (calender, item) {

            calender.displayValue.setMonth(+Dom.getAttr(item, 'data-value'));

            calender.setView(MonthCalender.DayView);

        },

        parentView: 'year',

        move: function (calender, delta) {
            calender.displayValue = calender.displayValue.addYear(delta);
        }

    },

    year: {

        render: function (calender, table, title) {

            var displayValue = calender.displayValue,
                value = this.picker === 'year' && calender.value,
                startYear = Math.floor(displayValue.getFullYear() / 10) * 10 - 1,
                year = startYear;

            // 设置顶部标题。
            title.innerHTML = (startYear + 1) + '-' + (startYear + 10);

            // 设置内容。
            table.className = 'x-calender-years';
            table.innerHTML = Calender._generateTable(3, 4, function (yearIndex) {

                function compare(date) {
                    return date ? year - date.getFullYear() : NaN;
                }

                var html = '<td data-value="' + year + '" class="';

                // 超过日期范围。
                if (compare(calender.min) < 0 || compare(calender.max) > 0) { html += ' x-calender-invalid'; }

                // 当前选中的日期。
                if (compare(value) === 0) { html += ' x-calender-selected'; }

                // 今天。
                if (compare(displayValue) === 0) { html += ' x-calender-actived'; }

                html += yearIndex === 0 || yearIndex === 11 ? ' x-calender-alt">' + year + '</td>' : '"><a href="javascript:;">' + year + '</a></td>';

                year++;

                return html;

            });

        },

        select: function (calender, item) {

            calender.displayValue.setYear(+Dom.getText(item));

            calender.setView(MonthCalender.MonthView);

        },

        parentView: 'decade',

        move: function (calender, delta) {
            calender.displayValue.addMonth(delta * 1200);
        }

    },

    decade: {

        render: function (calender, table, title) {

            var displayValue = calender.displayValue,
                value = this.picker === 'year' && calender.value,
                startYear = Math.floor(displayValue.getFullYear() / 100) * 100 - 10,
                year = startYear;

            // 设置顶部标题。
            title.innerHTML = (startYear + 10) + '-' + (startYear + 109);

            // 设置内容。
            table.className = 'x-calender-decades';
            table.innerHTML = Calender._generateTable(3, 4, function (yearIndex) {

                function compare(date) {
                    return date ? year - Math.floor(date.getFullYear() / 10) * 10 : NaN;
                }

                var html = '<td data-value="' + year + '" class="';

                // 超过日期范围。
                if (compare(calender.min) < 0 || compare(calender.max) > 0) { html += ' x-calender-invalid'; }

                // 当前选中的日期。
                if (compare(value) === 0) { html += ' x-calender-selected'; }

                // 今天。
                if (compare(displayValue) === 0) { html += ' x-calender-actived'; }

                html += yearIndex === 0 || yearIndex === 11 ? ' x-calender-alt">' + year + '-<br>' + (year + 9) + '&nbsp;&nbsp;</td>' : '"><a href="javascript:;">' + year + '-<br>' + (year + 9) + '&nbsp;&nbsp;</a></td>';

                year += 10;

                return html;

            });

        },

        parentView: 'decade',

        select: function (calender, item) {

            calender.displayValue.setYear(+Dom.getAttr(item, 'data-value'));

            calender.setView(MonthCalender.YearView);

        },

        move: function (calender, delta) {
            calender.displayValue = calender.displayValue.addMonth(delta * 12000);
        }
    }

};

Calender.locale = {

    months: "一月 二月 三月 四月 五月 六月 七月 八月 九月 十月 十一月 十二月".split(' '),

    weeks: '日 一 二 三 四 五 六'.split(' '),

    month: 'yyyy年M月',

    today: '今天: yyyy年M月d日',

    now: '现在: yyyy年M月d日 HH时mm分',

    date: 'yyyy/MM/dd',

    time: 'yyyy/MM/dd hh:mm:ss',

    holidays: {
        '1-1': '元旦',
        '3-8': '妇女节',
        '3-12': '植树节',
        '5-1': '劳动节',
        '5-4': '青年节',
        '6-1': '儿童节',
        '9-10': '教师节',
        '10-1': '国庆节'
    }
};
