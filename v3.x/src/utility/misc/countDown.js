/**
 * @author xuld
 */

/**
 * 从指定时刻到指定时刻进行倒计时。
 * @param {Date} [startDate] 开始倒计时的时间。如果省略则从当前时间开始倒计时。
 * @param {Date} endDate 结束倒计时的时间。
 * @param {Function} callback 每秒倒计时的回调。函数的参数依次为:function(day, hour, minute, second, leftTime)
 * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
 *
 * * @param {Number} day 应该显示的天数。
 * * @param {Number} hour 应该显示的小时数。
 * * @param {Number} minute 应该显示的分数。
 * * @param {Number} second 应该显示的秒数。
 * * @param {Number} leftTime 剩下的总秒数。
 * 
 * @returns {Number} 返回一个计时器，可以通过 clearInterval(返回值) 停止倒计时。
 * @example countDown(new Date('2020/1/1'), function (day, hour, minute, second, leftTime){ console.log(day, hour, minute, second); })
 */
function countDown(startDate, endDate, callback) {

    // 填充第一个参数。
    if (!callback) {
        callback = endDate;
        endDate = startDate;
        startDate = 0;
    }

    typeof console === "object" && console.assert(callback instanceof Function, "countDown([startDate], endDate, callback: 必须是函数)");
    var startDateOffset = startDate ? (new Date() - (startDate instanceof Date ? startDate : new Date(startDate))) : 0;
    endDate = +(endDate instanceof Date ? endDate : new Date(endDate));

    function step() {
        var leftTime = endDate - new Date() + startDateOffset;
        if (leftTime <= 0) return callback(0, 0, 0, 0, 0);

        var t = Math.floor(leftTime / 1000),
            day = Math.floor(t / 86400),
            hour = Math.floor((t -= day * 86400) / 3600),
            minute = Math.floor((t -= hour * 3600) / 60),
            second = Math.floor(t - minute * 60);
        callback(day, hour, minute, second, leftTime);
    }

    step();

    return setInterval(step, 1000);
}
