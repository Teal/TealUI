
var rBackslash = /\\/g;
var Selector = {};

var fixGetElementById = true;


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

Selector = {

    all: function (selector, context) {
        
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
                }

                for (i = 0; elem = prevResult[i]; i++) {
                    addElementsByTagName(elem, value || "*", result);
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

        var match, filterFn, value;

        // ‘#id’ ‘.className’ ‘:filter’ ‘[attr’
        while (result.length && (match = /^([#\.:]|\[\s*)((?:[-\w]|[^\x00-\xa0]|\\.)+)/.exec(selector))) {

            selector = RegExp.rightContext;

            filterFn = (Selector.filterFn || (Selector.filterFn = {}))[match[0]];

            // 如果不存在指定过滤器的特定函数，则先编译一个。
            if (!filterFn) {

                filterFn = 'for(var n=0,i=0,e,t;e=r[i];i++){t=';
                value = match[2].replace(rBackslash, "");

                switch (match[1]) {

                    // ‘#id’
                    case "#":
                        filterFn += 'Dom.getAttr(e,"id")===v;';
                        break;

                        // ‘.className’
                    case ".":
                        filterFn += 'Dom.hasClass(e,v);';
                        break;

                        // ‘:filter’
                    case ":":

                        filterFn += Dom.pseudos[value] || throwError(match[0]);

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

                        filterFn += 'Dom.getAttr(e,v[0])' + (Selector.relative[value[1]] || throwError(match[0]));

                }

                filterFn += 'if(t)r[n++]=e;}r.splice(n);';

                Selector.filterFn[match[0]] = filterFn = new Function('r', 'v', filterFn);

                filterFn.value = value;

            }

            filterFn(result, filterFn.value);

        }

        return selector;

    },

    match: function (elem, selector) {

        if (elem.nodeType !== 1)
            return false;

        if (!elem.parentNode) {
            var div = document.createElement('div');
            div.appendChild(elem);
            try {
                return Dom.match(elem, selector);
            } finally {
                div.removeChild(elem);
            }
        }

        var r, i = 0;
        try {
            r = node.parentNode.querySelectorAll(selector);
        } catch (e) {
            return query(selector, new Dom(node.parentNode)).indexOf(node) >= 0 || query(selector, Dom.document).indexOf(node) >= 0;
        }
        while (r[i])
            if (r[i++] === node)
                return true;

        return false;

        return match(elem, selector);
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
        'undefined': '!=null;',
        '=': '===v[2];',
        '~=': ';t=(" "+t+" ").indexOf(" "+v[2]+" ")>=0;',
        '!=': '!==v[2];',
        '|=': ';t=("-"+t+"-").indexOf("-"+v[2]+"-")>=0;',
        '^=': ';t=t&&t.indexOf(v[2])===0;',
        '$=': ';t=t&&t.indexOf(v[2].length-t.length)===v[2];',
        '*=': ';t=t&&t.indexOf(v[2])>=0;'
    }

};

var ap = [];

var filterCache = {};