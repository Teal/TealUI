/**
 * @author xuld
 * Modified from https://github.com/joyent/node/blob/master/lib/path.js
 */

/**
 * 提供路径解析相关的函数。
 */
var Path = {

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	_normalizeArray: function (parts, allowAboveRoot) {
		// if the path tries to go above the root, `up` ends up > 0
		var up = 0;
		for (var i = parts.length - 1; i >= 0; i--) {
			var last = parts[i];
			if (last === '.') {
				parts.splice(i, 1);
			} else if (last === '..') {
				parts.splice(i, 1);
				up++;
			} else if (up) {
				parts.splice(i, 1);
				up--;
			}
		}

		// if the path is allowed to go above the root, restore leading ..s
		if (allowAboveRoot) {
			for (; up--; up) {
				parts.unshift('..');
			}
		}

		return parts;
	},

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	_splitPath: function(filename) {
		return /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(filename).slice(1);
	},

	basePath: "",

    /**
     * 合并多个路径为一个。
     * @param {String} ... 要合并的路径。
     * @returns {String} 返回合并后的新路径。
     * @example Path.resolve("a/b", "../", "c") // "a/c"
     */
	resolve: function () {
	    var resolvedPath = '';
		var resolvedAbsolute = false;

		for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
		    var path = (i >= 0) ? arguments[i] : Path.basePath;
		    typeof console === "object" && console.assert(typeof path === "string", "Path.resolve(...: 必须是字符串)");

		    if (path) {
		        resolvedPath = path + '/' + resolvedPath;
		        resolvedAbsolute = path.charAt(0) === '/';
			}

		}

		// At this point the path should be resolved to a full absolute path, but
		// handle relative paths to be safe (might happen when process.cwd() fails)

		// Normalize the path
		resolvedPath = Path._normalizeArray(resolvedPath.split('/').filter(function (p) {
			return !!p;
		}), !resolvedAbsolute).join('/');

		return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	},

    /**
     * 规划化指定的路径。
     * @param {String} path 要处理的路径。
     * @returns {String} 返回处理后的新路径。
     * @example Path.normalize("a/b/../c/d/e") // "a/c/d/e"
     */
	normalize: function (path) {
	    typeof console === "object" && console.assert(typeof path === "string", "Path.normalize(path: 必须是字符串)");
		var isAbsolute = path.charAt(0) === '/',
			trailingSlash = path.substr(-1) === '/';

		// Normalize the path
		path = Path._normalizeArray(path.split('/').filter(function (p) {
			return !!p;
		}), !isAbsolute).join('/');

		if (!path && !isAbsolute) {
			path = '.';
		}
		if (path && trailingSlash) {
			path += '/';
		}

		return (isAbsolute ? '/' : '') + path;
	},

    /**
     * 合并多个文件夹路径为一个。
     * @param {String} path 要处理的文件夹路径。
     * @returns {String} 返回合并后的新路径。
     * @example Path.join("a/b/../c/d/e") // "a/c/d/e"
     */
	join: function() {
		var paths = Array.prototype.slice.call(arguments, 0);
		return Path.normalize(paths.filter(function (p, index) {
			return p;
		}).join('/'));
	},

    /**
     * 计算指定路径相对于基路径的相对路径。
     * @param {String} basePath 解析的基路径。
     * @param {String} path 要处理的路径。
     * @returns {String} @path 相对于 @basePath 的基路径。
     * @example Path.relative("a/b", "a/c") // "../c"
     */
	relative: function (basePath, path) {
		
		basePath = Path.resolve(basePath);
		path = Path.resolve(path);

		function trim(arr) {
			var start = 0;
		    for (; start < arr.length && !arr[start]; start++);

			var end = arr.length - 1;
		    for (; end >= 0 && !arr[end]; end--);

			return start > end ? [] : arr.slice(start, end - start + 1);
		}

		var fromParts = trim(basePath.split('/'));
		var toParts = trim(path.split('/'));

		var length = Math.min(fromParts.length, toParts.length);
		var samePartsLength = length;
		for (var i = 0; i < length; i++) {
			if (fromParts[i] !== toParts[i]) {
				samePartsLength = i;
				break;
			}
		}

		var outputParts = [];
		for (var i = samePartsLength; i < fromParts.length; i++) {
			outputParts.push('..');
		}

		outputParts.push.apply(outputParts, toParts.slice(samePartsLength));

		return outputParts.join('/');
	},

    /**
     * 获取指定路径的文件夹名部分。
     * @param {String} path 要处理的路径。
     * @returns {String} 返回文件夹部分。
     * @example Path.dirname("e/a/b") // "e/a"
     */
	dirname: function(path) {
	    var result = Path._splitPath(path);
	    var root = result[0];
		var dir = result[1];

		if (!root && !dir) {
			// No dirname whatsoever
			return '.';
		}

		if (dir) {
			// It has a dirname, strip trailing slash
			dir = dir.substr(0, dir.length - 1);
		}

		return root + dir;
	},

    /**
     * 获取指定路径的文件名部分。
     * @param {String} path 要处理的路径。
     * @returns {String} 返回文件部分。
     * @example Path.basename("e/a/b.txt") // "b.txt"
     */
	basename: function(path, ext) {
	    return Path._splitPath(path)[2];
	},

    /**
     * 获取指定路径的扩展名部分（包括点）。
     * @param {String} path 要处理的路径。
     * @returns {String} 返回扩展名部分。
     * @example Path.extname("e/a/b.txt") // ".txt"
     */
	extname: function(path) {
		return Path._splitPath(path)[3];
	}

};
