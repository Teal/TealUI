/**
 * @see https://github.com/joyent/node/blob/master/lib/path.js
 */

/**
 * 判断路径是否为绝对路径。
 * @param path 要判断的路径。
 * @return 如果是绝对路径则返回 true，否则返回 false。
 */
export function isAbsolute(path: string) {
    return path.length > 0 && path.charCodeAt(0) === 47/*/*/;
}

/**
 * 合并多个路径为一个绝对路径。
 * @param paths 要合并的所有路径。
 * @return 返回合并后的新路径。
 * @example resolve("a/b", "../", "c") // "a/c"
 */
export function resolve(...paths: string[]) {
    let resolvedPath = "";
    let resolvedAbsolute = false;

    for (let i = paths.length - 1; i >= 0 && !resolvedAbsolute; i--) {
        const path = paths[i];
        if (path) {
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
        }
    }

    return ((resolvedAbsolute ? "/" : "") + normalizeParts(resolvedPath.split("/"), !resolvedAbsolute).join("/")) || "";
}

/**
 * 计算路径相对于基路径的相对路径。
 * @param basePath 解析的基路径。
 * @param path 路径。
 * @return 返回 *path* 相对于 *basePath* 的基路径。
 * @example relative("a/b", "a/c") // "../c"
 */
export function relative(basePath: string, path: string) {

    basePath = resolve(basePath);
    path = resolve(path);

    const fromParts = trim(basePath.split("/"));
    const toParts = trim(path.split("/"));

    const length = Math.min(fromParts.length, toParts.length);
    let samePartsLength = length;
    for (var i = 0; i < length; i++) {
        if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
        }
    }

    const outputParts: string[] = [];
    for (let i = samePartsLength; i < fromParts.length; i++) {
        outputParts.push("..");
    }

    outputParts.push.apply(outputParts, toParts.slice(samePartsLength));

    return outputParts.join("/");

    function trim(arr: string[]) {
        let start = 0;
        for (; start < arr.length && !arr[start]; start++);

        let end = arr.length - 1;
        for (; end >= 0 && !arr[end]; end--);

        return start > end ? [] : arr.slice(start, end + 1);
    }
}

/**
 * 规范化路径的格式。
 * @param path 路径。
 * @return 返回规范化后的新路径。其中不再包含多余的 . 和 /。
 * @example normalize("a/b/../c/d/e") // "a/c/d/e"
 */
export function normalize(path: string) {
    const isAbsolute = path.charAt(0) === "/";
    const trailingSlash = path.substr(-1) === "/";
    path = normalizeParts(path.split("/"), !isAbsolute).join("/");
    if (!path && !isAbsolute) path = ".";
    if (path && trailingSlash) path += "/";
    return (isAbsolute ? "/" : "") + path;
}

/**
 * 合并多个路径为一个。
 * @param paths 要合并的所有路径。
 * @return 返回合并后的新路径。
 * @example join("a/b/../c/d/e") // "a/c/d/e"
 */
export function join(...paths: string[]) {
    const parts = [];
    for (const path of paths) {
        if (path) parts.push(path);
    }
    return normalize(parts.join("/"));
}

/**
 * 获取路径的文件夹名部分。
 * @param path 路径。
 * @return 返回文件夹部分。
 * @example Path.dirname("e/a/b") // "e/a"
 */
export function dirname(path: string) {
    const parts = splitPath(path);
    const root = parts[1];
    const dir = parts[2];
    return !root && !dir ? "." : root + (dir && dir.substr(0, dir.length - 1));
}

/**
 * 获取路径的文件名部分。
 * @param path 路径。
 * @param ext 如果指定扩展名，则删除对应的扩展名部分。
 * @return 返回文件部分。
 * @example Path.basename("e/a/b.txt") // "b.txt"
 */
export function basename(path: string, ext?: string) {
    const parts = splitPath(path);
    return ext && parts[4] === ext ? parts[3].substr(0, parts[3].length - ext.length) : parts[3];
}

/**
 * 获取路径的扩展名部分（包括点）。
 * @param path 路径。
 * @return 返回扩展名部分（包括点）。
 * @example Path.extname("e/a/b.txt") // ".txt"
 */
export function extname(path: string) {
    return splitPath(path)[4];
}

/**
 * 规范化路径数组。
 * @param parts 路径组成部分。
 * @param allowAboveRoot 是否允许超过根路径。
 * @return 返回规范化后的路径组成部分。
 */
function normalizeParts(parts: string[], allowAboveRoot: boolean) {
    let up = 0;
    for (let i = parts.length - 1; i >= 0; i--) {
        const last = parts[i];
        if (!last || last === ".") {
            parts.splice(i, 1);
        } else if (last === "..") {
            parts.splice(i, 1);
            up++;
        } else if (up) {
            parts.splice(i, 1);
            up--;
        }
    }

    if (allowAboveRoot) {
        while (up--) {
            parts.unshift("..");
        }
    }

    return parts;
}

/**
 * 将文件名分割为数组。
 * @param path 文件名。
 * @return 返回一个数组。其内容分别为根路径、文件夹、文件基础名和扩展名。
 */
function splitPath(path: string) {
    return /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(path)!;
}
