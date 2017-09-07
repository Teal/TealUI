type ParseWrapper = [number, string, string];
var parseFix: { [name: string]: ParseWrapper };
var parseContainer: HTMLElement;

/**
 * 解析一段 HTML 并返回相应的节点。
 * @param html 要解析的 HTML 片段。
 * @param context 创建节点使用的文档。
 * @return 返回创建的节点。如果 HTML 片段中含多个节点，则返回一个文档片段。
 */
export function parse(html: string, context = document) {
    if (!parseFix) {
        const select: ParseWrapper = [1, "<select multiple='multiple'>", "</select>"];
        const table: ParseWrapper = [1, "<table>", "</table>"];
        const tr: ParseWrapper = [3, "<table><tbody><tr>", "</tr></tbody></table>"];
        parseFix = {
            __proto__: null!,
            option: select,
            optgroup: select,
            thead: table,
            tbody: table,
            tfoot: table,
            caption: table,
            colgroup: table,
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: tr,
            th: tr,
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"]
        };
        parseContainer = document.createElement("div");
    }
    let container = context === document ? parseContainer : context.createElement("div");
    const match = /^<(\w+)/.exec(html);
    const wrapper = match && parseFix[match[1].toLowerCase()];
    if (wrapper) {
        container.innerHTML = wrapper[1] + html + wrapper[2];
        for (let level = wrapper[0]; level--; container = container.lastChild as HTMLElement);
    } else {
        container.innerHTML = html;
    }
    let result = container.firstChild || context.createTextNode(html);
    if (result.nextSibling) {
        result = context.createDocumentFragment();
        while (container.firstChild) {
            result.appendChild(container.firstChild);
        }
    }
    return result as HTMLElement | Text | DocumentFragment;
}

/**
 * 查找 CSS 选择器匹配的所有元素。
 * @param node 要查找的根节点。
 * @param selector 要查找的 CSS 选择器。
 * @return 返回匹配的元素列表。
 */
export function query(node: Element | Document, selector: string): HTMLElement[];

/**
 * 查找 CSS 选择器匹配的所有元素。
 * @param selector 要查找的 CSS 选择器。
 * @return 返回匹配的元素列表。
 */
export function query(selector: string): HTMLElement[];

export function query(node: Element | Document | string, selector?: string) {
    return Array.prototype.slice.call(querySelector(node, selector), 0);
}

/**
 * 查找 CSS 选择器匹配的第一个元素。
 * @param node 要查找的根节点。
 * @param selector 要查找的 CSS 选择器。
 * @return 返回匹配的第一个元素。如果找不到则返回 null。
 */
export function find(node: Element | Document, selector: string): HTMLElement | null;

/**
 * 查找 CSS 选择器匹配的第一个元素。
 * @param selector 要查找的 CSS 选择器。
 * @return 返回匹配的第一个元素。如果找不到则返回 null。
 */
export function find(selector: string): HTMLElement | null;

export function find(node: Element | Document | string, selector?: string) {
    return querySelector(node, selector, true);
}

function querySelector(node: Element | Document | string, selector?: string, first?: boolean) {
    if (typeof node === "string") {
        selector = node;
        node = document;
    }
    return first ? node.querySelector(selector!) : node.querySelectorAll(selector!);
}

/**
 * 判断元素是否匹配指定的 CSS 选择器。
 * @param elem 要判断的元素。
 * @param selector 要判断的 CSS 选择器。
 * @return 如果匹配则返回 true，否则返回 false。
 * @example matches(document.body, "body") // true
 */
export function match(elem: Element, selector: string) {
    if (elem.matches) {
        return elem.matches(selector);
    }
    const parent = elem.parentNode as HTMLElement;
    const actualParent = parent || elem.ownerDocument.documentElement;
    parent || actualParent.appendChild(elem);
    try {
        return Array.prototype.indexOf.call(querySelector(actualParent, selector), elem) >= 0;
    } finally {
        parent || actualParent.removeChild(elem);
    }
}

/**
 * 获取节点的第一个子元素。
 * @param node 要获取的节点。
 * @param selector 用于筛选元素的 CSS 选择器。
 * @return 返回元素。如果元素不存在则返回 null。
 */
export function first(node: Node, selector?: string) {
    return walk(node, selector, "nextSibling", "firstChild");
}

/**
 * 获取节点的最后一个子元素。
 * @param node 要获取的节点。
 * @param selector 用于筛选元素的 CSS 选择器。
 * @return 返回元素。如果元素不存在则返回 null。
 */
export function last(node: Node, selector?: string) {
    return walk(node, selector, "previousSibling", "lastChild");
}

/**
 * 获取节点的下一个相邻元素。
 * @param node 要获取的节点。
 * @param selector 用于筛选元素的 CSS 选择器。
 * @return 返回元素。如果元素不存在则返回 null。
 */
export function next(node: Node, selector?: string) {
    return walk(node, selector, "nextSibling");
}

/**
 * 获取节点的上一个相邻元素。
 * @param node 要获取的节点。
 * @param selector 用于筛选元素的 CSS 选择器。
 * @return 返回元素。如果元素不存在则返回 null。
 */
export function prev(node: Node, selector?: string) {
    return walk(node, selector, "previousSibling");
}

/**
 * 获取指定节点的父元素。
 * @param node 要获取的节点。
 * @param selector 用于筛选元素的 CSS 选择器。
 * @return 返回元素。如果元素不存在则返回 null。
 */
export function parent(node: Node, selector?: string) {
    return walk(node, selector, "parentNode");
}

function walk(node: Node | null, selector: string | undefined, nextProp: "nextSibling" | "previousSibling" | "parentNode", firstProp: typeof nextProp | "firstChild" | "lastChild" = nextProp) {
    for (node = node![firstProp]; node; node = node[nextProp]) {
        if (node.nodeType === 1 && (!selector || match(node as Element, selector))) {
            return node as HTMLElement;
        }
    }
    return null;
}

/**
 * 从指定节点开始向父元素查找第一个匹配指定 CSS 选择器的元素。
 * @param node 要开始查找的节点。
 * @param selector 要匹配的 CSS 选择器。
 * @param context 如果提供了上下文，则只在指定的元素内搜索。
 * @return 返回元素。如果元素不存在则返回 null。
 * @example closest(document.body, "body")
 */
