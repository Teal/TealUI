/**
 * 用于支持 URL 重写。
 * @author xuld
 */

var Url = require('url');
var Http = require('http');

exports.init = function(application){
	application.urlRewrites = application.urlRewrites || {};
};

exports.processRequest = function(context){
	var urlRewrites = context.applicationInstance.urlRewrites;

	var regs = context.applicationInstance.resolvedUrlRewrites || (context.applicationInstance.resolvedUrlRewrites = {});

	for(var rule in urlRewrites){
		var regexp = regs[rule] || (regs[rule] = createRegExp(rule));
		var path = context.request.path.substr(1);
		if(regexp.test(path)){
			var newPath = path.replace(regexp, urlRewrites[rule]);
		
			if(/^https?:\/\//.test(newPath)){
				// 反向代理。
				
				if(newPath.charAt(4) === 's'){
					httpsProxy(newPath, context);
				} else {
					httpProxy(newPath, context);
				}
			
			} else {
				context.rewritePath('/' + newPath);
			}
			return true;
		}
	}
	return false;
};

function createRegExp(text){
	return new RegExp(text);
}

function httpProxy(url, context){

	url = Url.parse(url, false);
	url.method = context.request.httpMethod;
	url.headers = {};
	
	for(var h in context.request.headers){
		url.headers[h] = context.request.headers[h];
	}
	
	url.headers.host = url.host;
	if(url.port &&  url.port !== 80){
		url.headers.host += ':' + url.port;
	}

	var req = Http.request(url, function(srcRes) {
		var destRes = context.response;
		
		srcRes.on('data', function (chunk) {
			destRes.binaryWrite(chunk);
		});
		
		srcRes.on('end', function(){
			destRes.end();
		});
		
		destRes.writeHead(srcRes.statusCode, srcRes.headers);
	
	} );
	
	var content = context.request.content;
	
	if(content){
		req.write(content);
	}
	
	req.end();
}

function httpsProxy(url, context){
	
}
