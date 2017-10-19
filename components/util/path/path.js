/**
 * @see https://github.com/joyent/node/blob/master/lib/path.js
 */
define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 判断路径是否为绝对路径。
     * @param path 要判断的路径。
     * @return 如果是绝对路径则返回 true，否则返回 false。
     */
    function isAbsolute(path) {
        return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
    }
    exports.isAbsolute = isAbsolute;
    /**
     * 合并多个路径为一个绝对路径。
     * @param paths 要合并的所有路径。
     * @return 返回合并后的新路径。
     * @example resolve("a/b", "../", "c") // "a/c"
     */
    function resolve() {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        var resolvedPath = "";
        var resolvedAbsolute = false;
        for (var i = paths.length - 1; i >= 0 && !resolvedAbsolute; i--) {
            var path = paths[i];
            if (path) {
                resolvedPath = path + "/" + resolvedPath;
                resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
            }
        }
        return ((resolvedAbsolute ? "/" : "") + normalizeParts(resolvedPath.split("/"), !resolvedAbsolute).join("/")) || "";
    }
    exports.resolve = resolve;
    /**
     * 计算路径相对于基路径的相对路径。
     * @param basePath 解析的基路径。
     * @param path 路径。
     * @return 返回 *path* 相对于 *basePath* 的基路径。
     * @example relative("a/b", "a/c") // "../c"
     */
    function relative(basePath, path) {
        basePath = resolve(basePath);
        path = resolve(path);
        var fromParts = trim(basePath.split("/"));
        var toParts = trim(path.split("/"));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break;
            }
        }
        var outputParts = [];
        for (var i_1 = samePartsLength; i_1 < fromParts.length; i_1++) {
            outputParts.push("..");
        }
        outputParts.push.apply(outputParts, toParts.slice(samePartsLength));
        return outputParts.join("/");
        function trim(arr) {
            var start = 0;
            for (; start < arr.length && !arr[start]; start++)
                ;
            var end = arr.length - 1;
            for (; end >= 0 && !arr[end]; end--)
                ;
            return start > end ? [] : arr.slice(start, end + 1);
        }
    }
    exports.relative = relative;
    /**
     * 规范化路径的格式。
     * @param path 路径。
     * @return 返回规范化后的新路径。其中不再包含多余的 . 和 /。
     * @example normalize("a/b/../c/d/e") // "a/c/d/e"
     */
    function normalize(path) {
        var isAbsolute = path.charAt(0) === "/";
        var trailingSlash = path.substr(-1) === "/";
        path = normalizeParts(path.split("/"), !isAbsolute).join("/");
        if (!path && !isAbsolute)
            path = ".";
        if (path && trailingSlash)
            path += "/";
        return (isAbsolute ? "/" : "") + path;
    }
    exports.normalize = normalize;
    /**
     * 合并多个路径为一个。
     * @param paths 要合并的所有路径。
     * @return 返回合并后的新路径。
     * @example join("a/b/../c/d/e") // "a/c/d/e"
     */
    function join() {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        var parts = [];
        for (var _a = 0, paths_1 = paths; _a < paths_1.length; _a++) {
            var path = paths_1[_a];
            if (path)
                parts.push(path);
        }
        return normalize(parts.join("/"));
    }
    exports.join = join;
    /**
     * 获取路径的文件夹名部分。
     * @param path 路径。
     * @return 返回文件夹部分。
     * @example Path.dirname("e/a/b") // "e/a"
     */
    function dirname(path) {
        var parts = splitPath(path);
        var root = parts[1];
        var dir = parts[2];
        return !root && !dir ? "." : root + (dir && dir.substr(0, dir.length - 1));
    }
    exports.dirname = dirname;
    /**
     * 获取路径的文件名部分。
     * @param path 路径。
     * @param ext 如果指定扩展名，则删除对应的扩展名部分。
     * @return 返回文件部分。
     * @example Path.basename("e/a/b.txt") // "b.txt"
     */
    function basename(path, ext) {
        var parts = splitPath(path);
        return ext && parts[4] === ext ? parts[3].substr(0, parts[3].length - ext.length) : parts[3];
    }
    exports.basename = basename;
    /**
     * 获取路径的扩展名部分（包括点）。
     * @param path 路径。
     * @return 返回扩展名部分（包括点）。
     * @example Path.extname("e/a/b.txt") // ".txt"
     */
    function extname(path) {
        return splitPath(path)[4];
    }
    exports.extname = extname;
    /**
     * 规范化路径数组。
     * @param parts 路径组成部分。
     * @param allowAboveRoot 是否允许超过根路径。
     * @return 返回规范化后的路径组成部分。
     */
    function normalizeParts(parts, allowAboveRoot) {
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (!last || last === ".") {
                parts.splice(i, 1);
            }
            else if (last === "..") {
                parts.splice(i, 1);
                up++;
            }
            else if (up) {
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
    function splitPath(path) {
        return /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(path);
    }
});
//# sourceMappingURL=path.js.map