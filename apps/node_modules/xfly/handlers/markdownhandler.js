

var Parser = require('./parsers');

exports.processContent = function(content, context){
	context.response.contentType = 'text/html';
	context.response.write('<!DOCTYPE html>\r\n\
<html>\r\n\
	<head>\r\n\
		<meta charset="utf-8">\r\n\
		');
	
	var tpl = context.applicationInstance.getConfig('markdown').tpl;
	if(tpl)
		context.response.write(tpl);
	context.response.write('\r\n\
	</head>\r\n\
<body>\r\n\
');
	
	content = Parser.parseMarkDownSync(content);
	context.response.write(content);
	context.response.write('\r\n\
	</body>\r\n\
</html>');
	context.response.end();
};

exports.processRequest = require('./dynatichandler').processRequest;


