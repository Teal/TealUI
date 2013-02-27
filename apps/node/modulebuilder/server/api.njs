
var Demo = require('../../../demo/demo.js');

switch(request.queryString.action){
	case 'recentbuildfiles':
		var IO = require('utilskit/io');
		var list = IO.getFiles(Demo.basePath + Demo.Configs.apps + "/data/buildfiles/");

		for(var i = 0; i < list.length; i++){
			list[i] = Demo.Configs.apps + "/data/buildfiles/" + list[i];
		}

		writeJsonp(context, list);

		response.end();
		break;
	case 'deletebuildfile':
		var IO = require('utilskit/io');
		IO.deleteFile(Demo.basePath + request.queryString.path);
		writeJsonp(context, "");
		response.end();
		break;
	case 'build':
		//var IO = require('utilskit/io');
		//IO.deleteFile(Demo.basePath + request.queryString.path);
		build(context, request.form.data);
		break;
	default:
		response.end();
		break;
}

function writeJsonp(context, data) {

    data = JSON.stringify(data);

    if (context.request.queryString.callback) {
        context.response.write(context.request.queryString.callback + '(' + data + ')');
    } else {
        context.response.write(data);
    }

}

function build(context, data){
	
	var ModuleBuilder = require('../assets/modulebuilder.js');

	data = JSON.parse(data);

	context.response.buffer = false;

	ModuleBuilder.moduleBasePath = Demo.basePath + Demo.Configs.src;
	
	var Path = require('path');

	var p = data.path;
	
	if(p) {
		p = Path.resolve(Demo.basePath, p.replace(Demo.Configs.serverBaseUrl, ""));
	} else {
		p = Demo.basePath;
	}
	
	if(data.js) {
		data.js = ModuleBuilder.parseRelativePath(p, data.js);
	}
	
	if(data.css) {
		data.css = ModuleBuilder.parseRelativePath(p, data.css);
	}
	
	if(data.assets) {
		data.assets = ModuleBuilder.parseRelativePath(p, data.assets);
	}
	
	if(!data.relativeImages && data.css && data.assets){
		data.relativeImages = Path.relative(Path.dirname(data.css), data.assets).replace(/\\/g, '/');
	}
	ModuleBuilder.build({

		file: data,

		// log: function(){

		// }

		complete: function(result){
			
			var IO = require('utilskit/io');
			try{
				if(result.file.js && !isEmpty(result.js)) {
					var stream = IO.openWrite(result.file.js, {
						flags: 'w',
						encoding: Demo.Configs.encoding
					});
					ModuleBuilder.writeJs(result, stream);
					stream.end();
				}

				if(result.file.css && !isEmpty(result.css)) {
					var stream = IO.openWrite(result.file.css, {
						flags: 'w',
						encoding: Demo.Configs.encoding
					});
					ModuleBuilder.writeCss(result, stream);
					stream.end();
				}

				if(result.file.assets) {
					result.log("正在复制资源...");
					for(var key in result.assets){
						IO.copyFile(result.assets[key].from,  result.assets[key].to);
					}
				}

				result.log("生成完成");

			}catch(e){
				result.error(e.message);
			}

			context.response.end();
		}

	});


}

function isEmpty(obj){
	for(var key in obj){
		return false;
	}

	return true ;  
}
