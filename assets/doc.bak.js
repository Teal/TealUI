/**
 * @fileOverview 本文件提供仅供文档演示的相关代码，不是组件的一部分。
 * @author xuld
 */

/**
 * 提供文档操作的相关 API。
 */
var Doc = Doc || {};

// #region 配置

/**
 * 全局配置。
 */
Doc.Configs = {

    /**
     * 当前项目的版本。
     */
    version: '3.0beta',

    /**
     * 当前项目的基础路径。
     */
    basePath: '../',

    /**
	 * 用于处理所有前端请求的服务地址。
	 */
    servicePath: 'http://localhost:5373/tools/customize/service/api.njs',

    /**
     * 所有可用文件夹。
     */
    folders: {

        /**
         * 存放开发系统文件的文件夹。
         */
        assets: {
            path: 'assets',
            pageName: '工具',
            pageTitle: '系统工具',
            pageDescription: '提供内部开发使用的工具'
        },

        /**
         * 存放开发系统文件的文件夹。
         */
        tools: {
            path: 'tools',
            pageName: '工具',
            pageTitle: '开发者工具',
            pageDescription: 'TealUI 提供了组件定制、代码压缩、合并等常用工具'
        },

        /**
         * 存放文档文件的文件夹。
         */
        docs: {
            path: 'docs',
            pageName: '文档',
            pageTitle: '如何开始',
            pageDescription: '快速上手组件'
        },

        /**
         * 存放文档文件的文件夹。
         */
        demos: {
            path: 'src',
            pageName: '组件',
            pageTitle: '组件列表',
            pageDescription: 'TealUI 提供了 200 多个常用组件，满足常用需求。每个组件依赖性小，多数可以独立使用。'
        },

        /**
         * 存放源文件的文件夹。
         */
        sources: {
            path: 'src',
            pageName: '源码',
            pageTitle: '源码',
            pageDescription: '浏览源码文件夹'
        }

    },

    /**
	 * 存放列表路径的地址。
	 */
    listsPath: 'assets/lists',

    /**
	 * 存放数据字段的 meta 节点。
	 */
    moduleInfo: 'module-info',

    /**
	 * 整个项目标配使用的编码。
	 */
    encoding: 'utf-8'

    ///**
    // * 组件访问历史最大值。
    // */
    //maxModuleHistory: 10,

    ///**
    // * 合法的状态值。
    // */
    //status: {
    //    'stable': '稳定版',
    //    'done': '已完成',
    //    'beta': '测试版',
    //    'todo': '计划中',
    //    'doing': '开发中',
    //    'deprecated': '已废弃'
    //},

    ///**
    // * 特性列表。
    // */
    //attributes: {
    //    'mobile': '移动端',
    //    'pc': 'PC 端',
    //    'ie8': '兼容IE8+',
    //    'ie6': '兼容IE6+'
    //}

};

// #endregion

// #region 模块解析

Doc.ModuleInfo = {

    /**
     * 获取当前页面指定的控件的信息。
     */
    parse: function (value) {
        var r = {};
        value = value.split(/,\s*/);
        for (var i = 0; i < value.length; i++) {
            var t = value[i],
			    s = t.indexOf('=');
            r[t.substr(0, s)] = t.substr(s + 1);
        }
        return r;
    },

    /**
     * 获取当前页面指定的控件的信息。
     */
    stringify: function (value) {
        var r = [];
        for (var key in value) {
            r.push(key + '=' + value[key]);
        }
        return r.join(', ');
    }

};

// #endregion

// #region 工具函数

/**
 * 提供底层工具函数。
 */
