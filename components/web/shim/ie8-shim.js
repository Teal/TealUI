import "./atob-shim";

/*@cc_on if(!+"\v1") {

(function () {

    /// 用于创建一个异步请求。
    /// @example new XMLHttpRequest()
    /// @since ES4
    XMLHttpRequest = function () {
        return new ActiveXObject("Microsoft.XMLHTTP");
    };

    /// 为当前元素添加指定监听器。
    /// @since ES4
    /// @memberOf Element.prototype
    /// @example document.body.addEventListener("click", function() {}, false)
    addEventListener = function (eventName, eventHandler) {
        this.attachEvent("on" + eventName, eventHandler);
    };

    /// 为当前元素移除指定监听器。
    /// @since ES4
    /// @memberOf Element.prototype
    /// @example document.body.removeEventListener("click", function() {}, false)
    removeEventListener = function (eventName, eventHandler) {
        this.detachEvent("on" + eventName, eventHandler);
    };

    getComputedStyle = function (el, pseudo) {
        var r = el.currentStyle;
        Object.defineProperty(r, "styleFloat", {
            get: function () {
                return this.cssFloat;
            }
        });
        return r;
    };

    // 让 IE6-8 支持 HTML5 新标签。
    function createHTML5Tags(doc) {
        "abbr article aside audio bdi canvas data datalist details figcaption figure footer header mark meter nav output progress section summary time video".replace(/\w+/g, function (tagName) {
            doc.createElement(tagName);
        });
    }
    createHTML5Tags(document);

    // 定义一个属性。
    function defineProperties(obj, properties) {
        for (var key in properties) {
            var property = properties[key];
            if (typeof property === "function") {
                obj[key] = property;
            } else {
                Object.defineProperty(obj, key, property);
            }
        }
    }

    Document = window.Document || HTMLDocument;

    var createDocumentFragment = Document.prototype.createDocumentFragment;
    defineProperties(Document.prototype, {

        createDocumentFragment: function () {
            var fragment = createDocumentFragment.call(this);
            createHTML5Tags(fragment);
            return fragment;
        },

        addEventListener: addEventListener,
        removeEventListener: removeEventListener,

        getElementsByClassName: function (classNames) {
            return this.querySelectorAll("." + classNames.replace(/^\s+|\s*$/g, "").replace(/\s+/, "."));
        },

        /// 获取当前文档的所属窗口。
        /// @example document.defaultView // window
        /// @since ES4
        defaultView: {
            get: function () {
                return this.parentWindow;
            }
        }

    });

    defineProperties(Element.prototype, {

        addEventListener: addEventListener,
        removeEventListener: removeEventListener,
        getElementsByClassName: document.getElementsByClassName,

        /// 获取当前节点的所属文档。
        /// @example document.body.ownerDocument // document
        /// @since ES4
        ownerDocument: {
            get: function () {
                return this.document;
            }
        },

        /// 获取或设置当前元素的内部文本。
        /// @example 
        /// document.body.textContent
        /// document.body.textContent = "text"
        /// @since ES4
        textContent: {
            get: function () {
                return this.innerText;
            },
            set: function (value) {
                this.innerText = value;
            }
        }

    });

    defineProperties(Event.prototype, {

        /// 阻止当前事件冒泡。
        /// @memberOf Event.prototype
        /// @example 
        /// document.onclick = function(e) { 
        ///     e.stopPropagation();
        /// }
        /// @since ES4
        stopPropagation: function () {
            this.cancelBubble = true;
        },

        /// 阻止事件默认行为。
        /// @memberOf Event.prototype
        /// @example 
        /// document.onclick = function(e){ 
        ///     e.preventDefault();
        /// }
        /// @since ES4
        preventDefault: function () {
            this.returnValue = false;
        },

        /// 获取事件发生的目标元素。
        /// @memberOf Event.prototype
        /// @name target
        /// @example 
        /// document.onclick = function(e){ 
        ///     console.log(e.target);
        /// }
        /// @since ES4
        target: {
            get: function () {
                return this.srcElement;
            }
        },

        /// 获取事件发生的相关元素。
        /// @memberOf Event.prototype
        /// @name relatedTarget
        /// @example 
        /// document.onclick = function(e){ 
        ///     console.log(e.relatedTarget);
        /// }
        /// @since ES4
        relatedTarget: {
            get: function () {
                return this.toElement || this.fromElement;
            }
        },

        /// 获取事件发生的鼠标按键。
        /// @memberOf Event.prototype
        /// @name which
        /// @example 
        /// document.onclick = function(e){ 
        ///     console.log(e.which);
        /// }
        /// @since ES4
        which: {
            get: function () {
                return this.button & 1 ? 1 : (this.button & 2 ? 3 : (this.button & 4 ? 2 : 0));
            }
        },

        /// 获取事件发生的鼠标屏幕水平坐标。
        /// @memberOf Event.prototype
        /// @name pageX
        /// @example 
        /// document.onclick = function(e){ 
        ///     console.log(e.pageX);
        /// }
        /// @since ES4
        pageX: {
            get: function () {
                return this.x;
            }
        },

        /// 获取事件发生的鼠标屏幕垂直坐标。
        /// @memberOf Event.prototype
        /// @name pageY
        /// @example 
        /// document.onclick = function(e){ 
        ///     console.log(e.pageY);
        /// }
        /// @since ES4
        pageY: {
            get: function () {
                return this.y;
            }
        }

    });

    defineProperties(TextRectangle.prototype, {

        /// 获取当前区域的宽。
        /// @memberOf TextRectangle.prototype
        /// @name width
        /// @example document.body.getBoundingClientRect().width
        /// @since ES4
        width: {
            get: function () {
                return this.right - this.left;
            }
        },

        /// 获取当前区域的高。
        /// @memberOf TextRectangle.prototype
        /// @name height
        /// @example document.body.getBoundingClientRect().height
        /// @since ES4
        height: {
            get: function () {
                return this.bottom - this.top;
            }
        }

    });

})();

} @*/
