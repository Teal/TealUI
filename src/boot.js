/**
 * @fileOverview Boot.js - A synchronized module loader for browsers.
 * @author xuld
 */

/**
 * Provides api for lazy load and debug.
 */
var bootjs = {

    /**
     * Load the content of the specified url synchronously.
	 * @param {String} url The URL to load. Cross-domain is not allowed by default.
     */
    loadContent: function (url) {

        // Create new XMLHttpRequest instance(use ActiveXObject instead in IE 6-8).
        var xmlHttp = +"\v1" ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
            status;

        try {
            xmlHttp.open("GET", url, false);
            xmlHttp.send(null);
            status = xmlHttp.status;
            // Check http status.
            if ((status >= 200 && status < 300) || status == 304 || status == 1223) {
                return xmlHttp.responseText;
            }
            status = 'Network Error(' + status + ')';
        } catch (e) {
            status = location.protocol === 'file:' ? "Boot.js is not available under protocol 'file:' , use 'http:' instead." : e.toString();
        } finally {
            // Release memory.
            xmlHttp = null;
        }

        // Print the error if console available.
        if (window.console && console.error) {
            console.error("File Load Error: " + url + "\r\n\tMessage: " + status);
        }

        return "";

    },

    /**
     * Resolve the relative path with specified base path.
	 * @param {String} basePath The current path.
	 * @param {String} relativePath The relative path found in file of *basePath*.
     */
    resolveRelativePath: function (basePath, relativePath) {

        // Prepend base path
        if (relativePath.indexOf(':/') < 0) {
            relativePath = (/[:\/]/.test(basePath) ? basePath : './' + basePath).replace(/[\?#].*$/, "").replace(/\/[^\/]*$/, "") + "/" + relativePath;
        }

        var parts = relativePath.split('/'),
			i = parts.length,
			up = 0;

        while (i--) {
            if (parts[i] !== '.') {
                if (parts[i] === '..') {
                    up++;
                } else if (up) {
                    up--;
                } else {
                    continue;
                }
            }
            parts.splice(i, 1);
        }

        return parts.join('/');
    },

    /**
	 * Get all loaded modules.
	 * @type {Object}
	 */
    modules: {},

    /**
	 * Load the specified module synchronizely.
	 * @param {String} modulePath The path of module to load.
	 * @param {String} parentModulePath The path of current module.
	 */
    loadModule: function (modulePath, parentModulePath) {
        
        modulePath = bootjs.resolveRelativePath(parentModulePath, modulePath);

        // Load each module only once.
        if (modulePath in bootjs.modules) {
            return;
        }

        // Mark the current module as loaded.
        bootjs.modules[modulePath] = parentModulePath;

        // Load .js and .css for those module that without extension.
        var fileType = (/(\.\w+)(\?|#|$)/.exec(modulePath) || [])[1];
        if (fileType == null) {
            bootjs.loadModule(modulePath + '.css', parentModulePath);
            bootjs.loadModule(modulePath + '.js', parentModulePath);
            return;
        }

        // Start loading module.
        var content = bootjs.loadContent(modulePath);

        // Resolve #require
        content.replace(/^(\s*)\/[\/\*]\s*#(\w+)\s+([^\r\n\*]+)/gm, function (all, _, macro, requiredModulePath) {
            if (macro === 'require') {
                bootjs.loadModule(requiredModulePath, modulePath);
            } else if (macro === 'required') {
                // Mark the module is loaded.
                bootjs.modules[requiredModulePath] = null;
            }
        });

        // Apply the loaded module.
        if (fileType === '.js') {
            document.writeln('<script type="text/javascript" src="' + modulePath + '"></script>');
        } else if (fileType == '.css') {
            document.writeln('<link rel="stylesheet" type="text/css" href="' + modulePath + '">');
        } else {
            document.write(content);
        }

    }

};

(function () {

    // Get the last boot.js 
    var nodes = document.getElementsByTagName("script"),
		node = nodes[nodes.length - 1],

		// Use getAttribute('src', 4) instead in IE 6/7 to get absolute url.
		src = document.constructor ? node.src : node.getAttribute('src', 4) || "",
		params = /\?([^#]*)/.exec(src),
		i;

    // Set base path.
    bootjs.basePath = (/#([^\?]*)/.exec(src) || [])[1] || src;

    // Load all modules.
    if (params) {
        params = params[1].split(/[&,]/);
        for (i = 0; i < params.length; i++) {
            bootjs.loadModule(params[i], bootjs.basePath);
        }
    }

})();
