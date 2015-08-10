///**
// * @fileOverview 提供单页应用的基础构架。
// * @author xuld
// */

//// #include core/utility.js
//// #include core/class.js

///**
// * 提供管理整个应用的相关函数。
// * @class
// * @static
// */
//var App = {

//    __proto__: Base.prototype,

//    /**
//     * 当前应用的版本。通过版本号以区分不同版本的文件。
//     * @type {String}
//     */
//    version: '1.0',

//    /**
//     * 存储所有已加载的页面。
//     * @type {Object}
//     */
//    _pages: {},

//    /**
//     * 获取最后被激活的页面。
//     * @type {App.Page}
//     */
//    activePage: null,

//    /**
//     * 获取当前正显示的页面。
//     * @type {App.Page}
//     */
//    currentPage: null,

//    /**
//     * 打开指定的 URL 。
//     * @param {String} url 要打开的地址。
//     * @param {String|Object} params 要传递的参数。
//     * @param {Numbeer?} pageType = 0 指示载入的页面类型。0：完整页面；1：更新页面；2：页面片段。
//     * @param {Boolean} forceGet = false 指示是否忽略缓存强制刷新。
//     */
//    go: function (url, params, pageType, forceGet, isAbsoluteUrl) {

//        if (params) {
//            url = QueryString.append(url, QueryString.stringify(params));
//        }

//        // 重写并统一 URL 地址。
//        url = App.urlRewrite(url, 0);

//        // 判断访问的 URL 是否是跨站点访问。
//        var urlInfo = /^(\w+:)?\/\/([^\/]+)/.exec(url);
//        if (urlInfo) {
//            // NOTE:修改此处以支持虚拟目录跳转。
//            if (urlInfo[2] != location.host) {
//                location.href = url;
//                return;
//            }
//            isAbsoluteUrl = true;
//        }

//        // 处理 javascript:
//        if (/^javascript:/.test(url)) {
//            window["eval"].call(window, url.substr(11)); // "javascript:".length == 11
//            return;
//        }

//        // 将 URL 转为绝对路径。
//        if (!isAbsoluteUrl) {
//            var a = App._anchor || (App._anchor = document.createElement('a'));
//            a.href = url;
//            url = a.href;
//        }

//        // 处理哈希地址。
//        if (url.indexOf('#') >= 0 && url.replace(/#.*$/, "") === location.href.replace(/#.*$/, "")) {
//            location.href = url;
//            return;
//        }

//        // 真正打开页面逻辑。
//        App._open(url, pageType, forceGet);

//    },

//    /**
//     * 实现对指定的 URL 进行重写。
//     * @param {String} url 要重写的 URL。
//     * @param {Number} urlType 指示页面类型。0：HTML 文件；1：JavaScript 文件:2：CSS文件；3：后台数据接口。
//     */
//    urlRewrite: function (/*String*/url, /*Number*/urlType) {

//        // 更新 ~/。
//        url = url.replace(/^~\//, '/');

//        // 更新主页。
//        if (urlType === 0) {
//            url = url.replace(/\/(\?|#|$)/, '/index.html$1');
//        } else if (urlType === 3) {
//            url = url.replace(/\/(\w+)(\?|#|$)/, '/$1.json$2');
//        }

//        return url;
//    },

//    /**
//     * 打开指定的页面。
//     * @param {String} pageAbsoluteUrl 要打开的页面完整路径。页面地址不允许跨域。
//     * @param {Numbeer?} pageType = 0 指示载入的页面类型。0：完整页面；1：更新页面；2：页面片段。
//     * @param {Boolean?} forceGet = false 指示是否忽略缓存强制刷新。
//     */
//    _open: function (pageAbsoluteUrl, pageType, forceGet) {

//        // 创建页面实例对象。
//        var newPage = App._pages[pageAbsoluteUrl],
//            oldPage = App.activePage;
//        if (!newPage || forceGet) {
//            App._pages[pageAbsoluteUrl] = newPage = new App.Page(pageAbsoluteUrl);
//        }

//        App.trigger('changing', newPage);

