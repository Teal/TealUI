/**
 * @author xuld
 */

include("core/class.js");

/**
 * ���� UI �����Ļ��ࡣ
 * @class Control
 * @abstract
 * �ؼ����������ڣ�
 * constructor - �����ؼ���Ӧ�� Javascript �ࡣ��������д���캯����������֪��������ʲô��
 * create - ���������� dom �ڵ㡣Ĭ��Ϊ���� #tpl ��Ӧ�� HTML �ַ�����������Ӧԭ���ڵ㡣
 * init - ��ʼ���ؼ�����Ĭ��Ϊ�պ�����
 * attach - ���ӿؼ���Ӧ�Ľڵ㵽 DOM �󡣲�������д������һ���ؼ���װ�˶��� DOM �ڵ�������д��������
 * detach - ɾ���ؼ���Ӧ�Ľڵ㡣��������д������һ���ؼ���װ�˶��� DOM �ڵ�������д��������
 */
var Control = Class({

	/**
	 * ��ǰ UI �����󶨵� Dom ������
	 * @type {Dom}
	 */
	dom: null,

	/**
	 * xtype: ���ڱ��ǿؼ��� css �ࡣ
	 * @protected virtual
	 */
	xtype: "x-control",

	/**
	 * ��ǰ�ؼ��� HTML ģ���ַ�����
	 * @getter {String} tpl
	 * @protected virtual
	 */
	tpl: "<div/>",

	/**
	 * ����������дʱ�����ɵ�ǰ�ؼ���Ӧ��ԭ���ڵ㡣
	 * @param {Object} options ѡ�
     * @return {Element} ԭ���� DOM �ڵ㡣
	 * @protected virtual
	 */
	create: function () {

		// תΪ�� tpl������
		return Dom.parseNode(this.tpl.replace(/xtype/g, this.xtype));
	},

	/**
	 * ����������дʱ����ʼ����ǰ�ؼ���
	 * @param {Object} options ��ǰ�ؼ��ĳ�ʼ�����á�
	 * @protected virtual
	 */
	init: Function.empty,

	/**
	 * ��ʼ��һ���µĿؼ���
	 * @param {String/Element/Dom/Object} [options] �󶨵Ľڵ����ڵ� id �����������ö��������ڳ�ʼ����ǰ�ؼ���
	 */
	constructor: function (options) {

		// �������пؼ����õĹ��캯����
		var me = this,

			// ��ʱ�����ö�����
			opt = {},

			// ��ǰʵ�ʵĽڵ㡣
			node;

		// �����������á�
		if (options) {

			// ���� options �Ǵ����á�
			if (options.constructor === Object) {

				// �����ÿ����� opt ������
				Object.extend(opt, options);

				// ���� node��selector��dom �ֶ�
				if (opt.node) {
					node = opt.node;
					delete opt.node;
				} else if (opt.selector) {
					node = Dom.find(opt.selector);
					delete opt.selector;
				} else if (opt.dom) {
					node = opt.dom;
					delete opt.dom;
				}

				if (node) {
					node = Dom.getNode(node);
				}

			} else {

				// ���򣬳��Ը��� options �ҵ��ڵ㡣
				node = Dom.getNode(options);
			}

		}

		// ���� node ���ҵ�����ʹ�� node������ʹ�� #create(opt)���ɽڵ㡣
		me.node = node || me.create(opt);

		assert.isNode(me.node, "Dom#constructor(options): Dom ������ {node} ���ǽڵ㡣", me.node);

		// ���� init ��ʼ���ؼ���
		me.init(opt);

		// ���������ĸ���ѡ�
		me.set(opt);
	},

	/**
	 * ���õ�ǰ��������״̬, ���ı��ؼ�����ʽ��
     * @param {String} name ״̬����
     * @param {Boolean} value=false Ҫ���õ�״ֵ̬��
	 * @protected virtual
	 */
	state: function (name, value) {
		this.dom.toggleClass(this.xtype + '-' + name, value);
	}

});
