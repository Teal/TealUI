type ParseWrapper = [number, string, string];
var parseFix: { [name: string]: ParseWrapper };
var parseContainer: Element;

/**
 * 解析一段 HTML 并创建相应的节点。
 * @param html 要解析的 HTML 片段。
 * @param context 节点所属的文档。
 * @return 返回创建的节点。如果 HTML 片段中有多个根节点，则返回一个文档片段。
 */
export function parse(html: string, context = document) {
    if (!parseFix) {
        const select: ParseWrapper = [1, `<select multiple="multiple">`, `</select>`];
        const table: ParseWrapper = [1, `<table>`, `</table>`];
        const tr: ParseWrapper = [3, `<table><tbody><tr>`, `</tr></tbody></table>`];
        parseFix = {
            __proto__: null!,
            option: select,
            optgroup: select,
            thead: table,
            tbody: table,
            tfoot: table,
            caption: table,
            colgroup: table,
            tr: [2, `<table><tbody>`, `</tbody></table>`],
            col: [2, `<table><tbody></tbody><colgroup>`, `</colgroup></table>`],
            td: tr,
            th: tr,
            legend: [1, `<fieldset>`, `</fieldset>`],
            area: [1, `<map>`, `</map>`],
            param: [1, `<object>`, `</object>`]
        };
        parseContainer = document.createElement("div");
    }
    let container = context === document ? parseContainer : context.createElement("div");
    const match = /^<(\w+)/.exec(html);
    const wrapper = match && parseFix[match[1].toLowerCase()];
    if (wrapper) {
        container.innerHTML = wrapper[1] + html + wrapper[2];
        for (let level = wrapper[0]; level--; container = container.lastChild as Element);
    } else {
        container.innerHTML = html;
    }
    let r = container.firstChild || context.createTextNode(html);
    if (r.nextSibling) {
        r = context.createDocumentFragment();
        while (container.firstChild) {
            r.appendChild(container.firstChild);
        }
    }
    return r as HTMLElement | Text | DocumentFragment;
}

/**
 * 在指定节点范围内查找 CSS 选择器匹配的所有元素。
 * @param parent 要查找的根节点。
 * @param selector 要查找的 CSS 选择器。
 * @return 返回匹配的元素列表。
 */
export function query(parent: Element | Document | NodeSelector, selector: string): HTMLElement[];

/**
 * 在整个文档内查找 CSS 选择器匹配的所有元素。
 * @param selector 要查找的 CSS 选择器。
 * @return 返回匹配的元素列表。
 */
export function query(selector: string): HTMLElement[];

export function query(parent: Element | Document | NodeSelector | string, selector?: string) {
    return Array.prototype.slice.call(querySelector(parent, selector), 0);
}

/**
 * 在指定节点范围内查找 CSS 选择器匹配的第一个元素。
 * @param parent 要查找的根节点。
 * @param selector 要查找的 CSS 选择器。
 * @return 返回匹配的第一个元素。如果找不到则返回 null。
 */
export function find(parent: Element | Document | NodeSelector, selector: string): HTMLElement | null;

/**
 * 在整个文档内查找 CSS 选择器匹配的第一个元素。
 * @param selector 要查找的 CSS 选择器。
 * @return 返回匹配的第一个元素。如果找不到则返回 null。
 */
export function find(selector: string): HTMLElement | null;

export function find(parent: Element | Document | NodeSelector | string, selector?: string) {
    return querySelector(parent, selector, true);
}

var idSeed: number | undefined;

function querySelector(parent: Element | Document | NodeSelector | string, selector?: string, first?: boolean) {
    if (typeof parent === "string") {
        selector = parent;
        parent = document;
    }
    try {
        return first ? parent.querySelector(selector!) : parent.querySelectorAll(selector!);
    } catch (e) {
        if ((parent as Node).nodeType === 1 && selector!.charCodeAt(0) === 62/*>*/) {
            let idCreated: boolean | undefined;
            selector = `#${(parent as Element).id || (idCreated = true, (parent as Element).id = "__dom_q" + (idSeed = idSeed! + 1 || 1) + "__")} ${selector}`;
            try {
                return first ? parent.querySelector(selector) : parent.querySelectorAll(selector);
            } catch (e) {
            } finally {
                if (idCreated) {
                    (parent as Element).id = "";
                }
            }
        }
        throw e;
    }
}

/**
 * 判断元素是否匹配指定的 CSS 选择器。
 * @param elem 元素。
 * @param selector 要判断的 CSS 选择器。
 * @param context 选择器的上下文。
 * @return 如果匹配则返回 true，否则返回 false。
 * @example match(document.body, "body") // true
 */
export function match(elem: Element, selector: string, context?: Element | Document | null): boolean {
    if (elem.matches) {
        try {
            return elem.matches(selector);
        } catch (e) { }
    }
    let parent = elem.parentNode as Element;
    if (parent) {
        return Array.prototype.indexOf.call(querySelector(context || parent, selector), elem) >= 0;
    }
    parent = elem.ownerDocument.documentElement;
    try {
        parent.appendChild(elem);
        return match(elem, selector, context);
    } finally {
        parent.removeChild(elem);
    }
}

/**
 * 获取节点的第一个子元素。
 * @param node 节点。
 * @param selector 用于筛选元素的 CSS 选择器。
 * @return 返回一个元素。如果元素不存在或不匹配指定的 CSS 选择器则返回 null。
 */
