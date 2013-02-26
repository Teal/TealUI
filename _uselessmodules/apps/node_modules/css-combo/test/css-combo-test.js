var CssCombo = require('../lib/index'),
    path = require('path'),
    fs = require('fs'),
    iconv = require('iconv-lite');

CssCombo.build({
    target: path.resolve(__dirname, 'css/test.source.css'),
    debug: true,
    inputEncoding: 'gbk',
    outputEncoding: 'gbk',
    output:path.resolve(__dirname, 'css/test.combo.css'),
    compress: 0
}, function(e, report){
    if(e){
        console.dir(e);
    }else{
        console.log('success');
        console.log('report');
        console.log(report);
        if (report.target !== path.resolve(__dirname, 'css/test.source.css')) {
            throw new Error('report.target Error');
        }
        if (report.output !== path.resolve(__dirname, 'css/test.combo.css')) {
            throw new Error('report.output Error');
        }
        if (report.imports.length !== 5) {
            throw new Error('report.imports Error');
        }
    }
});