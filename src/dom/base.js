/**
 * @author xuld
 */


include("core/class/base.js");

//include("jquery/jquery-1.9.0.js");
//include("dom/jquery-adapter.js");

var Dom = (function () {

	var ap = Array.prototype,

		Dom = Class({

			/**
			 * ��ȡ��ǰ���ϵĽڵ������
			 * @type {Number}
			 * @property
			 */
			length: 0,

			constructor: function (nodelist) {
				if (nodelist) {
					var i = 0;
					while (nodelist[i])
						this[this.length++] = nodelist[i++];
				}
			}

		});

	// �������麯����
	Object.map("push indexOf each forEach splice slice sort unique", function (fnName, index) {
		Dom.prototype[fnName] = index < 4 ? ap[fnName] : function () {
			return new Dom(ap[fnName].apply(this, arguments));
		};
	});

	Object.extend(Dom, {

    	/**
		 * ִ��һ�� CSS ѡ����������һ���µ� {@link DomList} ����
		 * @param {String/NodeList/DomList/Array/Dom} �������ҵ� CSS ѡ������ԭ���� DOM �ڵ��б�
		 * @return {Element} ���û�ж�Ӧ�Ľڵ��򷵻�һ���յ� DomList ����
	 	 * @static
	 	 * @see DomList
	 	 * @example
	 	 * �ҵ����� p Ԫ�ء�
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
	 	 * #####���:
	 	 * <pre lang="htm" format="none">
	 	 * [  &lt;p&gt;one&lt;/p&gt; ,&lt;p&gt;two&lt;/p&gt;, &lt;p&gt;three&lt;/p&gt;  ]
	 	 * </pre>
	 	 * 
	 	 * <br>
	 	 * �ҵ����� p Ԫ�أ�������ЩԪ�ض������� div Ԫ�ص���Ԫ�ء�
	 	 * #####HTML:
	 	 * <pre lang="htm" format="none">
	 	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;</pre>
	 	 * 
	 	 * #####Javascript:
	 	 * <pre>
	 	 * Dom.query("div &gt; p");
	 	 * </pre>
	 	 * 
	 	 * #####���:
	 	 * <pre lang="htm" format="none">
	 	 * [ &lt;p&gt;two&lt;/p&gt; ]
	 	 * </pre>
         * 
	 	 * <br>
         * �������еĵ�ѡ��ť(��: type ֵΪ radio �� input Ԫ��)��
         * <pre>Dom.query("input[type=radio]");</pre>
		 */
    	query: function (selector) {
    		return selector ?
				typeof selector === 'string' ?
					document.query(selector) :
					selector.nodeType || selector.setTimeout ?
						new DomList([selector]) :
						typeof selector.length === 'number' ?
							selector instanceof DomList ?
    							selector :
								new DomList(selector) :
							new DomList([Dom.getNode(selector)]) :
				new DomList;
    	},

    	/**
		 * ִ��һ�� CSS ѡ���������ص�һ��Ԫ�ض�Ӧ�� {@link Dom} ����
		 * @param {String/NodeList/DomList/Array/Dom} �������ҵ� CSS ѡ������ԭ���� DOM �ڵ㡣
		 * @return {Element} ���û�ж�Ӧ�Ľڵ��򷵻�һ���յ� DomList ����
	 	 * @static
	 	 * @see DomList
	 	 * @example
	 	 * �ҵ���һ�� p Ԫ�ء�
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
	 	 * #####���:
	 	 * <pre lang="htm" format="none">
	 	 * {  &lt;p&gt;one&lt;/p&gt;  }
	 	 * </pre>
	 	 * 
	 	 * <br>
	 	 * �ҵ���һ�� p Ԫ�أ�������ЩԪ�ض������� div Ԫ�ص���Ԫ�ء�
	 	 * #####HTML:
	 	 * <pre lang="htm" format="none">
	 	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;</pre>
	 	 * 
	 	 * #####Javascript:
	 	 * <pre>
	 	 * Dom.find("div &gt; p");
	 	 * </pre>
	 	 * 
	 	 * #####���:
	 	 * <pre lang="htm" format="none">
	 	 * { &lt;p&gt;two&lt;/p&gt; }
	 	 * </pre>
		 */
    	find: function (selector) {
    		return typeof selector === "string" ?
				document.find(selector) :
				Dom.get(selector);
    	},

    	/**
		 * ����һ�� *id* ��ԭ���ڵ��ȡһ�� {@link Dom} ���ʵ����
		 * @param {String/Node/Dom/DomList} id Ҫ��ȡԪ�ص� id �����ڰ�װ�� Dom ������κ�Ԫ�أ�����ԭ���� DOM �ڵ㡢ԭ���� DOM �ڵ��б�������Ѱ�װ���� Dom ���󡣡�
	 	 * @return {Dom} �˺���������һ�� Dom ���͵ı�����ͨ������������Ե��������ĵ��н��ܵ� DOM ��������������޷��ҵ�ָ���Ľڵ㣬�򷵻� null ���˺����ɼ�дΪ $��
	 	 * @static
	 	 * @example
	 	 * �ҵ� id Ϊ a ��Ԫ�ء�
	 	 * #####HTML:
	 	 * <pre lang="htm" format="none">
	 	 * &lt;p id="a"&gt;once&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;
	 	 * </pre>
	 	 * #####JavaScript:
	 	 * <pre>Dom.get("a");</pre>
	 	 * #####���:
	 	 * <pre>{&lt;p id="a"&gt;once&lt;/p&gt;}</pre>
	 	 * 
	 	 * <br>
	 	 * ���� id Ϊ a1 �� DOM ����
	 	 * #####HTML:
	 	 * <pre lang="htm" format="none">&lt;p id="a1"&gt;&lt;/p&gt; &lt;p id="a2"&gt;&lt;/p&gt; </pre>
	 	 *
	 	 * #####JavaScript:
	 	 * <pre>Dom.get(document.getElecmentById('a1')) // ��Ч�� Dom.get('a1')</pre>
	 	 * <pre>Dom.get(['a1', 'a2']); // ��Ч�� Dom.get('a1')</pre>
	 	 * <pre>Dom.get(Dom.get('a1')); // ��Ч�� Dom.get('a1')</pre>
	 	 * 
	 	 * #####���:
	 	 * <pre>{&lt;p id="a1"&gt;&lt;/p&gt;}</pre>
		 */
    	get: function (id) {
    		return typeof id === "string" ?
				(id = document.getElementById(id)) && new Dom(id) :
				id ?
					id.nodeType || id.setTimeout ?
						new Dom(id) :
						id.node ?
							id instanceof Dom ?
    					id :
								new Dom(id.node) :
							Dom.get(id[0]) :
					null;
    	},

    	/**
		 * �����ṩ��ԭʼ HTML ����ַ�������������̬����һ���ڵ㣬����������ڵ�� Dom �����װ����
		 * @param {String/Node} html ���ڶ�̬����DOMԪ�ص�HTML�ַ�����
		 * @param {Document} ownerDocument=document ����DOMԪ�����ڵ��ĵ���
		 * @param {Boolean} cachable=true ָʾ�Ƿ񻺴�ڵ㡣
		 * @return {Dom} Dom ����
	 	 * @static
	 	 * @remark
	 	 * ���Դ���һ����д�� HTML �ַ�����������ĳЩģ����������������ַ�����Ҳ������ͨ�� AJAX ���ع������ַ������������㴴�� input Ԫ�ص�ʱ�������ƣ����Բο��ڶ���ʾ������Ȼ����ַ������԰���б�� (����һ��ͼ���ַ)�����з�б�ܡ�����������Ԫ��ʱ����ʹ�ñպϱ�ǩ�� XHTML ��ʽ��
	 	 * ������������ڲ�����ͨ����ʱ����һ��Ԫ�أ��������Ԫ�ص� innerHTML ��������Ϊ�����ı���ַ�������ʵ�ֱ�ǵ� DOM Ԫ��ת���ġ����ԣ����������������ԣ�Ҳ�о����ԡ�
	 	 * 
	 	 * @example
	 	 * ��̬����һ�� div Ԫ�أ��Լ����е��������ݣ���������׷�ӵ� body Ԫ���С�
	 	 * #####JavaScript:
	 	 * <pre>Dom.parse("&lt;div&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;/div&gt;").appendTo(document.body);</pre>
	 	 * #####���:
	 	 * <pre lang="htm" format="none">[&lt;div&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;/div&gt;]</pre>
	 	 * 
	 	 * ����һ�� &lt;input&gt; Ԫ�ر���ͬʱ�趨 type ���ԡ���Ϊ΢��涨 &lt;input&gt; Ԫ�ص� type ֻ��дһ�Ρ�
	 	 * #####JavaScript:
	 	 * <pre>
	 	 * // �� IE ����Ч:
	 	 * Dom.parse("&lt;input&gt;").setAttr("type", "checkbox");
	 	 * // �� IE ����Ч:
	 	 * Dom.parse("&lt;input type='checkbox'&gt;");
	 	 * </pre>        
		 */
    	parse: function (html, context, cachable) {
    		return (html = Dom.parseNode(html, context, cachable)) ? html.nodeType ? new Dom(html) : html : null;
    	},

    	/**
		 * ����һ��ָ����ǩ�Ľڵ㣬����������ڵ�� Dom �����װ����
		 * @param {String} tagName Ҫ�����Ľڵ��ǩ����
		 * @param {String} className �����½ڵ�� CSS ������
	 	 * @static
	 	 * @example
	 	 * ��̬����һ�� div Ԫ�أ��Լ����е��������ݣ���������׷�ӵ� body Ԫ���С�������������ڲ�����ͨ����ʱ����һ��Ԫ�أ��������Ԫ�ص� innerHTML ��������Ϊ�����ı���ַ�������ʵ�ֱ�ǵ� DOM Ԫ��ת���ġ����ԣ����������������ԣ�Ҳ�о����ԡ�
	 	 * #####JavaScript:
	 	 * <pre>Dom.create("div", "cls").appendTo(document.body);</pre>
	 	 *
	 	 * ����һ�� div Ԫ��ͬʱ�趨 class ���ԡ�
	 	 * #####JavaScript:
	 	 * <pre>Dom.create("div", "className");</pre>
	 	 * #####���:
	 	 * <pre lang="htm" format="none">{&lt;div class="className"&gt;&lt;/div&gt;}</pre>
		 */
    	create: function (tagName, className) {
    		return new Dom(Dom.createNode(tagName, className || ''));
    	},

		div: document.createElement('div')
	});

    return Dom;

})();