export function closest(node: Node, selector: string, context?: HTMLElement | Document | null) {
    while (node && node !== context && (node.nodeType !== 1 || !match(node as HTMLElement, selector))) {
        node = node.parentNode!;
    }
    return node === context ? null : node as HTMLElement;
}

/**
 * 获取指定节点的所有子元素。
 * @param node 要获取的节点。
 * @param selector 用于筛选元素的 CSS 选择器。
 * @return 返回包含所有子元素的数组。
 */
export function children(node: Node, selector?: string) {
    const result: HTMLElement[] = [];
    for (node = node.firstChild!; node; node = node.nextSibling!) {
        if (node.nodeType === 1 && (!selector || match(node as HTMLElement, selector))) {
            result.push(node as HTMLElement);
        }
    }
    return result;
}

/**
 * 判断指定节点是否包含另一个节点。
 * @param node 要判断的节点。
 * @param child 要判断的子节点。
 * @return 如果 child 同 node 或是其子节点则返回 true，否则返回 false。
 * @example contains(document.body, document.body) // true
 */
export function contains(node: Node, child: Node) {
    if (node.contains) {
        return node.contains(child);
    }
    for (; child; child = child.parentNode!) {
        if (child === node) {
            return true;
        }
    }
    return false;
}

/**
 * 获取指定节点在其父节点中的索引。
 * @param node 要处理的节点。
 * @return 返回索引。如果没有父元素则返回 0。
 */
export function index(node: Node) {
    let result = 0;
    while ((node = node.previousSibling!)) {
        if (node.nodeType === 1) {
            result++;
        }
    }
    return result;
}

/**
 * 在指定节点末尾插入一段 HTML 或一个节点。
 * @param node 插入所在的节点。
 * @param content 要插入的 HTML 或节点。
 * @return 返回插入的新节点。
 */
export function append(node: Node, content: string | Node | null) {
    return insert(node, content, false, false);
}

/**
 * 在指定节点开头插入一段 HTML 或一个节点。
 * @param node 插入所在的节点。
 * @param content 要插入的 HTML 或节点。
 * @return 返回插入的新节点。
 */
export function prepend(node: Node, content: string | Node | null) {
    return insert(node, content, true, false);
}

/**
 * 在指定节点前插入一段 HTML 或一个节点。
 * @param node 插入所在的节点。该节点必须具有父节点。
 * @param content 要插入的 HTML 或节点。
 * @return 返回插入的新节点。
 */
export function before(node: Node, content: string | Node | null) {
    return insert(node, content, true, true);
}

/**
 * 在指定节点后插入一段 HTML 或一个节点。
 * @param node 插入所在的节点。该节点必须具有父节点。
 * @param content 要插入的 HTML 或节点。
 * @return 返回插入的新节点。
 */
export function after(node: Node, content: string | Node | null) {
    return insert(node, content, false, true);
}

function insert(node: Node, content: string | Node | null, prepend: boolean, sibling: boolean) {
    if (content) {
        if (typeof content === "string") {
            content = parse(content, node.ownerDocument || node);
        }
        if (sibling) {
            return node.parentNode!.insertBefore(content, prepend ? node : node.nextSibling);
        }
        return prepend ? node.insertBefore(content, node.firstChild) : node.appendChild(content);
    }
}

/**
 * 移除指定的节点。
 * @param node 要移除的节点。
 */
export function remove(node: Node | null) {
    node && node.parentNode && node.parentNode.removeChild(node);
}

/**
 * 复制指定的节点。
 * @param node 要复制的节点。
 * @return 返回复制的新节点。
 */
export function clone<T extends Node>(node: T) {
    return node.cloneNode(true) as T;
}

/**
 * 获取指定元素的属性值。
 * @param elem 要获取的元素。
 * @param attrName 要获取的属性名。
 * @return 返回属性值。如果不存在则返回 null。
 * @example getAttr(document.body, "class")
 */
export function getAttr(elem: HTMLElement, attrName: string) {
    return attrName in elem ? (elem as any)[attrName] : elem.getAttribute(attrName);
}

/**
 * 设置指定元素的属性值。
 * @param elem 要设置的元素。
 * @param attrName 要设置的属性名。
 * @param value 要设置的属性值。设置为 null 表示删除属性。
 * @example setAttr(document.body, "class", "red")
 * @example setAttr(document.body, "class", null)
 */
export function setAttr(elem: HTMLElement, attrName: string, value: any) {
    if (/^on./.test(attrName) && attrName in elem) {
        if (typeof value === "string") {
            elem.setAttribute(attrName, value);
        } else {
            (elem as any)[attrName] = value;
        }
    } else {
        if (attrName in elem || value != null && typeof value !== "string") {
            (elem as any)[attrName] = value;
        } else if (value == null) {
            elem.removeAttribute(attrName);
        } else {
            elem.setAttribute(attrName, value);
        }
    }
}

/**
 * 获取指定元素的文本内容。
 * @param elem 要获取的元素。
 * @return 返回文本内容。
 * @example getText(document.body)
 */
export function getText(elem: HTMLElement) {
    return (elem as HTMLInputElement)[textProp(elem)]!;
}

/**
 * 设置指定元素的文本内容。
 * @param elem 要设置的元素。
 * @param value 要设置的文本内容。
 * @example setText(document.body, "text")
 */
export function setText(elem: HTMLElement, value: string) {
    (elem as HTMLInputElement)[textProp(elem)] = value;
}

function textProp(elem: HTMLElement) {
    return /^(INPUT|SELECT|TEXTAREA)$/.test(elem.tagName) ? "value" : "textContent";
}

/**
 * 获取指定元素的内部 HTML。
 * @param elem 要获取的元素。
 * @return 返回内部 HTML。
 * @example getHtml(document.body)
 */
export function getHtml(elem: HTMLElement) {
    return elem.innerHTML;
}

/**
 * 设置指定元素的内部 HTML。
 * @param elem 要设置的元素。
 * @param value 要设置的内部 HTML。
 * @example setHtml(document.body, "html")
 */
export function setHtml(elem: HTMLElement, value: string) {
    elem.innerHTML = value;
}

/**
 * 判断指定元素是否已添加指定的 CSS 类名。
 * @param elem 要判断的元素。
 * @param className 要判断的 CSS 类名。
 * @return 如果已添加则返回 true，否则返回 false。
 */
export function hasClass(elem: HTMLElement, className: string) {
    return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
}

