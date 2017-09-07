/// <reference path="jsx.d.ts" />
import * as dom from "ux/dom";
import nextTick from "ux/nextTick";

/**
 * 表示一个控件。
 */
export default class Control {

    /**
     * 获取当前控件的状态。
     */
    state: ControlState;

    /**
     * 存储关联的元素。
     */
    private _elem: HTMLElement;

    /**
     * 关联的元素。
     */
    get elem() {
        if (this.state !== ControlState.rendered) {
            this.update();
        }
        return this._elem;
    }
    set elem(value) {
        this.state = ControlState.rendered;
        const oldElem = this._elem;
        if (value != oldElem) {
            if (oldElem) {
                this.uninit();
                const parent = oldElem.parentNode;
                if (parent) {
                    if (value) {
                        parent.replaceChild(value, oldElem);
                    } else {
                        parent.removeChild(oldElem);
                    }
                }
                delete (oldElem as any as JSX.ElementExtension).__control__;
            }
            this._elem = value;
            if (value) {
                (value as any as JSX.ElementExtension).__control__ = (value as any as JSX.ElementExtension).__control__ || this;
                this.init();
            }
        }
    }

    /**
     * 当被子类重写时负责在关联元素后初始化当前控件。
     */
    protected init() { }

    /**
     * 当被子类重写时负责在元素被取消关联前取消初始化当前控件。
     */
    protected uninit() { }

    /**
     * 当前控件关联的虚拟节点。
     */
    protected vNode: VNode | null;

    /**
     * 重新渲染当前控件。
     */
    update() {
        if (this.state !== ControlState.rendering) {
            this.state = ControlState.rendering;
            const oldVNode = this.vNode;
            const newVNode = this.vNode = this.render() || VNode.create(null, "");
            VNode.sync(newVNode, oldVNode);
            const result = newVNode.result as HTMLElement | Control;
            this.elem = result instanceof Control ? result.elem : result;
        }
    }

    /**
     * 当被子类重写时负责返回当前控件的虚拟节点。
     * @return 返回表示当前控件内容的虚拟节点。如果当前控件不渲染任何内容则返回 null。
     */
    protected render(): VNode | null {
        return <div />;
    }

    /**
     * 使当前控件无效并在下一帧重新渲染。
     */
    invalidate() {
        if (this.state === ControlState.rendered) {
            this.state = ControlState.invalidated;
            nextTick(() => {
                if (this.state === ControlState.invalidated) {
                    this.update();
                }
            });
        }
    }

    /**
     * 如果当前控件是一个普通容器则返回用于包含子节点的根元素。
     */
    body: HTMLElement | null;

    /**
     * 内部子节点。
     */
    get children() {
        return data(this).children as NodeLike[];
    }
    set children(value) {
        data(this).children = value;

        const body = this.body;
        if (body) {
            body.innerHTML = "";
            value.forEach(child => {
                render(body, child);
            });
        } else {
            this.update();
        }
        this.layout();
    }

    /**
     * 重新布局当前控件。
     */
    layout() { }

    /**
     * 将当前控件渲染到指定的父控件或节点。
     * @param parent 要渲染的目标控件或节点。如果为 null 则移除当前控件。
     * @param refChild 在指定的子控件或节点前添加，如果为空则添加到末尾。
     */
    renderTo(parent: Control | Node | null, refChild?: Control | Node | null) {
        if (parent) {
            if (this.elem) {
                if (parent instanceof Control) {
                    parent = parent.body || parent.elem;
                }
                if (refChild) {
                    parent.insertBefore(this.elem, refChild instanceof Control ? refChild.elem : refChild);
                } else {
                    parent.appendChild(this.elem);
                }
            }
        } else if (this._elem && this._elem.parentNode) {
            this._elem.parentNode.removeChild(this._elem);
        }
        this.layout();
    }

    /**
     * 在当前控件查找指定的子控件或节点。
     * @param selector 要查找的 CSS 选择器。如果为空则返回根控件或节点。
     * @return 返回子控件或节点。如果找不到则返回 null。
     */
    find(selector: string) {
        let elem = this.elem as HTMLElement | null;
        if (selector) {
            elem = elem && dom.find(elem, selector);
            return elem && (elem as any as JSX.ElementExtension).__control__ || elem;
        }
        return this.vNode ? this.vNode.result as HTMLElement | Control : elem;
    }

