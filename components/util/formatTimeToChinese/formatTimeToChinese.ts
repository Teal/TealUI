/**
 * 格式化时间为 **刚刚/N 秒(分钟/小时/天)前** 格式。
 * @param date 要格式化的日期。
 * @param now 指定当前时间。
 * @return 返回时间字符串。如果时间在 5 秒内，返回刚刚，否则返回 N 秒(分钟/小时/天)前 格式。
 * @example formatTimeToChinese(new Date())
 */
export default function formatTimeToChinese(date: Date, now = new Date()) {
    const timeOffset = Math.round(((now as any) - (date as any)) / 1000);
    let t: number;
    return timeOffset > 86400 * 4 || timeOffset < 0 ? date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" :
        (t = Math.floor(timeOffset / 86400)) !== 0 ? t + "天前" :
            (t = Math.floor(timeOffset / 3600 % 24)) !== 0 ? t + "小时前" :
                (t = Math.floor(timeOffset / 60 % 60)) !== 0 ? t + "分钟前" :
                    (t = Math.floor(timeOffset % 60)) > 4 ? t + "秒前" : "刚刚";
}