//        // 如果正在打开指定页面，则无需操作。
//        // 通知老页面隐藏。
//        if (oldPage === newPage || !App.currentPage.trigger('hide', newPage)) {
//            return false;
//        }

//        // 更新页面类型。
//        if (pageType != undefined) {
//            newPage.type = pageType;
//        }

//        // 更新最后打开的页面。
//        // 页面可能在加载完成之前就被其它页面代替。
//        App.activePage = newPage;

//        // 开始加载新页面。

//        // 如果页面相关的文件都已加载。则直接显示页面。
//        if (newPage.readyState > 2) {
//            newPage.show();
//        } else {

//            // 第一次载入页面需要显示载入框。
//            // 如果最后一个页面正在加载，则说明已经打开了载入框。
//            if (oldPage.readyState > 2) {
//                App.currentPage.doToggleLoading(true);
//            }

//            // 如果页面未加载，则先加载页面。
//            if (newPage.readyState === 0) {

//                // 开始载入 HTML。
//                newPage.readyState = 1;

//                // 真正加载页面。
//                App.ajax(QueryString.append(newPage.url, '_=' + App.version), 'GET', null, function (html) {

//                    // 创建新容器。
//                    var container = document.createElement('div');
//                    container.innerHTML = html;

//                    // 更新标题。
//                    var title = container.getElementsByTagName('title')[0];
//                    if (title) {
//                        newPage.title = title.innerHTML;
//                    }

//                    // 搜索容器。
//                    newPage.elem = container = pageType !== 2 && container.getElementsByClassName('x-page')[0] || container;

//                    // 默认隐藏容器。
//                    container.style.display = 'none';

//                    // 插入页面代码，执行页面代码。
//                    oldPage.elem.parentNode.appendChild(container);

//                    // 标记 HTML 已加载，现在需要加载 JS。
//                    newPage.readyState = 2;

//                    // 开始载入页面相关的 JS。
//                    newPage._unloadedScripts = Array.prototype.slice.call(container.getElementsByTagName('SCRIPT'), 0);
//                    App._startLoadScriptTask();

//                }, null, App.sessions, newPage.filePath);

//            } else if (newPage.readyState === 2) {
//                // 页面正在加载 JS 时被强制终止，继续加载它。
//                App._startLoadScriptTask();
//            }

//        }

//        return true;
//    },

//    /**
//     * 指示执行脚本加载任务的页面。
//     */
//    _loadingPage: null,

//    /**
//     * 开始执行下一个脚本加载的任务。
//     */
//    _startLoadScriptTask: function () {
//        if (!App._loadingPage) {
//            App._executeNextLoadScriptTask();
//        }
//    },

//    /**
//     * 负责执行下一个脚本加载的任务。
//     */
//    _executeNextLoadScriptTask: function () {

//        // 本函数为页面加载的驱动函数。
//        // _startLoadScriptTask 负责保证同时仅加载一个页面。
//        // _executeNextLoadScriptTask 每次仅加载最后需要打开的页面。
//        // 如果正在打开 A 页面时，需要打开 B 页面，则等待 A 的当前任务加载完成后，
//        // 忽略 A 的剩余页面，直接加载 B 页面。
//        // 等待下一次重新打开 A 页面时再继续加载 A 剩下的页面。

//        var page = App._loadingPage = App.activePage,
//            scripts = page._unloadedScripts;

//        // 如果全部脚本都已加载完。
//        if (!scripts || !scripts.length) {

//            // 标记当前任务执行完毕，可以继续执行其它任务。
//            App._loadingPage = null;

//            // 标记页面内容已加载。
//            delete page._unloadedScripts;

//            // 通知页面已加载。
//            page.trigger('ready', page);
//            page.readyState = 3;
//            page.show();
//        } else {
//            var script = scripts.shift();
//            if (script.type && script.type !== 'text/javascript') {
//                App._executeNextLoadScriptTask();
//            } else if (script.src) {
//                App.loadScript(script.src, App._executeNextLoadScriptTask, script);
//            } else {
//                window["eval"].call(window, script.innerHTML);
//                App._executeNextLoadScriptTask();
//            }
//        }