    /**
     * 在当前控件查找匹配的所有子控件或节点。
     * @param selector 要查找的 CSS 选择器。如果为空则返回根控件或节点。
     * @return 返回子控件或节点列表。
     */
    query(selector: string) {
        if (selector) {
            return this.elem ? dom.query(this.elem, selector).map(elem => (elem as any as JSX.ElementExtension).__control__ || elem) : [];
        }
        const root = this.find(selector);
        return root ? [root] : [];
    }

    /**
     * 使用 JSX 语法定义控件时支持的属性。
     */
    private "__props__": Partial<this>;

    /**
     * 渐变的持续毫秒数。如果为 0 则不使用渐变。
     */
    duration: number;

    /**
     * 是否隐藏。
     */
    @bind("", "hidden") hidden: boolean;

    /**
     * 存储上次设置的类名。
     */
    private _class: string;

    /**
     * CSS 类名。
     */
    get class() {
        return this._class || "";
    }
    set class(value) {
        if (this._class) {
            this._class.split(" ").forEach((c: string) => dom.removeClass(this.elem, c));
        }
        this._class = value;
        if (value) {
            value.split(" ").forEach((c: string) => dom.addClass(this.elem, c));
        }
    }

    /**
     * 控件样式。
     */
    @bind("", "style") style: { [key: string]: string | number } | string;

    /**
     * 控件序号。
     */
    @bind("", "id") id: string;

    /**
     * 选择开始事件。
     * @see https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onselectstart
     */
    @bind("", "onSelectStart") onSelectStart: (e: Event, sender: this) => void;

    /**
     * 点击事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onclick
     */
    @bind("", "onClick") onClick: (e: MouseEvent, sender: this) => void;

    /**
     * 中键点击事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onauxclick
     */
    @bind("", "onAuxClick") onAuxClick: (e: MouseEvent, sender: this) => void;

    /**
     * 双击事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ondblclick
     */
    @bind("", "onDblClick") onDblClick: (e: MouseEvent, sender: this) => void;

    /**
     * 右键菜单事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/oncontextmenu
     */
    @bind("", "onContextMenu") onContextMenu: (e: PointerEvent, sender: this) => void;

    /**
     * 鼠标按下事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onmousedown
     */
    @bind("", "onMouseDown") onMouseDown: (e: MouseEvent, sender: this) => void;

    /**
     * 鼠标按上事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onmouseup
     */
    @bind("", "onMouseUp") onMouseUp: (e: MouseEvent, sender: this) => void;

    /**
     * 鼠标移入事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onmouseover
     */
    @bind("", "onMouseOver") onMouseOver: (e: MouseEvent, sender: this) => void;

    /**
     * 鼠标移开事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onmouseout
     */
    @bind("", "onMouseOut") onMouseOut: (e: MouseEvent, sender: this) => void;

    /**
     * 鼠标进入事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onmouseenter
     */
    @bind("", "onMouseEnter") onMouseEnter: (e: MouseEvent, sender: this) => void;

    /**
     * 鼠标离开事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onmouseleave
     */
    @bind("", "onMouseLeave") onMouseLeave: (e: MouseEvent, sender: this) => void;

    /**
     * 鼠标移动事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onmousemove
     */
    @bind("", "onMouseMove") onMouseMove: (e: MouseEvent, sender: this) => void;

    /**
     * 鼠标滚轮事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/Events/wheel
     */
    @bind("", "onWheel") onWheel: (e: WheelEvent, sender: this) => void;

    /**
     * 滚动事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onscroll
     */
    @bind("", "onScroll") onScroll: (e: UIEvent, sender: this) => void;

    /**
     * 触摸开始事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ontouchstart
     */
    @bind("", "onTouchStart") onTouchStart: (e: TouchEvent, sender: this) => void;

    /**
     * 触摸移动事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ontouchmove
     */
    @bind("", "onTouchMove") onTouchMove: (e: TouchEvent, sender: this) => void;

    /**
     * 触摸结束事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ontouchend
     */
    @bind("", "onTouchEnd") onTouchEnd: (e: TouchEvent, sender: this) => void;

    /**
     * 触摸撤销事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ontouchcancel
     */
    @bind("", "onTouchCancel") onTouchCancel: (e: TouchEvent, sender: this) => void;

    /**
     * 指针进入事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpointerenter
     */
    @bind("", "onPointerEnter") onPointerEnter: (e: PointerEvent, sender: this) => void;