/**
 * 添加指定元素的 CSS 类名。
 * @param elem 要处理的元素。
 * @param className 要添加的 CSS 类名。
 * @example addClass(document.body, "light")
 */
export function addClass(elem: HTMLElement, className: string) {
    toggleClass(elem, className, true);
}

/**
 * 删除指定元素的 CSS 类名。
 * @param elem 要处理的元素。
 * @param className 要删除的 CSS 类名。
 * @example removeClass(document.body, "light")
 */
export function removeClass(elem: HTMLElement, className: string) {
    toggleClass(elem, className, false);
}

/**
 * 如果存在（不存在）则删除（添加）指定元素的 CSS 类名。
 * @param elem 要处理的元素。
 * @param className 要添加或删除的 CSS 类名。
 * @param value 如果为 true 则添加 CSS 类名；如果为 false 则删除 CSS 类名。
 * @example toggleClass(document.body, "light")
 */
export function toggleClass(elem: HTMLElement, className: string, value?: boolean) {
    if (hasClass(elem, className)) {
        if (value !== true) {
            elem.className = (" " + elem.className + " ").replace(" " + className + " ", " ").trim();
        }
    } else if (value !== false) {
        elem.className = elem.className ? elem.className + " " + className : className;
    }
}

/**
 * 为指定的 CSS 属性添加当前浏览器特定的后缀（如 webkit-)。
 * @param propName 要处理的 CSS 属性名。
 * @return 返回已添加后缀的 CSS 属性名。
 * @example vendor("transform")
 */
export function vendor(propName: string) {
    if (!(propName in document.documentElement.style)) {
        const capName = propName.charAt(0).toUpperCase() + propName.slice(1);
        for (const prefix of ["webkit", "Moz", "ms", "O"]) {
            if ((prefix + capName) in document.documentElement.style) {
                return prefix + capName;
            }
        }
    }
    return propName;
}

/**
 * 获取指定元素的 CSS 属性值。
 * @param elem 要获取的元素。
 * @param propName 要获取的 CSS 属性名(骆驼规则)。
 * @return 返回 CSS 属性值。
 * @example getStyle(document.body, "fontSize")
 */
export function getStyle(elem: HTMLElement, propName: string) {
    return elem.ownerDocument.defaultView.getComputedStyle(elem)[vendor(propName) as any];
}

/**
 * 设置指定元素的 CSS 属性值。
 * @param elem 要设置的元素。
 * @param propName 要设置的 CSS 属性名(骆驼规则)。
 * @param value 要设置的 CSS 属性值。如果是数字则自动追加像素单位。
 * @example setStyle(document.body, "fontSize")
 */
export function setStyle(elem: HTMLElement, propName: string, value: string | number) {
    elem.style[vendor(propName) as any] = value && typeof value === "number" && !/^(?:columnCount|fillOpacity|flexGrow|flexShrink|fontWeight|lineHeight|opacity|order|orphans|widows|zIndex|zoom)$/.test(propName) ? value + "px" : value as any;
}

/**
 * 计算一个元素的样式值。
 * @param elem 要计算的元素。
 * @param propNames 要计算的 CSS 属性名(骆驼规则)列表。
 * @return 返回所有 CSS 属性值的和。
 * @example getStyleNumber(document.body, "fontSize", "lineHeight")
 */
export function computeStyle(elem: HTMLElement, ...propNames: string[]) {
    let result = 0;
    const computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem);
    for (const prop of propNames) {
        result += parseFloat(computedStyle[prop as any]) || 0;
    }
    return result;
}

/**
 * 表示一个坐标。
 */
export interface Point {

    /**
     * X 坐标值。
     */
    x: number;

    /**
     * Y 坐标值。
     */
    y: number;

}

/**
 * 表示一个大小。
 */
export interface Size {

    /**
     * 宽度。
     */
    width: number;

    /**
     * 高度。
     */
    height: number;

}

/**
 * 表示一个矩形区域。
 */
export interface Rect extends Point, Size { }

/**
 * 获取指定元素的滚动距离。
 * @param elem 要获取的元素或文档。
 * @return 返回坐标。如果元素不可滚动则返回原点。
 * @example getScroll(document.body)
 */
export function getScroll(elem: HTMLElement | Document) {
    if (elem.nodeType === 9) {
        const win = (elem as Document).defaultView;
        if ("pageXOffset" in win) {
            return {
                x: win.pageXOffset,
                y: win.pageYOffset
            } as Point;
        }
        elem = (elem as Document).documentElement;
    }
    return {
        x: (elem as HTMLElement).scrollLeft,
        y: (elem as HTMLElement).scrollTop
    } as Point;
}

/**
 * 设置指定元素的滚动距离。
 * @param elem 要设置的元素或文档。
 * @param value 要设置的坐标。允许只设置部分属性。
 * @example setScroll(document.body, { x: 100, y: 500 });
 */
export function setScroll(elem: HTMLElement | Document, value: Partial<Point>) {
    if (elem.nodeType === 9) {
        (elem as Document).defaultView.scrollTo(
            (value.x == null ? getScroll(elem) : value).x,
            (value.y == null ? getScroll(elem) : value).y
        );
    } else {
        if (value.x != null) (elem as HTMLElement).scrollLeft = value.x;
        if (value.y != null) (elem as HTMLElement).scrollTop = value.y;
    }
}

/**
 * 获取指定元素和其定位父元素的偏移距离。
 * @param elem 要获取的元素。
 * @return 返回坐标。
 * @example getOffset(document.body)
 */
export function getOffset(elem: HTMLElement) {
    const left = getStyle(elem, "left");
    const top = getStyle(elem, "top");
    if ((left && top && left !== "auto" && top !== "auto") || getStyle(elem, "position") !== "absolute") {
        return {
            x: parseFloat(left) || 0,
            y: parseFloat(top) || 0
        } as Point;
    }
    const parent = offsetParent(elem);
    const rect = getRect(elem);
    if (parent.nodeName !== "HTML") {
        const rootRect = getRect(parent);
        rect.x -= rootRect.x;
        rect.y -= rootRect.y;
    }
    rect.x -= computeStyle(elem, "marginLeft") + computeStyle(parent, "borderLeftWidth");
    rect.y -= computeStyle(elem, "marginTop") + computeStyle(parent, "borderTopWidth");
    return rect as Point;
}

