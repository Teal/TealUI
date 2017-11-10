/// <reference path="jsx.d.ts" />
import * as dom from "web/dom";
import nextTick from "web/nextTick";

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

/**
 * 表示一个控件。
 */
export default class Control {

    /**
     * 获取当前控件的渲染状态。
     */
    readyState: ControlState;

    /**
     * 存储关联的元素。
     */
    private _elem: HTMLElement;

    /**
     * 关联的元素。
     */
    get elem() {
        if (this.readyState !== ControlState.rendered) {
            this.update();
        }
        return this._elem;
    }
    set elem(value) {
        this.readyState = ControlState.rendered;
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
                (oldElem as any as JSX.ElementExtension).__control__ = null!;
            }
            if ((this._elem = value)) {
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
     * 获取当前控件关联的虚拟节点。
     */
    protected vNode: VNode | null;

    /**
     * 获取创建该控件使用的源虚拟节点。
     */
    sourceVNode: VNode;

    /**
     * 使用 JSX 语法定义控件时支持的属性。
     */
    private "__props__": Partial<this>;

    /**
     * 重新渲染当前控件。
     */
    update() {
        if (this.readyState !== ControlState.rendering) {
            this.readyState = ControlState.rendering;
            const oldVNode = this.vNode;
            const newVNode = this.vNode = (this.alwaysUpdate ? this.render(this.sourceVNode ? this.sourceVNode.children : [], this.sourceVNode ? this.sourceVNode.props : {}) : this.render()) || new VNode(null, "");
            VNode.sync(newVNode, oldVNode);
            const result = newVNode.result;
            this.elem = typeof newVNode.type === "function" ? (result as Control).elem : result as HTMLElement;
        }
    }

    /**
     * 当被子类重写时负责返回当前控件的虚拟节点。
     * @param children 渲染的子节点。
     * @param props 渲染的属性。
     * @return 返回表示当前控件内容的虚拟节点。如果当前控件不渲染任何内容则返回 null。
     */
    protected render(children?: VNode[], props?: { [key: string]: any; }): VNode | null;
    protected render() {
        return <div />;
    }

    /**
     * 控件是否使用主动更新模式。
     */
    get alwaysUpdate() {
        return this.render.length > 0;
    }
    set alwaysUpdate(value) {
        Object.defineProperty(this, "alwaysUpdate", { value, writable: true, configurable: true, enumerable: true });
    }

    /**
     * 获取用于包含子控件和节点的根元素。
     */
    get body() { return this.elem; }

    /**
     * 重新布局当前控件。
     * @param changes 当前已更新的内容。
     */
    layout(changes: Changes) { }

    /**
     * 使当前控件无效并在下一帧重新渲染。
     */
    invalidate() {
        if (this.readyState === ControlState.rendered) {
            this.readyState = ControlState.invalidated;
            nextTick(() => {
                if (this.readyState === ControlState.invalidated) {
                    this.update();
                }
            });
        }
    }

    /**
     * 将当前控件渲染到指定的父控件或节点。
     * @param parent 要渲染的目标控件或节点。如果为 null 则移除当前控件。
     * @param refChild 在指定的子控件或节点前添加，如果为空则添加到末尾。
     */
    renderTo(parent: Control | Node | null, refChild?: Control | Node | null) {
        if (parent) {
            if (this.elem) {
                while (parent instanceof Control) {
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
        this.layout(Changes.none);
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
     * 渐变的持续毫秒数。如果为 0 则不使用渐变。
     * @default 200
     */
    duration: number;

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
     * 是否隐藏。
     */
    @bind("", "hidden") hidden: boolean;

    /**
     * 控件样式。
     */
    @bind("", "style") style: { [key: string]: string | number } | string;

    /**
     * 控件序号。
     */
    @bind("", "id") id: string;

    /**
     * 控件内容。
     */
    @bind("@body", "innerHTML") content: NodeLike;

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

Control.prototype.readyState = ControlState.initial;
Control.prototype.duration = 200;

/**
 * 表示一个虚拟节点。
 */
export class VNode {

    /**
     * 初始化新的虚拟节点。
     * @param type 节点类型。如果是字符串表示 HTML 原生节点；如果是 null 表示文本节点；如果是函数表示控件。
     * @param props 节点属性。如果是文本节点则表示节点内容。
     * @param children 所有子节点。
     */
    constructor(public type: string | null | (new () => Control), public props: any | { [name: string]: any; } | null, public children?: VNode[]) { }

    /**
     * 添加一个或多个子节点。
     * @param child 要添加的子内容。
     */
    append(child: any) {
        if (child == null) {
            return;
        }
        if (Array.isArray(child)) {
            for (const item of child) {
                this.append(item);
            }
        } else {
            this.children!.push(child instanceof VNode ? child : new VNode(null, child));
        }
    }

    /**
     * 生成的真实节点或控件。
     */
    result: HTMLElement | Text | Control;

    /**
     * 创建一个虚拟节点。
     * @param type 节点类型。如果是字符串表示 HTML 原生节点；如果是 null 表示文本节点；如果是函数表示控件。
     * @param props 节点属性。如果是文本节点则表示节点内容。
     * @param children 所有子内容。
     * @return 返回创建的虚拟节点。
     */
    static create(type: VNode["type"], props: VNode["props"], ...children: any[]) {
        const r = new VNode(type, props, []);
        r.append(children);
        return r;
    }

    /**
     * 生成虚拟节点对应的真实节点或控件。
     * @param newVNode 新虚拟节点。
     * @param oldVNode 如果指定了原虚拟节点，则同步时尽量重用上次生成的真实节点。
     * @return 返回所有更新标记。
     */
    static sync(newVNode: VNode, oldVNode?: VNode | null): Changes {

        // 第一步：同步根节点：如果节点类型和 ID（如果存在）都不变，则重用上一次生成的节点，否则重新生成。
        const type = newVNode.type;
        const isControl = typeof type === "function";
        const recreated = !oldVNode || type !== oldVNode.type || type && newVNode.props && oldVNode.props && newVNode.props.id && oldVNode.props.id && newVNode.props.id !== oldVNode.props.id;
        const result = newVNode.result = recreated ? type ? isControl ? new (type as (new () => Control))() : document.createElement(type as string) : document.createTextNode(newVNode.props) : oldVNode!.result;
        let r = recreated ? Changes.type : Changes.none;

        if (type) {

            // 第二步：控件和元素：同步属性。
            let body: HTMLElement | undefined;
            let setters: string[] | undefined;
            let deletedCount: number | undefined;
            if (isControl) {

                // 控件的属性分为：
                // - 自定义属性：直接赋值并标记 invalidated。
                // - @bind 绑定的属性：更新属性值并标记 invalidated。
                // - @bind(...) 绑定的属性或自定义访问器：等待当前节点和子节点同步完成后设置。

                // 更新创建控件使用的虚拟节点。
                (result as Control).sourceVNode = newVNode;

                // 判断控件是否总是强制更新。
                const alwaysUpdate = (result as Control).alwaysUpdate;
                if (alwaysUpdate) {
                    r |= Changes.state;
                    (result as Control).readyState = ControlState.invalidated;
                }

                // 同步被删除的属性。
                if (!recreated) {
                    for (const prop in oldVNode!.props) {
                        if (!newVNode.props || !(prop in newVNode.props)) {
                            const propType = VNode.getPropType(type as any, prop);
                            if (propType === PropType.state) {
                                r |= Changes.state;
                                delete data(result)[prop];
                                (result as Control).readyState = ControlState.invalidated;
                            } else if (propType === PropType.setter) {
                                setters = setters || [];
                                deletedCount = deletedCount! + 1 || 1;
                                setters.push(prop);
                            } else if (propType !== PropType.getter) {
                                r |= Changes.prop;
                                delete (result as any)[prop];
                            }
                        }
                    }
                }

                // 同步新增和更新的属性。
                for (const prop in newVNode.props) {
                    const value = newVNode.props[prop];
                    const propType = VNode.getPropType(type as any, prop);
                    if (propType === PropType.state) {
                        if (recreated || !oldVNode!.props || value !== oldVNode!.props[prop]) {
                            r |= Changes.state;
                            data(result)[prop] = value;
                            (result as Control).readyState = ControlState.invalidated;
                        }
                    } else if (propType === PropType.setter) {
                        setters = setters || [];
                        setters.push(prop);
                    } else if (propType !== PropType.getter && (recreated || !oldVNode!.props || value !== oldVNode!.props[prop])) {
                        r |= Changes.prop;
                        (result as any)[prop] = value;
                    }
                }

                // 如果控件使用永久更新模式，则控件内部处理子控件，不再递归更新。
                if (!alwaysUpdate) {
                    body = (result as Control).body;
                }
            } else {
                // HTML 元素可以直接设置所有已更改的属性。

                // 同步新增和更新的属性。
                for (const prop in newVNode.props) {
                    const value = newVNode.props[prop];
                    if (recreated || VNode.alwaysSet(type, prop, result) || !oldVNode!.props || value !== oldVNode!.props[prop]) {
                        r |= Changes.prop;
                        VNode.set(result as HTMLElement, prop, value);
                    }
                }
                // 同步被删除的属性。
                if (!recreated) {
                    for (const prop in oldVNode!.props) {
                        if (!newVNode.props || !(prop in newVNode.props)) {
                            r |= Changes.prop;
                            VNode.set(result as HTMLElement, prop, null);
                        }
                    }
                }

                // 递归更新子节点。
                body = result as HTMLElement;
            }

            // 第三步：同步子节点。
            if (body) {

                // 同步新增或更新的子节点。
                let index = 0;
                for (const newChild of newVNode.children!) {
                    const oldChild = (!recreated && oldVNode!.children![index++]) as VNode | null;
                    const childChanges = VNode.sync(newChild, oldChild);
                    if (childChanges) {
                        r |= Changes.children;
                        if (childChanges & Changes.type) {
                            index--;
                            const newChildResult = newChild.result;
                            const oldChildResult = oldChild ? oldChild.result : null;
                            if (newChildResult instanceof Control) {
                                newChildResult.renderTo(result, oldChildResult);
                            } else {
                                try {
                                    if (oldChildResult) {
                                        body.insertBefore(newChildResult, oldChildResult instanceof Control ? oldChildResult.elem : oldChildResult);
                                    } else {
                                        body.appendChild(newChildResult);
                                    }
                                } catch (e) { }
                            }
                        }
                    }
                }

                // 同步删除的子节点。
                if (!recreated) {
                    for (; index < oldVNode!.children!.length; index++) {
                        r |= Changes.children;
                        const oldChildResult = oldVNode!.children![index].result;
                        if (oldChildResult instanceof Control) {
                            oldChildResult.renderTo(null);
                        } else {
                            try {
                                body.removeChild(oldChildResult);
                            } catch (e) { }
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
                    let i = 0;
                    if (deletedCount) {
                        for (; i < deletedCount; i++) {
                            r |= Changes.prop;
                            (result as any)[setters[i]] = null;
                        }
                    }
                    for (; i < setters.length; i++) {
                        const setter = setters[i];
                        const value = newVNode.props[setter];
                        if (r & (Changes.type | Changes.state)
                            || ((r & Changes.children) && VNode.getPropType(type as any, setter) === PropType.setter)
                            || VNode.alwaysSet(type, setter, result)
                            || !oldVNode!.props
                            || value !== oldVNode!.props[setter]) {
                            r |= Changes.prop;
                            (result as any)[setter] = value;
                        }
                    }
                }

                // 所有渲染所需属性都已传递给控件，确保控件已渲染。
                if ((result as Control).readyState !== ControlState.rendered) {
                    (result as Control).update();
                }

                // 通知控件重新布局。
                (result as Control).layout(r);
            }

        } else if (!recreated && oldVNode!.props != newVNode.props) {
            // 第二步：文本节点：同步文本内容。
            r |= Changes.prop;
            (result as Text).textContent = newVNode.props;
        }

        return r;
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
                value = descriptor ? descriptor.set ? PropType.setter : descriptor.get ? PropType.getter : PropType.value : PropType.value;
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
                    elem.style.cssText = value as string;
                } else {
                    for (const key in value as { [key: string]: string | number }) {
                        dom.setStyle(elem, key, (value as { [key: string]: string | number })[key]);
                    }
                }
            }
        },
        hidden: {
            get(elem: HTMLElement) {
                return dom.getAttr(elem, "hidden") || dom.isHidden(elem);
            },
            set(elem: HTMLElement, value: boolean) {
                dom.setAttr(elem, "hidden", value);
            }
        },
        innerHTML: {
            get: dom.getHtml,
            set(elem: HTMLElement, value: NodeLike | NodeLike[]) {
                if (typeof value === "object") {
                    elem.innerHTML = "";
                    if (Array.isArray(value)) {
                        for (const item of value) {
                            render(elem, item);
                        }
                    } else {
                        render(elem, value);
                    }
                } else {
                    dom.setHtml(elem, value);
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
    static alwaysSet(type: VNode["type"], prop: string, target: VNode["result"]) {
        return false;
        // switch (prop) {
        //     case "value":
        //     case "checked":
        //     case "selected":
        //         return true;
        //     default:
        //         return false;
        // }
    }

    /**
     * 获取节点的属性。
     * @param target 要获取的节点。
     * @param prop 要获取的属性名。
     * @param args 附加参数。部分属性需要附加参数。
     * @param root 事件作用域。
     * @return 返回属性值。
     */
    static get(target: HTMLElement, prop: string, args?: any, root?: any) {
        const hook = VNode.props[prop];
        if (hook) {
            return hook.get(target, args);
        }
        if (/^on[^a-z]/.test(prop)) {
            return data(root || target)[args ? prop + " " + args : prop];
        }
        return dom.getAttr(target, prop);
    }

    /**
     * 设置节点的属性。
     * @param target 要设置的节点。
     * @param prop 要设置的属性名。
     * @param value 要设置的属性值。
     * @param args 附加参数。部分属性需要附加参数。
     * @param root 事件作用域。
     */
    static set(target: HTMLElement, prop: string, value = null, args?: any, root?: any) {
        const hook = VNode.props[prop];
        if (hook) {
            hook.set(target, value, args);
        } else if (/^on[^a-z]/.test(prop)) {
            const eventName = prop.slice(2).toLowerCase();
            const datas = data(root || target);
            const key = args ? prop + " " + args : prop;
            if (datas[key]) {
                dom.off(target, eventName, args || "", datas[key], root || (target as any as JSX.ElementExtension).__control__);
            }
            if ((datas[key] = value)) {
                dom.on(target, eventName, args || "", value!, root || (target as any as JSX.ElementExtension).__control__);
            }
        } else {
            dom.setAttr(target, prop, value);
        }
    }

}

/**
 * 表示更新的类型。
 */
export const enum Changes {

    /**
     * 没有任何改变。
     */
    none,

    /**
     * 类型发生改变。根节点已重新创建。
     */
    type = 1 << 0,

    /**
     * 状态发生改变。控件已重新渲染。
     */
    state = 1 << 1,

    /**
     * 属性发生改变。
     */
    prop = 1 << 2,

    /**
     * 子控件或元素发生改变。
     */
    children = 1 << 3,

}

/**
 * 表示控件属性的类型。
 */
export const enum PropType {

    /**
     * 该属性是一个普通的值。
     */
    value,

    /**
     * 该属性是一个状态值。设置该属性后需要更新控件。
     */
    state,

    /**
     * 该属性是一个只读访问器。
     */
    getter,

    /**
     * 该属性是一个可写访问器。
     */
    setter,

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
 * 绑定属性到指定子控件或节点的属性。
 * @param target 要绑定的控件。
 * @param propertyName 要绑定的控件属性。
 * @param selector 用于查找子控件或节点的 CSS 选择器。空字符串表示根控件或节点。如果是 @ 开头表示当前控件的属性。
 * @param prop 要绑定的目标属性。
 * @param args 附加参数。
 * @param descriptor 已定义的属性描述器。
 */
export function bind(target: Control, propertyName: string, selector: string, prop: string, args?: any, descriptor?: PropertyDescriptor): void;

/**
 * 绑定属性。如果属性被重新赋值则在下一帧重新渲染整个控件。
 * @param target 要绑定的控件。
 * @param propertyName 要绑定的控件属性。
 * @param descriptor 已定义的属性描述器。
 */
export function bind(target: Control, propertyName: string, descriptor?: PropertyDescriptor): void;

/**
 * 绑定属性到指定子控件或节点的属性。
 * @param selector 用于查找子控件或节点的 CSS 选择器。空字符串表示根控件或节点。如果是 @ 开头表示当前控件的属性。
 * @param prop 要绑定的目标属性。
 * @param args 附加参数。
 */
export function bind(selector: string, prop: string, args?: any): PropertyDecorator;

/**
 * 绑定属性到指定的子控件或节点本身。
 * @param selector 用于查找子控件或节点的 CSS 选择器。空字符串表示根控件或节点。如果是 @ 开头表示当前控件的属性。
 */
export function bind(selector: string): PropertyDecorator;

/**
 * 绑定属性。如果属性被重新赋值则在下一帧重新渲染整个控件。
 */
export function bind(): PropertyDecorator;

export function bind(target?: any, propertyName?: string, selector?: any, prop?: string, args?: any, descriptor?: PropertyDescriptor) {

    // @bind(...)
    if (!target || typeof target !== "object") {
        return (target2: Control, propertyName2: string, descriptor2?: PropertyDescriptor) => {
            return bind(target2, propertyName2, target, propertyName!, selector, descriptor2);
        };
    }

    // 支持 bind(target, propertyName, descriptor)
    if (selector && typeof selector === "object") {
        descriptor = selector;
        selector = undefined;
    }

    // 标记属性类型。
    if (selector == undefined) {
        VNode.getOwnPropTypes(target.constructor)[propertyName!] = PropType.state;
    }

    const desc: PropertyDescriptor = selector == undefined ?
        {
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
                        return getProp(this[selector], prop, args, this);
                    },
                    set(this: any, value: any) {
                        setProp(this[selector], prop, value, args, this);
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
                        return getProp(this.find(selector), prop, args, this);
                    },
                    set(this: Control, value: any) {
                        setProp(this.find(selector), prop, value, args, this);
                    }
                };

    desc.configurable = desc.enumerable = true;
    // 使用 Babel/TypeScript 时会传递 descriptor，此时返回属性描述器以便定义。
    if (descriptor !== undefined) {
        return desc;
    }
    Object.defineProperty(target, propertyName!, desc);
}

function getProp(target: any, prop: string, args: any, root: Control) {
    if (target == null) {
        return;
    }
    if (target instanceof Node) {
        return VNode.get(target as HTMLElement, prop, args, root);
    }
    let value = target[prop];
    if (value && /^on[^a-z]/.test(prop)) {
        value = value.__original__ || value;
    }
    return value;
}

function setProp(target: any, prop: string, value: any, args: any, root: Control) {
    if (target != null) {
        if (target instanceof Node) {
            VNode.set(target as HTMLElement, prop, value, args, root);
        } else {
            if (value && /^on[^a-z]/.test(prop)) {
                const original = value;
                value = function () {
                    if (arguments[arguments.length - 1] === target) {
                        arguments[arguments.length - 1] = root;
                    }
                    return original.apply(root, arguments);
                };
                value.__original__ = original;
            }
            target[prop] = value;
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
 * @return 返回一个控件或节点。如果找不到则返回 null。
 */
export function from(value: NodeLike | null) {
    if (value instanceof VNode) {
        if (!value.result) {
            VNode.sync(value);
        }
        value = value.result;
    } else {
        if (typeof value !== "object") {
            value = dom.parse(value);
        }
        value = value && (value as any as JSX.ElementExtension).__control__ || value;
    }
    return value as HTMLElement | Text | DocumentFragment | Control | null;
}

/**
 * 将指定的内容渲染到指定的容器。
 * @param parent 要渲染的容器节点。
 * @param content 要渲染的内容。可以是一个虚拟节点、节点、控件、选择器或 HTML 片段。
 * @return 返回生成的节点。
 */
export function render(parent: HTMLElement | Control, content: NodeLike | null) {
    content = from(content);
    if (content instanceof Control) {
        content.renderTo(parent);
    } else if (content) {
        (parent instanceof Control ? parent.elem : parent).appendChild(content);
    }
    return content;
}
