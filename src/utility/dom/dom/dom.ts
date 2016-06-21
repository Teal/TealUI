/**
 * @fileOverview 提供处理 DOM 的工具函数
 * @author xuld@vip.qq.com
 */

/**
 * 表示一个类 DOM 节点。
 */
export type NodeLike = { nodeType: number } | Window;

/**
 * 表示一个类 DOM 节点列表。
 */
export type NodeArrayLike = NodeLike | ArrayLike<NodeLike>;

/**
 * 表示一个 DOM 节点列表。
 */
export class Dom {

    // #region 列表

    /**
     * 获取当前节点列表的长度。
     * @example $("#elem").length
     */
    length = 0;

    /**
     * 获取或设置指定位置的节点。
     * @param index 要处理的位置。
     * @returns 返回对应的节点。
     */
    [index: number]: NodeLike;

    /**
     * 如果当前节点列表为空则返回 @null，否则返回当前节点列表。
     * @example $().valueOf()
     */
    valueOf() { return this.length ? this : null; }

    /**
     * 初始化新的 DOM 节点列表。
     * @param items 初始化的 DOM 节点或 DOM 节点列表。
     */
    constructor(items?: NodeLike) {
        if (items) {
            if ((items as Node).nodeType || (items as Window).document) {
                this[this.length++] = items as Node | Window;
            } else {
                for (let i = 0, node; (node = items[i]); i++) {
                    this[this.length++] = node;
                }
            }
        }
    }

    /**
     * 向当前节点列表添加一个或多个 DOM 节点。
     * @param items 要添加的 DOM 节点或 DOM 节点集合。
     * @example $("#elem").add(document.body)
     */
    add(items?: NodeLike) {
        items && this.constructor.call(this, items);
        return this;
    }

    /**
     * 遍历当前节点列表，并对每一项执行函数 @callback。
     * @param callback 对每一项执行的函数。函数的参数依次为:
     * * @param {Node} value 当前项的值。
     * * @param {Number} index 当前项的索引。
     * * @param {Dom} dom 当前正在遍历的节点列表。
     * * @returns {Boolean} 如果返回 @false，则终止循环。
     * @param scope 定义 @fn 执行时 @this 的值。
     * @example $("#elem").each(function(elem){ console.log(elem); })
     */
    each(callback: (node: Node, index: number, dom: Dom) => boolean | void, scope?) {
        for (let i = 0, node; (node = this[i]) && callback.call(scope, node, i, this) !== false; i++);
        return this;
    }

    /**
     * 对当前节点列表每一项进行处理，并将结果组成一个新数组。
     * @param callback 对每一项运行的函数。函数的参数依次为:
     * * @param {Node} value 当前项的值。
     * * @param {Number} index 当前项的索引。
     * * @param {Dom} dom 当前正在遍历的节点列表。
     * * @returns {mixed} 返回一个或多个节点，这些节点将被添加到返回的列表。
     * @param scope 定义 @fn 执行时 @this 的值。
     * @returns 返回一个新节点列表。
     * @example $("#elem").map(function(node){return node.firstChild})
     */
    map(callback: (node: Node, index: number, dom: Dom) => NodeLike, scope?) {
        let result = new Dom();
        for (let i = 0, node; (node = this[i]); i++) {
            result.add(callback.call(scope, node, i, this));
        }
        return result;
    }

    /**
     * 将当前节点列表中符合要求的项组成一个新节点列表。
     * @param selector 过滤使用的 CSS 选择器或用于判断每一项是否符合要求的函数。函数的参数依次为:
     * * @param {Object} value 当前项的值。
     * * @param {Number} index 当前项的索引。
     * * @param {Array} array 当前正在遍历的数组。
     * * @returns {Boolean} 返回 @true 说明当前元素符合条件，否则不符合。
     * @param scope 定义 @fn 执行时 @this 的值。
     * @returns 返回一个新节点列表。如果过滤条件为空则返回 @this。
     * @example $("#elem").filter('div')
     */
    filter(selector: ((node: Node, index: number, dom: Dom) => boolean) | string, scope?, not?: boolean) {
        return selector ? this.map((node, index) => {
            return (typeof selector === "function" ? !!selector.call(scope, node, index, this) : Dom.matches(node, selector as string)) !== !!not && node;
        }) : this;
    }

    /**
     * 将当前节点列表中不符合要求的项组成一个新列表。
     * @param selector 过滤使用的 CSS 选择器或用于判断每一项是否符合要求的函数。函数的参数依次为:
     * * @param {Object} value 当前项的值。
     * * @param {Number} index 当前项的索引。
     * * @param {Array} array 当前正在遍历的数组。
     * * @returns {Boolean} 返回 @true 说明当前元素符合条件，否则不符合。
     * @param scope 定义 @fn 执行时 @this 的值。
     * @returns 返回一个新列表，或者如果过滤条件为空则返回 @this。
     * @example $("#elem").not('div')
     */
    not(selector: ((node: Node, index: number, dom: Dom) => boolean) | string, scope?) {
        return this.filter(selector, scope, true);
    }

    /**
     * 向当前列表添加项。
     * @param items 要添加的项。
     */
    push: (...items: Node[]) => number;

    /**
     * 获取指定项的索引。
     * @param searchElements 要搜索的项。
     * @param startIndex 开始搜索的索引。
     * @param length 搜索的元素数。
     */
    indexOf: (searchElement: any, startIndex?: number, length?: number) => number;

    /**
     * 复制当前元素的子列表。
     * @param startIndex 开始复制的索引。
     * @param endIndex 结束复制的索引。
     */
    slice: (startIndex?: number, endIndex?: number) => Node[];

    /**
     * 删除和插入当前列表指定区间的项。
     * @param startIndex 开始操作的索引。
     * @param deleteCount 删除的项数。
     * @param items 要插入的项。
     */
    splice: (startIndex: number, deleteCount: number, ...items: Node[]) => Node[];

    // #endregion

    // #region DOM 核心

    /**
     * 使用指定的节点初始化新的节点列表。
     * @param items 初始化的 DOM 节点或 DOM 节点列表。
     * @returns 返回节点列表。
     * @example $(document)
     */
    static $(items?: NodeLike): Dom;

    /**
     * 查询 CSS 选择器匹配的所有节点。
     * @param selector 要执行的 CSS 选择器。
     * @param context 执行的上下文文档。
     * @returns 返回匹配的节点列表。
     * @example $(".doc-box")
     */
    static $(selector: string, context?: Element): Dom;

    /**
     * 解析一个 HTML 字符串生成对应的节点。
     * @param html 要解析 HTML 字符串。
     * @param context 执行的上下文文档。
     * @returns 返回创建的节点列表。
     * @example $("&lt;a>你好&lt;/a>")
     */
    static $(html: string, context?: Node): Dom;

    /**
     * 绑定一个 DOM Ready 回调。
     * @param ready 要执行的 DOM Ready 回调。
     * @param context 执行的上下文文档。
     * @example
     * $(function(){ alert("DOM ready") })
     */
    static $(ready: () => void, context?: Document): void;

    /**
     * 查询 CSS 选择器匹配的所有节点；解析一个 HTML 字符串生成对应的节点；绑定一个 DOM Ready 回调。
     * @param selector 要执行的 CSS 选择器或 HTML 字符串或 DOM Ready 回调。
     * @param context 执行的上下文文档。
     * @returns 返回匹配的节点列表或创建的节点列表或空。
     * @example
     * $(".doc-box")
     * 
     * $("&lt;a>你好&lt;/a>")
     * 
     * $(function(){ alert("DOM ready") })
     */
    static $(selector?: NodeLike | string | (() => void), context?: Node | Element | Document) {
        return typeof selector === "string" ?
            /^</.test(selector = selector.trim()) ?
                Dom.parse(selector, context) :
                Dom.find(selector, context as Element) :
            typeof selector === "function" ?
                Dom.ready(selector as () => void, context as Document) as any :
                selector instanceof Dom ?
                    selector :
                    new Dom(selector as NodeLike);
    }

    /**
     * 绑定一个 DOM Ready 回调。
     * @param callback 要执行的 DOM Ready 回调。
     * @param context 执行的上下文文档。
     */
    static ready(callback: () => void, context?: Document) {
        context = context || document;
        if (/complete|loaded|interactive/.test(context.readyState) && context.body) {
            callback.call(context);
        } else {
            /*@cc_on if(!+"\v1") return setTimeout(function() { Dom.ready(callback, context); }, 14); @*/
            context.addEventListener('DOMContentLoaded', callback, false);
        }
    }

    /**
     * 存储特殊标签的创建方式。
     */
    private static _parseFix: { [tagName: string]: [number, string, string] };

    /**
     * 存储当前文档的节点创建容器。
     */
    private static _parseContainer: HTMLDivElement;