/**
 * 设置指定元素和其定位父元素的偏移距离。
 * @param elem 要处理的元素。
 * @param value 要设置的坐标。允许只设置部分属性。
 * @example setOffset(document.body, { x: 100 });
 */
export function setOffset(elem: HTMLElement, value: Partial<Point>) {
    if (value.x! >= 0) {
        elem.style.left = value.x + "px";
    }
    if (value.y! >= 0) {
        elem.style.top = value.y + "px";
    }
}

/**
 * 获取指定元素的定位父元素。
 * @param elem 要获取的元素。
 * @return 返回定位父元素。
 * @example offsetParent(document.body)
 */
export function offsetParent(elem: HTMLElement) {
    let result = elem;
    while ((result = result.offsetParent as HTMLElement) && result.nodeName !== "HTML" && getStyle(result, "position") === "static");
    return result || elem.ownerDocument.documentElement;
}

/**
 * 获取指定元素的区域。
 * @param elem 要获取的元素或文档。
 * @return 返回元素实际占用区域（含内边距和边框、不含外边距）。如果元素不可见则返回空区域。
 * @example getRect(document.body)
 */
export function getRect(elem: HTMLElement | Document) {
    const doc = elem.ownerDocument || elem;
    const html = doc.documentElement;
    const result = getScroll(doc) as Rect;
    if (elem.nodeType === 9) {
        result.width = html.clientWidth;
        result.height = html.clientHeight;
    } else {
        const rect = (elem as HTMLElement).getBoundingClientRect();
        result.x += rect.left - html.clientLeft;
        result.y += rect.top - html.clientTop;
        result.width = rect.width;
        result.height = rect.height;
    }
    return result;
}

/**
 * 设置指定元素的区域。
 * @param elem 要设置的元素。
 * @param value 要设置的区域内容（含内边距和边框、不含外边距）。允许只设置部分属性。
 * @example setRect(document.body, {width: 200, height: 400})
 */
export function setRect(elem: HTMLElement, value: Partial<Rect>) {
    const style = elem.style;
    if (value.x != null || value.y != null) {
        // 确保对象可移动。
        if (!/^(?:abs|fix)/.test(getStyle(elem, "position"))) {
            style.position = "relative";
        }
        const currentPosition = getRect(elem);
        const offset = getOffset(elem);
        if (value.y != null) {
            style.top = offset.y + value.y - currentPosition.y + "px";
        }
        if (value.x != null) {
            style.left = offset.x + value.x - currentPosition.x + "px";
        }
    }
    if (value.width != null || value.height != null) {
        const boxSizing = getStyle(elem, "boxSizing") === "border-box";
        if (value.width != null) {
            style.width = value.width - (boxSizing ? 0 : computeStyle(elem, "borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight")) + "px";
        }
        if (value.height != null) {
            style.height = value.height - (boxSizing ? 0 : computeStyle(elem, "borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom")) + "px";
        }
    }
}

interface EventFix {

    /**
     * 绑定当前事件时实际绑定的事件。
     */
    bind?: string;

    /**
     * 委托当前事件时实际绑定的事件。
     */
    delegate?: string;

    /**
     * 实际绑定的事件触发后筛选是否触发当前事件的过滤器。
     */
    filter?: (this: EventFix, e: Event, elem: Element | Document) => boolean | void;

    /**
     * 自定义绑定事件的函数。
     */
    add?: (this: EventFix, elem: Element | Document, listener: EventListener) => void;

    /**
     * 自定义解绑事件的函数。
     */
    remove?: (this: EventFix, elem: Element | Document, listener: EventListener) => void;

}
var eventFix: { [event: string]: EventFix };

/**
 * 绑定指定元素的事件。
 * @param elem 要绑定的元素或文档。
 * @param eventName 要绑定的事件名。
 * @param selector 要委托的目标元素的 CSS 选择器。
 * @param listener 要绑定的事件监听器。
 * @param scope 设置 *listener* 中 this 的值。
 * @example on(document.body, "mouseenter", "a", function(e){ this.firstChild.innerHTML = e.pageX; })
 */
export function on(elem: HTMLElement | Document, eventName: string, selector: string, listener: (e: Event, target: HTMLElement) => void, scope?: any): void;

/**
 * 绑定指定元素的事件。
 * @param elem 要绑定的元素或文档。
 * @param eventName 要绑定的事件名。
 * @param listener 要绑定的事件监听器。
 * @param scope 设置 *listener* 中 this 的值。
 * @example on(document.body, "click", e => { alert("点击事件") })
 */
export function on(elem: HTMLElement | Document, eventName: string, listener: (e: Event, target: typeof elem) => void, scope?: any): void;

