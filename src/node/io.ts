/**
 * @fileOverview Extended exports Utilities for node.js
 * @author xuld@vip.qq.com
 * @license MIT license
 */

var FS = require('fs');
var Path = require('path');
var Util = require('util');

function copyFile(srcFile, destFile) {
    var BUF_LENGTH = 128 * 1024,
        buff = new Buffer(BUF_LENGTH),
        fdr = FS.openSync(srcFile, 'r'),
        fdw = FS.openSync(destFile, 'w'),
        bytesRead = 1,
        pos = 0;
    while (bytesRead > 0) {
        bytesRead = FS.readSync(fdr, buff, 0, BUF_LENGTH, pos);
        FS.writeSync(fdw, buff, 0, bytesRead);
        pos += bytesRead;
    }
    FS.closeSync(fdr);
    return FS.closeSync(fdw);
}

function copyDir(sourceDir, newDirLocation) {

    /*  Create the directory where all our junk is moving to; read the mode of the source directory and mirror it */
    var checkDir = FS.statSync(sourceDir);
    try {
        FS.mkdirSync(newDirLocation, checkDir.mode);
    } catch (e) {
        //if the directory already exists, that's okay
        if (e.code !== 'EEXIST') throw e;
    }

    var files = FS.readdirSync(sourceDir);

    for (var i = 0; i < files.length; i++) {
        var currFile = FS.lstatSync(sourceDir + "/" + files[i]);

        if (currFile.isDirectory()) {
            /*  recursion this thing right on back. */
            copyDir(sourceDir + "/" + files[i], newDirLocation + "/" + files[i]);
        } else if (currFile.isSymbolicLink()) {
            var symlinkFull = FS.readlinkSync(sourceDir + "/" + files[i]);
            FS.symlinkSync(symlinkFull, newDirLocation + "/" + files[i]);
        } else {
            /*  At this point, we've hit a file actually worth copying... so copy it on over. */
            copyFile(sourceDir + "/" + files[i], newDirLocation + "/" + files[i]);
        }
    }
}

function createDir(p, mode) {
    p = Path.resolve(p);

    try {
        FS.mkdirSync(p, mode);
    } catch (err0) {
        switch (err0.code) {
            case 'ENOENT':
                createDir(Path.dirname(p), mode);
                createDir(p, mode);
                break;

            case 'EEXIST':
                var stat;
                try {
                    stat = FS.statSync(p);
                } catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
            default:
                throw err0;
        }
    }

};

function walkDir(path, basePath, walker) {
    var rr = FS.readdirSync(path);

    path = path + Path.sep;
    for (var i = 0; i < rr.length; i++) {
        var newPath = path + rr[i];
        var s = FS.statSync(newPath);

        if (s.isFile()) {
            walker(basePath + rr[i], false);
        } else if (s.isDirectory()) {
            var dirPath = basePath + rr[i] + '/';
            if (walker(dirPath, true) !== false) {
                walkDir(newPath, dirPath, walker);
            }
        }
    }
}

function cleanDir(path, ignoreError) {
    var rr = FS.readdirSync(path);

    path = path + Path.sep;
    for (var i = 0; i < rr.length; i++) {
        var newPath = path + rr[i];
        var s = FS.statSync(newPath);

        if (s.isFile()) {
            if (ignoreError) {
                try {
                    FS.unlinkSync(newPath);
                } catch (e) { }
            } else {
                FS.unlinkSync(newPath);
            }
        } else if (s.isDirectory()) {
            cleanDir(newPath, ignoreError);
            if (ignoreError) {
                try {
                    FS.rmdirSync(newPath);
                } catch (e) { }
            } else {
                FS.rmdirSync(newPath);
            }
        }
    }
}

/**
 * 测试指定的路径是否存在。
 */
exports.exists = FS.existsSync;

/**
 * 测试指定的路径是否是文件。
 */
exports.existsFile = function (path) {
    try {
        return FS.statSync(path).isFile();
    } catch (e) {
        return false;
    }
};

/**
 * 测试指定的路径是否是文件夹。
 */
exports.existsDir = function (path) {
    try {
        return FS.statSync(path).isDirectory();
    } catch (e) {
        return false;
    }
};

/**
 * 确保指定文件所在文件夹存在。
 */
exports.ensureDir = function (path) {
    path = Path.dirname(path);
    if (!exports.exists(path))
        return createDir(path);
};

/**
 * 复制文件。
 */