    /**
     * 解析一个 HTML 片段并生成节点。
     * @param html 要解析的 HTML 字符串。
     * @param context 解析所在的节点。
     * @returns 返回生成的节点列表。
     */
    static parse(html: string | NodeLike, context?: Node) {
        if (typeof html === "string") {

            // 首次解析。
            let parseFix = Dom._parseFix as any;
            if (!parseFix) {
                Dom._parseFix = parseFix = {
                    option: [1, "<select multiple='multiple'>", "</select>"],
                    legend: [1, "<fieldset>", "</fieldset>"],
                    area: [1, "<map>", "</map>"],
                    param: [1, "<object>", "</object>"],
                    thead: [1, "<table>", "</table>"],
                    tr: [2, "<table><tbody>", "</tbody></table>"],
                    col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"]
                } as any;
                parseFix.optgroup = parseFix.option;
                parseFix.tbody = parseFix.tfoot = parseFix.colgroup = parseFix.caption = parseFix.thead;
                parseFix.th = parseFix.td;

                Dom._parseContainer = document.createElement("div");
            }

            // 获取上下文。
            context = context ? context.ownerDocument || context : document;

            // 测试是否包含需要特殊处理的片段。
            let tag = /^<(\w+)/.exec(html as string);
            tag = tag && parseFix[tag[1].toLowerCase()];

            // 确定容器。
            let container = (context === document ? Dom._parseContainer : (context as Document).createElement('div')) as HTMLDivElement;

            // IE6-8: 必须为 HTML 追加文本才能正常解析。
            /*@cc_on if(!+"\v1") { 
                tag = tag || [1, "$<div>", "</div>"]; 
                if(context.createFragment){
                    let fragment = context.createFragment();
                    fragment.appendChild(container);
                }
             } @*/

            // 设置内容。
            if (tag) {
                container.innerHTML = tag[1] + html + tag[2];
                // 转到正确的深度。
                for (let i = tag[0] as any; i--;) {
                    container = container.lastChild as any;
                }
            } else {
                container.innerHTML = html as string;
            }

            html = container.childNodes;
        }
        return new Dom(html as NodeLike);
    };

    /**
     * 查询 CSS 选择器匹配的所有节点。
     * @param selector 要执行的 CSS 选择器。
     * @param context 执行的上下文文档。
     * @returns 返回匹配的节点列表。
     */
    static find(selector: string, context?: Element) {
        return new Dom((context || document).querySelectorAll(selector));
    }

    /**
     * 判断指定节点是否匹配指定的选择器。
     * @param node 要判断的节点。
     * @param selector 要判断的选择器。
     * @returns 如果匹配则返回 @true，否则返回 @false。
     * @example Dom.matches(document.body, "body")
     * @inner
     */
    static matches(node: Node, selector: string) {

        // 只有元素才能匹配选择器。
        if (node.nodeType !== 1) return false;

        // 优先调用原始 API。
        let nativeMatcher = ((node as Element).webkitMatchesSelector || (node as Element).msMatchesSelector || (node as any).mozMatchesSelector || (node as any).oMatchesSelector || (node as any).matchesSelector) as (selector: string) => boolean;
        if (nativeMatcher) {
            return nativeMatcher.call(node, selector) as boolean;
        }

        // 判断是否可以通过选择器获取节点。
        let parent = node.parentNode as Element,
            tempParent = !parent && node.ownerDocument.body;
        tempParent && tempParent.appendChild(node);
        try {
            return Array.prototype.indexOf.call(Dom.find(selector, parent), node) >= 0 as boolean;
        } finally {
            tempParent && tempParent.removeChild(node);
        }
    };

    /**
     * 存储所有 DOM 数据。
     */
    private static _domDatas = {};

    /**
     * 存储所有 DOM 数据编号。
     */
    private static _domId = 0;

    /**
     * 获取指定节点的数据容器。
     * @param elem 节点。
     * @param fieldName 要获取的字段名。
     * @returns 返回存储数据的字段。
     * @example Dom.data(document.getElementById('elem'), "custom")
     * @inner
     */
    static data(elem: Node, fieldName: string) {
        let dataId = elem["__dataId__"] || (elem["__dataId__"] = ++Dom._domId);
        let domDatas = Dom._domDatas;
        domDatas = domDatas[dataId] || (domDatas[dataId] = {});
        return domDatas[fieldName] || (domDatas[fieldName] = {});
    };

    // #endregion

    // #region 事件

    /** @category 事件 */

    /**
     * 存储特殊事件绑定方式。
     */
    private static _eventFix: {

        /**
         * 获取或设置指定特殊事件绑定方式。
         * @param event 要获取的事件名。
         * @returns 返回绑定方式属性。
         */
        [event: string]: {

            /**
             * 设置当前事件实际绑定的事件。
             */
            bind?: string;

            /**
             * 设置当前事件实际委托时绑定的事件。
             */
            delegate?: string;

            /**
             * 设置当前事件触发过滤器。
             */
            filter?: (elem: Element, e: Event) => boolean;

            /**
             * 自定义绑定的函数。
             */
            add?: (elem: Element, eventName: string, eventListener: (e: Event) => void) => void;

            /**
             * 自定义解绑的函数。
             */
            remove?: (elem: Element, eventName: string, eventListener: (e: Event) => void) => void;

        }

    }

    /**
     * 为当前节点列表每一项添加一个事件监听器。
     * @param events 要添加的事件列表。
     * @param scope 设置回调函数中 this 的指向。
     * @example
     * $("#elem").on({'click'(){ alert("点击事件"), 'mouseenter a':  function(e){ this.firstChild.innerHTML = e.pageX; } });
     * 
     * @remark
     * > #### 触屏事件
     * > click`/`mouse` 事件会自动绑定为相应的`touch` 事件，以增加触屏设备上相应事件的响应速度。
     * 
     * > #### IE 特有事件
     * > 本方法支持 `mousewheel`/`mouseenter`/`mouseleave`/`focusin`/`foucsout` 等 IE 特定事件支持。
     */
    on(events: { [eventName: string]: EventListener }, scope?): this;

    /**
     * 为当前节点列表每一项添加一个事件监听器。
     * @param eventName 要添加的事件名。
     * @param eventListener 要添加的事件监听器。
     * @param scope 设置回调函数中 this 的指向。
     * @example
     * ##### 普通绑定
     * $("#elem").on('click', function(){ alert("点击事件") });
     * 
     * ##### 委托事件
     * $("#elem").on('mouseenter', 'a', function(e){ this.firstChild.innerHTML = e.pageX; });
     * 
     * @remark
     * > #### 触屏事件
     * > click`/`mouse` 事件会自动绑定为相应的`touch` 事件，以增加触屏设备上相应事件的响应速度。
     * 
     * > #### IE 特有事件
     * > 本方法支持 `mousewheel`/`mouseenter`/`mouseleave`/`focusin`/`foucsout` 等 IE 特定事件支持。
     */
    on(eventName: string, eventListener: EventListener, scope?): this;

    /**
     * 为当前节点列表每一项添加一个事件监听器。
     * @param eventName 要添加的事件名。
     * @param delegateSelector 代理目标节点选择器。
     * @param eventListener 要添加的事件监听器。
     * @param scope 设置回调函数中 this 的指向。
     * @example
     * ##### 普通绑定
     * $("#elem").on('click', function(){ alert("点击事件") });
     * 
     * ##### 委托事件
     * $("#elem").on('mouseenter', 'a', function(e){ this.firstChild.innerHTML = e.pageX; });
     * 
     * @remark
     * > #### 触屏事件
     * > click`/`mouse` 事件会自动绑定为相应的`touch` 事件，以增加触屏设备上相应事件的响应速度。
     * 
     * > #### IE 特有事件
     * > 本方法支持 `mousewheel`/`mouseenter`/`mouseleave`/`focusin`/`foucsout` 等 IE 特定事件支持。
     */
    on(eventName: string, delegateSelector: string, eventListener: EventListener, scope?): this;

