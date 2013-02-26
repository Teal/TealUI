
var Path = require('path'),
	Url = require('url'),
	IO = require('../../../node/node_modules/io'),
	Parser = require('../../../node/node_modules/parser');

function replaceHtmlLinks(content, callback) {
	return content.replace(/(href|src)(\s*=\s*(['"]?))([^'"]*)\3/ig, function (all, a, b, c, d) {
		var replace = callback(d);
		if (replace !== false) {
			return a + b + replace + c;
		}		return all;	});}

exports.processContent = function (content, options, builder) {

	// 如果 replaceBasePath 为 false，则不替换任何链接。
	if (options.replaceBasePath !== false) {
		content = replaceHtmlLinks(content, function (link) {

			// 改成本地格式的文件。
			link = Url.resolve(options.fromVirtualPath, link);
			
			// 解析路径。
			link = Url.parse(link); // website1/project1/assets.js
			
			// 解析 http://localhost:8080/
			if (link.hostname && (link.hostname.indexOf('.') < 0 || link.hostname === '127.0.0.1')) {
				delete link.protocol;
			}

			// 仅解析本地路径。
			if (!link.protocol) {

				var linkComipilerConfig = builder.getCompileConfig(link.pathname);

				// 源文件不存在，则不替换地址。
				if (!IO.exists(linkComipilerConfig.fromPhysicalPath)) {
					return false;
				}

				// 如果指定的文件需要根据 HTML 自动发布，则直接发布。
				if ('autoBuild' in linkComipilerConfig ? linkComipilerConfig.autoBuild : options.autoBuild) {
					builder.buildByConfig(linkComipilerConfig);
				}

				// 如果指定的文件格式强制指定了 HTML 内的根路径，则使用此字符串前缀。
				if (typeof linkComipilerConfig.replaceBasePath === "string") {
					return linkComipilerConfig.replaceBasePath + linkComipilerConfig.toVirtualPath.replace(linkComipilerConfig.to, "") + (link.search || "") + (link.hash || "");
				}
				// 更改页面内全部引用文件的跟目录。				if (options.replaceBasePath === true) {
					// 将绝对路径改为相对路径。
					return Path.relative(Path.dirname(options.toPhysicalPath), linkComipilerConfig.toPhysicalPath).replace(/\\/g, "/");

				} else {

					// 前缀指定的 URL。
					return options.replaceBasePath + linkComipilerConfig.toVirtualPath + (link.search || "") + (link.hash || "");
				}
			}

			// 忽略绝对路径。
			return false;
		});
	}	return content;};

exports.compile = require('./dynatic').compile;