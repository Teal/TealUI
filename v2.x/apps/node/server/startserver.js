var WebServer = require('xfly/lib/webserver');
var HttpApplication = require('xfly/lib/httpapplication');
var Path = require('path');

var Configs = require('../../data/server');

var server = new WebServer();

for (var i = 0; i < Configs.websites.length; i++) {
	var website = Configs.websites[i];
	website.physicalPath = Path.resolve(__dirname, "../../../", website.physicalPath);
	server.add(new HttpApplication(website, Configs));
}

server.start();

module.exports = server;
