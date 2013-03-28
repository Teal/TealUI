


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
