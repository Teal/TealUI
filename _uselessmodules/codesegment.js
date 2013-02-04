
	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function (elem) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if (!nodeType) {
			// If no nodeType, this is expected to be an array
			for (; (node = elem[i]) ; i++) {
				// Do not traverse comment nodes
				ret += getText(node);
			}
		} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (see #11153)
			if (typeof elem.textContent === "string") {
				return elem.textContent;
			} else {
				// Traverse its children
				for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText(elem);
				}
			}
		} else if (nodeType === 3 || nodeType === 4) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes

		return ret;
	};


// bug: Safari  e.target �����ı��ڵ�   #504
//  ���޸� -ms-  ��ʽ
//  �����⴦��  Chrome margin-right ��ֵ��
// getWidth/getHeight  ��֧�� document
// setStyle("fontSize", NaN)  ����֧��





// ���õĺ�
//  CompactMode - ����ģʽ - ֧�� IE6+ FF3+ Chrome10+ Opera10.5+ Safari5+ , ���޴˺꣬��ֻ֧�� HTML5��



	/**
	 * ��ȡ Dom �����һ��Ԫ�صķ���ֵ��
	 */
	function iterateGetter(dom, getter, args1) {
		return dom.length ? getter(dom[0], args1) : null;
	}

	/**
	 * ���� Dom ���󣬲���ÿ��Ԫ��ִ�� getter������ִ�к������ɵ� Dom ����
	 */
	function iterateDom(dom, getter, args1) {
		var ret = new Dom(),
			i = 0,
			j,
			len = dom.length,
			nodelist;
		for (; i < len; i++) {
			nodelist = getter(dom[i], args1);
			for (j = 0; nodelist[j]; j++) {
				if (ret.indexOf(nodelist[j]) < 0) {
					ret[ret.length++] = nodelist[j];
				}
			}
		}

		return ret;
	}



	Dom.iterateGetter = iterateGetter;
	Dom.iterateDom = iterateDom;




//Dom.fetchStyles = function (style, styles) {
//    var ret = {};
//    for (var name in styles) {
//        ret[name] = elem[name];
//    }

//    return ret;
//};





	/**
	 * ��һ���ַ�תΪ��д��
	 * @param {String} ch ������
	 * @param {String} match �ַ���
	 * @return {String} תΪ��д֮����ַ�����
	 */
	function toUpperCase(ch, match) {
		return match.toUpperCase();
	}




/**
 * ���ַ���תΪ���ո�ʽ��
 * @return {String} ���ص����ݡ�
 * @remark
 * ���� "awww-bwww-cwww" �����ո�ʽΪ "awwBwwCww"
 * @example
 * <pre>
 * "font-size".toCamelCase(); //     "fontSize"
 * </pre>
 */
toCamelCase: function () {
	return this.replace(/-(\w)/g, toUpperCase);
},

/**
 * ���ַ�����ĸ��д��
 * @return {String} �������ַ�����
 * @example
 * <pre>
 * "aa".capitalize(); //     "Aa"
 * </pre>
 */
capitalize: function () {

	// ʹ������ʵ�֡�
	return this.replace(/(\b[a-z])/g, toUpperCase);
}



    
///**
// * �����ж�һ���ڵ������ƶ��Ĺ�������
// * @param {Node} elem Ԫ�ء�
// * @param {String/Function/Undefined} filter ��������
// * @return {Boolean} ���ؽ����
// */
//function applyFilter(elem, filter) {
//    return !filter || (typeof filter === 'string' ? /^(?:[-\w:]|[^\x00-\xa0]|\\.)+$/.test(filter) ? elem.tagName === filter.toUpperCase() : Dom.match(elem, filter) : filter(elem));
//}




    
///**
// * �ж�һ���ڵ��Ƿ����ӽڵ㡣
// * @param {Dom} dom �ӽڵ㡣
// * @param {Boolean} allowSelf=false ���Ϊ true���򵱵�ǰ�ڵ����ָ���Ľڵ�ʱҲ���� true ��
// * @return {Boolean} �����ӽڵ��򷵻�true ��
// */
//dp.contains = function (dom, allowSelf) {
//    if (typeof dom === "string")
//        return (allowSelf && this.match(dom)) || !!this.find(dom).length;

//    return (allowSelf && this[0] === dom) || Dom.contains(this[0], dom);
//};

/**
 * ������ÿ��Ԫ��ͨ��һ���������ˡ��������з���Ҫ���Ԫ�ص����顣
 * @param {Function} fn ��ÿ��Ԫ�����еĺ����������Ĳ�������Ϊ:
 *
 * - {Object} value ��ǰԪ�ص�ֵ��
 * - {Number} index ��ǰԪ�ص�������
 * - {Array} array ��ǰ���ڱ��������顣
 *
 * ����������� **true**����ǰԪ�ػᱻ��ӵ�����ֵ���顣
 * @param {Object} [scope] ���� *fn* ִ��ʱ **this** ��ֵ��
 * @return {Array} ����һ���µ����飬�������˺��Ԫ�ء�
 * @remark Ŀǰ���� IE8-������������������ô˺�����
 * @see #each
 * @see #forEach
 * @see Object.map
 * @example
 * <pre>
 * [1, 7, 2].filter(function (key) {
 * 		return key < 5;
 * })  //  [1, 2]
 * </pre>
 */
filter: function (fn, scope) {
	assert.isFunction(fn, "Array#filter(fn, scope): {fn} ~");
	var r = [];
	ap.forEach.call(this, function (value, i, array) {
		if (fn.call(scope, value, i, array))
			r.push(value);
	});
	return r;
},