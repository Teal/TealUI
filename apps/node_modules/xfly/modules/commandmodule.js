

var FS = require('fs');

var commands = {

    explorer: function (context, params) {
        params = context.request.mapPath(params);
        require('child_process').exec("explorer /select," + params);
        context.response.write('<script>history.back();</script>');
        context.response.end();
        return true;
    },

    start: function (context, params) {
        params = context.request.mapPath(params);
        require('child_process').exec("start " + params);
        context.response.write('<script>history.back();</script>');
        context.response.end();
        return true;
    }

};

exports.processRequest = function (context) {

    var command = /\/(\w+):/.exec(context.request.path);

    if (command) {
        var c = commands[command[1]];

        if (c) {
            return c.call(this, context, context.request.path.replace(command[0], ""));
        }

    }

    return false;
};