    /**
     * 指针离开事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpointerleave
     */
    @bind("", "onPointerLeave") onPointerLeave: (e: PointerEvent, sender: this) => void;

    /**
     * 指针移入事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpointerover
     */
    @bind("", "onPointerOver") onPointerOver: (e: PointerEvent, sender: this) => void;

    /**
     * 指针移开事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpointerout
     */
    @bind("", "onPointerOut") onPointerOut: (e: PointerEvent, sender: this) => void;

    /**
     * 指针按下事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpointerdown
     */
    @bind("", "onPointerDown") onPointerDown: (e: PointerEvent, sender: this) => void;

    /**
     * 指针移动事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpointermove
     */
    @bind("", "onPointerMove") onPointerMove: (e: PointerEvent, sender: this) => void;

    /**
     * 指针松开事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpointerup
     */
    @bind("", "onPointerUp") onPointerUp: (e: PointerEvent, sender: this) => void;

    /**
     * 指针取消事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onpointercancel
     */
    @bind("", "onPointerCancel") onPointerCancel: (e: PointerEvent, sender: this) => void;

    /**
     * 指针开始捕获事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/ongotpointercapture
     */
    @bind("", "onGotPointerCapture") onGotPointerCapture: (e: PointerEvent, sender: this) => void;

    /**
     * 指针停止捕获事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onlostpointercapture
     */
    @bind("", "onLostPointerCapture") onLostPointerCapture: (e: PointerEvent, sender: this) => void;

    /**
     * 当前控件的属性列表。
     */
    static propTypes: { [prop: string]: PropType };

}

Control.prototype.state = ControlState.initial;
Control.prototype.duration = 200;

/**
 * 表示控件的状态。
 */
export const enum ControlState {

    /**
     * 初始状态。
     */
    initial = 1,

    /**
     * 需要重新渲染。
     */
    invalidated = 2,

    /**
     * 正在渲染。
     */
    rendering = 3,

    /**
     * 已渲染。
     */
    rendered = 4,

}

const emptyArray: any = Object.freeze([]);

/**
 * 表示一个虚拟节点。
 */
export class VNode {

    /**
     * 初始化新的虚拟节点。
     * @param type 节点类型。如果是 null 表示文本节点；如果是字符串表示 HTML 原生节点；如果是函数表示控件。
     * @param props 节点属性。如果是文本节点则表示节点内容。
     * @param children 所有子节点。
     */
    constructor(public type: null | string | (new () => Control), public props: any | { [name: string]: any; } | null, public children: VNode[]) { }

    /**
     * 获取同步后生成的控件或节点。
     */
    result: Text | HTMLElement | Control;

    /**
     * 添加一个或多个子节点。
     * @param child 要添加的子内容。
     * @return 返回 *child*。
     */
    append<T extends any>(child: T | null) {
        if (child != null) {
            if (Array.isArray(child)) {
                for (const item of child) {
                    this.append(item);
                }
            } else {
                this.children.push(child instanceof VNode ? child : new VNode(null, child, emptyArray));
            }
        }
        return child;
    }

    /**
     * 创建一个虚拟节点。
     * @param type 节点类型。如果是 null 表示文本节点；如果是字符串表示 HTML 原生节点；如果是函数表示控件。
     * @param props 节点属性。
     * @param childNodes 所有子内容。
     * @return 返回创建的虚拟节点。
     */
    static create(type: VNode["type"], props: VNode["props"], ...childNodes: any[]) {
        const result = new VNode(type, props, []);
        result.append(childNodes);
        return result;
    }

