/**
 * @fileOverview 格式化时间为: N 天前|N 分前|刚刚 格式。
 * @author xuld
 */

/**
 * 格式化时间为 **刚刚/N 秒(分钟/小时/天)前** 格式。
 * @param {Date} date 要格式化的日期。
 * @param {Date} [now=new Date] 指定当前时间。
 * @returns {String} 返回时间字符串。如果时间在 5 秒内，返回刚刚，否则返回 N 秒(分钟/小时/天)前 格式。
 * @example formatTime(new Date())
 */
function formatTime(date, now) {
    var timeOffset = Math.round(((now || new Date()) - date) / 1000),
		mf = Math.floor,
		date;

    return timeOffset > 86400 * 4 || timeOffset < 0 ? date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日' :
        (date = mf(timeOffset / 86400)) !== 0 ? date + '天前' :
		(date = mf(timeOffset / 3600 % 24)) !== 0 ? date + '小时前' :
		(date = mf(timeOffset / 60 % 60)) !== 0 ? date + '分钟前' :
		(date = mf(timeOffset % 60)) > 4 ? date + '秒前' : '刚刚';
}