export function on(elem: HTMLElement | Document, eventName: string, selector: string | typeof listener, listener?: ((e: Event, target?: HTMLElement | Document) => void) | typeof scope, scope?: any) {
    if (!eventFix) {
        const isEnterOrLeave: EventFix["filter"] = (e: MouseEvent, target) => /(?:ter|e)$/.test(e.type) || !contains(target, e.relatedTarget as Node);

        eventFix = {
            __proto__: null!,

            // focus/blur 不支持冒泡，委托时使用 foucin/foucsout。
            focus: { delegate: "focusin" },
            blur: { delegate: "focusout" },

            // mouseenter/mouseleave 不支持冒泡，委托时使用 mouseover/mouseout。
            mouseenter: { delegate: "mouseover", filter: isEnterOrLeave },
            mouseleave: { delegate: "mouseout", filter: isEnterOrLeave },

            // pointerenter/pointerleave 不支持冒泡，委托时使用 pointerover/pointerout。
            pointerenter: { delegate: "pointerover", filter: isEnterOrLeave },
            pointerleave: { delegate: "pointerout", filter: isEnterOrLeave },

            // 支持绑定原生 click。
            mouseclick: { bind: "click" }
        };

        const html = Document.prototype;

        // Firefox: 不支持 focusin/focusout 事件。
        // 注意：Chrome 实际支持 focusin/focusout 事件，但判断比较复杂，所以按不支持处理。
        if (!("onfocusin" in html)) {
            const focusAdd: EventFix["add"] = function (elem, listener) {
                elem.addEventListener(this.bind!, listener, true);
            };
            const focusRemove: EventFix["remove"] = function (elem, listener) {
                elem.removeEventListener(this.bind!, listener, true);
            };
            eventFix.focusin = { bind: "focus", add: focusAdd, remove: focusRemove };
            eventFix.focusout = { bind: "blur", add: focusAdd, remove: focusRemove };
        }

        // Firefox/Chrome 30-: 不支持 mouseenter/mouseleave 事件。
        if (!("onmouseenter" in html)) {
            eventFix.mouseenter.bind = "mouseover";
            eventFix.mouseleave.bind = "mouseout";
        }

        // Firefox: 不支持 mousewheel 事件。
        if (!("onmousewheel" in html)) {
            eventFix.mousewheel = {
                bind: "DOMMouseScroll",
                filter(e: MouseWheelEvent) {
                    // 统一使用 wheelDelta 获取滚轮距离。
                    (e as any).wheelDelta = -(e.detail || 0) / 3;
                }
            };
        }

        // 低版本浏览器：不支持 auxclick 事件。
        if (!("onauxclick" in html)) {
            eventFix.auxclick = {
                bind: "mouseup",
                filter: (e: MouseEvent) => e.which === 3
            };
        }

        // 低版本浏览器：不支持 pointer* 事件。
        if (!("onpointerdown" in html)) {
            eventFix.pointerover = { bind: "mouseover" };
            eventFix.pointerout = { bind: "mouseout" };
            eventFix.pointerenter.bind = eventFix.mouseenter.bind || "mouseenter";
            eventFix.pointerenter.delegate = "mouseover";
            eventFix.pointerleave.bind = eventFix.mouseleave.bind || "mouseleave";
            eventFix.pointerleave.delegate = "mouseout";
            eventFix.pointerdown = { bind: "mousedown" };
            eventFix.pointerup = { bind: "mouseup" };
            eventFix.pointermove = { bind: "mousemove" };
        }

        // 触屏：提速鼠标事件。
        if ((window as any).TouchEvent) {
            const initTouchEvent: EventFix["filter"] = function (e: TouchEvent) {
                // PC Chrome: 修复触摸事件的 pageX 和 pageY 始终是 0。
                if (!(e as any).pageX && !(e as any).pageY && (e.changedTouches || 0).length) {
                    Object.defineProperty(e, "pageX", { get(this: TouchEvent) { return this.changedTouches[0].pageX; } });
                    Object.defineProperty(e, "pageY", { get(this: TouchEvent) { return this.changedTouches[0].pageY; } });
                    Object.defineProperty(e, "clientX", { get(this: TouchEvent) { return this.changedTouches[0].clientX; } });
                    Object.defineProperty(e, "clientY", { get(this: TouchEvent) { return this.changedTouches[0].clientY; } });
                    Object.defineProperty(e, "which", { value: 1 });
                }
            };
            eventFix.click = {
                filter: initTouchEvent,
                add(elem, listener) {
                    let state: any = 0;
                    elem.addEventListener("touchstart", (listener as any).__touchStart__ = function (e: TouchEvent) {
                        if (e.changedTouches.length === 1) {
                            state = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
                        }
                    }, false);
                    elem.addEventListener("touchend", (listener as any).__touchEnd__ = function (e: TouchEvent) {
                        if (state && e.changedTouches.length === 1 && Math.pow(e.changedTouches[0].pageX - state[0], 2) + Math.pow(e.changedTouches[0].pageY - state[1], 2) < 25) {
                            state = 1;
                            listener.call(elem, e);
                        }
                    }, false);
                    elem.addEventListener("click", (listener as any).__click__ = function (e: MouseEvent) {
                        const trigger = state !== 1;
                        state = 0;
                        trigger && listener.call(this, e);
                    }, false);
                },
                remove(elem, listener) {
                    elem.removeEventListener("touchstart", (listener as any).__touchStart__, false);
                    elem.removeEventListener("touchend", (listener as any).__touchEnd__, false);
                    elem.removeEventListener("click", (listener as any).__click__, false);
                }
            };
            if (eventFix.pointerout) {
                const pointerAdd: EventFix["add"] = function (elem, listener) {
                    let state = 0;
                    elem.addEventListener((this as any).touch, (listener as any).__touch__ = function (e: MouseEvent) {
                        state = 1;
                        listener.call(this, e);
                    }, false);
                    elem.addEventListener(this.bind!, (listener as any).__mouse__ = function (e: MouseEvent) {
                        if (state) {
                            state = 0;
                        } else {
                            listener.call(this, e);
                        }
                    }, false);
                };
                const pointerRemove: EventFix["remove"] = function (elem, listener) {
                    elem.removeEventListener((this as any).touch, (listener as any).__touch__, false);
                    elem.removeEventListener(this.bind!, (listener as any).__mouse__, false);
                };
                eventFix.pointerdown = { bind: "mousedown", touch: "touchstart", filter: initTouchEvent, add: pointerAdd, remove: pointerRemove } as any;
                eventFix.pointerup = { bind: "mouseup", touch: "touchend", filter: initTouchEvent, add: pointerAdd, remove: pointerRemove } as any;
                eventFix.pointermove = { bind: "mousemove", touch: "touchmove", filter: initTouchEvent, add: pointerAdd, remove: pointerRemove } as any;
            }
        }
    }

    if (typeof selector !== "string") {
        scope = listener;
        listener = selector;
        selector = "";
    }
    scope = scope || elem;

    const events = (elem as any).__events__ || ((elem as any).__events__ = { __proto__: null! });
    const key = selector ? eventName + " " + selector : eventName;
    const listeners = events[key];

    const delegateFix = eventFix[eventName] || 0;
    const bindFix = selector && delegateFix.delegate ? eventFix[eventName = delegateFix.delegate!] || 0 : delegateFix;

    // 如果满足以下任一情况，需要重新封装监听器。
    // 1. 事件委托，需要重新定位目标元素。
    // 2. 事件有特殊过滤器，仅在满足条件时触发。
    // 3. 需要重写回调函数中的 this。
    // 4. 监听器具有第二参数，需要重写回调函数的第二参数。
    // 5. 监听器已添加需要重新封装才能绑定成功。
    if (selector || scope !== elem || bindFix.filter || listener.length > 1 || listeners && indexOfListener(listeners, listener, scope) >= 0) {
        const originalListener = listener;
        listener = (e: Event) => {
            let target = scope;
            if (selector && (!(target = closest(e.target as Node, selector, target)!) || (delegateFix !== bindFix && delegateFix.filter && delegateFix.filter(e, target) === false))) {
                return;
            }
            if (bindFix.filter && bindFix.filter(e, target) === false) {
                return;
            }
            originalListener.call(scope, e, target);
        };
        listener.__original__ = originalListener;
        listener.__scope__ = scope;
    }

    // 保存监听器以便之后解绑或手动触发事件。
    if (!listeners) {
        events[key] = listener;
    } else if (Array.isArray(listeners)) {
        listeners.push(listener);
    } else {
        events[key] = [listeners, listener];
    }

    // 底层绑定事件。
    bindFix.add ? bindFix.add(elem, listener) : elem.addEventListener(bindFix.bind || eventName, listener, false);

}

