

var Http = require('http'),
	Path = require('path'),
	Url = require('url'),
	Util = require('util'),
	HttpApplication = require('./httpapplication'),
	HttpContext = require('./httpcontext'),
	DefaultHttpWorkerRequest = require('./defaulthttpworkerrequest');

/**
 * 表示一个 Http 服务器。
 * @class
 */
function HttpServer() {

	var me = this;

	HttpApplication.apply(this, arguments);
	HttpServer.current = this;
	var server = this.socket = new Http.Server(function(request, response){
		var wr = new DefaultHttpWorkerRequest(request, response, me);
		me.processRequest(new HttpContext(wr));
	});
	
	server.on('error', function(e){
		if (e.code == 'EADDRINUSE') {
			me.error('[Error]Cannot create server on port ' + me.port + (me.address && me.address !== '0.0.0.0' ? ' of ' + me.address : ''));
		} else {
			me.error(e);
		}
	});
	
	server.on('listening', function(){
		me.isListening = true;
		var addr = me.address();
		me.address = addr.address;
		me.port = addr.port;
		me.init();
		me.onApplicationStart();
		
		me.log("[info]Server running at " + me.rootUrl);
	});
	
	server.on('close', function(){
		me.isListening = false;
		me.onApplicationStop();
		me.log("[info]Server stopped at " + me.rootUrl);
	});
}

HttpServer.prototype = {

	__proto__: HttpApplication.prototype,

	log: function(e){
		console.log(e);
	},
	
	error: function(e){
		console.error(e);
	},
	
	/**
	 * 启动当前服务器。
	 */
	start: function(callback){
		this.socket.listen(this.port, this.address, 511, callback && callback.bind(this));
	},
	
	/**
	 * 停止当前应用程序池管理的全部服务器。
	 */
	stop: function(callback){
		this.socket.close(callback && callback.bind(this));
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
		this.processRequest(new HttpContext(httpWorkerRequest));
	}
	
};

module.exports = HttpServer;