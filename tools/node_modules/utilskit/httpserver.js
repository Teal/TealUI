/**
 * A simple HttpServer for Node.js.
 */
var Http = require('http'),
	Path = require('path'),
	Url = require('url'),
	FS = require('fs'),
	Util = require('util');

exports.createServer = function(rootPath, port, mimes, handlers) {
	
	function fileHttpHandler (filePath, urlInfo, request, response, postData, fileExt) {
		FS.readFile(filePath, function(error, content) {
			if(error) {
				reportError(500, "500 - Cannot Open File", response);
				return;
			}
			
			var mime = mimes[fileExt] || 'text/plain';

			response.writeHead(200, {
				'Content-Type' : mime
			});
			response.end(content);
		});
	}
	
	function directoryListHttpHandler (filePath, urlInfo, request, response) {
		FS.readdir(filePath, function(error, files) {
			if (error) {
				return reportError(400, "400 - No Permission", response);
			}
			
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write("<!DOCTYPE html>\n<html><head><meta charset='UTF-8'><title>" + filePath + "</title></head><body>");
			response.write("<h1>" + filePath + "</h1>");
			response.write("<ul style='list-style:none;font-family:courier new;'>");
			response.write("<li><a href='../'>../</a></li>");
			files.forEach(function(item) {
				var urlpath = urlInfo.pathname + item,
					itemStats = FS.statSync(rootPath + urlpath);
				if (itemStats.isDirectory()) {
					urlpath += "/";
					item += "/";
				}
				response.write("<li><a href='" + urlpath + "'>" + item + "</a></li>");
			});
			response.end("</ul></body></html>");
		});
	}
	
	function reportError(statusCode, message, response){
		response.writeHead(statusCode, {
			'Content-Type' : 'text/html'
		});
		response.end(message);
	}

	var server = Http.createServer(function(request, response) {
		var urlInfo = Url.parse(request.url, true);
		
		for(var i in urlInfo.query){
			urlInfo.query[i] = decodeURIComponent(urlInfo.query[i]);
		}
		
		var filePath = Path.normalize(rootPath + urlInfo.pathname);
		
		var postData = "";

		request.setEncoding("utf8");
		
		request.addListener("data", function(postDataChunk) {
			postData += postDataChunk;
			if (postData.length > 1e6) {
		        // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
		        request.connection.destroy();
		    }
		});
		
		request.addListener("end", function(postDataChunk) {
			postData = require('querystring').parse(decodeURIComponent(postData));
		});

		FS.stat(filePath, function(err, stats) {
			
			if(err){
				return reportError(404, "404 - Not Found - " + filePath, response);
			}
			
			if(stats.isFile()) {
					
				var fileExt = Path.extname(filePath);
				
				return (handlers[fileExt] || fileHttpHandler)(filePath, urlInfo, request, response, postData, fileExt);
			}
			
			if(stats.isDirectory()) {
				
				if(!(/\/$/).test(urlInfo.pathname)) {
					response.writeHead(302, {
						'Content-Type' : 'text/html',
						'Location': urlInfo.pathname + '/'
					});
					response.end('Object Moved');
					return;
				}
				
				FS.readFile(filePath + "index.html", function(error, content) {
					if(error) {
						return directoryListHttpHandler(filePath, urlInfo, request, response);
					}

					response.writeHead(200, {
						'Content-Type' : 'text/html'
					});
					response.end(content);
				});
				
			
				return;
			}
			
			
			
			
			
			
			reportError(400, "400 - No Permission - " + filePath, response);
		});
	});
	
	server.on('error', function (e) {
		if (e.code == 'EADDRINUSE') {
			console.error('Cannot create server on port ' + port);
		}
	});
	
	server.listen(port);
	
	console.log("Server running at http://localhost" + ((port === 80) ? "" : ":") + port + "/");

};


