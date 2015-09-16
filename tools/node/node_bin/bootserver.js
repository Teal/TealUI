module.exports = require("./startserver");

require('child_process').exec("start " + module.exports.rootUrl, function (error, stdout, stderr) {
	console.log(stdout);
});