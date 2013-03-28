var fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http');

module.exports = {
    debug: false,
    log: function(msg, type){
        var self = this;
        type = type ? type : 'info';
        if(msg && (self.debug || (!self.debug && type != 'debug'))){
            console.log((type ? '[' + type.toUpperCase() + '] ' : '') + msg);
        }
    },
    /**
     * analyze @charset first.
     * @example:
     * 1. @charset 'gbk';
     * 2. @charset "gbk";
     * @link: https://developer.mozilla.org/en/CSS/@charset
     */
    detectCharset: function(input){
        var result = /@charset\s+['|"](\w*)["|'];/.exec(input),
            charset = 'UTF-8';
        if(result && result[1]){
            charset = result[1];
        }
//        else{
//            var detect = jschardet.detect(input);
//            if(detect && detect.confidence > 0.9){
//                charset = detect.encoding;
//            }
//        }
        return charset;
    },
    mkdirSync: function(dirpath, mode) {
        var self = this;
        if(!fs.existsSync(dirpath)) {
            // try to create parent dir first.
            self.mkdirSync(path.dirname(dirpath), mode);
            fs.mkdirSync(dirpath, mode);
        }
    },
    getRemoteFile: function(filePath, callback){
        var self = this,
            content = null,
            buffers = [],
            count = 0,
            options = url.parse(filePath);
        // TODO https ?
        if(typeof options != 'undefined'){
//            debug && console.log('start request');
            var req = http.request(options, function(res){
//                debug && console.log('status: ' + res.statusCode);
                var charset = 'utf-8';
                if(typeof res.headers['content-type'] !== 'undefined'){
                    var regResult = res.headers['content-type'].match(/;charset=(\S+)/);
                    if(regResult !== null && regResult[1]){
                        charset = regResult[1];
                        self.log('The charset of url ' + filePath + ' is: ' + charset, 'debug');
                    }
                }
                res.on('data', function(chunk){
    //                    content += chunk;
                    buffers.push(chunk);
                    count += chunk.length;
                });
                res.on('end', function(){
                    switch(buffers.length) {
                        case 0: content = new Buffer(0);
                            break;
                        case 1: content = buffers[0];
                            break;
                        default:
                            content = new Buffer(count);
                            for (var i = 0, pos = 0, l = buffers.length; i < l; i++) {
                                var chunk = buffers[i];
                                chunk.copy(content, pos);
                                pos += chunk.length;
                            }
                            break;
                    }
                    callback && callback(content, charset);
                });
            });
            req.on('error', function(e){
                self.log('request error: ' + e, 'error');
            });
            req.end();
        }else{
            self.log('parse error: ' + filePath, 'error');
            callback && callback(content);
        }
    }

};