//    },

//    /**
//     * 动态载入一个脚本。
//     * @param {String} styleUrl 样式所在的地址。
//     * @param {Function} callback 打开样式后的回调。
//     */
//    loadStyle: function (styleUrl, callback) {
//        var link = document.createElement('LINK');
//        link.rel = 'stylesheet';
//        link.href = QueryString.append(styleUrl, '_=' + App.version);
//        document.head.appendChild(link);
//        callback();
//    },

//    /**
//     * 动态载入一个脚本。
//     * @param {String} scriptUrl 脚本所在的地址。
//     * @param {Function} callback 打开脚本后的回调。
//     */
//    loadScript: function (scriptUrl, callback, oldScript) {
//        var script = document.createElement('SCRIPT');
//        script.type = 'text/javascript';
//        script.src = QueryString.append(scriptUrl, '_=' + App.version);
//        script.onload = callback;
//        script.onerror = App.onLoadScriptError;
//        oldScript ? oldScript.parentNode.replaceChild(script, oldScript) : document.head.appendChild(script);
//    },

//    /**
//     * 发生脚本错误的回调。
//     */
//    onLoadScriptError: function (e) {
//        console.error('载入脚本 ' + this.src + ' 错误');
//    },

//    /**
//     * 设置当前页面 DOM 加载完成后的回调函数。
//     * @param {Function} callback 回调函数。
//     */
//    ready: function (/*Function*/callback) {
//        var page = App._loadingPage || App.activePage;
//        if (page.readyState < 3) {
//            page.on('ready', callback);
//        } else {
//            callback.call(page, page);
//        }
//    },

//    /**
//     * 发生历史回退的回调。
//     */
//    onPopState: function () {
//        App._open(location.href);
//    },

//    /**
//     * 发生网络错误的回调。
//     * @param {String} url 请求的地址。
//     * @param {XMLHttpRequest} xhr 请求的对象。
//     */
//    onNetworkError: function (url, xhr) {
//        console.error('网络连接错误： ' + url);
//    },

//    /**
//     * 用于在不同页面之间临时传递数据。
//     * @type {Object}
//     */
//    sessions: {},

//    /**
//     * 向服务器发送一个异步请求。
//     * @param {String} url 请求的地址。
//     * @param {String} type 请求的类型，如“GET”。
//     * @param {Object/String} data 请求的数据。可以是一个 JSON 对象或已格式化的字符串。
//     * @param {Function} success 请求成功的回调函数。
//     * @param {Number} cacheObject 用于存储缓存的对象。
//     * @param {String} cacheKey 缓存的键。
//     * @param {Function} error 请求失败的回调函数。
//     */
//    ajax: function (/*String*/url, /*String*/type, /*Object/String*/data, /*Function*/success, /*Function?*/error, /*Number*/cacheObject/* = null*/, /*String?*/cacheKey, headers) {

//        // 处理数据。
//        if (data) {
//            if (data.constructor === Function) {
//                cacheKey = cacheObject;
//                cacheObject = error;
//                error = success;
//                success = data;
//                data = null;
//            } else {
//                if (data.constructor !== String) {
//                    data = QueryString.stringify(data);
//                }
//                if (type === 'GET') {
//                    url = QueryString.append(url, data);
//                    data = null;
//                }
//            }
//        }

//        // 处理缓存。
//        if (cacheObject) {
//            cacheKey = cacheKey || url;
//            var cacheData = cacheObject[cacheKey];
//            if (cacheData !== undefined) {
//                success(cacheData);
//                return;
//            }
//        }

//        // 处理参数。
//        error = error || App.onNetworkError;

//        // 发送请求。
//        var xhr = new XMLHttpRequest();
//        xhr.onreadystatechange = function () {
//            var xhr = this;
//            if (xhr.readyState === 4) {
//                xhr.onreadystatechange = null;
//                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
//                    var cacheData = xhr.responseText;
//                    if (cacheObject) {
//                        cacheObject[cacheKey] = cacheData;
//                    }
//                    success(cacheData, xhr);
//                } else {
//                    error(url, xhr);
//                }
//            }
//        };
//        xhr.open(type, url, true);