    /**
     * 同步虚拟节点，创建虚拟节点对应的真实节点。
     * @param newVNode 新虚拟节点。
     * @param oldVNode 如果指定了原虚拟节点，则同步时尽量重用上次创建的真实节点。
     * @return 如果根节点发生改变则返回 true，否则返回 false。
     */
    static sync(newVNode: VNode, oldVNode?: VNode | null) {

        // 第一步：同步根节点。
        // 如果节点类型和 ID 不变，则重用上一次生成的节点，否则重新生成。
        const type = newVNode.type;
        const changed = !oldVNode || type !== oldVNode.type || type && newVNode.props && oldVNode.props && newVNode.props.id && oldVNode.props.id && newVNode.props.id !== oldVNode.props.id;
        const isControl = typeof type === "function";
        const result = newVNode.result = changed ? type ? isControl ? new (type as (new () => Control))() : document.createElement(type as string) : document.createTextNode(newVNode.props) : oldVNode!.result;

        if (type) {

            // 第二步：同步属性。
            let body: HTMLElement | null;
            let setters: string[] | undefined;
            let deletedCount: number | undefined;
            let forceSetSetters: any;
            if (isControl) {

                // 控件的属性分为：
                // - 自定义属性：直接赋值并标记 invalidated。
                // - @bind 绑定的属性：更新属性值并标记 invalidated。
                // - @bind(...) 绑定的属性：等待当前节点和子节点同步完成后设置。
                if (!changed) {
                    for (const prop in oldVNode!.props) {
                        if (!newVNode.props || !(prop in newVNode.props)) {
                            const propType = VNode.getPropType(type as any, prop);
                            if (propType === PropType.state) {
                                delete data(result)[prop];
                                (result as Control).state = forceSetSetters = ControlState.invalidated;
                            } else if (propType === PropType.setter) {
                                setters = setters || [];
                                deletedCount = deletedCount! + 1 || 1;
                                setters.push(prop);
                            } else {
                                delete (result as any)[prop];
                                (result as Control).state = forceSetSetters = ControlState.invalidated;
                            }
                        }
                    }
                }
                for (const prop in newVNode.props) {
                    const value = newVNode.props[prop];
                    const propType = VNode.getPropType(type as any, prop);
                    if (propType === PropType.state) {
                        if (changed || !oldVNode!.props || value !== oldVNode!.props[prop]) {
                            data(result)[prop] = value;
                            (result as Control).state = forceSetSetters = ControlState.invalidated;
                        }
                    } else if (propType === PropType.setter) {
                        setters = setters || [];
                        setters.push(prop);
                    } else {
                        if (changed || !oldVNode!.props || value !== oldVNode!.props[prop]) {
                            (result as any)[prop] = value;
                            (result as Control).state = forceSetSetters = ControlState.invalidated;
                        }
                    }
                }

                // 控件的子节点有两种更新策略：
                // 1. 如果控件提供了 body，则将控件作为普通容器节点处理，不再重新渲染控件。
                // 2. 否则将子节点传递给控件，控件自行处理。
                body = (result as Control).body;
                if (!body && (newVNode.children.length || !changed && oldVNode!.children.length)) {
                    data(result as Control).children = newVNode.children;
                    (result as Control).state = forceSetSetters = ControlState.invalidated;
                }

                // 如果之前修改了属性则重新渲染当前控件。
                if ((result as Control).state !== ControlState.rendered) {
                    (result as Control).update();
                }
            } else {

                // HTML 元素可以直接设置所有已更改的属性。
                for (const prop in newVNode.props) {
                    const value = newVNode.props[prop];
                    if (changed || !oldVNode!.props || value !== oldVNode!.props[prop] || VNode.forceSet(type, prop, result)) {
                        VNode.set(result as HTMLElement, prop, value);
                    }
                }
                if (!changed) {
                    for (const prop in oldVNode!.props) {
                        if (!newVNode.props || !(prop in newVNode.props)) {
                            VNode.set(result as HTMLElement, prop, null);
                        }
                    }
                }

                body = result as HTMLElement;
            }

            // 第三步：同步子节点。
            if (body) {
                let index = 0;
                for (const newChild of newVNode.children) {
                    const oldChild = (!changed && oldVNode!.children[index++]) as VNode | null;
                    if (VNode.sync(newChild, oldChild)) {
                        forceSetSetters = true;
                        index--;
                        const newChildResult = newChild.result;
                        const oldChildResult = oldChild ? oldChild.result : null;
                        if (newChildResult instanceof Control) {
                            newChildResult.renderTo(result, oldChildResult);
                        } else if (oldChildResult) {
                            body.insertBefore(newChildResult, oldChildResult instanceof Control ? oldChildResult.elem : oldChildResult);
                        } else {
                            body.appendChild(newChildResult);
                        }
                    }
                }
                if (!changed) {
                    for (; index < oldVNode!.children.length; index++) {
                        forceSetSetters = true;
                        const oldChildResult = oldVNode!.children[index].result;
                        if (oldChildResult instanceof Control) {
                            oldChildResult.renderTo(null);
                        } else {
                            body.removeChild(oldChildResult);
                        }
                    }
                }
            }

            // 第四步：当前控件和子控件全部同步完毕，重新布局。
            if (isControl) {
                if (setters) {
                    let i = 0;
                    if (deletedCount) {
                        for (; i < deletedCount; i++) {
                            (result as any)[setters[i]] = null;
                        }
                    }
                    forceSetSetters = forceSetSetters || changed;
                    for (; i < setters.length; i++) {
                        const setter = setters[i];
                        const value = newVNode.props[setter];
                        if (forceSetSetters || !oldVNode!.props || value !== oldVNode!.props[setter]) {
                            (result as any)[setter] = value;
                        }
                    }
                }
                (result as Control).layout();
            }

        } else if (!changed && oldVNode!.props !== newVNode.props) {
            // 第二步：同步属性。
            (result as Text).textContent = newVNode.props;
        }

        return changed;
    }

