var Builder = require('../../lib/builder');


var builder = new Builder();

var sep = require("path").sep;
var testRootPath = __dirname + sep + "data" + sep;

console.log(testRootPath);

// Tell the builder the base oath to use.
builder.fromBasePath = testRootPath + "src";
builder.toBasePath = testRootPath + "build";
builder.build();

// builder.build(__dirname + sep + "src", __dirname + sep+ "build");