//        if (headers) {
//            for (var header in headers) {
//                xhr.setRequestHeader(header, headers[header]);
//            }
//        } else {
//            xhr.setRequestHeader("accept", '*/*');
//            xhr.setRequestHeader("content-type", 'application/x-www-form-urlencoded');
//            xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
//        }

//        xhr.send(data || null);

//    },

//    /**
//     * 表示一个单页应用的页面。
//     * @class
//     */
//    Page: Base.extend({

//        /**
//         * 获取当前页面的加载状态。
//         * 0：页面刚初始化；
//         * 1：正在加载页面相关的 HTML 文件；
//         * 2：正在加载页面相关的 JavaScript 文件；
//         * 3：页面相关文件已加载完毕，但未显示过；
//         * 4：页面已显示过。
//         * @type {Number}
//         */
//        readyState: 0,

//        /**
//         * 获取当前页面的地址。
//         * @type {String}
//         */
//        url: null,

//        /**
//         * 获取当前页面的文件地址。
//         */
//        get filePath() {
//            return this.url.replace(/[?#].*$/, "");
//        },

//        /**
//         * 获取当前页面的全部参数。
//         * @returns {Object}
//         */
//        get params() {
//            return this._params || (this._params = QueryString.getQuery(this.url));
//        },

//        /**
//         * 获取当前页面的参数。
//         * @param {String} name 要设置的参数的名。
//         */
//        getParam: function (name) {
//            return this.params[name.toLowerCase()];
//        },

//        /**
//         * 获取当前页面的参数。
//         * @param {String} name 要设置的参数的名。
//         * @param {Object} value 要设置的参数的值。
//         */
//        setParam: function (name, value) {
//            return this.params[name.toLowerCase()] = value;
//        },

//        /**
//         * 获取当前页面的容器。
//         * @type {Object}
//         */
//        elem: null,

//        /**
//         * 获取或设置当前页面的标题。
//         * @type {String}
//         */
//        title: '',

//        /**
//         * 存储当前页面需要加载的全部脚本。
//         * @type {Array}
//         */
//        _unloadedScripts: null,

//        /**
//         * 初始化新的页面。
//         * @param {String} url 当前 URL。
//         */
//        constructor: function (/*String*/url) {
//            this.url = url;
//        },

//        /**
//         * 获取当前页面的类型。
//         */
//        type: 0,

//        /**
//         * 判断当前页面是否正在加载。
//         * @type {Boolean}
//         */
//        isLoading: false,

//        /**
//         * 指示当前页面正在开始异步加载数据。
//         * @remark 调用此函数后必须调用 endLoading() 以指示载入已完成。
//         */
//        startLoading: function () {
//            this.isLoading = true;
//            if (App.currentPage === this || App.activePage === this) {
//                this.doToggleLoading(true);
//            }
//        },

//        /**
//         * 指示异步载入已完成，可以开始显示页面。
//         */
//        endLoading: function () {
//            this.isLoading = false;
//            if (App.activePage === this) {
//                this.show();
//            } else if (App.currentPage === this) {
//                his.doToggleLoading(false);
//            }
//        },

//        /**
//         * 显示当前页面。
//         */
//        show: function () {

//            var oldPage = App.currentPage;

//            // 如果当前页面正在载入，则停止显示。
//            // 触发新页面的 show 事件。
//            if (this.isLoading) {
//                return false;
//            }

//            // 首页不需要重绘。
//            if (oldPage) {

//                this.doShow(oldPage);

//                // 加入历史。
//                if (this.type === 0) {
//                    history.pushState(null, this.title, this.url);
//                } else if (this.type === 1) {
//                    history.replaceState(null, this.title, this.url);
//                }

//                // 隐藏载入图标。
//                oldPage.doToggleLoading(false);

//            }

//            // 标记页面已显式。
//            this.readyState = 4;

//            // 更新当前页面。
//            App.currentPage = this;

//            // 触发改变事件。
//            App.trigger('change', oldPage);

//            // 触发 show。
//            return this.trigger('show', oldPage);
//        },