    /**
     * 判断控件类型是否包含指定的属性。
     * @param type 要判断的控件类型。
     * @param prop 要判断的属性名。
     * @return 如果属性无 get/set 操作则返回 true，否则返回 false。
     */
    static getPropType(type: typeof Control, prop: string): PropType {
        const propTypes = VNode.getOwnPropTypes(type);
        let value = propTypes[prop];
        if (value == undefined) {
            if (type.prototype.hasOwnProperty(prop)) {
                const descriptor = Object.getOwnPropertyDescriptor(type.prototype, prop);
                value = descriptor && (descriptor.get || descriptor.set) ? PropType.setter : PropType.value;
            } else {
                const proto = Object.getPrototypeOf(type.prototype);
                value = proto && proto !== Object.prototype ? VNode.getPropType(proto.constructor, prop) : PropType.value;
            }
            propTypes[prop] = value;
        }
        return value;
    }

    /**
     * 获取控件类型本身的属性列表。
     * @param type 控件类型。
     * @return 返回属性列表。
     */
    static getOwnPropTypes(type: typeof Control) {
        return type.hasOwnProperty("propTypes") ? type.propTypes : (type.propTypes = { __proto__: null! });
    }

    /**
     * 设置节点特殊属性的读写方式。
     */
    static props: { [prop: string]: { get(elem: HTMLElement, args?: any): any, set(elem: HTMLElement, value: any, args?: any): void } } = {
        __proto__: null!,
        class: {
            get(elem: HTMLElement, args?: string) {
                if (args) {
                    return dom.hasClass(elem, args);
                }
                return elem.className;
            },
            set(elem: HTMLElement, value: string | boolean, args?: string) {
                if (args) {
                    dom.toggleClass(elem, args, value as boolean);
                } else {
                    elem.className = value as string;
                }
            }
        },
        style: {
            get(elem: HTMLElement, args?: string) {
                if (args) {
                    return dom.getStyle(elem, args);
                }
                return elem.style;
            },
            set(elem: HTMLElement, value: { [key: string]: string | number } | string | number, args?: string) {
                if (args) {
                    dom.setStyle(elem, args, value as string | number);
                } else if (value == null || typeof value === "string") {
                    elem.style.cssText = value;
                } else {
                    for (const key in value as { [key: string]: string | number }) {
                        dom.setStyle(elem, key, (value as { [key: string]: string | number })[key]);
                    }
                }
            }
        },
        hidden: {
            get: dom.isHidden,
            set(elem: HTMLElement, value: boolean, args?: dom.ToggleAnimation) {
                dom.toggle(elem, !value, args);
            }
        },
        innerHTML: {
            get: dom.getHtml,
            set(elem: HTMLElement, value: NodeLike | NodeLike[]) {
                if (typeof value === "string") {
                    dom.setHtml(elem, value);
                } else {
                    elem.innerHTML = "";
                    if (Array.isArray(value)) {
                        for (const item of value) {
                            render(elem, item);
                        }
                    } else {
                        render(elem, value);
                    }
                }
            }
        }
    };

    /**
     * 判断是否需要强制更新指定的属性。
     * @param type 节点类型。
     * @param prop 节点属性。
     * @param target 要重置的控件或节点。
     * @return 如果需要强制更新则返回 true，否则返回 false。
     */
    static forceSet(type: VNode["type"], prop: string, target: VNode["result"]) {
        if (prop === "value") {
            return type === "input" || type === "textarea" || type === "select";
        }
        if (type === "input") {
            return prop === "checked";
        }
        return false;
    }