export function first(node: Node, selector?: string) {
    return walk(node, selector, "nextSibling", "firstChild");
}

/**
 * 获取节点的最后一个子元素。
 * @param node 节点。
 * @param selector 用于筛选元素的 CSS 选择器。
 * @return 返回一个元素。如果元素不存在或不匹配指定的 CSS 选择器则返回 null。
 */
export function last(node: Node, selector?: string) {
    return walk(node, selector, "previousSibling", "lastChild");
}

/**
 * 获取节点的下一个相邻元素。
 * @param node 节点。
 * @param selector 用于筛选元素的 CSS 选择器。
 * @return 返回一个元素。如果元素不存在或不匹配指定的 CSS 选择器则返回 null。
 */
export function next(node: Node, selector?: string) {
    return walk(node, selector, "nextSibling");
}

/**
 * 获取节点的上一个相邻元素。
 * @param node 节点。
 * @param selector 用于筛选元素的 CSS 选择器。
 * @return 返回一个元素。如果元素不存在或不匹配指定的 CSS 选择器则返回 null。
 */
export function prev(node: Node, selector?: string) {
    return walk(node, selector, "previousSibling");
}

/**
 * 获取节点的父元素。
 * @param node 节点。
 * @param selector 用于筛选元素的 CSS 选择器。
 * @return 返回一个元素。如果元素不存在或不匹配指定的 CSS 选择器则返回 null。
 */
export function parent(node: Node, selector?: string) {
    return walk(node, selector, "parentNode");
}

function walk(node: Node | null, selector: string | undefined, nextProp: "nextSibling" | "previousSibling" | "parentNode", firstProp: typeof nextProp | "firstChild" | "lastChild" = nextProp) {
    for (node = node![firstProp]; node; node = node[nextProp]) {
        if (node.nodeType === 1 && (!selector || match(node as Element, selector))) {
            break;
        }
    }
    return node as HTMLElement | null;
}

/**
 * 从指定节点开始向父元素查找第一个匹配指定 CSS 选择器的元素。
 * @param node 节点。
 * @param selector 要匹配的 CSS 选择器。
 * @param context 如果提供了上下文则只在指定的元素范围内搜索，否则在整个文档查找。
 * @return 返回一个元素。如果找不到匹配的元素则返回 null。
 * @example closest(document.body, "body")
 */
export function closest(node: Node, selector: string, context?: Element | Document | null) {
    while (node && node !== context && (node.nodeType !== 1 || !match(node as Element, selector, context))) {
        node = node.parentNode!;
    }
    return node === context ? null : node as HTMLElement;
}

/**
 * 获取节点的所有直接子元素。
 * @param node 节点。
 * @param selector 用于筛选元素的 CSS 选择器。
 * @return 返回包含所有子元素的数组。
 */
export function children(node: Node, selector?: string) {
    const r: HTMLElement[] = [];
    for (node = node.firstChild!; node; node = node.nextSibling!) {
        if (node.nodeType === 1 && (!selector || match(node as Element, selector))) {
            r.push(node as HTMLElement);
        }
    }
    return r;
}

/**
 * 判断节点是否包含另一个节点。
 * @param node 节点。
 * @param child 要判断的子节点。
 * @return 如果 *child* 同 *node* 或 *child* 是 *node* 的子节点则返回 true，否则返回 false。
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
 * 获取节点在其父节点中的索引。
 * @param node 节点。
 * @return 返回从 0 开始的索引。计算时忽略元素以外的节点。如果没有父节点则返回 0。
 */
export function index(node: Node) {
    let r = 0;
    while ((node = node.previousSibling!)) {
        if (node.nodeType === 1) {
            r++;
        }
    }
    return r;
}

/**
 * 在节点末尾插入一段 HTML 或一个节点。
 * @param node 节点。
 * @param content 要插入的 HTML 或节点。
 * @return 返回插入的新节点。
 */
export function append(node: Node, content: string | Node | null) {
    return insert(node, content, false, false);
}

/**
 * 在节点开头插入一段 HTML 或一个节点。
 * @param node 节点。
 * @param content 要插入的 HTML 或节点。
 * @return 返回插入的新节点。
 */
export function prepend(node: Node, content: string | Node | null) {
    return insert(node, content, true, false);
}

/**
 * 在节点前插入一段 HTML 或一个节点。
 * @param node 节点。该节点必须具有父节点。
 * @param content 要插入的 HTML 或节点。
 * @return 返回插入的新节点。
 */
export function before(node: Node, content: string | Node | null) {
    return insert(node, content, true, true);
}

/**
 * 在节点后插入一段 HTML 或一个节点。
 * @param node 节点。该节点必须具有父节点。
 * @param content 要插入的 HTML 或节点。
 * @return 返回插入的新节点。
 */
export function after(node: Node, content: string | Node | null) {
    return insert(node, content, false, true);
}

function insert(node: Node, content: string | Node | null, prepend: boolean, sibling: boolean) {
    if (content == null) {
        return null;
    }
    if (typeof content !== "object") {
        content = parse(content, node.ownerDocument || node);
    }
    if (sibling) {
        return node.parentNode!.insertBefore(content, prepend ? node : node.nextSibling) as HTMLElement;
    }
    return prepend ? node.insertBefore(content, node.firstChild) as HTMLElement : node.appendChild(content) as HTMLElement;
}

/**
 * 从文档中移除节点。
 * @param node 要移除的节点。
 */
export function remove(node: Node | null) {
    node && node.parentNode && node.parentNode.removeChild(node);
}

