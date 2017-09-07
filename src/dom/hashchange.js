/**
 * @author xuld
 */

//#include dom/base.js

(function() {

	var hashchange = 'hashchange',
		win = window,
		startListen;

	function getHash() {
	    var href = location.href,
        i = href.indexOf("#");

	    return i >= 0 ? href.substr(i + 1) : '';
	}

	(!navigator.isFirefox && location.constructor ? location.constructor.prototype : location).getHash = getHash;

	/**
	 * 当 hashchange 事件发生时，执行函数。
	 */
	Dom[hashchange] = function (fn) {
		if (typeof fn === 'function') {
			if (startListen) {
				startListen();
				startListen = null;
			}

			Dom.on(win, hashchange, function () {
				fn(getHash());
			});

			fn(getHash());
		} else {
			Dom.trigger(win, hashchange);
		}
	};
	
	// 并不是所有浏览器都支持 hashchange 事件，
	// 当浏览器不支持的时候，使用自定义的监视器，每隔50ms监听当前hash是否被修改。
	if (!('on' + hashchange in window) || document.documentMode < 8) {

	    var currentHash,

            timer,

            onChange = function () {
                Dom.trigger(win, hashchange);
            },

            poll = function () {
                var newToken = getHash();

                if (currentHash !== newToken) {
                    currentHash = newToken;
                    onChange();
                }
                timer = setTimeout(poll, 50);

            },

            iframe,

            /**
             * Convert certain characters (&, <, >, and ") to their HTML character equivalents for literal display in web pages.
             * @param {String} value The string to encode
             * @return {String} The encoded text
             * @method
             */
            htmlEncode = (function () {
                var entities = {
                    '&': '&amp;',
                    '>': '&gt;',
                    '<': '&lt;',
                    '"': '&quot;'
                };

                function match(match, capture) {
                    return entities[capture];
                }

                return function (value) {
                    return value ? value.replace(/[&><"]/g, match) : '';
                };
            })();

	    startListen = function () {
	        currentHash = getHash();
	        timer = setTimeout(poll, 50);
	    };

	    // 如果是 IE6/7，使用 iframe 模拟成历史记录。
	    if (navigator.isIE67) {

	        // iframe: onChange 时，保存状态到 iframe 。
	        onChange = function () {

	            var hash = getHash();

	            // 将历史记录存到 iframe 。
	            var html = "<html><body>" + htmlEncode(hash) + "</body></html>";

	            try {
	                var doc = iframe.contentWindow.document;
	                doc.open();
	                doc.write(html);
	                doc.close();
	            } catch (e) { }

	            win.trigger(hashchange);
	        };

	        // 初始化的时候，同时创建 iframe
	        startListen = function () {
	            if (!iframe) {
	                Dom.ready(function () {
	                    iframe = Dom.parseNode('<iframe style="display: none" height="0" width="0" tabindex="-1" title="empty"/>');
	                    Dom.on(iframe, 'load', function () {

	                        Dom.un(iframe, 'load', arguments.callee);

	                        // 绑定当 iframe 内容被重写后处理。
	                        Dom.on(iframe, "load", function () {
	                            // iframe 的 load 载入有 2 个原因：
	                            //	1. hashchange 重写 iframe
	                            //	2. 用户点击后退按钮

	                            // 获取当前保存的 hash
	                            var newHash = iframe.contentWindow.document.body.innerText,
                                    oldHash = getHash();


	                            // 如果是用户点击后退按钮导致的iframe load， 则 oldHash !== newHash
	                            if (oldHash != newHash) {

	                                // 将当前的 hash 更新为旧的 newHash
	                                location.hash = currentHash = newHash;

	                                // 手动触发 hashchange 事件。
	                                Dom.trigger(win, hashchange);
	                            }

	                        });

	                        // 首次执行，先保存状态。
	                        currentHash = getHash();
	                        poll();
	                    });

	                    document.body.appendChild(iframe);

	                });
	            } else {

	                // 开始监听。
	                currentHash = getHash();
	                poll();
	            }

	        };

	    }

	}

})();
