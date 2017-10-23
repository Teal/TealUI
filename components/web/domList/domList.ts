import * as dom from "web/dom";

/**
 * 查找 CSS 选择器匹配的所有元素。
 * @param selector 要执行的选择器。
 * @param context 要查询的根节点。
 * @return 返回新列表。
 */
export default function $(selector: string, context?: Document | Node): DomList;

/**
 * 解析指定的 HTML 片段。
 * @param html 要解析的 HTML 片段。
 * @param context 用于创建新节点的文档。
 * @return 返回新列表。
 */
export default function $(html: string, context?: Document): DomList;

/**
 * 创建一个空列表。
 * @return 返回新列表。
 */
export default function $(): DomList;

/**
 * 创建仅包含指定节点的列表。
 * @param node 节点或窗口对象。
 * @return 返回新列表。
 */
export default function $(node: Node | Window | null | undefined): DomList;

/**
 * 创建和已有列表包含相同元素的新列表。
 * @param nodeList 节点数组或节点列表。
 * @return 返回新列表。
 */
export default function $(nodeList: ArrayLike<Node | Window>): DomList;

/**
 * 设置文档加载完成后的回调。
 * @param ready 要设置的回调函数。
 * @param context 文档。
 * @return 返回一个空列表。
 */
export default function $(ready: () => void, context?: Document): DomList;

export default function $(selector?: any, context?: Node | Document) {
    return new (DomList as any)(selector, context) as DomList;
}

/**
 * 表示一个元素列表。
 */
export function DomList(this: DomList, selector?: any, context?: any) {
    if (typeof selector === "string") {
        if (selector.charCodeAt(0) === 60/* < */) {
            const parsed = dom.parse(selector, context);
            if (parsed.nodeType === 11 /* DocumentFragment */) {
                for (let child = parsed.firstChild; child; child = child.nextSibling) {
                    this.push(child as HTMLElement);
                }
            } else {
                this.push(parsed as HTMLElement);
            }
        } else {
            const list = (context || document).querySelectorAll(selector);
            for (let i = 0, length = list.length; i < length; i++) {
                this.push(list[i] as HTMLElement);
            }
        }
    } else if (typeof selector === "function") {
        dom.ready(selector, context);
    } else if (selector != null) {
        if (typeof selector.nodeType === "number" || selector === selector.window) {
            this.push(selector);
        } else if (typeof selector.length === "number") {
            for (let i = 0; i < selector.length; i++) {
                if (selector[i] != null) {
                    this.push(selector[i]);
                }
            }
        }
    }
}

export interface DomList {

    /**
     * 元素个数。
     */
    length: number;

    /**
     * 获取或设置指定索引的元素。
     */
    [index: number]: HTMLElement;

    /**
     * 向列表末尾添加新元素。
     * @param elems 要添加的元素。
     * @return 返回新长度。
     */
    push(...elems: HTMLElement[]): number;

    /**
     * 移除并返回列表末尾的元素。
     * @return 返回元素。
     */
    pop(): HTMLElement | undefined;

    /**
     * 向列表开头添加新元素。
     * @param elems 要添加的元素。
     * @return 返回新长度。
     */
    unshift(...elems: HTMLElement[]): number;

    /**
     * 移除并返回列表开头的元素。
     * @return 返回元素。
     */
    shift(): HTMLElement | undefined;

    /**
     * 获取列表的指定位置的子列表。
     * @param start 要获取的开始索引（含）。
     * @param end 要获取的结束索引（不含）。
     * @return 返回新列表。
     */
    slice(start?: number, end?: number): DomList;

    /**
     * 移除或插入列表的指定元素。
     * @param index 要移除或插入的索引。
     * @param removeCount 要移除的数目。如果为 0 则不移除。
     * @param insertItems 所有要插入的元素。
     * @return 返回被删除的元素所组成的数组。
     */
    splice(start: number, deleteCount: number, ...insertItems: HTMLElement[]): HTMLElement[];