    /**
     * 为当前节点列表每一项添加一个事件监听器。
     * @param eventName 要添加的事件名。
     * @param delegateSelector 代理目标节点选择器。
     * @param eventListener 要添加的事件监听器。
     * @param scope 设置回调函数中 this 的指向。
     * @example
     * ##### 普通绑定
     * $("#elem").on('click', function(){ alert("点击事件") });
     * 
     * ##### 委托事件
     * $("#elem").on('mouseenter', 'a', function(e){ this.firstChild.innerHTML = e.pageX; });
     * 
     * @remark
     * > #### 触屏事件
     * > click`/`mouse` 事件会自动绑定为相应的`touch` 事件，以增加触屏设备上相应事件的响应速度。
     * 
     * > #### IE 特有事件
     * > 本方法支持 `mousewheel`/`mouseenter`/`mouseleave`/`focusin`/`foucsout` 等 IE 特定事件支持。
     */
    on(eventName: string | { [event: string]: EventListener }, delegateSelector?: string | EventListener, eventListener?: EventListener, scope?) {

        // 支持 .on({...}) 语法简写。
        if (typeof eventName !== "string") {
            for (let key in eventName) {
                let match = /^(\w+)\s*/.exec(key) || [key, key];
                this.on(match[1], key.substr(match[0].length), eventName[key], delegateSelector);
            }
            return this;
        }

        // 初始化特殊事件对象。
        let eventFix = Dom._eventFix as any;
        if (!eventFix) {

            // Firefox: 不支持 mouseenter/mouseleave 事件。
            let mouseFilter = (elem: Element, e: Event) => {
                // 基于 mouseover 和 mouseout 触发，筛选来自目标的事件。
                // 如果浏览器原生支持 mouseenter/mouseleave，则不执行过滤。
                return e.type.length > 9 || !Dom.contains(elem, (e as any).relatedTarget);
            };

            Dom._eventFix = eventFix = {

                // mouseenter/mouseleave 事件不支持冒泡，委托时使用 mouseover/mouseout 实现。
                mouseenter: { delegate: "mouseover", filter: mouseFilter },
                mouseleave: { delegate: "mouseout", filter: mouseFilter },

                // focus/blur 事件不支持冒泡，委托时使用 foucin/foucsout 实现。
                focus: { delegate: "focusin" },
                blur: { delegate: "focusout" },

                // 支持直接绑定原生事件。
                'native-click': { bind: "click" },
                'native-mousedown': { bind: 'mousedown' },
                'native-mouseup': { bind: 'mouseup' },
                'native-mousemove': { bind: 'mousemove' }

            } as any;

            let html = Document.prototype;

            // Firefox: 不支持 focusin/focusout 事件。
            if (!("onfocusin" in html)) {

                // 基于事件捕获绑定事件模拟冒泡。
                let focusAdd = function (elem: Element, eventName: string, eventListener: EventListener) {
                    elem.addEventListener(this.bind, eventListener, true);
                };

                let focusRemove = function (elem: Element, eventName: string, eventListener: EventListener) {
                    elem.removeEventListener(this.bind, eventListener, true);
                };

                eventFix.focusin = { bind: "focus", add: focusAdd, remove: focusRemove };
                eventFix.focusout = { bind: "blur", add: focusAdd, remove: focusRemove };
            }

            // Firefox: 不支持 mousewheel 事件。
            if (!('onmousewheel' in html)) {
                (eventFix as any).mousewheel = {
                    bind: 'DOMMouseScroll',
                    filter(elem: Element, e: MouseWheelEvent) {
                        // 修正滚轮单位。
                        e.wheelDelta = -(e.detail || 0) / 3;
                    }
                };
            }

            // 触屏上 mouse 相关事件太慢，改用 touch 事件模拟。
            if ((window as any).TouchEvent) {

                let touchFilter = function (elem, e) {
                    // PC Chrome: 修复触摸事件的 pageX 和 pageY 始终是 0。
                    if (!e.pageX && !e.pageY && (e.changedTouches || 0).length) {
                        e.__defineGetter__("pageX", function () { return this.changedTouches[0].pageX; });
                        e.__defineGetter__("pageY", function () { return this.changedTouches[0].pageY; });
                        e.__defineGetter__("clientX", function () { return this.changedTouches[0].clientX; });
                        e.__defineGetter__("clientY", function () { return this.changedTouches[0].clientY; });
                        e.__defineGetter__("which", function () { return 1; });
                    }
                };

                let touchAdd = function (elem: Element, eventName: string, eventListener: EventListener) {
                    let eventState = 0;

                    // 绑定委托事件。
                    elem.addEventListener(this.bind, eventListener["mouse"] = function (e) {
                        eventState = 1;
                        return eventListener.call(this, e);
                    }, false);

                    // 绑定原事件。
                    elem.addEventListener(eventName, eventListener["touch"] = function (e) {
                        if (eventState) {
                            eventState = 0;
                        } else {
                            return eventListener.call(this, e);
                        }
                    }, false);
                };

                let touchRemove = function (elem: Element, eventName: string, eventListener: EventListener) {
                    elem.removeEventListener(this.bind, eventListener["mouse"], false);
                    elem.removeEventListener(eventName, eventListener["touch"], false);
                };

                // 让浏览器快速响应鼠标点击事件，而非等待 300ms 。
                eventFix.mousedown = {
                    bind: "touchstart",
                    filter: touchFilter,
                    add: touchAdd,
                    remove: touchRemove
                };
                eventFix.mousemove = {
                    bind: "touchmove",
                    filter: touchFilter,
                    add: touchAdd,
                    remove: touchRemove
                };
                eventFix.mouseup = {
                    bind: "touchend",
                    filter: touchFilter,
                    add: touchAdd,
                    remove: touchRemove
                };
                eventFix.click = {
                    filter: touchFilter,
                    add(elem: Element, eventName: string, eventListener: EventListener) {
                        let eventState: any = 0;
                        elem.addEventListener("touchstart", eventListener["touchStart"] = function (e) {
                            if (e.changedTouches.length === 1) {
                                eventState = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
                            }
                        }, false);
                        elem.addEventListener("touchend", eventListener["touchEnd"] = function (e) {
                            if (e.changedTouches.length === 1 && eventState && Math.pow(e.changedTouches[0].pageX - eventState[0], 2) + Math.pow(e.changedTouches[0].pageY - eventState[1], 2) < 25) {
                                eventState = 2;
                                return eventListener.call(elem, e);
                            }
                        }, false);
                        elem.addEventListener(eventName, eventListener["click"] = function (e) {
                            if (eventState === 2) {
                                eventState = 0;
                            } else {
                                eventState = 0;
                                return eventListener.call(this, e);
                            }
                        }, false);
                    },
                    remove(elem: Element, eventName: string, eventListener: EventListener) {
                        elem.removeEventListener("touchstart", eventListener["touchStart"], false);
                        elem.removeEventListener("touchend", eventListener["touchEnd"], false);
                        elem.removeEventListener(eventName, eventListener["click"], false);
                    }
                };
            }

        }

        // 允许不传递 delegateSelector 参数。
        if (typeof delegateSelector !== "string") {
            scope = eventListener;
            eventListener = delegateSelector as EventListener;
            delegateSelector = '';
        }

        // 为每个节点绑定事件。
        return this.each(elem => {

            // 获取事件列表。
            let events = Dom.data(elem, "events");
            let eventListeners = events[eventName as string] || (events[eventName as string] = []);

            // 获取特殊处理的事件。
            let fixObj = eventFix[eventName as string] || 0;

            // 如果满足以下任一要求，则生成代码事件句柄。
            // 1. 定义委托事件。
            // 2. 事件本身需要特殊过滤。
            // 3. 事件重复绑定。（通过代理令事件支持重复绑定）
            // 4. IE8: 默认事件绑定的 this 不正确。
            if ( /*@cc_on !+"\v1" || @*/delegateSelector || scope || fixObj.filter || eventListeners.indexOf(eventListener) >= 0) {
                let orignalListener = eventListener;
                eventListener = function (e: Event) {

                    // 实际触发事件的节点。
                    let actucalTarget = elem;

                    // 应用委托节点筛选。
                    if (delegateSelector) {
                        actucalTarget = Dom.closest(e.target as Node, delegateSelector as string, this);
                        if (!actucalTarget) {
                            return;
                        }
                    }

                    // 处理特殊事件绑定。
                    if (!fixObj.filter || fixObj.filter(actucalTarget, e) !== false) {
                        return orignalListener.call(scope || actucalTarget, e);
                    }

                };
                eventListener["orignal"] = orignalListener;
            }

            // 更新事件为委托事件。
            if (delegateSelector && fixObj.delegate) {
                fixObj = fixObj[eventName = fixObj.delegate] || 0;
            }

            // 添加函数句柄。
            fixObj.add ? fixObj.add(elem, eventName, eventListener) : elem.addEventListener(fixObj.bind || eventName, eventListener, false);

            // 添加当前处理函数到列表。以便之后删除事件或触发事件。
            eventListeners.push(eventListener);

        });

    }

    /**
     * 删除当前节点列表每一项一个或多个事件监听器。
     * @param eventName 要删除的事件名。
     * @param eventListener 要删除的事件处理函数。如果未指定则删除全部事件。
     * @example
     * #### 删除指定点击事件
     * $("#elem").off('click', function(){ alert("点击事件") });
     * 
     * #### 删除全部点击事件
     * $("#elem").off('click');
     */
    off(eventName: string, eventListener: EventListener, scope?): this;

    /**
     * 删除当前节点列表每一项一个或多个事件监听器。
     * @param eventName 要删除的事件名。
     * @param delegateSelector 代理目标节点选择器。
     * @param eventListener 要删除的事件处理函数。如果未指定则删除全部事件。
     * @example
     * #### 删除指定点击事件
     * $("#elem").off('click', function(){ alert("点击事件") });
     * 
     * #### 删除全部点击事件
     * $("#elem").off('click');
     */
    off(eventName: string, delegateSelector: string, eventListener: EventListener, scope?): this;

