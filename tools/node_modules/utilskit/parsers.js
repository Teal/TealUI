

var Parser = {

	parseMarkDown: function(content, options, callback){
		var markdown = require('node-markdown');
		content = markdown.Markdown(content.toString(), options);
		callback(content);
	},

	parseMarkDownSync: function(content, options){
		var markdown = require('node-markdown');
		return markdown.Markdown(content.toString(), options);
	},

	parseEjs: function(content, options, callback) {
		var ejs = require('ejs');
		content = ejs.render(content.toString(), options);
		callback(content);
	},

	parseEjsSync: function(content, options) {
		var ejs = require('ejs');
		return ejs.render(content.toString(), options);
	},

	parseLess: function(content, options, callback) {
		var less = require('less');
		less.render(content, function(err, css){
			if(err){
				throw err;
			}
			
			callback(css);
		});
		
		
		
	},

	parseLessSync: function(content, options) {
		var less = require('less');
		less.render(content, function(err, css){
			if(err){
				throw err;
			}
			
			content = css;
		});
		
		
		return content;
	},

	parseSass: function(content, options, callback) {
		callback(this.parseSassSync(content, options));
	},

	parseSassSync: function(content, options) {
		var sass = require('sass');
		return sass.render(content, options);
	},

	parseCoffeeScript: function(content, options, callback) {
		callback(this.parseCoffeeScriptSync(content, options));
	},

	parseCoffeeScriptSync: function(content, options) {
		var coffee = require('coffee-script');
		return coffee.compile(content);
	},

	parseJade: function(content, options, callback) {
		var ejs = require('jade');
		content = ejs.render(content.toString(), options);
		callback(content);
	},

	parseJadeSync: function(content, options) {
		var ejs = require('jade');
		return ejs.render(content.toString(), options);
	},

	compressJsWithUglifyJsSync: function (content, options) {
		var uglifyJs = require("uglify-js");
		options = options || {};
		return uglifyJs.minify(content, {
			fromString: true,
			warnings: options.warnings
		}).code;
	},

	compressCssWithCssMinSync: function (content, options) {
		var cssmin = require('cssmin').cssmin;
		return cssmin(content);
	}

};


module.exports = Parser;