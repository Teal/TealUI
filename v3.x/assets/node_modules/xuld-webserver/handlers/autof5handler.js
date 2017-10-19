

var FS = require('fs');

exports.processRequest = function (context) {

	FS.readFile(context.request.physicalPath, context.applicationInstance.fileEncoding, function(error, content) {
		if(error) {
			context.reportError(400, error);
			return;
		}
		
		var mime = context.applicationInstance.mimeTypes[context.request.filePathExtension];

		if (mime) {
		    context.response.contentType = mime;
		} else if (mime !== undefined) {
		    context.reportError(403);
		    return;
		}

		context.response.write(content);

		if(this.autoF5 !== false) {
			autoF5(context, content);
		}

		context.response.end();
	});


}

var serverPort = 7003;
var WS = require('ws');

var autoF5Server;

function autoF5(context, content){

	if(!autoF5Server) {
		autoF5Server = new WS.Server({port: serverPort});
	}

	// 为客户端追加 auto f5 的监听脚本。
	context.response.write("<script>\
		/*auto f5*/\
		var autoF5;\
		if(this.WebSocket) {\
			autoF5 = new WebSocket('ws://127.0.0.1:" + serverPort +"');\
			autoF5.onmessage = function(e) {this.close();location.reload();};\
		}\
		autoF5 = document.getElementsByTagName('script');\
		autoF5 = autoF5[autoF5.length-1];\
		autoF5.parentNode.removeChild(autoF5);\
		</script>");

	autoF5Server.on('connection', function(socket){

		var paths = [context.request.physicalPath];

		var watchers = [];

		function changeListener(e){

			// 停止所有监听器。
			watchers.forEach(function(watcher){
				watcher.close();
			});

			socket.send(e);

		}

		// 对每个文件进行监听。
		paths.forEach(function(path, index) {
			watchers[index] = FS.watch(path, {}, changeListener);
		});

	});

}