    /**
     * 删除当前节点列表每一项一个或多个事件监听器。
     * @param eventName 要删除的事件名。
     * @param eventListener 要删除的事件处理函数。如果未指定则删除全部事件。
     * @example
     * #### 删除指定点击事件
     * $("#elem").off('click', function(){ alert("点击事件") });
     * 
     * #### 删除全部点击事件
     * $("#elem").off('click');
     */
    off(eventName: string, delegateSelector?: string | EventListener, eventListener?: EventListener) {

        // 允许不传递 delegateSelector 参数。
        if (typeof delegateSelector !== "string") {
            eventListener = delegateSelector as EventListener;
            delegateSelector = '';
        }

        return this.each(elem => {

            // 获取事件列表。
            let eventListeners = Dom.data(elem, "events")[eventName];
            if (eventListeners) {

                // 未指定句柄则删除所有函数。
                if (!eventListener) {
                    for (let i = 0; i < eventListeners.length; i++) {
                        this.off(eventName, delegateSelector as string, eventListeners[i]);
                    }
                    return;
                }

                // 找到已绑定的事件委托。
                let index = eventListeners.indexOf(eventListener);

                // 如果事件被代理了，则找到代理的事件。
                if (index < 0) {
                    for (index = eventListeners.length; index-- && eventListeners[index].orignal !== eventListener;);
                }

                // 更新为实际事件句柄。
                if (~index) {

                    // 获取实际绑定的处理函数。
                    eventListener = eventListeners[index];

                    // 从数组删除。
                    eventListeners.splice(index, 1);

                    // 清空整个事件函数。
                    if (!eventListeners.length) {
                        delete Dom.data(elem, "events")[eventName];
                    }

                }

                // 解析特殊事件。
                let fixObj = Dom._eventFix && Dom._eventFix[eventName] || 0 as any;

                // 删除函数句柄。
                fixObj.remove ? fixObj.remove(elem, eventName, eventListener) : elem.removeEventListener((delegateSelector ? fixObj.delegate : fixObj.bind) || eventName, eventListener, false);

            }

        });

    }

    /**
     * 触发当前节点列表每一项的指定事件，执行已添加的监听器。
     * @param eventName 要触发的事件名。
     * @param eventArgs 传递给监听器的事件对象。
     * @example $("#elem").trigger('click')
     */
    trigger(eventName: string, eventArgs?) {
        return this.each(elem => {

            // 获取事件列表。
            let eventListeners = Dom.data(elem, "events")[eventName];
            if (eventListeners) {

                // 初始化事件参数。
                eventArgs = eventArgs || {};
                eventArgs.type = eventName;
                eventArgs.target = elem;

                // 执行每个处理函数。
                if (eventListeners.length === 1) {
                    eventListeners[0].call(elem, eventArgs);
                } else {
                    eventListeners = eventListeners.slice(0);
                    for (let i = 0; i < eventListeners.length; i++) {
                        eventListeners[i].call(elem, eventArgs);
                    }
                }

            }

        });

    }

    /**
     * 绑定或触发当前节点列表每一项的点击事件。
     * @param 绑定的事件监听器。 
     * @example $("#elem").click()
     */
    click: (eventListener?: EventListener) => this;

    /**
     * 绑定或触发当前节点列表每一项的获取焦点事件。
     * @param 绑定的事件监听器。 
     * @example $("#elem").focus()
     */
    focus: (eventListener?: EventListener) => this;

    /**
     * 绑定或触发当前节点列表每一项的取消焦点事件。
     * @param {Function} 绑定的事件监听器。 
     * @example $("#elem").blur()
     */
    blur: (eventListener?: EventListener) => this;

    // #endregion

    // #region 遍历

    /** @category 遍历 */

    /**
     * 在当前节点列表第一项中查找指定的子节点。
     * @param selector 要查找的选择器。
     * @returns 返回一个新列表。如果节点列表为空则返回 @this。
     * @example $("#elem").find("div")
     */
    find(selector: string) {
        return this[0] ? Dom.find(selector, this[0] as Element) : this;
    }

    /**
     * 判断当前节点列表第一项是否匹配指定的 CSS 选择器。
     * @param selector 要判断的选择器。
     * @returns 如果匹配则返回 @true，否则返回 @false 。如果节点列表为空则返回 @false。
     * @example $("#elem").is("div")
     */
    is(selector: string) {
        return !!this[0] && Dom.matches(this[0] as Node, selector);
    }

    /**
     * 获取当前节点列表第一项的第一个子节点对象。
     * @param selector 用于筛选元素的 CSS 选择器。
     * @returns 返回节点列表。
     * @example $("#elem").first()
     */
    first: (selector?: string) => Dom;

    /**
     * 获取当前节点列表第一项的最后一个子节点对象。
     * @param selector 用于筛选元素的 CSS 选择器。
     * @returns 返回节点列表。
     * @example $("#elem").last()
     */
    last: (selector?: string) => Dom;

    /**
     * 获取当前节点列表第一项的下一个相邻节点对象。
     * @param selector 用于筛选元素的 CSS 选择器。
     * @returns 返回节点列表。
     * @example $("#elem").next()
     */
    next: (selector?: string) => Dom;

    /**
     * 获取当前节点列表第一项的上一个相邻的节点对象。
     * @param selector 用于筛选元素的 CSS 选择器。
     * @returns 返回节点列表。
     * @example $("#elem").prev()
     */
    prev: (selector?: string) => Dom;

    /**
     * 获取当前节点列表第一项的直接父节点对象。
     * @param selector 用于筛选元素的 CSS 选择器。
     * @returns 返回节点列表。
     * @example $("#elem").parent()
     */
    parent(selector?: string) {
        return new Dom(this[0] && (this[0] as Node).parentNode).filter(selector);
    }

    /**
     * 获取当前节点列表第一项的全部直接子节点或指定子节点。
     * @param selector 用于筛选元素的 CSS 选择器。
     * @returns 返回节点列表。
     * @example $("#elem").children()
     */
    children(selector: string) {
        return new Dom(this[0] && (this[0] as Node).childNodes).filter(elem => elem.nodeType === 1).filter(selector);
    }

    /**
     * 获取指定节点及其父节点中第一个匹配指定 CSS 选择器的节点。
     * @param node 要判断的节点。
     * @param selector 要匹配的 CSS 选择器。
     * @param context=document 指定搜索的限定范围，只在指定的节点内搜索。
     * @returns 如果 @node 匹配 @selector，则返回 @node，否则返回 @node 第一个匹配的父节点对象。如果全部不匹配则返回 @null。
     * @example Dom.closest(document.getElementById('elem'), 'body')
     * @inner
     */
    static closest(node: Node, selector: string, context?: Node) {
        while (node && node !== context && !Dom.matches(node, selector)) {
            node = node.parentNode;
        }
        return node === context ? null : node;
    }

    /**
     * 获取当前节点列表第一项指及其父节点对象中第一个满足指定 CSS 选择器的节点。
     * @param selector 用于筛选元素的 CSS 选择器。
     * @param context=document 指定搜索的限定范围，只在指定的节点内搜索。
     * @returns 如果要获取的节点满足要求，则返回要获取的节点，否则返回一个匹配的父节点对象。
     * @example $("#elem").closest("body")
     */
    closest(selector: string, context?: NodeLike) {
        return new Dom(this[0] && Dom.closest(this[0] as Node, selector, Dom.$(context)[0] as Node));
    }

    /**
     * 获取当前节点列表第一项在其父节点的索引。
     * @returns 返回索引。
     * @example $("#elem").index()
     */
    index() {
        let node = this[0] as Element, i = 0;
        if (node) {
            while ((node = node.previousElementSibling)) i++;
            return i;
        }
    }

    // #endregion

    // #region 增删

    /** @category 增删 */

    /**
     * 将当前节点列表每一项追加到指定父节点末尾。
     * @param parent 要追加的目标父节点。
     * @param checkAppended 如果设为 @true，则检查当前节点是否已添加到文档，如果已经添加则不再操作。
     * @example $("#elem").appendTo("#parent")
     */
    appendTo(parent: NodeLike, checkAppended?: boolean) {
        parent = Dom.$(parent)[0];
        return parent ? this.each(elem => {
            if (!checkAppended || !Dom.contains(document.body, elem)) {
                (parent as Node).appendChild(elem);
            }
        }) : this;
    }

    /**
     * 判断指定节点是否包含另一个节点。
     * @param node 要判断的节点。
     * @param child 要判断的子节点。
     * @returns 如果 @child 是 @node 或其子节点则返回 @true，否则返回 @false。
     * @example Dom.contains(document.body, document.body)
     * @inner
     */
    static contains(node: Node, child: Node) {
        if ((node as any).contains) {
            return (node as any).contains(child) as boolean;
        }
        for (; child; child = child.parentNode) {
            if (child === node) {
                return true;
            }
        }
        return false;
    }

    /**
     * 判断当前节点列表第一项是否包含指定的子节点。
     * @param child 要判断的子节点。
     * @returns {Boolean} 如果当前节点是 @child 或包含 @child，则返回 @true，否则返回 @false。
     * @example  $("body").contains("#elem")
     */
    contains(child: NodeLike) {
        child = Dom.$(child)[0];
        return child && this[0] && Dom.contains(this[0] as Node, child as any as Node);
    }

    /**
     * 插一段 HTML 到当前节点列表第一项末尾。
     * @param html 要插入的内容。
     * @returns 返回插入的新节点对象。
     * @example $("#elem").append("append")
     */
    append(html: string | NodeLike) {
        let parent = this[0] as Node;
        return Dom.parse(html, parent).each(node => {
            parent && parent.appendChild(node);
        });
    }

    /**
     * 插一段 HTML 到当前节点列表第一项顶部。
     * @param html 要插入的内容。
     * @returns 返回插入的新节点对象。
     * @example $("#elem").prepend("prepend")
     */
    prepend(html: string | NodeLike) {
        let parent = this[0] as Node;
        let firstChild = parent && parent.firstChild;
        return Dom.parse(html, parent).each(node => {
            parent && parent.insertBefore(node, firstChild);
        });
    }

