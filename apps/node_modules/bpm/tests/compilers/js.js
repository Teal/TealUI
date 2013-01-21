var Builder = require('../../lib/builder');
var Compiler = require('../../lib/compilers/js');


var sourceCode = __dirname + "/data/test.js";

var compileOptions = {

	configJs: function(context) {
		context.include.basePath = __dirname.replace(/\\/g, "/") + "/data/";
	}

};

var builder = new Builder();




var compiledCode = Compiler.BootCompiler.build(sourceCode, compileOptions, builder);

console.log(compiledCode);