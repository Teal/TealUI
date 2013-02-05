/**
 * @author xuld
 */

include("core/class.js");
include("dom/base.js");

/**
 * ���� UI ����Ļ��ࡣ
 * @class Control
 * @abstract
 * �ؼ����������ڣ�
 * constructor - �����ؼ���Ӧ�� Javascript �ࡣ��������д���캯����������֪��������ʲô��
 * create - ��������� dom �ڵ㡣Ĭ��Ϊ���� #tpl ��Ӧ�� HTML �ַ�����������Ӧԭ���ڵ㡣
 * init - ��ʼ���ؼ�����Ĭ��Ϊ�պ�����
 * attach - ��ӿؼ���Ӧ�Ľڵ㵽 DOM ������������д�����һ���ؼ���װ�˶�� DOM �ڵ�������д��������
 * detach - ɾ���ؼ���Ӧ�Ľڵ㡣��������д�����һ���ؼ���װ�˶�� DOM �ڵ�������д��������
 */
var Control = Class({

    /**
	 * ��ǰ UI ����󶨵� Dom ����
	 * @type {Dom}
	 */
    dom: null,

    /**
	 * ��ǰ UI ����� css �ࡣ
	 * @protected virtual
	 */
    cssClass: "ui-control",

    /**
	 * ��ǰ UI ����� HTML ģ���ַ��������� ui-control �ᱻ�滻Ϊ cssClass ���Ե�ֵ��
	 * @getter {String} tpl
	 * @protected virtual
	 */
    tpl: '<div class="{cssClass}" />',

    /**
	 * ����������дʱ�����ɵ�ǰ�ؼ���Ӧ��ԭ���ڵ㡣
	 * @param {Object} options ѡ�
     * @return {Element} ԭ���� DOM �ڵ㡣
	 * @protected virtual
	 */
    create: function () {

        // תΪ�� tpl������
    	return Dom.parse(String.format(this.tpl, this));
    },

    /**
	 * ����������дʱ����ʼ����ǰ�ؼ���
	 * @param {Object} options ��ǰ�ؼ��ĳ�ʼ�����á�
	 * @protected virtual
	 */
    init: Function.empty,

	/**
	 * ���õ�ǰ�������״̬, ���ı�ؼ�����ʽ��
     * @param {String} name ״̬����
     * @param {Boolean} value=false Ҫ���õ�״ֵ̬��
	 * @protected virtual
	 */
    state: function (name, value) {
    	this.dom.toggleClass(this.cssClass + '-' + name, value);
    },

    attach: function (parentDom, refDom) {
    	if (refDom && refDom.length) {
    		refDom.before(this.dom);
    	} else {
    		parentDom.append(this.dom);
    	}
    },

    detach: function () {
    	this.dom.remove();
    },

	/**
	 * ��ʼ��һ���µĿؼ���
	 * @param {String/Element/Dom/Object} [options] �󶨵Ľڵ��ڵ� id �����������ö������ڳ�ʼ����ǰ�ؼ���
	 */
    constructor: function (options) {

    	// �������пؼ����õĹ��캯����
    	var me = this,

			// ��ʱ�����ö���
			opt = {};

    	// ����������á�
    	if (options) {

    		// ��� options �Ǵ����á�
    		if (options.constructor === Object) {

    			// �����ÿ����� opt ����
    			Object.extend(opt, options);

    			// ���� dom �ֶ�
    			me.dom = opt.dom ? Dom.query(opt.dom) : me.create(opt);

    		} else {

    			// ���򣬳��Ը��� options �ҵ��ڵ㡣
    			me.dom = Dom.query(options);
    		}

    	} else {

    		me.dom = me.create(opt);
    	}

    	// ���� init ��ʼ���ؼ���
    	me.init(opt);

    	// ���������ĸ���ѡ�
    	me.set(opt);
    },

    set: function (options) {
    	var key, value;
    	for (key in options) {
    		value = options[key];
    		if (key in this) {
    			if (typeof this[key] === 'function') {
    				this[key](value);
    			} else {
    				this[key] = value;
    			}
    		} else if (/^on(\w+)/.test(key)) {
    			value ? this.on(RegExp.$1, value) : this.un(RegExp.$1);
    		} else {
    			this.dom.set(key, value);
    		}
    	}

    	return this;
    },

    renderTo: function (parent, refChild) {
    	this.attach(Dom.query(parent, this.dom[0]), refChild);
    	return this;
    },

    remove: function () {
    	this.detach();
    	return this;
    }

});
