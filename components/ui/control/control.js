var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "web/dom", "web/nextTick"], function (require, exports, dom, nextTick_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示控件的状态。
     */
    var ControlState;
    (function (ControlState) {
        /**
         * 初始状态。
         */
        ControlState[ControlState["initial"] = 1] = "initial";
        /**
         * 需要重新渲染。
         */
        ControlState[ControlState["invalidated"] = 2] = "invalidated";
        /**
         * 正在渲染。
         */
        ControlState[ControlState["rendering"] = 3] = "rendering";
        /**
         * 已渲染。
         */
        ControlState[ControlState["rendered"] = 4] = "rendered";
    })(ControlState = exports.ControlState || (exports.ControlState = {}));
    /**
     * 表示一个控件。
     */
    var Control = /** @class */ (function () {
        function Control() {
        }
        Object.defineProperty(Control.prototype, "elem", {
            /**
             * 关联的元素。
             */
            get: function () {
                if (this.readyState !== 4 /* rendered */) {
                    this.update();
                }
                return this._elem;
            },
            set: function (value) {
                this.readyState = 4 /* rendered */;
                var oldElem = this._elem;
                if (value != oldElem) {
                    if (oldElem) {
                        this.uninit();
                        var parent_1 = oldElem.parentNode;
                        if (parent_1) {
                            if (value) {
                                parent_1.replaceChild(value, oldElem);
                            }
                            else {
                                parent_1.removeChild(oldElem);
                            }
                        }
                        oldElem.__control__ = null;
                    }
                    if ((this._elem = value)) {
                        value.__control__ = value.__control__ || this;
                        this.init();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 当被子类重写时负责在关联元素后初始化当前控件。
         */
        Control.prototype.init = function () { };
        /**
         * 当被子类重写时负责在元素被取消关联前取消初始化当前控件。
         */
        Control.prototype.uninit = function () { };
        /**
         * 重新渲染当前控件。
         */
        Control.prototype.update = function () {
            if (this.readyState !== 3 /* rendering */) {
                this.readyState = 3 /* rendering */;
                var oldVNode = this.vNode;
                var newVNode = this.vNode = (this.alwaysUpdate ? this.render(this.sourceVNode ? this.sourceVNode.children : [], this.sourceVNode ? this.sourceVNode.props : {}) : this.render()) || new VNode(null, "");
                VNode.sync(newVNode, oldVNode);
                var result = newVNode.result;
                this.elem = typeof newVNode.type === "function" ? result.elem : result;
            }
        };
        Control.prototype.render = function () {
            return VNode.create("div", null);
        };
        Object.defineProperty(Control.prototype, "alwaysUpdate", {
            /**
             * 控件是否使用主动更新模式。
             */
            get: function () {
                return this.render.length > 0;
            },
            set: function (value) {
                Object.defineProperty(this, "alwaysUpdate", { value: value, writable: true, configurable: true, enumerable: true });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "body", {
            /**
             * 获取用于包含子控件和节点的根元素。
             */
            get: function () { return this.elem; },
            enumerable: true,
            configurable: true
        });
        /**
         * 重新布局当前控件。
         * @param changes 当前已更新的内容。
         */
        Control.prototype.layout = function (changes) { };
        /**
         * 使当前控件无效并在下一帧重新渲染。
         */
        Control.prototype.invalidate = function () {
            var _this = this;
            if (this.readyState === 4 /* rendered */) {
                this.readyState = 2 /* invalidated */;
                nextTick_1.default(function () {
                    if (_this.readyState === 2 /* invalidated */) {
                        _this.update();
                    }
                });
            }
        };
        /**
         * 将当前控件渲染到指定的父控件或节点。
         * @param parent 要渲染的目标控件或节点。如果为 null 则移除当前控件。
         * @param refChild 在指定的子控件或节点前添加，如果为空则添加到末尾。
         */
        Control.prototype.renderTo = function (parent, refChild) {
            if (parent) {
                if (this.elem) {
                    while (parent instanceof Control) {
                        parent = parent.body || parent.elem;
                    }
                    if (refChild) {
                        parent.insertBefore(this.elem, refChild instanceof Control ? refChild.elem : refChild);
                    }
                    else {
                        parent.appendChild(this.elem);
                    }
                }
            }
            else if (this._elem && this._elem.parentNode) {
                this._elem.parentNode.removeChild(this._elem);
            }
            this.layout(0 /* none */);
        };
        /**
         * 在当前控件查找指定的子控件或节点。
         * @param selector 要查找的 CSS 选择器。如果为空则返回根控件或节点。
         * @return 返回子控件或节点。如果找不到则返回 null。
         */
        Control.prototype.find = function (selector) {
            var elem = this.elem;
            if (selector) {
                elem = elem && dom.find(elem, selector);
                return elem && elem.__control__ || elem;
            }
            return this.vNode ? this.vNode.result : elem;
        };
        /**
         * 在当前控件查找匹配的所有子控件或节点。
         * @param selector 要查找的 CSS 选择器。如果为空则返回根控件或节点。
         * @return 返回子控件或节点列表。
         */
        Control.prototype.query = function (selector) {
            if (selector) {
                return this.elem ? dom.query(this.elem, selector).map(function (elem) { return elem.__control__ || elem; }) : [];
            }
            var root = this.find(selector);
            return root ? [root] : [];
        };
        Object.defineProperty(Control.prototype, "class", {
            /**
             * CSS 类名。
             */
            get: function () {
                return this._class || "";
            },
            set: function (value) {
                var _this = this;
                if (this._class) {
                    this._class.split(" ").forEach(function (c) { return dom.removeClass(_this.elem, c); });
                }
                this._class = value;
                if (value) {
                    value.split(" ").forEach(function (c) { return dom.addClass(_this.elem, c); });
                }
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            bind("", "hidden")
        ], Control.prototype, "hidden", void 0);
        __decorate([
            bind("", "style")
        ], Control.prototype, "style", void 0);
        __decorate([
            bind("", "id")
        ], Control.prototype, "id", void 0);
        __decorate([
            bind("@body", "innerHTML")
        ], Control.prototype, "content", void 0);
        __decorate([
            bind("", "onSelectStart")
        ], Control.prototype, "onSelectStart", void 0);
        __decorate([
            bind("", "onClick")
        ], Control.prototype, "onClick", void 0);
        __decorate([
            bind("", "onAuxClick")
        ], Control.prototype, "onAuxClick", void 0);
        __decorate([
            bind("", "onDblClick")
        ], Control.prototype, "onDblClick", void 0);
        __decorate([
            bind("", "onContextMenu")
        ], Control.prototype, "onContextMenu", void 0);
        __decorate([
            bind("", "onMouseDown")
        ], Control.prototype, "onMouseDown", void 0);
        __decorate([
            bind("", "onMouseUp")
        ], Control.prototype, "onMouseUp", void 0);
        __decorate([
            bind("", "onMouseOver")
        ], Control.prototype, "onMouseOver", void 0);
        __decorate([
            bind("", "onMouseOut")
        ], Control.prototype, "onMouseOut", void 0);
        __decorate([
            bind("", "onMouseEnter")
        ], Control.prototype, "onMouseEnter", void 0);
        __decorate([
            bind("", "onMouseLeave")
        ], Control.prototype, "onMouseLeave", void 0);
        __decorate([
            bind("", "onMouseMove")
        ], Control.prototype, "onMouseMove", void 0);
        __decorate([
            bind("", "onWheel")
        ], Control.prototype, "onWheel", void 0);
        __decorate([
            bind("", "onScroll")
        ], Control.prototype, "onScroll", void 0);
        __decorate([
            bind("", "onTouchStart")
        ], Control.prototype, "onTouchStart", void 0);
        __decorate([
            bind("", "onTouchMove")
        ], Control.prototype, "onTouchMove", void 0);
        __decorate([
            bind("", "onTouchEnd")
        ], Control.prototype, "onTouchEnd", void 0);
        __decorate([
            bind("", "onTouchCancel")
        ], Control.prototype, "onTouchCancel", void 0);
        __decorate([
            bind("", "onPointerEnter")
        ], Control.prototype, "onPointerEnter", void 0);
        __decorate([
            bind("", "onPointerLeave")
        ], Control.prototype, "onPointerLeave", void 0);
        __decorate([
            bind("", "onPointerOver")
        ], Control.prototype, "onPointerOver", void 0);
        __decorate([
            bind("", "onPointerOut")
        ], Control.prototype, "onPointerOut", void 0);
        __decorate([
            bind("", "onPointerDown")
        ], Control.prototype, "onPointerDown", void 0);
        __decorate([
            bind("", "onPointerMove")
        ], Control.prototype, "onPointerMove", void 0);
        __decorate([
            bind("", "onPointerUp")
        ], Control.prototype, "onPointerUp", void 0);
        __decorate([
            bind("", "onPointerCancel")
        ], Control.prototype, "onPointerCancel", void 0);
        __decorate([
            bind("", "onGotPointerCapture")
        ], Control.prototype, "onGotPointerCapture", void 0);
        __decorate([
            bind("", "onLostPointerCapture")
        ], Control.prototype, "onLostPointerCapture", void 0);
        return Control;
    }());
    exports.default = Control;
    Control.prototype.readyState = 1 /* initial */;
    Control.prototype.duration = 200;
    /**
     * 表示一个虚拟节点。
     */
    var VNode = /** @class */ (function () {
        /**
         * 初始化新的虚拟节点。
         * @param type 节点类型。如果是字符串表示 HTML 原生节点；如果是 null 表示文本节点；如果是函数表示控件。
         * @param props 节点属性。如果是文本节点则表示节点内容。
         * @param children 所有子节点。
         */
        function VNode(type, props, children) {
            this.type = type;
            this.props = props;
            this.children = children;
        }
        /**
         * 添加一个或多个子节点。
         * @param child 要添加的子内容。
         */
        VNode.prototype.append = function (child) {
            if (child == null) {
                return;
            }
            if (Array.isArray(child)) {
                for (var _i = 0, child_1 = child; _i < child_1.length; _i++) {
                    var item = child_1[_i];
                    this.append(item);
                }
            }
            else {
                this.children.push(child instanceof VNode ? child : new VNode(null, child));
            }
        };
        /**
         * 创建一个虚拟节点。
         * @param type 节点类型。如果是字符串表示 HTML 原生节点；如果是 null 表示文本节点；如果是函数表示控件。
         * @param props 节点属性。如果是文本节点则表示节点内容。
         * @param children 所有子内容。
         * @return 返回创建的虚拟节点。
         */
        VNode.create = function (type, props) {
            var children = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                children[_i - 2] = arguments[_i];
            }
            var r = new VNode(type, props, []);
            r.append(children);
            return r;
        };
        /**
         * 生成虚拟节点对应的真实节点或控件。
         * @param newVNode 新虚拟节点。
         * @param oldVNode 如果指定了原虚拟节点，则同步时尽量重用上次生成的真实节点。
         * @return 返回所有更新标记。
         */
        VNode.sync = function (newVNode, oldVNode) {
            // 第一步：同步根节点：如果节点类型和 ID（如果存在）都不变，则重用上一次生成的节点，否则重新生成。
            var type = newVNode.type;
            var isControl = typeof type === "function";
            var recreated = !oldVNode || type !== oldVNode.type || type && newVNode.props && oldVNode.props && newVNode.props.id && oldVNode.props.id && newVNode.props.id !== oldVNode.props.id;
            var result = newVNode.result = recreated ? type ? isControl ? new type() : document.createElement(type) : document.createTextNode(newVNode.props) : oldVNode.result;
            var r = recreated ? 1 /* type */ : 0 /* none */;
            if (type) {
                // 第二步：控件和元素：同步属性。
                var body = void 0;
                var setters = void 0;
                var deletedCount = void 0;
                if (isControl) {
                    // 控件的属性分为：
                    // - 自定义属性：直接赋值并标记 invalidated。
                    // - @bind 绑定的属性：更新属性值并标记 invalidated。
                    // - @bind(...) 绑定的属性或自定义访问器：等待当前节点和子节点同步完成后设置。
                    // 更新创建控件使用的虚拟节点。
                    result.sourceVNode = newVNode;
                    // 判断控件是否总是强制更新。
                    var alwaysUpdate = result.alwaysUpdate;
                    if (alwaysUpdate) {
                        r |= 2 /* state */;
                        result.readyState = 2 /* invalidated */;
                    }
                    // 同步被删除的属性。
                    if (!recreated) {
                        for (var prop in oldVNode.props) {
                            if (!newVNode.props || !(prop in newVNode.props)) {
                                var propType = VNode.getPropType(type, prop);
                                if (propType === 1 /* state */) {
                                    r |= 2 /* state */;
                                    delete data(result)[prop];
                                    result.readyState = 2 /* invalidated */;
                                }
                                else if (propType === 3 /* setter */) {
                                    setters = setters || [];
                                    deletedCount = deletedCount + 1 || 1;
                                    setters.push(prop);
                                }
                                else if (propType !== 2 /* getter */) {
                                    r |= 4 /* prop */;
                                    delete result[prop];
                                }
                            }
                        }
                    }
                    // 同步新增和更新的属性。
                    for (var prop in newVNode.props) {
                        var value = newVNode.props[prop];
                        var propType = VNode.getPropType(type, prop);
                        if (propType === 1 /* state */) {
                            if (recreated || !oldVNode.props || value !== oldVNode.props[prop]) {
                                r |= 2 /* state */;
                                data(result)[prop] = value;
                                result.readyState = 2 /* invalidated */;
                            }
                        }
                        else if (propType === 3 /* setter */) {
                            setters = setters || [];
                            setters.push(prop);
                        }
                        else if (propType !== 2 /* getter */ && (recreated || !oldVNode.props || value !== oldVNode.props[prop])) {
                            r |= 4 /* prop */;
                            result[prop] = value;
                        }
                    }
                    // 如果控件使用永久更新模式，则控件内部处理子控件，不再递归更新。
                    if (!alwaysUpdate) {
                        body = result.body;
                    }
                }
                else {
                    // HTML 元素可以直接设置所有已更改的属性。
                    // 同步新增和更新的属性。
                    for (var prop in newVNode.props) {
                        var value = newVNode.props[prop];
                        if (recreated || VNode.alwaysSet(type, prop, result) || !oldVNode.props || value !== oldVNode.props[prop]) {
                            r |= 4 /* prop */;
                            VNode.set(result, prop, value);
                        }
                    }
                    // 同步被删除的属性。
                    if (!recreated) {
                        for (var prop in oldVNode.props) {
                            if (!newVNode.props || !(prop in newVNode.props)) {
                                r |= 4 /* prop */;
                                VNode.set(result, prop, null);
                            }
                        }
                    }
                    // 递归更新子节点。
                    body = result;
                }
                // 第三步：同步子节点。
                if (body) {
                    // 同步新增或更新的子节点。
                    var index = 0;
                    for (var _i = 0, _a = newVNode.children; _i < _a.length; _i++) {
                        var newChild = _a[_i];
                        var oldChild = (!recreated && oldVNode.children[index++]);
                        var childChanges = VNode.sync(newChild, oldChild);
                        if (childChanges) {
                            r |= 8 /* children */;
                            if (childChanges & 1 /* type */) {
                                index--;
                                var newChildResult = newChild.result;
                                var oldChildResult = oldChild ? oldChild.result : null;
                                if (newChildResult instanceof Control) {
                                    newChildResult.renderTo(result, oldChildResult);
                                }
                                else {
                                    try {
                                        if (oldChildResult) {
                                            body.insertBefore(newChildResult, oldChildResult instanceof Control ? oldChildResult.elem : oldChildResult);
                                        }
                                        else {
                                            body.appendChild(newChildResult);
                                        }
                                    }
                                    catch (e) { }
                                }
                            }
                        }
                    }
                    // 同步删除的子节点。
                    if (!recreated) {
                        for (; index < oldVNode.children.length; index++) {
                            r |= 8 /* children */;
                            var oldChildResult = oldVNode.children[index].result;
                            if (oldChildResult instanceof Control) {
                                oldChildResult.renderTo(null);
                            }
                            else {
                                try {
                                    body.removeChild(oldChildResult);
                                }
                                catch (e) { }
                            }
                        }
                    }
                }
                // 第四步：当前控件和子控件全部同步完毕，重新布局。
                if (isControl) {
                    // 设置属性。
                    // 只要当前节点重新生成或渲染都强制重新设置属性。
                    // 对于自定义访问器，由于不确定其内部是否使用子节点等信息。
                    // 因此只要子节点有任何改变都强制重新设置。
                    if (setters) {
                        var i = 0;
                        if (deletedCount) {
                            for (; i < deletedCount; i++) {
                                r |= 4 /* prop */;
                                result[setters[i]] = null;
                            }
                        }
                        for (; i < setters.length; i++) {
                            var setter = setters[i];
                            var value = newVNode.props[setter];
                            if (r & (1 /* type */ | 2 /* state */)
                                || ((r & 8 /* children */) && VNode.getPropType(type, setter) === 3 /* setter */)
                                || VNode.alwaysSet(type, setter, result)
                                || !oldVNode.props
                                || value !== oldVNode.props[setter]) {
                                r |= 4 /* prop */;
                                result[setter] = value;
                            }
                        }
                    }
                    // 所有渲染所需属性都已传递给控件，确保控件已渲染。
                    if (result.readyState !== 4 /* rendered */) {
                        result.update();
                    }
                    // 通知控件重新布局。
                    result.layout(r);
                }
            }
            else if (!recreated && oldVNode.props != newVNode.props) {
                // 第二步：文本节点：同步文本内容。
                r |= 4 /* prop */;
                result.textContent = newVNode.props;
            }
            return r;
        };
        /**
         * 判断控件类型是否包含指定的属性。
         * @param type 要判断的控件类型。
         * @param prop 要判断的属性名。
         * @return 如果属性无 get/set 操作则返回 true，否则返回 false。
         */
        VNode.getPropType = function (type, prop) {
            var propTypes = VNode.getOwnPropTypes(type);
            var value = propTypes[prop];
            if (value == undefined) {
                if (type.prototype.hasOwnProperty(prop)) {
                    var descriptor = Object.getOwnPropertyDescriptor(type.prototype, prop);
                    value = descriptor ? descriptor.set ? 3 /* setter */ : descriptor.get ? 2 /* getter */ : 0 /* value */ : 0 /* value */;
                }
                else {
                    var proto = Object.getPrototypeOf(type.prototype);
                    value = proto && proto !== Object.prototype ? VNode.getPropType(proto.constructor, prop) : 0 /* value */;
                }
                propTypes[prop] = value;
            }
            return value;
        };
        /**
         * 获取控件类型本身的属性列表。
         * @param type 控件类型。
         * @return 返回属性列表。
         */
        VNode.getOwnPropTypes = function (type) {
            return type.hasOwnProperty("propTypes") ? type.propTypes : (type.propTypes = { __proto__: null });
        };
        /**
         * 判断是否需要强制更新指定的属性。
         * @param type 节点类型。
         * @param prop 节点属性。
         * @param target 要重置的控件或节点。
         * @return 如果需要强制更新则返回 true，否则返回 false。
         */
        VNode.alwaysSet = function (type, prop, target) {
            return false;
            // switch (prop) {
            //     case "value":
            //     case "checked":
            //     case "selected":
            //         return true;
            //     default:
            //         return false;
            // }
        };
        /**
         * 获取节点的属性。
         * @param target 要获取的节点。
         * @param prop 要获取的属性名。
         * @param args 附加参数。部分属性需要附加参数。
         * @param root 事件作用域。
         * @return 返回属性值。
         */
        VNode.get = function (target, prop, args, root) {
            var hook = VNode.props[prop];
            if (hook) {
                return hook.get(target, args);
            }
            if (/^on[^a-z]/.test(prop)) {
                return data(root || target)[args ? prop + " " + args : prop];
            }
            return dom.getAttr(target, prop);
        };
        /**
         * 设置节点的属性。
         * @param target 要设置的节点。
         * @param prop 要设置的属性名。
         * @param value 要设置的属性值。
         * @param args 附加参数。部分属性需要附加参数。
         * @param root 事件作用域。
         */
        VNode.set = function (target, prop, value, args, root) {
            if (value === void 0) { value = null; }
            var hook = VNode.props[prop];
            if (hook) {
                hook.set(target, value, args);
            }
            else if (/^on[^a-z]/.test(prop)) {
                var eventName = prop.slice(2).toLowerCase();
                var datas = data(root || target);
                var key = args ? prop + " " + args : prop;
                if (datas[key]) {
                    dom.off(target, eventName, args || "", datas[key], root || target.__control__);
                }
                if ((datas[key] = value)) {
                    dom.on(target, eventName, args || "", value, root || target.__control__);
                }
            }
            else {
                dom.setAttr(target, prop, value);
            }
        };
        /**
         * 设置节点特殊属性的读写方式。
         */
        VNode.props = {
            __proto__: null,
            class: {
                get: function (elem, args) {
                    if (args) {
                        return dom.hasClass(elem, args);
                    }
                    return elem.className;
                },
                set: function (elem, value, args) {
                    if (args) {
                        dom.toggleClass(elem, args, value);
                    }
                    else {
                        elem.className = value;
                    }
                }
            },
            style: {
                get: function (elem, args) {
                    if (args) {
                        return dom.getStyle(elem, args);
                    }
                    return elem.style;
                },
                set: function (elem, value, args) {
                    if (args) {
                        dom.setStyle(elem, args, value);
                    }
                    else if (value == null || typeof value === "string") {
                        elem.style.cssText = value;
                    }
                    else {
                        for (var key in value) {
                            dom.setStyle(elem, key, value[key]);
                        }
                    }
                }
            },
            hidden: {
                get: function (elem) {
                    return dom.getAttr(elem, "hidden") || dom.isHidden(elem);
                },
                set: function (elem, value) {
                    dom.setAttr(elem, "hidden", value);
                }
            },
            innerHTML: {
                get: dom.getHtml,
                set: function (elem, value) {
                    if (typeof value === "object") {
                        elem.innerHTML = "";
                        if (Array.isArray(value)) {
                            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                                var item = value_1[_i];
                                render(elem, item);
                            }
                        }
                        else {
                            render(elem, value);
                        }
                    }
                    else {
                        dom.setHtml(elem, value);
                    }
                }
            }
        };
        return VNode;
    }());
    exports.VNode = VNode;
    /**
     * 表示更新的类型。
     */
    var Changes;
    (function (Changes) {
        /**
         * 没有任何改变。
         */
        Changes[Changes["none"] = 0] = "none";
        /**
         * 类型发生改变。根节点已重新创建。
         */
        Changes[Changes["type"] = 1] = "type";
        /**
         * 状态发生改变。控件已重新渲染。
         */
        Changes[Changes["state"] = 2] = "state";
        /**
         * 属性发生改变。
         */
        Changes[Changes["prop"] = 4] = "prop";
        /**
         * 子控件或元素发生改变。
         */
        Changes[Changes["children"] = 8] = "children";
    })(Changes = exports.Changes || (exports.Changes = {}));
    /**
     * 表示控件属性的类型。
     */
    var PropType;
    (function (PropType) {
        /**
         * 该属性是一个普通的值。
         */
        PropType[PropType["value"] = 0] = "value";
        /**
         * 该属性是一个状态值。设置该属性后需要更新控件。
         */
        PropType[PropType["state"] = 1] = "state";
        /**
         * 该属性是一个只读访问器。
         */
        PropType[PropType["getter"] = 2] = "getter";
        /**
         * 该属性是一个可写访问器。
         */
        PropType[PropType["setter"] = 3] = "setter";
    })(PropType = exports.PropType || (exports.PropType = {}));
    /**
     * 获取指定对象关联的数据对象。
     * @param obj 要获取的对象。
     * @return 返回一个数据对象。
     */
    function data(obj) {
        return obj.__data__ || (obj.__data__ = { __proto__: null });
    }
    exports.data = data;
    function bind(target, propertyName, selector, prop, args, descriptor) {
        // @bind(...)
        if (!target || typeof target !== "object") {
            return function (target2, propertyName2, descriptor2) {
                return bind(target2, propertyName2, target, propertyName, selector, descriptor2);
            };
        }
        // 支持 bind(target, propertyName, descriptor)
        if (selector && typeof selector === "object") {
            descriptor = selector;
            selector = undefined;
        }
        // 标记属性类型。
        if (selector == undefined) {
            VNode.getOwnPropTypes(target.constructor)[propertyName] = 1 /* state */;
        }
        var desc = selector == undefined ?
            {
                get: function () {
                    return data(this)[propertyName];
                },
                set: function (value) {
                    data(this)[propertyName] = value;
                    this.invalidate();
                }
            }
            : selector.charCodeAt(0) === 64 /*@*/ && (selector = selector.slice(1)) ?
                prop == undefined ?
                    {
                        get: function () {
                            return this[selector];
                        },
                        set: function (value) {
                            this[selector] = value;
                        }
                    } : {
                    get: function () {
                        return getProp(this[selector], prop, args, this);
                    },
                    set: function (value) {
                        setProp(this[selector], prop, value, args, this);
                    }
                }
                : prop == undefined ?
                    {
                        get: function () {
                            return this.find(selector);
                        },
                        set: function (value) {
                            Object.defineProperty(this, propertyName, {
                                value: value
                            });
                        }
                    } : {
                    get: function () {
                        return getProp(this.find(selector), prop, args, this);
                    },
                    set: function (value) {
                        setProp(this.find(selector), prop, value, args, this);
                    }
                };
        desc.configurable = desc.enumerable = true;
        // 使用 Babel/TypeScript 时会传递 descriptor，此时返回属性描述器以便定义。
        if (descriptor !== undefined) {
            return desc;
        }
        Object.defineProperty(target, propertyName, desc);
    }
    exports.bind = bind;
    function getProp(target, prop, args, root) {
        if (target == null) {
            return;
        }
        if (target instanceof Node) {
            return VNode.get(target, prop, args, root);
        }
        var value = target[prop];
        if (value && /^on[^a-z]/.test(prop)) {
            value = value.__original__ || value;
        }
        return value;
    }
    function setProp(target, prop, value, args, root) {
        if (target != null) {
            if (target instanceof Node) {
                VNode.set(target, prop, value, args, root);
            }
            else {
                if (value && /^on[^a-z]/.test(prop)) {
                    var original_1 = value;
                    value = function () {
                        if (arguments[arguments.length - 1] === target) {
                            arguments[arguments.length - 1] = root;
                        }
                        return original_1.apply(root, arguments);
                    };
                    value.__original__ = original_1;
                }
                target[prop] = value;
            }
        }
    }
    /**
     * 获取一个控件或节点。
     * @param value 一个虚拟节点、节点、控件、选择器或 HTML 片段。]
     * @return 返回一个控件或节点。如果找不到则返回 null。
     */
    function from(value) {
        if (value instanceof VNode) {
            if (!value.result) {
                VNode.sync(value);
            }
            value = value.result;
        }
        else {
            if (typeof value !== "object") {
                value = dom.parse(value);
            }
            value = value && value.__control__ || value;
        }
        return value;
    }
    exports.from = from;
    /**
     * 将指定的内容渲染到指定的容器。
     * @param parent 要渲染的容器节点。
     * @param content 要渲染的内容。可以是一个虚拟节点、节点、控件、选择器或 HTML 片段。
     * @return 返回生成的节点。
     */
    function render(parent, content) {
        content = from(content);
        if (content instanceof Control) {
            content.renderTo(parent);
        }
        else if (content) {
            (parent instanceof Control ? parent.elem : parent).appendChild(content);
        }
        return content;
    }
    exports.render = render;
});
//# sourceMappingURL=control.js.map