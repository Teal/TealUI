/**
 * @author xuld
 * @fileOverview 提供 DOM 操作的辅助函数。
 */

//#include core/core.js
//#include core/class.js

var Dom = (function () {

    //#region Core

    /**
	 * Object.extend 简写。
	 * @type Function
	 */
    var extend = Object.extend,

		/**
		 * Object.map 简写。
		 * @type Object
		 */
		map = Object.map,

		/**
		 * 数组原型。
		 * @type Object
		 */
		ap = Array.prototype,

		/**
		 * 指示当前浏览器是否为标签浏览器。
		 */
		isIE678 = navigator.isIE678,

		/**
		 * 用于测试的元素。
		 * @type Element
		 */
		html = document.documentElement,

		/**
		 * 提供对单一原生 HTML 节点的封装操作。
		 * @class
		 * @remark 
		 * @see Dom
		 * @see Dom.get
		 * @see Dom.query
		 * @remark
		 * 所有 DOM 方法都是依赖于此类进行的。比如如下 HTML 代码:
		 * <pre>
		 * &lt;div id="myDivId"&gt;内容&lt;/div&gt;
		 * </pre>
		 * 现在如果要操作这个节点，必须获取这个节点对应的 **Dom** 对象实例。
		 * 最常用的创建 **Dom** 对象实例的方法是 {@link Dom.get}。如:
		 * <pre>
		 * var myDiv = Dom.get("myDivId");
		 * 
		 * myDiv.addClass("cssClass");
		 * </pre>
		 * 其中，myDiv就是一个 **Dom** 对象。然后通过 **Dom** 对象提供的方法可以方便地操作这个节点。<br>
		 * myDiv.node 属性就是这个 Dom 对象对应的原生 HTML 节点。即:
		 * <pre>
		 * Dom.get("myDivId").node === document.getElementById("myDivId");
		 * </pre>
		 * 
		 * **Dom** 类仅实现了对一个节点的操作，如果需要同时处理多个节点，可以使用 {@link Dom} 类。
		 * 	{@link Dom} 类的方法和 **Dom** 类的方法基本一致。
		 */
		Dom = Base.extend({

		    /**
			 * 获取当前集合的节点个数。
			 * @type {Number}
			 * @property
			 */
		    length: 0,

		    /**
			 * @constructor
			 */
		    constructor: function (nodelist) {
		        if (nodelist) {
		            var i = 0;
		            while (nodelist[i])
		                this[this.length++] = nodelist[i++];
		        }
		    },

		    item: function (index) {
		        var node = this[index < 0 ? this.length + index : index];
		        return new Dom(node && [node]);
		    },

		    add: function (value) {
		        this.push.apply(this, Dom.query(value));
		        return this;
		    },

		    /**
	         * 遍历 Dom 对象，并对每个元素执行 setter。
	         */
		    iterate: function (fn, args) {
		        var i = 0, len = this.length;
		        ap.unshift.call(args, 0);
		        while (i < len) {
		            args[0] = this[i++];
		            fn.apply(Dom, args);
		        }
		        return this;
		    },

		    map: function (fn, args) {
		        var me = this, ret = new me.constructor(), t;
		        for (var i = 0 ; i < me.length; i++) {
		            if (t = fn(me[i], args)) {
		                if (t instanceof Dom) {
		                    ret.push.apply(ret, t);
		                } else {
		                    ret.push(t);
		                }
		            }
		        }
		        return ret;
		    },

		    filter: function (selector) {
		        return this.map(typeof selector === 'string' ? function (elem, selector) {
		            return Dom.match(elem, selector) && elem;
		        } : function (elem, selector) {
		            return fn(elem) !== false && elem;
		        }, selector);
		    }

		}),

		/**
		 * Dom.prototype 简写。
		 */
		dp = Dom.prototype;

    // 复制数组函数。
    map("push indexOf each forEach splice slice sort unique", function (fnName, index) {
        dp[fnName] = index < 4 ? ap[fnName] : function () {
            return new Dom(ap[fnName].apply(this, arguments));
        };
    });

    //#endregion

    //#region Selector

    /**
	 * 一个选择器引擎。
	 */
    var Selector, fixGetElementById, nativeQuerySelector, nativeMatchesSelector, rBackslash = /\\/g;

    (function () {
        var div = document.createElement("div");
        div.innerHTML = '<a name="__SELECTOR__"/>';
        html.appendChild(div);

        fixGetElementById = !!document.getElementById('__SELECTOR__');
        nativeQuerySelector = !!div.querySelectorAll;
        nativeMatchesSelector = div.matchesSelector || div.mozMatchesSelector || div.webkitMatchesSelector;

        html.removeChild(div);
        div = null;
    })();

    function addElementsByTagName(elem, tagName, result) {

        if (elem.getElementsByTagName) {
            pushResult(elem.getElementsByTagName(tagName), result);
        } else if (elem.querySelectorAll) {
            pushResult(elem.querySelectorAll(tagName), result);
        }

    }

    function pushResult(nodelist, result) {
        for (var i = 0; nodelist[i]; i++) {
            result[result.length++] = nodelist[i];
        }
    }

    /**
	 * 抛出选择器语法错误。 
	 * @param {String} message 提示。
	 */
    function throwError(message) {
        throw new SyntaxError('An invalid or illegal string was specified : "' + message + '"!');
    }

    Selector = {

        all: function (selector, context) {

            context = context || document;

            // 如果原生支持 querySelectorAll, 则先尝试使用原生的。
            if (nativeQuerySelector) {

                // hack: div.query('div selector') 应该返回空。
                if (context.nodeType === 1) {

                    var oldId = context.id, displayId = oldId;

                    if (!oldId) {
                        context.id = displayId = '__SELECTOR__';
                        oldId = 0;
                    }

                    try {
                        return new Dom(context.querySelectorAll('#' + displayId + ' ' + selector));
                    } catch (e) {
                    } finally {
                        if (oldId === 0) {
                            context.removeAttribute('id');
                        }
                    }
                } else {
                    try {
                        return new Dom(context.querySelectorAll(selector));
                    } catch (e) {

                    }
                }

            }

            return Selector.query(selector, context);
        },

        one: function (selector, context) {

            context = context || document;

            // 如果原生支持 querySelectorAll, 则先尝试使用原生的。
            if (nativeQuerySelector) {

                // hack: div.query('div selector') 应该返回空。
                if (context.nodeType === 1) {

                    var oldId = context.id, displayId = oldId;

                    if (!oldId) {
                        context.id = displayId = '__SELECTOR__';
                        oldId = 0;
                    }

                    try {
                        return context.querySelector('#' + displayId + ' ' + selector);
                    } catch (e) {
                    } finally {
                        if (oldId === 0) {
                            context.removeAttribute('id');
                        }
                    }
                } else {
                    try {
                        return context.querySelector(selector);
                    } catch (e) {

                    }
                }

            }

            return Selector.query(selector, context)[0] || null;
        },

        /**
		 * 检查当前 Dom 对象是否符合指定的表达式。
		 * @param {String} String
		 * @return {Boolean} 如果匹配表达式就返回 true，否则返回  false 。
		 * @example
		 * 由于input元素的父元素是一个表单元素，所以返回true。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;form&gt;&lt;input type="checkbox" /&gt;&lt;/form&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("input[type='checkbox']").match("input")</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">true</pre>
		 */
        match: function (elem, selector, context) {

            //if (elem.nodeType !== 1)
            //	return false;

            // 判断的第一步：使用原生的判断函数。

            try {
                return nativeMatchesSelector.call(elem, selector.replace(/\[([^=]+)=\s*([^'"\]]+?)\s*\]/g, '[$1="$2"]'));
            } catch (e) {

            }

            // 判断的第二步：使用简单过滤器。

            var t = [elem], i, doc = elem.ownerDocument;

            if (!Selector.filter(selector, t)) {
                return t.length > 0;
            }

            // 判断的第三步：使用查询的方式判断。

            context = context || doc;

            // 未添加到 DOM 树的节点是无法找到的，因此，首先将节点追加到 DOM 树进行判断。
            if (Dom.contains(doc.body, elem)) {
                try {
                    t = context.querySelectorAll(selector);
                } catch (e) {
                    t = Selector.query(selector, context);
                }
            } else {

                i = elem;
                while (i.parentNode)
                    i = i.parentNode;

                doc.documentElement.appendChild(i);

                try {
                    t = Selector.all(selector, context);
                } finally {
                    doc.documentElement.removeChild(i);
                }
            }

            for (i = 0; t[i]; i++)
                if (t[i] === elem)
                    return true;

            return false;
        },

        /**
		 * 使用指定的选择器代码对指定的结果集进行一次查找。
		 * @param {String} selector 选择器表达式。
		 * @param {DomList/Dom} result 上级结果集，将对此结果集进行查找。
		 * @return {DomList} 返回新的结果集。
		 */
        query: function (selector, context) {

            var result = new Dom(),
				match,
				value,
				prevResult,
				lastSelector,
				elem,
				i;

            selector = selector.trim();

            // 解析的第一步: 解析简单选择器

            // ‘*’ ‘tagName’ ‘.className’ ‘#id’
            if (match = /^(^|[#.])((?:[-\w]|[^\x00-\xa0]|\\.)+)$/.exec(selector)) {

                value = match[2].replace(rBackslash, "");

                switch (match[1]) {

                    // ‘#id’
                    case '#':

                        // 仅对 document 使用 getElementById 。
                        if (context.nodeType === 9) {
                            prevResult = context.getElementById(value);
                            if (prevResult && (!fixGetElementById || prevResult.getAttributeNode("id").nodeValue === value)) {
                                result[result.length++] = prevResult;
                            }
                            return result;
                        }

                        break;

                        // ‘.className’
                    case '.':

                        // 仅优化存在 getElementsByClassName 的情况。
                        if (context.getElementsByClassName) {
                            pushResult(context.getElementsByClassName(value), result);
                            return result;
                        }

                        break;

                        // ‘*’ ‘tagName’
                    default:
                        addElementsByTagName(context, value, result);
                        return result;

                }

            }

            // 解析的第二步: 获取所有子节点。并不断进行筛选。

            prevResult = [context];

            // 解析分很多步进行，每次解析  selector 的一部分，直到解析完整个 selector 。
            for (; ;) {

                // 保存本次处理前的选择器。
                // 用于在本次处理后检验 selector 是否有变化。
                // 如果没变化，说明 selector 不能被正确处理，即 selector 包含非法字符。
                lastSelector = selector;

                // 解析的第三步: 获取所有子节点。第四步再一一筛选。
                // 针对子选择器和标签选择器优化(不需要获取全部子节点)。

                // ‘ selector’ ‘>selector’ ‘~selector’ ‘+selector’
                if (match = /^\s*([>+~\s])\s*(\*|(?:[-\w*]|[^\x00-\xa0]|\\.)*)/.exec(selector)) {

                    selector = RegExp.rightContext;
                    value = match[2].replace(rBackslash, "").toUpperCase() || "*";

                    for (i = 0; elem = prevResult[i]; i++) {
                        switch (match[1]) {
                            case ' ':
                                addElementsByTagName(elem, value, result);
                                break;

                            case '>':
                                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                                    if (elem.nodeType === 1 && (value === "*" || value === elem.tagName)) {
                                        result[result.length++] = elem;
                                    }
                                }
                                break;

                            case '+':
                                while (elem = elem.nextSibling) {
                                    if (elem.nodeType === 1) {
                                        if ((value === "*" || value === elem.tagName)) {
                                            result[result.length++] = elem;
                                        }
                                        break;
                                    }
                                }

                                break;

                            case '~':
                                while (elem = elem.nextSibling) {
                                    if (elem.nodeType === 1 && (value === "*" || value === elem.tagName)) {
                                        result[result.length++] = elem;
                                    }
                                }
                                break;

                            default:
                                throwError(match[0]);
                        }
                    }


                } else {

                    // ‘tagName’ ‘*’ 
                    if (match = /^((?:[-\w\*]|[^\x00-\xa0]|\\.)+)/.exec(selector)) {
                        value = match[1].replace(rBackslash, "").toUpperCase();
                        selector = RegExp.rightContext;
                    } else {
                        value = "*";
                    }

                    for (i = 0; elem = prevResult[i]; i++) {
                        addElementsByTagName(elem, value, result);
                    }

                }

                if (prevResult.length > 1) {
                    result.unique();
                }

                // 解析的第四步: 筛选第三步返回的结果。

                // 如果没有剩余的选择器，说明节点已经处理结束。
                if (selector) {

                    // 进行过滤筛选。
                    selector = Selector.filter(selector, result);

                }

                // 如果筛选后没有其它选择器。返回结果。
                if (!selector) {
                    break;
                }

                // 解析的第五步: 解析, 如果存在，则继续。

                // ‘,selectpr’ 
                if (match = /^\s*,\s*/.exec(selector)) {
                    result.add(Selector.query(RegExp.rightContext, context)).unique();
                    break;
                }

                // 存储当前的结果值，用于下次继续筛选。
                prevResult = result;

                // 清空之前的属性值。
                result = new Dom();

                // 如果没有一个正则匹配选择器，则这是一个无法处理的选择器，向用户报告错误。
                if (lastSelector.length === selector.length) {
                    throwError(selector);
                }
            }

            return result;
        },

        filter: function (selector, result) {

            var match, filterFn, value, code;

            // ‘#id’ ‘.className’ ‘:filter’ ‘[attr’
            while (match = /^([#\.:]|\[\s*)((?:[-\w]|[^\x00-\xa0]|\\.)+)/.exec(selector)) {

                selector = RegExp.rightContext;

                if (result.length) {

                    code = match[0];

                    filterFn = (Selector.filterFn || (Selector.filterFn = {}))[code];

                    // 如果不存在指定过滤器的特定函数，则先编译一个。
                    if (!filterFn) {

                        filterFn = 'for(var n=0,i=0,e,t;e=r[i];i++){t=';
                        value = match[2].replace(rBackslash, "");

                        switch (match[1]) {

                            // ‘#id’
                            case "#":
                                filterFn += 'Dom.getAttr(e,"id")===v';
                                break;

                                // ‘.className’
                            case ".":
                                filterFn += 'Dom.hasClass(e,v)';
                                break;

                                // ‘:filter’
                            case ":":

                                filterFn += Selector.pseudos[value] || throwError(match[0]);

                                // ‘selector:nth-child(2)’
                                if (match = /^\(\s*("([^"]*)"|'([^']*)'|[^\(\)]*(\([^\(\)]*\))?)\s*\)/.exec(selector)) {
                                    selector = RegExp.rightContext;
                                    value = match[3] || match[2] || match[1];
                                }

                                break;

                                // ‘[attr’
                            default:
                                value = [value.toLowerCase()];

                                // ‘selector[attr]’ ‘selector[attr=value]’ ‘selector[attr='value']’  ‘selector[attr="value"]’    ‘selector[attr_=value]’
                                if (match = /^\s*(?:(\S?=)\s*(?:(['"])(.*?)\2|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/.exec(selector)) {
                                    selector = RegExp.rightContext;
                                    if (match[1]) {
                                        value[1] = match[1];
                                        value[2] = match[3] || match[4];
                                        value[2] = value[2] ? value[2].replace(/\\([0-9a-fA-F]{2,2})/g, function (x, y) {
                                            return String.fromCharCode(parseInt(y, 16));
                                        }).replace(rBackslash, "") : "";
                                    }
                                }

                                filterFn += 'Dom.getAttr(e,v[0])' + (Selector.relative[value[1]] || throwError(code));

                        }

                        filterFn += ';if(t)r[n++]=e;}while(r.length>n)delete r[--r.length];';

                        Selector.filterFn[code] = filterFn = new Function('r', 'v', filterFn);

                        filterFn.value = value;

                    }

                    filterFn(result, filterFn.value);

                }

            }

            return selector;

        },

        /**
		 * 用于查找所有支持的伪类的函数集合。
		 * @private
		 * @static
		 */
        pseudos: {
            target: 'window.location&&window.location.hash;t=t&&t.slice(1)===e.id',
            empty: 'Dom.isEmpty(e)',
            contains: 'Dom.getText(e).indexOf(v)>=0',
            hidden: 'Dom.isHidden(e)',
            visible: '!Dom.isHidden(e)',

            not: '!Dom.match(e, v)',
            has: '!Dom.find(v, e)',

            selected: 'Dom.attrHooks.selected.get(e, "selected", 1)',
            checked: 'e.checked',
            enabled: 'e.disabled===false',
            disabled: 'e.disabled===true',

            input: '^(input|select|textarea|button)$/i.test(e.nodeName)',

            "nth-child": 'Dom.index(elem)+1;t=v==="odd"?t%2:v==="even"?t%2===0:t===v',
            "first-child": '!Dom.prev(elem)',
            "last-child": '!Dom.next(elem)',
            "only-child": '!Dom.prev(elem)&&!Dom.next(elem)'

        },

        relative: {
            'undefined': '!=null',
            '=': '===v[2]',
            '~=': ';t=(" "+t+" ").indexOf(" "+v[2]+" ")>=0',
            '!=': '!==v[2]',
            '|=': ';t=("-"+t+"-").indexOf("-"+v[2]+"-")>=0',
            '^=': ';t=t&&t.indexOf(v[2])===0',
            '$=': ';t=t&&t.indexOf(v[2].length-t.length)===v[2]',
            '*=': ';t=t&&t.indexOf(v[2])>=0'
        }

    };

    //#endregion

    //#region Parse

    /**
     * 新元素缓存。
     * @type Object
     * @remark 在 Dom.parse 使用。
     */
    var parseCache = {},

        /**
         * 对 HTML 字符串进行包装用的字符串。
         * @type Object 部分元素只能属于特定父元素， parseFix 列出这些元素，并使它们正确地添加到父元素中。 IE678
         *       会忽视第一个标签，所以额外添加一个 div 标签，以保证此类浏览器正常运行。
         * @remark 在 Dom.parse 和 Dom#setHtml 使用。
         */
        parseFix = Dom.parseFix = {
            $default: isIE678 ? [1, '$<div>', '</div>'] : [0, '', ''],
            option: [1, '<select multiple="multiple">', '</select>'],
            legend: [1, '<fieldset>', '</fieldset>'],
            thead: [1, '<table>', '</table>'],
            tr: [2, '<table><tbody>', '</tbody></table>'],
            td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
            col: [3, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
            area: [1, '<map>', '</map>']
        },

        /**
         * 判断选择框的正则表达式。
         * @type RegExp
         * @remark Dom.parse 和 Dom#clone 使用。
         */
        rCheckBox = /^(?:checkbox|radio)$/,

        /**
         * 处理 <div/> 格式标签的正则表达式。
         * @type RegExp
         */
        rXhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig;

    // 初始化 parseFix。
    parseFix.optgroup = parseFix.option;
    parseFix.tbody = parseFix.tfoot = parseFix.colgroup = parseFix.caption = parseFix.thead;
    parseFix.th = parseFix.td;

    /**
     * 解析一个 html 字符串，返回相应的原生节点。
     * @param {String/Element} html 要解析的 HTML 字符串。如果解析的字符串是一个 HTML 字符串，则此函数会忽略字符串前后的空格。
     * @param {Element} context=document 生成节点使用的文档中的任何节点。
     * @param {Boolean} cachable=true 指示是否缓存节点。这会加速下次的解析速度。
     * @return {Element/TextNode/DocumentFragment} 如果 HTML 是纯文本，返回 TextNode。如果 HTML 包含多个节点，返回 DocumentFragment 。否则返回 Element。
     * @static
     */
    Dom.parseNode = function (html, context, cachable) {

        // 不是 html，直接返回。
        if (typeof html === 'string') {

            var srcHTML = html, div, tag, wrap;

            // 仅缓存 512B 以内的 HTML 字符串。
            cachable = cachable !== false && srcHTML.length < 512;
            context = context && context.ownerDocument || document;

            ////assert(context.createElement, 'Dom.parseNode(html, context, cachable): {context} 必须是 DOM 节点。', context);

            // 查找是否存在缓存。
            if (cachable && (html = parseCache[srcHTML]) && html.ownerDocument === context) {

                // 复制并返回节点的副本。
                html = html.cloneNode(true);

            } else {

                // 测试查找 HTML 标签。
                if (tag = /<([!\w:]+)/.exec(srcHTML)) {

                    ////assert.isString(srcHTML, 'Dom.parseNode(html, context, cachable): {html} ~');
                    div = context.createElement("div");

                    wrap = Dom.parseFix[tag[1].toLowerCase()] || Dom.parseFix.$default;

                    // IE8- 会过滤字符串前的空格。
                    // 为了保证全部浏览器统一行为，此处删除全部首尾空格。

                    div.innerHTML = wrap[1] + srcHTML.trim().replace(rXhtmlTag, "<$1></$2>") + wrap[2];

                    // IE67: 如果节点未添加到文档。需要重置 checkbox 的 checked 属性。
                    if (navigator.isIE67) {
                        Object.each(div.getElementsByTagName('INPUT'), function (elem) {
                            if (rCheckBox.test(elem.type)) {
                                elem.checked = elem.defaultChecked;
                            }
                        });
                    }

                    // IE 下有些标签解析会错位，这里转到实际的节点位置。
                    for (tag = wrap[0]; tag--;)
                        div = div.lastChild;

                    ////assert.isNode(div, "Dom.parseNode(html, context, cachable): 无法根据 {html} 创建节点。", srcHTML);

                    // 获取第一个节点。
                    html = div.firstChild;

                    // 如果有多个节点，则返回 Dom 对象。
                    if (html === div.lastChild) {

                        // 删除用于创建节点的父 DIV 标签。
                        div.removeChild(html);

                    } else {

                        html = new Dom;

                        cachable = false;

                        for (tag = div.firstChild; tag; tag = wrap) {

                            // 先记录 标签的下一个节点。
                            wrap = tag.nextSibling;

                            // 删除用于创建节点的父 DIV 标签。
                            div.removeChild(tag);

                            // 保存节点。
                            html.push(tag);

                        }

                    }

                    div = null;

                    // 如果可以，先进行缓存。优化下次的节点解析。
                    if (cachable && !/<(?:script|object|embed|option|style)/i.test(srcHTML)) {
                        parseCache[srcHTML] = html.cloneNode(true);
                    }

                } else {

                    // 创建文本节点。
                    html = context.createTextNode(srcHTML);
                }

            }

        }

        return html;

    };

    /**
     * 根据提供的原始 HTML 标记字符串，解析并动态创建一个节点，并返回这个节点的 Dom 对象包装对象。
     * @param {String/Node} html 用于动态创建DOM元素的HTML字符串。
     * @param {Document} ownerDocument=document 创建DOM元素所在的文档。
     * @param {Boolean} cachable=true 指示是否缓存节点。
     * @return {Dom} Dom 对象。
     * @static
     * @remark
     * 可以传递一个手写的 HTML 字符串，或者由某些模板引擎或插件创建的字符串，也可以是通过 AJAX 加载过来的字符串。但是在你创建 input 元素的时会有限制，可以参考第二个示例。当然这个字符串可以包含斜杠 (比如一个图像地址)，还有反斜杠。当创建单个元素时，请使用闭合标签或 XHTML 格式。
     * 在这个函数的内部，是通过临时创建一个元素，并将这个元素的 innerHTML 属性设置为给定的标记字符串，来实现标记到 DOM 元素转换的。所以，这个函数既有灵活性，也有局限性。
     * 
     * @example
     * 动态创建一个 div 元素（以及其中的所有内容），并将它追加到 body 元素中。
     * #####JavaScript:
     * <pre>Dom.parse("&lt;div&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;/div&gt;").appendTo(document.body);</pre>
     * #####结果:
     * <pre lang="htm" format="none">[&lt;div&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;/div&gt;]</pre>
     * 
     * 创建一个 &lt;input&gt; 元素必须同时设定 type 属性。因为微软规定 &lt;input&gt; 元素的 type 只能写一次。
     * #####JavaScript:
     * <pre>
     * // 在 IE 中无效:
     * Dom.parse("&lt;input&gt;").setAttr("type", "checkbox");
     * // 在 IE 中有效:
     * Dom.parse("&lt;input type='checkbox'&gt;");
     * </pre>        
     */
    Dom.parse = function (html, context, cachable) {
        return Dom.query(Dom.parseNode(html, context, cachable));
    };

    //#endregion

    //#region Helper

    /**
	 * 获取元素的文档。
	 * @param {Node} node 元素。
	 * @return {Document} 文档。
	 */
    function getDocument(node) {
        ////assert.isNode(node, 'Dom.getDocument(node): {node} ~', node);
        return node.ownerDocument || node.document || node;
    }

    /**
	 * 执行一个 CSS 选择器，返回一个新的 {@link Dom} 对象。
	 * @param {String/NodeList/Dom/Array/Dom} 用来查找的 CSS 选择器或原生的 DOM 节点列表。
	 * @return {Element} 如果没有对应的节点则返回一个空的 Dom 对象。
	 * @static
	 * @see Dom
	 * @example
	 * 找到所有 p 元素。
	 * #####HTML:
	 * <pre lang="htm" format="none">
	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;
	 * </pre>
	 * 
	 * #####Javascript:
	 * <pre>
	 * Dom.query("p");
	 * </pre>
	 * 
	 * #####结果:
	 * <pre lang="htm" format="none">
	 * [  &lt;p&gt;one&lt;/p&gt; ,&lt;p&gt;two&lt;/p&gt;, &lt;p&gt;three&lt;/p&gt;  ]
	 * </pre>
	 * 
	 * <br>
	 * 找到所有 p 元素，并且这些元素都必须是 div 元素的子元素。
	 * #####HTML:
	 * <pre lang="htm" format="none">
	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;</pre>
	 * 
	 * #####Javascript:
	 * <pre>
	 * Dom.query("div &gt; p");
	 * </pre>
	 * 
	 * #####结果:
	 * <pre lang="htm" format="none">
	 * [ &lt;p&gt;two&lt;/p&gt; ]
	 * </pre>
	 * 
	 * <br>
	 * 查找所有的单选按钮(即: type 值为 radio 的 input 元素)。
	 * <pre>Dom.query("input[type=radio]");</pre>
	 */
    Dom.query = function (selector, context) {

        // Dom.query("selector")
        return typeof selector === 'string' ? Selector.all(selector, context) :

				// Dom.query(dom)
				selector instanceof Dom ? selector :

					// Dom.query(node)
					selector && (selector.nodeType || selector.setInterval) ? new Dom([selector]) :

						// Dom.query()/Dom.query(nodelist)
						new Dom(selector);

    };

    /**
	 * 根据一个 *id* 或原生节点获取一个 {@link Dom} 类的实例。
	 * @param {String/Node/Dom/Dom} id 要获取元素的 id 或用于包装成 Dom 对象的任何元素，如是原生的 DOM 节点、原生的 DOM 节点列表数组或已包装过的 Dom 对象。。
	 * @return {Dom} 此函数返回是一个 Dom 类型的变量。通过这个变量可以调用所有文档中介绍的 DOM 操作函数。如果无法找到指定的节点，则返回 null 。此函数可简写为 $。
	 * @static
	 * @example
	 * 找到 id 为 a 的元素。
	 * #####HTML:
	 * <pre lang="htm" format="none">
	 * &lt;p id="a"&gt;once&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;
	 * </pre>
	 * #####JavaScript:
	 * <pre>Dom.get("a");</pre>
	 * #####结果:
	 * <pre>{&lt;p id="a"&gt;once&lt;/p&gt;}</pre>
	 * 
	 * <br>
	 * 返回 id 为 a1 的 DOM 对象
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;p id="a1"&gt;&lt;/p&gt; &lt;p id="a2"&gt;&lt;/p&gt; </pre>
	 *
	 * #####JavaScript:
	 * <pre>Dom.get(document.getElecmentById('a1')) // 等效于 Dom.get('a1')</pre>
	 * <pre>Dom.get(['a1', 'a2']); // 等效于 Dom.get('a1')</pre>
	 * <pre>Dom.get(Dom.get('a1')); // 等效于 Dom.get('a1')</pre>
	 * 
	 * #####结果:
	 * <pre>{&lt;p id="a1"&gt;&lt;/p&gt;}</pre>
	 */
    Dom.get = function (id) {
        return typeof id !== "string" ? (!id || id.nodeType || id.setInterval ? id : id[0]) || null : document.getElementById(id);
    };

    /**
	 * 执行一个 CSS 选择器，返回第一个元素对应的 {@link Dom} 对象。
	 * @param {String/NodeList/Dom/Array/Dom} 用来查找的 CSS 选择器或原生的 DOM 节点。
	 * @return {Element} 如果没有对应的节点则返回一个空的 Dom 对象。
	 * @static
	 * @see Dom
	 * @example
	 * 找到第一个 p 元素。
	 * #####HTML:
	 * <pre lang="htm" format="none">
	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;
	 * </pre>
	 * 
	 * #####Javascript:
	 * <pre>
	 * Dom.find("p");
	 * </pre>
	 * 
	 * #####结果:
	 * <pre lang="htm" format="none">
	 * {  &lt;p&gt;one&lt;/p&gt;  }
	 * </pre>
	 * 
	 * <br>
	 * 找到第一个 p 元素，并且这些元素都必须是 div 元素的子元素。
	 * #####HTML:
	 * <pre lang="htm" format="none">
	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;</pre>
	 * 
	 * #####Javascript:
	 * <pre>
	 * Dom.find("div &gt; p");
	 * </pre>
	 * 
	 * #####结果:
	 * <pre lang="htm" format="none">
	 * { &lt;p&gt;two&lt;/p&gt; }
	 * </pre>
	 */
    Dom.find = function (selector, context) {
        return typeof selector !== "string" ? (!selector || selector.nodeType || selector.setInterval ? selector : selector[0]) || null : Selector.one(selector, context);
    };

    Dom.match = function (elem, selector, context) {
        return elem.nodeType === 1 && Selector.match(elem, selector, context);
    };

    /**
	 * 获取当前类对应的数据字段。
	 * @protected override
	 * @return {Object} 一个可存储数据的对象。
	 * @remark
	 * 此函数会在原生节点上创建一个 $data 属性以存储数据。
	 */
    Dom.data = function (node) {

        // 将数据绑定在原生节点上。
        // 这在 IE 6/7 存在内存泄露问题。由于 IE 6/7 即将退出市场。此处忽略。
        return (node.nodeType === 1 || node.nodeType === 9 || node.setInterval) ? node.$data || (node.$data = {}) : null;
    };

    /**
	 * 获取元素的文档。
	 * @param {Element} elem 元素。
	 * @return {Document} 文档。
	 * @static
	 */
    Dom.getDocument = getDocument;

    Dom.Selector = Selector;

    //#endregion

    //#region Attribute

    /**
	 * 默认用于获取和设置属性的函数。
	 */
    var defaultHook = {
        getProp: function (elem, name) {
            return name in elem ? elem[name] : null;
        },
        setProp: function (elem, name, value) {

            // 不对 2,3,8 节点类型设置属性。
            if ('238'.indexOf(elem.nodeType) === -1) {
                elem[name] = value;
            }
        },

        get: function (elem, name) {
            return elem.getAttribute ? elem.getAttribute(name) : this.getProp(elem, name);
        },
        set: function (elem, name, value) {
            if (elem.setAttribute) {

                // 如果设置值为 null, 表示删除属性。
                if (value === null) {
                    elem.removeAttribute(name);
                } else {
                    elem.setAttribute(name, value);
                }
            } else {
                this.setProp(elem, name, value);
            }
        }
    },

		/**
		 * 获取和设置优先使用 prop 而不是 attr 的特殊属性的函数。
		 * @remark 在 Dom.getAtt, Dom.setAtt, Dom.getText 使用。
		 */
		propHook = {
		    get: function (elem, name, type) {
		        return type || !(name in elem) ? defaultHook.get(elem, name) : elem[name];
		    },
		    set: function (elem, name, value) {
		        if (name in elem) {
		            elem[name] = value;
		        } else {
		            defaultHook.set(elem, name, value);
		        }
		    }
		},

		/**
		 * 获取和设置返回类型是 boolean 的特殊属性的函数。
		 */
		boolHook = {
		    get: function (elem, name, type) {
		        var value = name in elem ? elem[name] : defaultHook.get(elem, name);
		        return type ? value ? name.toLowerCase() : null : !!value;
		    },
		    set: function (elem, name, value) {
		        elem[name] = value;
		    }
		},

		/**
		 * 获取和设置 FORM 专有属性的函数。
		 */
		formHook = {
		    get: function (elem, name, type) {
		        var value = defaultHook.get(elem, name);
		        if (!type && !value) {

		            // elem[name] 被覆盖成 DOM 节点，创建空的 FORM 获取默认值。
		            if (elem[name].nodeType) {
		                elem = document.createElement('form');
		            }
		            value = elem[name];
		        }
		        return value;
		    },
		    set: defaultHook.set
		},

		/**
		 * 特殊属性集合。
		 * @property
		 * @type Object
		 * @static
		 * @private
		 */
		attrFix = Dom.attrFix = {
		    innerText: 'innerText' in html ? 'innerText' : 'textContent'
		},

		/**
		 * 特殊属性集合。
		 * @property
		 * @type Object
		 * @static
		 * @private
		 */
		attrHooks = Dom.attrHooks = {

		    maxLength: {
		        get: propHook.get,
		        set: function (elem, name, value) {
		            if (value || value === 0) {
		                elem[name] = value;
		            } else {
		                defaultHook.set(elem, name, null);
		            }
		        }
		    },

		    selected: {
		        get: function (elem, name, type) {

		            // Webkit、IE 误报 Selected 属性。
		            // 通过调用 parentNode 属性修复。
		            var parent = elem.parentNode;

		            // 激活 select, 更新 option 的 select 状态。
		            if (parent) {
		                parent.selectedIndex;

		                // 同理，处理 optgroup 
		                if (parent.parentNode) {
		                    parent.parentNode.selectedIndex;
		                }
		            }

		            // type  0 => boolean , 1 => "selected",  2 => defaultSelected => "selected"
		            return name in elem ? type ? (type === 1 ? elem[name] : elem.defaultSelected) ? name : null : elem[name] : defaultHook.get(elem, name);

		        },
		        set: boolHook.set
		    },

		    checked: {
		        get: function (elem, name, type) {
		            // type  0 => boolean , 1 => "checked",  2 => defaultChecked => "checked"
		            return name in elem ? type ? (type === 1 ? elem[name] : elem.defaultChecked) ? name : null : elem[name] : defaultHook.get(elem, name);
		        },
		        set: boolHook.set
		    },

		    value: {
		        get: function (elem, name, type) {
		            // type  0/1 => "value",  2 => defaultValue => "value"
		            return name in elem ? type !== 2 ? elem[name] : elem.defaultValue : defaultHook.get(elem, name);
		        },
		        set: propHook.set
		    },

		    tabIndex: {
		        get: function (elem, name, type) {
		            // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
		            // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
		            var value = elem.getAttributeNode(name);
		            value = value && value.specified && value.value || null;
		            return type ? value : +value;
		        },
		        set: propHook.set
		    }

		},

		/**
		 * 获取文本时应使用的属性值。
		 * @private
		 * @static
		 */
		textFix = Dom.textFix = {};

    map("defaultChecked defaultSelected readOnly disabled autofocus autoplay async controls hidden loop open required scoped compact noWrap isMap declare noshade multiple noresize defer useMap", function (attr) {
        attrHooks[attr] = boolHook;
    });

    // 初始化 attrHooks。
    map("enctype encoding action method target", function (attr) {
        attrHooks[attr] = formHook;
    });

    map("readOnly tabIndex defaultChecked defaultSelected accessKey useMap contentEditable maxLength", function (value) {
        attrFix[value.toLowerCase()] = value;
    });
    map("innerHTML innerText textContent tagName nodeName nodeType nodeValue defaultValue selectedIndex cellPadding cellSpacing rowSpan colSpan frameBorder", function (value) {
        attrFix[value.toLowerCase()] = value;
        attrHooks[value] = propHook;
    });

    // 初始化 textFix。
    textFix.INPUT = textFix.SELECT = textFix.TEXTAREA = 'value';
    textFix['#text'] = textFix['#comment'] = 'nodeValue';

    if (isIE678) {

        defaultHook.get = function (elem, name) {

            if (!elem.getAttributeNode) {
                return defaultHook.getProp(elem, name);
            }

            // 获取属性节点，避免 IE 返回属性。
            name = elem.getAttributeNode(name);

            // 如果不存在节点， name 为 null ，如果不存在节点值， 返回 null。
            return name ? name.value || (name.specified ? "" : null) : null;

        };

        defaultHook.set = formHook.set = function (elem, name, value) {

            if (elem.getAttributeNode) {

                // 获取原始的属性节点。
                var node = elem.getAttributeNode(name);

                // 如果 value === null 表示删除节点。
                if (value === null) {

                    // 仅本来存在属性时删除节点。
                    if (node) {
                        node.nodeValue = '';
                        elem.removeAttributeNode(node);
                    }

                    // 本来存在属性值，则设置属性值。
                } else if (node) {
                    node.nodeValue = value;
                } else {
                    elem.setAttribute(name, value);
                }

            } else {
                defaultHook.setProp(elem, name, value);
            }
        };

        // IE678 无法获取 style 属性，改用 style.cssText 获取。
        attrHooks.style = {
            get: function (elem, name) {
                return elem.style.cssText.toLowerCase() || null;
            },
            set: function (elem, name, value) {
                elem.style.cssText = value || '';
            }
        };

        if (navigator.isIE67) {

            // IE 6/7 获取 Button 的value会返回文本。
            attrHooks.value = {

                _get: attrHooks.value.get,

                get: function (elem, name, type) {
                    return elem.tagName === 'BUTTON' ? defaultHook.get(elem, name) : this._get(elem, name, type);
                },

                set: function (elem, name, value) {
                    if (elem.tagName === 'BUTTON') {
                        defaultHook.set(elem, name, value);
                    } else {
                        elem.value = value || '';
                    }
                }
            };

            // IE 6/7 会自动添加值到下列属性。
            attrHooks.href = attrHooks.src = attrHooks.useMap = attrHooks.width = attrHooks.height = {

                get: function (elem, name) {
                    return elem.getAttribute(name, 2);
                },

                set: function (elem, name, value) {
                    elem.setAttribute(name, value);
                }
            };

            // IE 6/7 在设置 contenteditable 为空时报错。
            attrHooks.contentEditable = {

                get: function (elem, name) {

                    // 获取属性节点，避免 IE 返回属性。
                    name = elem.getAttributeNode(name);

                    // 如果不存在节点， name 为 null ，如果不存在节点值， 返回 null。
                    return name && name.specified ? name.value : null;

                },

                set: function (elem, name, value) {
                    if (value === null) {
                        elem.removeAttributeNode(elem.getAttributeNode(name));
                    } else {
                        defaultHook.set(elem, name, value || "false");
                    }
                }
            };

        }

    }

    /**
	 * 获取元素的属性值。
	 * @param {Node} elem 元素。
	 * @param {String} name 要获取的属性名称。
	 * @return {String} 返回属性值。如果元素没有相应属性，则返回 null 。
	 * @static
	 */
    Dom.getAttr = function (elem, name, type) {

        ////assert.isNode(elem, "Dom.getAttr(elem, name, type): {elem} ~");

        // 将小写的属性名改为骆驼形式。
        name = attrFix[name] || name;

        // 获取指定属性钩子。
        var hook = attrHooks[name];

        // 如果存在钩子，使用钩子获取属性。
        // 最后使用 defaultHook 获取。
        return hook ? hook.get(elem, name, type) : defaultHook.get(elem, name.toLowerCase(), type);

    };

    /**
	 * 设置或删除一个 HTML 属性值。
	 * @param {String} name 要设置的属性名称。
	 * @param {String} value 要设置的属性值。当设置为 null 时，删除此属性。
	 * @return this
	 * @example
	 * 为所有图像设置src属性。
	 * #####HTML:
	 * <pre lang="htm" format="none">
	 * &lt;img/&gt;
	 * &lt;img/&gt;
	 * </pre>
	 * #####JavaScript:
	 * <pre>Dom.query("img").setAttribute("src","test.jpg");</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">[ &lt;img src= "test.jpg" /&gt; , &lt;img src= "test.jpg" /&gt; ]</pre>
	 *
	 * 将文档中图像的src属性删除
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;img src="test.jpg"/&gt;</pre>
	 * #####JavaScript:
	 * <pre>Dom.query("img").setAttribute("src");</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">[ &lt;img /&gt; ]</pre>
	 */
    Dom.setAttr = function (elem, name, value) {

        name = attrFix[name] || name;

        var hook = attrHooks[name];

        if (!hook) {
            hook = defaultHook;
            name = name.toLowerCase();
        }

        hook.set(elem, name, value);

    };

    /**
	 * 获取一个元素对应的文本。
	 * @param {Element} elem 元素。
	 * @return {String} 值。对普通节点返回 text 属性。
	 * @static
	 */
    Dom.getText = function (node) {
        ////assert.isNode(node, "Dom.getText(node, name): {node} ~");
        return node[textFix[node.nodeName] || attrFix.innerText] || '';
    };

    /**
	 * 设置当前 Dom 对象的文本内容。对于输入框则设置其输入的值。
	 * @param {String} 用于设置元素内容的文本。
	 * @return this
	 * @see #setHtml
	 * @remark 与 {@link #setHtml} 类似, 但将编码 HTML (将 "&lt;" 和 "&gt;" 替换成相应的HTML实体)。
	 * @example
	 * 设定文本框的值。
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;input type="text"/&gt;</pre>
	 * #####JavaScript:
	 * <pre>Dom.query("input").setText("hello world!");</pre>
	 */
    Dom.setText = function (node, value) {
        node[textFix[node.nodeName] || attrFix.innerText] = value;
    };

    /**
	 * 取得当前 Dom 对象的html内容。
	 * @return {String} HTML 字符串。
	 * @example
	 * 获取 id="a" 的节点的内部 html。
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;p/&gt;&lt;/div&gt;</pre>
	 * #####JavaScript:
	 * <pre>$Dom.query("a").getHtml();</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">"&lt;p/&gt;"</pre>
	 */
    Dom.getHtml = function (elem) {
        return elem.innerHTML;
    };

    /**
	 * 设置当前 Dom 对象的 Html 内容。
	 * @param {String} value 用于设定HTML内容的值。
	 * @return this
	 * @example
	 * 设置一个节点的内部 html
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;p/&gt;&lt;/div&gt;</pre>
	 * #####JavaScript:
	 * <pre>Dom.get("a").setHtml("&lt;a/&gt;");</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;a/&gt;&lt;/div&gt;</pre>
	 */
    Dom.setHtml = function (elem, value) {

        // 如果存在 <script> 或 <style> ，则不能使用 innerHTML 设置。
        if (!/<(?:script|style)/i.test(value)) {
            var wrap = parseFix.$default;

            try {

                // 对每个子元素清空内存。
                // each(elem.getElementsByTagName("*"), clean);

                // 内部执行 innerHTML 。
                elem.innerHTML = (wrap[1] + value + wrap[2]).replace(rXhtmlTag, "<$1></$2>");

                // IE6 需要包装节点，此处解除包装的节点。
                if (wrap[0]) {
                    wrap = elem.lastChild;
                    while (wrap.firstChild)
                        elem.appendChild(wrap.firstChild);
                    elem.removeChild(elem.firstChild);
                    elem.removeChild(wrap);
                }

                // 设置成功，返回。
                return;

                // 如果 innerHTML 出现错误，则直接使用节点方式操作。
            } catch (e) {

            }

        }

        // 使用节点的 append 方式。
        Dom.empty(elem);

        Dom.append(elem, value);
    };

    //#endregion

    //#region Style

    /**
	 * 透明度的正则表达式。
	 * @type RegExp IE8 使用滤镜支持透明度，这个表达式用于获取滤镜内的表示透明度部分的子字符串。
	 */
    var rOpacity = /opacity=([^)]*)/,

		//#if CompactMode

		/**
		 * 获取元素的实际的样式属性。
		 * @param {Element} elem 需要获取属性的节点。
		 * @param {String} name 需要获取的CSS属性名字。
		 * @return {String} 返回样式字符串，肯能是 undefined、 auto 或空字符串。
		 */
		getCurrentStyle = Dom.currentStyle = window.getComputedStyle ? function (elem, name) {

		    // getComputedStyle为标准浏览器获取样式。
		    ////assert.isElement(elem, "Dom.getStyle(elem, name): {elem} ~");

		    // 获取真实的样式owerDocument返回elem所属的文档对象
		    // 调用getComputeStyle的方式为(elem,null)
		    var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);

		    // 返回 , 在 火狐如果存在 IFrame， 则 computedStyle == null
		    // http://drupal.org/node/182569
		    // IE9 必须使用 getPropertyValue("filter")
		    return computedStyle ? computedStyle.getPropertyValue(name) || computedStyle[name] : null;

		} : function (elem, name) {

		    ////assert.isElement(elem, "Dom.getStyle(elem, name): {elem} ~");

		    var r, hook = styleHooks[name];

		    // 特殊样式保存在 styleHooks 。
		    if (hook && hook.compute) {
		        return hook.compute(elem);
		    }

		    // currentStyle：IE的样式获取方法,runtimeStyle是获取运行时期的样式。
		    // currentStyle是运行时期样式与style属性覆盖之后的样式
		    r = elem.currentStyle[name];

		    // 来自 jQuery
		    // 如果返回值不是一个带px的 数字。 转换为像素单位
		    if (/^-?\d/.test(r) && !/^-?\d+(?:px)?$/i.test(r)) {

		        // 保存初始值
		        var style = elem.style, left = style.left, rsLeft = elem.runtimeStyle.left;

		        // 放入值来计算
		        elem.runtimeStyle.left = elem.currentStyle.left;
		        style.left = name === "fontSize" ? "1em" : (r || 0);
		        r = style.pixelLeft + "px";

		        // 回到初始值
		        style.left = left;
		        elem.runtimeStyle.left = rsLeft;

		    }

		    return r;
		},

		//#else

		//# getCurrentStyle = function (elem, name) {
		//#
		//# 	// 获取样式
		//# 	var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
		//#
		//# 	// 返回
		//# 	return computedStyle ? computedStyle[ name ]: null;
		//#
		//# },

		//#endif

		/**
		 * 特殊的样式集合。
		 * @property
		 * @type Object
		 * @private
	 	 * @static
		 */
		styleHooks = Dom.styleHooks = {
		    height: {
		        get: function (elem) {
		            return styleNumber(elem, "height") + "px";
		        },
		        compute: function (elem) {
		            return elem.offsetHeight === 0 ? 'auto' : elem.offsetHeight - Dom.calc(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight') + 'px';
		        },
		        set: function (elem, value) {
		            elem.style.height = value > 0 ? value + 'px' : value <= 0 ? '0px' : value;
		        }
		    },
		    width: {
		        get: function (elem) {
		            return styleNumber(elem, "width") + "px";
		        },
		        compute: function (elem) {
		            return elem.offsetWidth === 0 ? 'auto' : elem.offsetWidth - Dom.calc(elem, 'borderTopWidth+borderBottomWidth+paddingLeft+paddingRight') + 'px';
		        },
		        set: function (elem, value) {
		            elem.style.width = value > 0 ? value + 'px' : value <= 0 ? '0px' : value;
		        }
		    },
		    'float': {

		        // IE：styleFloat Other：cssFloat
		        name: 'cssFloat' in html.style ? 'cssFloat' : 'styleFloat',
		        get: function (elem) {
		            return styleString(elem, this.name);
		        },
		        set: function (elem, value) {
		            elem.style[this.name] = value;
		        }
		    }
		};

    //#if CompactMode

    if (typeof html.style.opacity === 'undefined') {
        styleHooks.opacity = {

            get: function (elem, value) {
                return rOpacity.test(styleString(elem, 'filter')) ? parseInt(RegExp.$1) / 100 + '' : '1';
            },

            set: function (elem, value) {
                var style = elem.style;

                ////assert(!+value || (value <= 1 && value >= 0), 'Dom#setStyle("opacity", value): {value} 必须在 0~1 间。', value);
                ////assert.isElement(elem, "Dom#setStyle(name, value): 当前 dom 不支持样式");

                if (value)
                    value *= 100;
                value = value || value === 0 ? 'opacity=' + value : '';

                // 获取真实的滤镜。
                elem = styleString(elem, 'filter');

                ////assert(!/alpha\([^)]*\)/i.test(elem) || rOpacity.test(elem), 'Dom#setOpacity(value): 当前元素的 {filter} CSS属性存在不属于 alpha 的 opacity， 将导致 setOpacity 不能正常工作。', elem);

                // 当元素未布局，IE会设置失败，强制使生效。
                style.zoom = 1;

                // 设置值。
                style.filter = rOpacity.test(elem) ? elem.replace(rOpacity, value) : (elem + ' alpha(' + value + ')');

                return this;

            }
        };

        styleHooks.opacity.compute = styleHooks.opacity.get;
    }

    if (typeof html.style.userSelect === 'undefined') {
        styleHooks.userSelect = {
            get: function (elem) {
                return styleString(elem, 'userSelect');
            },

            unselectable: 'unselectable' in html ? function (elem, value) {
                elem.unselectable = value ? 'on' : '';
            } : 'onselectstart' in html ? function (elem, value) {
                elem.onselectstart = value ? function () { return false; } : null;
            } : function (elem, value) {
                elem.style.MozUserSelect = value ? 'none' : '';
            },

            set: function (elem, value) {

                if (value === 'none') {
                    this.unselectable(elem, true);
                } else if (elem.style.userSelect === 'none') {
                    this.unselectable(elem, false);
                }

                elem.style.userSelect = value;
            }
        };
    }

    //#endif

    /**
	 * 到骆驼模式。
	 * @param {String} all 全部匹配的内容。
	 * @param {String} match 匹配的内容。
	 * @return {String} 返回的内容。
	 */
    function toUpperCase(all, match) {
        return match.toUpperCase();
    }

    /**
	 * 读取样式字符串。
	 * @param {Element} elem 元素。
	 * @param {String} name 属性名。
	 * @return {String} 字符串。
	 */
    function styleString(elem, name) {
        ////assert.isElement(elem, "Dom.styleString(elem, name): {elem} ~");
        return elem.style[name] || getCurrentStyle(elem, name);
    }

    /**
	 * 读取样式数字。
	 * @param {Object} elem 元素。
	 * @param {Object} name 属性名。
	 * @return {Number} 数字。
	 */
    function styleNumber(elem, name) {
        //////assert.isElement(elem, "Dom.styleNumber(elem, name): {elem} ~");

        var style = elem.style, value;

        if (style) {

            // 优先从 style 获取。
            value = style[name];

            // 如果已经制定了一个 0px 格式的数字，直接返回。
            if (value && /^[\d\.]+px$/.test(value)) {
                value = parseFloat(value);
            } else {

                // 如果获取不到值，则从 currentStyle 获取。
                value = parseFloat(getCurrentStyle(elem, name));

                // value 不能使 NaN
                if (!value && value !== 0) {

                    // 处理 width/height，必须在 display 不是 none 的时候进行获取。
                    if (name in styleHooks) {

                        var styles = {};
                        for (var name in Dom.displayFix) {
                            styles[name] = style[name];
                        }

                        extend(style, Dom.displayFix);
                        value = parseFloat(getCurrentStyle(elem, name)) || 0;
                        extend(style, styles);
                    } else {
                        value = 0;
                    }
                }
            }

        } else if (elem.nodeType === 9) {
            elem = elem.documentElement;

            value = name === "height" ? elem.clientHeight :
				name === "width" ? elem.clientWidth :
				styleNumber(elem, name);

        }

        return value;
    }

    /**
	 * 不需要单位的 css 属性。
	 * @static
	 * @type Object
	 */
    Dom.styleNumbers = map('fillOpacity fontWeight lineHeight opacity orphans widows zIndex zoom', function () {
        return true;
    }, {});

    /**
	 * 显示元素的样式。
	 * @static
	 * @type Object
	 */
    Dom.displayFix = {
        position: "absolute",
        visibility: "visible",
        display: "block"
    };

    Dom.camelCase = function (name) {
        return name.replace(/-(\w)/g, toUpperCase);
    };

    /**
	 * 根据不同的内容进行计算。
	 * @param {Element} elem 元素。
	 * @param {String} type 要计算的值。一个 type 是一个 js 表达式，它有一些内置的变量来表示元素的相关计算值。预定义的变量有：
	 *
	 *		- ml: marginLeft (同理有 r=right, t=top, b=bottom，x=left+right,y=top+bottom 下同)
	 *		- bl: borderLeftWidth
	 *		- pl: paddingLeft
	 *		- sx: bl + pl + height (同理有 y)
	 *		- css 样式: 如 height, left
	 *
	 * @return {Number} 计算值。
	 * @static
	 */
    Dom.calc = (function () {

        /**
		 * 样式表。
		 * @static
		 * @type Object
		 */
        var parseCache = {},

			init,

			tpl;

        if (window.getComputedStyle) {
            init = 'var c=e.ownerDocument.defaultView.getComputedStyle(e,null);return ';
            tpl = '(parseFloat(c["#"])||0)';
        } else {
            init = 'return ';
            tpl = '(parseFloat(Dom.getStyle(e, "#"))||0)';
        }

        /**
		 * 翻译 type。
		 * @param {String} type 输入字符串。
		 * @return {String} 处理后的字符串。
		 */
        function format(type) {
            return tpl.replace('#', type);
        }

        return function (elem, type) {
            ////assert.isElement(elem, "Dom.calc(elem, type): {elem} ~");
            ////assert.isString(type, "Dom.calc(elem, type): {type} ~");
            return (parseCache[type] || (parseCache[type] = new Function("e", init + type.replace(/\w+/g, format))))(elem);
        }
    })();

    /**
	 * 设置一个元素可拖动。
	 * @param {Element} elem 要设置的节点。
	 * @static
	 */
    Dom.movable = function (elem) {
        ////assert.isElement(elem, "Dom.movable(elem): 参数 elem ~");
        if (!/^(?:abs|fix)/.test(styleString(elem, "position")))
            elem.style.position = "relative";
    };

    /**
	 * 读取样式数字。
	 * @param {Element} elem 元素。
	 * @param {String} name 属性名。必须使用骆驼规则的名字。
	 * @return {String} 字符串。
	 * @static
	 */
    Dom.styleString = styleString;

    /**
	 * 读取样式数字。
	 * @param {Element} elem 元素。
	 * @param {String} name 属性名。必须使用骆驼规则的名字。
	 * @return {String} 字符串。
	 * @static
	 */
    Dom.styleNumber = styleNumber;

    /**
	 * 判断当前元素是否是隐藏的。
	 * @return {Boolean} 当前元素已经隐藏返回 true，否则返回  false 。
	 */
    Dom.isHidden = function (elem) {
        return styleString(elem, 'display') === 'none';
    };

    ///**
    // * 获取一个标签的默认 display 属性。
    // * @param {Element} elem 元素。
    // */
    //Dom.defaultDisplay = function (elem) {
    //    var displays = Dom.displays || (Dom.displays = {}),
    //		tagName = elem.tagName,
    //		display = displays[tagName],
    //		iframe,
    //		iframeDoc;

    //    if (!display) {

    //        elem = document.createElement(tagName);
    //        document.body.appendChild(elem);
    //        display = getCurrentStyle(elem, 'display');
    //        document.body.removeChild(elem);

    //        // 如果简单的测试方式失败。使用 IFrame 测试。
    //        if (display === "none" || display === "") {
    //            iframe = document.body.appendChild(Dom.emptyIframe || (Dom.emptyIframe = Object.extend(document.createElement("iframe"), {
    //                frameBorder: 0,
    //                width: 0,
    //                height: 0
    //            })));

    //            // Create a cacheable copy of the iframe document on first call.
    //            // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
    //            // document to it; WebKit & Firefox won't allow reusing the iframe document.
    //            iframeDoc = (iframe.contentWindow || iframe.contentDocument).document;
    //            iframeDoc.write("<!doctype html><html><body>");
    //            iframeDoc.close();

    //            elem = iframeDoc.body.appendChild(iframeDoc.createElement(tagName));
    //            display = getCurrentStyle(elem, 'display');
    //            document.body.removeChild(iframe);
    //        }

    //        displays[tagName] = display;
    //    }

    //    return display;
    //},

    ///**
    // * 通过设置 display 属性来显示元素。
    // * @param {Element} elem 元素。
    // * @static
    // */
    //Dom.show = function (elem) {
    //    ////assert.isElement(elem, "Dom.show(elem): {elem} ~");

    //    // 普通元素 设置为 空， 因为我们不知道这个元素本来的 display 是 inline 还是 block
    //    elem.style.display = '';

    //    // 如果元素的 display 仍然为 none , 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 block。
    //    if (getCurrentStyle(elem, 'display') === 'none')
    //        elem.style.display = elem.style.defaultDisplay || Dom.defaultDisplay(elem);
    //},

    ///**
    // * 通过设置 display 属性来隐藏元素。
    // * @param {Element} elem 元素。
    // * @static
    // */
    //Dom.hide = function (elem) {
    //    ////assert.isElement(elem, "Dom.hide(elem): {elem} ~");
    //    var currentDisplay = styleString(elem, 'display');
    //    if (currentDisplay !== 'none') {
    //        elem.style.defaultDisplay = currentDisplay;
    //        elem.style.display = 'none';
    //    }
    //};

    Dom.getStyle = function (elem, name) {

        name = Dom.camelCase(name);

        // 特殊属性单独获取。
        if (name in styleHooks) {
            return styleHooks[name].get(elem);
        }

        ////assert.isString(name, "Dom#getStyle(name): {name} ~");
        ////assert(elem.style, "Dom#getStyle(name): 当 Dom 对象对应的节点不是元素，无法使用样式。");

        return elem.style[name] || getCurrentStyle(elem, name);
    };

    /**
	 * 设置一个样式属性的值。
	 * @param {String} name CSS 属性名或 CSS 字符串。
	 * @param {String/Number} [value] CSS属性值， 数字如果不加单位，则会自动添加像素单位。
	 * @return this
	 * @example
	 * 将所有段落的字体颜色设为红色并且背景为蓝色。
	 * <pre>Dom.query("p").setStyle('color', "#ff0011");</pre>
	 */
    Dom.setStyle = function (elem, name, value) {

        // 将属性名转为骆驼形式。
        name = Dom.camelCase(name);

        ////assert.isString(name, "Dom.setStyle(name, value): {name} ~");
        //     ////assert.isElement(elem, "Dom.setStyle(name, value): 当前 dom 不支持样式");

        // 特殊属性单独设置。
        if (name in styleHooks) {
            styleHooks[name].set(elem, value);
        } else {

            // 设置样式，为一些数字类型的样式自动追加单位。
            elem.style[name] = typeof value !== "number" || name in Dom.styleNumbers ? value : (value + "px");

        }
    };

    //#endregion

    //#region Event

    var emptyObj = {};

    /**
	 * 特殊处理的事件对象。
	 */
    Dom.eventFix = {};

    /**
	 * DOM 事件。
	 */
    Dom.Event = Base.extend({

        /**
		 * 构造函数。
		 * @param {Object} [e] 事件对象的属性。
		 * @constructor
		 */
        constructor: function (e) {
            if (e) {

                // IE 8- 在处理原生事件时肯能出现错误。
                try {
                    extend(this, e);
                } catch (ex) {

                }

            }
        },

        /**
         * 阻止事件的冒泡。
         * @remark 默认情况下，事件会向父元素冒泡。使用此函数阻止事件冒泡。
         */
        stopPropagation: function () {
            this.cancelBubble = true;
        },

        /**
         * 取消默认事件发生。
         * @remark 有些事件会有默认行为，如点击链接之后执行跳转，使用此函数阻止这些默认行为。
         */
        preventDefault: function () {
            this.returnValue = false;
        }

    });

    /**
	 * 初始化 DOM Event 对象，并返回一个最终传递给处理函数的 Event 对象。
	 */
    Dom.initEvent = function (e) {

        // Chrome 23+ e.target 可能是文本节点。
        var target = e.target;
        if (target.nodeType === 3) {
            target = target.parentNode;

            // e.target 为只读属性，重写 getter 覆盖。
            e.__defineGetter__("target", function () {
                return target;
            });
        }
        return e;
    };

    Dom.defineEvents = function (events, hooks) {

        var eventFix = Dom.eventFix;

        map(events, function (eventName) {

            // 支持 bind 字段：自动添加和删除指定的父事件。
            if (hooks.bindType) {

                hooks.add = function (elem, type, fn) {
                    Dom.addListener(elem, this.bindType, fn);
                };

                hooks.remove = function (elem, type, fn) {
                    defaultEvent.remove(elem, this.bind, fn);
                };
            }

            // 将已有的信息拷贝回来。
            if (eventFix[eventName]) {
                eventFix[eventName] = extend(extend({}, eventFix[eventName]), hooks);
            } else {
                eventFix[eventName] = hooks;
            }
        });
    };

    if (isIE678) {
        Dom.initEvent = function (e) {
            e.target = e.srcElement || document;
            e.stopPropagation = Dom.Event.prototype.stopPropagation;
            e.preventDefault = Dom.Event.prototype.preventDefault;
            e.which = e.keyCode;
            return e;
        };

        Dom.defineEvents("click dblclick mousedown mouseup mouseover mouseenter mousemove mouseleave mouseout contextmenu selectstart selectend", {
            initEvent: function (e) {
                e = Dom.initEvent(e);

                // 没有 target 时，重新初始化 IE 事件对象的参数。
                if (!e.target) {
                    e.relatedTarget = e.fromElement === e.srcElement ? e.toElement : e.fromElement;

                    var eventDoc = getDocument(e.target).documentElement;
                    e.pageX = e.clientX + (eventDoc.scrollLeft || 0) - (eventDoc.clientLeft || 0);
                    e.pageY = e.clientY + (eventDoc.scrollTop || 0) - (eventDoc.clientTop || 0);

                    e.layerX = e.x;
                    e.layerY = e.y;

                    // 1 ： 单击 2 ： 中键点击 3 ： 右击
                    e.which = e.button & 1 ? 1 : e.button & 2 ? 3 : e.button & 4 ? 2 : 0;

                }

                return e;
            }
        });
    }

    if (html.onfocusin === undefined) {
        Dom.defineEvents('focusin focusout', {
            add: function (elem, type, fn) {
                var doc = elem.ownerDocument || elem,
					data = Dom.data(doc);

                if (!data[type + 'Handler']) {
                    doc.addEventListener(type === 'focusin' ? 'focus' : 'blur', data[type + 'Handler'] = function (e) {
                        if (e.eventPhase <= 1) {
                            var p = elem;
                            while (p && p.parentNode) {
                                if (!Dom.trigger(p, type, e)) {
                                    return;
                                }

                                p = p.parentNode;
                            }
                        }
                    }, true);
                }
            }
        });
    }

    if (html.onmousewheel === undefined) {
        Dom.defineEvents('mousewheel', {
            bindType: 'DOMMouseScroll'
        });
    }

    // Firefox 会在右击时触发 document.onclick 。
    Dom.defineEvents('click', {

        filter: navigator.isFirefox ? function (target, e) {
            return !target.disabled && (e.which === undefined || e.which === 1);
        } : function (target, e) {
            return !target.disabled;
        }

    });

    Object.each({
        'mouseenter': 'mouseover',
        'mouseleave': 'mouseout'
    }, function (fix, orig) {
        Dom.defineEvents(orig, {

            // 处理指定的事件，如果返回 true, 说明已经处理完成。
            filter: function (target, e) {

                // 如果浏览器原生支持 mouseenter/mouseleave, 不作操作。
                return e.type === orig || !Dom.contains(target, e.relatedTarget);

            },

            bindType: html.onmouseenter === null ? null : fix,
            delegateType: fix
        });
    });

    Dom.defineEvents('focus', {
        delegateType: 'focusin'
    });

    Dom.defineEvents('blur', {
        delegateType: 'focusout'
    });

    Dom.addListener = html.addEventListener ? function (elem, type, fn) {
        elem.addEventListener(type, fn, false);
    } : function (elem, type, fn) {
        elem.attachEvent('on' + type, fn);
    };

    Dom.removeListener = html.removeEventListener ? function (elem, type, fn) {
        elem.removeEventListener(type, fn, false);
    } : function (elem, type, fn) {
        elem.detachEvent('on' + type, fn);
    };

    // 处理 DOM 事件。
    function dispatchEvent(e, eventHandler) {
        var handler,
			i,
			length,
			delegateTarget,
            target = eventHandler.target,
			filter = eventHandler.filter,
			delegateHandlers = eventHandler.delegateFn,
			actualHandlers = [];

        // 初始化和修复事件。
        e = eventHandler.initEvent(e);

        // 遍历委托处理句柄，将符合要求的句柄放入 actualHandlers 。
        if (delegateHandlers && (delegateTarget = e.target).nodeType) {

            // 从当前实际发生事件的元素开始一直往上查找，直到当前节点。
            for (; delegateTarget != target; delegateTarget = delegateTarget.parentNode || target) {

                // 获取发生事件的原始对象。
                i = 0;
                length = delegateHandlers.length;

                while (i < length) {

                    handler = delegateHandlers[i++];

                    // 如果节点满足 CSS 选择器要求，则放入队列。
                    // check 用于处理部分特殊的情况，不允许执行委托函数。（如 click 已禁用的按钮）
                    if (Dom.match(delegateTarget, handler[2], target) && (!filter || filter(delegateTarget, e) !== false)) {

                        actualHandlers.push([handler[0], handler[1] || delegateTarget]);

                    }

                }
            }

        }

        // 将普通的句柄直接复制到 actualHandlers 。
        if ((!filter || filter(target, e) !== false) && eventHandler.bindFn) {
            actualHandlers.push.apply(actualHandlers, eventHandler.bindFn);
        }

        i = 0;
        length = actualHandlers.length;

        // 循环直接以上提取的所有函数句柄。
        while (i < length) {

            handler = actualHandlers[i++];

            // 如果句柄函数返回 false, 则同时阻止事件并退出循环。
            if (handler[0].call(handler[1], e) === false) {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }

        return true;
    }

    Dom.on = function (elem, type, selector, fn, scope) {

        ////assert.isString(selector, "Dom#delegate(selector, eventName, handler): {selector}  ~");
        ////assert.isString(eventName, "Dom#delegate(selector, eventName, handler): {eventName}  ~");
        ////assert.isFunction(handler, "Dom#delegate(selector, eventName, handler): {handler}  ~");
        ////assert(eventName, "Dom#bind(eventAndSelector, handler): {eventAndSelector} 中不存在事件信息。正确的 eventAndSelector 格式： click.selector");

        var data = Dom.data(elem), eventHandler, eventFix, filter;

        // 如果指定的节点无法存储数据，则不添加函数。
        if (!data) {
            return;
        }

        if (typeof selector === 'function') {
            scope = fn;
            fn = selector;
            selector = null;
        }

        // 初始化存储事件函数的对象。
        data = data.$events || (data.$events = {});
        eventFix = Dom.eventFix[type] || emptyObj;
        filter = eventFix.filter;

        // 转为其它事件。
        if (selector && eventFix.delegateType) {
            type = eventFix.delegateType;
            eventFix = Dom.eventFix[type] || emptyObj;
        }

        eventHandler = data[type];

        // 如果不存在指定事件的处理函数，则先创建。
        if (!eventHandler) {
            data[type] = eventHandler = function (e) {
                return dispatchEvent(e, arguments.callee);
            };

            // 保存最开始的参数类型，用于以后处理。
            eventHandler.target = elem;
            eventHandler.type = type;
            eventHandler.filter = filter;
            eventHandler.initEvent = eventFix.initEvent || Dom.initEvent;

            // 第一次绑定事件时，同时会绑定 DOM 事件。
            // 如果自定义的 .add 函数返回 false，说明 add 无法处理，则添加 DOM 事件。
            if (!eventFix.add || eventFix.add(elem, type, eventHandler) === false) {
                Dom.addListener(elem, type, eventHandler);
            }
        }

        // 添加当前函数到队列末尾。
        data = [fn, scope || (selector ? 0 : elem), selector];
        type = selector ? 'delegateFn' : 'bindFn';

        if (eventFix = eventHandler[type]) {
            eventFix.push(data);
        } else {
            eventHandler[type] = [data];
        }


    };

    Dom.un = function (elem, type, selector, fn) {

        var data = (Dom.data(elem) || {}).$events || emptyObj, eventHandler = data[type], eventFix;

        // 如果不传递 type, 表示删除当前 DOM 的全部事件。
        // 如果指定的节点无法存储数据，则不添加函数。
        if (eventHandler) {

            if (typeof selector !== 'string') {
                fn = selector;
                selector = null;
            }

            // 如果指定了函数，则搜索指定的函数。
            if (fn) {

                handlers = selector ? eventHandler.delegateFn : eventHandler.bindFn;

                for (i = 0; i < handlers.length; i++) {
                    if ((handlers[i][0] === fn) || (!selector || handlers[i][2] === selector)) {
                        handlers.splice(i, 1);
                        fn = handlers.length;
                        break;
                    }
                }

            }

            // 否则，删除全部事件函数。
            if (!fn) {

                delete data[type];
                eventFix = Dom.eventFix[type];

                // 第一次绑定事件时，同时会绑定 DOM 事件。
                // 如果自定义的 .add 函数返回 false，说明 add 无法处理，则添加 DOM 事件。
                if (!eventFix || !eventFix.remove || eventFix.remove(elem, type, eventHandler) === false) {
                    Dom.removeListener(elem, type, eventHandler);
                }

            }

        } else {

            // 否则，删除全部事件函数。
            for (type in data) {
                Dom.un(elem, type);
            }

        }

    };

    Dom.trigger = function (elem, type, e) {

        var data = Dom.data(elem).$events;

        if (!data || !(data = data[type])) {
            return true;
        }

        if (!e || !e.type) {
            e = new Dom.Event(e);
            e.target = elem;
            e.type = type;
        }

        return dispatchEvent(e, data) && (!elem[type = 'on' + type] || elem[type](e) !== false);
    };

    //#endregion

    //#region Base.extend

    /**
     * 检查是否含指定类名。
     * @param {Element} elem 要测试的元素。
     * @param {String} className 类名。
     * @return {Boolean} 如果存在返回 true。
     * @static
     */
    Dom.hasClass = function (elem, className) {
        ////assert.isNode(elem, "Dom.hasClass(elem, className): {elem} ~");
        ////assert(className && (!className.indexOf || !/[\s\r\n]/.test(className)), "Dom.hasClass(elem, className): {className} 不能空，且不允许有空格和换行。如果需要判断 2 个 class 同时存在，可以调用两次本函数： if(hasClass('A') && hasClass('B')) ...");
        return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
    };

    /**
	 * 为当前 Dom 对象添加指定的 Css 类名。
	 * @param {String} className 一个或多个要添加到元素中的CSS类名，用空格分开。
	 * @return this
	 * @example
	 * 为匹配的元素加上 'selected' 类。
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;</pre>
	 * #####JavaScript:
	 * <pre>Dom.query("p").addClass("selected");</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello&lt;/p&gt; ]</pre>
	 *
	 * 为匹配的元素加上 selected highlight 类。
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;</pre>
	 * #####JavaScript:
	 * <pre>Dom.query("p").addClass("selected highlight");</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">[ &lt;p class="selected highlight"&gt;Hello&lt;/p&gt; ]</pre>
     */
    Dom.addClass = function (elem, className) {
        ////assert.isString(className, "Dom#addClass(className): {className} ~");

        var classList = className.split(/\s+/);

        className = " " + elem.className + " ";

        for (var i = 0; i < classList.length; i++) {
            if (className.indexOf(" " + classList[i] + " ") < 0) {
                className += classList[i] + " ";
            }
        }

        elem.className = className.trim();
    };

    /**
     * 从当前 Dom 对象中删除全部或者指定的类。
     * @param {String} [className] 一个或多个要删除的CSS类名，用空格分开。如果不提供此参数，将清空 className 。
     * @return this
     * @example
     * 从匹配的元素中删除 'selected' 类
     * #####HTML:
     * <pre lang="htm" format="none">
     * &lt;p class="selected first"&gt;Hello&lt;/p&gt;
     * </pre>
     * #####JavaScript:
     * <pre>Dom.query("p").removeClass("selected");</pre>
     * #####结果:
     * <pre lang="htm" format="none">
     * [ &lt;p class="first"&gt;Hello&lt;/p&gt; ]
     * </pre>
     */
    Dom.removeClass = function (elem, className) {
        ////assert(!className || className.split, "Dom#removeClass(className): {className} ~");

        if (className) {
            var classList = className.split(/\s+/);
            className = " " + elem.className + " ";
            for (var i = classList.length; i--;) {
                className = className.replace(" " + classList[i] + " ", " ");
            }
            className = className.trim();
        }
        elem.className = className;
    };

    /**
     * 如果存在（不存在）就删除（添加）一个类。
     * @param {String} className CSS类名。
     * @param {Boolean} [toggle] 自定义切换的方式。如果为 true， 则加上类名，否则删除。
     * @return this
     * @see #addClass
     * @see #removeClass
     * @example
     * 为匹配的元素切换 'selected' 类
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").toggleClass("selected");</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello&lt;/p&gt;, &lt;p&gt;Hello Again&lt;/p&gt; ]</pre>
     */
    Dom.toggleClass = function (elem, className, state) {
        Dom[(state == undefined ? Dom.hasClass(elem, className) : !state) ? 'removeClass' : 'addClass'](elem, className);
    };

    //#endregion

    //#region Traversing

    /**
	 * 返回简单的遍历函数。
	 * @param {String} next 获取下一个成员使用的名字。
	 * @param {String} first=next 获取第一个成员使用的名字。
	 * @return {Function} 遍历函数。
	 */
    function createTreeWalker(next, first) {
        first = first || next;
        return function (node, selector) {

            node = node[first];

            // 找到第一个nodeType == 1 的节点。
            while (node && node.nodeType !== 1) {
                node = node[next];
            }

            return !selector || (node && Dom.match(node, selector)) ? node : null;
        };
    }

    /**
	 * 返回简单的遍历函数。
	 * @param {String} next 获取下一个成员使用的名字。
	 * @param {String} first=next 获取第一个成员使用的名字。
	 * @return {Function} 遍历函数。
	 */
    function createTreeDir(next, first) {
        first = first || next;
        return function (node, selector) {
            var ret = new Dom();

            node = node[first];

            while (node) {
                if (node.nodeType === 1 && (!selector || Dom.match(node, selector)))
                    ret.push(node);
                node = node[next];
            }

            return ret;
        };
    }

    /**
     * 获取当前 Dom 对象的第一个子节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
     * @example
     * 获取匹配的第二个元素
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt; This is just a test.&lt;/p&gt; &lt;p&gt; So is this&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").first(1)</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p&gt; So is this&lt;/p&gt; ]</pre>
     */
    Dom.first = createTreeWalker('nextSibling', 'firstChild');

    /**
     * 获取当前 Dom 对象的最后一个子节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
     * @example
     * 获取匹配的第二个元素
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt; This is just a test.&lt;/p&gt; &lt;p&gt; So is this&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").getChild(1)</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p&gt; So is this&lt;/p&gt; ]</pre>
     */
    Dom.last = createTreeWalker('previousSibling', 'lastChild');

    /**
     * 获取当前 Dom 对象的下一个相邻节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
     * @example
     * 找到每个段落的后面紧邻的同辈元素。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;Hello Again&lt;/p&gt;&lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").getNext()</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p&gt;Hello Again&lt;/p&gt;, &lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt; ]</pre>
     */
    Dom.next = createTreeWalker('nextSibling');

    /**
     * 获取当前 Dom 对象的上一个相邻的节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
     * @example
     * 找到每个段落紧邻的前一个同辈元素。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").getPrevious()</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt; ]</pre>
     *
     * 找到每个段落紧邻的前一个同辈元素中类名为selected的元素。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;div&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/div&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").getPrevious("div")</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]</pre>
     */
    Dom.prev = createTreeWalker('previousSibling');

    /**
     * 获取当前 Dom 对象的全部直接子节点。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {NodeList} 返回满足要求的节点的列表。
     * @example
     *
     * 查找DIV中的每个子元素。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("div").getChildren()</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;span&gt;Hello Again&lt;/span&gt; ]</pre>
     *
     * 在每个div中查找 div。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;div&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;&lt;p&gt;And Again&lt;/p&gt;&lt;/div&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("div").getChildren("div")</pre>
     * #####结果:
     * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]</pre>
     */
    Dom.children = createTreeDir('nextSibling', 'firstChild');

    /**
     * 获取当前 Dom 对象以后的全部相邻节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {Dom} 返回一个 Dom 对象。
     */
    Dom.nextAll = createTreeDir('nextSibling');

    /**
     * 获取当前 Dom 对象以前的全部相邻节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {Dom} 返回一个 Dom 对象。
     */
    Dom.prevAll = createTreeDir('previousSibling');

    /**
     * 获取当前 Dom 对象以上的全部相邻节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {Dom} 返回一个 Dom 对象。
     */
    Dom.parents = createTreeDir('parentNode');

    /**
     * 获取当前 Dom 对象的在原节点的位置。
     * @param {Boolean} args=true 如果 args 为 true ，则计算文本节点。
     * @return {Number} 位置。从 0 开始。
     */
    Dom.index = function (node) {
        var i = 0;
        while (node = node.previousSibling)
            if (node.nodeType === 1)
                i++;
        return i;
    };

    /**
     * 获取当前 Dom 对象的指定位置的直接子节点。
     * @param {Integer} index 用于查找子元素的 CSS 选择器 或者 元素在 Dom 对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。如果 args 是小于 0 的数字，则从末尾开始计算。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
     * @example
     * 获取第1个子节点。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.find("span").child(1)</pre>
     */
    Dom.child = function (node, index) {

        ////assert(typeof index === 'function' || typeof index === 'number' || typeof index === 'string' , 'Dom#child(index): {index} 必须是函数、数字或字符串。');

        var first = 'firstChild',
            next = 'nextSibling';

        if (index < 0) {
            index = ~index;
            first = 'lastChild';
            next = 'previousSibling';
        }

        first = node[first];

        while (first) {
            if (first.nodeType === 1 && index-- <= 0) {
                return first;
            }

            first = first[next];
        }

        return null;
    };

    /**
     * 获取当前 Dom 对象的父节点对象。
     * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在 Dom 对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
     * @example
     * 找到每个span元素的所有祖先元素。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.find("span").parent()</pre>
     */
    Dom.parent = createTreeWalker('parentNode');

    /**
     * 编辑当前 Dom 对象及父节点对象，找到第一个满足指定 CSS 选择器或函数的节点。
     * @param {String/Function} [filter] 用于判断的元素的 CSS 选择器 或者 用于筛选元素的过滤函数。
     * @param {Dom/String} [context=document] 只在指定的节点内搜索此元素。
     * @return {Dom} 如果当前节点满足要求，则返回当前节点，否则返回一个匹配的父节点对象。如果不存在，则返回 null 。
     * @remark
     * closest 和 parent 最大区别就是 closest 会测试当前的元素。
     */
    Dom.closest = function (node, selector, context) {

        while (node) {
            if (Dom.match(node, selector)) {
                return !context || Dom.query(context).contains(node) ? node : null;
            }

            node = node.parentNode;
        }

        return null;
    };

    //#endregion

    //#region Clone

    /**
	 * 特殊属性集合。
	 * @type Object 特殊的属性，在节点复制时不会被复制，因此需要额外复制这些属性内容。
	 * @static
	 */
    Dom.cloneFix = {
        INPUT: function (srcElem, destElem) {

            if (rCheckBox.test(srcElem.type)) {

                // IE6 必须同时设置 defaultChecked 属性。
                destElem.defaultChecked = destElem.checked = srcElem.checked;

                // IE67 无法复制 value 属性。
                if (destElem.value !== srcElem.value) {
                    destElem.value = srcElem.value;
                }
            } else {
                destElem.value = srcElem.value;
            }
        },
        TEXTAREA: 'value',
        OPTION: 'selected',
        OBJECT: function (destElem, srcElem) {
            if (destElem.parentNode) {
                destElem.outerHTML = srcElem.outerHTML;

                if (srcElem.innerHTML && !destElem.innerHTML)
                    destElem.innerHTML = srcElem.innerHTML;
            }
        }
    };

    if (isIE678)
        Dom.cloneFix.SCRIPT = 'text';

    /**
	 * 删除由于拷贝导致的杂项。
	 * @param {Element} srcElem 源元素。
	 * @param {Element} destElem 目的元素。
	 * @param {Boolean} cloneDataAndEvent=true 是否复制数据。
	 * @param {Boolean} keepId=false 是否留下ID。
	 */
    function cleanClone(srcElem, destElem, cloneDataAndEvent, keepId) {

        // 删除重复的 ID 属性。
        if (!keepId && destElem.removeAttribute)
            destElem.removeAttribute('id');

        /// #if CompactMode

        if (destElem.clearAttributes) {

            // IE 会复制 自定义事件， 清楚它。
            destElem.clearAttributes();
            destElem.mergeAttributes(srcElem);
            destElem.$data = null;

            if (srcElem.options) {
                each(srcElem.options, function (value) {
                    destElem.options.seleced = value.seleced;
                });
            }
        }

        /// #endif

        if (cloneDataAndEvent !== false && (cloneDataAndEvent = srcElem.$data)) {

            destElem.$data = cloneDataAndEvent = extend({}, cloneDataAndEvent);

            // event 作为系统内部对象。事件的拷贝必须重新进行 on 绑定。
            var event = cloneDataAndEvent.$event, dest;

            if (event) {
                cloneDataAndEvent.$event = null;
                for (cloneDataAndEvent in event) {

                    // 对每种事件。
                    event[cloneDataAndEvent].bindFn.forEach(function (handler) {

                        // 如果源数据的 target 是 src， 则改 dest 。
                        Dom.on(dest, cloneDataAndEvent, handler[0], handler[1] === srcElem ? dest : handler[1]);
                    });

                    // 对每种事件。
                    event[cloneDataAndEvent].delegateFn.forEach(function (handler) {

                        // 如果源数据的 target 是 src， 则改 dest 。
                        Dom.on(dest, cloneDataAndEvent + " " + handler[2], handler[0], handler[1] === srcElem ? dest : handler[1]);
                    });
                }
            }

        }

        // 特殊属性复制。
        if (keepId = Dom.cloneFix[srcElem.tagName]) {
            if (typeof keepId === 'string') {
                destElem[keepId] = srcElem[keepId];
            } else {
                keepId(destElem, srcElem);
            }
        }
    }

    /**
	 * 创建并返回当前 Dom 对象的副本。
	 * @param {Boolean} deep=true 是否复制子元素。
	 * @param {Boolean} cloneDataAndEvent=false 是否复制数据和事件。
	 * @param {Boolean} keepId=false 是否复制 id 。
	 * @return {Dom} 新 Dom 对象。
	 *
	 * @example
	 * 克隆所有b元素（并选中这些克隆的副本），然后将它们前置到所有段落中。
	 * #####HTML:
	 * <pre lang="htm" format="none">&lt;b&gt;Hello&lt;/b&gt;&lt;p&gt;, how are you?&lt;/p&gt;</pre>
	 * #####JavaScript:
	 * <pre>Dom.query("b").clone().prependTo("p");</pre>
	 * #####结果:
	 * <pre lang="htm" format="none">&lt;b&gt;Hello&lt;/b&gt;&lt;p&gt;&lt;b&gt;Hello&lt;/b&gt;, how are you?&lt;/p&gt;</pre>
	 */
    Dom.clone = function (elem, deep, cloneDataAndEvent, keepId) {

        var clone = elem.cloneNode(deep = deep !== false);

        if (elem.nodeType === 1) {
            if (deep) {
                for (var elemChild = elem.getElementsByTagName('*'), cloneChild = clone.getElementsByTagName('*'), i = 0; cloneChild[i]; i++)
                    cleanClone(elemChild[i], cloneChild[i], cloneDataAndEvent, keepId);
            }

            cleanClone(elem, clone, cloneDataAndEvent, keepId);
        }

        return clone;
    };

    //#endregion

    //#region Manipulation

    /**
	 * 清除节点的引用。
	 * @param {Element} elem 要清除的元素。
	 */
    function clean(elem) {

        // 删除自定义属性。
        if (elem.clearAttributes)
            elem.clearAttributes();

        // 删除句柄，以删除双重的引用。
        if (elem.$data) {

            // 删除事件。
            Dom.un(elem);

            elem.$data = null;

        }

    }

    /**
	 * 判断指定节点之后有无存在子节点。
	 * @param {Element} elem 节点。
	 * @param {Element} child 子节点。
	 * @return {Boolean} 如果确实存在子节点，则返回 true ， 否则返回 false 。
	 * @static
	 */
    Dom.contains = html.compareDocumentPosition ? function (node, child) {
        ////assert.isNode(node, "Dom.contains(node, child): {elem} ~");
        ////assert.isNode(child, "Dom.contains(node, child): {child} ~");
        return node === child || !!(child && (node.compareDocumentPosition(child) & 16));
    } : function (node, child) {
        ////assert.isNode(node, "Dom.contains(elem, child): {elem} ~");
        ////assert.isNode(child, "Dom.contains(elem, child): {child} ~");
        while (child) {
            if (node === child)
                return true;
            child = child.parentNode;
        }

        return false;
    };

    Dom.manip = function (node, html, fn) {

        var dom, i, script;

        html = Dom.parseNode(html, node);

        if (!html.nodeType) {
            if (html.length > 1) {
                dom = html;
                html = getDocument(node).createDocumentFragment();
                for (i = 0; i < dom.length; i++) {
                    html.appendChild(dom[i]);
                }
            } else {
                html = html[0];
            }
        }

        dom = html.getElementsByTagName ? html.getElementsByTagName("SCRIPT") : html.querySelectorAll ? html.querySelectorAll('SCRIPT') : [];

        // IE678 不支持更新 fragment 后保持 Scripts，这时先缓存。
        if (isIE678) {
            dom = new Dom(dom);
        }

        // 实际的插入操作。
        fn(node, html);

        // 如果存在脚本，则一一执行。
        for (i = 0; script = dom[i]; i++) {
            if (!script.type || /\/(java|ecma)script/i.test(script.type)) {

                if (script.src) {
                    //#assert(window.Ajax && Ajax.send, "必须载入 ajax/script.js 模块以支持动态执行 <script src=''>");
                    Ajax.send({
                        url: script.src,
                        type: "GET",
                        dataType: 'script',
                        async: false
                    });
                } else {
                    window.execScript(script.text || script.textContent || script.innerHTML || "");
                }

            }
        }

        dom = null;

        return html;

    };

    Dom.render = function (node, parent, refNode) {
        if (parent) {
            parent.insertBefore(node, refNode || null);
        } else if (!Dom.contains(document.body, node)) {
            document.body.appendChild(node);
        }
    };

    /**
	 * 判断一个节点是否有元素节点或文本节点。
	 * @param {Element} elem 要测试的元素。
	 * @return {Boolean} 如果存在子节点，则返回 true，否则返回 false 。
	 */
    Dom.isEmpty = function (elem) {
        for (elem = elem.firstChild; elem; elem = elem.nextSibling)
            if (elem.nodeType === 1 || elem.nodeType === 3)
                return false;
        return true;
    };

    /**
	 * 插入一个HTML 到末尾。
	 * @param {String/Node/Dom} html 要插入的内容。
	 * @return {Dom} 返回插入的新节点对象。
	 */
    Dom.append = function (node, html) {
        return Dom.manip(node, html, function (node, html) {
            node.appendChild(html);
        });
    };

    /**
	 * 插入一个HTML 到顶部。
	 * @param {String/Node/Dom} html 要插入的内容。
	 * @return {Dom} 返回插入的新节点对象。
	 */
    Dom.prepend = function (node, html) {
        return Dom.manip(node, html, function (node, html) {
            node.insertBefore(html, node.firstChild);
        });
    };

    /**
	 * 插入一个HTML 到前面。
	 * @param {String/Node/Dom} html 要插入的内容。
	 * @return {Dom} 返回插入的新节点对象。
	 */
    Dom.before = function (node, html) {
        return Dom.manip(node, html, function (node, html) {
            node.parentNode && node.parentNode.insertBefore(html, node);
        });
    };

    /**
	 * 插入一个HTML 到后面。
	 * @param {String/Node/Dom} html 要插入的内容。
	 * @return {Dom} 返回插入的新节点对象。
	 */
    Dom.after = function (node, html) {
        return Dom.manip(node, html, function (node, html) {
            node.parentNode && node.parentNode.insertBefore(html, node.nextSibling);
        });
    };

    /**
     * 移除当前 Dom 对象或其子对象。
     * @param {Dom} [child] 如果指定了子对象，则删除此对象。
     * @return this
     * @see #dispose
     * @remark
     * 这个方法不会彻底移除 Dom 对象，而只是暂时将其从 Dom 树分离。
     * 如果需要彻底删除 Dom 对象，使用 {@link #dispose}方法。
     * @example
     * 从DOM中把所有段落删除。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").remove();</pre>
     * #####结果:
     * <pre lang="htm" format="none">how are</pre>
     *
     * 从DOM中把带有hello类的段落删除
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p class="hello"&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").remove(".hello");</pre>
     * #####结果:
     * <pre lang="htm" format="none">how are &lt;p&gt;you?&lt;/p&gt;</pre>
     */
    Dom.remove = function (node) {
        node.parentNode && node.parentNode.removeChild(node);
    };

    /**
     * 删除一个节点的所有子节点。
     * @return this
     * @example
     * 把所有段落的子元素（包括文本节点）删除。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello, &lt;span&gt;Person&lt;/span&gt; &lt;a href="#"&gt;and person&lt;/a&gt;&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").empty();</pre>
     * #####结果:
     * <pre lang="htm" format="none">&lt;p&gt;&lt;/p&gt;</pre>
     */
    Dom.empty = function (node) {

        // 删除全部节点。
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }

        // IE678 中, 删除 <select> 中的选中项。
        if (node.options && node.nodeName === "SELECT") {
            node.options.length = 0;
        }

    };

    /**
     * 彻底删除当前 DOM 对象。释放占用的所有资源。
     * @see #remove
     * @remark 这个方法会同时删除节点绑定的事件以及所有的数据。
     * @example
     * 从DOM中把所有段落删除。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;dispose&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").dispose();</pre>
     * #####结果:
     * <pre lang="htm" format="none">how are</pre>
     *
     * 从DOM中把带有hello类的段落删除。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p class="hello"&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p").dispose(".hello");</pre>
     */
    Dom.dispose = function (node) {
        if (node.nodeType == 1) {
            Object.each(node.getElementsByTagName("*"), clean);
            clean(node);
        }

        Dom.remove(node);
    };

    //#endregion

    //#region Dimension

    /**
     * 设置当前 Dom 对象的显示大小。
     * @param {Number/Point} x 要设置的宽或一个包含 x、y 属性的对象。如果不设置，使用 null 。
     * @param {Number} y 要设置的高。如果不设置，使用 null 。
     * @return this
     * @remark
     * 设置元素实际占用大小（包括内边距和边框，但不包括滚动区域之外的大小）。
     *
     * 此方法对可见和隐藏元素均有效。
     * @example
     * 设置 id=myP 的段落的大小。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p id="myP"&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.get("myP").setSize({x:200,y:100});</pre>
     */
    Dom.setSize = function (elem, value) {
        if (value.x != null)
            styleHooks.width.set(elem, value.x - Dom.calc(elem, 'borderLeftWidth+borderRightWidth+paddingLeft+paddingRight'));

        if (value.y != null)
            styleHooks.height.set(elem, value.y - Dom.calc(elem, 'borderTopWidth+borderBottomWidth+paddingLeft+paddingRight'));

    };

    /**
     * 获取当前 Dom 对象的可视区域大小。包括 border 大小。
     * @return {Point} 位置。
     * @remark
     * 此方法对可见和隐藏元素均有效。
     * 
     * 获取元素实际占用大小（包括内边距和边框）。
     * @example
     * 获取第一段落实际大小。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>Dom.query("p:first").getSize();</pre>
     * #####结果:
     * <pre lang="htm" format="none">{x=200,y=100}</pre>
     */
    Dom.getSize = function (elem) {
        var ret;
        if (elem.nodeType === 9) {
            elem = elem.documentElement;
            ret = {
                x: elem.clientWidth,
                y: elem.clientHeight
            };
        } else {
            ret = {
                x: elem.offsetWidth,
                y: elem.offsetHeight
            };
        }

        return ret;

    };

    /**
     * 获取当前 Dom 对象设置CSS宽度(width)属性的值（不带滚动条）。
     * @param {Number} value 设置的宽度值。
     * @return this
     * @example
     * 将所有段落的宽设为 20。
     * <pre>Dom.query("p").setWidth(20);</pre>
     */
    Dom.setWidth = styleHooks.width.set;

    /**
     * 获取当前 Dom 对象的CSS width值。（不带滚动条）。
     * @return {Number} 获取的值。
     * 取得元素当前计算的宽度值（px）。
     * @example
     * 获取第一段的宽。
     * <pre>Dom.query("p").item(0).getWidth();</pre>
     * 
     * 获取当前HTML文档宽度。
     * <pre>document.getWidth();</pre>
     */
    Dom.getWidth = function (elem) {
        return styleNumber(elem, 'width');
    };

    /**
     * 获取当前 Dom 对象设置CSS高度(hidth)属性的值（不带滚动条）。
     * @param {Number} value 设置的高度值。
     * @return this
     * @example
     * 将所有段落的高设为 20。
     * <pre>Dom.query("p").setHeight(20);</pre>
     */
    Dom.setHeight = styleHooks.height.set;

    /**
     * 获取当前 Dom 对象的CSS height值。（不带滚动条）。
     * @return {Number} 获取的值。
     * 取得元素当前计算的高度值（px）。
     * @example
     * 获取第一段的高。
     * <pre>Dom.query("p").item(0).getHeight();</pre>
     * 
     * 获取当前HTML文档高度。
     * <pre>document.getHeight();</pre>
     */
    Dom.getHeight = function (elem) {
        return styleNumber(elem, 'height');
    };

    /**
     * 获取当前 Dom 对象的滚动区域大小。
     * @return {Point} 返回的对象包含两个整型属性：x 和 y。
     * @remark
     * getScrollSize 获取的值总是大于或的关于 getSize 的值。
     * 
     * 此方法对可见和隐藏元素均有效。
     */
    Dom.getScrollSize = function (elem) {
        var ret = null, elem, body;

        if (elem.nodeType === 9) {
            body = elem.body;
            elem = elem.documentElement;
            ret = {
                x: Math.max(elem.scrollWidth, body.scrollWidth, elem.clientWidth),
                y: Math.max(elem.scrollHeight, body.scrollHeight, elem.clientHeight)
            };
        } else {
            ret = {
                x: elem.scrollWidth,
                y: elem.scrollHeight
            };
        }

        return ret;
    };

    //#endregion

    //#region Offset

    /**
     * 判断 body 节点的正则表达式。
     * @type RegExp
     */
    var rBody = /^(?:BODY|HTML|#document)$/i;

    function getDocumentScroll(doc) {
        var p, win;
        if ('pageXOffset' in (win = doc.defaultView || doc.parentWindow)) {
            p = {
                x: win.pageXOffset,
                y: win.pageYOffset
            };
        } else {
            elem = doc.documentElement;
            p = {
                x: elem.scrollLeft,
                y: elem.scrollTop
            };
        }

        return p;
    }

    /**
     * 获取用于让当前 Dom 对象定位的父对象。
     * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
     */
    Dom.offsetParent = function (elem) {
        var p = elem;
        while ((p = p.offsetParent) && !rBody.test(p.nodeName) && styleString(p, "position") === "static");
        return p || getDocument(elem).body;
    };

    /**
     * 获取当前 Dom 对象的绝对位置。
     * @return {Point} 返回的对象包含两个整型属性：x 和 y。
     * @remark
     * 此方法只对可见元素有效。
     * @example
     * 获取第二段的偏移
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>
     * var p = Dom.query("p").item(1);
     * var position = p.getPosition();
     * trace( "left: " + position.x + ", top: " + position.y );
     * </pre>
     * #####结果:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 0, top: 35&lt;/p&gt;</pre>
     */
    Dom.getPosition = function (elem) {

        // 对于 document，返回 scroll 。
        if (elem.nodeType === 9) {
            return getDocumentScroll(elem);
        }

        var bound = typeof elem.getBoundingClientRect !== "undefined" ? elem.getBoundingClientRect() : { x: 0, y: 0 },
            doc = getDocument(elem),
            html = doc.documentElement,
            htmlScroll = getDocumentScroll(doc);
        return {
            x: bound.left + htmlScroll.x - html.clientLeft,
            y: bound.top + htmlScroll.y - html.clientTop
        };
    };

    /**
     * 设置当前 Dom 对象的绝对位置。
     * @param {Number/Point} x 要设置的水平坐标或一个包含 x、y 属性的对象。如果不设置，使用 null 。
     * @param {Number} y 要设置的垂直坐标。如果不设置，使用 null 。
     * @return this
     * @remark
     * 如果对象原先的position样式属性是static的话，会被改成relative来实现重定位。
     * @example
     * 设置第二段的位置。
     * #####HTML:
     * <pre lang="htm" format="none">
     * &lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;
     * </pre>
     * #####JavaScript:
     * <pre>
     * Dom.query("p:last").setPosition({ x: 10, y: 30 });
     * </pre>
     */
    Dom.setPosition = function (elem, value) {

        Dom.movable(elem);

        var currentPosition = Dom.getPosition(elem),
            offset = Dom.getOffset(elem);

        if (value.y != null) offset.y += value.y - currentPosition.y;
        else offset.y = null;

        if (value.x != null) offset.x += value.x - currentPosition.x;
        else offset.x = null;

        Dom.setOffset(elem, offset);

    };

    /**
     * 获取当前 Dom 对象的相对位置。
     * @return {Point} 返回的对象包含两个整型属性：x 和 y。
     * @remark
     * 此方法只对可见元素有效。
     * 
     * 获取匹配元素相对父元素的偏移。
     * @example
     * 获取第一段的偏移
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:<pre>
     * var p = Dom.query("p").item(0);
     * var offset = p.getOffset();
     * trace( "left: " + offset.x + ", top: " + offset.y );
     * </pre>
     * #####结果:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 15, top: 15&lt;/p&gt;</pre>
     */
    Dom.getOffset = function (elem) {

        // 如果设置过 left top ，这是非常轻松的事。
        var left = styleString(elem, 'left'),
            top = styleString(elem, 'top');

        // 如果未设置过。
        if ((!left || !top || left === 'auto' || top === 'auto') && styleString(elem, "position") === 'absolute') {

            // 绝对定位需要返回绝对位置。
            top = Dom.offsetParent(elem);
            left = Dom.getPosition(elem);
            if (!rBody.test(top.nodeName)) {
                var t = Dom.getPosition(top);
                left.x -= t.x;
                lefy.y -= t.y;
            }
            left.x -= styleNumber(elem, 'marginLeft') + styleNumber(top, 'borderLeftWidth');
            left.y -= styleNumber(elem, 'marginTop') + styleNumber(top, 'borderTopWidth');

            return left;
        }

        // 碰到 auto ， 空 变为 0 。
        return {
            x: parseFloat(left) || 0,
            y: parseFloat(top) || 0
        };


    };

    /**
     * 设置当前 Dom 对象相对父元素的偏移。
     * @param {Point} value 要设置的 x, y 对象。
     * @return this
     * @remark
     * 此函数仅改变 CSS 中 left 和 top 的值。
     * 如果当前对象的 position 是static，则此函数无效。
     * 可以通过 {@link #setPosition} 强制修改 position, 或先调用 {@link Dom.movable} 来更改 position 。
     *
     * @example
     * 设置第一段的偏移。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>
     * Dom.query("p:first").setOffset({ x: 10, y: 30 });
     * </pre>
     * #####结果:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 15, top: 15&lt;/p&gt;</pre>
     */
    Dom.setOffset = function (elem, value) {

        ////assert(value, "Dom#setOffset(value): {value} 必须有 'x' 和 'y' 属性。", value);

        elem = elem.style;

        if (value.y != null)
            elem.top = value.y + 'px';

        if (value.x != null)
            elem.left = value.x + 'px';
    };

    /**
     * 获取当前 Dom 对象的滚动条的位置。
     * @return {Point} 返回的对象包含两个整型属性：x 和 y。
     * @remark
     * 此方法对可见和隐藏元素均有效。
     *
     * @example
     * 获取第一段相对滚动条顶部的偏移。
     * #####HTML:
     * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
     * #####JavaScript:
     * <pre>
     * var p = Dom.query("p").item(0);
     * trace( "scrollTop:" + p.getScroll() );
     * </pre>
     * #####结果:
     * <pre lang="htm" format="none">
     * &lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;scrollTop: 0&lt;/p&gt;
     * </pre>
     */
    Dom.getScroll = function (elem) {
        return elem.nodeType === 9 ? getDocumentScroll(elem) : {
            x: elem.scrollLeft,
            y: elem.scrollTop
        };
    };

    /**
     * 设置当前 Dom 对象的滚动条位置。
     * @param {Number/Point} x 要设置的水平坐标或一个包含 x、y 属性的对象。如果不设置，使用 null 。
     * @param {Number} y 要设置的垂直坐标。如果不设置，使用 null 。
     * @return this
     */
    Dom.setScroll = function (elem, value) {

        if (elem.nodeType !== 9) {
            if (value.x != null) elem.scrollLeft = value.x;
            if (value.y != null) elem.scrollTop = value.y;
        } else {
            var scroll = getDocumentScroll(elem);
            if (value.x == null)
                value.x = scroll.x;
            if (value.y == null)
                value.y = scroll.y;
            (elem.defaultView || elem.parentWindow).scrollTo(value.x, value.y);
        }

    };

    //#endregion

    //#region DOMReady

    /**
     * 浏览器使用的真实的 DOMContentLoaded 事件名字。
     * @type String
     */
    var domReady = 'DOMContentLoaded';

    Dom.global = new Base.extend.Base();

    if (isIE678) {

        domReady = 'readystatechange';

        try {

            // 修复IE6 因 css 改变背景图出现的闪烁。
            document.execCommand("BackgroundImageCache", false, true);
        } catch (e) {

        }
    }

    /**
	 * 设置在页面加载(不包含图片)完成时执行函数。
	 * @param {Functon} fn 当DOM加载完成后要执行的函数。
	 * @member Dom.ready
	 * @remark
	 * 允许你绑定一个在DOM文档载入完成后执行的函数。需要把页面中所有需要在 DOM 加载完成时执行的Dom.ready()操作符都包装到其中来。
	 * 
        @example
          当DOM加载完成后，执行其中的函数。
          #####JavaScript:<pre>Dom.ready(function(){
  // 文档就绪
});</pre>
        
	 */

    /**
	 * 设置在页面加载(包含图片)完成时执行函数。
	 * @param {Functon} fn 执行的函数。
	 * @member Dom.load
	 * @remark
	 * 允许你绑定一个在DOM文档载入完成后执行的函数。需要把页面中所有需要在 DOM 加载完成时执行的Dom.load()操作符都包装到其中来。
        @example
          当DOM加载完成后，执行其中的函数。
          #####JavaScript:<pre>Dom.load(function(){
  // 文档和引用的资源文件加载完成
});</pre>
        
	 */

    // 避免使用了默认的 DOM 事件处理。
    // Dom.$event.domready = Dom.$event.domload = {};

    map('ready load', function (readyOrLoad, isLoad) {

        var isReadyOrIsLoad = isLoad ? 'isLoaded' : 'isReady';

        // 设置 ready load
        Dom[readyOrLoad] = function (fn, scope) {

            // 忽略参数不是函数的调用。
            var isFn = typeof fn === 'function';

            // 如果已载入，则直接执行参数。
            if (Dom[isReadyOrIsLoad]) {

                if (isFn)
                    fn.call(scope);

                // 如果参数是函数。
            } else if (isFn) {

                Dom.global.on(readyOrLoad, fn, scope);

                // 触发事件。
                // 如果存在 JS 之后的 CSS 文件， 肯能导致 document.body 为空，此时延时执行 DomReady
            } else if (document.body) {

                // 如果 isReady, 则删除
                if (isLoad) {

                    // 使用系统文档完成事件。
                    isFn = window;
                    fn = readyOrLoad;

                    // 确保 ready 触发。
                    Dom.ready();

                } else {
                    isFn = document;
                    fn = domReady;
                }

                Dom.removeListener(isFn, fn, arguments.callee);

                // 先设置为已经执行。
                Dom[isReadyOrIsLoad] = true;

                // 触发事件。
                if (Dom.global.trigger(readyOrLoad, fn)) {

                    // 删除事件。
                    Dom.global.un(readyOrLoad);

                }

            } else {
                setTimeout(arguments.callee, 1);
            }

            return document;
        };

    });

    // 如果readyState 不是 complete, 说明文档正在加载。
    if (document.readyState !== "complete") {

        // 使用系统文档完成事件。
        Dom.addListener(document, domReady, Dom.ready);

        Dom.addListener(window, 'load', Dom.load);

        /// #if CompactMode

        // 只对 IE 检查。
        if (isIE678) {

            // 来自 jQuery
            // 如果是 IE 且不是框架
            var topLevel = false;

            try {
                topLevel = window.frameElement == null && document.documentElement;
            } catch (e) {
            }

            if (topLevel && topLevel.doScroll) {

                /**
				 * 为 IE 检查状态。
				 * @private
				 */
                (function doScrollCheck() {
                    if (Dom.isReady) {
                        return;
                    }

                    try {
                        // Use the trick by Diego Perini
                        // http://javascript.nwbox.com/IEContentLoaded/
                        topLevel.doScroll("left");
                    } catch (e) {
                        return setTimeout(doScrollCheck, 50);
                    }

                    Dom.ready();
                })();
            }
        }

        /// #endif
    } else {
        setTimeout(Dom.load, 1);
    }

    //#endregion

    //#region Export

    return Dom;

    //#endregion

})();

// 导出函数。
var $ = $ || Dom.query, $$ = $$ || Dom.get;