//        /**
//         * 切换 UI 以显示当前页面。
//         */
//        doShow: function (oldPage) {

//            // 更新 UI 标题。
//            if (this.title) {
//                document.title = this.title;
//            }

//            // UI 上切换图层的显示和隐藏。
//            oldPage.elem.style.display = 'none';
//            this.elem.style.display = 'block';

//        },

//        /**
//         * 显示或隐藏加载框。
//         * @param {Boolean} show 指示需要显示或隐藏加载框。
//         */
//        doToggleLoading: function (show) {
//            $('#loading').html(show ? "加载中" : "");
//        },

//        /**
//         * 在当前页面执行指定的选择器。
//         * @param {String} selector 执行的选择器。
//         */
//        find: function (/*String*/selector) {
//            return $(selector, this.elem);
//        },

//        /**
//         * 渲染指定 ID 的模板。
//         * @param {String} tplId 要渲染的模板 ID。
//         * @param {Object} data 要渲染的模板数据。
//         */
//        renderTpl: function (tplId, data) {
//            var tpl = $('#' + tplId, this.elem)[0],
//                div = document.createElement('div');
//            div.id = tplId;
//            div.innerHTML = Tpl.parse(tpl.textContent, data, this, tplId);
//            tpl.parentNode.replaceChild(div, tpl);
//        },

//        /**
//         * 获取指定 ID 的模板内容。
//         * @param {String} tplId 模板 ID。
//         * @param {Object} data 要渲染的模板数据。
//         * @returns {String} 返回模板的内容。
//         */
//        parseTpl: function (tplId, data) {
//            return Tpl.parse($('#' + tplId, this.elem).text(), data, this, tplId);
//        }

//    }),

//    /**
//     * 异步载入一个 JavaScript 文件，并确保文件不重复加载。
//     * @param {String} scriptUrl 脚本所在的地址。
//     * @param {Function} callback 打开脚本后的回调。
//     */
//    require: function (url, callback) {
//        if (url.constructor !== Array) {
//            url = [url];
//        }
//        var urlLength = url.length,
//            onLoadAny = callback ? function () {
//                if (--urlLength <= 0) {
//                    callback(url);
//                }
//            } : Function.empty;
//        for (var i = 0; i < urlLength; i++) {
//            if (App.sessions[url[i]]) {
//                onLoadAny();
//            } else {
//                App.sessions[url[i]] = true;
//                if (/\.css(\?|#|$)/.test(url)) {
//                    App.loadStyle(App.urlRewrite(url[i], 2), onLoadAny);
//                } else {
//                    App.loadScript(App.urlRewrite(url[i], 1), onLoadAny);
//                }
//            }
//        }

//    },

//    /**
//     * 初始化整个应用。
//     */
//    init: function () {

//        // 创建第一个页面。
//        var url = App.urlRewrite(location.href, 0);
//        var frontPage = App.activePage = App._pages[url] = new App.Page(url);

//        // 绑定回退事件。
//        window.addEventListener('popstate', App.onPopState, false);

//        // 绑定页面所有 click 事件。
//        document.addEventListener('click', function (e) {
//            var elem = e.target;
//            if (elem.nodeName === 'A' && !elem.target) {
//                App.go(elem.href, null, 0, false, true);
//                e.preventDefault();
//            }
//        }, false);

//        $(function () {

//            // 设置首页元素。
//            frontPage.title = document.title;
//            frontPage.elem = document.getElementsByClassName('x-page')[0] || document.body.lastElementChild;

//            // 首页相关的 HTML 和 JavaScript 已加载。
//            frontPage.readyState = 3;

//            // 触发首页 ready 事件。
//            frontPage.trigger('ready', frontPage);

//            // 显示首页。
//            frontPage.show();

//        });

//    }

//};

//App.init();

///**
// * 调试输出任何变量。
// */
//function trace() {
//    if (App.debug) {
//        return console.debug.apply(console, arguments);
//    }
//}

//// #region 调试输出函数
//// #if DEBUG

