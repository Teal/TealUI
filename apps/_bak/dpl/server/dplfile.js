/**
 * @fileOverview 用于增删组件, 及组件列表的搜索。
 */



var System = require('./system'),
	Path = require('path'),
	IO = require(System.Configs.nodeModules + 'io');
	
var defaultConfigs = {
	title: '',
    js: '',
    css: '',
    images: '',
    addHeader: true,
    resolveRefs: true,
    removeTrace: true,
    removeAssert: false,
    removeConsole: false,
    removeUsing: true,
    removeImports: true,
    jsCode: 'none',
    cssCode: 'none',
    parseMacro: false,
    defines: '',
    encoding: 'utf-8',
    lineBreak: '\r\n',
    base: ''
};

/**
 * @class DplFile 处理 .dpl 文件。
 */
function DplFile(path) {
    
    // 创建字段。
    this.properties = {};
    this.dpls = [];
    this.requires = [];

    System.extend(this.properties, defaultConfigs);
    
    if (path) {
        this.load(path);
    }

}

DplFile.prototype = {

    path: '',

    _loadDplSource: function(content){

        content.split(/[\r\n]+/).forEach(function (line) {
            line = line.replace(/;\s*$/, "").trim();

            // 删除注释。
            if (/#|\/\/|;/.test(line)) {
                return;
            }

            var space = line.indexOf(' ');
            var key = line.substr(0, space);
            var value = line.substr(space).trim();

            switch (key) {
                case 'import':
                case '-import':
                    key += 's';
                case 'using':
                case 'imports':
                case 'include':
                case '-using':
                case '-imports':
                case '-include':
                    this.dpls.push({ type: key, path: value });
                    break;
                case 'requires':
                case 'require':
                    this.requires.push(value);
                    break;
                default:
                    if (typeof this.properties[key] === 'boolean') {
                        this.properties[key] = value !== 'false';
                    } else {
                        this.properties[key] = value;
                    }

                    //if (key in this.properties) {
                    //    this.properties[key] = value;
                    //} else {
                    //    console.log('Cannot recognise key "' + key + '"');
                    //}
                    break;

            }

        }, this);

    },

    _saveDplSource: function () {
		var content = '';
		
		content += '# 基本属性\r\n';
		for(var props in this.properties){
			if(this.properties[props] !== defaultConfigs[props]){
				content += props + ' ' + this.properties[props] + '\r\n';	
			}
		}
		content += '\r\n# 组件依赖\r\n';
		for(var i = 0; i < this.requires.length; i++) {
			content += 'require ' + this.requires[i] + '\r\n';	
		}
		
		content += '\r\n# 组件列表\r\n';
		for(var i = 0; i < this.dpls.length; i++) {
			content += this.dpls[i].type + ' ' + this.dpls[i].path + '\r\n';	
		}
		
		return content;
    },

    /**
     * 从 JSON 对象读取配置。
     */
    loadConfigs: function (data) {
		this.path = Path.normalize(data.path);
		System.extend(this.properties, data.properties);
		this.requires = data.requires.slice(0);
		this.dpls = data.dpls.slice(0);
    },

    /**
     * 从指定的路径载入配置信息。
     */
    load: function (path) {
        this.path = path = Path.resolve(System.Configs.physicalPath + System.Configs.dplbuildFilesPath, path);
        var content = IO.readFile(path);

        if (content) {
            this._loadDplSource(content);
        }

    },

    /**
     * 将当前的配置信息保存到指定的路径。
     */
    save: function (path) {
    	path = path || this.path;
        var content = this._saveDplSource();
        IO.writeFile(path, content);
    }

};



module.exports = DplFile;