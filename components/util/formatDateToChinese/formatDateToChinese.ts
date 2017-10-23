/**
 * 格式化时间为中文可读格式（如“3 分钟前”）。
 * @param date 要格式化的日期对象。
 * @param now 当前时间。
 * @return 根据指定的时间与当前时间的差距，返回以下格式之一：“刚刚”、“N 秒前”、“N 分钟前”、“N 小时前”、“昨天”、“N 天前”、“N月N日”或“N年N月N日”。
 * @example formatDateToChinese(new Date("2000/1/1"), new Date("2000/1/2")) // "昨天"
 * @example formatDateToChinese(new Date("2000/1/1"), new Date("2000/1/3")) // "2 天前"
 */
export default function formatDateToChinese(date: Date, now = new Date()) {
    if (now >= date && date.getFullYear() === now.getFullYear()) {
        if (date.getMonth() === now.getMonth()) {
            const delta = Math.floor(((now as any) - (date as any)) / 1000);
            if (delta < 1) {
                return `刚刚`;
            }
            if (delta < 60) {
                return `${delta}秒前`;
            }
            if (delta < 60 * 60) {
                return `${Math.floor(delta / 60)}分钟前`;
            }
            if (delta < 60 * 60 * 24) {
                return `${Math.floor(delta / (60 * 60))}小时前`;
            }
            if (delta < 60 * 60 * 24 * 2) {
                return `昨天`;
            }
            return `${Math.floor(delta / (60 * 60 * 24))}天前`;
        }
        return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