Doc.Utility = {

    /**
     * 格式化指定的字符串。
     * @param {String} formatString 要格式化的字符串。格式化的方式见备注。
     * @param {Object} ... 格式化参数。
     * @return {String} 格式化后的字符串。
     * @remark 
     * 
     * 格式化字符串中，使用 {0} {1} ... 等元字符来表示传递给 String.format 用于格式化的参数。
     * 如 String.format("{0} 年 {1} 月 {2} 日", 2012, 12, 32) 中， {0} 被替换成 2012，
     * {1} 被替换成 12 ，依次类推。
     * 
     * String.format 也支持使用一个 JSON来作为格式化参数。
     * 如 String.format("{year} 年 {month} 月 ", { year: 2012, month:12});
     * 若要使用这个功能，请确保 String.format 函数有且仅有 2个参数，且第二个参数是一个 Object。
     *
     * 格式化的字符串{}不允许包含空格。
     * 
     * 如果需要在格式化字符串中出现 { 和 }，请分别使用 {{ 和 }} 替代。
     * 不要出现{{{ 和 }}} 这样将获得不可预知的结果。
     * @memberOf String
     * @example <pre>
     * String.format("{0}转换", 1); //  "1转换"
     * String.format("{1}翻译",0,1); // "1翻译"
     * String.format("{a}翻译",{a:"也可以"}); // 也可以翻译
     * String.format("{{0}}不转换, {0}转换", 1); //  "{0}不转换1转换"
     * </pre>
     */
    formatString: function (formatString) {
        var args = arguments;
        return formatString ? formatString.replace(/\{\{|\{(\w+)\}|\}\}/g, function (matched, argName) {
            return (argName ? (matched = +argName + 1) ? args[matched] : args[1][argName] : matched[0]) || '';
        }) : '';
    },

    /**
     * 删除公共的缩进部分。
     */
    removeLeadingWhiteSpaces: function (value) {
        value = value.replace(/^[\r\n]+/, "").replace(/\s+$/, "");
        var space = /^\s+/.exec(value);
        if (space) {
            space = space[0];
            value = value.split(/[\r\n]/);
            for (var i = value.length - 1; i >= 0; i--) {
                value[i] = value[i].replace(space, "");
            }
            value = value.join('\r\n');
        }
        return value;
    },

    /**
     * 编码 HTML 特殊字符。
     * @param {String} value 要编码的字符串。
     * @return {String} 返回已编码的字符串。
     * @remark 此函数主要将 & < > ' " 分别编码成 &amp; &lt; &gt; &#39; &quot; 。
     */
    encodeHTML: (function () {

        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '\'': '&#39;',
            '\"': '&quot;'
        };

        function replaceMap(v) {
            return map[v];
        }

        return function (value) {
            return value.replace(/[&<>\'\"]/g, replaceMap);
        };
    })(),

    /**
     * 获取一个函数内的源码。
     */
    getFunctionSource: function (fn) {
        return Doc.Utils.removeLeadingWhiteSpaces(fn.toString().replace(/^function\s+[^(]*\s*\(.*?\)\s*\{[\r\n]*/, "").replace(/\s*\}\s*$/, "").replace(/\\u([0-9a-f]{3})([0-9a-f])/gi, function (a, b, c) {
            return String.fromCharCode((parseInt(b, 16) * 16 + parseInt(c, 16)))
        }));
    }

};

// #endregion

// 指示当前系统是否在后台运行。
if (typeof module === 'object' && typeof __dirname === 'string') {

    //#region 后台部分

    Doc.basePath = require('path').resolve(__dirname, Doc.Configs.basePath);

    // 导出 Doc 模块。
    module.exports = Doc;

    //#endregion

} else {

    // #region DOM 辅助函数

    /**
	* DOM辅助处理模块。
	*/
    Doc.Dom = {

        /**
		 * 指示当前是否为 IE6-8 浏览器。
		 */
        isOldIE: !+"\v1",

        /**
         * 为 IE 浏览器提供特殊处理。
         */
        fixBrowser: function () {

            // 令 IE6-8 支持显示 HTML5 新元素。
            if (Doc.Dom.isOldIE) {
                'article section header footer nav aside details summary menu'.replace(/\w+/g, function (tagName) {
                    document.createElement(tagName);
                });
            }

            // IE6-8 缺少 indexOf 函数。
            Array.prototype.indexOf = Array.prototype.indexOf || function (value, startIndex) {
                for (var i = startIndex || 0; i < this.length; i++) {
                    if (this[i] === value) {
                        return i;
                    }
                }
                return -1;
            };

            String.prototype.trim = String.prototype.trim || function () {
                return this.replace(/^\s+|\s+$/g, "");
            };

            // IE6-7 缺少 document.querySelector 函数。
            document.querySelectorAll = document.querySelectorAll || function (selector) {

                // selector 可能为 tagName, .className, tagName[attrName=attrValue]

                var match = /^(\w*)(\.(\w+)|\[(\w+)=(['"]?)([^'"]*)\5\])?$/.exec(selector);
                var list = this.getElementsByTagName(match[1] || '*');
                // 没有其它过滤器，直接返回。
                if (!match[2]) {
                    return list;
                }

                var result = [];

                for (var i = 0, node; node = list[i]; i++) {
                    // 区分是否是属性选择器。
                    if (match[4]) {
                        if (node.getAttribute(match[4]) === match[6]) {
                            result.push(node);
                        }
                    } else {
                        if ((' ' + node.className + ' ').indexOf(' ' + match[3] + ' ') >= 0) {
                            result.push(node);
                        }
                    }
                }

                return result;
            };
            document.querySelector = document.querySelector || function (selector) {
                return document.querySelectorAll(selector)[0] || null;
            };

            // IE6-8 缺少 localStorage
            window.localStorage = window.localStorage || {};

        },

        /**
         * 为指定节点增加类名。
         */
        addClass: function (node, className) {
            node.className = node.className ? node.className + ' ' + className : className;
        },

        /**
         * 计算指定节点的当前样式。
         */
        computeStyle: function (node, cssName) {
            return parseFloat(getComputedStyle(node, null)[cssName]);
        },

        /**
		 * 设置 DOM ready 后的回调。
		 */
        ready: function (callback) {
            document.addEventListener && document.addEventListener('DOMContentLoaded', callback, false);
        },

        /**
         * 异步载入一个脚本。
         */
        loadScript: function (src, callback) {
            var script = document.createElement('SCRIPT');
            script.type = 'text/javascript';
            script.src = src;
            if (callback) {
                script.onload = script.onreadystatechange = function () {
                    if (!script.readyState || !/in/.test(script.readyState)) {
                        script.onload = script.onreadystatechange = null;
                        callback();
                    }
                };
            }
            var head = document.getElementsByTagName('HEAD')[0] || document.body;
            head.insertBefore(script, head.firstChild);
        },

        /**
         * 执行 CSS 选择器并对每个节点执行回调。
         */
        each: function (selector, callback) {
            var nodes = document.querySelectorAll(selector);
            for (var i = 0, node; node = nodes[i]; i++) {
                callback(node, i, nodes);
            }
        }

    };

    // #endregion

    // #region Page

    /**
     * 负责生成页面导航。
     */
    Doc.Page = {

        title: ' - TealUI | 最完整的前端代码库',

        header: '<nav id="doc_topbar" class="doc-container doc-section doc-clear">\
                    <div id="doc_progress"></div>\
                    <a href="{basePath}{index}" id="doc_logo" class="doc-left">TealUI <sup>{version}</sup></a>\
                    <span id="doc_navbar_trigger" class="doc-right" onclick="this.classList.toggle(\'doc-trigger-actived\')" ontouchstart="this.onclick(); return false;">≡</span>\
                    <ul id="doc_navbar">\
                        <li{folder_actived_docs}><a href="{basePath}{folder_docs}/{index}">开始使用</a></li>\
                        <li{folder_actived_demos}><a href="{basePath}{folder_demos}/{index}">所有组件</a></li>\
                        <li{folder_actived_tools_customize}><a href="{basePath}{folder_tools}/customize/{index}">下载和定制</a></li>\
                        <li{folder_actived_tools_devtools}><a href="{basePath}{folder_tools}/devTools/{index}">开发者工具</a></li>\
                        <li class="doc-right"><a href="http://jplusui.github.com/" target="_blank">更早版本</a></li>\
                    </ul>\
                </nav>\
                <header id="doc_header" class="doc-container doc-section">\
                    <h1>{pageTitle}</h1>\
                    <p>{pageDescription}</p>\
                </header>\
                <aside id="doc_sidebar">\
                    <input type="search" id="doc_sidebar_filter" class="doc-section" placeholder=" 🔍 搜索{pageName}..." onkeydown="Doc.Page.onFilterKeyPress(event)" autocomplete="off" onchange="Doc.Page.filterList()" oninput="Doc.Page.filterList()" />\
                    <div id="doc_list" class="doc-section"></div>\
                </aside>\
                <div id="doc_mask" onclick="document.getElementById(\'doc_sidebar\').classList.remove(\'doc-sidebar-actived\')" ontouchstart="this.onclick(); return false;"></div>\
                <nav id="doc_pager" class="doc-section">\
                    <div><a accesskey="W" class="doc-pager-hide" title="返回顶部(Alt{shift}+W)" href="javascript:Doc.Page.gotoTop();" id="doc_pager_up">^</a></div>\
                    <div>\
                        <a accesskey="A" title="上一页(Alt{shift}+A)" href="javascript:Doc.Page.moveListActivedItem(true);Doc.Page.gotoActivedItem();" id="doc_pager_left">«</a>\
                        <a accesskey="S" title="{pageName}列表(Alt{shift}+S)" href="javascript:Doc.Page.toggleSidebar();" id="doc_pager_search">≡</a>\
                        <a accesskey="D" title="下一页(Alt+Shift+D)" href="javascript:Doc.Page.moveListActivedItem(false);Doc.Page.gotoActivedItem();" id="doc_pager_right">»</a>\
                    </div>\
                </nav>\
                <div class="doc-toolbar doc-toolbar-module doc-right doc-section">\
                    {packager}\
                    <a href="{newWindowUrl}" target="_blank">❒ 在新窗口打开</a>\
                </div>\
                <h1>{title} <small>{path}</small></h1>',

        footer: '<div>\
                    <a href="{basePath}{folder_docs}/about/{index}">关于我们</a> |\
                    <a href="{basePath}{folder_docs}/about/joinus.html">加入我们</a> |\
                    <a href="{basePath}{folder_docs}/about/license.html">开源协议</a> |\
                    <a href="https://github.com/Teal/TealUI/issues/new" target="_blank">问题反馈</a>\
                </div>\
                &copy; 2011-2015 TealUI Team. All Rights Reserved.',

        onFilterKeyPress: function (event) {
            var keyCode = event.keyCode;
            if (keyCode === 40 || keyCode === 38) {
                event.preventDefault();
                Doc.Page.moveListActivedItem(keyCode === 38);
            } else if (keyCode === 13 || keyCode === 10) {
                Doc.Page.gotoActivedItem();
            }
        },

        moveListActivedItem: function (up) {
            var dds = [];
            Doc.Dom.each('#doc_list dd', function (node) {
                if (!node.firstChild.className) {
                    dds.push(node);
                }
            });
            var link = document.querySelector('#doc_list .doc-actived');
            if (link) {
                link.className = '';
            }
            var index = link ? dds.indexOf(link) : -1;
            if (link = index >= 0 && dds[index + (up ? -1 : 1)] || dds[up ? dds.length - 1 : 0]) {
                link.className = 'doc-actived';
                Doc.Page.scrollActivedItemIntoView(up);
            }
        },

        scrollActivedItemIntoView: function (up) {
            var link = document.querySelector('#doc_list .doc-actived');
            if (link) {
                var offsetTop = link.offsetTop,
                    docList = document.getElementById('doc_list'),
                    scrollTop = docList.scrollTop;

                // 如果即将超出屏幕范围则自动滚动。
                if (offsetTop <= scrollTop + docList.firstChild.nextSibling.offsetTop || offsetTop >= scrollTop + docList.offsetHeight) {
                    link.scrollIntoView(up);
                }
            }
        },

        gotoActivedItem: function () {
            var link = document.querySelector('#doc_list .doc-actived');
            if (link) {
                location.href = link.firstChild.href;
            }
        },

        gotoTop: function () {
            var srcollElement = document.documentElement;
            if (!srcollElement.scrollTop) {
                srcollElement = document.body;
            }
            var step = srcollElement.scrollTop / 5;
            moveNext();
            function moveNext() {
                srcollElement.scrollTop -= step;
                if (srcollElement.scrollTop > 0) {
                    setTimeout(moveNext, 20);
                }
            }
        },

        togglePackage: function () {
            var docPackages = localStorage.doc_packages ? JSON.parse(localStorage.doc_packages) : {};
            docPackages[Doc.path] = document.getElementById('doc_package_current').checked;
            localStorage.doc_packages = JSON.stringify(docPackages);
        },

        /**
         * 应用过滤项重新渲染列表。
         */
        filterList: function () {

            // 获取过滤的关键字。
            var filter = document.getElementById('doc_sidebar_filter').value.trim().toLowerCase(),
                filterRegExp = filter && new RegExp('(' + filter.replace(/([\-.*+?^${}()|[\]\/\\])/g, '\\$1') + ')', 'ig'),
                docList = document.getElementById('doc_list'),
                nonHintText = docList.firstChild;

            // 重新显示找不到的提示文案。
            if (nonHintText) {
                nonHintText.className = '';
            }

            for (var i = 0, h2dl, lastH2; h2dl = docList.childNodes[i]; i++) {

                if (h2dl.tagName === 'DL') {

                    for (var j = 0, dtdd, lastDt, lastDtIsShown; dtdd = h2dl.childNodes[j]; j++) {

                        // 判断当前项是否需要显示。
                        var title = dtdd.getAttribute('data-title'),
                            name = dtdd.getAttribute('data-name'),
                            shouldShow = false;

                        if (filter) {

                            // 先验证是否在名字中。
                            var t = name.replace(filterRegExp, '<span class="doc-red">$1</span>');
                            if (t.length !== name.length) {
                                shouldShow = true;
                                name = t;
                            }

                            // 再验证是否在标题中。
                            t = title.replace(filterRegExp, '<span class="doc-red">$1</span>');
                            if (t.length !== title.length) {
                                shouldShow = true;
                                title = t;
                            } else {

                                // 最后验证是否符合拼音。
                                var titlePinYin = (dtdd.getAttribute('data-title-pin-yin') || "");

                                // 验证是否符合拼音首字母。
                                t = titlePinYin.replace(/(\S)\S+\s?/g, "$1").indexOf(filter);
                                if (t >= 0) {
                                    shouldShow = true;
                                    title = title.substr(0, t) + '<span class="doc-red">' + title.substr(t, filter.length) + '</span>' + title.substr(t + filter.length);
                                } else {

                                    // 验证是否符合拼音全拼。
                                    var titlePinYinArray = titlePinYin.split(' ');
                                    var titlePinYinString = titlePinYinArray.join('');
                                    var prefixLength = 0;
                                    for (var k = 0; k < titlePinYinArray.length; k++) {

                                        // 从当前位置查找全拼。
                                        if (titlePinYinString.indexOf(filter, prefixLength) === prefixLength) {
                                            
                                            // 根据输入的拼音长度确定实际匹配到的中文数。
                                            var len = 0, maxK = k;
                                            for (; maxK < titlePinYinArray.length; maxK++) {
                                                len += titlePinYinArray[maxK].length;
                                                if (len >= filter.length) {
                                                    break;
                                                }
                                            }
                                            
                                            shouldShow = true;
                                            title = title.substr(0, k) + '<span class="doc-red">' + title.substr(k, maxK - k + 1) + '</span>' + title.substr(maxK + 1);

                                            break;

                                        }

                                        prefixLength += titlePinYinArray[k].length;
                                    }

                                }

                            }

                        }

                        if (dtdd.tagName === 'DD') {

                            // 如果父项被筛选出，则同时筛选子项。允许根据路径搜索。
                            shouldShow = shouldShow || lastDtIsShown || dtdd.firstChild.href.toLowerCase().indexOf(filter) >= 0 || (dtdd.getAttribute('data-tags') || '').toLowerCase().indexOf(filter) >= 0;

                            // 如果子项被筛选出，则同时筛选父项。
                            if (lastDt && shouldShow) {
                                lastDt.className = '';
                                lastDt = null;
                            }

                            // 如果子项被筛选出，则同时筛选父项。
                            if (lastH2 && shouldShow) {
                                lastH2.className = '';
                                lastH2 = null;
                            }

                            // 如果有任一项被筛选出，则隐藏找不到的文案。
                            if (nonHintText && shouldShow) {
                                nonHintText.className = 'doc-list-hide';
                                nonHintText = null;
                            }

                            dtdd = dtdd.firstChild;

                        } else if (dtdd.tagName === 'DT') {
                            lastDt = dtdd;
                            lastDtIsShown = shouldShow;
                        }

                        // 首先隐藏节点，如果子项存在则显示节点。
                        dtdd.className = shouldShow ? '' : 'doc-list-hide';
                        dtdd.innerHTML = title + ' <small>' + name + '</small>';

                    }

                } else if (h2dl.tagName === 'H2') {

                    lastH2 = h2dl;

                    // 首先隐藏节点，如果子项存在则显示节点。
                    lastH2.className = 'doc-list-hide';

                }
            }

            function appendFilter(value) {
                return filter ? value.replace(filter, '<span class="doc-red">' + filter + '</span>') : value;
            }

            // 默认选中第一项。
            var actived = document.querySelector('#doc_list .doc-actived');
            if (!actived || actived.firstChild.className) {
                Doc.Page.moveListActivedItem();
            }

        },

        /**
         * 调用远程 node 服务器完成操作。
         */
        callService: function (cmdName, params, success, error) {
            var url = Doc.Configs.servicePath + '?cmd=' + cmdName + params;
            if (location.protocol === 'file:') {
                error(Doc.Utils.formatString('通过 file:/// 直接打开文件时，无法 AJAX 调用远程服务，请先执行 [项目跟目录]/{devTools}/node/bootserver.cmd 启动服务器', Doc.Configs.devTools));
                return;
            }
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || xhr.status == 1223) {
                        if (xhr.getResponseHeader("content-type") === "text/html") {
                            success(xhr.responseText);
                        } else {
                            error(Doc.Utils.formatString('无效的远程服务器，请先执行 [项目跟目录]/{devTools}/node/bootserver.cmd 启动服务器', Doc.Configs.devTools));
                        }
                    } else {
                        error('调用时出错：' + url);
                    }
                }
            };
            xhr.send(null);
        },

        /**
         * 初始化页面框架。
         */
        init: function () {

            //// 修复浏览器。
            //Doc.Dom.fixBrowser();

            // 获取当前 doc.js 所在路径。
            var docJsPath = document.getElementsByTagName("script");
            docJsPath = docJsPath[docJsPath.length - 1].src;

            // 获取当前项目的跟目录。
            var a = document.createElement('a');
            a.href = docJsPath.replace(/\/[^\/]*$/, "/") + Doc.Configs.basePath;
            Doc.basePath = a.href;

            // 获取当前项目路径。
            var path = location.href.replace(/[?#].*$/, "");
            if (path.indexOf(Doc.basePath) === 0) {
                path = path.substr(Doc.basePath.length);
            }
            Doc.path = path.replace(/[^/]*\//, "");

            // 获取当前项目所在文件夹。
            var actucalFolder = path.replace(/\/.*$/, "");
            Doc.folder = 'assets';
            for (var folderName in Doc.Configs.folders) {
                if (actucalFolder === Doc.Configs.folders[folderName].path) {
                    Doc.folder = folderName;
                    break;
                }
            }

            // 判断当前开发系统是否在本地运行。
            Doc.local = location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === '::1';

            // 载入 CSS 样式。
            var frame = '<link type="text/css" rel="stylesheet" href="' + docJsPath.replace(/\.js$/, '.css') + '" />';
            var docPageClass = '';

            // 如果地址存在 ?frame=none，则不加载文档顶部和底部。
            if (!/[?&]frame=none/i.test(location.search) && +"\v1") {

                docPageClass = ' doc-page';

                var args = {
                    basePath: Doc.basePath,
                    version: Doc.Configs.version,
                    pageName: Doc.Configs.folders[Doc.folder].pageName,
                    pageTitle: Doc.Configs.folders[Doc.folder].pageTitle,
                    pageDescription: Doc.Configs.folders[Doc.folder].pageDescription,
                    title: document.title,
                    path: Doc.path.replace(/\..*$/, ""),
                    newWindowUrl: location.href + (location.search ? '&' : '?') + 'frame=none',
                    docPackageChecked: localStorage.doc_packages && JSON.parse(localStorage.doc_packages)[Doc.path] ? ' checked="checked"' : '',
                    index: location.protocol === 'file:' ? 'index.html' : '',
                    packager: Doc.path && Doc.folder === 'demos' ? '<label><input type="checkbox" id="doc_package_current" onclick="Doc.Page.togglePackage()"' + (localStorage.doc_packages && JSON.parse(localStorage.doc_packages)[Doc.path] ? ' checked="checked"' : '') + '>打包此组件</label>' : '',
                    shift: navigator.userAgent.indexOf('Firefox') >= 0 ? '+Shift' : ''
                };

                // 更新导航条高亮。
                for (var folderName in Doc.Configs.folders) {
                    args['folder_' + folderName] = Doc.Configs.folders[folderName].path;
                }
                var activedFolder = Doc.folder;
                if (activedFolder === 'tools') {
                    activedFolder += '_' + Doc.path.replace(/\/.*$/, "");
                }

                args['folder_actived_' + activedFolder] = ' class="doc-actived"';
                frame += Doc.Utility.formatString(Doc.Page.header, args);

                var metaDdescription = document.querySelector('meta[name=description]');
                if (metaDdescription) {
                    frame += '<blockquote class="doc-summary">' + metaDdescription.content + '</blockquote>';
                }

                Doc.Dom.loadScript(Doc.basePath + Doc.Configs.listsPath + '/' + Doc.Configs.folders[Doc.folder].path + '.js');

                Doc.Dom.ready(function () {

                    // 插入多说评论框。
                    if (!Doc.local) {
                        var div = document.createElement('div'),
                            path = location.pathname.replace(/\/$/, "/index.html");
                        div.className = 'ds-thread';
                        div.setAttribute('data-thread-key', path);
                        div.setAttribute('data-title', document.title);
                        div.setAttribute('data-url', path);
                        document.body.appendChild(div);

                        window.duoshuoQuery = { short_name: "teal" };
                        Doc.Dom.loadScript('//static.duoshuo.com/embed.js');
                    }

                    // 插入底部。
                    var footer = document.createElement('footer');
                    footer.id = 'doc_footer';
                    footer.className = 'doc-container doc-section';
                    footer.innerHTML = Doc.Utility.formatString(Doc.Page.footer, args);
                    document.body.appendChild(footer);

                    // 底部影响边栏大小。
                    Doc.Page.updateSidebar(true);

                    // 载入列表。
                    Doc.Dom.loadScript(Doc.basePath + Doc.Configs.listsPath + '/' + Doc.Configs.folders[Doc.folder].path + '.js');

                });

                document.title += Doc.Page.title;

                // 插入百度统计代码。
                if (!Doc.local) {
                    Doc.Dom.loadScript("http://hm.baidu.com/h.js?a37192ce04370b8eb0c50aa13e48a15b".replace('http:', location.protocol));
                }

            }

            // 插入页面框架。
            document.write(frame);
            Doc.Dom.addClass(document.body, 'doc' + docPageClass);

            Doc.Dom.ready(function () {
                Doc.Page.initSourceCode();
            });

        },

        /**
         * 初始化页内的代码区域。
         */
        initSourceCode: function () {
            if (Doc.Page.sourceCodeInited) {
                return;
            }

            Doc.Page.sourceCodeInited = true;

            // 处理 <pre>, <script class="doc-demo">, <aside class="doc-demo">
            Doc.Dom.each('.doc > pre, .doc-demo', function (node) {

                // 获取源码和语言。
                var pre, content, language;
                if (node.tagName === 'PRE') {
                    content = node.textContent;
                    pre = node;
                } else if (node.tagName === 'SCRIPT') {
                    content = node.textContent;
                    language = !node.type || node.type === 'text/javascript' ? 'js' : null;
                    node.className = node.className.replace('doc-demo', '');
                } else {
                    content = node.innerHTML;
                    language = 'html';
                }

                language = language || (pre && (/\bdoc-sh-(\w+)\b/.exec(pre.className) || [])[1]) ||Doc.SyntaxHighligher.guessLanguage(content);
                if (!pre) {
                    pre = document.createElement('pre');
                    node.parentNode.insertBefore(pre, node.nextSibling);
                }

                pre.textContent = Doc.Utility.removeLeadingWhiteSpaces(content);
                Doc.Dom.addClass(pre, 'doc doc-code');

                // 语法高亮。
                setTimeout(function () {
                    Doc.SyntaxHighligher.one(pre, language);
                }, 0);

                // 插入工具按钮。
                if (typeof document.ontouchend === 'undefined') {
                    var html = '<a href="javascript://编辑并执行源码">编辑</a><a href="javascript://全选并复制源码">全选</a>',
                        editButton = 0,
                        copyButton = 1,
                        execButton;

                    if (pre === node && language == 'js') {
                        html = '<a href="javascript://执行代码">执行</a>' + html;
                        editButton++;
                        copyButton++;
                        execButton = 0;
                    }

                    // 插入工具条。
                    var aside = document.createElement('aside');
                    aside.className = 'doc-toolbar-code doc-section';
                    aside.innerHTML = html;
                    pre.parentNode.insertBefore(aside, pre);

                    editButton = aside.childNodes[editButton];
                    copyButton = aside.childNodes[copyButton];
                    execButton = aside.childNodes[execButton];

                    // 检测flash 复制。
                    if (location.protocol !== 'file:' && navigator.plugins && navigator.plugins["Shockwave Flash"]) {
                        copyButton.innerHTML = '复制';
                        copyButton.onmouseover = function () {
                            // 初始化复制 FLASH。
                            if (!Doc.ZeroClipboard) {
                                window.ZeroClipboard = Doc.ZeroClipboard = {
                                };
                                var div = document.createElement('div');
                                div.style.position = 'absolute';
                                div.innerHTML = '<embed id="zeroClipboard" src="' + Doc.basePath + Doc.Configs.folders.assets.path + '/ZeroClipboard.swf" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + copyButton.offsetWidth + '" height="' + copyButton.offsetHeight + '" name="zeroClipboard" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + 'id=zeroClipboard&width=' + copyButton.offsetWidth + '&height=' + copyButton.offsetHeight + '" wmode="transparent" />';
                                document.body.appendChild(div);
                                window.ZeroClipboard.movie = document.getElementById('zeroClipboard');
                            }

                            // 设置回调。
                            window.ZeroClipboard.dispatch = function (id, eventName, args) {
                                if (eventName === 'mouseOver') {
                                    copyButton.innerHTML = '复制';
                                    copyButton.className = 'doc-hover';
                                } else if (eventName === 'mouseOut') {
                                    copyButton.onmouseout();
                                } else if (eventName === 'complete') {
                                    copyButton.innerHTML = '成功';
                                }
                            };

                            // 设置按钮样式。
                            window.ZeroClipboard.dispatch(null, 'mouseOver');

                            // 设置flash样式。
                            var div = window.ZeroClipboard.movie.parentNode;
                            var rect = copyButton.getBoundingClientRect();
                            div.style.left = rect.left + window.scrollX + 'px';
                            div.style.top = rect.top + window.scrollY + 'px';

                            doLoad();

                            function doLoad() {
                                if (window.ZeroClipboard.movie.setText) {
                                    window.ZeroClipboard.movie.setText(pre.textContent.replace(/\r?\n/g, "\r\n"));
                                    return;
                                }
                                setTimeout(doLoad, 10);
                            }


                        };
                        copyButton.onmouseout = function () {
                            copyButton.innerHTML = '复制';
                            copyButton.className = '';
                        };
                    }

                    // 全选按钮。
                    copyButton.onclick = function () {
                        pre.focus();
                        var range = new Range();
                        range.selectNode(pre);
                        var sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                    };

                    // 编辑和执行按钮。
                    editButton.onclick = function () {
                        var canExec = !execButton && (language === 'js' || (language === 'html' && pre !== node));
                        if (pre.contentEditable === 'true') {
                            if (canExec) {
                                if (language === 'js') {
                                    execScript(pre.textContent);
                                } else {
                                    execHtml(pre.textContent);
                                }
                            } else {
                                pre.contentEditable = false;
                                editButton.innerHTML = '编辑';
                                Doc.SyntaxHighligher.one(pre, language);
                            }
                        } else {
                            pre.contentEditable = true;
                            pre.focus();
                            pre.textContent = pre.textContent;
                            editButton.innerHTML = canExec ? '执行' : '完成';

                            pre.onkeydown = function (event) {

                                // 设置插入 TAB 后为插入四个空格。
                                if (event.keyCode === 9) {
                                    event.preventDefault();
                                    var sel = window.getSelection();
                                    var range = sel.getRangeAt(0);
                                    range.collapse(false);
                                    var node = range.createContextualFragment("    ");
                                    var c = node.lastChild;
                                    range.insertNode(node);
                                    if (c) {
                                        range.setEndAfter(c);
                                        range.setStartAfter(c)
                                    }
                                    sel.removeAllRanges();
                                    sel.addRange(range);

                                    // 设置插入 CTRL 回车后执行代码。
                                } else if (event.ctrlKey && (event.keyCode === 10 || event.keyCode === 13)) {
                                    execHtml(pre.textContent);
                                }
                            };

                            // 选中最后一个字符。
                            var range = new Range();
                            range.setEndAfter(pre.lastChild);
                            range.setStartAfter(pre.lastChild);
                            var sel = window.getSelection();
                            sel.removeAllRanges();
                            sel.addRange(range);

                        }
                    };

                    // 执行按钮。
                    if (execButton) {
                        execButton.onclick = function () {
                            execScript(pre.textContent);
                        };
                    }

                    function execScript(content) {
                        try {
                            console.group(pre.textContent);
                        } catch (e) {
                        }

                        var result;

                        try {

                            // 如果是这行发生错误说明是用户编辑的脚本有错误。
                            result = window["eval"].call(window, content);

                        } finally {
                            try {
                                if (result !== undefined) {
                                    console.log(result);
                                }
                                console.groupEnd();
                            } catch (e) {
                            }
                        }
                    }

                    function execHtml(content) {
                        node.innerHTML = content;
                        var scripts = node.getElementsByTagName('script');
                        for (var i = 0, script; script = scripts[i]; i++) {
                            if (!script.type || script.type === 'text/javascript') {
                                execScript(script.textContent);
                            }
                        }
                    }

                }

            });
        },

        /**
         * 载入列表完成后负责更新列表。
         */
        initList: function (list) {
            var html = '<small class="doc-list-hide">无搜索结果</small>';
            html += '<dl>';
            for (var i = 0; i < list.length ; i++) {
                var itemI = list[i];
                html += Doc.Utility.formatString('<dt data-title="{title}" data-name="{name}" data-title-pin-yin="{titlePinYin}">{title} <small>{name}</small></dt>', itemI);
                for (var j = 0; j < (itemI.children && itemI.children.length) ; j++) {
                    var itemJ = itemI.children[j];
                    itemJ.activedClass = itemJ.path === Doc.path ? ' doc-actived' : '';
                    itemJ.fullPath = Doc.basePath + Doc.Configs.folders[Doc.folder].path + '/' + itemJ.path;
                    itemJ.status = itemJ.status || 'done';
                    html += Doc.Utility.formatString('<dd data-title="{title}" data-name="{name}" data-tags="{tags}" data-title-pin-yin="{titlePinYin}" class="doc-list-{status}{activedClass}"><a href="{fullPath}">{title} <small>{name}</small></a></dd>', itemJ);
                }
            }
            html += '</dl>';
            document.getElementById('doc_list').innerHTML = html;

            // 更新列表大小。
            Doc.Page.updateSidebar(true);

            // 实现边栏菜单固定位置显示。
            window.addEventListener('resize', Doc.Page.updateSidebar, false);
            window.addEventListener('scroll', Doc.Page.updateSidebar, false);

            // 绑定列表滚动大小。
            document.getElementById('doc_list').addEventListener('scroll', function () {
                localStorage.doc_listScrollTop = document.getElementById('doc_list').scrollTop;
            }, false);
            if (localStorage.doc_listScrollTop) {
                document.getElementById('doc_list').scrollTop = localStorage.doc_listScrollTop;
            }
            Doc.Page.scrollActivedItemIntoView(true);
        },

        /**
         * 更新侧边尺寸。
         */
        updateSidebar: function (lazy) {
            
            var sidebar = document.getElementById('doc_sidebar');
            var list = document.getElementById('doc_list');
            var filter = document.getElementById('doc_sidebar_filter');
            var header = document.getElementById('doc_header');
            var footer = document.getElementById('doc_footer');

            var bodyHeight = window.innerHeight;

            var mainTop = header.getBoundingClientRect().bottom + Doc.Dom.computeStyle(header, 'marginBottom');
            var mainBottom = footer ? footer.getBoundingClientRect().top : 1 / 0;

            var listHeight;

            // 如果正在显示局部。
            if (/\bdoc-sidebar-actived\b/.test(sidebar.className)) {
                sidebar.style.position = 'fixed';
                sidebar.style.top = 0;
                listHeight = bodyHeight;
            } else if (mainTop <= 0) {
                sidebar.style.position = 'fixed';
                sidebar.style.top = 0;
                listHeight = Math.min(bodyHeight, mainBottom);
            } else {
                sidebar.style.position = 'absolute';
                sidebar.style.top = 'auto';
                listHeight = bodyHeight - mainTop;
            }

            list.style.height = listHeight - filter.offsetHeight - Doc.Dom.computeStyle(filter, 'marginTop') - Doc.Dom.computeStyle(filter, 'marginBottom') + 'px';

            // 将内容变的足够高。
            if (mainBottom - mainTop < listHeight && sidebar.getBoundingClientRect().left >= 0) {
                var div = document.createElement('div');
                div.style.height = bodyHeight + 'px';
                document.body.insertBefore(div, footer);
            }

            if (lazy !== true) {

                // 更新返回顶部按钮。
                document.getElementById('doc_pager_up').className = mainTop < 0 ? '' : 'doc-pager-hide';

                var contentHeight = mainBottom - mainTop - bodyHeight;

                // 减去评论框的高度。
                var thread = document.getElementById('ds-thread');
                if (thread) {
                    contentHeight -= thread.offsetHeight;
                }

                // 更新进度条位置。
                document.getElementById('doc_progress').style.width = mainTop < 0 ? Math.min(-mainTop * 100 / contentHeight, 100) + '%' : 0;

            }

        },

        /**
         * 切换侧边栏。
         */
        toggleSidebar: function () {
            var sidebar = document.getElementById('doc_sidebar');
            if (sidebar.className = sidebar.className ? '' : 'doc-sidebar-actived') {
                Doc.Page.updateSidebar(true);
            }
        }

    };

    Doc.Page.init();

    // #endregion

}