///**
// * 指示当前是否是调试模式。
// * @type {Boolean}
// */
//App.debug = localStorage.app_debug || true;
//App.__defineGetter__ && App.__defineGetter__('version', function () {
//    return Date.now();
//});

//// #endif
//// #endregion


//var Control = Base.extend({

//    /**
//     * 获取当前视图的容器。
//     * @type {Object}
//     */
//    elem: undefined,

//    /**
//     * 在当前视图执行指定的选择器。
//     * @param {String} selector 执行的选择器。
//     */
//    find: function ( /*String*/selector) {
//        return $(selector, this.elem);
//    },

//    /**
//     * 渲染指定 ID 的模板。
//     * @param {String} tplSelector 要渲染的模板选择器。
//     * @param {String} containerSelector? 要渲染的容器选择器。
//     * @param {Object} data 要渲染的模板数据。
//     */
//    renderTpl: function (tplSelector, containerSelector, data) {

//        if (!containerSelector || containerSelector.constructor !== String) {
//            data = containerSelector;
//            containerSelector = '';
//        }

//        // 解析模板内容。
//        data = this.parseTpl(tplSelector, data);

//        if (containerSelector) {
//            containerSelector = this.find(containerSelector)
//        } else {
//            tplSelector = this.find(tplSelector);
//            containerSelector = tplSelector.prev('div[x-gen="tpl"]');
//            if (!containerSelector.length) {
//                tplSelector.before(containerSelector = $('<div x-gen="tpl"/>'));
//            }
//        }

//        containerSelector.html(data);
//        return data;

//    },

//    /**
//     * 获取指定 ID 的模板内容。
//     * @param {String} tplSelector 要渲染的模板选择器。
//     * @param {Object} data 要渲染的模板数据。
//     * @returns {String} 返回模板的内容。
//     */
//    parseTpl: function (tplSelector, data) {
//        var tpl = this.find(tplSelector);
//        if (!tpl.length) {
//            throw "找不到指定模板：" + tplSelector;
//        }
//        // 解析模板内容。
//        return Tpl.parse(tpl.text(), data, this, tplSelector);
//    },

//});



//var SECOND = 1, MINUTE = 60, HOUR = 3600, DAY = 86400;

///**
// * 表示一个模型。
// * @class
// * @description 模型是一个数据的抽象结构，业务逻辑中只需对模型读写数据，
// * 而无需关心数据来源。一个模型的数据可能来自 localStorage、远程服务器或
// * 其它自定义数据源。模型的数据同时可设置过期时间。
// */
//var Model = Base.extend({

//    /**
//     * 当前模型对应的本地存储键。如果返回 null，说明当前模型数据不进行本地缓存。
//     */
//    key: null,

//    /**
//     * 当前模型对应的服务器地址。如果返回 null，说明当前模型数据不需要远程载入。
//     */
//    url: null,

//    /**
//     * 当前模型的过期秒数。-1 表示永不过期。
//     */
//    timeout: -1,

//    /**
//     * 当被子类重写时，负责获取发送的请求地址。
//     */
//    getUrl: function () {
//        return this.url;
//    },

//    /**
//     * 当被子类重写时，负责获取发送的请求参数。
//     */
//    getParams: function () {

//    },

//    /**
//     * 当被子类重写时，负责从服务器载入模型数据。
//     */
//    load: function (success, error) {
//        var url = this.getUrl();
//        if (!url) {
//            return error && error('Model#url is null');
//        }
//        $.ajax({
//            url: url,
//            data: this.getParams(),
//            success: success,
//            error: error
//        });
//    },

//    _evaluate: function (obj, expression, get, value) {
//        var left = 0, pos, prop;
//        for (; (pos = expression.indexOf('.', left)) >= 0; left = pos + 1) {
//            prop = expression.substring(left, pos);
//            obj = obj[prop];
//            if (obj == undefined) {
//                if (get) {
//                    return null;
//                }
//                obj[prop] = obj = {};
//            }
//        }

//        prop = expression.substr(left);
//        if (get) {
//            return obj[prop];
//        }

//        obj[prop] = value;
//    },

