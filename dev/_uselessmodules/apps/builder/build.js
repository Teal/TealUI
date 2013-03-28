

var __bpm = {
	basePath: "../../../../src",
	from: "sampleproject",
	to: "sampleproject_build",
	"fromEncoding": "utf-8",
	"toEncoding": "utf-8",
	"rules": [
		{
			"compiler": "staticfile"
		},
		{
			"match": "\\.html$",
			"compiler": "html",
			"replaceBasePath": true,
			"autoBuild": true,
			"continue": true
		},
		{
			"match": "\\.js$",
			"compiler": "uglify-js",
			"continue": true
		},
		{
			"match": "\\.css$",
			"compiler": "css",
			"continue": true
		},
		{
			"match": "\\.(inc|dpl|tmp|psd|ai)$",
			"compiler": false,
			"continue": true
		},
		{
			"match": "assets/",
			"from": "(.*)/assets/(.*)",
			"to": "static/$1/$2"
		},
		{
			"match": "^../dpl",
			"from": "^../dpl",
			"to": "dpl",
			"replaceBasePath": "http://dpl.domain.com",
			"continue": true
		}
	]
};