    /**
     * 排序当前列表的元素。
     * @param compareFn 用于排序时确定顺序的函数。函数接收以下参数：
     * - x：要比较的第一个参数。
     * - y：要比较的第二个参数。
     *
     * 如果返回 0 或负数，则说明 *x* 应该排在 *y* 之前。否则 *x* 应该排在 *y* 之后。
     */
    sort(compareFn: (x: HTMLElement, y: HTMLElement) => number): this;

    /**
     * 颠倒所有元素的顺序。
     */
    reverse(): this;

    /**
     * 查找指定项在数组内的第一个索引。
     * @param value 要查找的项。
     * @param startIndex 查找开始的位置。
     * @return 返回索引。如果找不到则返回 -1。
     */
    indexOf(value: HTMLElement, startIndex?: number): number;

    /**
     * 查找指定项在数组内的最后一个索引。
     * @param value 要查找的项。
     * @param startIndex 查找开始的位置。
     * @return 返回索引。如果找不到则返回 -1。
     */
    lastIndexOf(value: HTMLElement, startIndex?: number): number;

    /**
     * 对列表的每一项执行一次回调函数。
     * @param callback 回调函数。函数接收以下参数：
     * - value：当前项的值。
     * - index：当前项的索引。
     * - target：数组本身。
     * @param thisArg 执行回调函数时 this 的值。
     */
    each(callback: (elem: HTMLElement, index: number, target: this) => void, thisArg?: any): this;

    /**
     * 对列表的每一项执行一次回调函数，然后将每个结果组成新数组。
     * @param callback 回调函数。函数接收以下参数：
     * - value：当前项的值。
     * - index：当前项的索引。
     * - target：数组本身。
     *
     * 函数应返回新的结果。
     * @param thisArg 执行回调函数时 this 的值。
     */
    map(callback: (elem: HTMLElement, index: number, target: this) => any, thisArg?: any): DomList;

    /**
     * 筛选数组中符合条件的项并组成一个新数组。
     * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
     * - value：当前项的值。
     * - index：当前项的索引。
     * - target：数组本身。
     *
     * 如果当前项符合条件应返回 true，否则返回 false。
     * @param thisArg 执行回调函数时 this 的值。
     * @return 返回一个新列表。
     */
    filter(callback: (elem: HTMLElement, index: number, target: this) => void, thisArg?: any): DomList;

    /**
     * 筛选数组中匹配指定 CSS 选择器的项并组成一个新数组。
     * @param selector CSS 选择器。
     * @return 返回一个新列表。
     */
    filter(selector: string): DomList;

    /**
     * 判断数组的每一项是否都符合条件。
     * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
     * - value：当前项的值。
     * - index：当前项的索引。
     * - target：数组本身。
     *
     * 如果当前项符合条件应返回 true，否则返回 false。
     * @param thisArg 执行回调函数时 this 的值。
     * @return 如果所有项满足条件则返回 true，否则返回 false。
     */
    every(callback: (elem: HTMLElement, index: number, target: this) => void, thisArg?: any): boolean;

    /**
     * 判断数组中是否存在一项或多项符合条件。
     * @param callback 用于确定每一项是否符合条件的回调函数。函数接收以下参数：
     * - value：当前项的值。
     * - index：当前项的索引。
     * - target：数组本身。
     *
     * 如果当前项符合条件应返回 true，否则返回 false。
     * @param thisArg 执行回调函数时 this 的值。
     * @return 如果至少存在一项满足条件则返回 true，否则返回 false。
     */
    some(callback: (elem: HTMLElement, index: number, target: this) => void, thisArg?: any): boolean;

    /**
     * 向列表末尾添加新元素。
     * @param items 要添加的所有元素或选择器。
     */
    add(...items: (string | Node | Window | ArrayLike<Node | Window>)[]): this;

    /**
     * 在当前节点内查询 CSS 选择器匹配的所有节点。
     * @param selector 用于筛选元素的 CSS 选择器。
     */
    find(selector: string): DomList;

    /**
     * 判断是否有一个或多个元素匹配指定的 CSS 选择器。
     * @param selector 要判断的 CSS 选择器。
     * @return 返回包含所有元素的新列表。
     */
    match(selector: string): boolean;

    /**
     * 获取每个节点的下一个相邻元素。
     * @param selector 用于筛选元素的 CSS 选择器。
     * @return 返回包含所有元素的新列表。
     */
    next(selector?: string): NodeList;

