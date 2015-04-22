/** * @author xuld *//**
 * 从指定时刻到指定时刻进行倒计时。
 * @param {Date/String} startDate? 开始倒计时的时间。如果省略则从当前时间开始倒计时。
 * @param {Date/String} endDate 结束倒计时的时间。
 * @param {Function} callback 每秒倒计时的回调。function(day, hour, minute, second, leftTime)
 * @return {Number} 返回一个计时器，可以通过 clearInterval(返回值) 停止倒计时。
 */function countDown(startDate, endDate, callback) {

    function step() {
        var leftTime = endDate - new Date() + startDateOffset;
        if (leftTime <= 0) {
            callback(0, 0, 0, 0, 0);            return;
        }
        var second = Math.floor(leftTime / 1000),			t = second,			day = Math.floor(second / 86400),			hour = Math.floor((t -= day * 86400) / 3600),			minute = Math.floor((t -= hour * 3600) / 60);        callback(day, hour, minute, Math.floor(t - minute * 60), second);
    }

    // 填充第一个参数。
    if (!callback) {
        callback = endDate;
        endDate = startDate;
        startDate = 0;
    }

    var startDateOffset = startDate ? (new Date() - (startDate instanceof Date ? startDate : new Date(startDate))) : 0;
    endDate = +(endDate instanceof Date ? endDate : new Date(endDate));

    step();

    return setInterval(step, 1000);
}