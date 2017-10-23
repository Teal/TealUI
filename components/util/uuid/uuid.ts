/**
 * 随机生成新的通用唯一识别码（UUID）。
 * @return 返回全小写的 UUID。
 */
export default function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const v = Math.random() * 16 | 0;
        return (c == "x" ? v : (v & 0x3 | 0x8)).toString(16);
    });
}