    /**
     * 获取每个节点的上一个相邻元素。
     * @param selector 用于筛选元素的 CSS 选择器。
     * @return 返回包含所有元素的新列表。
     */
    prev(selector?: string): NodeList;

    /**
     * 获取每个节点的父元素。
     * @param selector 用于筛选元素的 CSS 选择器。
     * @return 返回包含所有元素的新列表。
     */
    parent(selector?: string): NodeList;

    /**
     * 从每个节点开始向父元素查找第一个匹配指定 CSS 选择器的元素。
     * @param selector 用于筛选元素的 CSS 选择器。
     * @return 返回包含所有元素的新列表。
     */
    closest(selector?: string): NodeList;

    /**
     * 获取每个节点的所有子元素。
     * @param selector 用于筛选元素的 CSS 选择器。
     * @return 返回包含所有元素的新列表。
     */
    children(selector?: string): NodeList;

    /**
     * 在每个节点末尾插入一段 HTML 或一个节点。
     * @param content 要插入的 HTML 或节点。
     */
    append(content: string | Node | ArrayLike<HTMLElement> | null): this;

    /**
     * 在每个节点开头插入一段 HTML 或一个节点。
     * @param content 要插入的 HTML 或节点。
     */
    prepend(content: string | Node | ArrayLike<HTMLElement> | null): this;

    /**
     * 在每个节点前插入一段 HTML 或一个节点。
     * @param content 要插入的 HTML 或节点。
     */
    before(content: string | Node | ArrayLike<HTMLElement> | null): this;

    /**
     * 在每个节点后插入一段 HTML 或一个节点。
     * @param content 要插入的 HTML 或节点。
     */
    after(content: string | Node | ArrayLike<HTMLElement> | null): this;

    /**
     * 将当前节点添加到目标节点的末尾。
     * @param parent 要插入的目标节点。
     */
    appendTo(parent: string | Node | ArrayLike<HTMLElement> | null): this;

    /**
     * 从文档中移除列表中所有节点。
     */
    remove(): this;

    /**
     * 复制节点列表。
     * @return 返回复制的新列表。
     */
    clone(): NodeList;

    /**
     * 获取列表中第一个元素的属性值。
     * @param attrName 要获取的属性名（使用骆驼规则，如 `readOnly`）。
     * @return 返回属性值。如果属性不存在则返回 null。
     */
    attr(attributeName: string): string;

    /**
     * 设置列表中每个元素的属性值。
     * @param attrName 要获取的属性名（使用骆驼规则，如 `readOnly`）。
     * @param value 要设置的属性值。设置为 null 表示删除属性。
     */
    attr(attributeName: string, value: string | number): this;

    /**
     * 设置列表中每个元素的属性值。
     * @param attributes 要获取的属性键值对。
     */
    attr(attributes: Object): this;

    /**
     * 获取列表中第一个元素的值。
     * @return 返回属性值。如果属性不存在则返回 null。
     */
    val(): string;

    /**
     * 设置列表中每个元素的值。
     * @param value 要设置的值。
     */
    val(value: any): this;

    /**
     * 获取列表中第一个元素的文本内容。
     * @return 返回属性值。如果属性不存在则返回 null。
     */
    text(): string;

    /**
     * 设置列表中每个元素的文本内容。
     * @param value 要设置的值。
     */
    text(value: any): this;

    /**
     * 获取列表中第一个元素的 HTML 内容。
     * @return 返回属性值。如果属性不存在则返回 null。
     */
    html(): string;

    /**
     * 设置列表中每个元素的文本内容。
     * @param value 要设置的值。
     */
    html(value: any): this;

    /**
     * 判断是否存在一个元素已添加指定的 CSS 类名。
     * @param className 要判断的 CSS 类名。如果有多个用空格隔开。
     * @return 如果已添加则返回 true，否则返回 false。
     */
    hasClass(className: string): boolean;

    /**
     * 添加所有元素的 CSS 类名。
     * @param className 要添加的 CSS 类名。如果有多个用空格隔开。
     */
    addClass(className: string): this;

