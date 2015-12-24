

var Http = require('http'),
	Path = require('path'),
	Url = require('url'),
	HttpContext = require('./httpcontext'),
	DefaultHttpWorkerRequest = require('./defaulthttpworkerrequest');

/**
 * 表示一个 Web 服务器。
 * @class
 */
function WebServer(){
	WebServer.current = this;
	this.sockets = {};
}

function getFieldCount(obj){
	var sum = 0;
	for(var key in obj){
		sum++;
	}
	
	return sum;
}

/**
 * 所有 http 请求的核心处理函数。
 */
function listeningHandler(request, response){

	// 找出当前 HOST 关联的 HttpApplication 对象。
	var hostnames = this.hostnames;
	var hostname = request.headers.host;
	var application = hostnames[hostname] || hostnames['*']; 
	
	if(application) {
		var wr = new DefaultHttpWorkerRequest(request, response, application);
		application.processRequest(new HttpContext(wr));
	} else {
		response.writeHead(403, 'Bad Request');
		response.end('No Application Available');
	}
}

function getApplicationId(application){
			
	// 获取详细信息。
	var address = application.address;
	var port = application.port;
	
	address = address ? address === 'localhost' ? '127.0.0.1' : address : '0.0.0.0';
	
	return address + ':' + port;
}

WebServer.prototype = {

	log: function(e){
		console.log(e);
	},
	
	error: function(e){
		console.error(e);
	},

	defaultApplication: null,
	
	add: function(application){
	
		var me = this;
		var sockets = me.sockets;
		var appPoolId = application.id;
		var server = sockets[appPoolId];
		
		if(!server) {
			
			sockets[appPoolId] = server = new Http.Server(listeningHandler);
			
			// 创建 server 对应的支持的 application 数组。
			server.applications = [];
		
			server.on('error', function(e){
				var application = this.applications[0];
				if (e.code == 'EADDRINUSE') {
				    me.error('Cannot create server on port ' + application.port + (application.address && application.address !== '0.0.0.0' ? ' of ' + application.address : ''));
				} else {
					me.error(e);
				}
			});
			
			server.on('listening', function(){
				this.isListening = true;
				this.hostnames = {};
				var addr = this.address();
				var defaultApp;
				
				for(var i = 0;i < this.applications.length; i++){
					var application = this.applications[i];
					application.address = addr.address;
					application.port = addr.port;
					
					var hostname = application.hostname;
					if(!defaultApp && hostname === '*') {
						me.defaultApplication = defaultApp = application;
					}
					
					this.hostnames[hostname] = application;
					
					if(application.hosts){
						application.hosts.split(';').forEach(function(value){
							this.hostnames[value] = application;
						}, this);
					}

					application.init();
					application.onApplicationStart();
				}
				
				me.log("Server started successfully at " + (defaultApp || this.applications[0]).rootUrl + "\r\nClose this window to stop server.");
			});
			
			server.on('close', function(){
				this.isListening = false;
				var application = this.applications[0];
				var defaultApp;
				
				for(var i = 0;i < server.applications.length; i++){
					this.applications[i].onApplicationStop();
					
					if(!defaultApp && application.hostname === '*') {
						defaultApp = application;
					}
				}
				me.log("Server stopped at " + (defaultApp || this.applications[0]).rootUrl);
			});

			if (!me.defaultApplication) {
				me.defaultApplication = application;
			}
			
		}
		
		// 将当前 application 添加到 server 的支持范围内。
		server.applications.push(application);
		application.socket = server;
		
	},
	
	remove: function(application){
	
		var me = this;
		var sockets = me.sockets;
		var appPoolId = getApplicationId(application);
		var server = sockets[appPoolId];
		
		if(server) {
			var i = server.applications.indexOf(application);
			if(i >= 0){
				server.applications.splice(application, 1);

				if (this.defaultApplication == application) {
					this.defaultApplication = server.applications[0];
				}
			}
		}
	},
	
	/**
	 * 启动当前应用程序池管理的全部服务器。
	 */
	start: function(callback){
		var me = this;
		var sockets = me.sockets;
		var current = getFieldCount(sockets);
		for(var id in sockets){
			var server = sockets[id];
			
			// 启动对应的服务器。
			if(!server.isListening){
				var application = server.applications[0];
				server.listen(application.port, application.address, 511, callback && function(){
					if(--current === 0){
						callback.call(me);
					}
				});
			} else {
				--current;
			}
		}
	},
	
	/**
	 * 停止当前应用程序池管理的全部服务器。
	 */
	stop: function(callback){
		var me = this;
		var sockets = me.sockets;
		var current = getFieldCount(sockets);
		
		for(var id in sockets){
			var server = sockets[id];
			
			// 启动对应的服务器。
			if(server.isListening){
				server.close(callback && function(){
					if(--current === 0){
						callback.call(me);
					}
				});
			} else {
				--current;
			}
		}
	},
	
	/**
	 * 重启当前应用程序池管理的全部服务器。
	 */
	restart: function(){
		this.stop(this.start);
	},
	
	/**
	 * 使用当前服务器处理指定的请求。
	 */
	process: function(httpWorkerRequest){
		var address = httpWorkerRequest.getLocalAddress();
		var port = httpWorkerRequest.getLocalPort();
		var host = httpWorkerRequest.getRequestHeader('Host') || address;
		
		if(port != 80){
			host += ':' + port;
		}
		
		var me = this;
		var sockets = me.sockets;
		
		for(var id in sockets){
			var server = sockets[id];
			var serverAddr = server.address();
			
			if(serverAddr.address === address && serverAddr.port === port) {
				var application = server.hostnames[hostname] || server.hostnames['*']; 
				application.process(httpWorkerRequest);
				return;
			}
			
		}
		
		httpWorkerRequest.sendStatus(403, 'Bad Request');
		httpWorkerRequest.sendResponseFromMemory('No Application Available');
		httpWorkerRequest.flushResponse(true);
		httpWorkerRequest.endOfRequest();
		
	}
	
};

module.exports = WebServer;