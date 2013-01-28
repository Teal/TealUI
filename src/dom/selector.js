/** * @author xuld */include("dom/base.js");include("dom/attr.js");
Dom.Selector = (function () {

	var Selector = {

		all: function (selector, context) {
			//assert.isString(selector, "Dom#query(selector): selector ~。");
			//if (context) {

			//} else {
			//	try {
			//		result = document.querySelectorAll(selector);
			//	} catch (e) {
			//		result = query(selector, this);
			//	}
			//	var result;

			//	result.push.apply(result)
			//	return new DomList(result);
			//}

			return query(selector, new Dom([context || document]));
		},

		one: function () {

		},

		match: function (elem, selector) {
			//if (/^(?:[-\w:]|[^\x00-\xa0]|\\.)+$/.test(selector)) {
			//	return elem.tagName === filter.toUpperCase();
			//}

			var r, i;


			if (elem.parentNode) {

				try {
					r = elem.parentNode.querySelectorAll(selector);
				} catch (e) {
					r = [];
					query(selector, elem.parentNode, r);
					if (r.indexOf(elem) >= 0)
						return true;
				}

			} else {
				r = Selector.all(selector, document);
			}

			i = 0;
			while (r[i])
				if (r[i++] === node)
					return true;

			return false;
		},

		/**
		 * 用于查找所有支持的伪类的函数集合。
		 * @private
	 	 * @static
		 */
		pseudos: {

			target: function (elem) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice(1) === elem.id;
			},

			focus: function (elem) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},

			/**
			 * 判断一个节点是否有元素节点或文本节点。
			 * @param {Element} elem 要测试的元素。
			 * @return {Boolean} 如果存在子节点，则返回 true，否则返回 false 。
			 */
			empty: function (elem) {
				for (elem = elem.firstChild; elem; elem = elem.nextSibling)
					if (elem.nodeType === 1 || elem.nodeType === 3)
						return false;
				return true;
			},

			contains: function (elem, args) {
				return Dom.getText(elem).indexOf(args) >= 0;
			},

			/**
			 * 判断一个节点是否不可见。
			 * @return {Boolean} 如果元素不可见，则返回 true 。
			 */
			hidden: Dom.isHidden = function (elem) {
				return (elem.style.display || getStyle(elem, 'display')) === 'none';
			},
			visible: function (elem) { return !Dom.isHidden(elem); },

			not: function (elem, args) { return !match(elem, args); },
			has: function (elem, args) { return query(args, new Dom(elem)).length > 0; },

			selected: function (elem) { return attrFix.selected.get(elem, 'selected', 1); },
			checked: function (elem) { return elem.checked; },
			enabled: function (elem) { return elem.disabled === false; },
			disabled: function (elem) { return elem.disabled === true; },

			input: function (elem) { return /^(input|select|textarea|button)$/i.test(elem.nodeName); },

			"nth-child": function (args, oldResult, result) {
				var tmpResult = Dom.pseudos;
				if (tmpResult[args]) {
					tmpResult[args](null, oldResult, result);
				} else if (args = oldResult[args - 1])
					result.push(args);
			},
			"first-child": function (args, oldResult, result) {
				if (args = oldResult[0])
					result.push(args);
			},
			"last-child": function (args, oldResult, result) {
				if (args = oldResult[oldResult.length - 1])
					result.push(args);
			},
			"only-child": function (elem) {
				var p = new Dom(elem.parentNode).first(elem.nodeName);
				return p && p.next();
			},
			odd: function (args, oldResult, result) {
				var index = 0, elem, tmpResult;
				while (elem = oldResult[index++]) {
					if (args) {
						result.push(elem);
					}
				}
			},
			even: function (args, oldResult, result) {
				return Dom.pseudos.odd(!args, oldResult, result);
			}

		}

	};

	function iterate(dom, fn) {
		var ret = new Dom(),
			i = 0,
			j,
			len = dom.length,
			nodelist;
		for ( ; i < len; i++) {
			nodelist = fn(dom[i]);
			for (j = 0; nodelist[j]; j++) {
				if (ret.indexOf(nodelist[j]) < 0) {
					ret[ret.length++] = nodelist[j];
				}
			}
		}
		
		return ret;
	}

	function query(selector, result) {
		var rBackslash = /\\/g,
			match,
			lastSelector,
			filter,
			filterArgs,
			preResult,
			sep,
			actucalVal,
			i;

		selector = selector.trim();

		// 解析分很多步进行，每次解析  selector 的一部分，直到解析完整个 selector 。
		while (selector) {

			// 保存本次处理前的选择器。
			// 用于在本次处理后检验 selector 是否有变化。
			// 如果没变化，说明 selector 含非法字符，无法被成功处理。
			lastSelector = selector;

			// 解析的第一步: 解析简单选择器

			// ‘*’ ‘tagName’ ‘.className’ ‘#id’
			if (match = /^(^|[#.])((?:[-\w\*]|[^\x00-\xa0]|\\.)+)/.exec(selector)) {

				sep = match[1];
				
				// 加速 query("#id", [document]); query(".className", [document]); query("tagName", [elem]);
				if (!sep || (result[0][sep === '#' ? 'getElementById' : 'getElementsByClassName'])) {
					selector = RegExp.rightContext;
					switch (sep) {

						// ‘#id’
						case '#':
							result = iterate(result, function (elem) {
								elem = elem.getElementById(match[2]);
								return elem ? [elem] : [];
							});
							break;

						// ‘.className’
						case '.':
							result = iterate(result, function (elem) {
								return elem.getElementsByClassName(match[2]);
							});
							break;

						// ‘*’ ‘tagName’
						default:
							result = iterate(result, function (elem) {
								return getElements(elem, match[2].replace(rBackslash, ""));
							});
							break;

					}

					// 只有一个 #id .className tagName 选择器，直接返回。
					if (!selector) {
						break;
					}

					// 无法加速，取得全部子元素，等待第四步进行过滤。
				} else {
					result = iterate(result, function (elem) {
						return getElements(elem, "*");
					});
				}

				// 解析的第二步: 解析父子关系操作符(比如子节点筛选)

				// ‘a>b’ ‘a+b’ ‘a~b’ ‘a b’ ‘a *’
			} else if (match = /^\s*([\s>+~<])\s*(\*|(?:[-\w*]|[^\x00-\xa0]|\\.)*)/.exec(selector)) {
				selector = RegExp.rightContext;

				filterArgs = match[2].replace(rBackslash, "") || "*";

				switch (match[1]) {
					case ' ':
						result = iterate(result, function (elem) {
							return getElements(elem, filterArgs);
						});
						break;

					case '>':
						result = iterate(result, function (elem) {
							return iterateSibling(elem.firstChild, filterArgs);
						});
						break;

					case '+':
						result = iterate(result, function (elem) {
							while ((elem = elem.nextSibling) && elem.nodeType !== 1);
							return elem && Selector.match(elem, filterArgs) ? [elem] : [];
						});
						break;

					case '~':
						result = iterate(result, function (elem) {
							return iterateSibling(elem.nextSibling, filterArgs);
						});
						break;

					default:
						throwError(match[1]);
				}

				// ‘a>b’: match = ['>', 'b']
				// ‘a>.b’: match = ['>', '']

				// 解析的第三步: 解析剩余的选择器:获取所有子节点。第四步再一一筛选。
			} else {
				result = iterate(result, function (elem) {
					return getElements(elem, "*");
				});
			}

			// 解析的第四步: 筛选以上三步返回的结果。

			// ‘#id’ ‘.className’ ‘:filter’ ‘[attr’
			while (match = /^([#\.:]|\[\s*)((?:[-\w]|[^\x00-\xa0]|\\.)+)/.exec(selector)) {
				selector = RegExp.rightContext;
				
				preResult = result;
				result = new Dom();

				sep = match[1];
				filterArgs = match[2].replace(rBackslash, "");

				// ‘#id’: match = ['#','id']

				// 生成新的集合，并放入满足的节点。

				// ‘:filter’
				if (sep === ":") {
					filter = Selector.pseudos[filterArgs] || throwError(filterArgs);
					filterArgs = undefined;

					// ‘selector:nth-child(2)’
					if (match = /^\(\s*("([^"]*)"|'([^']*)'|[^\(\)]*(\([^\(\)]*\))?)\s*\)/.exec(selector)) {
						selector = RegExp.rightContext;
						filterArgs = match[3] || match[2] || match[1];
					}

					// 仅有 2 个参数则传入 oldResult 和 result
					if (filter.length === 3) {
						filter(preResult, filterArgs, result);
					} else {
						i = 0;
						while (match = preResult[i++]) {
							if (filter(match, filterArgs))
								result.push(match);
						}
					}
				} else {

					// ‘#id’
					if (sep == "#") {
						filter = "id";
						sep = "=";

						// ‘.className’
					} else if (sep == ".") {
						filter = "class";
						sep = "~=";

						// ‘[attr’
					} else {
						filter = filterArgs.toLowerCase();

						// ‘selector[attr]’ ‘selector[attr=value]’ ‘selector[attr='value']’  ‘selector[attr="value"]’    ‘selector[attr_=value]’
						if (match = /^\s*(?:(\S?=)\s*(?:(['"])(.*?)\2|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/.exec(selector)) {
							selector = RegExp.rightContext;
							if (match[1]) {
								sep = match[1];
								filterArgs = (match[3] || match[4] || "").replace(/\\([0-9a-fA-F]{2,2})/g, function (x, y) {
									return String.fromCharCode(parseInt(y, 16));
								}).replace(rBackslash, "");
							}
						}
					}

					i = 0;
					while (match = preResult[i++]) {
						actucalVal = Dom.getAttr(match, filter, 1);
						switch (sep) {
							case undefined:
								actucalVal = actucalVal != null;
								break;
							case '=':
								actucalVal = actucalVal === filterArgs;
								break;
							case '~=':
								actucalVal = (' ' + actucalVal + ' ').indexOf(' ' + filterArgs + ' ') >= 0;
								break;
							case '!=':
								actucalVal = actucalVal !== filterArgs;
								break;
							case '|=':
								actucalVal = ('-' + actucalVal + '-').indexOf('-' + filterArgs + '-') >= 0;
								break;
							case '^=':
								actucalVal = actucalVal && actucalVal.indexOf(filterArgs) === 0;
								break;
							case '$=':
								actucalVal = actucalVal && actucalVal.substr(actucalVal.length - filterArgs.length) === filterArgs;
								break;
							case '*=':
								actucalVal = actucalVal && actucalVal.indexOf(filterArgs) >= 0;
								break;
							default:
								throwError('Not Support Operator : "' + filter[1] + '"');
						}

						if (actucalVal) {
							result.push(match);
						}
					}

				}

			}

			// 最后解析 , 如果存在，则继续。

			if (match = /^\s*,\s*/.exec(selector)) {
				result.push.apply(result, query(RegExp.rightContext, context))
				result = result.unique();
				break;
			}


			if (lastSelector.length === selector.length) {
				throwError(selector);
			}
		}

		return result;
	}

	function iterateSibling(elem, selector) {
		var r = [];

		do {
			if (elem.nodeType === 1 && Dom.match(elem, selector)) {
				r.push(elem);
			}

		} while (elem = elem.nextSibling);

		return r;
	}

	/**
	 * 获取当前节点内的全部子节点。
	 * @param {String} args 要查找的节点的标签名。 * 表示返回全部节点。
	 * @return {NodeList} 返回一个 NodeList 对象。
	 */
	function getElements(elem, args) {

		var funcName = 'getElementsByTagName';

		if (elem[funcName]) {
			return elem[funcName](args);
		}

		funcName = 'querySelectorAll';
		if (elem[funcName]) {
			return elem[funcName](args);
		}

		return [];
	}

	/**
	 * 抛出选择器语法错误。 
	 * @param {String} message 提示。
	 */
	function throwError(message) {
		throw new SyntaxError('An invalid or illegal string was specified : "' + message + '"!');
	}

	return Selector;

})();