/**
 * 解绑指定元素的事件。
 * @param elem 要解绑的元素或文档。
 * @param eventName 要解绑的事件名。
 * @param selector 要委托的目标元素的 CSS 选择器。
 * @param listener 要解绑的事件监听器。如果未提供则解绑所有监听器。
 * @param scope 设置 *listener* 中 this 的值。
 * @example off(document.body, "mouseenter", "a", function(e) { this.firstChild.innerHTML = e.pageX; })
 */
export function off(elem: HTMLElement | Document, eventName: string, selector: string, listener?: (e: Event, target: HTMLElement | Document) => void, scope?: any): void;

/**
 * 解绑指定元素的事件。
 * @param elem 要解绑的元素或文档。
 * @param eventName 要解绑的事件名。
 * @param listener 要解绑的事件监听器。如果未提供则解绑所有监听器。
 * @param scope 设置 *listener* 中 this 的值。
 * @example off(document.body, "click", e => { alert("点击事件") })
 */
export function off(elem: HTMLElement | Document, eventName: string, listener?: (e: Event, target: HTMLElement | Document) => void, scope?: any): void;

export function off(elem: HTMLElement | Document, eventName: string, selector?: string | typeof listener, listener?: (e: Event, target: HTMLElement | Document) => void, scope?: any) {
    if (typeof selector !== "string") {
        scope = listener;
        listener = selector;
        selector = "";
    }
    scope = scope || elem;

    const events = (elem as any).__events__;
    const key = selector ? eventName + " " + selector : eventName;
    const listeners = events && events[key];
    if (listeners) {
        if (listener) {
            // 更新事件列表。
            const index = indexOfListener(listeners, listener, scope);
            if (~index) {
                if (Array.isArray(listeners)) {
                    listener = listeners[index];
                    listeners.splice(index, 1);
                    if (!listeners.length) {
                        delete events[key];
                    }
                } else {
                    listener = listeners;
                    delete events[key];
                }
            }

            // 底层解绑事件。
            const bindFix = eventFix && eventFix[eventName] || 0;
            bindFix.remove ? bindFix.remove(elem, listener as EventListener) : elem.removeEventListener((selector ? bindFix.delegate : bindFix.bind) || eventName, listener as EventListener, false);
        } else if (Array.isArray(listeners)) {
            for (listener of listeners) {
                off(elem, eventName, selector, listener, scope);
            }
        } else {
            off(elem, eventName, selector, listeners, scope);
        }
    }
}

function indexOfListener(listeners: typeof listener[] | typeof listener | undefined, listener: (e: Event, target: HTMLElement | Document) => void, scope: any) {
    if (Array.isArray(listeners)) {
        for (let i = 0; i < listeners.length; i++) {
            if (listeners[i] === listener || (listeners[i] as any).__original__ === listener && (listeners[i] as any).__scope__ === scope) {
                return i;
            }
        }
        return -1;
    }
    return listeners === listener || (listeners as any).__original__ === listener && (listeners as any).__scope__ === scope ? 0 : -1;
}

/**
 * 触发指定元素的指定事件，执行已添加的事件监听器。
 * @param elem 要触发事件的元素或文档。
 * @param eventName 要触发的事件名。
 * @param selector 要委托的目标元素的 CSS 选择器。
 * @param event 传递给监听器的事件参数。
 * @example trigger(document.body, "click")
 */
export function trigger(elem: HTMLElement | Document, eventName: string, selector: string, event?: Partial<Event>): void;

/**
 * 触发指定元素的指定事件，执行已添加的事件监听器。
 * @param elem 要触发事件的元素或文档。
 * @param eventName 要触发的事件名。
 * @param event 传递给监听器的事件参数。
 * @example trigger(document.body, "click")
 */
export function trigger(elem: HTMLElement | Document, eventName: string, event?: Partial<Event>): void;

export function trigger(elem: HTMLElement | Document, eventName: string, selector: string | typeof event, event?: Partial<Event>) {
    if (typeof selector !== "string") {
        event = selector;
        selector = "";
    }
    const listeners = (elem as any).__events__[selector ? eventName + " " + selector : eventName];
    if (listeners) {
        event = event || {};
        if (!event.type) (event as any).type = eventName;
        if (!event.target) (event as any).target = selector ? find(elem, selector as string) : elem;
        if (Array.isArray(listeners)) {
            for (const listener of listeners.slice(0)) {
                listener.call(elem, event);
            }
        } else {
            listeners.call(elem, event);
        }
    }
}

/**
 * 存储特效相关配置。
 */
var animateFix: {

    /**
     * 是否支持 CSS3 动画。
     */
    support: boolean,

    /**
     * transition 属性名。
     */
    transition: string,

    /**
     * transitionEnd 事件名。
     */
    transitionEnd: string

};

/**
 * 执行一个自定义动画渐变。
 * @param elem 要渐变的元素。
 * @param propNames 要渐变的 CSS 属性名和最终的属性值组成的键值对。
 * @param callback 渐变执行结束的回调函数。
 * @param duration 渐变执行的总毫秒数。
 * @param timingFunction 渐变函数。可以使用 CSS3 预设的特效渐变函数。
 * @example animate(document.body, { height: 400 });
 */
