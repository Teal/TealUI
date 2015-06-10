/**
 * @fileOverview 格式化时间为: N 天前|N 分前|刚刚 格式。
 * @author xuld
 */

/**
 * 格式化时间为 N 天前格式。
 * @param {Date/String} 要格式化的时间。
 * @param {now} 当前时间。
 * @returns {String} 返回时间字符串。
 */
function formatTime(date, now) {
    var timeOffset = Math.round(((now || new Date()) - date) / 1000),
		mf = Math.floor,
		date;

    return timeOffset > 86400 * 4 || timeOffset < 0 ? date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日' :
        (date = mf(timeOffset / 86400)) !== 0 ? date + '天前' :
		(date = mf(timeOffset / 3600 % 24)) !== 0 ? date + '小时前' :
		(date = mf(timeOffset / 60 % 60)) !== 0 ? date + '分前' :
		(date = mf(timeOffset % 60)) > 4 ? date + '秒前' : '刚刚';
}
