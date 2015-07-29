
// 指示当前系统是否在后台运行。
if (typeof module === 'object' && typeof __dirname === 'string') {

    // #region NodeJS

    Doc.basePath = require('path').resolve(__dirname, Doc.Configs.basePath) + require('path').sep;

    // 导出 Doc 模块。
    module.exports = Doc;

    // #endregion

} else {
    
    /**
     * 绘制页内已加载的所有代码块。
     */
    Doc.renderCodes = function () {
        
        // 处理所有 <pre>, <script class="doc-demo">, <aside class="doc-demo">
        Doc.Dom.each('.doc > pre, .doc-api pre, .doc-demo', function (node) {
            
            // 不重复解析。
            if (node._docInited) {
                return;
            }
            node._docInited = true;

            // 获取源码和语言。
            var pre, content, language;
            if (node.tagName === 'PRE') {
                pre = node;
                content = node.textContent;
                language = (/\bdoc-code-(\w+)\b/.exec(pre.className) || 0)[1]
            } else if (node.tagName === 'SCRIPT') {
                content = node.textContent.replace(/&lt;(\/?script)\b/ig, "<$1");
                language = node.type ? (/text\/(.*)/.exec(node.type) || 0)[1] : 'js';
            } else {
                content = node.innerHTML;
                language = 'html';
            }

            language = language ? ({
                javascript: 'js',
                htm: 'html',
                plain: 'text'
            })[language] || language : Doc.SyntaxHighligher.guessLanguage(content);

            if (!pre) {
                pre = node.parentNode.insertBefore(document.createElement('pre'), node.nextSibling);
                pre._docInited = true;
            }
            
            // 插入代码域。
            Doc.Dom.addClass(pre, 'doc');
            Doc.Dom.addClass(pre, 'doc-code');
            pre.textContent = Doc.SyntaxHighligher.removeLeadingWhiteSpaces(content);

            // 插入工具条。
            var aside = document.createElement('aside'), button;
            aside.className = 'doc-code-toolbar doc-section';
            aside.innerHTML = (language == 'js' || (language == 'html' && node.tagName !== 'SCRIPT' && node !== pre) ? '<a href="javascript://执行本代码" title="执行本代码"><span class="doc-icon">▶</span></a>' : '') + '<a href="javascript://编辑本代码" title="编辑本代码"><span class="doc-icon">✍</span></a><a href="javascript://全选并复制本源码" title="全选并复制本源码"><span class="doc-icon">❐</span></a>';
            pre.parentNode && pre.parentNode.insertBefore(aside, pre);

            // 全选复制按钮。
            button = aside.lastChild;
            button.onclick = function () {
                if (Doc.Dom.isTouch()) {
                    this.previousSibling.click();
                }
                var range = document.createRange(),
                    sel = getSelection();
                pre.focus();
                range.selectNode(pre);
                sel.removeAllRanges();
                sel.addRange(range);
            };

            // 检测flash 复制。
            if (window.clipboardData && clipboardData.setData) {
                button.innerHTML = '<span class="doc-icon">❐</span>';
                button.onmouseover = function() {
                    this.innerHTML = '<span class="doc-icon">❐</span>';
                };
                button.onclick = function() {
                    clipboardData.setData("Text", pre.textContent);
                    this.innerHTML = '<span class="doc-icon">✓</span>';
                };
            } else if (location.protocol !== 'file:' && navigator.plugins && navigator.plugins["Shockwave Flash"]) {
                button.innerHTML = '<span class="doc-icon">❐</span>';
                var timer;
                button.onmouseover = function () {
                    var button = this;
                    timer = setTimeout(function () {
                        timer = 0;

                        // 初始化复制 FLASH。
                        if (!window.ZeroClipboard) {
                            window.ZeroClipboard = {};
                            var div = document.createElement('div');
                            div.style.position = 'absolute';
                            div.innerHTML = '<embed id="zeroClipboard" src="' + Doc.baseUrl + Doc.Configs.folders.assets.path + '/ZeroClipboard.swf" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + button.offsetWidth + '" height="' + button.offsetHeight + '" name="zeroClipboard" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + 'id=zeroClipboard&width=' + button.offsetWidth + '&height=' + button.offsetHeight + '" wmode="transparent" />';
                            document.body.appendChild(div);
                            window.ZeroClipboard.movie = document.getElementById('zeroClipboard');
                        }

                        // 设置回调。
                        window.ZeroClipboard.dispatch = function (id, eventName, args) {
                            if (eventName === 'mouseOver') {
                                button.innerHTML = '<span class="doc-icon">❐</span>';
                                button.className = 'doc-hover';
                            } else if (eventName === 'mouseOut') {
                                button.innerHTML = '<span class="doc-icon">❐</span>';
                                button.className = '';
                            } else if (eventName === 'complete') {
                                button.innerHTML = '<span class="doc-icon">✓</span>';
                            }
                        };

                        // 设置按钮样式。
                        window.ZeroClipboard.dispatch(null, 'mouseOver');

                        // 设置flash样式。
                        var div = window.ZeroClipboard.movie.parentNode;
                        var rect = button.getBoundingClientRect();
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

                    }, 100);
                };
                button.onmouseout = function () {
                    if (timer) {
                        clearTimeout(timer);
                        timer = 0;
                    }
                    window.ZeroClipboard && window.ZeroClipboard.dispatch(null, 'mouseOut');
                };
            }

            // 编辑按钮。
            button = button.previousSibling;
            button.onclick = function () {
                if (pre.contentEditable === 'true') {
                    this.className = '';
                    this.title = '编辑本代码';
                    pre.contentEditable = false;
                    this.previousSibling && this.previousSibling.click();
                    Doc.SyntaxHighligher.one(pre, language);
                } else {
                    this.className = 'doc-hover';
                    this.title = '完成编辑并恢复高亮';
                    pre.contentEditable = true;
                    pre.focus();
                    pre.textContent = pre.textContent;

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
                    var range = document.createRange(),
                        sel = getSelection();
                    range.setEndAfter(pre.lastChild);
                    range.setStartAfter(pre.lastChild);
                    sel.removeAllRanges();
                    sel.addRange(range);

                }
            };

            // 执行按钮。
            if (button = button.previousSibling) {
                button.onclick = function () {
                    (language === 'js' ? execScript : execHtml)(pre.textContent);
                };
            }

            function execScript(content) {
                try {
                    console.group(pre.textContent);
                } catch (e) { }

                var result;

                try {

                    // 如果是这行发生错误说明是用户编辑的脚本有错误。
                    result = window["eval"].call(window, content);

                } finally {
                    try {
                        if (result !== undefined) {
                            console.log(result);
                            if(screen.width < 780) {
                                trace.write(result);
                            }
                        }
                        console.groupEnd();
                    } catch (e) { }
                }
            }

            function execHtml(content) {
                node.innerHTML = content;
                var scripts = node.getElementsByTagName('script'), i, script;
                for (i = 0; script = scripts[i]; i++) {
                    if (!script.type || script.type === 'text/javascript') {
                        execScript(script.textContent);
                    }
                }
            }

            // 语法高亮。
            setTimeout(function () {
                Doc.SyntaxHighligher.one(pre, language);
            }, 0);

        });

    };

    /**
     * 生成 API 列表。
     */
    Doc.writeApi = function (data, returnHtml) {

        if(!Doc._apis) {
            Doc._apis = [];
        }
        var dataIndex = Doc._apis.length;
        Doc._apis.push(data);

        if(data.url && !returnHtml) {
            var h2 = document.getElementsByTagName('h2');
            h2 = h2[h2.length - 1];
            if(h2) {
                h2.innerHTML += Doc.Utility.parseTpl(' <small>(源码：<a href="' + Doc.baseUrl + Doc.Configs.folders.sources.path +'/{url}" target="_blank">{url}</a>)</small>', data);
            }
        }

        var result = '';
        var inTable = false;

        for (var i = 0; i < data.apis.length; i++) {
            var api = data.apis[i];

            if(api.memberType === 'category') {
                if(inTable) {
                    result += '</table>';
                    inTable = false;
                }
                result += Doc.Utility.parseTpl('<h3>{name}</h3>{summary}', api);
                continue;
            }

            if(!inTable) {
                result += '<table class="doc-section doc-api">';
                result += '<tr><th>API</th><th>描述</th><th>示例</th></tr>';
                inTable = true;
            }

            var match = /([\w$]+)\.prototype$/.exec(api.memberOf);

            var vars = {
                'Function': 'fn',
                'Array': 'arr',
                'String': 'str',
                'Object': 'obj',
                'RegExp': 're',
                'Number': 'num',
                'Element': 'elem'
            };

            result += Doc.Utility.parseTpl('<tr><td class="doc">{prefix}<code>{name}</code><div class="doc-toolbar">\
                    <a href="{baseUrl}{tools}/sourceReader/?file={url}#{line}" title="查看源码" target="_blank"><span class="doc-icon">/</span>源码</a>\
                </div></td><td class="doc">{summary}<div class="doc-toolbar">\
                    <a href="javascript://展开当前 API 的更多说明" onclick="Doc.Page.expandApi(this.parentNode.parentNode, {dataIndex}, {apiIndex})"><span class="doc-icon">﹀</span>更多</a>\
                </div></td><td class="doc">{example}</td></tr>', {
                    prefix: /^ES/.test(api.since) ? '<small>(' + api.since + ')</small>' : '',
                    name: match ? '<em>' + (vars[match[1]] || (match[1].charAt(0).toLowerCase() + match[1].substr(1))) + '</em>.' + api.name : (api.memberOf ? api.memberOf + '.' : '') + api.name,
                    summary: api.summary,
                    dataIndex: dataIndex,
                    apiIndex: i,
                    example: api.example,
                    baseUrl: Doc.baseUrl,
                    tools: Doc.Configs.folders.tools.path,
                    url: data.url,
                    line: api.line
            });

        }

        if(inTable) {
            result += '</table>';
        }

        if(!returnHtml) {
            document.write(result);
        }

        return result;
    };

    /**
     * 执行页内所有代码。
     */
    Doc.execAll = function() {
        Doc.Dom.each('a[title="执行本代码"]', function(a) {
            a.click();
        });
    };

    /**
     * 负责生成页面导航。
     */
    Doc.Page = {

        // #endregion
        
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
        }

    };

    Doc.Page.init();

}
