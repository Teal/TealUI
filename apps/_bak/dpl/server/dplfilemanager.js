/**
 * @fileOverview 用于增删 .dpl 文件及组件列表的搜索。
 */



var System = require('./system'),
	Path = require('path'),
	IO = require(System.Configs.nodeModules + 'io');

/**
 * 管理 .dpl 文件的工具。
 */
var ModuleFileManager = {

	/**
	 * 创建或更新一个新的 DPL 文件。
     * @param {String} fullPath 要处理的文件绝对路径。
     * @param {Object} dplFileData 创建的文件数据。
	 */
    createModuleFile: function (fullPath, dplFileData) {
        var ModuleFile = require('./dplfile');
        var dplFile = new ModuleFile();
        dplFile.loadConfigs(dplFileData);
        dplFile.save(fullPath);
	},

	/**
	 * 删除一个 DPL 文件。
     * @param {String} fullPath 要处理的文件绝对路径。
	 */
    deleteModuleFile: function (fullPath) {
        IO.deleteFile(fullPath);
    },

    /**
	 * 预览一个 DPL 文件。
     * @param {String} fullPath 要处理的文件绝对路径。
	 */
    previewModuleFile: function (fullPath) {
        IO.copyFile(fromFullPath, toFullPath);
    },

    /**
	 * 编译一个 DPL 文件。
     * @param {String} fullPath 要处理的文件绝对路径。
	 */
    buildModuleFile: function (fullPath) {
        var ModuleFile = require('./dplfile');
        var ModuleBuilder = require('./dplbuilder');
        var dplFile = new ModuleFile(fullPath);
        ModuleBuilder.build(dplFile);
    },

    /**
	 * 复制一个 DPL 文件。
     * @param {String} fromFullPath 要复制的源文件绝对路径。
     * @param {String} toFullPath 要生成的文件绝对路径。
	 */
    copyModuleFile: function (fromFullPath, toFullPath) {
        IO.copyFile(fromFullPath, toFullPath);
    },

	/**
	 * 搜索 .dpl 文件。
	 */
	getModuleFileList: function (folder) {

	    folder = Path.resolve(System.Configs.physicalPath, folder) + Path.sep;

	    var files = IO.getFiles(folder);
	    var r = {};

	    for (var i = 0; i < files.length; i++) {
	        if (Path.extname(files[i]) === '.dpl') {
	            var fullPath = folder + files[i];
	            var title = (/^title\s+(.*)$/m.exec(IO.readFile(fullPath)) || [0, ""])[1] || files[i];
	            if (r[title]) {

	                // 更新原缓存。
	                r[title + ' (' + r[title] + ')'] = r[title];
	                delete r[title];

                    // 存入新内容。
	                r[title + ' (' + folder + files[i] + ')'] = folder + files[i];

	            } else {
	                r[title] = folder + files[i];
	            }
	        }
	    }

	    return r;
	},
	
	/**
	 * 获取一个 DPL 对应的源码。
	 * @param {String} dplPath DPL 完整路径。
	 * @param {String} sourceType '': 获取 js 和 css， 'js': 仅获取 js， 'css': 仅获取 css。
	 * @return {Object} 返回 {路径: '完整路径的方式'}
	 */
	getModuleSources: function(dplPath, sourceType){
        var ModuleBuilder = require('./dplbuilder');
        ModuleBuilder.init();
        var r = {};
        
        if(!sourceType || sourceType === 'js'){
        	r[ModuleBuilder.getFileName(dplPath, false)] = ModuleBuilder.getFullPath(dplPath, false);
        }
        
        if(!sourceType || sourceType === 'css'){
        	r[ModuleBuilder.getFileName(dplPath, true)] = ModuleBuilder.getFullPath(dplPath, true);
        }
        
        return r;
        
	},
	
	/**
	 * 获取一个 DPL 对应的源码。
	 * @param {String} dplPath DPL 完整路径。
	 * @param {String} sourceType '': 获取 js 和 css， 'js': 仅获取 js， 'css': 仅获取 css。
	 * @return {Object} 返回 [js: [path1, path2], css: [path1, path2]]
	 */
	getModuleRefs: function(dplPath, sourceType){
        var ModuleBuilder = require('./dplbuilder');
        ModuleBuilder.init();
        var r = {};
        
        if(!sourceType || sourceType === 'js'){
        	var t = ModuleBuilder.getRefs(dplPath, false);
        	add(t.js, 'js');
        	add(t.css, 'css');
        }
        
        if(!sourceType || sourceType === 'css'){
        	var t = ModuleBuilder.getRefs(dplPath, true);
        	add(t.js, 'js');
        	add(t.css, 'css');
        }
        
        delete r[dplPath];
        
        function add(array, type){
        	for(var i = 0; i < array.length; i++){
        		var c = r[array[i]];
        		if(c === undefined){
        			 r[array[i]] = type;
        		} else if((c === 'js' && type === 'css') || (c === 'css' && type === 'js')){
        			r[array[i]] = '';
        		}
        	}
        }
        
        return r;
        
	}

};



module.exports = ModuleFileManager;
