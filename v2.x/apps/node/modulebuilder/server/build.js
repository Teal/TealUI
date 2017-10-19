


var buildFilePath = process.argv[2];

if (buildFilePath) {

    var ModuleBuilder = require('../assets/modulebuilder.js');
    var Demo = require('../../../demo/demo.js');

    ModuleBuilder.moduleBasePath = Demo.basePath + Demo.Configs.src;

    ModuleBuilder.load(buildFilePath, function (buildFile) {

        if (buildFile.js) {
            buildFile.js = ModuleBuilder.parseRelativePath(buildFilePath, buildFile.js);
        }

        if (buildFile.css) {
            buildFile.css = ModuleBuilder.parseRelativePath(buildFilePath, buildFile.css);
        }

        if (buildFile.assets) {
            buildFile.assets = ModuleBuilder.parseRelativePath(buildFilePath, buildFile.assets);
        }

        ModuleBuilder.build({

            file: buildFile,

            complete: function (result) {

                var IO = require('utilskit/io');
                try {
                    
                    if (result.file.js && !isEmpty(result.js)) {
                        var stream = IO.openWrite(result.file.js, {
                            flags: 'w',
                            encoding: Demo.Configs.encoding
                        });
                        ModuleBuilder.writeJs(result, stream);
                        stream.end();
                        result.log("生成 js 文件： " + result.file.js + "");
                    }

                    if (result.file.css && !isEmpty(result.css)) {
                        var stream = IO.openWrite(result.file.css, {
                            flags: 'w',
                            encoding: Demo.Configs.encoding
                        });
                        ModuleBuilder.writeCss(result, stream);
                        stream.end();
                        result.log("生成 css 文件： " + result.file.css + "");
                    }

                    if (result.file.assets && !isEmpty(result.assets)) {
                        result.log("正在复制资源...");
                        for (var key in result.assets) {
                            IO.copyFile(result.assets[key].from, result.assets[key].to);
                        }


                        result.log("生成图片文件夹： " + result.file.assets + "");
                    }

                    result.log("生成完成!");


                } catch (e) {
                    result.error(e.message);
                }
            }

        });

    });

} else {
    console.log("用法: build path/to/buildfile.js");
}


function isEmpty(obj) {
    for (var key in obj) {
        return false;
    }

    return true;
}
