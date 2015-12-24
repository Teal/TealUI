

var FS = require('fs');

exports.init = function (application) {
	application.mimeTypes = application.mimeTypes || {};
};

exports.processRequest = function (context) {
	FS.readFile(context.request.physicalPath, function(error, content) {
		if(error) {
			context.reportError(400, error);
			return;
		}
		
		var mime = context.applicationInstance.mimeTypes[context.request.filePathExtension];

		if (mime) {
		    context.response.contentType = mime;
		} else if (mime === null) {
		    context.reportError(403);
		    return;
		}

		context.response.binaryWrite(content);
		context.response.end();
	});
	
	return true;
};
