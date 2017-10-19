/**
 * 用于支持 /exec 执行指定的批处理程序。
 * @author xuld
 */

exports.processRequest = function(context, path){
	path = context.request.mapPath(path);
	require('child_process').exec("start /select," + path.replace(/\//g, "\\"));
	context.response.end("<script>history.back();</script>");
};