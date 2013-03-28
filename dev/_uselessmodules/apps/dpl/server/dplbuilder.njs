﻿// 如果本源码被直接显示，说明使用了其它服务器。
// 本源码需要使用 xfly 服务器执行。请运行项目跟目录下的 startserver 文件。

var ModuleBuilderUI = require('./dplbuilderui');
var ModuleFile = require('./dplfile');
var System = require('./system');

response.contentType = 'text/html; charset=UTF-8';
switch(request.queryString['action']){
	case 'edit':
		writeEditUI(new ModuleFile(request.queryString.file));
		break;
	case 'create':
		writeEditUI(createNewModuleFile());
		break;
	case 'copy':
		writeEditUI(cloneFile(request.queryString.file));
		break;
	case 'save':
		saveData(getPostData());
		require('./res').redirect(context);
		break;
	case 'savebuild':
		writeBuildUI(saveData(getPostData()));
		break;
	case 'build':
		writeBuildUI(new ModuleFile(request.queryString.file));
		break;
	case 'preview':
		writePreviewUI(getPostData());
		break;
	default:
		writeEditUI(new ModuleFile(request.queryString.file));
		break;
		


}



response.end();

function getPostData() {

	var data = JSON.parse(request.form.data);
	var dplFile = new ModuleFile(request.queryString.file);
	dplFile.loadConfigs(data);

	return dplFile;
}

function writeEditUI(dplFile) {

	ModuleBuilderUI.writeHeader(response, '合成方案编辑');
	
	ModuleBuilderUI.writeModuleFileBuilder(response, dplFile);
	
	ModuleBuilderUI.writeFooter(response);
}

function saveData(dplFile) {
	
	var file = request.queryString.file;
	
	if(dplFile.path !== file){
		var IO = require(System.Configs.nodeModules + 'io');
		IO.deleteFile(file);
	}
	
	dplFile.save(dplFile.path);
	
	return dplFile;
}

function createNewModuleFile(){
	return cloneFile(System.Configs.physicalPath + System.Configs.templatePath + '/tpl.dpl');
}

function cloneFile(srcFile){
	var root = System.Configs.physicalPath + System.Configs.dplbuildFilesPath;
	var IO = require(System.Configs.nodeModules + 'io');

	var newFile = 'untitled';

	if(IO.exists(root + newFile + '.dpl')){
		var i = 2;
		while(IO.exists(root + 'untitled-' + i + '.dpl')){
			i++;
		}

		newFile = 'untitled-' + i;
	}
	var dplFile = new ModuleFile(srcFile);

	dplFile.path = require('path').normalize(root + newFile + '.dpl');
	dplFile.properties.js = dplFile.properties.js.replace('tpl.', newFile + '.') ;
	dplFile.properties.css = dplFile.properties.css.replace('tpl.', newFile + '.') ;
	dplFile.properties.images = dplFile.properties.images.replace('tpl.', newFile + '.') ;


	return dplFile;

}

function writeBuildUI(dplFile) {

	response.bufferOutput = false;

	ModuleBuilderUI.writeHeader(response, '合法方案生成');
	
	ModuleBuilderUI.writeModuleBuildLog(response, dplFile);


	
	ModuleBuilderUI.writeFooter(response, true);
}

function writePreviewUI(dplFile){

	ModuleBuilderUI.writeHeader(response, '合法方案预览');
	
	ModuleBuilderUI.writePreview(response, dplFile);
	
	ModuleBuilderUI.writeFooter(response);

}