/**
 * 复制节点。
 * @param node 要复制的节点。
 * @return 返回复制的新节点。
 */
export function clone<T extends Node>(node: T) {
    return node.cloneNode(true) as T;
}

/**
 * 获取元素的属性值。
 * @param elem 元素。
 * @param attrName 要获取的属性名（使用骆驼规则，如 `readOnly`）。
 * @return 返回属性值。如果属性不存在则返回 null。
 * @example getAttr(document.body, "class")
 */
export function getAttr(elem: Element, attrName: string | keyof Element) {
    return attrName in elem ? elem[attrName as keyof Element] as any : elem.getAttribute(attrName);
}

/**
 * 设置元素的属性值。
 * @param elem 元素。
 * @param attrName 要设置的属性名（使用骆驼规则，如 `readOnly`）。
 * @param value 要设置的属性值。设置为 null 表示删除属性。
 * @example setAttr(document.body, "class", "red")
 * @example setAttr(document.body, "class", null)
 */
export function setAttr(elem: Element, attrName: string | keyof Element, value: any) {
    if (attrName in elem && (typeof value !== "string" || !/^on./.test(attrName)) || value != null && typeof value !== "string") {
        if (value == null && typeof elem[attrName as keyof Element] === "string") {
            value = "";
        }
        (elem as any)[attrName] = value;
    } else if (value == null) {
        elem.removeAttribute(attrName);
    } else {
        elem.setAttribute(attrName, value);
    }
}

/**
 * 获取元素的文本内容。
 * @param elem 元素。
 * @return 返回文本内容。对于输入框则返回其输入值。
 * @example getText(document.body)
 */
export function getText(elem: Element) {
    return (elem as HTMLInputElement)[textProp(elem)]!;
}

/**
 * 设置元素的文本内容。
 * @param elem 元素。
 * @param value 要设置的文本内容。对于输入框则设置其输入值。
 * @example setText(document.body, "text")
 */
export function setText(elem: Element, value: string) {
    (elem as HTMLInputElement)[textProp(elem)] = value;
}

function textProp(elem: Element) {
    return /^(INPUT|SELECT|TEXTAREA)$/.test(elem.tagName) ? "value" : "textContent";
}

/**
 * 获取元素的内部 HTML。
 * @param elem 元素。
 * @return 返回内部 HTML。
 * @example getHtml(document.body)
 */
export function getHtml(elem: Element) {
    return elem.innerHTML;
}

/**
 * 设置元素的内部 HTML。
 * @param elem 元素。
 * @param value 要设置的内部 HTML。
 * @example setHtml(document.body, "html")
 */
export function setHtml(elem: Element, value: string) {
    elem.innerHTML = value;
}

/**
 * 判断元素是否已添加指定的 CSS 类名。
 * @param elem 元素。
 * @param className 要判断的 CSS 类名（只能有一个）。
 * @return 如果已添加则返回 true，否则返回 false。
 */
export function hasClass(elem: Element, className: string) {
    return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
}

/**
 * 添加元素的 CSS 类名。
 * @param elem 元素。
 * @param className 要添加的 CSS 类名（只能有一个）。
 * @example addClass(document.body, "light")
 */
export function addClass(elem: Element, className: string) {
    toggleClass(elem, className, true);
}

/**
 * 删除元素的 CSS 类名。
 * @param elem 元素。
 * @param className 要删除的 CSS 类名（只能有一个）。
 * @example removeClass(document.body, "light")
 */
export function removeClass(elem: Element, className: string) {
    toggleClass(elem, className, false);
}

/**
 * 如果存在（不存在）则删除（添加）元素的 CSS 类名。
 * @param elem 元素。
 * @param className 要添加或删除的 CSS 类名（只能有一个）。
 * @param value 如果为 true 则强制添加 CSS 类名，如果为 false 则强制删除 CSS 类名。
 * @example toggleClass(document.body, "light")
 */
export function toggleClass(elem: Element, className: string, value?: boolean) {
    if (hasClass(elem, className)) {
        if (!value) {
            elem.className = (" " + elem.className + " ").replace(" " + className + " ", " ").trim();
        }
    } else if (value === undefined || value) {
        elem.className = elem.className ? elem.className + " " + className : className;
    }
}

/**
 * 为指定的 CSS 属性添加当前浏览器特定的后缀（如 "webkit-")。
 * @param propName CSS 属性名。
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
 * 获取元素的实际 CSS 属性值。
 * @param elem 元素。
 * @param propName 要获取的 CSS 属性名（使用骆驼规则，如 "fontSize"）。
 * @return 返回计算后的 CSS 属性值。
 * @example getStyle(document.body, "fontSize")
 */
export function getStyle(elem: Element, propName: string) {
    return elem.ownerDocument.defaultView.getComputedStyle(elem)[vendor(propName) as any];
}

/**
 * 设置元素的 CSS 属性值。
 * @param elem 元素。
 * @param propName 要设置的 CSS 属性名（使用骆驼规则，如 "fontSize"）。
 * @param value 要设置的 CSS 属性值。如果是数字则自动追加像素单位。
 * @example setStyle(document.body, "fontSize")
 */
export function setStyle(elem: HTMLElement, propName: string, value: string | number) {
    elem.style[vendor(propName) as any] = value && typeof value === "number" && !/^(?:columnCount|fillOpacity|flexGrow|flexShrink|fontWeight|lineHeight|opacity|order|orphans|widows|zIndex|zoom)$/.test(propName) ? value + "px" : value as any;
}

