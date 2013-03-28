 /**
  * Boot.js - An extended AMD module loader for browsers.
  */
  
(function(window){
	
	var isStd = !!document.constructor;

	/**
	 * Copy all members of src to dest.
	 */
	function extend(dest, src) {
		for (var b in src)
			dest[b] = src[b];
		return dest;
	}
	
	/**
	 * Get the absolute url of specified script or link node.
	 */
	function getAbsoluteUrl(node, attrName) {
		// Use getAttribute('src', 4) instead in IE 6-7 to get absolute url.
		return ((isStd ? node[attrName] : node.getAttribute(attrName, 4)) || "").replace(/[\?#].*$/, "");
	}
	
	/**
	 * Import a script, a style sheet or an html fragment.
	 */
	function include(modulePath) {
		var url = include.toUrl(modulePath),
			extension = include.getExtension(url);
		
		// Do not load twice.
		if(!include.isLoaded(url, extension)){
			
			// Mark as loaded.
			include.loaded.push(url);
			
			// Do load.
			include.fileExtensions[extension](url);
		}
	}
	
	extend(include, {
		
		/**
		 * An array to save loaded paths.
		 */
		loaded: [],
		
		/**
		 * The root path used by include. Default to the parent directory of boot.js.The path should not be end with "/".
		 */
		basePath: (function () {
			try {
				var scripts = document.getElementsByTagName("script");
				return getAbsoluteUrl(scripts[scripts.length - 1], 'src').replace(/\/[^\/]*$/, "");
			} catch (e) {
				return "";
			}
		})(),
		
		/**
		 * The current path used by include. Default to the directory of current page.The path should not be end with "/".
		 */
		currentPath: location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]*$/, ""),
	
		/**
		 * Get the actually url of specified module path.
		 */
		toUrl: function(modulePath) {
			
			// If modulePath starts with '~', replace '~' with current html path.
			// If modulePath is relative path. Concat modulePath with basePath.
			if(modulePath.substr(0, 2) === '~/') {
				modulePath = modulePath.replace('~/', include.currentPath + "/");
			} else if(!/:\/\//.test(modulePath)) {
				modulePath = include.basePath + "/" + modulePath;
			}
			
			// Remove "/./" in path
			modulePath = modulePath.replace(/\/(\.\/)+/g, "/");
			
			// Resolve "/../" in path
			while(modulePath.indexOf('/../') >= 0) {
				modulePath = modulePath.replace(/\/[^\/]+\/\.\.\//, "/");
			}
			
			// Adding .js automaticly if no extension is found.
			if(!/\.[^\/]*$/.test(modulePath)){
				modulePath += ".js";
			}
			
			return modulePath;
		},
		
		/**
		 * Get the extension of specified url.
		 * @return {String} The extension that starts with a dot. If the actual 
		 * extension is not a member of include.fileExtensions, it returns ".html" 
		 * by default.
		 */
		getExtension: function(url) {
			var match = /\.\w+$/.exec(url);
			return match && (match[0] in include.fileExtensions) ? match[0] : ".html";
		},
		
		/**
		 * Check wheather the specified url has been loaded.
		 */
		isLoaded: function(url, extension){
			
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
				nodeUrl = getAbsoluteUrl(nodes[i], attrName);
				if(nodeUrl === url){
					return true;
				}
			}
			
			return false;
		},
	
		/**
		 * Get the content of the specified url synchronously.
		 */
		getText: function (url) {

			// Create new XMLHttpRequest instance(use ActiveXObject instead in IE 6-8).
			var xmlHttp = !+"\v1" ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest(),
				status;

			try {

				xmlHttp.open("GET", url, false);
				xmlHttp.send(null);
				status = xmlHttp.status;

				// Check http status.
				if ((status >= 200 && status < 300) || status == 304 || status == 1223) {
					return xmlHttp.responseText;
				} else {
					throw "Network Error(" + status + ")";
				}

			} catch (e) {

				// 调试输出。
				window.trace.error("File Load Error: " + url + "\r\n\tMessage: " + (window.location.protocol == "file:" ? "This page is using file:// protocol, use http:// instead." : e.toString()));

			} finally {

				// 释放资源。
				xmlHttp = null;
			}

		},
		
		/**
		 * All supported loaders for variant extensions.
		 */
		fileExtensions: {
			'.js': function(url) {
				var sourceCode = include.getText(url);

				if (sourceCode) {
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
					}
				}
			},
			'.css': function(url) {
					
				// Js may executed before css is ready. We donot hack here to save bytes, 
				// just wrap js with dom ready callback if the situation happens.
				return (document.head || document.getElementsByTagName("HEAD")[0] || document.documentElement).appendChild(extend(document.createElement('link'), {
					href: url,
					rel: 'stylesheet',
					type: 'text/css'
				}));
			},
			'.html': function(url) {
				var sourceCode = include.getText(url);
				if(sourceCode) {
					document.write(sourceCode);
				}
			}
		}
	
	});
	
	/**
	 * Exculde a path so that the specified path would be skipped by include.
	 */
	function exclude(modulePath) {
		include.loaded.push(include.toUrl(modulePath));
	}
	
	/**
	 * Exports a varName so that AMD loaders are able to load current file as a module.
	 */
	function exports(varName, value) {
		if(typeof define === "function" && define.amd){
			define(varName, [], value);
		}
	}
	
	/**
	 * Print variables to console.
	 * @param {Object} ... The variable list to print.
	 */
	function trace(){

		// If no argument exisits. Fill argument as (trace: id).
		// For usages like: callback = trace;
		if (arguments.length === 0) {
			if (!trace.$count)
				trace.$count = 0;
			return trace('(trace: ' + (trace.$count++) + ')');
		}

		if (trace.enable) {
			
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

	/**
     * @namespace trace
     */
	extend(trace, {

		/**
		 * Set to false to disable trace.
		 * @config {Boolean}
		 */
		enable: true,

		/**
         * Convert any objects to readable string. Same as var_dump() in PHP.
         * @param {Object} obj The variable to dump.
         * @param {Number} deep=3 The maximum count of recursion.
         * @return String The dumped string.
         */
		dump: function (obj, deep, showArrayPlain) {

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
		},

		/**
         * Display all variables to user. 
         * @param {Object} ... The variable list to print.
		 * @remark Differs from trace(), trace.write() preferred to using window.alert. 
		 * Overwrite it to disable window.alert.
         */
		write: function () {

			var r = [], i = arguments.length;

			// dump all arguments.
			while (i--) {
				r[i] = trace.dump(arguments[i]);
			}

			window.alert(r.join(' '));
		},

		/**
         * Print a log to console.
		 * @param {String} message The message to print.
         * @type Function
         */
		log: function (message) {
			if (trace.enable && window.console && console.log) {
				return console.log(message);
			}
		},

		/**
         * Print a error to console.
         * @param {String} message The message to print.
         */
		error: function (message) {
			if (trace.enable) {
				if (window.console && console.error)
					return console.error(message); // This is a known error which is caused by mismatched argument in most time.
				else
					throw message; // This is a known error which is caused by mismatched argument in most time.
			}
		},

		/**
         * Print a warning to console.
         * @param {String} message The message to print.
         */
		warn: function (message) {
			if (trace.enable) {
				return window.console && console.warn ? console.warn(message) : trace("[WARNING]", message);
			}
		},

		/**
         * Print a inforation to console.
         * @param {String} message The message to print.
         */
		info: function (message) {
			if (trace.enable) {
				return window.console && console.info ? console.info(message) : trace("[INFO]", message);
			}
		},

		/**
         * Print all members of specified variable.
         * @param {Object} obj The varaiable to dir.
         */
		dir: function (obj) {
			if (trace.enable) {
				if (window.console && console.dir)
					return console.dir(obj);
				else if (obj) {
					var r = "", i;
					for (i in obj)
						r += i + " = " + trace.inspect(obj[i], 1) + "\r\n";
					return trace(r);
				}
			}
		},

		/**
         * Try to clear console.
         */
		clear: function () {
			if (window.console && console.clear)
				return console.clear();
		},

		/**
         * Eval code if trace.enable equals true.
         * @param {String/Function} code The source code or function to run.
         * @return {String} returns the last error message of execution or an empty string if no error occurs.
         */
		eval: function (code) {
			if (trace.enable) {
				try {
					typeof code === 'function' ? code() : eval(code);
				} catch (e) {
					return e;
				}
			}
			return "";
		},

		/**
         * Test the efficiency of specified function.
         * @param {Function} fn The function to test, which will be executed more than 10 times.
         */
		time: function (fn) {
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
			return trace("[TIME] " + past / time);
		}

	});

	/**
	 * Assert value equals true, or print a warning in console.
	 * @param {Object} value The value to confirm, which will be converted to boolean automatically.
	 * @param {String} message="Assert Fails" The message to print if *value* equals **false**.
	 * @return {Boolean} Returns the result of assertion.
	 * @example <pre>
	 * var value = 1;
	 * assert(value > 0, "Function#bind(value): value should be greater than 0.");
	 * </pre>
	 */
	function assert(value, message, defaultMessage) {
		if (!value) {
			window.trace.error(message ? message.replace("~",defaultMessage) : "Assert Fails");
			return false;
		}

		return true;
	}

	/**
     * @namespace assert
     */
	extend(assert, {

		/**
		 * Notify user the usage of current function is deprected and may not be 
		 * supported in next release.
		 * @param {String} message="This function is deprected." The message to display. 
		 * In general, tells user the replacement of current usage.
		 */
		deprected: function (message) {
			return trace.warn(message || "This function is deprected.");
		},

		/**
         * Assert the specified variable is a function.
		 * @param {Object} value The variable to test.
		 * @param {String} message="shoud be a function." The message to print if *value* equals 
		 * **false**, in which ~ will be replaced by default error message.
		 * @return {Boolean} Returns the result of assertion.
         * @example <pre>
         * assert.isFunction(a, "a ~");
         * </pre>
         */
		isFunction: function (value, message) {
			return assert(typeof value === 'function', message, "shoud be a function.");
		},

		/**
         * Assert the specified variable is an array.
		 * @param {Object} value The variable to test.
		 * @param {String} message="Shoud be an array." The message to print if *value* equals 
		 * **false**, in which ~ will be replaced by default error message.
		 * @return {Boolean} Returns the result of assertion.
         */
		isArray: function (value, message) {
			return assert(typeof value.length === 'number', message, "shoud be an array.");
		},

		/**
         * Assert the specified variable is a number.
		 * @param {Object} value The variable to test.
		 * @param {String} message="shoud be a number." The message to print if *value* equals 
		 * **false**, in which ~ will be replaced by default error message.
		 * @return {Boolean} Returns the result of assertion.
         */
		isNumber: function (value, message) {
			return assert(typeof value === 'number' || value instanceof Number, message, "shoud be a number.");
		},

		/**
         * Assert the specified variable is a string.
		 * @param {Object} value The variable to test.
		 * @param {String} message="shoud be a string." The message to print if *value* equals 
		 * **false**, in which ~ will be replaced by default error message.
		 * @return {Boolean} Returns the result of assertion.
         */
		isString: function (value, message) {
			return assert(typeof value === 'string' || value instanceof String, message, "shoud be a string.");
		},

		/**
         * Assert the specified variable is an object.
		 * @param {Object} value The variable to test.
		 * @param {String} message="shoud be an object." The message to print if *value* equals 
		 * **false**, in which ~ will be replaced by default error message.
		 * @return {Boolean} Returns the result of assertion.
         */
		isObject: function (value, message) {
			return assert(value && (typeof value === "object" || typeof value === "function" || typeof value.nodeType === "number"), message, "shoud be an object.");
		},

		/**
         * Assert the specified variable is a node or null.
		 * @param {Object} value The variable to test.
		 * @param {String} message="shoud be a node or null." The message to print if *value* equals 
		 * **false**, in which ~ will be replaced by default error message.
		 * @return {Boolean} Returns the result of assertion.
         */
		isNode: function (value, message) {
			return assert(value ? typeof value.nodeType === "number" || value.setTimeout : value === null, message, "shoud be a node or null.");
		},

		/**
         * Assert the specified variable is an element or null.
		 * @param {Object} value The variable to test.
		 * @param {String} message="shoud be an element or null." The message to print if *value* equals 
		 * **false**, in which ~ will be replaced by default error message.
		 * @return {Boolean} Returns the result of assertion.
         */
		isElement: function (value, message) {
			return assert(value ? typeof value.nodeType === "number" || value.style : value === null, message, "shoud be an element or null.");
		},

		/**
         * Assert the specified variable is not null.
		 * @param {Object} value The variable to test.
		 * @param {String} message="should not be null or undefined." The message to print if *value* equals 
		 * **false**, in which ~ will be replaced by default error message.
		 * @return {Boolean} Returns the result of assertion.
         */
		notNull: function (value, message) {
			return assert(value != null, message, "should not be null or undefined.");
		}

	});
	
	// Exports Functions
	
	extend(window, {
		
		include: include,
		
		exclude: exclude,
		
		exports: exports,
		
		trace: trace,
		
		assert: assert
	
	});
	
})(this);

