

function writeJsonp(context, data) {

    data = JSON.stringify(data);

    if (context.request.queryString.callback) {
        context.response.write(context.request.queryString.callback + '(' + data + ')');
    } else {
        context.response.write(data);
    }

}

function redirect(context, url) {

    url = url || context.request.queryString.postback;

    if (url) {

    	if (!/^http:/.test(url)) {
    		url = url.replace(/^file:\/\/\//, '').replace(/\\/g, "/");
            var Demo = require('./demo');
            url = url.replace(Demo.basePath.replace(/\\/g, "/"), Demo.Configs.serverBaseUrl.replace(/\/$/, ""));
            context.response.redirect(url);

        } else {
            context.response.redirect(url);
        }

    }

}


exports.writeJsonp = writeJsonp;
exports.redirect = redirect;