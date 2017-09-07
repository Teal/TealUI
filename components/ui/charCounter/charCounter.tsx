import { Control } from "control";

/**
 * 表示一个文字计数器。
 */
export default class CharCounter extends Control {

    /**
     * 获取或设置最大允许输入的字符数。
     */
    maxLength = 300;

    input: number;

    render() {
        return <span class="x-tip" x-role="charcounter" x-target="#textArea1" x-max-length="300">{input}/{total}</span>;
    }

}
