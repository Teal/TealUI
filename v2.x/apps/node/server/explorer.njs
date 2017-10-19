
var path = request.queryString.path;
path = request.mapPath(path);
require('child_process').exec("explorer /select," + path.replace(/\//g, "\\"));