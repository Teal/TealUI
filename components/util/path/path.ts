/**
 * @see https://github.com/joyent/node/blob/master/lib/path.js
 */

/**
 * 判断指定的路径是否为绝对路径。
 * @param path 判断的路径。
 * @return 如果是绝对路径则返回 true，否则返回 false。
 */
export function isAbsolute(path: string) {
    return path.length > 0 && path.charCodeAt(0) === 47/*/*/;
}

/**
 * 合并多个路径为一个。
 * @param paths 要合并的路径。
 * @return 返回合并后的新路径。
 * @example Path.resolve("a/b", "../", "c") // "a/c"
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

    return ((resolvedAbsolute ? "/" : "") + normalizeArray(resolvedPath.split("/"), !resolvedAbsolute).join("/")) || ".";
}

/**
 * 计算指定路径相对于基路径的相对路径。
 * @param basePath 解析的基路径。
 * @param path 要处理的路径。
 * @return 返回 *path* 相对于 *basePath* 的基路径。
 * @example Path.relative("a/b", "a/c") // "../c"
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
 * 规划化指定的路径。
 * @param path 要处理的路径。
 * @return 返回处理后的新路径。
 * @example Path.normalize("a/b/../c/d/e") // "a/c/d/e"
 */
export function normalize(path: string) {
    const isAbsolute = path.charAt(0) === "/";
    const trailingSlash = path.substr(-1) === "/";
    path = normalizeArray(path.split("/"), !isAbsolute).join("/");
    if (!path && !isAbsolute) path = ".";
    if (path && trailingSlash) path += "/";
    return (isAbsolute ? "/" : "") + path;
}

/**
 * 合并多个文件夹路径为一个。
 * @param paths 要处理的文件夹路径。
 * @return 返回合并后的新路径。
 * @example Path.join("a/b/../c/d/e") // "a/c/d/e"
 */
export function join(...paths: string[]) {
    const parts = [];
    for (const path of paths) {
        if (path) parts.push(path);
    }
    return normalize(parts.join("/"));
}

/**
 * 获取指定路径的文件夹名部分。
 * @param path 要处理的路径。
 * @return 返回文件夹部分。
 * @example Path.dirname("e/a/b") // "e/a"
 */
export function dirname(path: string) {
    const parts = splitPath(path);
    const root = parts[0];
    const dir = parts[1];
    return !root && !dir ? "." : root + (dir && dir.substr(0, dir.length - 1));
}

/**
 * 获取指定路径的文件名部分。
 * @param path 要处理的路径。
 * @param ext 如果指定扩展名，则删除对应的扩展名部分。
 * @return 返回文件部分。
 * @example Path.basename("e/a/b.txt") // "b.txt"
 */
export function basename(path: string, ext?: string) {
    const parts = splitPath(path);
    return ext && parts[3] === ext ? parts[2].substr(0, parts[2].length - ext.length) : parts[2];
}

/**
 * 获取指定路径的扩展名部分（包括点）。
 * @param path 要处理的路径。
 * @return 返回扩展名部分。
 * @example Path.extname("e/a/b.txt") // ".txt"
 */
export function extname(path: string) {
    return splitPath(path)[3];
}

/**
 * 规范化路径数组部分。
 * @param parts 各路径部分。
 * @param allowAboveRoot 是否允许超过基路径。
 */
function normalizeArray(parts: string[], allowAboveRoot: boolean) {
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
 * @param path 要处理的文件名。
 * @return 返回一个数组。其内容分别标识跟路径、文件夹、文件基础名和扩展名。
 */
function splitPath(path: string) {
    return /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(path)!.slice(1);
}