    /**
     * 删除所有元素的 CSS 类名。
     * @param className 要删除的 CSS 类名。如果有多个用空格隔开。如果为空则删除所有类名。
     */
    removeClass(className?: string): this;

    /**
     * 如果存在（不存在）则删除（添加）所有元素的 CSS 类名。
     * @param className 要添加或删除的 CSS 类名。如果有多个用空格隔开。
     */
    toggleClass(className: string): this;

    /**
     * 获取列表中第一个元素的 CSS 属性值。
     * @param propName 要获取的 CSS 属性名（使用骆驼规则，如 `fontSize`）。
     * @return 返回计算后的 CSS 属性值。
     */
    css(propName: string): this;

    /**
     * 设置列表中每个元素的 CSS 属性值。
     * @param propName 要设置的 CSS 属性名（使用骆驼规则，如 `fontSize`）。
     * @param value 要设置的 CSS 属性值。如果是数字则自动追加像素单位。
     */
    css(propName: string, value: string | number): this;

    /**
     * 设置列表中每个元素的 CSS 属性值。
     * @param cssProps 要设置的 CSS 属性键值对。
     */
    css(cssProps: Object): this;

    /**
     * 获取列表中第一个元素的滚动距离。
     * @return 返回坐标。如果元素不可滚动则返回原点。
     */
    scroll(): this;

    /**
     * 设置列表中每个元素的滚动距离。
     * @param propName 要设置的 CSS 属性名（使用骆驼规则，如 `fontSize`）。
     * @param value 要设置的坐标。允许只设置部分属性。
     */
    scroll(value: dom.Point): this;

    /**
     * 获取列表中第一个元素的区域。
     * @return 返回元素实际占用区域（含内边距和边框、不含外边距）。如果元素不可见则返回空区域。
     */
    rect(): this;

    /**
     * 设置列表中每个元素的区域。
     * @param propName 要设置的 CSS 属性名（使用骆驼规则，如 `fontSize`）。
     * @param value 要设置的区域内容（含内边距和边框、不含外边距）。允许只设置部分属性。
     */
    rect(value: dom.Rect): this;

    /**
     * 绑定每个元素的事件。
     * @param eventName 要绑定的事件名。
     * @param selector 要委托的目标元素的 CSS 选择器。
     * @param handler 要绑定的事件处理函数。
     * @param thisArg 设置监听器执行时 this 的值。
     * @example on(document.body, "mouseenter", "a", function(e){ this.firstChild.innerHTML = e.pageX; })
     */
    on(eventName: string, selector: string, handler: (e: Event, target: HTMLElement) => void, thisArg?: any): this;

    /**
     * 解绑每个元素的事件。
     * @param eventName 要解绑的事件名。
     * @param selector 要委托的目标元素的 CSS 选择器。
     * @param handler 要解绑的事件处理函数。如果未提供则解绑所有监听器。
     * @param thisArg 设置监听器执行时 this 的值。
     * @example off(document.body, "mouseenter", "a", function(e) { this.firstChild.innerHTML = e.pageX; })
     */
    off(eventName: string, selector: string, handler: (e: Event, target: HTMLElement) => void, thisArg?: any): this;

    /**
     * 触发每个元素的指定事件，即执行对应已添加的所有事件处理函数。
     * @param eventName 要触发的事件名。
     * @param selector 要委托的目标元素的 CSS 选择器。
     * @param event 传递给监听器的事件参数。
     * @example trigger(document.body, "click")
     */
    trigger(eventName: string, selector: string, event?: Partial<Event>): this;

    /**
     * 触发每个元素的指定事件，即执行对应已添加的所有事件处理函数。
     * @param eventName 要触发的事件名。
     * @param event 传递给监听器的事件参数。
     * @example trigger(document.body, "click")
     */
    trigger(eventName: string, selector: string, event?: Partial<Event>): this;

    /**
     * 执行一个自定义渐变。
     * @param propNames 要渐变的 CSS 属性名和最终的属性值组成的键值对。
     * @param callback 渐变执行结束的回调函数。
     * @param duration 渐变执行的总毫秒数。
     * @param timingFunction 渐变函数。可以使用 CSS3 预设的特效渐变函数。
     * @example animate(document.body, { height: 400 });
     */
    animate(propNames: { [propName: string]: string | number }, callback?: () => void, duration?: number, timingFunction?: string): this;

