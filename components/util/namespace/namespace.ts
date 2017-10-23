/**
 * 定义一个命名空间。
 * @param namespace 要定义的命名空间，多个名称用点分隔，如 `"MyNameSpace.SubNamespace"`。
 * @return 如果命名空间已存在则直接返回，否则返回新创建的命名空间。
 * @example namespace("MyNameSpace.SubNamespace")
 */
export default function namespace(namespace: string) {
    const parts = namespace.split(".");
    let current = (function (this: any) { return this; })();
    for (const part of parts) {
        current = current[part] || (current[part] = {});
    }
    return current;
}
