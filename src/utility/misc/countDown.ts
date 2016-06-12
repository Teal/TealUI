// #todo

/**
 * @fileOverview 倒计时。
 * @author xuld@vip.qq.com
 */

/**
 * 从指定时刻到指定时刻进行倒计时。
 * @param startDate 开始倒计时的时间。如果省略则从当前时间开始倒计时。
 * @param endDate 结束倒计时的时间。
 * @param callback 每秒倒计时的回调。函数的参数依次为: 
 *      @param day 应该显示的天数。
 *      @param hour 应该显示的小时数。
 *      @param minute 应该显示的分数。
 *      @param second 应该显示的秒数。
 *      @param leftTime 剩下的总秒数。
 * @returns 返回一个计时器，可以通过 clearInterval(返回值) 停止倒计时。
 * @example countDown(new Date('2020/1/1'), function (day, hour, minute, second, leftTime){ console.log(day, hour, minute, second); })
 */
export declare function countDown(endDate: Date, callback: (day: number, hour: number, minute: number, second: number, totalSenconds: number) => void);
export declare function countDown(startDate: Date, endDate: Date, callback: (day: number, hour: number, minute: number, second: number, totalSenconds: number) => void);
export function countDown(startDate: Date, endDate: Date | ((day: number, hour: number, minute: number, second: number, totalSenconds: number) => void), callback?: (day: number, hour: number, minute: number, second: number, totalSenconds: number) => void) {

    // 填充第一个参数。
    if (!callback) {
        callback = endDate as (day: number, hour: number, minute: number, second: number, totalSenconds: number) => void;
        endDate = startDate as Date;
        startDate = 0 as any;
    }

    var startDateOffset = startDate ? (new Date() - (startDate instanceof Date ? startDate : new Date(startDate))) : 0;
    endDate = +(endDate instanceof Date ? endDate : new Date(endDate));

    step();

    return setInterval(step, 1000);

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

}