    /**
     * 插入一段 HTML 到当前节点列表第一项前面。
     * @param html 要插入的内容。
     * @returns 返回插入的新节点对象。
     * @example $("#elem").before("before")
     */
    before(html: string | NodeLike, after?: boolean) {
        let parent = this[0] as Node;
        return Dom.parse(html, parent).each(function (node) {
            parent && parent.parentNode && parent.parentNode.insertBefore(node, after ? parent.nextSibling : parent);
        });
    }

    /**
     * 插入一段 HTML 到当前节点列表第一项后面。
     * @param html 要插入的内容。
     * @returns 返回插入的新节点对象。
     * @example $("#elem").after("after")
     */
    after(html: string | NodeLike) { return this.before(html, true); }

    /**
     * 移除当前节点列表的所有节点。
     * @remark
     * 这个方法不会彻底移除 Dom 对象，而只是暂时将其从 Dom 树分离。
     * @example $("#elem").remove()
     */
    remove() {
        return this.each(node => {
            node.parentNode && node.parentNode.removeChild(node);
        });
    }

    /**
     * 克隆当前节点列表的第一项。
     * @returns 返回克隆的新节点。
     * @example $("#elem").clone()
     */
    clone() { return new Dom(this[0] && (this[0] as Node).cloneNode(true)); }

    // #endregion

    // #region 属性

    /** @category 属性 */

    /**
     * 获取当前节点列表第一项的属性值。
     * @param attrName 要获取的属性名称。
     * @returns 返回属性值。如果元素没有相应属性，则返回 null 。
     * @example $("#elem").attr("className")
     */
    attr(attrName: string): string;

    /**
     * 设置当前节点列表每一项的属性值。
     * @param attrs 存储属性的键值对。属性名必须是骆驼规则。当设置为 null 时，删除此属性。
     * @returns 返回属性值。如果元素没有相应属性，则返回 null 。
     * @example $("#elem").attr({"className", "doc-doc"}) // 设置为 null 表示删除。
     */
    attr(attrs: { [attrName: string]: string }): this;

    /**
     * 设置当前节点列表每一项的属性值。
     * @param attrName 要获取的属性名称。属性名必须是骆驼规则。
     * @param attrValue 要设置的属性值。当设置为 null 时，删除此属性。
     * @returns 返回属性值。如果元素没有相应属性，则返回 null 。
     * @example $("#elem").attr("className", "doc-doc") // 设置为 null 表示删除。
     */
    attr(attrName: string, attrValue: string): this;

    /**
     * 获取当前节点列表第一项或设置每一项的属性值。
     * @param attrName 要获取的属性名称。属性名必须是骆驼规则。
     * @param attrValue 要设置的属性值。当设置为 null 时，删除此属性。
     * @returns 返回属性值。如果元素没有相应属性，则返回 null 。
     */
    attr(attrName: string | { [attrName: string]: string }, attrValue?: string) {
        if (typeof attrName !== "string") {
            for (attrValue in attrName) {
                this.attr(attrValue, attrName[attrValue]);
            }
            return this;
        }
        let elem = this[0] as Element;
        return attrValue === undefined ? elem && ((attrName as string) in elem ? elem[attrName as string] : elem.getAttribute(attrName as string)) : this.each((elem: Element) => {
            (attrName as string) in elem ? elem[attrName as string] = attrValue : attrValue === null ? elem.removeAttribute(attrName as string) : elem.setAttribute(attrName as string, attrValue);
        });
    }

    /**
     * 获取当前节点列表第一项的文本。
     * @returns 值。对普通节点返回 textContent 属性，对文本框返回 value 属性。
     * @example $("#elem").text()
     */
    text(): string;

    /**
     * 设置当前节点列表每一项的文本。
     * @param value 要设置的文本。
     * @example $("#elem").text("text")
     */
    text(value: string): this;

    /**
     * 获取当前节点列表第一项或设置每一项的文本。
     * @param value 要设置的文本。
     * @returns 值。对普通节点返回 textContent 属性，对文本框返回 value 属性。
     * @example $("#elem").text("text")
     */
    text(value?: string) {
        return this.attr(this[0] && /^(INPUT|SELECT|TEXTAREA)$/.test((this[0] as Element).tagName) ? 'value' : 'textContent', value) as any;
    }

    /**
     * 获取当前节点列表第一项的 HTML。
     * @returns 返回内部 HTML 代码。
     * @example $("#elem").html()
     */
    html(): string;

    /**
     * 设置当前节点列表每一项的 HTML。
     * @param value 要设置的 HTML。
     * @example $("#elem").text("text")
     */
    html(value: string): this;

    /**
     * 获取当前节点列表第一项或设置每一项的 HTML。
     * @param value 要设置的 HTML。
     * @returns 返回内部 HTML 代码。
     * @example 
     * $("#elem").html()
     * 
     * $("#elem").html("<em>html</em>")
     */
    html(value?: string) { return this.attr('innerHTML', value) as any; }

    // #endregion

    // #region 样式

    /** @category 样式 */

    /**
     * 为指定的 CSS 属性添加当前浏览器特定的后缀（如 webkit-)。
     * @param elem 要处理的元素。
     * @param cssPropertyName 要处理的 CSS 属性名。
     * @returns 返回已加后缀的 CSS 属性名。
     * @example Dom.vendor(document.getElementById('elem'), 'transform')
     * @remark
     * > #### IE Transform
     * > 可使用 <a href="http://www.useragentman.com/IETransformsTranslator/">IE Transforms Translator</a> 工具实现 IE6-9 Transform 效果。
     */
    static vendor(elem: HTMLElement, cssPropertyName: string) {
        if (!(cssPropertyName in elem.style)) {
            let capName = cssPropertyName.charAt(0).toUpperCase() + cssPropertyName.slice(1);
            for (let prefix in { webkit: 1, Moz: 1, ms: 1, O: 1 }) {
                if ((prefix + capName) in elem.style) {
                    return prefix + capName;
                }
            }
        }
        return cssPropertyName;
    };

    /**
     * 获取节点的当前 CSS 属性值。
     * @param elem 要获取或设置的元素。
     * @param cssPropertyName 要获取或设置的 CSS 属性名。属性名必须使用骆驼规则。
     * @returns 返回 CSS 属性值。
     * @example Dom.css(document.getElementById('elem'), 'fontSize')
     */
    static css(elem: HTMLElement, cssPropertyName: string): string;

    /**
     * 设置节点的当前 CSS 属性值。
     * @param elem 要获取或设置的元素。
     * @param cssPropertyName 要获取或设置的 CSS 属性名。属性名必须使用骆驼规则。
     * @param cssValue 要设置的 CSS 属性值，数字会自动追加像素单位。留空则不设置值。
     * @example Dom.css(document.getElementById('elem'), 'fontSize')
     * @remark
     * > #### IE Transform
     * > 可使用 <a href="http://www.useragentman.com/IETransformsTranslator/">IE Transforms Translator</a> 工具实现 IE6-9 Transform 效果。
     */
    static css(elem: HTMLElement, cssPropertyName: string, cssValue?: string | number): void;

    /**
     * 获取或设置节点的当前 CSS 属性值。
     * @param elem 要获取或设置的元素。
     * @param cssPropertyName 要获取或设置的 CSS 属性名。属性名必须使用骆驼规则。
     * @param [value] 要设置的 CSS 属性值，数字会自动追加像素单位。留空则不设置值。
     * @returns 如果 @value 为 @undefined 则返回 CSS 属性值。否则不返回。
     */
    static css(elem: HTMLElement, cssPropertyName: string, cssValue?: string | number) {

        /*@cc_on if(!+"\v1") {
    
        if(!Dom._styleFix){
            Dom._styleFix = {
                height: {
                    get (elem) {
                        return elem.offsetHeight === 0 ? 'auto' : elem.offsetHeight - Dom.calc(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight') + 'px';
                    }
                },
                width: {
                    get (elem) {
                        return elem.offsetWidth === 0 ? 'auto' : elem.offsetWidth - Dom.calc(elem, 'borderTopWidth+borderBottomWidth+paddingLeft+paddingRight') + 'px';
                    }
                },
                cssFloat: {
                    get (elem) {
                        return Dom(elem).css('styleFloat');
                    },
                    set (elem, value) {
                        return Dom(elem).css('styleFloat', value);
                    }
                },
                opacity: {
                    rOpacity: /opacity=([^)]*)/,
                    get (elem) {
                        return this.rOpacity.test(elem.currentStyle.filter) ? parseInt(RegExp.$1) / 100 + '' : '1';
                    },
                    set(elem, value) {
    
                        value = value || value === 0 ? 'opacity=' + value * 100 : '';
                
                        // 当元素未布局，IE会设置失败，强制使生效。
                        elem.style.zoom = 1;
    
                        // 获取真实的滤镜。
                        let filter  = elem.currentStyle.filter;
    
                        // 设置值。
                        elem.style.filter = this.rOpacity.test(filter) ? filter.replace(this.rOpacity, value) : (filter + ' alpha(' + value + ')');
                    }
                }
            };
        }
    
        let styleFix = Dom._styleFix[cssPropertyName] || 0, r;
    
        if(cssValue === undefined){
        
            if(styleFix.get){
                return styleFix.get(elem);
            }
        
            // currentStyle：IE的样式获取方法,runtimeStyle是获取运行时期的样式。
            // currentStyle是运行时期样式与style属性覆盖之后的样式
            r = elem.currentStyle[cssPropertyName];
        
            // 来自 jQuery
            // 如果返回值不是一个带px的 数字。 转换为像素单位
            if (/^-?\d/.test(r) && !/^-?\d+(?:px)?$/i.test(r)) {
        
                // 保存初始值
                let style = elem.style, left = style.left, rsLeft = elem.runtimeStyle.left;
        
                // 放入值来计算
                elem.runtimeStyle.left = elem.currentStyle.left;
                style.left = cssPropertyName === "fontSize" ? "1em" : (r || 0);
                r = style.pixelLeft + "px";
        
                // 回到初始值
                style.left = left;
                elem.runtimeStyle.left = rsLeft;
        
            }
        
            return r;
        }
    
        if(styleFix.set){
            styleFix.set(elem, cssValue);
        }
    
        } @*/

        cssPropertyName = Dom.vendor(elem, cssPropertyName);

        if (cssValue === undefined) {
            return elem.ownerDocument.defaultView.getComputedStyle(elem, null)[cssPropertyName];
        }

        // 自动追加像素单位。
        if (cssValue && typeof cssValue === "number" && !/^(columnCount|fillOpacity|flexGrow|flexShrink|fontWeight|lineHeight|opacity|order|orphans|widows|zIndex|zoom)$/.test(cssPropertyName)) {
            cssValue += 'px';
        }

        elem.style[cssPropertyName] = cssValue;

    }

