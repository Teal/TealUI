

var FS = require('fs');
	
exports.processContent = function(content, context){
	context.response.contentType = 'text/plain';
	context.response.write(content);
	context.response.end();
};

exports.processRequest = function(context){
	var me = this;
	FS.readFile(context.request.physicalPath, function(error, content) {
		if(error) {
			context.reportError(400, error);
			return;
		}
		
		me.processContent(content, context);
	});
	
	return true;
};
