/**
 * 计算两个大正整数的和。
 * @param x 要计算的第一个值。
 * @param y 要计算的第二个值。
 * @return 返回计算的结果。
 * @example add("1", "2") // "3"
 */
export function add(x: string, y: string) {
    const r: number[] = [];
    const m = x.split("").reverse();
    const n = y.split("").reverse();
    let s = 0;
    for (let i = 0; i < x.length || i < y.length; i++) {
        const t = (+m[i] || 0) + (+n[i] || 0) + s;
        r.push(t % 10);
        s = (t / 10) | 0;
    }
    s && r.push(s);
    return r.reverse().join("");
}

/**
 * 计算两个大正整数的积。
 * @param x 要计算的第一个值。
 * @param y 要计算的第二个值。
 * @return 返回计算的结果。
 * @example mul("1", "2") // "2"
 */
export function mul(x: string, y: string) {
    let r = "0";
    const p = x.match(/\d{1,4}/g)!.reverse();
    const q = y.match(/\d{1,4}/g)!.reverse();
    let f1 = 0;
    for (const pi of p) {
        let f2 = 0;
        for (const qi of q) {
            r = add(r, +pi * +qi + new Array(f1 + f2 + 1).join("0"));
            f2 += qi.length;
        }
        f1 += pi.length;
    }
    return r;
}