/**
 * 计算一个元素的样式值。
 * @param elem 要计算的元素。
 * @param propNames 要计算的 CSS 属性名（使用骆驼规则，如 `fontSize`）列表。
 * @return 返回所有 CSS 属性值的和。
 * @example computeStyle(document.body, "fontSize", "lineHeight")
 */
export function computeStyle(elem: Element, ...propNames: string[]) {
    let r = 0;
    const computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem);
    for (const prop of propNames) {
        r += parseFloat(computedStyle[prop as any]) || 0;
    }
    return r;
}

/**
 * 表示一个坐标。
 */
export interface Point {

    /**
     * 相对于屏幕左上角的水平距离（单位为像素）。
     */
    x: number;

    /**
     * 相对于屏幕左上角的垂直距离（单位为像素）。
     */
    y: number;

}

/**
 * 表示一个大小。
 */
export interface Size {

    /**
     * 宽度（单位为像素）。
     */
    width: number;

    /**
     * 高度（单位为像素）。
     */
    height: number;

}

/**
 * 表示一个矩形区域。
 */
export interface Rect extends Point, Size { }

/**
 * 获取元素的滚动距离。
 * @param elem 元素或文档。
 * @return 返回坐标。如果元素不可滚动则返回原点。
 * @example getScroll(document.body)
 */
export function getScroll(elem: Element | Document) {
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
        x: (elem as Element).scrollLeft,
        y: (elem as Element).scrollTop
    } as Point;
}

/**
 * 设置元素的滚动距离。
 * @param elem 元素或文档。
 * @param value 要设置的坐标。允许只设置部分属性。
 * @example setScroll(document.body, { x: 100, y: 500 });
 */
export function setScroll(elem: Element | Document, value: Partial<Point>) {
    if (elem.nodeType === 9) {
        (elem as Document).defaultView.scrollTo(
            (value.x == null ? getScroll(elem) : value).x,
            (value.y == null ? getScroll(elem) : value).y
        );
    } else {
        if (value.x != null) (elem as Element).scrollLeft = value.x;
        if (value.y != null) (elem as Element).scrollTop = value.y;
    }
}

/**
 * 获取元素和其定位父元素的偏移距离。
 * @param elem 元素。
 * @return 返回坐标。如果元素未设置定位信息则返回原点。
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
 * 设置元素和其定位父元素的偏移距离。
 * @param elem 元素。
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
 * 获取元素的定位父元素。
 * @param elem 元素。
 * @return 返回定位父元素。
 * @example offsetParent(document.body)
 */
export function offsetParent(elem: HTMLElement) {
    let r = elem;
    while ((r = r.offsetParent as HTMLElement) && r.nodeName !== "HTML" && getStyle(r, "position") === "static");
    return r || elem.ownerDocument.documentElement;
}

/**
 * 获取元素的区域。
 * @param elem 元素或文档。
 * @return 返回元素实际占用区域（含内边距和边框、不含外边距）。如果元素不可见则返回空区域。
 * @example getRect(document.body)
 */
export function getRect(elem: Element | Document) {
    const doc = elem.ownerDocument || elem;
    const html = doc.documentElement;
    const r = getScroll(doc) as Rect;
    if (elem.nodeType === 9) {
        r.width = Math.min(html.clientWidth, document.body.clientWidth);
        r.height = Math.min(html.clientHeight, document.body.clientHeight);
    } else {
        const rect = (elem as Element).getBoundingClientRect();
        r.x += rect.left - html.clientLeft;
        r.y += rect.top - html.clientTop;
        r.width = rect.width;
        r.height = rect.height;
    }
    return r;
}

/**
 * 设置元素的区域。
 * @param elem 元素。
 * @param value 要设置的区域内容（含内边距和边框、不含外边距）。允许只设置部分属性。
 * @example setRect(document.body, {width: 200, height: 400})
 */