    /**
     * 计算一个元素的样式表达式。
     * @param elem 要获取的元素。
     * @param expression 要计算的表达式。其中使用变量代表 CSS 属性值，如 "width+paddingLeft"。
     * @returns 返回计算的值。
     * @example Dom.calc(document.getElementById('elem'), 'fontSize+lineHeight')
     * @inner
     */
    static calc(elem: HTMLElement, expression: string) {
        /*@cc_on if(!+"\v1") {return eval(expression.replace(/\w+/g, '(parseFloat(Dom.css(elem, "$1")) || 0)'));} @*/
        // ReSharper disable once UnusedLocals
        let computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
        return eval(expression.replace(/(\w+)/g, "(parseFloat(computedStyle['$1'])||0)"));
    };

    /**
     * 获取当前节点列表第一项的 CSS 属性值。
     * @param cssPropertyName CSS 属性名。属性名必须是骆驼规则。
     * @returns 返回属性值。如果元素没有相应属性，则返回 null 。
     * @example $("#elem").css("fontSize")
     */
    css(cssPropertyName: string): string;

    /**
     * 设置当前节点列表每一项的属性值。
     * @param cssProperties 存储属性的键值对。属性名必须是骆驼规则。
     * @returns 返回属性值。如果元素没有相应属性，则返回 null 。
     * @example $("#elem").css({"fontSize", "12px"})
     */
    css(cssProperties: { [cssPropertyName: string]: string | number }): this;

    /**
     * 设置当前节点列表每一项的属性值。
     * @param cssPropertyName CSS 属性名。属性名必须是骆驼规则。
     * @param cssValue 要设置的 CSS 属性值。
     * @returns 返回属性值。如果元素没有相应属性，则返回 null 。
     * @example $("#elem").css("fontSize", "12px")
     */
    css(cssPropertyName: string, cssValue: string | number): this;

    /**
     *  获取当前节点列表第一项或设置每一项的 CSS 属性值。
     * @param cssPropertyName CSS 属性名。
     * @param {String} value 设置的 CSS 属性值。
     * @returns {String} 字符串。
     */
    css(cssPropertyName: string | { [cssPropertyName: string]: string | number }, cssValue?: any) {
        if (typeof cssPropertyName !== "string") {
            for (cssValue in cssPropertyName) {
                this.css(cssValue, cssPropertyName[cssValue]);
            }
            return this;
        }
        return cssValue === undefined ? this[0] && Dom.css(this[0] as HTMLElement, cssPropertyName as string) as any : this.each((elem: HTMLElement) => {
            Dom.css(elem, cssPropertyName as string, cssValue);
        });
    }

    // #endregion

    // #region CSS类

    /** @category CSS类 */

    /**
     * 为当前节点列表每一项添加指定的 CSS 类名。
     * @param className 要添加的 CSS 类名。
     * @example $("#elem").addClass("light")
     */
    addClass(className: string) { return this.toggleClass(className, true); }

    /**
     * 从当前节点列表每一项删除指定的 CSS 类名。
     * @param className 要删除的 CSS 类名。如果不指定则删除全部 CSS 类。
     * @example $("#elem").removeClass("light")
     */
    removeClass(className: string) { return className ? this.toggleClass(className, false) : this.attr("className", ""); }

    /**
     * 遍历当前节点列表每一项，如果存在（不存在）就删除（添加）指定的 CSS 类名。
     * @param className 要增删的 CSS 类名。
     * @param value 如果指定为 @true，则强制添加类名。如果指定为 @false，则强制删除类名。
     * @example $("#elem").toggleClass("light")
     */
    toggleClass(className: string, value?: boolean) {
        return this.each((elem: HTMLElement) => {
            // 如果 CSS 类不存在且未强制设置添加。
            if ((" " + elem.className + " ").indexOf(" " + className + " ") < 0) {
                if (value !== false) {
                    elem.className += " " + className;
                }
            } else if (value !== true) {
                elem.className = (" " + elem.className + " ").replace(" " + className + " ", " ").trim();
            }
        });
    }

    // #endregion

    // #region 位置

    /** @category 位置 */

    /**
     * 获取当前节点列表第一项的区域。
     * @returns {DOMRect} 返回所在区域。其包含 left, top, width, height 属性。
     * @remark
     * 此方法只对可见元素有效。
     * 获取元素实际占用大小（包括内边距和边框）。
     * @example $("#elem").rect();
     * 
     * $("#elem").rect({width:200, height:400});
     * 
     * $("#elem").rect({left: 30});
     */
    rect(): { left: number, top: number, width: number, height: number };

    /**
     * 设置当前节点列表每一项的区域。
     * @returns 返回所在区域。其包含 left, top, width, height 属性。
     * @remark
     * 此方法只对可见元素有效。
     * 获取元素实际占用大小（包括内边距和边框）。
     * @example
     * $("#elem").rect({width:200, height:400});
     * 
     * $("#elem").rect({left: 30});
     */
    rect(value: { left?: number, top?: number, width?: number, height?: number }): this;