//    /**
//     * 读取当前模型的全部数据。
//     * @param {String} expression? 如果指定属性名，则此获取此属性的值。
//     * @example
//     * get() 
//     * get('exp')
//     * get(function(){})
//     * get('exp', function(){})
//     */
//    get: function (expression, success, error) {

//        // 确保第一个参数的表达式。
//        if (expression && expression.constructor !== String) {
//            error = success;
//            success = expression;
//            expression = '';
//        }

//        // 先尝试从本地读取数据。
//        var obj = this;

//        if (this.key) {
//            obj = localStorage.getItem(this.key);
//            if (obj) {
//                obj = JSON.parse(obj);
//            }
//        }

//        // 如果数据过期，则清空数据。
//        if (this.timeout > 0 && obj && obj.saveTime && (Date.now() - obj.saveTime) >= this.timeout * 1000) {
//            obj = null;
//            this.key && localStorage.removeItem(this.key);
//        }

//        var me = this;

//        // 成功获取数据后的回调。
//        function onGetData(data) {

//            // 获取子属性。
//            if (expression) {
//                data = me._evaluate(data, expression, true);
//            }

//            // 调用成功回调。
//            success && success(data);

//            return data;
//        }

//        // 本地无数据，从服务器获取。
//        if (obj != null && obj.data != null) {
//            return onGetData(obj.data);
//        }

//        // 异步载入数据。
//        this.load(function (data) {
//            me.set(data);
//            onGetData(data);
//        }, error);

//        return null;
//    },

//    /**
//     * 设置当前模型的全部数据。
//     * @param {String} expression? 如果指定属性名，则此获取此属性的值。
//     * @param {Object} data 要设置的数据。
//     */
//    set: function (expression, data) {

//        if (arguments.length <= 1) {
//            data = expression;
//        } else {
//            var orignalData = data;
//            data = this.get() || {};
//            this._evaluate(data, expression, false, orignalData);
//        }

//        // 设为 null 表示删除。
//        if (data === null) {
//            if (this.key) {
//                localStorage.removeItem(this.key);
//            } else {
//                delete this.data && delete this.saveTime;
//            }
//        } else {
//            var obj = this.key ? {} : this;
//            obj.data = data;
//            obj.saveTime = Date.now();

//            if (this.key) {
//                localStorage.setItem(this.key, JSON.stringify(obj));
//            }

//        }

//        this.trigger('update', data);

//    }

//});

///**
// * 表示一个视图。
// * @class
// */
//var View = Base.extend({

//    /**
//     * 获取当前视图的容器。
//     * @type {Object}
//     */
//    elem: undefined,

//    /**
//     * 在当前视图执行指定的选择器。
//     * @param {String} selector 执行的选择器。
//     */
//    find: function ( /*String*/selector) {
//        return $(selector, this.elem);
//    },

//    /**
//     * 渲染指定 ID 的模板。
//     * @param {String} tplSelector 要渲染的模板选择器。
//     * @param {String} containerSelector? 要渲染的容器选择器。
//     * @param {Object} data 要渲染的模板数据。
//     */
//    renderTpl: function (tplSelector, containerSelector, data) {

//        if (!containerSelector || containerSelector.constructor !== String) {
//            data = containerSelector;
//            containerSelector = '';
//        }

//        // 解析模板内容。
//        data = this.parseTpl(tplSelector, data);

//        if (containerSelector) {
//            containerSelector = this.find(containerSelector)
//        } else {
//            tplSelector = this.find(tplSelector);
//            containerSelector = tplSelector.prev('div[x-gen="tpl"]');
//            if (!containerSelector.length) {
//                tplSelector.before(containerSelector = $('<div x-gen="tpl"/>'));
//            }
//        }

//        containerSelector.html(data);
//        return data;

//    },

//    /**
//     * 获取指定 ID 的模板内容。
//     * @param {String} tplSelector 要渲染的模板选择器。
//     * @param {Object} data 要渲染的模板数据。
//     * @returns {String} 返回模板的内容。
//     */
//    parseTpl: function (tplSelector, data) {
//        var tpl = this.find(tplSelector);
//        if (!tpl.length) {
//            throw "找不到指定模板：" + tplSelector;
//        }
//        // 解析模板内容。
//        return Tpl.parse(tpl.text(), data, this, tplSelector);
//    },

