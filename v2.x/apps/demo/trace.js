
/**
 * Print variables to console.
 * @param {Object} ... The variable list to print.
 */
function trace() {

    if (!trace.disable) {

        // If no argument exisits. Fill argument as (trace: id).
        // For usages like: callback = trace;
        if (arguments.length === 0) {
            if (!trace.$count)
                trace.$count = 0;
            return trace('(trace: ' + (trace.$count++) + ')');
        }

        // Use console if available.
        if (window.console) {

            // Check console.debug
            if (console.debug && console.debug.apply) {
                return console.debug.apply(console, arguments);
            }

            // Check console.log
            if (console.log && console.log.apply) {
                return console.log.apply(console, arguments);
            }

            // console.log.apply is undefined in IE 7-8.
            if (console.log) {
                return console.log(arguments.length > 1 ? arguments : arguments[0]);
            }

        }

        // Fallback to call trace.write, which calls window.alert by default.
        return trace.write.apply(trace, arguments);

    }
}

trace.disable = false;

/**
 * Display all variables to user. 
 * @param {Object} ... The variable list to print.
 * @remark Differs from trace(), trace.write() preferred to using window.alert. 
 * Overwrite it to disable window.alert.
 */
trace.write = function () {

    var r = [], i = arguments.length;

    // dump all arguments.
    while (i--) {
        r[i] = trace.dump(arguments[i]);
    }

    window.alert(r.join(' '));
};

/**
 * Convert any objects to readable string. Same as var_dump() in PHP.
 * @param {Object} obj The variable to dump.
 * @param {Number} deep=3 The maximum count of recursion.
 * @return String The dumped string.
 */
trace.dump = function (obj, deep, showArrayPlain) {

    if (deep == null)
        deep = 3;
    switch (typeof obj) {
        case "function":
            // 函数
            return deep >= 3 ? obj.toString().replace(/\\u([0-9a-f]{3})([0-9a-f])/gi, function (a, b, c) {
                return String.fromCharCode((parseInt(b, 16) * 16 + parseInt(c, 16)))
            }) : "function()";

        case "object":
            if (obj == null)
                return "null";
            if (deep < 0)
                return obj.toString();

            if (typeof obj.length === "number") {
                var r = [];
                for (var i = 0; i < obj.length; i++) {
                    r.push(trace.inspect(obj[i], ++deep));
                }
                return showArrayPlain ? r.join("   ") : ("[" + r.join(", ") + "]");
            } else {
                if (obj.setInterval && obj.resizeTo)
                    return "window#" + obj.document.URL;
                if (obj.nodeType) {
                    if (obj.nodeType == 9)
                        return 'document ' + obj.URL;
                    if (obj.tagName) {
                        var tagName = obj.tagName.toLowerCase(), r = tagName;
                        if (obj.id) {
                            r += "#" + obj.id;
                            if (obj.className)
                                r += "." + obj.className;
                        } else if (obj.outerHTML)
                            r = obj.outerHTML;
                        else {
                            if (obj.className)
                                r += " class=\"." + obj.className + "\"";
                            r = "<" + r + ">" + obj.innerHTML + "</" + tagName + ">  ";
                        }

                        return r;
                    }

                    return '[Node type=' + obj.nodeType + ' name=' + obj.nodeName + ' value=' + obj.nodeValue + ']';
                }
                var r = "{\r\n", i, flag = 0;
                for (i in obj) {
                    if (typeof obj[i] !== 'function')
                        r += "\t" + i + " = " + trace.inspect(obj[i], deep - 1) + "\r\n";
                    else {
                        flag++;
                    }
                }

                if (flag) {
                    r += '\t... (' + flag + ' more)\r\n';
                }

                r += "}";
                return r;
            }
        case "string":
            return deep >= 3 ? obj : '"' + obj + '"';
        case "undefined":
            return "undefined";
        default:
            return obj.toString();
    }
};

/**
 * Print a log to console.
 * @param {String} message The message to print.
 * @type Function
 */
trace.log = function (message) {
    if (!trace.disable && window.console && console.log) {
        return console.log(message);
    }
};

/**
 * Print a error to console.
 * @param {String} message The message to print.
 */
trace.error = function (message) {
    if (!trace.disable) {
        if (window.console && console.error)
            return console.error(message); // This is a known error which is caused by mismatched argument in most time.
        else
            throw message; // This is a known error which is caused by mismatched argument in most time.
    }
};

/**
 * Print a warning to console.
 * @param {String} message The message to print.
 */
trace.warn = function (message) {
    if (!trace.disable) {
        return window.console && console.warn ? console.warn(message) : trace("[WARNING]", message);
    }
};

/**
 * Print a inforation to console.
 * @param {String} message The message to print.
 */
trace.info = function (message) {
    if (!trace.disable) {
        return window.console && console.info ? console.info(message) : trace("[INFO]", message);
    }
};

/**
 * Print all members of specified variable.
 * @param {Object} obj The varaiable to dir.
 */
trace.dir = function (obj) {
    if (!trace.disable) {
        if (window.console && console.dir)
            return console.dir(obj);
        else if (obj) {
            var r = "", i;
            for (i in obj)
                r += i + " = " + trace.inspect(obj[i], 1) + "\r\n";
            return trace(r);
        }
    }
};

/**
 * Try to clear console.
 */
trace.clear = function () {
    if (window.console && console.clear)
        return console.clear();
};

/**
 * Test the efficiency of specified function.
 * @param {Function} fn The function to test, which will be executed more than 10 times.
 */
trace.time = function (fn) {

    if (typeof fn === 'string') {
        fn = new Function(fn);
    }

    var time = 0,
        currentTime,
        start = +new Date(),
        past;

    try {

        do {

            time += 10;

            currentTime = 10;
            while (--currentTime > 0) {
                fn();
            }

            past = +new Date() - start;

        } while (past < 100);

    } catch (e) {
        return trace.error(e);
    }
    return trace.info("[TIME] " + past / time);
};
