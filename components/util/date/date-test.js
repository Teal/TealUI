define(["require", "exports", "assert", "./date"], function (require, exports, assert, date) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function formatTest() {
        assert.strictEqual(date.format(new Date("2016/01/01 00:00:00")), "2016/01/01 00:00:00");
        assert.strictEqual(date.format(new Date("2016/01/01 00:00:00"), "yyyyMMdd"), "20160101");
    }
    exports.formatTest = formatTest;
    function parseTest() {
        assert.strictEqual(+date.parse("2014-1-1"), +new Date("2014/1/1"));
        assert.strictEqual(+date.parse("20140101"), +new Date("2014/1/1"));
        assert.strictEqual(+date.parse("2014年1月1日", "yyyy年MM月dd日"), +new Date("2014/1/1"));
    }
    exports.parseTest = parseTest;
    function cloneTest() {
        assert.strictEqual(+date.clone(new Date("2014/1/1")), +new Date("2014/1/1"));
    }
    exports.cloneTest = cloneTest;
    function addYearTest() {
        assert.strictEqual(+date.addYear(new Date("2014/1/1"), 1), +new Date("2015/1/1"));
    }
    exports.addYearTest = addYearTest;
    function addMonthTest() {
        assert.strictEqual(+date.addMonth(new Date("2014/1/1"), 1), +new Date("2014/2/1"));
    }
    exports.addMonthTest = addMonthTest;
    function addWeekTest() {
        assert.strictEqual(+date.addWeek(new Date("2014/1/1"), 1), +new Date("2014/1/8"));
    }
    exports.addWeekTest = addWeekTest;
    function addDayTest() {
        assert.strictEqual(+date.addDay(new Date("2014/1/1"), 1), +new Date("2014/1/2"));
    }
    exports.addDayTest = addDayTest;
    function addHoursTest() {
        assert.strictEqual(+date.addHours(new Date("2014/1/1"), 1), +new Date("2014/1/1 01:00:00"));
    }
    exports.addHoursTest = addHoursTest;
    function addMinutesTest() {
        assert.strictEqual(+date.addMinutes(new Date("2014/1/1"), 1), +new Date("2014/1/1 00:01:00"));
    }
    exports.addMinutesTest = addMinutesTest;
    function addSecondsTest() {
        assert.strictEqual(+date.addSeconds(new Date("2014/1/1"), 1), +new Date("2014/1/1 00:00:01"));
    }
    exports.addSecondsTest = addSecondsTest;
    function addMillisecondsTest() {
        assert.strictEqual(+date.addMilliseconds(new Date("2014/1/1"), 1000), +new Date("2014/1/1 00:00:01"));
    }
    exports.addMillisecondsTest = addMillisecondsTest;
    function toDayTest() {
        assert.strictEqual(+date.toDay(new Date("2014/1/1 12:00:00")), +new Date("2014/1/1"));
    }
    exports.toDayTest = toDayTest;
    function toFirstDayTest() {
        assert.strictEqual(+date.toFirstDay(new Date("2016/2/15")), +new Date("2016/2/1"));
    }
    exports.toFirstDayTest = toFirstDayTest;
    function toLastDayTest() {
        assert.strictEqual(+date.toLastDay(new Date("2016/2/15")), +new Date("2016/2/29"));
    }
    exports.toLastDayTest = toLastDayTest;
    function getTimezoneTest() {
        assert.strictEqual(date.getTimezone(new Date("Fri Feb 17 2017 16:54:41 GMT+0800")), "GMT");
    }
    exports.getTimezoneTest = getTimezoneTest;
    function getWeekTest() {
        assert.strictEqual(date.getWeek(new Date("2014/1/15")), 3);
        assert.strictEqual(date.getWeek(new Date("2014/1/15"), new Date("2014/1/1")), 3);
    }
    exports.getWeekTest = getWeekTest;
    function compareYearTest() {
        assert.strictEqual(date.compareYear(new Date(2014, 1, 2), new Date(2013, 1, 1)), 1);
    }
    exports.compareYearTest = compareYearTest;
    function compareDayTest() {
        assert.strictEqual(date.compareDay(new Date(2014, 1, 2), new Date(2014, 1, 1)), 1);
    }
    exports.compareDayTest = compareDayTest;
    function dayLeftTest() {
        assert.strictEqual(date.dayLeft(new Date("2014/12/3"), 12, 5), 2);
        assert.strictEqual(date.dayLeft(new Date("2014/12/4"), 12, 5), 1);
        assert.strictEqual(date.dayLeft(new Date("2014/12/5"), 12, 5), 0);
        assert.strictEqual(date.dayLeft(new Date("2014/12/6"), 12, 5), 364);
    }
    exports.dayLeftTest = dayLeftTest;
    function isValidTest() {
        assert.strictEqual(date.isValid(2004, 2, 29), true);
    }
    exports.isValidTest = isValidTest;
    function isLeapYearTest() {
        assert.strictEqual(date.isLeapYear(2004), true);
        assert.strictEqual(date.isLeapYear(2000), true);
        assert.strictEqual(date.isLeapYear(2100), false);
        assert.strictEqual(date.isLeapYear(2002), false);
    }
    exports.isLeapYearTest = isLeapYearTest;
    function getDayInMonthTest() {
        assert.strictEqual(date.getDayInMonth(2001, 1), 31);
        assert.strictEqual(date.getDayInMonth(2001, 2), 28);
        assert.strictEqual(date.getDayInMonth(2004, 2), 29);
    }
    exports.getDayInMonthTest = getDayInMonthTest;
});
//# sourceMappingURL=date-test.js.map