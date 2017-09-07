/**
 * include.js - A synchroniaed module loader for browsers.
 */

/**
 * Import a script, a style sheet or an html fragment.
 */
function include(modulePath) {
	var url = include.toUrl(modulePath),
		extension = include.getExtension(url);

	// Do not load twice.
	if (!include.isLoaded(url, extension)) {

		// Mark as loaded.
		include.loaded.push(url);

		// Do load.
		include.loaders[extension](url);
	}
}

/**
 * Get the absolute url of specified script or link node.
 */
include.getAbsoluteUrl = document.constructor ? function (node, attrName) {
	// Use getAttribute('src', 4) instead in IE 6-7 to get absolute url.
	return (node[attrName] || "").replace(/[\?#].*$/, "");
} : function (node, attrName) {
	// Use getAttribute('src', 4) instead in IE 6-7 to get absolute url.
	return (node.getAttribute(attrName, 4) || "").replace(/[\?#].*$/, "");
};

/**
 * Get the current script url of specified script or link node.
 */
include.getCurrentPath = function () {

	var url = include.currentPath;

	if (!url) {
		try {
			var scripts = document.getElementsByTagName("script");
			scripts = scripts[scripts.length - 1];
			if (scripts.src)
				url = include.getAbsoluteUrl(scripts, 'src');
			else
				url = location.protocol + '//' + location.host + location.pathname;
		} catch (e) {
			url = "";
		}
	}

	return url.replace(/\/[^\/]*$/, "");
};

/**
 * The root path used by include. Default to the parent directory of boot.js.The path should not be end with "/".
 */
include.basePath = include.getCurrentPath();

/**
 * Get the actually url of specified module path.
 */
include.toUrl = function(modulePath) {
			
	// If modulePath is relative path. Concat modulePath with basePath.
	if(modulePath.charAt(0) === '.') {
		modulePath = include.getCurrentPath() + "/" + modulePath;
	} else if(!/:\/\//.test(modulePath)) {
		modulePath = include.basePath + "/" + modulePath;
	}
			
	// Remove "/./" in path
	modulePath = modulePath.replace(/\/(\.\/)+/g, "/");
			
	// Remove "/../" in path
	while (/\/[^\/]+\/\.\.\//.test(modulePath)) {
		modulePath = modulePath.replace(/\/[^\/]+\/\.\.\//, "/");
	}
			
	// Add .js automaticly if no extension is found.
	if(!/\.[^\/]*$/.test(modulePath)){
		modulePath += ".js";
	}
			
	return modulePath;
};
		
/**
 * Get the extension of specified url.
 * @return {String} The extension that starts with a dot. If the actual 
 * extension is not a member of include.loaders, it returns ".html" 
 * by default.
 */
include.getExtension = function(url) {
	var match = /\.\w+$/.exec(url);
	return match && (match[0] in include.loaders) ? match[0] : ".html";
};

/**
 * An array to save loaded modules.
 */
include.loaded = [];
		
/**
 * Check wheather the specified url has been loaded.
 */
include.isLoaded = function(url, extension){
			
	var tagName, attrName, nodes, i, nodeUrl;
			
	// IE6-7 does not support array.indexOf .
	for(i = 0; i < include.loaded.length; i++){
		if(include.loaded[i] == url) {
			return true;
		}
	}
		
	// Check if url is loaded by native SCRIPT or LINK tag.
			
	if (extension === ".css") {
		tagName = "LINK";
		attrName = "href";
	} else {
		tagName = "SCRIPT";
		attrName = "src";
	}

	nodes = document.getElementsByTagName(tagName);

	for (i = 0; nodes[i]; i++) {
		nodeUrl = include.getAbsoluteUrl(nodes[i], attrName);
		if(nodeUrl === url){
			return true;
		}
	}
			
	return false;
};
	
/**
 * Get the content of the specified url synchronously.
 */
include.loadContent = function (url) {

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
		
		status = "Network Error(" + status + ")";

	} catch (e) {

		// 调试输出。
		status = window.location.protocol == "file:" ? "This page is using file:// protocol, use http:// instead." : e.toString();

	} finally {

		// 释放资源。
		xmlHttp = null;
	}
	

	throw new Error("File Load Error: " + url + "\r\n\tMessage: " + status);

};
		
/**
 * All supported loaders for variant extensions.
 */
include.loaders = {
	'.js': function (url) {
		var sourceCode = include.loadContent(url);

		if (sourceCode) {
			var oldPath = include.currentPath;
			include.currentPath = url;
			try {
				// Eval code in global context.
				if (window.execScript) {
					window.execScript(sourceCode);
				} else {

					// Donot use window.eval due to some code compressors hate it.
					window["eval"].call(window, sourceCode);
				}
			} catch (e) {
				trace.error("Script Error: " + url + "\r\n\tMessage: " + e.toString());
			} finally {
				include.currentPath = oldPath;
			}
		}
	},
	'.css': function (url) {

		// Js may executed before css is ready. We donot hack here to save bytes, 
		// just wrap js with dom ready callback if the situation happens.
		return (document.head || document.getElementsByTagName("HEAD")[0] || document.documentElement).appendChild(extend(document.createElement('link'), {
			href: url,
			rel: 'stylesheet',
			type: 'text/css'
		}));
	},
	'.html': function (url) {
		var sourceCode = include.loadContent(url);
		if (sourceCode) {
			document.write(sourceCode);
		}
	}
};

/**
 * Exculde a path so that the specified path would be skipped by include.
 */
function exclude(modulePath) {
	include.loaded.push(include.toUrl(modulePath));
}