    /**
     * 获取节点的属性。
     * @param target 要获取的节点。
     * @param prop 要获取的属性名。
     * @param args 附加参数。部分属性需要附加参数。
     * @param scope 事件作用域。
     * @return 返回属性值。
     */
    static get(target: HTMLElement, prop: string, args?: any, scope?: any) {
        const hook = VNode.props[prop];
        if (hook) {
            return hook.get(target, args);
        }
        if (/^on[^a-z]/.test(prop)) {
            return data(scope || target)[args ? prop + " " + args : prop];
        }
        return dom.getAttr(target, prop);
    }

    /**
     * 设置节点的属性。
     * @param target 要设置的节点。
     * @param prop 要设置的属性名。
     * @param value 要设置的属性值。
     * @param args 附加参数。部分属性需要附加参数。
     * @param scope 事件作用域。
     */
    static set(target: HTMLElement, prop: string, value = null, args?: any, scope?: any) {
        const hook = VNode.props[prop];
        if (hook) {
            hook.set(target, value, args);
        } else if (/^on[^a-z]/.test(prop)) {
            const eventName = prop.slice(2).toLowerCase();
            const datas = data(scope || target);
            const key = args ? prop + " " + args : prop;
            if (datas[key]) {
                dom.off(target, eventName, args || "", datas[key], scope || (target as any as JSX.ElementExtension).__control__);
            }
            if ((datas[key] = value)) {
                dom.on(target, eventName, args || "", value!, scope || (target as any as JSX.ElementExtension).__control__);
            }
        } else {
            dom.setAttr(target, prop, value);
        }
    }

}

/**
 * 获取属性的类型。
 */
export const enum PropType {

    /**
     * 该属性是一个普通值。
     */
    value,

    /**
     * 该属性是一个状态值。更改该属性后需要更新控件。
     */
    state,

    /**
     * 该属性是一个自定义访问器。
     */
    setter

}

/**
 * 获取指定对象关联的数据对象。
 * @param obj 要获取的对象。
 * @return 返回一个数据对象。
 */
export function data(obj: any) {
    return obj.__data__ || (obj.__data__ = { __proto__: null });
}

/**
 * 绑定当前属性到指定控件或节点的属性或事件。
 * @param target 要绑定的控件。
 * @param propertyName 要绑定的控件属性。
 * @param selector 用于查找控件或节点的 CSS 选择器。空字符串表示根控件或节点。如果是 @ 开头表示当前控件内的属性。
 * @param prop 要绑定的属性或事件。
 * @param args 附加参数。
 * @param descriptor 已存在的属性描述器。
 */
export function bind(target: Control, propertyName: string, selector: string, prop: string, args?: any, descriptor?: PropertyDescriptor): void;

/**
 * 绑定当前属性。如果属性被重新赋值则在下一帧重新渲染整个控件。
 * @param target 要绑定的控件。
 * @param propertyName 要绑定的控件属性。
 * @param descriptor 要绑定的属性描述器。
 */
export function bind(target: Control, propertyName: string, descriptor?: PropertyDescriptor): void;

/**
 * 绑定当前属性到指定控件或节点的属性或事件。
 * @param selector 用于查找控件或节点的 CSS 选择器。空字符串表示根控件或节点。如果是 @ 开头表示当前控件内的属性。
 * @param prop 要绑定的属性或事件。
 * @param args 附加参数。
 */
export function bind(selector: string, prop: string, args?: any): PropertyDecorator;

/**
 * 绑定当前属性到指定的控件或节点。
 * @param selector 用于查找控件或节点的 CSS 选择器。空字符串表示根控件或节点。如果是 @ 开头表示当前控件内的属性。
 */
export function bind(selector: string): PropertyDecorator;

/**
 * 绑定当前属性。如果属性被重新赋值则在下一帧重新渲染整个控件。
 */
export function bind(): PropertyDecorator;