exports.copyFile = function (srcFile, destFile, overwrite) {
    if (!exports.exists(srcFile))
        return false;

    if (exports.exists(destFile)) {
        if (overwrite === false) {
            return false;
        } else {
            FS.unlinkSync(destFile);
        }
    } else {
        exports.ensureDir(destFile);
    }

    copyFile(srcFile, destFile);
    return true;
};

/**
 * 复制文件夹。
 */
exports.copyDir = function (src, dest) {
    if (!exports.exists(src))
        return false;

    copyDir(src, dest);
};

/**
 * 创建文件夹。
 */
exports.createDir = createDir;

/**
 * 读取文件。
 */
exports.readFile = function (path, encoding) {
    encoding = encoding || "utf-8";
    var c = FS.readFileSync(path, encoding);
    return c.charCodeAt(0) === 65279 ? c.substr(1) : c;
};

/**
 * 读取文件。
 */
exports.readLines = function (path, encoding) {
    return exports.readFile(path, encoding).split(/[\r\n]/);
};

/**
 * 写入文件。
 */
exports.writeFile = function (path, content, encoding) {
    try {
        FS.writeFileSync(path, content, encoding);
    } catch (e) {
        if (e.code === "ENOENT") {
            try {
                exports.createDir(Path.dirname(path));
                FS.writeFileSync(path, content, encoding);
            } catch (e2) {
                throw e2;
            }
        }
    }
};

/**
 * 打开文件流以读取。
 */
exports.openRead = function (path, optexportsns) {
    return FS.createReadStream(path, optexportsns);
};

/**
 * 打开文件流以写入。
 */
exports.openWrite = function (path, optexportsns) {
    exports.ensureDir(path);
    return FS.createWriteStream(path, optexportsns);
};

/**
 * 删除文件。
 */
exports.deleteFile = function (path) {
    try {
        FS.unlinkSync(path);
    } catch (e) {
        // 忽略文件找不到的错误。
        if (e.code !== "ENOENT") {
            throw e;
        }
        return false;
    }
    return true;
};

/**
 * 清空文件夹。
 */
exports.cleanDir = function (path, ignoreError) {
    if (ignoreError) {
        try {
            if (exports.exists(path)) {
                cleanDir(path, ignoreError);
            }
        } catch (e) { }
    } else if (exports.exists(path)) {
        cleanDir(path, ignoreError);
    }
};

/**
 * 删除文件夹。
 */
exports.deleteDir = function (path) {
    if (exports.exists(path)) {
        cleanDir(path);
        FS.rmdirSync(path);
    }
};

/**
 * 读取文件夹。
 */
exports.readDir = function (path) {
    return exports.exists(path) ? FS.readdirSync(path) : [];
};

/**
 * 遍历文件夹。
 */
exports.walkDir = function (path, walker, basePath) {
    if (exports.exists(path)) {
        walkDir(path, basePath || "", walker);
    }
};

/**
 * 获取所有子文件。
 */
exports.getFiles = function (path) {
    var r = [];
    exports.walkDir(path, function (path, isDir) {
        if (!isDir) r.push(path);
    });
    return r;
};

/**
 * 获取所有子文件夹。
 */
exports.getDirs = function (path) {
    var r = [];
    exports.walkDir(path, function (path, isDir) {
        if (isDir) r.push(path);
    });
    return r;
};

/**
 * 获取所有子文件和文件夹。
 */
exports.getDirAndFiles = function (path) {
    var r = [];
    exports.walkDir(path, function (path, isDir) {
        r.push(path);
    });
    return r;
};

/**
 * 在当前文件夹及上级文件夹中搜索包含指定路径的文件夹。
 * @param {String} name 要搜索的文件夹路径。
 * @returns {String} 实际位置。
 */
exports.searchDirs = function (name) {
    var path = Path.resolve(name);
    if (FS.existsSync(path)) {
        return path;
    }
    var dirName = Path.resolve();
    var prevDirName = dirName;
    while ((dirName = Path.dirname(dirName)).length !== prevDirName.length) {
        if (FS.existsSync(path = Path.join(dirName, name))) {
            return path;
        }
        prevDirName = dirName;
    }
    return null;
};

/**
 * 如果父文件夹是空文件夹则删除。
 * @param path 文件路径。
 */
exports.deleteDirIfEmpty = function (path) {
    var p = path;
    var prev = p;
    while ((p = Path.dirname(p)) !== prev) {
        prev = p;
        try {
            FS.rmdirSync(p);
        } catch (e) {
            return;
        }
    }
};
