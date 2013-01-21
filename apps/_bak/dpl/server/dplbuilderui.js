/**
 * @fileOverview 用于合成组件。
 */



var System = require('./system'),
    DplFile = require('./dplfile'),
	Path = require('path'),
	IO = require(System.Configs.nodeModules + 'io');

function writeHeader(response, title){
	
	var rootPath = System.Configs.rootUrl;
	
	response.write('\
	<!DOCTYPE html>\
	<html>\
	<head>\
	    <meta charset="UTF-8">\
	    <title>' + title + '</title>\
	    <link href="' + rootPath + 'assets/dpl/assets/base.css" rel="stylesheet" type="text/css">\
	    <link href="' + rootPath + 'assets/dpl/assets/dplbuilder.css" rel="stylesheet" type="text/css">\
	    <script src="' + rootPath + 'assets/dpl/assets/base.js" type="text/javascript"></script>\
	    <script src="' + rootPath + 'assets/demo/demo.js" type="text/javascript"></script>\
		<script src="' + rootPath + 'assets/dpl/assets/jsonp.js" type="text/javascript"></script>\
		<script src="' + rootPath + 'assets/dpl/assets/dplbuilder.js" type="text/javascript"></script>\
	</head>\
	<body>\
	\
	    <article class="demo">');
}

function writeFooter(response){
	response.write('\
	    </article>\
	\
	</body>\
	</html>');
}

function writeDplFileBuilder(response, dplFile){
	var p = dplFile.properties;
	response.write();
    
    response.write('<script>var DplFile=');
    
    response.write(JSON.stringify({
    	properties: dplFile.properties,
    	dpls: dplFile.dpls,
    	requires: dplFile.requires,
    	path: dplFile.path
   	}));
    
    response.write(';  DplBuilder.loadDplFile();</script>');
    
}

function writeDplBuildLog(response, dplFile){
	
	var DplBuilder = require('./dplbuilder');
	
	response.write('<div class="x-right"><a style="cursor: default" class="x-button x-button-info" href="?action=build&file=' + dplFile.path + '">重新生成</a>  <a style="cursor: default" class="x-button" href="../dplfilelist.html" title="合法方案列表">返回列表</a>  <a style="cursor: default" class="x-button" href="?action=edit&file=' + dplFile.path + '">重新编辑</a></div>')
	
	response.write('<h2 class="demo">合成日志 <small>合成完成前请勿关闭本页面</small></h2>')
	
	
	DplBuilder.info = function(content){
		response.write('<h4 class="demo">' + content + '</h4>');
	};
	
	DplBuilder.infoFile = function(content, path){
		this.log(content + '<a href="/explorer:' + path.replace(/\\/g, "/") + '">' + path + '</a>'+ '\r\n');
	};
	
	DplBuilder.log = function(content){
		response.write('<pre>' + content + '</pre>');
		//for(var i = 0; i < 1000; i++){console.log(i)}
	};
	
	DplBuilder.error = function(content){
		response.write('<pre style="color:red">' + content + '</pre>');
	};

	DplBuilder.end = function () {
	    writeFooter(response);
	    response.end();
	};
	
	DplBuilder.build(dplFile);
	
	
}

function writePreview(response, dplFile) {

    var DplBuilder = require('./dplbuilder');

    response.write('合法方案: <strong>' + dplFile.path + '</strong>');
    
    var list = DplBuilder.getFinalList(dplFile);

    response.write('<h3 class="demo">最终的 js 列表</h3><table class="x-table"><tr><th>组件</th><th>来自</th></tr>');
    var d = list.js;
    for (var i = 0; i < d.length; i++) {
        response.write('<tr><td>');
        response.write('<a href="' + System.Configs.rootUrl + System.Configs.src + '/' + d[i].path + '" target="_blank">' + d[i].name + '</a>');
        response.write('</td><td>');
        var flag = false;
        for (var j = 0; j < d[i].parent.length; j++) {
            if (d[i].parent[j]) {
                if (flag) {
                    response.write('<br>');
                } else {
                    flag = true;
                }
                response.write('<a href="' + System.Configs.rootUrl + System.Configs.src + '/' + d[i].parent[j].path + '" target="_blank">' + (d[i].parent[j].isStyle ? '[css]' : '[js]') + d[i].parent[j].name + '</a>');
            }
        }
        response.write('</td></tr>');
    }

    response.write('</table>');

    response.write('<h3 class="demo">最终的 css 列表</h3><table class="x-table"><tr><th>组件</th><th>来自</th></tr>');
    var d = list.js;
    for (var i = 0; i < d.length; i++) {
        response.write('<tr><td>');
        response.write('<a href="' + System.Configs.rootUrl + System.Configs.src + '/' + d[i].path + '" target="_blank">' + d[i].name + '</a>');
        response.write('</td><td>');
        var flag = false;
        for (var j = 0; j < d[i].parent.length; j++) {
            if (d[i].parent[j]) {
                if (flag) {
                    response.write('<br>');
                } else {
                    flag = true;
                }
                response.write('<a href="' + System.Configs.rootUrl + System.Configs.src + '/' + d[i].parent[j].path + '" target="_blank">' + (d[i].parent[j].isStyle ? '[css]' : '[js]') + d[i].parent[j].name + '</a>');
            }
        }
        response.write('</td></tr>');
    }

    response.write('</table>');
	
}

exports.writeHeader = writeHeader;
exports.writeFooter = writeFooter;
exports.writeDplFileBuilder = writeDplFileBuilder;
exports.writeDplBuildLog = writeDplBuildLog;
exports.writePreview = writePreview;






