
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
}




response.end();

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

	ModuleBuilder.moduleBasePath = Demo.basePath + Demo.apps;




	ModuleBuilder.build({

		file: data,

		// log: function(){

		// }

		complete: function(){
			context.response.end();
		}

	});


}
