
interface Date {

    /**
     * 在当前日期添加指定的月数并返回新日期。
     * @param value 要添加的月数。如果小于 0 则倒数指定月数。
     * @returns 返回新日期对象。
     * @example new Date().addMonth(1)
     * @remark > 注意：“3月31日”加 1 月为“4月30日”，再加 1 月为“5月30日”。“3月31日”加 2 月为“5月31日”。
     */
    addMonth(value: number): Date;

}

/**
 * 在当前日期添加指定的月数并返回新日期。
 * @param value 要添加的月数。如果小于 0 则倒数指定月数。
 * @returns 返回新日期对象。
 * @example new Date().addMonth(1)
 * @remark > 注意：“3月31日”加 1 月为“4月30日”，再加 1 月为“5月30日”。“3月31日”加 2 月为“5月31日”。
 */
Date.prototype.addMonth = function (value: number) {
    var date = new Date(+this);
    date.setMonth(date.getMonth() + value);
    if (this.getDate() !== date.getDate()) date.setDate(0);
    return date;
};
