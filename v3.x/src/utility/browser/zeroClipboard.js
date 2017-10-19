// Simple Set Clipboard System// Author: Joseph Huckaby// https://github.com/jonrohan/ZeroClipboard/**
 * 表示一个 Flash 复制工具。
 */var ZeroClipboard = {
    /**
     * 配置当前使用的 Flash 文件。
     * @inner
     */    moviePath: 'resources/ZeroClipboard.swf',    /**
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
     */    init: function (options) {
        var dom = options.dom;        function getContent() {
            if (options.text instanceof Function) {
                return options.text(dom);
            }            if (options.input) {
                return options.input.value;
            }            return options.text;
        }        // IE: 运行剪贴板操作。        if (window.clipboardData) {
            dom.addEventListener("click", function () {
                window.clipboardData.setData("Text", getContent());
            }, false);            return;
        }        // 基于 Flash 复制。        if (location.protocol !== 'file:' && navigator.plugins && navigator.plugins["Shockwave Flash"]) {
            var timer;            // 鼠标移入 100 毫秒后加载 Flash 动画。            dom.addEventListener("mouseover", function () {
                timer = setTimeout(function () {
                    timer = 0;

                    // 初始化复制 FLASH。
                    if (!ZeroClipboard.movie) {
                        var div = document.createElement('div');
                        div.style.position = 'absolute';                        div.style.zIndex = 300000;
                        div.innerHTML = '<embed id="zeroClipboard" style="position:absolute;top:0;" src="' + ZeroClipboard.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + dom.offsetWidth + '" height="' + dom.offsetHeight + '" name="zeroClipboard" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + 'id=zeroClipboard&width=' + dom.offsetWidth + '&height=' + dom.offsetHeight + '" wmode="transparent" />';
                        document.body.appendChild(div);
                        ZeroClipboard.movie = document.getElementById('zeroClipboard');
                    }

                    // 设置回调。                    ZeroClipboard.dispatch = function (id, eventName, args) {

                        // 设置复制的内容。
                        if ((eventName === "load" || eventName === "mouseOver") && ZeroClipboard.movie.setText) {
                            ZeroClipboard.movie.setText(getContent());
                        }

                        var triggerType = eventName === "mouseOver" ? "mouseover" : eventName === 'mouseOut' ? "mouseout" : eventName === 'complete' ? "success" : null;                        triggerType && options[triggerType] && options[triggerType](id, eventName, args);                        options.callback && options.callback(id, eventName, args);
                    };

                    // 设置按钮样式。
                    ZeroClipboard.dispatch(null, 'mouseOver');

                    // 设置flash样式。
                    var div = window.ZeroClipboard.movie.parentNode;
                    var rect = dom.getBoundingClientRect();
                    div.style.left = rect.left + (window.pageXOffset || window.scrollX) + 'px';
                    div.style.top = rect.top + (window.pageXOffset || window.scrollY) + 'px';

                }, options.delay || 100);
            }, false);            // 鼠标移出后不操作。            dom.addEventListener("mouseout", function () {
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
                alert("由于安全限制，自动复制失败。请按 Ctrl+C 手动复制");                options.input.focus();                options.input.select();
            } else {
                prompt("请直接按 Ctrl+C 复制: ", getContent());
            }
        }, false);

    }
};//var ZeroClipboard2 = {
//    version: "1.0.8",//    clients: {}, // registered upload clients on page, indexed by id//    moviePath: 'resources/ZeroClipboard.swf', // URL to movie//    nextId: 1, // ID of next movie//    $: function (thingy) {//        // simple DOM lookup utility function//        if (typeof (thingy) == 'string')//            thingy = document.getElementById(thingy);//        if (!thingy.addClass) {//            // extend element with a few useful methods//            thingy.hide = function () {
//                this.style.display = 'none';
//            };//            thingy.show = function () {
//                this.style.display = '';
//            };//            thingy.addClass = function (name) {
//                this.removeClass(name);//                this.className += ' ' + name;
//            };//            thingy.removeClass = function (name) {
//                var classes = this.className.split(/\s+/);//                var idx = -1;//                for (var k = 0; k < classes.length; k++) {
//                    if (classes[k] == name) {
//                        idx = k;//                        k = classes.length;
//                    }
//                }//                if (idx > -1) {
//                    classes.splice(idx, 1);//                    this.className = classes.join(' ');
//                }//                return this;
//            };//            thingy.hasClass = function (name) {
//                return !!this.className.match(new RegExp("\\s*" + name + "\\s*"));
//            };
//        }//        return thingy;
//    },//    setMoviePath: function (path) {//        // set path to ZeroClipboard.swf//        this.moviePath = path;
//    },//    // use this method in JSNI calls to obtain a new Client instance//    newClient: function () {
//        return new ZeroClipboard.Client();
//    },//    dispatch: function (id, eventName, args) {//        // receive event from flash movie, send to client//        var client = this.clients[id];//        if (client) {
//            client.receiveEvent(eventName, args);
//        }
//    },//    register: function (id, client) {//        // register new client to receive events//        this.clients[id] = client;
//    },//    getDOMObjectPosition: function (obj, stopObj) {//        // get absolute coordinates for dom element//        var info = {
//            left: 0,//            top: 0,//            width: obj.width ? obj.width : obj.offsetWidth,//            height: obj.height ? obj.height : obj.offsetHeight
//        };//        while (obj && (obj != stopObj)) {
//            info.left += obj.offsetLeft;//            info.top += obj.offsetTop;//            obj = obj.offsetParent;
//        }//        return info;
//    },//    Client: function (elem) {//        // constructor for new simple upload client//        this.handlers = {};//        // unique ID//        this.id = ZeroClipboard.nextId++;//        this.movieId = 'ZeroClipboardMovie_' + this.id;//        // register client with singleton to receive flash events//        ZeroClipboard.register(this.id, this);//        // create movie//        if (elem)//            this.glue(elem);
//    }
//};//ZeroClipboard.Client.prototype = {
//    id: 0, // unique ID for us//    ready: false, // whether movie is ready to receive events or not//    movie: null, // reference to movie object//    clipText: '', // text to copy to clipboard//    handCursorEnabled: true, // whether to show hand cursor, or default pointer cursor//    cssEffects: true, // enable CSS mouse effects on dom container//    handlers: null, // user event handlers//    zIndex: 99, // default zIndex of the movie object//    glue: function (elem, appendElem, stylesToAdd) {//        // glue to DOM element//        // elem can be ID or actual DOM element object//        this.domElement = ZeroClipboard.$(elem);//        // float just above object, or default zIndex if dom element isn't set//        if (this.domElement.style.zIndex) {
//            this.zIndex = parseInt(this.domElement.style.zIndex, 10) + 1;
//        }//        if (typeof (appendElem) == 'string') {
//            appendElem = ZeroClipboard.$(appendElem);
//        } else if (typeof (appendElem) == 'undefined') {
//            appendElem = document.getElementsByTagName('body')[0];
//        }//        // find X/Y position of domElement//        var box = ZeroClipboard.getDOMObjectPosition(this.domElement, appendElem);//        // create floating DIV above element//        this.div = document.createElement('div');//        var style = this.div.style;//        style.position = 'absolute';//        style.left = '' + box.left + 'px';//        style.top = '' + box.top + 'px';//        style.width = '' + box.width + 'px';//        style.height = '' + box.height + 'px';//        style.zIndex = this.zIndex;//        if (typeof (stylesToAdd) == 'object') {
//            for (var addedStyle in stylesToAdd) {
//                style[addedStyle] = stylesToAdd[addedStyle];
//            }
//        }//        // style.backgroundColor = '#f00'; // debug//        appendElem.appendChild(this.div);//        this.div.innerHTML = this.getHTML(box.width, box.height);
//    },//    getHTML: function (width, height) {//        // return HTML for movie//        var html = '';//        var flashvars = 'id=' + this.id + '&width=' + width + '&height=' + height;//        if (navigator.userAgent.match(/MSIE/)) {//            // IE gets an OBJECT tag//            var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';//            html += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + protocol + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + width + '" height="' + height + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + ZeroClipboard.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + flashvars + '"/><param name="wmode" value="transparent"/></object>';
//        } else {//            // all other browsers get an EMBED tag//            html += '<embed id="' + this.movieId + '" src="' + ZeroClipboard.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + width + '" height="' + height + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + flashvars + '" wmode="transparent" />';
//        }//        return html;
//    },//    hide: function () {//        // temporarily hide floater offscreen//        if (this.div) {
//            this.div.style.left = '-2000px';
//        }
//    },//    show: function () {//        // show ourselves after a call to hide()//        this.reposition();
//    },//    destroy: function () {//        // destroy control and floater//        if (this.domElement && this.div) {
//            this.hide();//            this.div.innerHTML = '';//            var body = document.getElementsByTagName('body')[0];//            try {
//                body.removeChild(this.div);
//            } catch (e) {
//            }//            this.domElement = null;//            this.div = null;
//        }
//    },//    reposition: function (elem) {//        // reposition our floating div, optionally to new container//        // warning: container CANNOT change size, only position//        if (elem) {
//            this.domElement = ZeroClipboard.$(elem);//            if (!this.domElement)//                this.hide();
//        }//        if (this.domElement && this.div) {
//            var box = ZeroClipboard.getDOMObjectPosition(this.domElement);//            var style = this.div.style;//            style.left = '' + box.left + 'px';//            style.top = '' + box.top + 'px';
//        }
//    },//    setText: function (newText) {//        // set text to be copied to clipboard//        this.clipText = newText;//        if (this.ready)//            this.movie.setText(newText);
//    },//    addEventListener: function (eventName, func) {//        // add user event listener for event//        // event types: load, queueStart, fileStart, fileComplete, queueComplete, progress, error, cancel//        eventName = eventName.toString().toLowerCase().replace(/^on/, '');//        if (!this.handlers[eventName])//            this.handlers[eventName] = [];//        this.handlers[eventName].push(func);
//    },//    setHandCursor: function (enabled) {//        // enable hand cursor (true), or default arrow cursor (false)//        this.handCursorEnabled = enabled;//        if (this.ready)//            this.movie.setHandCursor(enabled);
//    },//    setCSSEffects: function (enabled) {//        // enable or disable CSS effects on DOM container//        this.cssEffects = !!enabled;
//    },//    receiveEvent: function (eventName, args) {//        // receive event from flash//        eventName = eventName.toString().toLowerCase().replace(/^on/, '');//        // special behavior for certain events//        switch (eventName) {
//            case 'load'://                // movie claims it is ready, but in IE this isn't always the case...//                // bug fix: Cannot extend EMBED DOM elements in Firefox, must use traditional function//                this.movie = document.getElementById(this.movieId);//                if (!this.movie) {
//                    var self = this;//                    setTimeout(function () {
//                        self.receiveEvent('load', null);
//                    }, 1);//                    return;
//                }//                // firefox on pc needs a "kick" in order to set these in certain cases//                if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
//                    var self = this;//                    setTimeout(function () {
//                        self.receiveEvent('load', null);
//                    }, 100);//                    this.ready = true;//                    return;
//                }//                this.ready = true;//                this.movie.setText(this.clipText);//                this.movie.setHandCursor(this.handCursorEnabled);//                break;//            case 'mouseover'://                if (this.domElement && this.cssEffects) {
//                    this.domElement.addClass('hover');//                    if (this.recoverActive)//                        this.domElement.addClass('active');
//                }//                break;//            case 'mouseout'://                if (this.domElement && this.cssEffects) {
//                    this.recoverActive = false;//                    if (this.domElement.hasClass('active')) {
//                        this.domElement.removeClass('active');//                        this.recoverActive = true;
//                    }//                    this.domElement.removeClass('hover');
//                }//                break;//            case 'mousedown'://                if (this.domElement && this.cssEffects) {
//                    this.domElement.addClass('active');
//                }//                break;//            case 'mouseup'://                if (this.domElement && this.cssEffects) {
//                    this.domElement.removeClass('active');//                    this.recoverActive = false;
//                }//                break;
//        }// switch eventName//        if (this.handlers[eventName]) {
//            for (var idx = 0, len = this.handlers[eventName].length; idx < len; idx++) {
//                var func = this.handlers[eventName][idx];//                if (typeof (func) == 'function') {//                    // actual function reference//                    func(this, args);
//                } else if ((typeof (func) == 'object') && (func.length == 2)) {//                    // PHP style object + method, i.e. [myObject, 'myMethod']//                    func[0][func[1]](this, args);
//                } else if (typeof (func) == 'string') {//                    // name of function//                    window[func](this, args);
//                }
//            } // foreach event handler defined//        } // user defined handler for event//    }
//}