
/**
 * 遍历 NodeList 对象。 
 * @param {NodeList} nodelist 要遍历的 NodeList。
 * @param {Function} fn 遍历的函数。
 */
function each(nodelist, fn) {
    var i = 0, node;
    while (node = nodelist[i++]) {
        fn(node);
    }
}

/**
 * 判断指定选择器是否符合指定的节点。 
 * @param {Node} node 判断的节点。
 * @param {String} selector 选择器表达式。
 */
function match(node, selector) {
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
}



//#region Selector

/**
 * 使用指定的选择器代码对指定的结果集进行一次查找。
 * @param {String} selector 选择器表达式。
 * @param {DomList/Dom} result 上级结果集，将对此结果集进行查找。
 * @return {DomList} 返回新的结果集。
 */
function query(selector, result) {

    var prevResult = result,
        rBackslash = /\\/g,
        m,
        key,
        value,
        lastSelector,
        filterData;

    selector = selector.trim();

    // 解析分很多步进行，每次解析  selector 的一部分，直到解析完整个 selector 。
    while (selector) {

        // 保存本次处理前的选择器。
        // 用于在本次处理后检验 selector 是否有变化。
        // 如果没变化，说明 selector 不能被正确处理，即 selector 包含非法字符。
        lastSelector = selector;

        // 解析的第一步: 解析简单选择器

        // ‘*’ ‘tagName’ ‘.className’ ‘#id’
        if (m = /^(^|[#.])((?:[-\w\*]|[^\x00-\xa0]|\\.)+)/.exec(selector)) {

            // 测试是否可以加速处理。
            if (!m[1] || (result[m[1] === '#' ? 'getElementById' : 'getElementsByClassName'])) {
                selector = RegExp.rightContext;
                switch (m[1]) {

                    // ‘#id’
                    case '#':
                        result = result.getElementById(m[2]);
                        result = result ? [result] : null;
                        break;

                        // ‘.className’
                    case '.':
                        result = result.getElementsByClassName(m[2]);
                        break;

                        // ‘*’ ‘tagName’
                    default:
                        result = result.getElements(m[2].replace(rBackslash, ""));
                        break;

                }

                // 如果仅仅为简单的 #id .className tagName 直接返回。
                if (!selector) {
                    return new DomList(result);
                }

                // 无法加速，等待第四步进行过滤。
            } else {
                result = result.getElements();
            }

            // 解析的第二步: 解析父子关系操作符(比如子节点筛选)

            // ‘a>b’ ‘a+b’ ‘a~b’ ‘a b’ ‘a *’
        } else if (m = /^\s*([\s>+~<])\s*(\*|(?:[-\w*]|[^\x00-\xa0]|\\.)*)/.exec(selector)) {
            selector = RegExp.rightContext;

            var value = m[2].replace(rBackslash, "");

            switch (m[1]) {
                case ' ':
                    result = result.getElements(value);
                    break;

                case '>':
                    result = result.children(value);
                    break;

                case '+':
                    result = result.next(value);
                    break;

                case '~':
                    result = result.nextAll(value);
                    break;

                case '<':
                    result = result.parentAll(value);
                    break;

                default:
                    throwError(m[1]);
            }

            // ‘a>b’: m = ['>', 'b']
            // ‘a>.b’: m = ['>', '']
            // result 始终实现了  Dom 接口，所以保证有 Dom.combinators 内的方法。

            // 解析的第三步: 解析剩余的选择器:获取所有子节点。第四步再一一筛选。
        } else {
            result = result.getElements();
        }

        // 强制转 DomList 以继续处理。
        if (!(result instanceof DomList)) {
            result = new DomList(result);
        }

        // 解析的第四步: 筛选以上三步返回的结果。

        // ‘#id’ ‘.className’ ‘:filter’ ‘[attr’
        while (m = /^([#\.:]|\[\s*)((?:[-\w]|[^\x00-\xa0]|\\.)+)/.exec(selector)) {
            selector = RegExp.rightContext;
            value = m[2].replace(rBackslash, "");

            // ‘#id’: m = ['#','id']

            // 筛选的第一步: 分析筛选器。

            switch (m[1]) {

                // ‘#id’
                case "#":
                    filterData = ["id", "=", value];
                    break;

                    // ‘.className’
                case ".":
                    filterData = ["class", "~=", value];
                    break;

                    // ‘:filter’
                case ":":
                    filterData = Dom.pseudos[value] || throwError(value);
                    args = undefined;

                    // ‘selector:nth-child(2)’
                    if (m = /^\(\s*("([^"]*)"|'([^']*)'|[^\(\)]*(\([^\(\)]*\))?)\s*\)/.exec(selector)) {
                        selector = RegExp.rightContext;
                        args = m[3] || m[2] || m[1];
                    }


                    break;

                    // ‘[attr’
                default:
                    filterData = [value.toLowerCase()];

                    // ‘selector[attr]’ ‘selector[attr=value]’ ‘selector[attr='value']’  ‘selector[attr="value"]’    ‘selector[attr_=value]’
                    if (m = /^\s*(?:(\S?=)\s*(?:(['"])(.*?)\2|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/.exec(selector)) {
                        selector = RegExp.rightContext;
                        if (m[1]) {
                            filterData[1] = m[1];
                            filterData[2] = m[3] || m[4];
                            filterData[2] = filterData[2] ? filterData[2].replace(/\\([0-9a-fA-F]{2,2})/g, function (x, y) {
                                return String.fromCharCode(parseInt(y, 16));
                            }
                            ).replace(rBackslash, "") : "";
                        }
                    }
                    break;
            }

            var args,
                oldResult = result,
                i = 0,
                elem;

            // 筛选的第二步: 生成新的集合，并放入满足的节点。

            result = new DomList();
            if (filterData.call) {

                // 仅有 2 个参数则传入 oldResult 和 result
                if (filterData.length === 3) {
                    filterData(args, oldResult, result);
                } else {
                    while (elem = oldResult[i++]) {
                        if (filterData(elem, args))
                            result.push(elem);
                    }
                }
            } else {
                while (elem = oldResult[i++]) {
                    var actucalVal = Dom.getAttr(elem, filterData[0], 1),
                        expectedVal = filterData[2],
                        tmpResult;
                    switch (filterData[1]) {
                        case undefined:
                            tmpResult = actucalVal != null;
                            break;
                        case '=':
                            tmpResult = actucalVal === expectedVal;
                            break;
                        case '~=':
                            tmpResult = (' ' + actucalVal + ' ').indexOf(' ' + expectedVal + ' ') >= 0;
                            break;
                        case '!=':
                            tmpResult = actucalVal !== expectedVal;
                            break;
                        case '|=':
                            tmpResult = ('-' + actucalVal + '-').indexOf('-' + expectedVal + '-') >= 0;
                            break;
                        case '^=':
                            tmpResult = actucalVal && actucalVal.indexOf(expectedVal) === 0;
                            break;
                        case '$=':
                            tmpResult = actucalVal && actucalVal.substr(actucalVal.length - expectedVal.length) === expectedVal;
                            break;
                        case '*=':
                            tmpResult = actucalVal && actucalVal.indexOf(expectedVal) >= 0;
                            break;
                        default:
                            throw 'Not Support Operator : "' + filterData[1] + '"'
                    }

                    if (tmpResult) {
                        result.push(elem);
                    }
                }
            }
        }

        // 最后解析 , 如果存在，则继续。

        if (m = /^\s*,\s*/.exec(selector)) {
            selector = RegExp.rightContext;
            return result.add(query(selector, prevResult));
        }


        if (lastSelector.length === selector.length) {
            throwError(selector);
        }
    }

    return result;
}

//#endregion



/**
 * 搜索所有与指定CSS表达式匹配的第一个元素。
 * @param {String} selecter 用于查找的表达式。
 * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
 * @example
 * 从所有的段落开始，进一步搜索下面的span元素。与Dom.find("p span")相同。
 * #####HTML:
 * <pre lang="htm" format="none">&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;, how are you?&lt;/p&gt;</pre>
 * #####JavaScript:
 * <pre>Dom.query("p").find("span")</pre>
 * #####结果:
 * <pre lang="htm" format="none">[ &lt;span&gt;Hello&lt;/span&gt; ]</pre>
 */
document.find = function (selector) {
	assert.isString(selector, "Dom#find(selector): selector ~");
	var result;
	try {
		result = this.querySelector(selector);
	} catch (e) {
		result = query(selector, this)[0];
	}
	return result ? new Dom(result) : null;
};

/**
 * 执行选择器。
 * @method
 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
 * @return {Element/undefined} 节点。
 */
document.query = function (selector) {
	assert.isString(selector, "Dom#find(selector): selector ~。");
	var result;
	try {
		result = this.querySelectorAll(selector);
	} catch (e) {
		result = query(selector, this);
	}
	return new Dom(result);
};

