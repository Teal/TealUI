/**
 * 创建一个计划任务。
 * @param cronExpression 计划时间表达式。
 * @param callback 要执行的任务函数。
 * @param now 服务器下发的当前时间。
 */
export default function crobJob(cronExpression: string, callback: () => void, now = new Date()) {
    const r = new CronJob();
    r.cronExpression = new CronExpression(cronExpression);
    r.callback = callback;
    r.offset = ((now as any) - (new Date() as any)) / 1000;
    r.start();
    return r;
}

/**
 * 表示一个计划任务。
 */
export class CronJob {

    /**
     * 计划时间表达式。
     */
    cronExpression: CronExpression;

    /**
     * 任务回调函数。
     */
    callback: () => void;

    /**
     * 客户端时间与实际时间的误差秒数。
     */
    offset?: number;

    /**
     * 启动当前任务。
     */
    start() {
        if (this._timer) {
            return;
        }
        const now = new Date();
        if (this.offset) {
            now.setSeconds(now.getSeconds() + this.offset);
        }
        now.setMilliseconds(0);
        if (this.cronExpression.match(now)) {
            setTimeout(() => {
                this.callback();
            }, 0);
        }
        const next = this.cronExpression.next(now);
        // 浏览器最大支持延时 2147483647ms，根据实际使用场景，忽略超出情况。
        this._timer = setTimeout(() => {
            setTimeout(() => {
                if (this._timer) {
                    this._timer = 0;
                    this.start();
                }
            }, 1000);
            this.callback();
        }, (next as any) - (now as any));
    }

    /**
     * 停止当前任务。
     */
    stop() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = 0;
        }
    }

    /**
     * 计时器。
     */
    private _timer: any;

}

/**
 * 表示一个计划时间表达式。
 * @see http://www.quartz-scheduler.org/documentation/quartz-2.x/tutorials/crontrigger.html
 */
export class CronExpression {

    /**
     * 秒部分的匹配规则。
     */
    seconds?: CronRule[];

    /**
     * 分部分的匹配规则。
     */
    minutes?: CronRule[];

    /**
     * 小时部分的匹配规则。
     */
    hours?: CronRule[];

    /**
     * 日期部分的匹配规则。
     */
    dayOfMonth?: CronRule[];

    /**
     * 月部分的匹配规则。
     */
    month?: CronRule[];

    /**
     * 星期部分的匹配规则。
     */
    dayOfWeek?: CronRule[];

    /**
     * 年部分的匹配规则。
     */
    year?: CronRule[];

    /**
     * 初始化新的计划时间表达式。
     * @param source 计划时间表达式。
     */
    constructor(source: string) {
        const parts = source.split(" ");
        // 为了兼容 crontab，支持仅 5 个字段时作省略秒处理。
        if (parts.length === 5) parts.unshift("0");
        this.seconds = CronExpression._parseRules(parts[0]);
        this.minutes = CronExpression._parseRules(parts[1]);
        this.hours = CronExpression._parseRules(parts[2]);
        this.dayOfMonth = CronExpression._parseRules(parts[3], 1);
        this.month = CronExpression._parseRules(parts[4] && parts[4].toUpperCase().replace(/[A-Z]{3}/g, word => ({
            JAN: 0,
            FEB: 1,
            MAR: 2,
            APR: 3,
            MAY: 4,
            JUN: 5,
            JUL: 6,
            AUG: 7,
            SEP: 8,
            OCT: 9,
            NOV: 10,
            DEC: 11
        } as any)[word]));
        this.dayOfWeek = CronExpression._parseRules(parts[5] && parts[5].toUpperCase().replace(/[A-Z]{3}/g, word => ({
            SUN: 0,
            MON: 1,
            TUE: 2,
            WED: 3,
            THU: 4,
            FRI: 5,
            SAT: 6
        } as any)[word]));
        this.year = CronExpression._parseRules(parts[6], 1970);
    }