export function animate(elem: HTMLElement, propNames: { [propName: string]: string | number }, callback?: (this: typeof elem) => void, duration = 200, timingFunction = "ease") {
    if (!animateFix) {
        const transition = vendor("transition");
        animateFix = {
            support: transition in document.documentElement.style,
            transition: transition,
            transitionEnd: (transition + "End").replace(transition.length > 10 ? /^[A-Z]/ : /[A-Z]/, w => w.toLowerCase())
        };
    }
    if (animateFix.support && duration !== 0) {
        const context = (elem.style as any).__animate__ || ((elem.style as any).__animate__ = { __proto__: null });
        const setTransition = () => {
            let transition = "";
            for (const key in context) {
                if (transition) transition += ",";
                transition += `${key.replace(/[A-Z]|^ms|^webkit/g, word => "-" + word.toLowerCase())} ${duration}ms ${timingFunction}`;
            }
            elem.style[animateFix.transition as any] = transition;
        };
        const end = (e: Event) => {
            // 忽略冒泡导致的调用。
            if (timer && (!e || e.target === e.currentTarget)) {
                clearTimeout(timer);
                timer = 0;
                elem.removeEventListener(animateFix.transitionEnd, end, false);

                // 如果新的渐变覆盖了当前渐变的所有属性，则不触发本次渐变的回调函数。
                let contextUpdated = false;
                for (const key in context) {
                    if (context[key] === end) {
                        delete context[key];
                        contextUpdated = true;
                    }
                }

                if (contextUpdated) {
                    setTransition();
                    callback && callback.call(elem);
                }
            }
        };

        // 设置所有属性为起始值。
        for (let propName in propNames) {
            propName = vendor(propName);
            context[propName] = end;
            if (!elem.style[propName as any]) {
                elem.style[propName as any] = getStyle(elem, propName);
            }
        }

        // 触发重新布局以保证效果可以触发。
        elem.offsetWidth && elem.clientLeft;

        // 设置要渐变的属性。
        setTransition();

        // 绑定渐变完成事件。
        elem.addEventListener(animateFix.transitionEnd, end, false);
        let timer = setTimeout(end, duration) as any;
    } else {
        callback && setTimeout(() => { callback.call(elem); }, duration);
    }

    // 设置属性为最终值，触发动画。
    for (const propName in propNames) {
        setStyle(elem, propName, propNames[propName]);
    }
}

/**
 * 判断指定的元素是否被隐藏。
 * @param elem 要判断的元素。
 * @return 如果元素被隐藏或正在被隐藏则返回 true，否则返回 false。
 * @example isHidden(document.body)
 */
export function isHidden(elem: HTMLElement) {
    return (elem.style as any).__toggle__ === false || (elem.style.display || getStyle(elem, "display")) === "none";
}

/**
 * 存储标签默认的 display 属性。
 */
var defaultDisplays: { [tagName: string]: string };

/**
 * 存储默认显示动画。
 */
var toggleAnimations: { [animation: string]: { [propName: string]: string | number } };

/**
 * 内置的切换动画名。
 */
export type ToggleAnimation = "opacity" | "height" | "width" | "top" | "bottom" | "left" | "right" | "scale" | "scaleX" | "scaleY" | "slideDown" | "slideRight" | "slideUp" | "slideLeft" | "zoomIn" | "zoomOut" | "rotate" | typeof toggleAnimations[""];

/**
 * 显示指定的元素。
 * @param elem 要显示的元素。
 * @param animation 显示时使用的动画。
 * @param callback 动画执行完成后的回调。
 * @param duration 动画执行的总毫秒数。
 * @param timingFunction 渐变函数。可以使用 CSS3 预设的特效渐变函数。
 * @param target 动画的目标元素。
 */
export function show(elem: HTMLElement, animation?: ToggleAnimation, callback?: (this: HTMLElement, value: boolean) => void, duration?: number, timingFunction?: string, target?: HTMLElement) {
    if (animation || callback) {
        toggle(elem, true, animation, callback, duration, timingFunction, target);
    } else {
        elem.style.display = (elem.style as any).__display__ || "";

        // 如果清空内联 display 后 display 仍然为 none, 说明通过 CSS 设置了 display 属性。
        // 这时将元素强制设为 inline 或 block。
        if (getStyle(elem, "display") === "none") {
            const nodeName = elem.nodeName;
            let defaultDisplay = (defaultDisplays || (defaultDisplays = { __proto__: null! }))[nodeName];
            if (!defaultDisplay) {
                // 创建一个新节点以计算其默认的 display 属性。
                const tmp = document.createElement(nodeName);
                document.body.appendChild(tmp);
                defaultDisplay = getStyle(tmp, "display");
                document.body.removeChild(tmp);
                // 如果计算失败则设置为默认的 block。
                if (defaultDisplay === "none") {
                    defaultDisplay = "block";
                }
                // 缓存以加速下次计算。
                defaultDisplays[nodeName] = defaultDisplay;
            }
            elem.style.display = defaultDisplay;
        }
    }
}

/**
 * 隐藏指定的元素。
 * @param elem 要隐藏的元素。
 * @param animation 显示时使用的动画。
 * @param callback 动画执行完成后的回调。
 * @param duration 动画执行的总毫秒数。
 * @param timingFunction 渐变函数。可以使用 CSS3 预设的特效渐变函数。
 * @param target 动画的目标元素。
 */
export function hide(elem: HTMLElement, animation?: ToggleAnimation, callback?: (this: HTMLElement, value: boolean) => void, duration?: number, timingFunction?: string, target?: HTMLElement) {
    if (animation || callback) {
        toggle(elem, false, animation, callback, duration, timingFunction, target);
    } else {
        const currentDisplay = getStyle(elem, "display");
        if (currentDisplay !== "none") {
            (elem.style as any).__display__ = elem.style.display;
            elem.style.display = "none";
        }
    }
}

/**
 * 切换显示或隐藏指定元素。
 * @param elem 要显示或隐藏的元素。
 * @param animation 显示或隐藏时使用的动画。
 * @param callback 动画执行完成后的回调。
 * @param duration 动画执行的总毫秒数。
 * @param timingFunction 渐变函数。可以使用 CSS3 预设的特效渐变函数。
 * @param target 动画的目标元素。
 * @example
 * // 折叠/展开
 * toggle(document.body, "height");
 *
 * // 深入/淡出
 * toggle(document.body, "opacity");
 *
 * // 缩小/放大
 * toggle(document.body, "scale");
 */
export function toggle(elem: HTMLElement, animation?: ToggleAnimation, callback?: (this: HTMLElement, value: boolean) => void, duration?: number, timingFunction?: string, target?: HTMLElement): void;

