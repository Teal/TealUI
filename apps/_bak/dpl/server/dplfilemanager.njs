// 如果本源码被直接显示，说明使用了其它服务器。
// 本源码需要使用 xfly 服务器执行。请运行项目跟目录下的 startserver 文件。

var System = require('./system');
var ModuleFileManager = require('./dplfilemanager');
var res = require('./res');

switch(request.queryString['action']){
	case 'get':
	case 'getlist':
		var list = ModuleFileManager.getModuleFileList(System.Configs.physicalPath + System.Configs.dplbuildFilesPath);
		res.writeJsonp(context, list);
		break;
	case 'delete':
		var list = ModuleFileManager.deleteModuleFile(request.queryString.file);
		res.redirect(context);
		break;
	case 'getsource':
		var list = ModuleFileManager.getModuleSources(request.queryString.path, request.queryString.type);
		res.writeJsonp(context, list);
		break;
	case 'getrefs':
		var list = ModuleFileManager.getModuleRefs(request.queryString.path, request.queryString.type);
		res.writeJsonp(context, list);
		break;

}

response.end();