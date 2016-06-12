
export namespace JSON {

    /**
     * 解码指定的 JSON 字符串，支持非标准语法和注释。
     * @param value 要解码的字符串。
     * @return 返回 JSON 对象。
     */
    export function decode(value: string) {
        return new Function('return (' + value + ")")();
    }

}
