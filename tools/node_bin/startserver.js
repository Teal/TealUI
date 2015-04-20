
var HttpServer = require("xuld-webserver/lib/httpserver");
var Doc = require('../../assets/doc.js');

var server = new HttpServer({
    "port": require('url').parse(Doc.Configs.servicePath).port,
    "physicalPath": Doc.basePath
});

server.on('start', function () {
    console.log("已启动服务器 " + this.rootUrl);
});

server.on('stop', function () {
    console.log("已停止服务器 " + this.rootUrl);
});

server.on('error', function (e) {
    if (e.code == 'EADDRINUSE') {
        console.error('[错误]端口被占用，无法创建服务器 ' + this.port + (this.address && this.address !== '0.0.0.0' ? ' of ' + this.address : ''));
    } else {
        console.error(e);
    }
});

server.start();

module.exports = server;