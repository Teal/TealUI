/**
 * 渲染一个 EJS（ASP/JSP）模板。
 * @param tpl 模板内容。在模板中使用 `<% ... %>` 插入 JavaScript 语句，使用 `<%= ... %>` 插入 JavaScript 表达式，使用 `$` 表示传入的数据。
 * @param data 传递给模板的数据。
 * @return 返回模板渲染后的结果。
 */
export default function tpl(tpl: string, data: any): any;

/**
 * 编译一个 EJS（ASP/JSP）模板。
 * @param tpl 模板内容。在模板中使用 `<% ... %>` 插入 JavaScript 语句，使用 `<%= ... %>` 插入 JavaScript 表达式，使用 `$` 表示传入的数据。
 * @return 返回编译后的模板函数。函数有以下参数：
 * - data：传递给模板的数据。
 *
 * 函数返回模板渲染后的结果。
 */
export default function tpl(tpl: string): (data: any) => any;

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
