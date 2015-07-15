/**
 * Boot.js - A synchroniaed module loader for browsers.
 */

var bootjs = (function (window) {

    var isStd = !!document.constructor,
        typeAsserts = {
            'Function': 'typeof $ === "function"',
            'Number': 'typeof $.length === "number"',
            'Number': 'typeof $ === "number" || $ instanceof Number',
            'String': 'typeof $ === "string" || $ instanceof String',
            'Object': 'typeof $ === "object" || typeof $ === "function" || typeof $.nodeType === "number"',
            'Node': ' typeof $.nodeType === "number" || $.setTimeout',
            'Element': '$.nodeType === 1',
            'Document': '$.nodeType === 9'
        },
        modules = {},
        bootjs = {};

    /**
	 * Get the absolute url of specified script or link node.
	 */
    function getAbsoluteUrl(node, attrName) {
        // Use getAttribute('src', 4) instead in IE 6-7 to get absolute url.
        return ((isStd ? node[attrName] : node.getAttribute(attrName, 4)) || "").replace(/[\?#].*$/, "");
    }

    /**
     * Get the content of the specified url synchronously.
     */
    function loadContent(url) {

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

            status = window.location.protocol === 'file:' ? "This page is using file:// protocol, use http:// instead." : e.toString();

        } finally {

            // Release memory.
            xmlHttp = null;
        }

        // Print the error if console available.
        if (window.console && console.error) {
            console.error("File Load Error: " + url + "\r\n\tMessage: " + status);
        }

        return "";

    }

    /**
     * Get the actually url of specified module path.
     */
    function toUrl(modulePath, currentPath) {

        modulePath = modulePath.replace(/\\|\/\//g, "/");

        // If modulePath is relative path. Concat modulePath with basePath.
        if (modulePath.charAt(0) === '.') {
            modulePath = currentPath + "/" + modulePath;
        } else if (!/:\/\//.test(modulePath)) {
            modulePath = bootjs.basePath + "/" + modulePath;
        }

        // Remove "/./" in path
        modulePath = modulePath.replace(/\/(\.\/)+/g, "/");

        // Remove "/../" in path
        while (/\/[^\/]+\/\.\.\//.test(modulePath)) {
            modulePath = modulePath.replace(/\/[^\/]+\/\.\.\//, "/");
        }

        return modulePath;
    }

    function replaceAssert(args) {

        // args = exp @fun(args): message

        var at = args.indexOf('@'),
            expr = at < 0 ? args : args.substr(0, at),
            defaultMessage = expr,
            message = at > 0 ? args.substr(at + 1) : "Assertion fails";

        // value:type check
        if ((at = /^(.+):\s*(\w+)(\??)\s*$/.exec(expr)) && at[2] in typeAsserts) {
            expr = (at[3] ? at[1] + ' == null || ' : at[1] + ' != null && ') + typeAsserts[at[2]].replace(/\$/g, at[1]);
            defaultMessage = at[1] + ' should be a(an) ' + at[2] + (at[3] ? ' or undefined.' : '.');
        }

        if (message.indexOf(':') < 0) {
            message += ': ' + defaultMessage;
        }

        return 'if(!(' + (expr || 1) + ') && window.console && console.error) console.error("' + message.replace(/\"/g, "\\\"") + '");';
    }

    function loadModule(moduleUrl) {

        var requires = [],
            imports = [],
	        sourceCode = loadContent(moduleUrl).replace(/^(\s*)\/[\/\*]\s*#(\w+)\s+(.*)$/gm, function (all, indent, macro, args) {
	            switch (macro) {
	                case 'include':

	                    args = toUrl(args, moduleUrl);

	                    // Add .js automaticly if no extension is found.
	                    if (!/\.[^\/]*$/.test(args)) {
	                        args += ".js";
	                    }

	                    // Ensure all modules are loaded once.
	                    if (!(args in modules)) {
	                        args = loadModule(args);
	                        requires.push.apply(requires, args.requires);
	                        imports.push.apply(imports, args.imports);
	                    }
	                    break
					case 'import':
	                case 'imports':
	                    args = toUrl(args, moduleUrl);

	                    // Add .css automaticly if no extension is found.
	                    if (!/\.[^\/]*$/.test(args)) {
	                        args += ".css";
	                    }

	                    // Ensure all modules are loaded once.
	                    if (!(args in modules)) {
	                        imports.push(args);
	                    }
	                    break;
	                case 'exclude':
	                case 'included':
	                    modules[toUrl(args, moduleUrl)] = false;
	                    break;
	                case 'assert':
	                    return indent + replaceAssert(args)
	                case 'deprected':
	                    return indent + 'if(window.console && console.warn) console.warn("' + (args.replace(/\"/g, "\\\"") || "This function is deprected.") + '")';
	            }

	            return all;
	        }),
	        moduleInfo = {
	            url: moduleUrl,
	            requires: requires,
	            imports: imports,
	            sourceCode: sourceCode
	        };

        requires.push(moduleInfo);

        modules[moduleUrl] = moduleInfo;

        return moduleInfo;
    }

    function init() {
        
        var currentUrl = (location.protocol + '//' + location.host + location.pathname).replace(/\/[^\/]*$/, ""), nodes, i, node, mainModule;

        nodes = document.getElementsByTagName("script");
        node = nodes[nodes.length - 1];

        bootjs.debug = node.getAttribute('data-debug') === "true";
        bootjs.basePath = node.getAttribute('data-base');
        bootjs.mainModule = node.getAttribute('data-main');

        bootjs.basePath = bootjs.basePath || getAbsoluteUrl(node, 'src').replace(/\/[^\/]*$/, "");

        nodes = document.getElementsByTagName("SCRIPT");
        for (i = 0; node = nodes[i]; i++) {
            if (node.src) {
                modules[getAbsoluteUrl(node, "src")] = true;
            }
        }

        nodes = document.getElementsByTagName("LINK"), i;
        for (i = 0; node = nodes[i]; i++) {
            if (node.href) {
                modules[getAbsoluteUrl(node, "href")] = true;
            }
        }

        if (bootjs.mainModule) {

            bootjs.mainModule = nodes = loadModule(toUrl(bootjs.mainModule, currentUrl));
            for (i = 0; i < nodes.imports.length; i++) {
                node = nodes.imports[i];
                document.write('<link rel="stylesheet" type="text/css" href="' + node + '">');
            }

            for (i = 0; i < nodes.requires.length; i++) {
                node = nodes.requires[i];
                document.write(bootjs.debug ? '\r\n<script type="text/javascript" src="' + node.url + '"></script>' : '\r\n<script type="text/javascript" data-src="' + node.url + '">\r\n' + node.sourceCode.replace(/<\/script>/gi, "<\\\/script>") + '\r\n</script>');
            }

        }
    }

    init();

    return bootjs;

})(this);

