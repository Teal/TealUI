/**
 * 定义命名空间。
 * @param ns 要创建的命名空间。
 * @return 如果命名空间已存在则返回之前的命名空间，否则返回新创建的命名空间。
 * @example namespace("MyNameSpace.SubNamespace")
 */
export default function namespace(ns: string) {
    const parts = ns.split(".");
    let current = (function (this: any) { return this; })();
    for (const part of parts) {
        current = (current as any)[part] || ((current as any)[part] = {});
    }
    return current;
}
