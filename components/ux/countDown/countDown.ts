/**
 * 执行倒计时。
 * @param end 倒计时的结束时间。
 * @param callback 每隔一秒执行的回调函数，可以用于更新界面。函数的参数依次为:
 * - days：需要显示的剩余天数。
 * - hours：需要显示的剩余小时数。
 * - minutes：需要显示的剩余分数。
 * - seconds：需要显示的剩余秒数。
 * - total：剩余总秒数。
 * @param now 当前时间。可以由服务器下发以避免用户设置时间的误差。
 * @return 返回一个计时器，可以通过 `clearInterval()` 停止倒计时。
 * @example countDown(new Date("2020/1/1"), (day, hour, minute, second) => console.log(day, hour, minute, second))
 */
export default function countDown(end: Date, callback: (days: string, hours: string, minutes: string, seconds: string, total: number) => void | boolean, now = new Date()) {
    return count(end, callback, now);
}

/**
 * 执行正计时。
 * @param end 开始计时的时间。
 * @param callback 每隔一秒执行的回调函数，可以用于更新界面。函数的参数依次为:
 * - years：需要显示的总年数。
 * - days：需要显示的总天数。
 * - hours：需要显示的总小时数。
 * - minutes：需要显示的总分数。
 * - seconds：需要显示的总秒数。
 * - total：已经过的总秒数。
 * @param now 当前时间。可以由服务器下发以避免用户设置时间的误差。
 * @return 返回一个计时器，可以通过 `clearInterval()` 停止倒计时。
 * @example countUp(new Date("2011/8/12"), (years, day, hour, minute, second) => console.log(years, day, hour, minute, second))
 */
export function countUp(start: Date, callback: (years: string, days: string, hours: string, minutes: string, seconds: number, total: number) => void | boolean, now = new Date()) {
    const oldYear = start.getFullYear();
    let year = now.getFullYear();
    start = new Date(+start);
    start.setFullYear(year);
    if (start > now) {
        start.setFullYear(--year);
    }
    return count(start, callback, now, year - oldYear + "");
}

function count(start: Date, callback: Function, now: Date, years?: string) {
    const offset = (new Date() as any) - (now as any) + +start;
    const step = () => {
        let total = Math.floor((offset - (new Date() as any)) / 1000);
        if (total <= 0) {
            if (!years) {
                callback("00", "00", "00", "00", total);
                return;
            }
            total = -total;
        }
        let t = total;
        const days = Math.floor(t / 86400);
        const hours = Math.floor((t -= days * 86400) / 3600);
        const minutes = Math.floor((t -= hours * 3600) / 60);
        const seconds = Math.floor(t - minutes * 60);
        if (years) {
            callback(years, days < 100 ? "0" + format(days) : "" + days, format(hours), format(minutes), format(seconds), total);
        } else {
            callback(format(days), format(hours), format(minutes), format(seconds), total);
        }
    };
    step();
    return setInterval(step, 1000);
}

function format(num: number) {
    return (num < 10 ? "0" : "") + num;
}
