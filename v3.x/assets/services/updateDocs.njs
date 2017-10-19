
var Path = require('path'),
	IO = require('utilskit/io'),
	FS = require('fs'),
    Doc = require('../doc/doc.js'),
	DocParser = require('./docParser.js');

function parseDocs(path) {

    var content = IO.readFile(Path.resolve(Doc.basePath, "src", path), Doc.encoding);

    var docs = DocParser.parseDoc(content);

    var result = {
        path: path,
        apis: docs.map(function (api) {
            api.tags.line = api.line;
            api.tags.col = api.col;
            return api.tags;
        })
    };

    return result;

}

function parseDocString(path){

    var result = parseDocs(path);

    return 'Doc.writeApi(' + Doc.trace.dump(result).replace(/^\t/mg, "\t\t\t").replace(/\r?\n/g, "\r\n") + ');';

    //return '<script data-doc="' + path + '">\n' +
    //            'Doc.writeApi(' + Doc.trace.dump(result) + ');' +
    //            '\n<\/script>';

}

function updateDocs(path) {

    var content = IO.readFile(Path.resolve(Doc.basePath, "src", path), Doc.encoding);
  
    content = content.replace(/(<script[^>]+data-doc=(['"]?)([^"']*)\1[^>]*>\s*)([\s\S]*?)(\s*<\/script>)/ig, function (_, scriptStart, q, path, content, scriptEnd) {
        
        content = parseDocString(path);

        return scriptStart + content + scriptEnd;
    });


    IO.writeFile(Path.resolve(Doc.basePath, "src", path), content, Doc.encoding);

    return content;

}

var path = context.request.queryString.path;
context.response.contentType = 'text/javascript;charset=utf-8';


updateDocs(path);

