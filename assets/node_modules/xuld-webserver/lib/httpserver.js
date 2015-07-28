

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
		me.process(new DefaultHttpWorkerRequest(request, response, me));
	});
	
	server.on('error', function(e){
		me.onError(e);
	});
	
	server.on('listening', function(){
		me.isListening = true;
		var addr = this.address();
		me.address = addr.address;
		me.port = addr.port;
		me.init();
		me.onApplicationStart();
	});
	
	server.on('close', function(){
		me.isListening = false;
		me.onApplicationStop();
	});
}

HttpServer.prototype = {

	__proto__: HttpApplication.prototype,

	/**
	 * 当前应用程序对应的实际的 Http.Server 对象。
	 * @type {Http.Server}
	 */
	socket: null,
	
	onError: function(e){
		this.emit('error', e, this);
	},
	
	/**
	 * 启动当前服务器。
	 */
	start: function(callback){
		this.socket.listen(this.port, this.address, 511, callback);
	},
	
	/**
	 * 停止当前应用程序池管理的全部服务器。
	 */
	stop: function(callback){
		this.socket.close(callback);
	},
	
	/**
	 * 重启当前应用程序池管理的全部服务器。
	 */
	restart: function(){
		this.stop(this.start.bind(this));
	}

};

module.exports = HttpServer;