    /**
     * 显示元素。
     * @param animation 显示时使用的动画。
     * @param callback 动画执行完成后的回调。
     * @param duration 动画执行的总毫秒数。
     * @param timingFunction 渐变函数。可以使用 CSS3 预设的特效渐变函数。
     * @param target 动画的目标元素。
     */
    show(animation?: dom.ToggleAnimation, callback?: (value: boolean) => void, duration?: number, timingFunction?: string, target?: HTMLElement): this;

    /**
     * 隐藏元素。
     * @param animation 显示时使用的动画。
     * @param callback 动画执行完成后的回调。
     * @param duration 动画执行的总毫秒数。
     * @param timingFunction 渐变函数。可以使用 CSS3 预设的特效渐变函数。
     * @param target 动画的目标元素。
     */
    hide(animation?: dom.ToggleAnimation, callback?: (value: boolean) => void, duration?: number, timingFunction?: string, target?: HTMLElement): this;

    /**
     * 切换显示或隐藏元素。
     * @param animation 显示时使用的动画。
     * @param callback 动画执行完成后的回调。
     * @param duration 动画执行的总毫秒数。
     * @param timingFunction 渐变函数。可以使用 CSS3 预设的特效渐变函数。
     * @param target 动画的目标元素。
     */
    toggle(animation?: dom.ToggleAnimation, callback?: (value: boolean) => void, duration?: number, timingFunction?: string, target?: HTMLElement): this;

    /**
     * 切换显示或隐藏元素。
     * @param value 如果为 true 则强制显示元素；如果为 false 则强制隐藏元素。
     * @param animation 显示或隐藏时使用的动画。
     * @param callback 动画执行完成后的回调。
     * @param duration 动画执行的总毫秒数。
     * @param timingFunction 渐变函数。可以使用 CSS3 预设的特效渐变函数。
     * @param target 动画的目标元素。
     */
    toggle(value: boolean, animation?: dom.ToggleAnimation, callback?: (value: boolean) => void, duration?: number, timingFunction?: string, target?: HTMLElement): this;

    /**
     * 触发每个元素的点击事件。
     */
    click(): this;

    /**
     * 绑定每个元素的点击事件。
     * @param handler 事件处理函数。
     */
    click(handler: (e: MouseEvent, sender: HTMLElement) => void): this;

    /**
     * 触发每个元素的获取焦点事件。
     */
    focus(): this;

    /**
     * 绑定每个元素的获取焦点事件。
     * @param handler 事件处理函数。
     */
    focus(handler: (e: UIEvent, sender: HTMLElement) => void): this;

    /**
     * 触发每个元素的失去焦点事件。
     */
    blur(): this;

    /**
     * 绑定每个元素的失去焦点事件。
     * @param handler 事件处理函数。
     */
    blur(handler: (e: UIEvent, sender: HTMLElement) => void): this;

    /**
     * 触发每个元素的表单提交事件。
     */
    submit(): this;

    /**
     * 绑定每个元素的表单提交事件。
     * @param handler 事件处理函数。
     */
    submit(handler: (e: UIEvent, sender: HTMLElement) => void): this;

    /**
     * 触发每个元素的选择事件。
     */
    select(): this;

    /**
     * 绑定每个元素的选择事件。
     * @param handler 事件处理函数。
     */
    select(handler: (e: UIEvent, sender: HTMLElement) => void): this;

}

