// #todo

// Simple Set Clipboard System// Author: Joseph Huckaby// https://github.com/jonrohan/ZeroClipboard/**
 * 表示一个 Flash 复制工具。
 */module ZeroClipboard {

    /**
     * 配置当前使用的 Flash 文件。
     * @private
     */
    export var moviePath = 'resources/ZeroClipboard.swf';

    /**
     * 初始化指定节点为复制按钮。
     * @param {Object} options 相关的配置。具体支持的字段有：
     * * @param {Element} dom 指定复制按钮节点。
     * * @param {mixed} [text] 要复制的文本或返回要复制文本的函数。其参数为：
     * * * @param {Element} dom 当前相关的节点。
     * * * @returns {String} 返回要复制的文本。
     * * @param {Element} [input] 要复制的文本域。
     * * @param {Function} [callback] Flash 统一事件回调。
     * * @param {Function} [mouseover] 鼠标移到按钮上的回调。
     * * @param {Function} [mouseout] 鼠标移出按钮上的回调。
     * * @param {Function} [success] 复制成功的回调。
     * * @param {Number} [delay=100] 等待 Flash 加载的延时。
     */
    export function init(options) {

        var dom = options.dom;

        function getContent() {
            if (options.text instanceof Function) {
                return options.text(dom);
            }
            if (options.input) {
                return options.input.value;
            }
            return options.text;
        }

        // IE: 运行剪贴板操作。
        if ((window as any).clipboardData) {
            dom.addEventListener("click", function () {
                (window as any).clipboardData.setData("Text", getContent());
            }, false);
            return;
        }

        // 基于 Flash 复制。
        if (location.protocol !== 'file:' && navigator.plugins && navigator.plugins["Shockwave Flash"]) {

            var timer;

            // 鼠标移入 100 毫秒后加载 Flash 动画。
            dom.addEventListener("mouseover", function () {
                timer = setTimeout(function () {
                    timer = 0;

                    // 初始化复制 FLASH。
                    if (!ZeroClipboard.movie) {
                        var div = document.createElement('div');
                        div.style.position = 'absolute';
                        div.style.zIndex = 300000 as any;
                        div.innerHTML = '<embed id="zeroClipboard" style="position:absolute;top:0;" src="' + ZeroClipboard.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + dom.offsetWidth + '" height="' + dom.offsetHeight + '" name="zeroClipboard" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + 'id=zeroClipboard&width=' + dom.offsetWidth + '&height=' + dom.offsetHeight + '" wmode="transparent" />';
                        document.body.appendChild(div);
                        ZeroClipboard.movie = document.getElementById('zeroClipboard');
                    }

                    // 设置回调。
                    ZeroClipboard.dispatch = function (id, eventName, args) {

                        // 设置复制的内容。
                        if ((eventName === "load" || eventName === "mouseOver") && ZeroClipboard.movie.setText) {
                            ZeroClipboard.movie.setText(getContent());
                        }

                        var triggerType = eventName === "mouseOver" ? "mouseover" : eventName === 'mouseOut' ? "mouseout" : eventName === 'complete' ? "success" : null;
                        triggerType && options[triggerType] && options[triggerType](id, eventName, args);
                        options.callback && options.callback(id, eventName, args);
                    };

                    // 设置按钮样式。
                    ZeroClipboard.dispatch(null, 'mouseOver');

                    // 设置flash样式。
                    var div = window.ZeroClipboard.movie.parentNode;
                    var rect = dom.getBoundingClientRect();
                    div.style.left = rect.left + (window.pageXOffset || window.scrollX) + 'px';
                    div.style.top = rect.top + (window.pageXOffset || window.scrollY) + 'px';

                }, options.delay || 100);
            }, false);

            // 鼠标移出后不操作。
            dom.addEventListener("mouseout", function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = 0;
                }
                ZeroClipboard.dispatch(null, 'mouseOut');
            }, false);

            return;
        }

        dom.addEventListener("click", function () {
            if (options.input) {
                alert("由于安全限制，自动复制失败。请按 Ctrl+C 手动复制");
                options.input.focus();
                options.input.select();
            } else {
                prompt("请直接按 Ctrl+C 复制: ", getContent());
            }
        }, false);

    }

}

export = ZeroClipboard;