    /**
     * 获取当前节点列表第一项或设置每一项的区域。
     * @returns 返回所在区域。其包含 left, top, width, height 属性。
     * @remark
     * 此方法只对可见元素有效。
     * 获取元素实际占用大小（包括内边距和边框）。
     * @example
     * $("#elem").rect({width:200, height:400});
     * 
     * $("#elem").rect({left: 30});
     */
    rect(value?: { left?: number, top?: number, width?: number, height?: number }) {
        if (value === undefined) {
            let elem = this[0] as Element;
            let result;
            if (elem) {

                let doc = (elem.ownerDocument || elem) as Document;
                let html = doc.documentElement;
                result = Dom.$(doc).scroll();

                // 对于 document，返回 scroll 。
                if (elem.nodeType === 9) {
                    result.width = html.clientWidth;
                    result.height = html.clientHeight;
                } else {
                    let rect = elem.getBoundingClientRect();
                    result.left += rect.left - html.clientLeft;
                    result.top += rect.top - html.clientTop;
                    result.width = rect.width;
                    result.height = rect.height;
                }

            }

            return result;
        }

        return this.each((elem: HTMLElement) => {

            let style = elem.style;

            if (value.top != null || value.left != null) {

                // 确保对象可移动。
                if (!/^(?:abs|fix)/.test(Dom.css(elem, "position"))) {
                    style.position = "relative";
                }

                let dom = new Dom(elem);
                let currentPosition = dom.rect();
                let offset = dom.offset();
                if (value.top != null) {
                    style.top = offset.top + value.top - currentPosition.top + 'px';
                }
                if (value.left != null) {
                    style.left = offset.left + value.left - currentPosition.left + 'px';
                }
            }

            if (value.width != null || value.height != null) {
                let boxSizing = Dom.css(elem, 'boxSizing') === 'border-box';
                if (value.width != null) {
                    style.width = value.width - (boxSizing ? 0 : Dom.calc(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight')) + 'px';
                }
                if (value.height != null) {
                    style.height = value.height - (boxSizing ? 0 : Dom.calc(elem, 'borderTopWidth+borderBottomWidth+paddingTop+paddingBottom')) + 'px';
                }
            }

        });
    }

    /**
     * 获取当前节点列表第一项的相对位置。
     * @returns 返回的对象包含两个整型属性：left 和 top。
     * @remark
     * 此方法对可见和隐藏元素均有效。获取匹配元素相对父元素的偏移。
     * @example $("#elem").offset()
     */
    offset(): { left: number, top: number } {

        let elem = this[0] as HTMLElement;

        if (elem) {

            // 如果设置过 left top，可以很方便地读取。
            let left = Dom.css(elem, "left") as any;
            let top = Dom.css(elem, "top") as any;

            // 如果未设置过值则手动计算。
            if ((!left || left === "auto" || !top || top === "auto") && Dom.css(elem, "position") === "absolute") {

                // 绝对定位需要返回绝对位置。
                top = this.offsetParent();
                left = this.rect();
                if (top[0].nodeName !== 'HTML') {
                    let t = top.rect();
                    left.left -= t.left;
                    left.top -= t.top;
                }
                left.left -= Dom.calc(elem, 'marginLeft') + Dom.calc(top[0], 'borderLeftWidth');
                left.top -= Dom.calc(elem, 'marginTop') + Dom.calc(top[0], 'borderTopWidth');

                return left;
            }

            // 将 "auto"，"空" 转 0 。
            return {
                left: parseFloat(left) || 0,
                top: parseFloat(top) || 0
            };

        }

    }

    /**
     * 获取当前节点列表第一项的定位父节点。
     * @returns 返回一个节点组成的列表。
     * @example $("#elem").offsetParent()
     */
    offsetParent() {
        let p = this[0] as HTMLElement;
        if (p) {
            while ((p = p.offsetParent as HTMLElement) && p.nodeName !== 'HTML' && Dom.css(p, "position") === "static");
            p = p || (this[0] as Node).ownerDocument.documentElement;
        }
        return new Dom(p);
    }

    /**
     * 获取当前节点列表第一项的滚动位置。
     * @returns 返回的对象包含两个整型属性：left 和 top。
     * @example $("#elem").scroll();
     */
    scroll(): { left: number, top: number };

    /**
     * 设置当前节点列表每一项的滚动位置。
     * @param value 要设置的位置 包含两个整型属性：left 和 top。
     * @returns 返回的对象包含两个整型属性：left 和 top。
     * @example $("#elem").scroll({left:100, top: 500});
     */
    scroll(value: { left?: number, top?: number }): this;

    /**
     * 获取当前节点列表第一项或设置每一项的滚动位置。
     * @param value 要设置的位置 包含两个整型属性：left 和 top。
     * @returns 返回的对象包含两个整型属性：left 和 top。
     */
    scroll(value?: { left?: number, top?: number }) {
        if (value === undefined) {
            let elem = this[0] as HTMLElement;
            if (!elem) return;
            if (elem.nodeType === 9) {
                let win = (elem as Node as HTMLDocument).defaultView;
                if ("pageXOffset" in win) {
                    return {
                        left: win.pageXOffset,
                        top: win.pageYOffset
                    };
                }
                elem = (elem as Node as HTMLDocument).documentElement;
            }

            return {
                left: elem.scrollLeft,
                top: elem.scrollTop
            } as any;
        }

        return this.each((elem: HTMLElement) => {
            if (elem.nodeType === 9) {
                (elem as Node as HTMLDocument).defaultView.scrollTo(
                    (value.left == null ? new Dom(elem).scroll() : value).left,
                    (value.top == null ? new Dom(elem).scroll() : value).top
                );
            } else {
                if (value.left != null) elem.scrollLeft = value.left;
                if (value.top != null) elem.scrollTop = value.top;
            }
        });

    }

    // #endregion

    // #region 特效

    /** @category 特效 */

    /**
     * 存储特效相关配置。
     */
    private static _fxOptions: {

        /**
         * 是否支持 CSS3 动画。
         */
        supportAnimation: boolean,

        /**
         * transition 属性名。
         */
        transition: string,

        /**
         * transitionEnd 属性名。
         */
        transitionEnd: string

    };

    /**
     * 令当前节点列表每一项开始 CSS3 动画渐变。
     * @param from 特效的起始样式。如果设置为 "auto"，则从默认值开始变化。
     * @param to 特效的结束样式。如果设置为 "auto"，则从当前值变化到默认值。
     * @param callback 特效执行完成的回调。回调的参数为：
     * * @this {Element} 当前执行特效的节点。
     * * @param {Element} elem 当前执行特效的节点。
     * @param duration=300 特效的持续时间。
     * @param ease="ease-in" 特效的渐变类型。支持 CSS3 预设的特效渐变函数。
     * @param reset 是否在特效执行结束后重置样式为初始值。
     * @example $("#elem").animate('auto', {height: '400px'});
     */
    animate(from: string | { [cssName: string]: string | number }, to: string | { [cssName: string]: string | number }, callback?: () => void, duration?: number, ease?: string, reset?: boolean): this;

    /**
     * 令当前节点列表每一项开始 CSS3 动画渐变。
     * @param to 特效的结束样式。如果设置为 "auto"，则从当前值变化到默认值。
     * @param callback 特效执行完成的回调。回调的参数为：
     * * @this {Element} 当前执行特效的节点。
     * * @param {Element} elem 当前执行特效的节点。
     * @param duration=300 特效的持续时间。
     * @param ease="ease-in" 特效的渐变类型。支持 CSS3 预设的特效渐变函数。
     * @param reset 是否在特效执行结束后重置样式为初始值。
     * @example $("#elem").animate({transform: 'rotate(45deg)'});
     */
    animate(to: string | { [cssName: string]: string | number }, callback?: () => void, duration?: number, ease?: string, reset?: boolean): this;

    /**
     * 令当前节点列表每一项开始 CSS3 动画渐变。
     * @param from 特效的起始样式。如果设置为 "auto"，则从默认值开始变化。
     * @param to 特效的结束样式。如果设置为 "auto"，则从当前值变化到默认值。
     * @param callback 特效执行完成的回调。回调的参数为：
     * * @this {Element} 当前执行特效的节点。
     * * @param {Element} elem 当前执行特效的节点。
     * @param duration=300 特效的持续时间。
     * @param ease="ease-in" 特效的渐变类型。支持 CSS3 预设的特效渐变函数。
     * @param reset 是否在特效执行结束后重置样式为初始值。
     * @example $("#elem").animate({transform: 'rotate(45deg)'});
     */
    animate(to: string | { [cssName: string]: string | number }, callback?: (() => void) | string | { [cssName: string]: string | number }, duration?: number | (() => void), ease?: string | number, reset?: boolean | string, reset2?: any) {

        // 获取或初始化配置对象。
        let fxOptions = Dom._fxOptions;
        if (!fxOptions) {
            let transition = Dom.vendor(document.documentElement, 'transition');
            Dom._fxOptions = fxOptions = {
                supportAnimation: transition in document.documentElement.style,
                transition: transition,
                transitionEnd: (transition + 'End').replace(transition.length > 10 ? /^[A-Z]/ : /[A-Z]/, w => w.toLowerCase())
            };
        }

        // 提取 from 参数。
        let from: string | { [cssName: string]: string | number };
        if (callback && typeof callback !== "function") {
            from = to as { [cssName: string]: string | number };
            to = callback as { [cssName: string]: string | number };
            callback = duration as () => void;
            duration = ease as number;
            ease = reset as string;
            reset = reset2 as boolean;
        }

        // 修补默认参数。
        if (duration == null) duration = 300;
        ease = ease || "ease-in";

        return this.each((elem: HTMLElement) => {

            // 获取或初始化配置对象。
            let proxyTimer;
            let key;

            // 记录当前属性状态。
            let transitionContext = elem.style["_transitionContext"] || (elem.style["_transitionContext"] = {});

            // 更新渐变属性。
            function updateTransition() {
                let transitions = '';
                for (let key in transitionContext) {
                    if (transitions) transitions += ',';
                    transitions += Dom.vendor(elem, key).replace(/([A-Z]|^ms|^webkit)/g, function (word) {
                        return '-' + word.toLowerCase();
                    }) + ' ' + duration + 'ms ' + ease;
                }
                elem.style[fxOptions.transition] = transitions;
            }

            // 动画执行回调。
            function transitionEnd(e: Event) {

                // 确保事件不是冒泡的，确保当前函数只执行一次。
                if ((!e || e.target === e.currentTarget) && proxyTimer) {
                    clearTimeout(proxyTimer);
                    proxyTimer = 0;

                    // 解绑事件。
                    elem.removeEventListener(fxOptions.transitionEnd, transitionEnd, false);

                    // 判断当前执行的特效是否和上次执行的特效相同。
                    // 如果当前特效是覆盖之前的特效，则覆盖之前的回调。
                    let transitionContextIsUpdated = false;
                    for (key in transitionContext) {
                        if (transitionContext[key] === transitionEnd) {
                            delete transitionContext[key];
                            transitionContextIsUpdated = true;
                        }
                    }

                    if (transitionContextIsUpdated) {

                        // 删除渐变式。
                        updateTransition();

                        // 恢复初始样式。
                        if (reset) {
                            for (key in to as {}) {
                                Dom.css(elem, key, "");
                            }
                        }

                        // 执行回调。
                        callback && (callback as () => void).call(elem);
                    }

                }

            }

            // 不支持特效，直接调用回调。
            if (fxOptions.supportAnimation) {

                // 设置当前状态为起始状态。
                if (from) {

                    // 处理 'auto' -> {} 。
                    if (from as string === "auto") {
                        from = {};
                        for (key in to as {}) {
                            from[key] = Dom.css(elem, key);
                        }
                    }

                    // 处理 {} -> 'auto' 。 
                    if (to as string === "auto") {
                        to = {};
                        for (key in from as {}) {
                            reset2 = transitionContext[key];
                            to[key] = reset2 && reset2.from && key in reset2.from ? reset2.from[key] : Dom.css(elem, key);
                        }
                    }

                    // 应用开始样式。
                    transitionEnd["from"] = from;
                    for (key in from as {}) {
                        Dom.css(elem, key, from[key]);
                    }
                }

                // 触发页面重计算以保证效果可以触发。
                // ReSharper disable once WrongExpressionStatement
                elem.offsetWidth && elem.clientLeft;

                // 更新渐变上下文。
                for (key in to as {}) {
                    transitionContext[key] = transitionEnd;
                }

                // 设置渐变样式。
                updateTransition();

                // 绑定渐变完成事件。
                elem.addEventListener(fxOptions.transitionEnd, transitionEnd, false);
                proxyTimer = setTimeout(transitionEnd, duration);

                // 设置 CSS 属性以激活渐变。
                for (key in to as {}) {
                    Dom.css(elem, key, to[key]);
                }

            } else {
                callback && (callback as () => void).call(elem);
            }

        });

    }

    /**
     * 判断当前节点列表第一项是否是隐藏或正在隐藏。
     * @returns 当前元素已经隐藏返回 true，否则返回  false 。
     * @example $("#elem").isHidden();
     */
    isHidden() {
        let elem = this[0] as HTMLElement;
        return elem && (elem.style["_togging"] === false || (elem.style.display || Dom.css(elem, "display")) === "none");
    }

    /**
     * 通过设置 display 属性来显示当前节点列表每一项。
     * @param animation 使用的特效。内置支持的为 "height"/"opacity"/"scale"。
     * @param callback 特效执行完成的回调。
     * @param duration=300 特效的持续时间。
     * @param ease="ease-in" 特效的渐变类型。
     * @example $("#elem").show();
     */
    show(animation?: string | boolean | { [cssPropertyName: string]: string | number }, callback?: () => void, duration?: number, ease?: string) {
        return this.toggle(animation, callback, duration, ease, true);
    }

    /**
     * 通过设置 display 属性来隐藏当前节点列表每一项。
     * @param animation 使用的特效。内置支持的为 "height"/"opacity"/"scale"。
     * @param callback 特效执行完成的回调。
     * @param duration=300 特效的持续时间。
     * @param ease="ease-in" 特效的渐变类型。
     * @example $("#elem").hide();
     */
    hide(animation?: string | boolean | { [cssPropertyName: string]: string | number }, callback?: () => void, duration?: number, ease?: string) {
        return this.toggle(animation, callback, duration, ease, false);
    }

    /**
     * 存储标签默认的 display 属性。
     */
    private static _defaultDisplays: { [tagName: string]: string };

    /**
     * 显示指定的节点。
     * @param elem 要显示的节点。
     */
    static show(elem: HTMLElement) {

        // 清空 display 属性。
        elem.style.display = "";

        // 如果元素的 display 仍然为 none, 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 inline 或 block。
        if (Dom.css(elem, "display") === "none") {
            let nodeName = elem.nodeName;
            let defaultDisplay = elem.style["_defaultDisplay"] || (Dom._defaultDisplays || (Dom._defaultDisplays = {}))[nodeName];
            if (!defaultDisplay) {

                // 创建一个新节点以计算其默认的 display 属性。
                let tmp = document.createElement(nodeName);
                document.body.appendChild(tmp);
                defaultDisplay = Dom.css(tmp, "display");
                document.body.removeChild(tmp);

                // 如果计算失败则设置为默认的 block。
                if (defaultDisplay === "none") {
                    defaultDisplay = "block";
                }

                // 缓存以加速下次计算。
                Dom._defaultDisplays[nodeName] = defaultDisplay;
            }
            elem.style.display = defaultDisplay;
        }

    }

    /**
     * 隐藏指定的节点。
     * @param elem 要隐藏的节点。
     */
    static hide(elem: HTMLElement) {
        let currentDisplay = Dom.css(elem, "display");
        if (currentDisplay !== "none") {
            elem.style["_defaultDisplay"] = currentDisplay;
            elem.style.display = "none";
        }
    }

    /**
     * 存储标签默认的 display 属性。
     */
    private static _toggleTypes: { [animation: string]: { [cssPropertyName: string]: string | number } };

    /**
     * 通过设置 display 属性切换显示或隐藏当前节点列表每一项。
     * @param animation 使用的特效。内置支持的为 "height"/"opacity"/"scale"。
     * @param callback 特效执行完成的回调。
     * @param duration=300 特效的持续时间。
     * @param ease="ease-in" 特效的渐变类型。
     * @param value 设置显示或隐藏。
     * @example 
     * ##### 折叠/展开
     * $("#elem").toggle('height');
     * 
     * ##### 深入/淡出
     * $("#elem").toggle('opacity');
     * 
     * ##### 缩小/放大
     * $("#elem").toggle('scale');
     */
    toggle(animation?: string | boolean | { [cssPropertyName: string]: string | number }, callback?: () => void, duration?: number, ease?: string, value?: boolean) {

        // 支持首参直接传递指示是否显示的值。
        if (animation === true || animation === false) {
            value = animation as boolean;
            animation = null;
        }

        animation = (Dom._toggleTypes || (Dom._toggleTypes = {
            opacity: {
                opacity: 0
            },
            height: {
                overflow: 'hidden',
                marginTop: 0,
                borderTopWidth: 0,
                paddingTop: 0,
                height: 0,
                paddingBottom: 0,
                borderBottomWidth: 0,
                marginBottom: 0
            },
            width: {
                overflow: 'hidden',
                marginLeft: 0,
                borderLeftWidth: 0,
                paddingLeft: 0,
                width: 0,
                paddinRight: 0,
                borderRightWidth: 0,
                marginRight: 0
            },
            scale: { transform: 'scale(0, 0)' },
            top: { transform: 'translateY(-300%)' },
            bottom: { transform: 'translateY(300%)' }
        }))[animation as string] || animation;

        return this.each((elem: HTMLElement) => {

            // 如果在调用 show/hide 时，元素正在执行上一次调用的特效。
            // 则终止特效，并以最终 display 属性是否符合期望为标准判断是否需要调用回调。

            // 判断元素当前显示状态。
            let displayNone = (elem.style.display || Dom.css(elem, "display")) === "none";

            // 判断最终需要显示还是隐藏。
            let show = value === undefined ? displayNone || elem.style["_toggling"] === false : value;

            // 区分是否需要特效。
            if (animation) {

                // 当前正在执行相同的特效渐变则不重复处理。
                if (('_toggling' in elem ? elem.style["_toggling"] : !displayNone) === show) {
                    return;
                }

                // 直接切换显示的特效。
                elem.style["_toggling"] = show;

                // 统一渐变回调。
                function animationCallback() {
                    // 对于隐藏特效，在最后隐藏节点。
                    show || Dom.hide(elem);
                    callback && callback.call(elem, elem);
                    delete elem.style["_toggling"];
                }

                if (show) {
                    // 首先显示节点，然后才能正常显示特效。
                    displayNone && Dom.show(elem);
                    new Dom(elem).animate(animation as { [cssPropertyName: string]: string | number }, "auto", animationCallback, duration, ease, true);
                } else {
                    new Dom(elem).animate("auto", animation as { [cssPropertyName: string]: string | number }, animationCallback, duration, ease, true);
                }

            } else {
                show ? Dom.show(elem) : Dom.hide(elem);
                callback && callback.call(elem, elem);
            }

        });
    }

    // #endregion

}

// #region 列表

Dom.prototype.push = Array.prototype.push;
Dom.prototype.indexOf = Array.prototype.indexOf;
Dom.prototype.slice = Array.prototype.slice;
Dom.prototype.splice = Array.prototype.splice;

// #endregion

// #region 事件

Dom.prototype.each.call(['click', 'focus', 'blur'], (funcName: string) => {
    Dom.prototype[funcName] = function (callback?: EventListener) {
        return callback !== undefined ? this.on(funcName, callback) : this.each(function (elem) {
            elem[funcName] ? elem[funcName]() : new Dom(elem).trigger(funcName);
        });
    };
});

// #endregion

// #region 遍历

Dom.prototype.each.call(['first', 'last', 'next', 'prev'], (funcName: string, index: number) => {
    let nextProp = index % 2 ? 'previousSibling' : 'nextSibling';
    let firstProp = index < 2 ? funcName + 'Child' : nextProp;

    Dom.prototype[funcName] = function (selector?: string) {
        let node = this[0];
        for (node = node && node[firstProp]; node && node.nodeType !== 1; node = node[nextProp]);
        return new Dom(node).filter(selector);
    };
});

// #endregion

// #region @$

/**
 * 查询 CSS 选择器匹配的所有节点；解析一个 HTML 字符串生成对应的节点；绑定一个 DOM Ready 回调。
 * @param selector 要执行的 CSS 选择器或 HTML 片段或 DOM Ready 函数。
 * @returns 返回 DOM 对象。
 */
export var $ = $ || Dom.$;

// #endregion
