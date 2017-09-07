import { getPinYinOfChar } from "util/pinyin";
import { encodeHTML } from "util/html";

/**
 * 搜索列表中匹配的项。
 * @param inputs 输入的项。
 * @param search 搜索的内容。
 * @param markStart 标记匹配开始的符号。
 * @param markEnd 标记匹配结束的符号。
 * @param encoder 编码内容的回调函数。
 * @param cache 提供缓存对象加速第二次解析。
 * @return 返回搜索的结果。
 */
export default function searchPinYin(inputs: string[], search: string, markStart = "<mark>", markEnd = "</mark>", encoder = encodeHTML, cache: { [key: string]: any } = { __proto__: null }) {
    search = search.trim().toLowerCase();
    const result: (Match[] & { html: string, index: number })[] = [];
    for (let i = 0; i < inputs.length; i++) {
        const m = matchPinYin(inputs[i], search, cache) as typeof result[0];
        if (m.length) {
            m.index = i;
            m.html = toHtml(inputs[i], m, markStart, markEnd, encoder);
            result.push(m);
        }
    }
    result.sort(compare);
    return result;
}

/**
 * 匹配拼音。
 * @param input 输入的内容。
 * @param pattern 匹配的内容。
 * @param cache 提供缓存对象加速第二次解析。
 * @return 返回所有匹配项数组。如果不匹配则返回空数组。
 */
export function matchPinYin(input: string, pattern: string, cache: { [key: string]: any } = { __proto__: null }) {
    let info = cache[input];
    if (!info) {
        cache[input] = info = {
            chars: [],
            pinyins: []
        };
        input = input.toLowerCase();
        for (let i = 0; i < input.length; i++) {
            info.chars.push(input.charCodeAt(i));
            info.pinyins.push(getPinYinOfChar(input.charAt(i)));
        }
    }

    const result = [] as Match[];
    next: for (let i = 0; i < info.chars.length; i++) {
        let charIndex = i;
        let patternIndex = 0;
        let level = 0;
        while (patternIndex < pattern.length) {
            if (charIndex >= info.chars.length) {
                continue next;
            }
            if (info.chars[charIndex] === pattern.charCodeAt(patternIndex)) {
                patternIndex++;
                level++;
            } else {
                let matchCount: number | undefined;
                for (const pinyin of info.pinyins[charIndex]) {
                    matchCount = searchStart(pinyin, pattern, patternIndex);
                    if (matchCount) {
                        patternIndex += matchCount;
                        break;
                    }
                }
                if (!matchCount) {
                    continue next;
                }
            }
            charIndex++;
        }
        result.push({ level: level, start: i, end: charIndex });
        i = charIndex;
    }
    return result;
}

/**
 * 搜索字符串中以指定字符开始的连续字符数。
 * @param value 要搜索的字符串。
 * @param child 要搜索的子字符串。
 * @param childIndex *child* 中开始搜索的索引。
 * @return 返回最大匹配的字符数。如果无匹配则返回 0。
 */
export function searchStart(value: string, child: string, childIndex: number) {
    let result = 0;
    while (result < value.length && childIndex + result < child.length && value.charCodeAt(result) === child.charCodeAt(childIndex + result)) {
        result++;
    }
    return result;
}

/**
 * 表示一个匹配项。
 */
export interface Match {

    /**
     * 匹配度。
     */
    level: number;

    /**
     * 匹配的开始索引。
     */
    start: number;

    /**
     * 匹配的结束索引。
     */
    end: number;

}

/**
 * 比较两个匹配结果。
 * @param result1 要比较的第一个结果。
 * @param result2 要比较的第二个结果。
 * @return 如果 result1 更匹配则返回 -1，如果 result2 更匹配则返回 1，如果 result1 和 result2 匹配度相当则返回 0。
 */
function compare(result1: Match[], result2: Match[]) {
    if (result1.length && result2.length && result1[0].start !== result2[0].start) {
        return result2[0].end - result1[0].end;
    }
    return result2.length - result1.length;
}

/**
 * 根据匹配的结果获取输入高亮后的 HTML 代码。
 * @param input 输入的内容。
 * @param matchResult 匹配的结果。
 * @param markStart 标记匹配开始的符号。
 * @param markEnd 标记匹配结束的符号。
 * @param encoder 编码内容的回调函数。
 * @return 返回 HTML 片段。
 */
export function toHtml(input: string, matchResult: Match[], markStart = "<mark>", markEnd = "</mark>", encoder = encodeHTML) {
    for (let i = matchResult.length; i-- > 0;) {
        const match = matchResult[i];
        input = encoder(input.slice(0, match.start)) + markStart + encoder(input.slice(match.start, match.end)) + markEnd + (i === matchResult.length - 1 ? encoder(input.slice(match.end)) : input.slice(match.end));
    }
    return input;
}
