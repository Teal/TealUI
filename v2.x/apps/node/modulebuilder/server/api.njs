
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
	case 'save':
		save(context, request.form.data);
		break;
	case 'build':
		build(context, request.form.data);
		break;
	case 'read':
		var IO = require('utilskit/io');
		if(IO.exists(request.queryString.path)) {
			var content = IO.readFile(request.queryString.path);
			writeJsonp(context, content);
		}
		response.end();
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


function save(context, data){
	
	var ModuleBuilder = require('../assets/modulebuilder.js');

	data = JSON.parse(data);

	ModuleBuilder.moduleBasePath = Demo.basePath + Demo.Configs.src;
	
	var Path = require('path');

	var p = data.path;
	
	if(p) {
		p = Path.resolve(Demo.basePath, p.replace(Demo.Configs.serverBaseUrl, ""));
		
		require('utilskit/io').writeFile(p, ModuleBuilder.BuildFile.prototype.save.call(data), Demo.Configs.encoding);
		
		context.response.write("<style>  body{font-size: 12px;}</style>保存成功!");
	
	} else {
		
		context.response.write("<style>  body{font-size: 12px;}</style>请输入配置文件保存位置");
	
	}
	
	context.response.end();
}

function build(context, data){


	context.response.bufferOutput = false;

	context.response.write('<style>  body{font-size: 12px;}</style><div id="step4_tip">正在准备生成...</div><script>function log(m){document.getElementById(\"step4_tip\").innerHTML = m}</script>');   
	
	var ModuleBuilder = require('../assets/modulebuilder.js');

	data = JSON.parse(data);

	ModuleBuilder.moduleBasePath = Demo.basePath + Demo.Configs.src;
	
	var Path = require('path');

	var p = data.path;
	
	if(p) {
		p = Path.resolve(Demo.basePath, p.replace(Demo.Configs.serverBaseUrl, ""));
		
		require('utilskit/io').writeFile(p, ModuleBuilder.BuildFile.prototype.save.call(data), Demo.Configs.encoding);
		
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
	
	ModuleBuilder.build({

		file: data,

		log: function(message){
			context.response.write("<script>log('" + message + "');</script>");
		},

		error: function(message){
			context.response.write("" + message + "<br>");
		},

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
					context.response.write("生成 js 文件：<span>" + result.file.js + "</span><br>");
				}

				if(result.file.css && !isEmpty(result.css)) {
					var stream = IO.openWrite(result.file.css, {
						flags: 'w',
						encoding: Demo.Configs.encoding
					});
					ModuleBuilder.writeCss(result, stream);
					stream.end();
					context.response.write("生成 css 文件：<span>" + result.file.css + "</span><br>");
				}

				if(result.file.assets && !isEmpty(result.assets)) {
					result.log("正在复制资源...");
					for(var key in result.assets){
						IO.copyFile(result.assets[key].from,  result.assets[key].to);
					}
					
					
					context.response.write("生成图片文件夹：<span>" + result.file.assets + "</span><br>");
				}

				result.log("生成完成!");
				

			} catch(e) {
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
