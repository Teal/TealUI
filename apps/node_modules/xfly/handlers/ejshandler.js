

var Parser = require('./parsers');

exports.processContent = function(content, context){
    context.response.contentEncoding = 'UTF-8';
    context.response.contentType = 'text/html; charset=UTF-8';
	content = Parser.parseEjsSync(content, context.applicationInstance.configs.ejs);
	context.response.write(content);
	context.response.end();
};

exports.processRequest = require('./dynatichandler').processRequest;


