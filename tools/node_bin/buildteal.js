
var ModuleBuilder = require('xuld-bootjs/modulebuilder');

ModuleBuilder.build({
    basePath: require('path').resolve(__dirname, '../../'),
    inputs: [require('path').resolve(__dirname, '../../../dist/TealUI.boot.js')],
    outputJs: require('path').resolve(__dirname, '../../../dist/TealUI.js'),
    outputCss: require('path').resolve(__dirname, '../../../dist/TealUI.css'),
    minify: true
});
