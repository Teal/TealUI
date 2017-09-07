/**
 * 渲染一个 EJS 模板。
 * @param tpl 模板内容。
 * @param data 传入给模板的数据。
 * @return 如果提供了数据，则返回执行后的结果。否则返回编译后的模板函数。
 */
export default function tpl(tpl: string, data?: any) {
    let end = "";
    tpl = `var $output="",$t${(`%>${tpl}<%`).replace(/%>([\s\S]*?)<%(=?)/g, (all, content: string, eq?: string) => {
        all = `${end};${content ? `$output+=${JSON.stringify(content)};` : ""}`;
        if (eq) {
            all += `$t =(`;
            end = ");if($t!=null)$output+=$t";
        } else {
            end = "";
        }
        return all;
    })}`;
    const func = new Function("$", `${tpl}${end}return $output`);
    if (data === undefined) {
        return func;
    }
    return func.call(data, data);
}
