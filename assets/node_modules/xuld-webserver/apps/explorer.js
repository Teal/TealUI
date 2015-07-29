/**
 * 用于支持 /explorer 在资源管理器定位到当前文件。
 * @author xuld
 */

exports.processRequest = function(context, path){
	path = context.request.mapPath(path);
	require('child_process').exec("explorer /select," + path.replace(/\//g, "\\"));
	context.response.end("<script>history.back();</script>");
};