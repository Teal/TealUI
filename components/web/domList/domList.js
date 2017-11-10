define(["require", "exports", "web/dom"], function (require, exports, dom) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function $(selector, context) {
        return new DomList(selector, context);
    }
    exports.default = $;
    /**
     * 表示一个元素列表。
     */
    function DomList(selector, context) {
        if (typeof selector === "string") {
            if (selector.charCodeAt(0) === 60 /* < */) {
                var parsed = dom.parse(selector, context);
                if (parsed.nodeType === 11 /* DocumentFragment */) {
                    for (var child = parsed.firstChild; child; child = child.nextSibling) {
                        this.push(child);
                    }
                }
                else {
                    this.push(parsed);
                }
            }
            else {
                var list = (context || document).querySelectorAll(selector);
                for (var i = 0, length_1 = list.length; i < length_1; i++) {
                    this.push(list[i]);
                }
            }
        }
        else if (typeof selector === "function") {
            dom.ready(selector, context);
        }
        else if (selector != null) {
            if (typeof selector.nodeType === "number" || selector === selector.window) {
                this.push(selector);
            }
            else if (typeof selector.length === "number") {
                for (var i = 0; i < selector.length; i++) {
                    if (selector[i] != null) {
                        this.push(selector[i]);
                    }
                }
            }
        }
    }
    exports.DomList = DomList;
    $.prototype = DomList.prototype = {
        constructor: $,
        each: function (callback, thisArg) {
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
            return this;
        },
        add: function () {
            for (var _i = 0, arguments_1 = arguments; _i < arguments_1.length; _i++) {
                var argument = arguments_1[_i];
                argument = $(argument);
                for (var i = 0; i < argument.length; i++) {
                    var item = argument[i];
                    if (this.indexOf(item) < 0) {
                        this.push(item);
                    }
                }
            }
            return this;
        },
        find: function (selector) {
            var r = $();
            this.each(function (elem) {
                r.add(elem.querySelectorAll(selector));
            });
            return r;
        },
        filter: function (selector, thisArg) {
            if (typeof selector !== "function") {
                var original = selector;
                selector = function (elem) { return dom.match(elem, selector); };
            }
            return Array.prototype.filter.call(this, selector, thisArg);
        },
        match: function (selector) {
            return this.some(function (elem) { return dom.match(elem, selector); });
        },
        appendTo: function (parent) {
            $(parent).append(this);
            return this;
        },
        hasClass: function (className) {
            return this.some(function (elem) { return className.split(" ").some(function (clazz) { return dom.hasClass(elem, clazz); }); });
        },
        addClass: function (className) {
            return this.each(function (elem) {
                className.split(" ").forEach(function (clazz) { return dom.addClass(elem, clazz); });
            });
        },
        removeClass: function (className) {
            return this.each(function (elem) {
                if (className) {
                    className.split(" ").forEach(function (clazz) { return dom.removeClass(elem, clazz); });
                }
                else {
                    elem.className = "";
                }
            });
        },
        toggleClass: function (className, value) {
            return this.each(function (elem) {
                className.split(" ").forEach(function (clazz) { return dom.toggleClass(elem, clazz, value); });
            });
        }
    };
    function defineMethods(fnNames, factory) {
        fnNames.replace(/\w+/g, (function (fnName) {
            DomList.prototype[fnName] = factory(fnName);
        }));
    }
    defineMethods("length push pop unshift shift splice sort reverse indexOf lastIndexOf every some", function (fnName) { return Array.prototype[fnName]; });
    defineMethods("slice map", function (fnName) { return function () {
        return $(Array.prototype[fnName].apply(this, arguments));
    }; });
    defineMethods("next prev parent closest clone", function (fnName) { return function (selector) {
        return $().add(this.map(function (elem) { return dom[fnName](elem, selector); }));
    }; });
    defineMethods("children", function (fnName) { return function (selector) {
        var r = $();
        this.each(function (elem) {
            r.add(dom[fnName](elem, selector));
        });
        return r;
    }; });
    defineMethods("append prepend before after", function (fnName) { return function (content) {
        if (typeof content === "object") {
            if (this.length) {
                content = $(content, this[0].ownerDocument || this[0].document || this[0]);
                if (content.length) {
                    this.each(function (elem, index) {
                        var current = index === 0 ? content : content.clone();
                        var newNode = dom[fnName](elem, current[0]);
                        for (var i = 1; i < current.length; i++) {
                            dom.after(newNode, current[i]);
                        }
                    });
                }
            }
            return this;
        }
        return this.each(function (elem) { return dom[fnName](elem, content); });
    }; });
    defineMethods("remove on off trigger animate show hide toggle", function (fnName) { return function () {
        return this.each(function (elem) {
            return (_a = dom)[fnName].apply(_a, [elem].concat(arguments));
            var _a;
        });
    }; });
    defineMethods("attr css", function (fnName) { return function (name, value) {
        var domFnName = fnName === "css" ? "Style" : "Attr";
        if (typeof name === "object") {
            var _loop_1 = function (key) {
                this_1.each(function (elem) { return dom["set" + domFnName](elem, key, name[key]); });
            };
            var this_1 = this;
            for (var key in name) {
                _loop_1(key);
            }
            return this;
        }
        if (value === undefined) {
            return this.length ? dom["get" + domFnName](this[0], name) : undefined;
        }
        return this.each(function (elem) { return dom["set" + domFnName](elem, name, value); });
    }; });
    defineMethods("text html scroll rect", function (fnName) { return function (value) {
        var domFnName = fnName.charAt(0).toUpperCase() + fnName.slice(1);
        if (value === undefined) {
            return this.length ? dom["get" + domFnName](this[0]) : undefined;
        }
        return this.each(function (elem) { return dom["set" + domFnName](elem, value); });
    }; });
    defineMethods("val", function (fnName) { return DomList.prototype.text; });
    defineMethods("click focus blur submit select", function (fnName) { return function (handler) {
        return this.each(function (elem) {
            if (handler === undefined) {
                if (elem[fnName]) {
                    elem[fnName]();
                }
                else {
                    dom.trigger(elem, fnName);
                }
            }
            else {
                dom.on(elem, fnName, handler);
            }
        });
    }; });
});
//# sourceMappingURL=domList.js.map