$.prototype = DomList.prototype = {

    constructor: $,

    each(this: DomList, callback: (elem: HTMLElement, index: number, target: DomList) => void, thisArg?: any) {
        for (let i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
        return this;
    },

    add(this: DomList) {
        for (let argument of arguments) {
            argument = $(argument);
            for (let i = 0; i < argument.length; i++) {
                const item = argument[i];
                if (this.indexOf(item) < 0) {
                    this.push(item);
                }
            }
        }
        return this;
    },

    find(this: DomList, selector: string) {
        const r = $();
        this.each(elem => {
            r.add(elem.querySelectorAll(selector));
        });
        return r;
    },

    filter(this: DomList, selector: any, thisArg?: any) {
        if (typeof selector !== "function") {
            const original = selector;
            selector = (elem: any) => dom.match(elem, selector);
        }
        return Array.prototype.filter.call(this, selector, thisArg);
    },

    match(this: DomList, selector: string) {
        return this.some(elem => dom.match(elem, selector));
    },

    appendTo(this: DomList, parent: any) {
        $(parent).append(this);
        return this;
    },

    hasClass(this: DomList, className: string) {
        return this.some(elem => className.split(" ").some(clazz => dom.hasClass(elem, clazz)));
    },

    addClass(this: DomList, className: string) {
        return this.each(elem => {
            className.split(" ").forEach(clazz => dom.addClass(elem, clazz));
        });
    },

    removeClass(this: DomList, className?: string) {
        return this.each(elem => {
            if (className) {
                className.split(" ").forEach(clazz => dom.removeClass(elem, clazz));
            } else {
                elem.className = "";
            }
        });
    },

    toggleClass(this: DomList, className: string, value?: boolean) {
        return this.each(elem => {
            className.split(" ").forEach(clazz => dom.toggleClass(elem, clazz, value));
        });
    }

};

function defineMethods(fnNames: string, factory: (fnName: string) => (this: DomList, ...args: any[]) => any) {
    fnNames.replace(/\w+/g, ((fnName: string) => {
        DomList.prototype[fnName] = factory(fnName);
    }) as any);
}

defineMethods("length push pop unshift shift splice sort reverse indexOf lastIndexOf every some", fnName => Array.prototype[fnName as any]);
defineMethods("slice map", fnName => function () {
    return $(Array.prototype[fnName as any].apply(this, arguments));
});
defineMethods("next prev parent closest clone", fnName => function (selector: any) {
    return $().add(this.map(elem => (dom as any)[fnName](elem, selector)));
});
defineMethods("children", fnName => function (selector: any) {
    const r = $();
    this.each(elem => {
        r.add((dom as any)[fnName](elem, selector));
    });
    return r;
});
defineMethods("append prepend before after", fnName => function (content: any) {
    if (typeof content === "object") {
        if (this.length) {
            content = $(content, this[0].ownerDocument || (this[0] as any).document || this[0]);
            if (content.length) {
                this.each((elem, index) => {
                    const current = index === 0 ? content : content.clone();
                    const newNode = (dom as any)[fnName](elem, current[0]);
                    for (let i = 1; i < current.length; i++) {
                        dom.after(newNode, current[i]);
                    }
                });
            }
        }
        return this;
    }
    return this.each(elem => (dom as any)[fnName](elem, content));
});
defineMethods("remove on off trigger animate show hide toggle", fnName => function () {
    return this.each(elem => (dom as any)[fnName](elem, ...arguments));
});
defineMethods("attr css", fnName => function (name: any, value: any) {
    const domFnName = fnName === "css" ? "Style" : "Attr";
    if (typeof name === "object") {
        for (const key in name) {
            this.each(elem => (dom as any)["set" + domFnName](elem, key, name[key]));
        }
        return this;
    }
    if (value === undefined) {
        return this.length ? (dom as any)["get" + domFnName](this[0], name) : undefined;
    }
    return this.each(elem => (dom as any)["set" + domFnName](elem, name, value));
});
defineMethods("text html scroll rect", fnName => function (value: any) {
    const domFnName = fnName.charAt(0).toUpperCase() + fnName.slice(1);
    if (value === undefined) {
        return this.length ? (dom as any)["get" + domFnName](this[0]) : undefined;
    }
    return this.each(elem => (dom as any)["set" + domFnName](elem, value));
});
defineMethods("val", fnName => DomList.prototype.text);
defineMethods("click focus blur submit select", fnName => function (handler: any) {
    return this.each(elem => {
        if (handler === undefined) {
            if ((elem as any)[fnName]) {
                (elem as any)[fnName]();
            } else {
                dom.trigger(elem, fnName);
            }
        } else {
            dom.on(elem, fnName, handler);
        }
    });
});
