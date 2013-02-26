// 如果本源码被直接显示，说明使用了其它服务器。
// 本源码需要使用 xfly 服务器执行。
// 请执行 apps 目录下的 startserver.cmd 文件，并不要关闭本窗口。

var ModuleManager = require('./modulemanager');
var res = require('./res');

switch(request.queryString['action']){
	case 'create':
		var html = ModuleManager.createModule(request.queryString.path, request.queryString.tpl, request.queryString.title);
		res.redirect(context, context.request.queryString.postback || html);
		break;
	case 'delete':
		ModuleManager.deleteModule(request.queryString.path);
		res.redirect(context);
		break;
	case 'update':
		var dplInfo = {
			status: request.queryString.status
		};

		if(request.queryString.support) {
			if(request.queryString.support.length !== require('./demo').Configs.support.length){
				dplInfo.support = request.queryString.support.join("|");
			} else {
				dplInfo.support = '';
			}
		}

		if(request.queryString.hide) {
			dplInfo.hide = request.queryString.hide == "on";
		}

		ModuleManager.updateModuleInfo(request.queryString.path, request.queryString.title, dplInfo);
		res.redirect(context);
		break;
	case 'getlist':
		var list = ModuleManager.getModuleList(request.queryString.type || require('./demo').Configs.src);
		res.writeJsonp(context, list);
		break;
	case 'updatelist':
		ModuleManager.updateModuleList();
		res.redirect(context);
		break;
	default:
		res.redirect(context);
		break;

}

response.end();