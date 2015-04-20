
exports.init = function(application) {
	application.markdownTpl = application.markdownTpl || "";
};

exports.processContent = function(content, context){
	context.response.contentType = 'text/html';
	context.response.write('<!DOCTYPE html>\r\n\
<html>\r\n\
	<head>\r\n\
		<meta charset="utf-8">\r\n\
		');
	context.response.write(context.applicationInstance.markdownTpl);
	context.response.write('\r\n\
	</head>\r\n\
<body>\r\n\
');

	content = parseMarkDownSync(content);
	context.response.write(content);
	context.response.write('\r\n\
	</body>\r\n\
</html>');
	context.response.end();
};

exports.processRequest = require('./common').processRequest;

function parseMarkDownSync(content, options){
	var markdown = require('node-markdown');
	return markdown.Markdown(content.toString(), options);
}