/**
 * 切换显示或隐藏指定元素。
 * @param elem 要显示或隐藏的元素。
 * @param value 如果为 true 则显示元素；如果为 false 则隐藏元素。
 * @param animation 显示或隐藏时使用的动画。
 * @param callback 动画执行完成后的回调。
 * @param duration 动画执行的总毫秒数。
 * @param timingFunction 渐变函数。可以使用 CSS3 预设的特效渐变函数。
 * @param target 动画的目标元素。
 */
export function toggle(elem: HTMLElement, value: boolean, animation?: ToggleAnimation, callback?: (this: HTMLElement, value: boolean) => void, duration?: number, timingFunction?: string, target?: HTMLElement): void;

export function toggle(elem: HTMLElement, value?: boolean | typeof animation, animation?: ToggleAnimation | typeof callback, callback?: ((this: HTMLElement, value: boolean) => void) | typeof duration, duration?: number | typeof timingFunction, timingFunction?: string | typeof target, target?: HTMLElement) {
    if (typeof value !== "boolean") {
        target = timingFunction as typeof target;
        timingFunction = duration as string;
        duration = callback as number;
        callback = animation as (this: HTMLElement, value: boolean) => void;
        animation = value as ToggleAnimation;
        value = undefined;
    }
    const hidden = isHidden(elem);
    if (value == undefined) {
        value = hidden;
    }
    if (typeof animation === "string") {
        if (!toggleAnimations) {
            toggleAnimations = {
                opacity: {
                    opacity: 0
                },
                height: {
                    marginTop: 0,
                    borderTopWidth: 0,
                    paddingTop: 0,
                    height: 0,
                    paddingBottom: 0,
                    borderBottomWidth: 0,
                    marginBottom: 0
                },
                width: {
                    marginLeft: 0,
                    borderLeftWidth: 0,
                    paddingLeft: 0,
                    width: 0,
                    paddinRight: 0,
                    borderRightWidth: 0,
                    marginRight: 0
                },
                top: { transform: "translateY(-100%)" },
                bottom: { transform: "translateY(100%)" },
                left: { transform: "translateX(-100%)" },
                right: { transform: "translateX(100%)" },
                scale: { transform: "scale(0, 0)" },
                scaleX: { transform: "scaleX(0)" },
                scaleY: { transform: "scaleY(0)" },
                slideDown: { opacity: 0, transform: "translateY(10%)" },
                slideRight: { opacity: 0, transform: "translateX(10%)" },
                slideUp: { opacity: 0, transform: "translateY(-10%)" },
                slideLeft: { opacity: 0, transform: "translateX(-10%)" },
                zoomIn: { opacity: 0, transform: "scale(0, 0)" },
                zoomOut: { opacity: 0, transform: "scale(1.2, 1.2)" },
                rotate: { opacity: 0, transform: "rotate(180deg)" }
            };
        }
        animation = toggleAnimations[animation];
    }
    if (animation && duration !== 0) {

        // 优先显示元素以便后续计算。
        if (value && hidden) {
            show(elem);
        }

        // 设置渐变目标。
        // 如果正在执行渐变，计算新目标会出现错误，直接复用上次设置的目标。
        const setTransformOrigin = target && (animation as typeof toggleAnimations[""]).transform && (elem.style as any).__toggle__ == undefined;
        if (setTransformOrigin) {
            const targetRect = getRect(target!);
            const elemRect = getRect(elem);
            setStyle(elem, "transformOrigin", `${(elemRect.x + elemRect.width <= targetRect.x + targetRect.width / 4 ? targetRect.x : targetRect.x + targetRect.width <= elemRect.x + targetRect.width / 4 ? targetRect.x + targetRect.width : targetRect.x + targetRect.width / 2) - elemRect.x}px ${(elemRect.y + elemRect.height <= targetRect.y + targetRect.height / 4 ? targetRect.y : targetRect.y + targetRect.height <= elemRect.y + targetRect.height / 4 ? targetRect.y + targetRect.height : targetRect.y + targetRect.height / 2) - elemRect.y}px`);
        }

        // 更改宽高时隐藏滚动条。
        const setOverflowX = (animation as typeof toggleAnimations[""]).width != undefined;
        if (setOverflowX) {
            elem.style.overflowX = "hidden";
        }
        const setOverflowY = (animation as typeof toggleAnimations[""]).height != undefined;
        if (setOverflowY) {
            elem.style.overflowY = "hidden";
        }

        // 计算渐变的最终属性。
        // 如果隐藏元素，则 animation 表示最终属性。
        // 如果显示元素，则需要手动计算最终属性。
        let to = animation as typeof toggleAnimations[""];
        if (value) {
            to = {};

            // 如果正在执行渐变，则从当前位置开始渐变而非从隐藏时的值属性开始，同时停止渐变用于计算最终属性。
            let from = animation as typeof toggleAnimations[""];
            if ((elem.style as any).__toggle__ != undefined) {
                from = {};
                for (const prop in animation as typeof toggleAnimations[""]) {
                    from[prop] = getStyle(elem, prop);
                    setStyle(elem, prop, "");
                }
                elem.style[animateFix.transition as any] = "";
            }

            // 计算最终属性值并将属性重置为初始值。
            for (const prop in animation as typeof toggleAnimations[""]) {
                to[prop] = getStyle(elem, prop);
                setStyle(elem, prop, from[prop]);
            }
        }

        // 执行渐变。
        (elem.style as any).__toggle__ = value;
        animate(elem, to, () => {
            delete (elem.style as any).__toggle__;
            if (setOverflowX) {
                elem.style.minWidth = elem.style.overflowX = "";
            }
            if (setOverflowY) {
                elem.style.minHeight = elem.style.overflowY = "";
            }
            if (setTransformOrigin) {
                setStyle(elem, "transformOrigin", "");
            }
            for (const prop in to) {
                setStyle(elem, prop, "");
            }
            if (!value) {
                hide(elem);
            }
            callback && (callback as Function).call(elem, value);
        }, duration as number, timingFunction as string);

    } else {
        value ? show(elem) : hide(elem);
        callback && (callback as Function).call(elem, value);
    }
}

/**
 * 确保在页面加载后执行指定的函数。
 * @param callback 要执行的回调函数。
 * @param context 要等待的文档对象。
 */
export function ready(callback: (this: Document) => void, context = document) {
    if (/^(?:complete|loaded|interactive)$/.test(context.readyState) && context.body) {
        callback.call(context);
    } else {
        context.addEventListener("DOMContentLoaded", callback, false);
    }
}
