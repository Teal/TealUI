var Bpm = require('bpm/lib');
var Demo = require('../server/demo');
var Path = require('path');
var VM = require('vm');
var IO = require('utilskit/io');

var buildSrc = process.argv[2];

if (buildSrc) {

	var configs = initConfigs(buildSrc);

	Bpm.build(configs);

	console.log("Build Success!");
	console.log("Target js file: ", configs.js);
	console.log("Target css file: ", configs.css);
	console.log("Target images: ", configs.images);

}


function initConfigs(buildSrc) {

	buildSrc = Path.resolve(buildSrc);

	var sourceCode = IO.readFile(buildSrc);

	if (!sourceCode) {
		console.error(buildSrc + ' is not exists or file is empty.');
		return;
	}

	var vmContext = {
		include: function () {

		},
		exclude: function () {

		}
	};

	try {
		VM.runInNewContext(sourceCode, vmContext, buildSrc);
	} catch (e) {
		console.error('Execute ' + configs + ' Error: ' + e.toString());
	}

	var configs = vmContext.__bpm || {};

	if(!configs.basePath) {
		configs.basePath = Path.resolve(__dirname, "../../../" + Demo.Configs.src);
	}

	var baseDir = Path.dirname(buildSrc);

	if(!configs.js && !configs.css && !configs.html && !configs.images) {
		var baseName = Path.basename(buildSrc).match(/^(.*).src\.\w+$/);

		if(baseName) {
			configs.js = baseName[1] + ".js";
			configs.css = baseName[1] + ".css";
		} else {
			configs.js = buildSrc.replace(/\.\w+$/, "-build.js");
			configs.css = buildSrc.replace(/\.\w+$/, "-build.css");
		}

		configs.images = "images";

	}

	if(configs.js) {
		configs.js = Path.resolve(baseDir, configs.js);
	} 

	if(configs.css) {
		configs.css = Path.resolve(baseDir, configs.css);
	}

	if(configs.html) {
		configs.html = Path.resolve(baseDir, configs.html);
	}

	if(configs.images) {
		configs.images = Path.resolve(baseDir, configs.images);
	}

	configs.path = configs.path || buildSrc;

	return configs;
}

// var Builder = require('../builder/builder');
//var Configs = require('../configs/build');
//var Path = require('path');

//var builder = new Builder();

//// 将配置文件中的 from 和 to 统一改为绝对路径。
//var rootPath = require('./configs').rootPath;

//if (Configs.from)
//	Configs.from = Path.resolve(rootPath, Configs.from);

//if (Configs.to)
//	Configs.to = Path.resolve(rootPath, Configs.to);

//builder.loadConfigs(Configs);
//builder.build("/", ".html");