    /**
     * 解析一个规则列表。
     * @param rules 要解析的规则列表。
     * @param start 当前规则开始数值。
     * @return 返回解析结果。
     */
    private static _parseRules(rules: string | undefined, start?: number) {
        if (!rules) {
            return;
        }
        const r: CronRule[] = [];
        for (const rule of rules.split(",")) {
            const match = /^(?:\*?|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/.exec(rule);
            if (match) {
                if (!match[1] && !match[3]) {
                    r.length = 0;
                    break;
                }
                r.push({
                    start: match[1] ? +match[1] : start || 0,
                    end: match[2] ? +match[2] : undefined,
                    step: match[3] ? +match[3] : undefined
                });
            }
        }
        return r;
    }

    /**
     * 获取到指定日期最近的计划时间。
     * @param date 日期。
     * @return 返回最近的日期对象。
     */
    next(date: Date) {
        const value = +date + 1000;
        date = new Date(value - value % 1000);
        while (true) {
            let t: number;
            if (!CronExpression._matchRules(this.year, t = date.getFullYear())) {
                date.setFullYear(t + 1);
                date.setMonth(0);
                date.setDate(1);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                continue;
            }
            if (!CronExpression._matchRules(this.month, t = date.getMonth())) {
                date.setMonth(t + 1);
                date.setDate(1);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                continue;
            }
            const dayOfMonthMismatch = !CronExpression._matchRules(this.dayOfMonth, t = date.getDate());
            const dayOfWeekMismatch = !CronExpression._matchRules(this.dayOfWeek, date.getDay());
            if ((!this.dayOfMonth || this.dayOfMonth.length === 0) && dayOfWeekMismatch || (!this.dayOfWeek || this.dayOfWeek.length === 0) && dayOfMonthMismatch || dayOfMonthMismatch && dayOfWeekMismatch) {
                date.setDate(t + 1);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                continue;
            }
            if (!CronExpression._matchRules(this.hours, t = date.getHours())) {
                date.setHours(t + 1);
                date.setMinutes(0);
                date.setSeconds(0);
                continue;
            }
            if (!CronExpression._matchRules(this.minutes, t = date.getMinutes())) {
                date.setMinutes(t + 1);
                date.setSeconds(0);
                continue;
            }
            if (!CronExpression._matchRules(this.seconds, t = date.getSeconds())) {
                date.setSeconds(t + 1);
                continue;
            }
            break;
        }
        return date;
    }

    /**
     * 测试指定的值是否匹配指定的表达式。
     * @param rules 字段信息。
     * @param value 要验证的数值。
     * @return 如果匹配则返回 true，否则返回 false。
     */
    private static _matchRules(rules: CronRule[] | undefined, value: number) {
        if (!rules || !rules.length) {
            return true;
        }
        for (const rule of rules) {
            if (rule.step! > 1 && (value - rule.start) % rule.step! !== 0) {
                continue;
            }
            if (rule.end == undefined) {
                if (rule.step! >= 1) {
                    if (value >= rule.start) {
                        return true;
                    }
                } else {
                    if (value === rule.start) {
                        return true;
                    }
                }
            } else {
                if (rule.start <= rule.end) {
                    if (value >= rule.start && value <= rule.end) {
                        return true;
                    }
                } else {
                    if (value >= rule.start || value <= rule.end) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 转为等效的字符串。
     * @return 返回字符串。
     */
    toString() {
        return `${CronExpression._formatRules(this.seconds)} ${CronExpression._formatRules(this.minutes)} ${CronExpression._formatRules(this.hours)} ${CronExpression._formatRules(this.dayOfMonth)} ${CronExpression._formatRules(this.month)} ${CronExpression._formatRules(this.dayOfWeek)} ${CronExpression._formatRules(this.year)}`.trim();
    }

    /**
     * 格式化规则为字符串。
     * @param rules 规则。
     * @return 返回字符串。
     */
    private static _formatRules(rules: CronRule[] | undefined) {
        if (!rules) {
            return "";
        }
        if (!rules.length) {
            return "*";
        }
        return rules.map(rule => `${rule.start != undefined ? rule.start : "*"}${rule.end != undefined ? "-" + rule.end : ""}${rule.step != undefined ? "/" + rule.step : ""}`).join(",");
    }

    /**
     * 判断指定的日期是否命中当前计划时间。
     * @param date 日期。
     * @return 如果命中则返回 true，否则返回 false。
     */
    match(date: Date) {
        return CronExpression._matchRules(this.year, date.getFullYear()) &&
            CronExpression._matchRules(this.month, date.getMonth()) &&
            (this.dayOfMonth && this.dayOfMonth.length === 0 ? CronExpression._matchRules(this.dayOfWeek, date.getDay()) : this.dayOfWeek && this.dayOfWeek.length === 0 ? CronExpression._matchRules(this.dayOfMonth, date.getDate()) : CronExpression._matchRules(this.dayOfWeek, date.getDay()) || CronExpression._matchRules(this.dayOfMonth, date.getDate())) &&
            CronExpression._matchRules(this.hours, date.getHours()) &&
            CronExpression._matchRules(this.minutes, date.getMinutes()) &&
            CronExpression._matchRules(this.seconds, date.getSeconds());
    }

}

/**
 * 表示一个计划时间表达式中的一个规则。
 */
export interface CronRule {

    /**
     * 开始数值（含）。
     */
    start: number;

    /**
     * 步长。
     * @default 1
     */
    step?: number;

    /**
     * 结束数值（含）。
     */
    end?: number;

}

/**
 * 判断指定的字符串是否是合法的计划时间表达式。
 * @param value 要判断的字符串。
 * @return 如果合法则返回 true，否则返回 false。
 */
export function isValidCronExpression(value: string) {
    const parts = (value || "").split(" ");
    if (parts.length === 5) parts.unshift("0");
    if (parts.length !== 6 && parts.length !== 7) {
        return false;
    }

    for (let i = 0; i < parts.length; i++) {
        for (let rule of parts[i].split(",")) {
            rule = rule.replace(/^((\/)|\*)/, "1-1$2");
            let re: RegExp;
            switch (i) {
                case 0:
                case 1:
                    re = /^(?:\d|[1-5]\d)(?:-(?:\d|[1-5]\d))?(?:\/(?:[1-9]|[1-5]\d))?$/;
                    break;
                case 2:
                    re = /^(?:\d|1\d|2[0-3])(?:-(?:\d|1\d|2[0-3]))?(?:\/(?:[1-9]|1\d|2[0-3]))?$/;
                    break;
                case 3:
                    rule = rule.replace("?", "1-1");
                    re = /^(?:[1-9]|[12]\d|3[01])(?:-(?:[1-9]|[12]\d|3[01]))?(?:\/(?:[1-9]|[12]\d|3[01]))?$/;
                    break;
                case 4:
                    rule = rule.replace(/(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)/ig, "1");
                    re = /^(?:\d|1[01])(?:-(?:\d|1[01]))?(?:\/(?:[1-9]|1[01]))?$/;
                    break;
                case 5:
                    rule = rule.replace("?", "1-1").replace(/(?:SUN|MON|TUE|WED|THU|FRI|SAT)/ig, "1");
                    re = /^[0-6](?:-[0-6])?(?:\/[0-6])?$/;
                    break;
                default:
                    re = /^\d{4}(?:-\d{4})?(?:\/[1-9]\d*)?$/;
                    break;
            }
            if (!re.test(rule)) {
                return false;
            }
        }
    }
    return true;
}