export function bind(target?: any, propertyName?: string, selector?: any, prop?: string, args?: any, descriptor?: PropertyDescriptor) {

    // 支持 @bind(...) 语法。
    if (!target || typeof target === "string") {
        return (target2: Control, propertyName2: string, descriptor2?: PropertyDescriptor) => {
            bind(target2, propertyName2, target, propertyName!, selector, descriptor2);
        };
    }

    // 将 @bind 的属性添加为绑定属性。
    if (selector == undefined) {
        VNode.getOwnPropTypes(target.constructor)[propertyName!] = PropType.state;
    }

    Object.defineProperty(target, propertyName!, selector == undefined ?
        descriptor ?
            {
                get(this: Control) {
                    const datas = data(this);
                    if (descriptor.get && !(propertyName! in datas)) {
                        return descriptor.get.call(this);
                    }
                    return datas[propertyName!];
                },
                set(this: Control, value: any) {
                    data(this)[propertyName!] = value;
                    if (descriptor.set) {
                        descriptor.set.call(this, value);
                    }
                    this.invalidate();
                }
            } : {
                get(this: Control) {
                    return data(this)[propertyName!];
                },
                set(this: Control, value: any) {
                    data(this)[propertyName!] = value;
                    this.invalidate();
                }
            }
        : selector.charCodeAt(0) === 64 /*@*/ && (selector = selector.slice(1)) ?
            prop == undefined ?
                {
                    get(this: any) {
                        return this[selector];
                    },
                    set(this: any, value: any) {
                        this[selector] = value;
                    }
                } : {
                    get(this: any) {
                        return getBindProp(this[selector], prop, args, this);
                    },
                    set(this: any, value: any) {
                        setBindProp(this[selector], prop, value, args, this);
                    }
                }
            : prop == undefined ?
                {
                    get(this: Control) {
                        return this.find(selector);
                    },
                    set(this: Control, value: any) {
                        Object.defineProperty(this, propertyName!, {
                            value: value
                        });
                    }
                } : {
                    get(this: Control) {
                        return getBindProp(this.find(selector), prop, args, this);
                    },
                    set(this: Control, value: any) {
                        setBindProp(this.find(selector), prop, value, args, this);
                    }
                });
}

function getBindProp(target: any, prop: string, args: any, scope: Control) {
    if (target != null) {
        if (target instanceof Node) {
            return VNode.get(target as HTMLElement, prop, args, scope);
        }
        let value = (target as any)[prop];
        if (value && /^on[^a-z]/.test(prop)) {
            value = value.__original__ || value;
        }
        return value;
    }
}

function setBindProp(target: any, prop: string, value: any, args: any, scope: Control) {
    if (target != null) {
        if (target instanceof Node) {
            VNode.set(target as HTMLElement, prop, value, args, scope);
        } else {
            if (value && /^on[^a-z]/.test(prop)) {
                const original = value;
                value = function () {
                    if (arguments[arguments.length - 1] === target) {
                        arguments[arguments.length - 1] = scope;
                    }
                    return original.apply(scope, arguments);
                };
                value.__original__ = original;
            }
            (target as any)[prop] = value;
        }
    }
}

/**
 * 表示类节点内容。
 */
export type NodeLike = Control | Node | VNode | string;

/**
 * 获取一个控件或节点。
 * @param value 一个虚拟节点、节点、控件、选择器或 HTML 片段。]
 * @param oldVNode 上一次生成的节点。
 * @return 返回一个控件或节点。如果找不到则返回 null。
 */
export function from(value: NodeLike | null, oldVNode?: VNode) {
    if (value instanceof VNode) {
        if (!value.result) {
            VNode.sync(value, oldVNode);
        }
        value = value.result;
    } else {
        if (typeof value === "string") {
            if (value.charCodeAt(0) === 60/*<*/) {
                value = dom.parse(value);
            } else {
                value = dom.find(value)!;
            }
        } else if (typeof value !== "object") {
            value = dom.parse(JSON.stringify(value));
        }
        value = value && (value as any as JSX.ElementExtension).__control__ || value;
    }
    return value as HTMLElement | Text | DocumentFragment | Control | null;
}

/**
 * @param parent 要渲染的容器节点。
 * 将指定的内容渲染到指定的容器。
 * @param content 要渲染的内容。可以是一个虚拟节点、节点、控件、选择器或 HTML 片段。
 * @param oldVNode 上一次生成的节点。
 * @return 返回生成的节点。
 */
export function render(parent: HTMLElement | Control, content: NodeLike | null, oldVNode?: VNode) {
    content = from(content, oldVNode);
    if (content instanceof Control) {
        content.renderTo(parent);
    } else if (content) {
        (parent instanceof Control ? parent.elem : parent).appendChild(content!);
    }
    return content;
}