//    /**
//     * 当前页面的地址。
//     * @type {String}
//     */
//    url: null,

//    /**
//     * 获取当前页面的地址。
//     * @type {String}
//     */
//    getUrl: function () {
//        return this.url || location.href;
//    },

//    /**
//     * 获取当前页面的文件地址。
//     */
//    getFilePath: function () {
//        return this.getUrl().replace(/[?#].*$/, "");
//    },

//    /**
//     * 获取当前页面的参数。
//     */
//    getParams: function () {
//        return this._params || (this._params = QueryString.getQuery(this.getUrl()));
//    },

//    /**
//     * 获取当前页面的加载状态。
//     * 0：页面刚初始化；
//     * 1：正在加载页面相关的 HTML 文件；
//     * 2：正在加载页面相关的 JavaScript 文件；
//     * 3：页面相关文件已加载完毕，但未显示过；
//     * 4：页面已显示过。
//     * @type {Number}
//     */
//    readyState: 0,

//    /**
//     * 获取或设置当前页面的标题。
//     * @type {String}
//     */
//    title: '',

//    /**
//     * 存储当前页面需要加载的全部脚本。
//     * @type {Array}
//     */
//    _unloadedScripts: null,

//    /**
//     * 初始化新的页面。
//     * @param {String} url 当前 URL。
//     */
//    constructor: function ( /*String*/url) {
//        this.url = url;
//    },

//    /**
//     * 获取当前页面的类型。
//     */
//    type: 0,

//    /**
//     * 判断当前页面是否正在加载。
//     * @type {Boolean}
//     */
//    isLoading: false,

//    /**
//     * 指示当前页面正在开始异步加载数据。
//     * @remark 调用此函数后必须调用 endLoading() 以指示载入已完成。
//     */
//    startLoading: function () {
//        this.isLoading = true;
//        if (App.currentPage === this || App.activePage === this) {
//            this.doToggleLoading(true);
//        }
//    },

//    /**
//     * 指示异步载入已完成，可以开始显示页面。
//     */
//    endLoading: function () {
//        this.isLoading = false;
//        if (App.activePage === this) {
//            this.show();
//        } else if (App.currentPage === this) {
//            his.doToggleLoading(false);
//        }
//    },

//    /**
//     * 显示当前页面。
//     */
//    show: function () {

//        var oldPage = App.currentPage;

//        // 如果当前页面正在载入，则停止显示。
//        // 触发新页面的 show 事件。
//        if (this.isLoading) {
//            return false;
//        }

//        // 首页不需要重绘。
//        if (oldPage) {

//            this.doShow(oldPage);

//            // 加入历史。
//            if (this.type === 0) {
//                history.pushState(null, this.title, this.url);
//            } else if (this.type === 1) {
//                history.replaceState(null, this.title, this.url);
//            }

//            // 隐藏载入图标。
//            oldPage.doToggleLoading(false);

//        }

//        // 标记页面已显式。
//        this.readyState = 4;

//        // 更新当前页面。
//        App.currentPage = this;

//        // 触发改变事件。
//        App.trigger('change', oldPage);

//        // 触发 show。
//        return this.trigger('show', oldPage);
//    },

//    /**
//     * 切换 UI 以显示当前页面。
//     */
//    doShow: function (oldPage) {

//        // 更新 UI 标题。
//        if (this.title) {
//            document.title = this.title;
//        }

//        // UI 上切换图层的显示和隐藏。
//        oldPage.elem.style.display = 'none';
//        this.elem.style.display = 'block';

//    },

//    /**
//     * 显示或隐藏加载框。
//     * @param {Boolean} show 指示需要显示或隐藏加载框。
//     */
//    doToggleLoading: function (show) {
//        $('#loading').html(show ? "加载中" : "");
//    },

//});

//View.create = function (a) {
//    return new View(a);
//}

//Model.create = function(a) {
//    return new Model(a);
//}