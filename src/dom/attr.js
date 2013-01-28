/**
 * @author xuld
 */


include("dom/base.js");


(function () {

	/**
	 * 默认用于获取和设置属性的函数。
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
		 * 别名属性的列表。
		 * @type Object
		 */
		propFix = {
			innerText: 'innerText' in Dom.div ? 'innerText' : 'textContent'
		},

		/**
		 * 特殊属性的列表。
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
		 * 获取和设置 FORM 专有属性的函数。
		 */
		formHook = {
			get: function (elem, name, type) {
				var value = defaultHook.get(elem, name);
				if (!type && !value) {

					// elem[name] 被覆盖成 DOM 节点，创建空的 FORM 获取默认值。
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
	 * 获取元素的属性值。
	 * @param {Node} elem 元素。
	 * @param {String} name 要获取的属性名称。
	 * @return {String} 返回属性值。如果元素没有相应属性，则返回 null 。
	 * @static
	 */
	Dom.getAttr = function (elem, name, type) {

		assert.isNode(elem, "Dom.getAttr(elem, name): {elem} ~");

		name = propFix[name] || name;

		var hook = attrFix[name];

		// 如果存在钩子，使用钩子获取属性。
		// 最后使用 defaultHook 获取。
		return hook ? hook.get(elem, name, type) : defaultHook.get(elem, name.toLowerCase(), type);

	};

	/**
	 * 特殊属性集合。
	 * @property
	 * @type Object
	 * @static
	 * @private
	 */
	Dom.attrFix = attrFix;

	/**
	 * 特殊属性集合。
	 * @property
	 * @type Object
	 * @static
	 * @private
	 */
	Dom.propFix = propFix;

})();