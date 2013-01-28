/**
 * @author xuld
 */


include("dom/base.js");


(function () {

	/**
	 * Ĭ�����ڻ�ȡ���������Եĺ�����
	 */
	var defaultHook = {
		getProp: function (elem, name) {
			return name in elem ? elem[name] : null;
		},
		setProp: function (elem, name, value) {
			if ('238'.indexOf(elem.nodeType) === -1) {
				elem[name] = value;
			}
		},

		get: function (elem, name) {
			return elem.getAttribute ? elem.getAttribute(name) : this.getProp(elem, name);
		},
		set: function (elem, name, value) {
			if (elem.setAttribute) {

				// �������ֵΪ null, ��ʾɾ�����ԡ�
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
		 * ��ȡ����������ʹ�� prop ������ attr ���������Եĺ�����
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
		 * ��ȡ�����÷��������� boolean ���������Եĺ�����
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
		 * �������Ե��б�
		 * @type Object
		 */
		propFix = {
			innerText: 'innerText' in Dom.div ? 'innerText' : 'textContent'
		},

		/**
		 * �������Ե��б�
		 * @type Object
		 */
		attrFix = {

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

					// Webkit��IE �� Selected ���ԡ�
					// ͨ������ parentNode �����޸���
					var parent = elem.parentNode;

					// ���� select, ���� option �� select ״̬��
					if (parent) {
						parent.selectedIndex;

						// ͬ������ optgroup 
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
		 * ��ȡ������ FORM ר�����Եĺ�����
		 */
		formHook = {
			get: function (elem, name, type) {
				var value = defaultHook.get(elem, name);
				if (!type && !value) {

					// elem[name] �����ǳ� DOM �ڵ㣬�����յ� FORM ��ȡĬ��ֵ��
					if (elem[name].nodeType) {
						elem = Dom.createNode('form');
					}
					value = elem[name];
				}
				return value;
			},
			set: defaultHook.set
		};
		
	
	/**
	 * ��ȡԪ�ص�����ֵ��
	 * @param {Node} elem Ԫ�ء�
	 * @param {String} name Ҫ��ȡ���������ơ�
	 * @return {String} ��������ֵ�����Ԫ��û����Ӧ���ԣ��򷵻� null ��
	 * @static
	 */
	Dom.getAttr = function (elem, name, type) {

		assert.isNode(elem, "Dom.getAttr(elem, name): {elem} ~");

		name = propFix[name] || name;

		var hook = attrFix[name];

		// ������ڹ��ӣ�ʹ�ù��ӻ�ȡ���ԡ�
		// ���ʹ�� defaultHook ��ȡ��
		return hook ? hook.get(elem, name, type) : defaultHook.get(elem, name.toLowerCase(), type);

	};

	/**
	 * �������Լ��ϡ�
	 * @property
	 * @type Object
	 * @static
	 * @private
	 */
	Dom.attrFix = attrFix;

	/**
	 * �������Լ��ϡ�
	 * @property
	 * @type Object
	 * @static
	 * @private
	 */
	Dom.propFix = propFix;

})();