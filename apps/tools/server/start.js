module.exports = require("./startserver");

require('child_process').exec("start " + module.exports.defaultApplication.rootUrl, function (error, stdout, stderr) {
	require('util').puts(stdout);
});