export function setRect(elem: HTMLElement, value: Partial<Rect>) {
    const style = elem.style;
    if (value.x != null || value.y != null) {
        movable(elem);
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

/**
 * 确保指定的元素可移动。
 * @param elem 元素。
 */
export function movable(elem: HTMLElement) {
    if (!/^(?:abs|fix)/.test(getStyle(elem, "position"))) {
        elem.style.position = "relative";
    }
}

interface EventFix {

    /**
     * 实际绑定的事件。
     */
    bind?: string;

    /**
     * 委托时实际绑定的事件。
     */
    delegate?: string;

    /**
     * 实际绑定的事件触发后筛选是否触发当前事件的过滤器。
     */
    filter?: (this: EventFix, e: Event, elem: Element | Document) => boolean | void;

    /**
     * 自定义绑定事件的函数。
     */
    add?: (this: EventFix, elem: Element | Document, eventHandler: EventListener, eventOptions: AddEventListenerOptions | boolean) => void;

    /**
     * 自定义解绑事件的函数。
     */
    remove?: (this: EventFix, elem: Element | Document, eventHandler: EventListener, eventOptions: AddEventListenerOptions | boolean) => void;

}
var eventFix: { [event: string]: EventFix };
var defaultEventOptions: false | AddEventListenerOptions = false;

/**
 * 绑定事件。
 * @param elem 元素或文档。
 * @param eventName 要绑定的事件名。
 * @param selector 要委托的目标元素的 CSS 选择器。
 * @param eventHandler 要绑定的事件处理函数。
 * @param thisArg 执行事件处理函数时 this 的值。
 * @param eventOptions 事件附加选项。
 * @example on(document.body, "mouseenter", "a", function(e){ this.firstChild.innerHTML = e.pageX; })
 */
export function on(elem: Element | Document | Window, eventName: string, selector: string, eventHandler: (e: Event, sender: HTMLElement) => void, thisArg?: any, eventOptions?: AddEventListenerOptions): void;

/**
 * 绑定事件。
 * @param elem 元素或文档。
 * @param eventName 要绑定的事件名。
 * @param eventHandler 要绑定的事件处理函数。
 * @param thisArg 执行事件处理函数时 this 的值。
 * @param eventOptions 事件附加选项。
 * @example on(document.body, "click", e => { alert("点击事件") })
 */
export function on(elem: Element | Document | Window, eventName: string, eventHandler: (e: Event, sender: any) => void, thisArg?: any, eventOptions?: AddEventListenerOptions): void;

export function on(elem: Element | Document, eventName: string, selector: string | typeof eventHandler, eventHandler?: ((e: Event, sender?: any) => void) | typeof thisArg, thisArg?: any, eventOptions?: any) {
    if (!eventFix) {
        // 检测是否支持 {passive: true}。
        const opt = {
            get passive() {
                defaultEventOptions = { passive: false };
                return true;
            }
        } as any;
        document.addEventListener("__passive__", null!, opt);
        document.removeEventListener("__passive__", null!, opt);

        const isEnterOrLeave = (e: MouseEvent, sender: Element | Document) => e.type.length === 12 || e.type.length === 10 && e.type.charCodeAt(0) === 109 /*m*/ || !contains(sender, e.relatedTarget as Node);
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
            pointerleave: { delegate: "pointerout", filter: isEnterOrLeave }
        };

        if ((window as any).mozInnerScreenX !== undefined) {
            // FF 51-：不支持 focusin/focusout 事件。
            const focusAdd: EventFix["add"] = function (elem, eventHandler) {
                elem.addEventListener(this.bind!, eventHandler, true);
            };
            const focusRemove: EventFix["remove"] = function (elem, eventHandler) {
                elem.removeEventListener(this.bind!, eventHandler, true);
            };
            eventFix.focusin = {
                bind: "focus",
                add: focusAdd,
                remove: focusRemove
            };
            eventFix.focusout = {
                bind: "blur",
                add: focusAdd,
                remove: focusRemove
            };

            // FF：右击也会触发 click 事件。
            eventFix.click = {
                filter: (e: MouseEvent) => !e.button
            };
        }

        const html = Document.prototype;

        // FF：不支持 mousewheel 事件。
        if (!("onmousewheel" in html)) {
            eventFix.mousewheel = {
                bind: "DOMMouseScroll",
                filter(e: MouseWheelEvent) {
                    // 统一使用 wheelDelta 获取滚轮距离。
                    (e as any).wheelDelta = -(e.detail || 0) / 3;
                }
            };
        }

        // FF、CH 30-：不支持 mouseenter/mouseleave 事件。
        if (!("onmouseenter" in html)) {
            eventFix.mouseenter.bind = "mouseover";
            eventFix.mouseleave.bind = "mouseout";
        }

        // 低版本浏览器：不支持 auxclick 事件。
        if (!("onauxclick" in html)) {
            eventFix.auxclick = {
                bind: "mouseup",
                filter: (e: MouseEvent) => e.button === 2
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

        // 触屏：适配鼠标事件。
        if ((window as any).TouchEvent) {

            // 将触摸事件模拟成鼠标事件。
            Object.defineProperty(TouchEvent.prototype, "button", {
                value: 1,
                configurable: true,
                enumerable: true
            });
            for (const prop of ["pageX", "pageY", "clientX", "clientY", "screenX", "screenY"]) {
                Object.defineProperty(TouchEvent.prototype, prop, {
                    get(this: TouchEvent) {
                        return (this.changedTouches[0] as any)[prop];
                    },
                    configurable: true,
                    enumerable: true
                });
            }

            eventFix.click = {
                add(elem, eventHandler) {
                    let state: any = 0;
                    elem.addEventListener("touchstart", (eventHandler as any).__touchStart__ = (e: TouchEvent) => {
                        if (e.changedTouches.length === 1) {
                            state = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
                        }
                    }, false);
                    elem.addEventListener("touchend", (eventHandler as any).__touchEnd__ = (e: TouchEvent) => {
                        if (state && e.changedTouches.length === 1 && Math.pow(e.changedTouches[0].pageX - state[0], 2) + Math.pow(e.changedTouches[0].pageY - state[1], 2) < 25) {
                            state = 1;
                            eventHandler.call(elem, e);
                        }
                    }, false);
                    elem.addEventListener("click", (eventHandler as any).__click__ = (e: MouseEvent) => {
                        const trigger = state !== 1;
                        state = 0;
                        trigger && eventHandler.call(elem, e);
                    }, false);
                },
                remove(elem, eventHandler) {
                    elem.removeEventListener("touchstart", (eventHandler as any).__touchStart__, false);
                    elem.removeEventListener("touchend", (eventHandler as any).__touchEnd__, false);
                    elem.removeEventListener("click", (eventHandler as any).__click__, false);
                }
            };

            const pointerAdd: EventFix["add"] = function (elem, eventHandler, eventOptions: any) {
                let state = 0;
                elem.addEventListener((this as any).touch, (eventHandler as any).__touch__ = function (e: MouseEvent) {
                    state = 1;
                    eventHandler.call(this, e);
                }, eventOptions);
                elem.addEventListener(this.bind!, (eventHandler as any).__mouse__ = function (e: MouseEvent) {
                    if (state) {
                        state = 0;
                    } else {
                        eventHandler.call(this, e);
                    }
                }, eventOptions);
            };
            const pointerRemove: EventFix["remove"] = function (elem, eventHandler, eventOptions: any) {
                elem.removeEventListener((this as any).touch, (eventHandler as any).__touch__, eventOptions);
                elem.removeEventListener(this.bind!, (eventHandler as any).__mouse__, eventOptions);
            };
            // CH: 虽然 Chrome 支持 pointer 事件，但如果调用了 e.preventDefault() 会导致 pointermove 无法触发。
            eventFix.pointerdown = {
                bind: "mousedown",
                touch: "touchstart",
                add: pointerAdd,
                remove: pointerRemove
            } as any;
            // CH: 虽然 Chrome 支持 pointer 事件，但不支持 e.preventDefault()，改用 touch+mouse。
            eventFix.pointermove = {
                bind: "mousemove",
                touch: "touchmove",
                add: pointerAdd,
                remove: pointerRemove
            } as any;
            eventFix.pointerup = {
                bind: "mouseup",
                touch: "touchend",
                add(elem: Element | Document, eventHandler: EventListener, eventOptions: any) {
                    pointerAdd.call(this, elem, eventHandler, eventOptions);
                    elem.addEventListener("touchcancel", (eventHandler as any).__touch__, eventOptions);
                },
                remove(elem: Element | Document, eventHandler: EventListener, eventOptions: any) {
                    pointerRemove.call(this, elem, eventHandler, eventOptions);
                    elem.removeEventListener("touchcancel", (eventHandler as any).__touch__, eventOptions);
                }
            } as any;
        }
    }

    if (typeof selector !== "string") {
        eventOptions = thisArg;
        thisArg = eventHandler;
        eventHandler = selector;
        selector = "";
    }
    thisArg = thisArg || elem;
    if (!eventOptions || !defaultEventOptions) {
        eventOptions = defaultEventOptions;
    }

    const events = (elem as any).__events__ || ((elem as any).__events__ = { __proto__: null! });
    const key = selector ? eventName + " " + selector : eventName;
    const eventHandlers = events[key];

    const originalFix = eventFix[eventName] || 0;
    const fix = selector && originalFix.delegate ? eventFix[eventName = originalFix.delegate] || 0 : originalFix;

    // 如果满足以下任一情况，需要重新封装监听器。
    // 1. 事件委托，需要重新定位目标元素。
    // 2. 事件有特殊过滤器，仅在满足条件时触发。
    // 3. 需要重写回调函数中的 this。
    // 4. 监听器具有第二参数，需要重写回调函数的第二参数。
    // 5. 监听器已添加函数，需要重新封装才能绑定成功。
    if (selector || thisArg !== elem || fix.filter || eventHandler.length > 1 || eventHandlers && indexOfHandler(eventHandlers, eventHandler, thisArg) >= 0) {
        const originalHandler = eventHandler;
        eventHandler = selector ? (e: Event) => {
            const sender = closest(e.target as Node, selector, elem);
            if (!sender) {
                return;
            }
            if (originalFix !== fix && originalFix.filter && originalFix.filter(e, sender) === false) {
                return;
            }
            if (fix.filter && fix.filter(e, sender) === false) {
                return;
            }
            originalHandler.call(thisArg, e, sender);
        } : (e: Event) => {
            if (fix.filter && fix.filter(e, elem) === false) {
                return;
            }
            originalHandler.call(thisArg, e, thisArg);
        };
        eventHandler.__original__ = originalHandler;
        eventHandler.__this__ = thisArg;
    }

    // 保存监听器以便之后解绑或手动触发事件。
    if (!eventHandlers) {
        events[key] = eventHandler;
    } else if (Array.isArray(eventHandlers)) {
        eventHandlers.push(eventHandler);
    } else {
        events[key] = [eventHandlers, eventHandler];
    }

    // 底层绑定事件。
    if (fix.add) {
        fix.add(elem, eventHandler, eventOptions);
    } else {
        elem.addEventListener(fix.bind || eventName, eventHandler, eventOptions);
    }
}

/**
 * 解绑事件。
 * @param elem 元素或文档。
 * @param eventName 要解绑的事件名。
 * @param selector 要委托的目标元素的 CSS 选择器。
 * @param eventHandler 要解绑的事件处理函数。如果未提供则解绑所有监听器。
 * @param thisArg 执行事件处理函数时 this 的值。
 * @param eventOptions 事件附加选项。
 * @example off(document.body, "mouseenter", "a", function(e) { this.firstChild.innerHTML = e.pageX; })
 */
export function off(elem: Element | Document, eventName: string, selector: string, eventHandler?: (e: Event, sender: HTMLElement) => void, thisArg?: any, eventOptions?: AddEventListenerOptions): void;

/**
 * 解绑事件。
 * @param elem 元素或文档。
 * @param eventName 要解绑的事件名。
 * @param eventHandler 要解绑的事件处理函数。如果未提供则解绑所有监听器。
 * @param thisArg 执行事件处理函数时 this 的值。
 * @param eventOptions 事件附加选项。
 * @example off(document.body, "click", e => { alert("点击事件") })
 */
export function off(elem: Element | Document, eventName: string, eventHandler?: (e: Event, sender: any) => void, thisArg?: any, eventOptions?: AddEventListenerOptions): void;

export function off(elem: Element | Document, eventName: string, selector?: string | typeof eventHandler, eventHandler?: (e: Event, sender: any) => void, thisArg?: any, eventOptions?: any) {
    if (typeof selector !== "string") {
        eventOptions = thisArg;
        thisArg = eventHandler;
        eventHandler = selector;
        selector = "";
    }
    thisArg = thisArg || elem;
    if (!eventOptions || !defaultEventOptions) {
        eventOptions = defaultEventOptions;
    }

    const events = (elem as any).__events__;
    const key = selector ? eventName + " " + selector : eventName;
    const eventHandlers = events && events[key];
    if (!eventHandlers) {
        return;
    }

    if (eventHandler) {
        // 更新事件列表。
        const index = indexOfHandler(eventHandlers, eventHandler, thisArg);
        if (~index) {
            if (Array.isArray(eventHandlers)) {
                eventHandler = eventHandlers[index];
                eventHandlers.splice(index, 1);
                if (!eventHandlers.length) {
                    delete events[key];
                }
            } else {
                eventHandler = eventHandlers;
                delete events[key];
            }
        }

        // 底层解绑事件。
        const fix = eventFix && eventFix[eventName] || 0;
        if (fix.remove) {
            fix.remove(elem, eventHandler as EventListener, eventOptions);
        } else {
            elem.removeEventListener((selector ? fix.delegate : fix.bind) || eventName, eventHandler as EventListener, eventOptions);
        }
    } else if (Array.isArray(eventHandlers)) {
        for (eventHandler of eventHandlers) {
            off(elem, eventName, selector, eventHandler, thisArg);
        }
    } else {
        off(elem, eventName, selector, eventHandlers, thisArg);
    }
}

function indexOfHandler(eventHandlers: typeof eventHandler[] | typeof eventHandler | undefined, eventHandler: (e: Event, sender: Element | Document) => void, thisArg: any) {
    if (Array.isArray(eventHandlers)) {
        for (let i = 0; i < eventHandlers.length; i++) {
            if (eventHandlers[i] === eventHandler || (eventHandlers[i] as any).__original__ === eventHandler && (eventHandlers[i] as any).__this__ === thisArg) {
                return i;
            }
        }
        return -1;
    }
    return eventHandlers === eventHandler || (eventHandlers as any).__original__ === eventHandler && (eventHandlers as any).__this__ === thisArg ? 0 : -1;
}

/**
 * 触发事件。执行已绑定的所有事件处理函数。
 * @param elem 元素或文档。
 * @param eventName 要触发的事件名。
 * @param selector 要委托的目标元素的 CSS 选择器。
 * @param event 传递给监听器的事件参数。
 * @example trigger(document.body, "click")
 */
export function trigger(elem: Element | Document, eventName: string, selector: string, event?: Partial<Event>): void;

/**
 * 触发事件。执行已绑定的所有事件处理函数。
 * @param elem 元素或文档。
 * @param eventName 要触发的事件名。
 * @param event 传递给监听器的事件参数。
 * @example trigger(document.body, "click")
 */
export function trigger(elem: Element | Document, eventName: string, event?: Partial<Event>): void;

export function trigger(elem: Element | Document, eventName: string, selector: string | typeof event, event?: Partial<Event>) {
    if (typeof selector !== "string") {
        event = selector;
        selector = "";
    }
    const eventHandlers = (elem as any).__events__ && (elem as any).__events__[selector ? eventName + " " + selector : eventName];
    if (!eventHandlers) {
        return;
    }

    event = event || {};
    if (!event.type) (event as any).type = eventName;
    if (!event.target) (event as any).target = selector ? find(elem, selector) : elem;
    if (Array.isArray(eventHandlers)) {
        for (const eventHandler of eventHandlers.slice(0)) {
            eventHandler.call(elem, event);
        }
    } else {
        eventHandlers.call(elem, event);
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
     * 当前浏览器实际使用的 transition 属性名。
     */
    transition: string,

    /**
     * 当前浏览器实际使用的 transitionEnd 事件名。
     */
    transitionEnd: string

};

/**
 * 执行一个自定义渐变。
 * @param elem 元素。
 * @param propNames 要渐变的 CSS 属性名和最终的属性值组成的键值对。
 * @param callback 渐变执行结束的回调函数。
 * @param duration 渐变执行的总毫秒数。
 * @param timingFunction 渐变函数。可以使用 CSS3 预设的特效渐变函数。
 * @example animate(document.body, { height: 400 });
 */
export function animate(elem: HTMLElement, propNames: { [propName: string]: string | number }, callback?: () => void, duration = 200, timingFunction = "ease") {
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
        const updateTransition = () => {
            let transition = "";
            for (const key in context) {
                if (transition) transition += ",";
                transition += `${key.replace(/[A-Z]|^ms|^webkit/g, word => "-" + word.toLowerCase())} ${duration}ms ${timingFunction}`;
            }
            elem.style[animateFix.transition as any] = transition;
        };
        const transitionEnd = (e: Event) => {
            // 忽略冒泡导致的调用。
            if (timer && (!e || e.target === e.currentTarget)) {
                clearTimeout(timer);
                timer = 0;
                elem.removeEventListener(animateFix.transitionEnd, transitionEnd, false);

                // 如果新的渐变覆盖了当前渐变的所有属性，则不触发本次渐变的回调函数。
                let contextUpdated = false;
                for (const key in context) {
                    if (context[key] === transitionEnd) {
                        delete context[key];
                        contextUpdated = true;
                    }
                }

                if (contextUpdated) {
                    updateTransition();
                    callback && callback();
                }
            }
        };

        // 设置所有属性为起始值。
        for (let propName in propNames) {
            propName = vendor(propName);
            context[propName] = transitionEnd;
            if (!elem.style[propName as any]) {
                elem.style[propName as any] = getStyle(elem, propName);
            }
        }

        // 触发重新布局以保证效果可以触发。
        elem.offsetWidth && elem.clientLeft;

        // 设置要渐变的属性。
        updateTransition();

        // 绑定渐变完成事件。
        elem.addEventListener(animateFix.transitionEnd, transitionEnd, false);
        let timer = setTimeout(transitionEnd, duration) as any;
    } else {
        callback && setTimeout(callback, duration);
    }

    // 设置属性为最终值，触发动画。
    for (const propName in propNames) {
        setStyle(elem, propName, propNames[propName]);
    }
}

/**
 * 判断指定的元素是否被隐藏。
 * @param elem 元素。
 * @return 如果元素本身被隐藏或正在被隐藏则返回 true，否则返回 false。
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
 * 存储内置切换动画。
 */
var toggleAnimations: { [animation: string]: { [propName: string]: string | number } };

/**
 * 表示一个切换动画。
 */
export type ToggleAnimation = "opacity" | "height" | "width" | "top" | "bottom" | "left" | "right" | "scale" | "scaleX" | "scaleY" | "slideDown" | "slideRight" | "slideUp" | "slideLeft" | "zoomIn" | "zoomOut" | "rotate" | typeof toggleAnimations[""];

/**
 * 显示元素。
 * @param elem 元素。
 * @param animation 显示时使用的动画。
 * @param callback 动画执行完成后的回调。
 * @param duration 动画执行的总毫秒数。
 * @param timingFunction 渐变函数。可以使用 CSS3 预设的特效渐变函数。
 * @param target 动画的目标元素。
 */
export function show(elem: HTMLElement, animation?: ToggleAnimation, callback?: (value: boolean) => void, duration?: number, timingFunction?: string, target?: Element) {
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
 * 隐藏元素。
 * @param elem 元素。
 * @param animation 显示时使用的动画。
 * @param callback 动画执行完成后的回调。
 * @param duration 动画执行的总毫秒数。
 * @param timingFunction 渐变函数。可以使用 CSS3 预设的特效渐变函数。
 * @param target 动画的目标元素。
 */
export function hide(elem: HTMLElement, animation?: ToggleAnimation, callback?: (value: boolean) => void, duration?: number, timingFunction?: string, target?: Element) {
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
 * 切换显示或隐藏元素。
 * @param elem 元素。
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
export function toggle(elem: HTMLElement, animation?: ToggleAnimation, callback?: (value: boolean) => void, duration?: number, timingFunction?: string, target?: Element): void;

/**
 * 切换显示或隐藏元素。
 * @param elem 元素。
 * @param value 如果为 true 则强制显示元素；如果为 false 则强制隐藏元素。
 * @param animation 显示或隐藏时使用的动画。
 * @param callback 动画执行完成后的回调。
 * @param duration 动画执行的总毫秒数。
 * @param timingFunction 渐变函数。可以使用 CSS3 预设的特效渐变函数。
 * @param target 动画的目标元素。
 */
export function toggle(elem: HTMLElement, value: boolean, animation?: ToggleAnimation, callback?: (value: boolean) => void, duration?: number, timingFunction?: string, target?: Element): void;

export function toggle(elem: HTMLElement, value?: boolean | typeof animation, animation?: ToggleAnimation | typeof callback, callback?: ((value: boolean) => void) | typeof duration, duration?: number | typeof timingFunction, timingFunction?: string | typeof target, target?: Element) {
    if (typeof value !== "boolean") {
        target = timingFunction as typeof target;
        timingFunction = duration as string;
        duration = callback as number;
        callback = animation as (this: Element, value: boolean) => void;
        animation = value as ToggleAnimation;
        value = undefined;
    }
    if (value === undefined) {
        value = isHidden(elem);
    }
    if (typeof animation === "string") {
        animation = (toggleAnimations || (toggleAnimations = {
            opacity: { opacity: 0 },
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
            slideUp: { opacity: 0, transform: "translateY(10%)" },
            slideLeft: { opacity: 0, transform: "translateX(10%)" },
            slideDown: { opacity: 0, transform: "translateY(-10%)" },
            slideRight: { opacity: 0, transform: "translateX(-10%)" },
            zoomOut: { opacity: 0, transform: "scale(0, 0)" },
            zoomIn: { opacity: 0, transform: "scale(1.2, 1.2)" },
            rotate: { opacity: 0, transform: "rotate(-180deg)" }
        }))[animation];
    }
    if (animation && duration !== 0) {

        // 优先显示元素以便后续计算。
        if (value) {
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
        // 如果需要隐藏元素，则 animation 表示最终属性。
        // 如果需要显示元素，则需要手动计算最终属性。
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
            callback && (callback as Function)(value);
        }, duration as number, timingFunction as string);

    } else {
        value ? show(elem) : hide(elem);
        callback && (callback as Function)(value);
    }
}

/**
 * 确保在文档加载完成后再执行指定的函数。
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
