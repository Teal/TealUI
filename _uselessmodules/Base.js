/**
 * @author xuld
 */


using("System.Core.Base");
 
 
// Core - 核心部分
// Parse - 节点解析部分
// Traversing - 节点转移部分
// Manipulation - 节点处理部分
// Style - CSS部分
// Attribute - 属性部分
// Event - 事件部分
// DomReady - 加载部分
// Dimension - 尺寸部分 
// Offset - 定位部分

(function(window) {
	
	assert(!window.Dom || window.$ !== window.Dom.get, "重复引入 System.Dom.Base 模块。");
	
	// 变量简写

	/**
	 * document 简写。
	 * @type Document
	 */
	var document = window.document,
	
		/**
		 * Object 简写。
		 * @type Object
		 */
		Object = window.Object,
	
		/**
		 * Object.extend 简写。
		 * @type Function
		 */
		extend = Object.extend,
	
		/**
		 * 数组原型。
		 * @type Object
		 */
		ap = Array.prototype,
	
		/**
		 * Object.map 缩写。
		 * @type Object
		 */
		map = Object.map,
	
		/**
		 * 指示当前浏览器是否为标签浏览器。
		 */
		isStd = navigator.isStd,
	
		// DOM 
	
		/**
		 * 提供对单一原生 HTML 节点的封装操作。
		 * @class
		 * @remark 
		 * @see DomList
		 * @see Dom.get
		 * @see Dom.query
		 * @remark
		 * 所有 DOM 方法都是依赖于此类进行的。比如如下 HTML 代码:
		 * <pre>
		 * &lt;div id="myDivId"&gt;内容&lt;/div&gt;
		 * </pre>
		 * 现在如果要操作这个节点，必须获取这个节点对应的 **Dom** 对象实例。
		 * 最常用的创建 **Dom** 对象实例的方法是 {@link Dom.get}。如:
		 * <pre>
		 * var myDiv = Dom.get("myDivId");
		 * 
		 * myDiv.addClass("cssClass");
		 * </pre>
		 * 其中，myDiv就是一个 **Dom** 对象。然后通过 **Dom** 对象提供的方法可以方便地操作这个节点。<br>
		 * myDiv.node 属性就是这个 Dom 对象对应的原生 HTML 节点。即:
		 * <pre>
		 * Dom.get("myDivId").node === document.getElementById("myDivId");
		 * </pre>
		 * 
		 * **Dom** 类仅实现了对一个节点的操作，如果需要同时处理多个节点，可以使用 {@link DomList} 类。
		 * 	{@link DomList} 类的方法和 **Dom** 类的方法基本一致。
		 */
		Dom = Class({
			
			/**
			 * 获取当 Dom 对象实际对应的 HTML 节点实例。
			 * @type Node
			 * @protected
			 */
			node: null,
			
			/**
			 * 获取当前类对应的数据字段。
			 * @protected override
			 * @return {Object} 一个可存储数据的对象。
			 * @remark
			 * 此函数会在原生节点上创建一个 $data 属性以存储数据。
			 */
			dataField: function(){
				
				// 将数据绑定在原生节点上。
				// 这在  IE 6/7 存在内存泄露问题。
				// 由于 IE 6/7 即将退出市场。此处忽略。
				return this.node.$data || (this.node.$data = {});
			},
		
			/**
			 * 使用一个原生节点初始化 Dom 对象的新实例。
			 * @param {Node} node 封装的元素。
			 */
			constructor: function(node) {
				assert.isNode(node, "Dom#constructor(node): {node} 必须是 DOM 节点。");
				this.node = node;
			},
		
			/**
			 * 将当前 Dom 对象插入到指定父 Dom 对象指定位置。
			 * @param {Node} parentNode 要添加的父节点。
			 * @param {Node} refNode=null 如果指定了此值，则当前节点将添加到此节点之前。
			 * @protected virtual
			 */
			attach: function(parentNode, refNode) {
				assert(parentNode && parentNode.nodeType, 'Dom#attach(parentNode, refNode): {parentNode} 必须是 DOM 节点。', parentNode);
				assert(refNode === null || refNode.nodeType, 'Dom#attach(parentNode, refNode): {refNode} 必须是 null 或 DOM 节点 。', refNode);
				parentNode.insertBefore(this.node, refNode);
			},
		
			/**
			 * 将当前 Dom 对象从指定的父 Dom 对象移除。
			 * @param {Node} parentNode 用于移除的父节点。
			 * @protected virtual
			 */
			detach: function(parentNode) {
				assert(parentNode && parentNode.removeChild, 'Dom#detach(parentNode): {parentNode} 必须是 DOM 节点 Dom 对象。', parent);
				
				// 仅当是直接父节点时删除。
				if(this.node.parentNode === parentNode)
					parentNode.removeChild(this.node);
			},
		
			/**
			 * 在当前 Dom 对象下插入一个子 Dom 对象到指定位置。
			 * @param {Dom} childControl 要插入 Dom 对象。
			 * @param {Dom} refControl=null 如果指定了此值，则插入到 Dom 对象之前。
			 * @protected virtual
			 */
			insertBefore: function(childControl, refControl) {
				assert(childControl && childControl.attach, 'Dom#insertBefore(childControl, refControl): {childControl} 必须 Dom 对象。', childControl);
				childControl.attach(this.node, refControl && refControl.node || null);
				return childControl;
			},
		
			/**
			 * 删除当 Dom 对象的指定 Dom 对象。
			 * @param {Dom} childControl 要删除 Dom 对象。
			 * @protected virtual
			 */
			removeChild: function(childControl) {
				assert(childControl && childControl.detach, 'Dom#removeChild(childControl): {childControl} 必须 Dom 对象。', childControl);
				
				childControl.detach(this.node);
				return childControl;
			},
			
			/**
			 * 判断当前节点是否和指定节点相等。
			 * @param {Dom} childControl 要判断的节点。
			 * @return {Boolean} 如果节点相同，则返回 true，否则返回 false 。
			 */
			equals: function(childControl){
				return this.node === childControl || (childControl && this.node === childControl.node);
			}
			
		}),
	
		/**
		 * 表示原生节点的集合。用于批量操作节点。
		 * @class
		 * @extends Array
		 * @see Dom
		 * @see Dom.query
		 * @remark
		 * **DomList** 是对元素列表的包装。  **DomList** 允许快速操作多个节点。 
		 * {@link Dom} 的所有方法对 **DomList** 都有效。
		 * 要查询 DomList 的方法，可以转到 {@link Dom} 类。
		 * 
		 * **DomList** 是一个伪数组，每个元素都是一个原生的 HTML 节点。
		 */
		DomList = Class({
	
			/**
			 * 获取当前集合的节点个数。
			 * @type {Number}
			 * @property
			 */
			length: 0,

			/**
			 * 使用包含节点的数组初始化 DomList 类的新实例。
			 * @param {Array/DomList} [doms] 用于初始化当前集合的节点集合。
			 * @constructor
			 */
			constructor: function(doms) {
				if (doms) {
					var dom;
					
					// 将参数的 doms 拷贝到当前集合。
					while (dom = doms[this.length]) {
						this[this.length++] = Dom.getNode(dom);
					}
				}
			},
	
			/**
			 * 获取当前集合中指定索引对应的 Dom 对象。
			 * @param {Number} index 要获取的元素索引。如果 *index* 小于 0， 则表示获取倒数 *index* 位置的元素。
			 * @return {Object} 指定位置所在的元素。如果指定索引的值不存在，则返回 undefined。
			 * @remark
			 * 使用 arr.item(-1) 可获取最后一个元素的值。
			 * @see Array#see
			 * @example 
			 * <pre>
		     * [0, 1, 2, 3].item(0);  // 0
		     * [0, 1, 2, 3].item(-1); // 3
		     * [0, 1, 2, 3].item(5);  // undefined
		     * </pre>
			 */
			item: function(index){
				var elem = this[index < 0 ? this.length + index : index];
				return elem ? new Dom(elem) : null;
			},
			
			/**
			 * 对当前集合的每个节点的 Dom 封装调用其指定属性名的函数，并将返回值放入新的数组返回。
			 * @param {String} fnName 要调用的函数名。
			 * @param {Array} args=[] 调用时的参数数组。
			 * @return {Array} 返回包含执行结果的数组。
			 * @see Array#see
			 */
			invoke: function(fnName, args) {
				args = args || [];
				var r = [];
				assert(dp[fnName] && dp[fnName].apply, "DomList#invoke(fnName): {fnName} 不是 Dom 对象的方法。", fnName);
				this.forEach(function(value) {
					value = new Dom(value);
					r.push(value[fnName].apply(value, args));
				});
				return r;
			},
			
			///TODO: clear
			
			concat: function(){
				assert.deprected('DomList#concat 已过时，请改用 DomList#add');
				return this.add.apply(this, arguments);
			},
			
			///TODO: clear
			
			/**
			 * 将参数节点添加到当前集合。
			 * @param {Node/NodeList/Array/DomList} ... 要增加的节点。
			 * @return this
			 */
			add: function() {
				for (var args = arguments, i = 0, value; i < args.length; i++) {
					value = args[i], j = -1;
					if(value){
						if(typeof value.length !== 'number')
							value = [value];
							
						while(++j < value.length)
							this.include(Dom.getNode(value[j]));
					}
				}
	
				return this;
			},

			/**
			 * 使用指定的 CSS 选择器或函数过滤当前集合，并返回满足要求的元素的新 DomList 对象。
			 * @param {String/Function} expression 用于过滤的 CSS 选择器或自定义函数，具体格式参考 {@link Array#filter}。
			 * @return {DomList} 满足要求的元素的新 DomList 对象。
			 */
			filter: function(expression) {
				return new DomList(ap.filter.call(this, typeof expression === 'string' ? function(elem){
					return Dom.match(elem, expression);
				} : expression));
			},
			
			/**
			 * 为每个元素绑定事件。
			 * @remark 见 {@link JPlus.Base#on}
			 */
			on: createDomListMthod('on'),

			/**
			 * 为每个元素删除绑定事件。
			 * @remark 见 {@link JPlus.Base#un}
			 */
			un: createDomListMthod('un'),

			/**
			 * 触发每个元素事件。
			 * @remark 见 {@link JPlus.Base#trigger}
			 */
			trigger: function(type, e) {
				return this.invoke('trigger', [type, e]).indexOf(false) < 0;
			}
			
		}),
	
		/**
		 * 表示一个点。包含 x 坐标和 y 坐标。
		 * @class Point
		 */
		Point = Class({
			
			/**
			 * @field {Number} x X 坐标。
			 */
			
			/**
			 * @field {Number} y Y 坐标。
			 */
	
			/**
			 * 初始化 Point 的新实例。
			 * @param {Number} x X 坐标。
			 * @param {Number} y Y 坐标。
			 * @constructor
			 */
			constructor: function(x, y) {
				this.x = x;
				this.y = y;
			},
			
			/**
			 * 将当前值加上 *p*。
			 * @param {Point} p 值。
			 * @return {Point} this
			 */
			add: function(p) {
				assert(p && 'x' in p && 'y' in p, "Point#add(p): {p} 必须有 'x' 和 'y' 属性。", p);
				return new Point(this.x + p.x, this.y + p.y);
			},

			/**
			 * 将当前值减去 *p*。
			 * @param {Point} JPlus 值。
			 * @return {Point} this
			 */
			sub: function(p) {
				assert(p && 'x' in p && 'y' in p, "Point#sub(p): {p} 必须有 'x' 和 'y' 属性。", p);
				return new Point(this.x - p.x, this.y - p.y);
			}
		}),
		
		/**
		 * DOM 事件。
		 */
		DomEvent = Class({

			/**
			 * 构造函数。
			 * @param {Object} target 事件对象的目标。
			 * @param {String} type 事件对象的类型。
			 * @param {Object} [e] 事件对象的属性。
			 * @constructor
			 */
			constructor: function(target, type) {
				assert.notNull(target, "Dom.Event#constructor(target, type): {target} ~");

				this.target = target;
				this.type = type;
			},
			
			/**
			 * 阻止事件的冒泡。
			 * @remark 默认情况下，事件会向父元素冒泡。使用此函数阻止事件冒泡。
			 */
			stopPropagation: function() {
				this.cancelBubble = true;
			},
			
			/**
			 * 取消默认事件发生。
			 * @remark 有些事件会有默认行为，如点击链接之后执行跳转，使用此函数阻止这些默认行为。
			 */
			preventDefault: function() {
				this.returnValue = false;
			},
			
			/**
			 * 获取当前发生事件 Dom 对象。
			 * @return {Dom} 发生事件 Dom 对象。
			 */
			getTarget: function() {
				return new Dom((this.orignalType && this.currentTarget) || (this.target.nodeType === 3 ? this.target.parentNode : this.target));
			}
		}),
		
		// 系统使用的变量
		
		/**
		 * Dom.prototype
		 */
		dp = Dom.prototype,
		
		/**
		 * DomEvent.prototype
		 */
		ep = DomEvent.prototype,
		
		/**
		 * 一个返回 true 的函数。
		 */
		returnTrue = function () { return true; },

		/**
		 * 用于测试的元素。
		 * @type Element
		 */
		div = document.createElement('DIV'),
	
		/**
		 * 函数 Dom.parseNode使用的新元素缓存。
		 * @type Object
		 */
		cache = {},
		
		/**
		 * 默认事件。
		 * @type Object
		 */
		defaultEvent = {
			
			/**
			 * 阻止事件的函数。 
			 * @param {Event} e 事件参数。
			 */
			stopEvent: function(e){
				e.stopPropagation();
				e.preventDefault();
			},

			/**
			 * 发送处理指定的事件。
			 * @param {Dom} dom 事件所有者。
			 * @param {Event} eventName 事件名。
			 * @param {Function} eventListener 事件监听器。
			 * @return {Event} e 事件参数。
			 */
			dispatch: function (dom, eventName, eventListener, e) {
				dom = dom.node;
				
				var event = e;
				
				if(!e || !e.type){
					e = new Dom.Event(dom, eventName);
					
					if(event) {
						
						// IE 8- 在处理原生事件时肯能出现错误。
						try{
							extend(e, event);
						}catch(ex){
							
						}
						
					}
				}

				return eventListener(e) && (!dom[eventName = 'on' + eventName] || dom[eventName](e) !== false);
			},

			/**
			 * 添加绑定事件。
			 * @param {Dom} ctrl 事件所有者。
			 * @param {String} type 类型。
			 * @param {Function} fn 函数。
			 */
			add: div.addEventListener ? function (dom, type, fn) {
				dom.node.addEventListener(type, fn, false);
			} : function (dom, type, fn) {
				dom.node.attachEvent('on' + type, fn);
			},

			/**
			 * 删除事件。
			 * @param {Object} elem 对象。
			 * @param {String} type 类型。
			 * @param {Function} fn 函数。
			 */
			remove: div.removeEventListener ? function (dom, type, fn) {
				dom.node.removeEventListener(type, fn, false);
			} : function (dom, type, fn) {
				dom.node.detachEvent('on' + type, fn);
			}

		},
		
		/**
		 * 鼠标事件。 
		 * @type Object
		 */
		mouseEvent = defaultEvent,
		
		/**
		 * 键盘事件。 
		 * @type Object
		 */
		keyEvent = defaultEvent,
		
		// 正则

		/**
		 * 处理 <div/> 格式标签的正则表达式。
		 * @type RegExp
		 */
		rXhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
		
		/// #if CompactMode
		
		/**
		 * 透明度的正则表达式。
		 * @type RegExp IE8 使用滤镜支持透明度，这个表达式用于获取滤镜内的表示透明度部分的子字符串。
		 */
		rOpacity = /opacity=([^)]*)/,
		
		/// #endif
		
		/**
		 * 是否属性的正则表达式。
		 * @type RegExp
		 */
		rStyle = /-(\w)|float/g,
		
		/**
		 * 判断 body 节点的正则表达式。
		 * @type RegExp
		 */
		rBody = /^(?:BODY|HTML|#document)$/i,

		/**
		 * 判断选择框的正则表达式。
		 * @type RegExp
		 */
		rCheckBox = /^(?:checkbox|radio)$/,
		
		// attr
		
		/**
		 * 默认用于获取和设置属性的函数。
		 */
		defaultHook = {
			getProp: function(elem, name) {
				return name in elem ? elem[name] : null;
			},
			setProp: function(elem, name, value) {
				if ('238'.indexOf(elem.nodeType) === -1){
					elem[name] = value;
				}
			},
			
			get: function(elem, name) {
				return elem.getAttribute ? elem.getAttribute(name) : this.getProp(elem, name);
			},
			set: function(elem, name, value) {
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
			get: function(elem, name, type) {
				return type || !(name in elem) ? defaultHook.get(elem, name) : elem[name];
			},
			set: function(elem, name, value) {
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
			set: function(elem, name, value) {
				elem[name] = value;
			}
		},
		
		/**
		 * 获取和设置 FORM 专有属性的函数。
		 */
		formHook = {
			get: function(elem, name, type){
				var value = defaultHook.get(elem, name);
				if(!type && !value) {
					
					// elem[name] 被覆盖成 DOM 节点，创建空的 FORM 获取默认值。
					if(elem[name].nodeType){
						elem = Dom.createNode('form');
					}
					value = elem[name];
				}
				return value;
			},	
			set: defaultHook.set
		},
		
		// 修复用的 JSON 对象
		
		/**
		 * 在 Dom.parseNode 和 setHtml 中对 HTML 字符串进行包装用的字符串。
		 * @type Object 部分元素只能属于特定父元素， parseFix 列出这些元素，并使它们正确地添加到父元素中。 IE678
		 *       会忽视第一个标签，所以额外添加一个 div 标签，以保证此类浏览器正常运行。
		 */
		parseFix = {
			$default: isStd ? [1, '', '']: [2, '$<div>', '</div>'],
			option: [2, '<select multiple="multiple">', '</select>'],
			legend: [2, '<fieldset>', '</fieldset>'],
			thead: [2, '<table>', '</table>'],
			tr: [3, '<table><tbody>', '</tbody></table>'],
			td: [4, '<table><tbody><tr>', '</tr></tbody></table>'],
			col: [3, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
			area: [2, '<map>', '</map>']
		},
		
		/**
		 * 特殊属性的设置方式。
		 */
		styleFix = {
			height: function(value) {
				this.node.style.height = value > 0 ? value + 'px' : value <= 0 ? '0px' : value;
				return this;
			},
			width: function(value) {
				this.node.style.width = value > 0 ? value + 'px' : value <= 0 ? '0px' : value;
				return this;
			}
		},
		
		/**
		 * 别名属性的列表。
		 * @type Object
		 */
		propFix = {
			innerText: 'innerText' in div ? 'innerText' : 'textContent'
		},
		
		/**
		 * 特殊属性的列表。
		 * @type Object
		 */
		attrFix = {

			maxLength: {
				get: propHook.get,
				set: function(elem, name, value) {
					if (value || value === 0) {
						elem[name] = value;
					} else {
						defaultHook.set(elem, name, null);
					}
				}
			},

			selected: {
				get: function(elem, name, type) {

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
				set : boolHook.set
			},
			
			checked: {
				get: function(elem, name, type) {
					// type  0 => boolean , 1 => "checked",  2 => defaultChecked => "checked"
					return name in elem ? type ? (type === 1 ? elem[name] : elem.defaultChecked) ? name : null : elem[name] : defaultHook.get(elem, name);
				},
				set: boolHook.set
			},
			
			value: {
				get: function(elem, name, type) {
					// type  0/1 => "value",  2 => defaultValue => "value"
					return name in elem ? type !== 2 ? elem[name] : elem.defaultValue : defaultHook.get(elem, name);
				},
				set: propHook.set
			},

			tabIndex: {
				get: function(elem, name, type) {
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
		 * 字符串字段。
		 * @type Object
		 */
		textFix = {},
		
		/// #if CompactMode
		 
		/**
		 * 获取元素的实际的样式属性。
		 * @param {Element} elem 需要获取属性的节点。
		 * @param {String} name 需要获取的CSS属性名字。
		 * @return {String} 返回样式字符串，肯能是 undefined、 auto 或空字符串。
		 */
		getStyle = window.getComputedStyle ? function(elem, name) {
	
			// getComputedStyle为标准浏览器获取样式。
			assert.isElement(elem, "Dom.getStyle(elem, name): {elem} ~");
	
			// 获取真实的样式owerDocument返回elem所属的文档对象
			// 调用getComputeStyle的方式为(elem,null)
			var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
	
			// 返回 , 在 火狐如果存在 IFrame， 则 computedStyle == null
			// http://drupal.org/node/182569
			return computedStyle ? computedStyle[name]: null;
	
		}: function(elem, name) {
	
			assert.isElement(elem, "Dom.getStyle(elem, name): {elem} ~");
	
			// 特殊样式保存在 styleFix 。
			if( name in styleFix) {
				switch (name) {
					case 'height':
						return elem.offsetHeight === 0 ? 'auto': elem.offsetHeight -  Dom.calc(elem, 'by+py') + 'px';
					case 'width':
						return elem.offsetWidth === 0 ? 'auto': elem.offsetWidth -  Dom.calc(elem, 'bx+px') + 'px';
					case 'opacity':
						return rOpacity.test(styleString(elem, 'filter')) ? parseInt(RegExp.$1) / 100 + '': '1';
				}
			}
			// currentStyle：IE的样式获取方法,runtimeStyle是获取运行时期的样式。
			// currentStyle是运行时期样式与style属性覆盖之后的样式
			var r = elem.currentStyle;
	
			if(!r)
				return "";
			r = r[name];
	
			// 来自 jQuery
			// 如果返回值不是一个带px的 数字。 转换为像素单位
			if(/^-?\d/.test(r) && !/^-?\d+(?:px)?$/i.test(r)) {
	
				// 保存初始值
				var style = elem.style, left = style.left, rsLeft = elem.runtimeStyle.left;
	
				// 放入值来计算
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = name === "fontSize" ? "1em": (r || 0);
				r = style.pixelLeft + "px";
	
				// 回到初始值
				style.left = left;
				elem.runtimeStyle.left = rsLeft;
	
			}
	
			return r;
		},
		
		/// #else
		
		/// getStyle = function (elem, name) {
		///
		/// 	// 获取样式
		/// 	var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
		///
		/// 	// 返回
		/// 	return computedStyle ? computedStyle[ name ]: null;
		///
		/// },
		/// #endif

		/**
		 * float 属性的名字。
		 * @type String
		 */
		styleFloat = 'cssFloat' in div.style ? 'cssFloat': 'styleFloat',
		
		// IE：styleFloat Other：cssFloat
		
		/**
		 * 浏览器使用的真实的 DOMContentLoaded 事件名字。
		 * @type String
		 */
		domReady,

		t;
	
	// 变量初始化。

	// 初始化 parseFix。
	parseFix.optgroup = parseFix.option;
	parseFix.tbody = parseFix.tfoot = parseFix.colgroup = parseFix.caption = parseFix.thead;
	parseFix.th = parseFix.td;

	// 初始化 attrFix。
	map("enctype encoding action method target", formHook, attrFix);

	// 初始化 attrFix。
	map("defaultChecked defaultSelected readOnly disabled autofocus autoplay async controls hidden loop open required scoped compact noWrap isMap declare noshade multiple noresize defer useMap", boolHook, attrFix);

	// 初始化 propFix。
	map("readOnly tabIndex defaultChecked defaultSelected accessKey useMap contentEditable maxLength", function(value) {
		propFix[value.toLowerCase()] = value;
	});

	// 初始化 attrFix。
	map("innerHTML innerText textContent tagName nodeName nodeType nodeValue defaultValue selectedIndex cellPadding cellSpacing rowSpan colSpan frameBorder", function(value) {
		propFix[value.toLowerCase()] = value;
		attrFix[value] = propHook;
	});
	
	// 初始化 textFix。
	textFix.INPUT = textFix.SELECT = textFix.TEXTAREA = 'value';
	textFix['#text'] = textFix['#comment'] = 'nodeValue';
	
	/// #region Dom
	
	/**
	 * @class Dom
	 */
	
	extend(Dom, {
		
		/**
		 * 根据一个 *id* 或原生节点获取一个 {@link Dom} 类的实例。
		 * @param {String/Node/Dom/DomList} id 要获取元素的 id 或用于包装成 Dom 对象的任何元素，如是原生的 DOM 节点、原生的 DOM 节点列表数组或已包装过的 Dom 对象。。
	 	 * @return {Dom} 此函数返回是一个 Dom 类型的变量。通过这个变量可以调用所有文档中介绍的 DOM 操作函数。如果无法找到指定的节点，则返回 null 。此函数可简写为 $。
	 	 * @static
	 	 * @example
	 	 * 找到 id 为 a 的元素。
	 	 * #####HTML:
	 	 * <pre lang="htm" format="none">
	 	 * &lt;p id="a"&gt;once&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;
	 	 * </pre>
	 	 * #####JavaScript:
	 	 * <pre>Dom.get("a");</pre>
	 	 * #####结果:
	 	 * <pre>{&lt;p id="a"&gt;once&lt;/p&gt;}</pre>
	 	 * 
	 	 * <br>
	 	 * 返回 id 为 a1 的 DOM 对象
	 	 * #####HTML:
	 	 * <pre lang="htm" format="none">&lt;p id="a1"&gt;&lt;/p&gt; &lt;p id="a2"&gt;&lt;/p&gt; </pre>
	 	 *
	 	 * #####JavaScript:
	 	 * <pre>Dom.get(document.getElecmentById('a1')) // 等效于 Dom.get('a1')</pre>
	 	 * <pre>Dom.get(['a1', 'a2']); // 等效于 Dom.get('a1')</pre>
	 	 * <pre>Dom.get(Dom.get('a1')); // 等效于 Dom.get('a1')</pre>
	 	 * 
	 	 * #####结果:
	 	 * <pre>{&lt;p id="a1"&gt;&lt;/p&gt;}</pre>
		 */
		get: function(id) {
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
		 * 执行一个 CSS 选择器，返回第一个元素对应的 {@link Dom} 对象。
		 * @param {String/NodeList/DomList/Array/Dom} 用来查找的 CSS 选择器或原生的 DOM 节点。
		 * @return {Element} 如果没有对应的节点则返回一个空的 DomList 对象。
	 	 * @static
	 	 * @see DomList
	 	 * @example
	 	 * 找到第一个 p 元素。
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
	 	 * #####结果:
	 	 * <pre lang="htm" format="none">
	 	 * {  &lt;p&gt;one&lt;/p&gt;  }
	 	 * </pre>
	 	 * 
	 	 * <br>
	 	 * 找到第一个 p 元素，并且这些元素都必须是 div 元素的子元素。
	 	 * #####HTML:
	 	 * <pre lang="htm" format="none">
	 	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;</pre>
	 	 * 
	 	 * #####Javascript:
	 	 * <pre>
	 	 * Dom.find("div &gt; p");
	 	 * </pre>
	 	 * 
	 	 * #####结果:
	 	 * <pre lang="htm" format="none">
	 	 * { &lt;p&gt;two&lt;/p&gt; }
	 	 * </pre>
		 */
		find: function(selector){
			return typeof selector === "string" ?
				document.find(selector) :
				Dom.get(selector);
		},
		
		/**
		 * 执行一个 CSS 选择器，返回一个新的 {@link DomList} 对象。
		 * @param {String/NodeList/DomList/Array/Dom} 用来查找的 CSS 选择器或原生的 DOM 节点列表。
		 * @return {Element} 如果没有对应的节点则返回一个空的 DomList 对象。
	 	 * @static
	 	 * @see DomList
	 	 * @example
	 	 * 找到所有 p 元素。
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
	 	 * #####结果:
	 	 * <pre lang="htm" format="none">
	 	 * [  &lt;p&gt;one&lt;/p&gt; ,&lt;p&gt;two&lt;/p&gt;, &lt;p&gt;three&lt;/p&gt;  ]
	 	 * </pre>
	 	 * 
	 	 * <br>
	 	 * 找到所有 p 元素，并且这些元素都必须是 div 元素的子元素。
	 	 * #####HTML:
	 	 * <pre lang="htm" format="none">
	 	 * &lt;p&gt;one&lt;/p&gt; &lt;div&gt;&lt;p&gt;two&lt;/p&gt;&lt;/div&gt; &lt;p&gt;three&lt;/p&gt;</pre>
	 	 * 
	 	 * #####Javascript:
	 	 * <pre>
	 	 * Dom.query("div &gt; p");
	 	 * </pre>
	 	 * 
	 	 * #####结果:
	 	 * <pre lang="htm" format="none">
	 	 * [ &lt;p&gt;two&lt;/p&gt; ]
	 	 * </pre>
         * 
	 	 * <br>
         * 查找所有的单选按钮(即: type 值为 radio 的 input 元素)。
         * <pre>Dom.query("input[type=radio]");</pre>
		 */
		query: function(selector) {
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
		 * 根据提供的原始 HTML 标记字符串，解析并动态创建一个节点，并返回这个节点的 Dom 对象包装对象。
		 * @param {String/Node} html 用于动态创建DOM元素的HTML字符串。
		 * @param {Document} ownerDocument=document 创建DOM元素所在的文档。
		 * @param {Boolean} cachable=true 指示是否缓存节点。
		 * @return {Dom} Dom 对象。
	 	 * @static
	 	 * @remark
	 	 * 可以传递一个手写的 HTML 字符串，或者由某些模板引擎或插件创建的字符串，也可以是通过 AJAX 加载过来的字符串。但是在你创建 input 元素的时会有限制，可以参考第二个示例。当然这个字符串可以包含斜杠 (比如一个图像地址)，还有反斜杠。当创建单个元素时，请使用闭合标签或 XHTML 格式。
	 	 * 在这个函数的内部，是通过临时创建一个元素，并将这个元素的 innerHTML 属性设置为给定的标记字符串，来实现标记到 DOM 元素转换的。所以，这个函数既有灵活性，也有局限性。
	 	 * 
	 	 * @example
	 	 * 动态创建一个 div 元素（以及其中的所有内容），并将它追加到 body 元素中。
	 	 * #####JavaScript:
	 	 * <pre>Dom.parse("&lt;div&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;/div&gt;").appendTo(document.body);</pre>
	 	 * #####结果:
	 	 * <pre lang="htm" format="none">[&lt;div&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;/div&gt;]</pre>
	 	 * 
	 	 * 创建一个 &lt;input&gt; 元素必须同时设定 type 属性。因为微软规定 &lt;input&gt; 元素的 type 只能写一次。
	 	 * #####JavaScript:
	 	 * <pre>
	 	 * // 在 IE 中无效:
	 	 * Dom.parse("&lt;input&gt;").setAttr("type", "checkbox");
	 	 * // 在 IE 中有效:
	 	 * Dom.parse("&lt;input type='checkbox'&gt;");
	 	 * </pre>        
		 */
		parse: function(html, context, cachable) {
		    return (html = Dom.parseNode(html, context, cachable)) ? html.nodeType ? new Dom(html) : html : null;
		},

		/**
		 * 创建一个指定标签的节点，并返回这个节点的 Dom 对象包装对象。
		 * @param {String} tagName 要创建的节点标签名。
		 * @param {String} className 用于新节点的 CSS 类名。
	 	 * @static
	 	 * @example
	 	 * 动态创建一个 div 元素（以及其中的所有内容），并将它追加到 body 元素中。在这个函数的内部，是通过临时创建一个元素，并将这个元素的 innerHTML 属性设置为给定的标记字符串，来实现标记到 DOM 元素转换的。所以，这个函数既有灵活性，也有局限性。
	 	 * #####JavaScript:
	 	 * <pre>Dom.create("div", "cls").appendTo(document.body);</pre>
	 	 *
	 	 * 创建一个 div 元素同时设定 class 属性。
	 	 * #####JavaScript:
	 	 * <pre>Dom.create("div", "className");</pre>
	 	 * #####结果:
	 	 * <pre lang="htm" format="none">{&lt;div class="className"&gt;&lt;/div&gt;}</pre>
		 */
		create: function(tagName, className) {
			return new Dom(Dom.createNode(tagName, className || ''));
		},
		
		/**
		 * 根据一个 id 获取元素。如果传入的id不是字符串，则直接返回参数。
		 * @param {String/Node/Dom} id 要获取元素的 id 或元素本身。
	 	 * @return {Node} 元素。
	 	 * @static
		 */
		getNode: function (id) {
			return id ? 
					id.nodeType || id.setTimeout ?
						id :
						id.node || (typeof id === "string" ? 
							document.getElementById(id) :
							Dom.getNode(id[0])
						) :
						null;
		},
		
		/**
		 * 创建一个节点。
		 * @param {String} tagName 创建的节点的标签名。
		 * @param {String} className 创建的节点的类名。
	 	 * @static
		 */
		createNode: function(tagName, className) {
			assert.isString(tagName, 'Dom.create(tagName, className): {tagName} ~');
			var div = document.createElement(tagName);
			div.className = className;
			return div;
		},
		
		/**
		 * 解析一个 html 字符串，返回相应的原生节点。
		 * @param {String/Element} html 要解析的 HTML 字符串。如果解析的字符串是一个 HTML 字符串，则此函数会忽略字符串前后的空格。
		 * @param {Element} context=document 生成节点使用的文档中的任何节点。
		 * @param {Boolean} cachable=true 指示是否缓存节点。这会加速下次的解析速度。
		 * @return {Element/TextNode/DocumentFragment} 如果 HTML 是纯文本，返回 TextNode。如果 HTML 包含多个节点，返回 DocumentFragment 。否则返回 Element。
	 	 * @static
		 */
		parseNode: function (html, context, cachable) {

			// 不是 html，直接返回。
			if( typeof html === 'string') {

			    var srcHTML = html;

                // 仅缓存 512B 以内的 HTML 字符串。
			    cachable = cachable !== false && srcHTML.length < 512;
			    context = context && context.ownerDocument || document;

			    assert(context.createElement, 'Dom.parseNode(html, context, cachable): {context} 必须是 DOM 节点。', context);

				// 查找是否存在缓存。
			    if (cachable && (html = cache[srcHTML]) && html.ownerDocument === context) {

					// 复制并返回节点的副本。
					html = html.cloneNode(true);

				} else {

					// 测试查找 HTML 标签。
					var tag = /<([!\w:]+)/.exec(srcHTML);

					if(tag) {

						assert.isString(srcHTML, 'Dom.parseNode(html, context, cachable): {html} ~');
						html = context.createElement("div");

						var wrap = parseFix[tag[1].toLowerCase()] || parseFix.$default;

						// IE8- 会过滤字符串前的空格。
						// 为了保证全部浏览器统一行为，此处删除全部首尾空格。

						html.innerHTML = wrap[1] + srcHTML.trim().replace(rXhtmlTag, "<$1></$2>") + wrap[2];

						// UE67: 如果节点未添加到文档。需要重置 checkbox 的 checked 属性。
						if (navigator.isQuirks) {
							each(html.getElementsByTagName('INPUT'), function(elem) {
								if(rCheckBox.test(elem.type)) {
									elem.checked = elem.defaultChecked;
								}
							});
						}

						// 转到正确的深度。
						// IE 肯能无法正确完成位置标签的处理。
						for( tag = wrap[0]; tag--; )
							html = html.lastChild;

						assert.isNode(html, "Dom.parseNode(html, context, cachable): 无法根据 {html} 创建节点。", srcHTML);

						// 如果解析包含了多个节点。
						if (html.previousSibling) {
							wrap = html.parentNode;

							//if (createDocumentFragment) {
							//    assert(context.createDocumentFragment, 'Dom.parseNode(html, context, cachable): {context} 必须是 DOM 节点。', context);
							//    html = context.createDocumentFragment();
							//    while (wrap.firstChild) {
							//        html.appendChild(wrap.firstChild);
							//    }
							//} else {
							html = new DomList();
							for (srcHTML = wrap.firstChild; srcHTML; srcHTML = srcHTML.nextSibling) {
							    html.push(srcHTML);
							}

							cachable = false;
							//}
						} else {

							// 删除用于创建节点的父 DIV 标签。
							html.parentNode.removeChild(html);
						}

						// 一般使用最后的节点， 如果存在最后的节点，使用父节点。
						// 如果有多节点，则复制到片段对象。
						cachable = cachable && !/<(?:script|object|embed|option|style)/i.test(srcHTML);

					} else {

						// 创建文本节点。
						html = context.createTextNode(srcHTML);
					}

					if(cachable) {
						cache[srcHTML] = html.cloneNode(true);
					}

				}

			}

			return html;

		},
		
		/**
		 * 判断一个元素是否符合一个选择器。
		 * @param {Node} elem 一个 HTML 节点。
		 * @param {String} selector 一个 CSS 选择器。
		 * @return {Boolean} 如果指定的元素匹配输入的选择器，则返回 true， 否则返回 false 。
	 	 * @static
		 */
		match: function (elem, selector) {
			assert.isString(selector, "Dom#find(selector): selector ~。");
			
			if(elem.nodeType !== 1)
				return false;
				
			if(!elem.parentNode){
				var div = document.createElement('div');
				div.appendChild(elem);
				try{
					return match(elem, selector);
				} finally {
					div.removeChild(elem);
				}
			}
			return match(elem, selector);
		},

		/**
		 * 判断指定节点之后有无存在子节点。
		 * @param {Element} elem 节点。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 如果确实存在子节点，则返回 true ， 否则返回 false 。
	 	 * @static
		 */
		has: div.compareDocumentPosition ? function(elem, child) {
			assert.isNode(elem, "Dom.has(elem, child): {elem} ~");
			assert.isNode(child, "Dom.has(elem, child): {child} ~");
			return !!(child && (elem.compareDocumentPosition(child) & 16));
		}: function(elem, child) {
			assert.isNode(elem, "Dom.has(elem, child): {elem} ~");
			assert.isNode(child, "Dom.has(elem, child): {child} ~");
			if (child) {
			    while (child = child.parentNode)
			        if (elem === child)
			            return true;
			}

			return false;
		},
		
		/**
		 * 获取一个元素对应的文本。
		 * @param {Element} elem 元素。
		 * @return {String} 值。对普通节点返回 text 属性。
	 	 * @static
		 */
		getText: function(elem) {
			assert.isNode(elem, "Dom.getText(elem, name): {elem} ~");
			return elem[textFix[elem.nodeName] || propFix.innerText] || '';
		},

		/**
		 * 获取元素的属性值。
		 * @param {Node} elem 元素。
		 * @param {String} name 要获取的属性名称。
		 * @return {String} 返回属性值。如果元素没有相应属性，则返回 null 。
	 	 * @static
		 */
		getAttr: function(elem, name, type) {
			
			assert.isNode(elem, "Dom.getAttr(elem, name): {elem} ~");
			
			name = propFix[name] || name;
			
			var hook = attrFix[name];
			
			// 如果存在钩子，使用钩子获取属性。
			// 最后使用 defaultHook 获取。
			return hook ? hook.get(elem, name, type) : defaultHook.get(elem, name.toLowerCase(), type);

		},
		
		/**
		 * 判断一个节点是否隐藏。
		 * @method isHidden
		 * @return {Boolean} 隐藏返回 true 。
	 	 * @static
		 */
		
		/**
		 * 检查是否含指定类名。
		 * @param {Element} elem 要测试的元素。
		 * @param {String} className 类名。
		 * @return {Boolean} 如果存在返回 true。
	 	 * @static
		 */
		hasClass: function(elem, className) {
			assert.isNode(elem, "Dom.hasClass(elem, className): {elem} ~");
			assert(className && (!className.indexOf || !/[\s\r\n]/.test(className)), "Dom.hasClass(elem, className): {className} 不能空，且不允许有空格和换行。如果需要判断 2 个 class 同时存在，可以调用两次本函数： if(hasClass('A') && hasClass('B')) ...");
			return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
		},

		/**
		 * 存储事件对象的信息。
		 */
		$event: {},
		
		/**
		 * 特殊属性集合。
		 * @type Object 特殊的属性，在节点复制时不会被复制，因此需要额外复制这些属性内容。
	 	 * @static
		 */
		cloneFix: {
			INPUT: function(srcElem, destElem) {
				
				if (rCheckBox.test(srcElem.type)) {

					// IE6 必须同时设置 defaultChecked 属性。
					destElem.defaultChecked = destElem.checked = srcElem.checked;

					// IE67 无法复制 value 属性。
					if (destElem.value !== srcElem.value) {
						destElem.value = srcElem.value;
					}
				} else {
					destElem.value = srcElem.value;
				}
			},
			TEXTAREA: 'value',
			OPTION: 'selected',
			OBJECT: function(destElem, srcElem) {
				if (destElem.parentNode) {
					destElem.outerHTML = srcElem.outerHTML;
					
					if(srcElem.innerHTML && !destElem.innerHTML)
						destElem.innerHTML = srcElem.innerHTML;
				}
			}
		},
		
		/**
		 * 特殊属性集合。
		 * @property
		 * @type Object
		 * @static
		 * @private
		 */
		attrFix: attrFix,

		/**
		 * 特殊属性集合。
		 * @property
		 * @type Object
		 * @static
		 * @private
		 */
		propFix: propFix,
		
		/**
		 * 获取文本时应使用的属性值。
		 * @private
	 	 * @static
		 */
		textFix: textFix,
		
		/**
		 * 特殊的样式集合。
		 * @property
		 * @type Object
		 * @private
	 	 * @static
		 */
		styleFix: styleFix,
	
		/**
		 * 用于查找所有支持的伪类的函数集合。
		 * @private
	 	 * @static
		 */
		pseudos: {
			
			target : function (elem) {
				var nameOrId = elem.id || elem.name;
				if(!nameOrId) return false;
				var doc = getDocument(elem).defaultView;
				return nameOrId === (doc.defaultView || doc.parentWindow).location.hash.slice(1)
			},

			/**
			 * 判断一个节点是否有元素节点或文本节点。
			 * @param {Element} elem 要测试的元素。
			 * @return {Boolean} 如果存在子节点，则返回 true，否则返回 false 。
			 */
			empty: Dom.isEmpty = function(elem) {
				for( elem = elem.firstChild; elem; elem = elem.nextSibling )
					if( elem.nodeType === 1 || elem.nodeType === 3 ) 
						return false;
				return true;
			},
			
			contains: function( elem, args){ 
				return Dom.getText(elem).indexOf(args) >= 0;
			},
			
			/**
			 * 判断一个节点是否不可见。
			 * @return {Boolean} 如果元素不可见，则返回 true 。
			 */
			hidden: Dom.isHidden = function(elem) {
				return (elem.style.display || getStyle(elem, 'display')) === 'none';
			},
			visible: function( elem ){ return !Dom.isHidden(elem); },
			
			not: function(elem, args){ return !match(elem, args); },
			has: function(elem, args){ return query(args, new Dom(elem)).length > 0; },
			
			selected: function(elem) { return attrFix.selected.get(elem, 'selected', 1); },
			checked: function(elem){ return elem.checked; },
			enabled: function(elem){ return elem.disabled === false; },
			disabled: function(elem){ return elem.disabled === true; },
			
			input: function(elem){ return /^(input|select|textarea|button)$/i.test(elem.nodeName); },
			
			"nth-child": function(args, oldResult, result){
				var t = Dom.pseudos;
				if(t[args]){
					t[args](null, oldResult, result);	
				} else if(args = oldResult[args - 1])
					result.push(args);
			},
			"first-child": function (args, oldResult, result) {
				if(args = oldResult[0])
					result.push(args);
			},
			"last-child": function (args, oldResult, result) {
				if(args = oldResult[oldResult.length - 1])
					result.push(args);
			},
			"only-child": function(elem){ 
				var p = new Dom(elem.parentNode).first(elem.nodeName);
				return p && p.next(); 
			},
			odd: function(args, oldResult, result){
				var index = 0, elem, t;
				while(elem = oldResult[index++]) {
					if(args){
						result.push(elem);	
					}
				}
			},
			even: function(args, oldResult, result){
				return Dom.pseudos.odd(!args, oldResult, result);
			}
			
		},

		/**
		 * 显示元素的样式。
		 * @static
		 * @type Object
		 */
		displayFix: {
			position: "absolute",
			visibility: "visible",
			display: "block"
		},
		
		/**
		 * 不需要单位的 css 属性。
		 * @static
		 * @type Object
		 */
		styleNumbers: map('fillOpacity fontWeight lineHeight opacity orphans widows zIndex zoom', returnTrue, {}),

		/**
		 * 默认最大的 z-index 。
		 * @property zIndex
		 * @type Number
		 * @private
		 * @static
		 */
		
		/**
		 * 获取 window 对象的 Dom 对象封装示例。
	 	 * @static
		 */
		window: new Dom(window),
		
		/**
		 * 获取 document 对象的 Dom 对象封装示例。
	 	 * @static
		 */
		document: new Dom(document),

		/**
		 * 获取元素的计算样式。
		 * @param {Element} elem 元素。
		 * @param {String} name  要访问的属性名称。
		 * @return {String} 样式。
	 	 * @static
	 	 * 访问元素的样式属性。
		 * @example
		 * 取得第一个段落的color样式属性的值。
		 * #####JavaScript:
		 * <pre>Dom.getStyle(document.getElementById("id"), "color");</pre>
		 */
		getStyle: getStyle,

		/**
		 * 读取样式字符串。
		 * @param {Element} elem 元素。
		 * @param {String} name 属性名。必须使用骆驼规则的名字。
		 * @return {String} 字符串。
	 	 * @static
		 */
		styleString: styleString,

		/**
		 * 读取样式数字。
		 * @param {Element} elem 元素。
		 * @param {String} name 属性名。必须使用骆驼规则的名字。
		 * @return {String} 字符串。
		 * @static
		 */
		styleNumber: styleNumber,
		
		/**
		 * 获取一个标签的默认 display 属性。
		 * @param {Element} elem 元素。
		 */
		defaultDisplay: function(elem){
			var displays = Dom.displays || (Dom.displays = {}),
				tagName = elem.tagName,
				display = displays[tagName],
				iframe,
				iframeDoc;
				
			if(!display) {
				
				elem = document.createElement(tagName);
				document.body.appendChild(elem);
				display = getStyle(elem, 'display');
				document.body.removeChild(elem);

				// 如果简单的测试方式失败。使用 IFrame 测试。
				if ( display === "none" || display === "" ) {
					iframe = document.body.appendChild(Dom.emptyIframe || (Dom.emptyIframe = Object.extend(document.createElement("iframe"), {
						frameBorder: 0,
						width: 0,
						height: 0
					})));
					
					// Create a cacheable copy of the iframe document on first call.
					// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
					// document to it; WebKit & Firefox won't allow reusing the iframe document.
					iframeDoc =  ( iframe.contentWindow || iframe.contentDocument ).document;
					iframeDoc.write("<!doctype html><html><body>");
					iframeDoc.close();

					elem = iframeDoc.body.appendChild(iframeDoc.createElement(tagName));
					display = getStyle(elem, 'display');
					document.body.removeChild( iframe );
				}
				
				displays[tagName] = display;
			}
		
			return display;
		},

		/**
		 * 通过设置 display 属性来显示元素。
		 * @param {Element} elem 元素。
	 	 * @static
		 */
		show: function(elem) {
			assert.isElement(elem, "Dom.show(elem): {elem} ~");

			// 普通元素 设置为 空， 因为我们不知道这个元素本来的 display 是 inline 还是 block
			elem.style.display = '';

			// 如果元素的 display 仍然为 none , 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 block。
			if(getStyle(elem, 'display') === 'none')
				elem.style.display = elem.style.defaultDisplay || Dom.defaultDisplay(elem);
		},
		
		/**
		 * 通过设置 display 属性来隐藏元素。
		 * @param {Element} elem 元素。
	 	 * @static
		 */
		hide: function(elem) {
			assert.isElement(elem, "Dom.hide(elem): {elem} ~");
			var currentDisplay = styleString(elem, 'display');
			if(currentDisplay !== 'none') {
				elem.style.defaultDisplay = currentDisplay;
				elem.style.display = 'none';
			}
		},
		
		/**
		 * 根据不同的内容进行计算。
		 * @param {Element} elem 元素。
		 * @param {String} type 要计算的值。一个 type 是一个 js 表达式，它有一些内置的变量来表示元素的相关计算值。预定义的变量有：
		 *
		 *		- ml: marginLeft (同理有 r=right, t=top, b=bottom，x=left+right,y=top+bottom 下同)
		 *		- bl: borderLeftWidth
		 *		- pl: paddingLeft
		 *		- sx: bl + pl + height (同理有 y)
		 *		- css 样式: 如 height, left
		 *
		 * @return {Number} 计算值。
	 	 * @static
		 */
		calc: (function() {

			/**
			 * 样式表。
			 * @static
			 * @type Object
			 */
			var cache = {},

				init, 
				
				tpl;

			if(window.getComputedStyle) {
				init = 'var c=e.ownerDocument.defaultView.getComputedStyle(e,null);return ';
				tpl = '(parseFloat(c["#"])||0)';
			} else {
				init = 'return ';
				tpl = '(parseFloat(Dom.getStyle(e, "#"))||0)';
			}

			/**
			 * 翻译 type。
			 * @param {String} type 输入字符串。
			 * @return {String} 处理后的字符串。
			 */
			function format(type) {

				// 如果长度为 2，则处理为简写。
				if (type.length === 2) {
					var t = type.charAt(0),
						d = type.charAt(1),
						ns1 = {
							m: 'margin#',
							b: 'border#Width',
							p: 'padding#'
						},
						ns2 = {
							t: 'Top',
							r: 'Right',
							b: 'Bottom',
							l: 'Left'
						};
					if (t in ns1) {
						t = ns1[t];
						if (d == 'x') {
							type = '(' + t.replace('#', ns2.l) + '+' + t.replace('#', ns2.r) + ')';
						} else if (d == 'y') {
							type = '(' + t.replace('#', ns2.t) + '+' + t.replace('#', ns2.b) + ')';
						} else {
							type = t.replace('#', ns2[d]);
						}
					} else if (t == 's') {
						return d == 'x' ? 'e.offsetWidth' : 'e.offsetHeight';
					}
				} else if (type == 'width' || type == 'height') {
					return 'Dom.styleNumber(e,"' + type + '")';
				} else if (type.length < 2) {
					return type;
				}

				return tpl.replace('#', type);
			}

			return function(elem, type) {
				assert.isElement(elem, "Dom.calc(elem, type): {elem} ~");
				assert.isString(type, "Dom.calc(elem, type): {type} ~");
				return (cache[type] || (cache[type] = new Function("e", init + type.replace(/\w+/g, format))))(elem);
			}
		})(),

		/**
		 * 设置一个元素可拖动。
		 * @param {Element} elem 要设置的节点。
	 	 * @static
		 */
		movable: function(elem) {
			assert.isElement(elem, "Dom.movable(elem): 参数 elem ~");
			if(!/^(?:abs|fix)/.test(styleString(elem, "position")))
				elem.style.position = "relative";
		},
		
		/**
		 * 获取元素的文档。
		 * @param {Element} elem 元素。
		 * @return {Document} 文档。
	 	 * @static
		 */
		getDocument: getDocument,
	
		/**
		 * 将一个成员附加到 Dom 对象和相关类。
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType = 1 说明如何复制到 DomList 实例。
		 * @return this
		 * @static
		 * 对 Element 扩展，内部对 Element DomList document 皆扩展。
		 *         这是由于不同的函数需用不同的方法扩展，必须指明扩展类型。 所谓的扩展，即一个类所需要的函数。 DOM 方法
		 *         有 以下种 1, 其它 setText - 执行结果返回 this， 返回 this 。(默认) 2
		 *         getText - 执行结果是数据，返回结果数组。 3 getElementById - 执行结果是DOM
		 *         或 ElementList，返回 DomList 包装。 4 hasClass -
		 *         只要有一个返回等于 true 的值， 就返回这个值。 参数 copyIf 仅内部使用。
		 */
		implement: function(members, listType, copyIf) {
		
			var classes = [DomList, Dom], i;
		
			for(var fnName in members){
				i = classes.length;
				while(i--) {
					if(!copyIf || !classes[i].prototype[fnName]) {
						classes[i].prototype[fnName] = i ? members[fnName] : createDomListMthod(fnName, listType);
					}
				}
			}
		
			return this;

		},
	
		/**
		 * 若不存在，则将一个对象附加到 Element 对象。
		 * @static
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType = 1 说明如何复制到 DomList 实例。
		 * @param {Number} docType 说明如何复制到 Document 实例。
		 * @return this
		 */
		implementIf: function(obj, listType) {
			return this.implement(obj, listType, true);
		},

		/**
		 * 表示事件的参数。
		 * @class Dom.Event
		 */
		Event: DomEvent

	})
	
	/**
	 * @class Dom
	 */
	.implement({

		/**
		 * 将当前 Dom 对象添加到其它节点或 Dom 对象中。
		 * @param {Node/String} parent=document.body 节点 Dom 对象或节点的 id 字符串。
		 * @return this
		 * @remark
		 * this.appendTo(parent) 相当于 parent.append(this) 。
		 * @example
		 * 把所有段落追加到ID值为foo的元素中。
		 * #####HTML:
		 * <pre lang="htm" format="none">
		 * &lt;p&gt;I would like to say: &lt;/p&gt;&lt;div id="foo"&gt;&lt;/div&gt;
		 * </pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").appendTo("foo");</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">
		 * &lt;div id="foo"&gt;&lt;p&gt;I would like to say: &lt;/p&gt;&lt;/div&gt;
		 * </pre>
		 *
		 * 创建一个新的div节点并添加到 document.body 中。
		 * <pre>
		 * Dom.create("div").appendTo();
		 * </pre>
		 */
		appendTo: function(parent) {

			// parent 肯能为 true
			parent ? (parent.append ? parent : Dom.get(parent)).append(this) : this.attach(document.body, null);

			return this;

		},

		/**
		 * 移除当前 Dom 对象或其子对象。
		 * @param {Dom} [child] 如果指定了子对象，则删除此对象。
		 * @return this
		 * @see #dispose
		 * @remark
		 * 这个方法不会彻底移除 Dom 对象，而只是暂时将其从 Dom 树分离。
		 * 如果需要彻底删除 Dom 对象，使用 {@link #dispose}方法。
		 * @example
		 * 从DOM中把所有段落删除。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").remove();</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">how are</pre>
		 *
		 * 从DOM中把带有hello类的段落删除
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p class="hello"&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").remove(".hello");</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">how are &lt;p&gt;you?&lt;/p&gt;</pre>
		 */
		remove: function(child) {
			assert(!arguments.length || child, 'Dom#remove(child): {child} 不是合法的节点', child);

			return arguments.length ?
				typeof child === 'string' ?
					this.query(child).remove() :
					this.removeChild(child) :
				(child = this.parentControl || this.parent()) ?
					child.removeChild(this) :
					this;
		},

		/**
	 	 * 删除一个节点的所有子节点。
		 * @return this
		 * @example
		 * 把所有段落的子元素（包括文本节点）删除。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello, &lt;span&gt;Person&lt;/span&gt; &lt;a href="#"&gt;and person&lt;/a&gt;&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").empty();</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">&lt;p&gt;&lt;/p&gt;</pre>
		 */
		empty: function() {
			var elem = this.node;
			//if (elem.nodeType == 1)
			//	each(elem.getElementsByTagName("*"), clean);
			while (elem = this.last(null))
				this.removeChild(elem);
			return this;
		},

		/**
		 * 彻底删除当前 DOM 对象。释放占用的所有资源。
		 * @see #remove
		 * @remark 这个方法会同时删除节点绑定的事件以及所有的数据。
		 * @example
		 * 从DOM中把所有段落删除。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt;dispose&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").dispose();</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">how are</pre>
		 *
		 * 从DOM中把带有hello类的段落删除。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p class="hello"&gt;Hello&lt;/p&gt; how are &lt;p&gt;you?&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").dispose(".hello");</pre>
		 */
		dispose: function() {
			var elem = this.node;
			if (elem.nodeType == 1) {
				each(elem.getElementsByTagName("*"), clean);
				clean(elem);
			}

			return this.remove();
		},

		/**
		 * 设置一个样式属性的值。
		 * @param {String} name CSS 属性名或 CSS 字符串。
		 * @param {String/Number} [value] CSS属性值， 数字如果不加单位，则会自动添加像素单位。
		 * @return this
		 * @example
		 * 将所有段落的字体颜色设为红色并且背景为蓝色。
		 * <pre>Dom.query("p").setStyle('color', "#ff0011");</pre>
		 */
		setStyle: function(name, value) {

			// 获取样式
			var me = this;

			assert.isString(name, "Dom#setStyle(name, value): {name} ~");
			assert.isElement(me.node, "Dom#setStyle(name, value): 当前 dom 不支持样式");

			// 设置通用的属性。
			if (arguments.length == 1) {
				me.node.style.cssText += ';' + name;

				// 特殊的属性值。
			} else if (name in styleFix) {

				// setHeight setWidth setOpacity
				return styleFix[name].call(me, value);

			} else {
				name = name.replace(rStyle, formatStyle);

				assert(value || !isNaN(value), "Dom#setStyle(name, value): {value} 不是正确的属性值。", value);

				// 如果值是函数，运行。
				if (typeof value === "number" && !(name in Dom.styleNumbers))
					value += "px";

			}

			// 指定值。
			me.node.style[name] = value;

			return me;

		},

		/**
		 * 向用户显示当前 Dom 对象。
		 * @param {String} [type] 显示时使用的特效方式。
		 * @param {Number} duration=300 效果执行时间。
		 * @param {Function} [callBack] 效果执行完的回调函数。
		 * @param {String} [link] 当效果正在执行时的处理方式。
		 *
		 * - "**wait**"(默认): 等待上个效果执行完成。
		 * - "**ignore**": 忽略新的效果。
		 * - "**stop**": 正常中止上一个效果，然后执行新的效果。
		 * - "**abort**": 强制中止上一个效果，然后执行新的效果。
		 * @return this
		 * @remark 此函数是通过设置 css的 display 属性实现的。
		 */
		show: function() {
			Dom.show(this.node);
			return this;
		},

		/**
		 * 向用户隐藏当前 Dom 对象。
		 * @param {String} [type] 显示时使用的特效方式。
		 * @param {Number} duration=300 效果执行时间。
		 * @param {Function} [callBack] 效果执行完的回调函数。
		 * @param {String} [link] 当效果正在执行时的处理方式。
		 *
		 * - "**wait**"(默认): 等待上个效果执行完成。
		 * - "**ignore**": 忽略新的效果。
		 * - "**stop**": 正常中止上一个效果，然后执行新的效果。
		 * - "**abort**": 强制中止上一个效果，然后执行新的效果。
		 * @return this
		 * @remark 此函数是通过设置 css的 display = none 实现的。
		 */
		hide: function(duration, callback) {
			Dom.hide(this.node);
			return this;
		},

		/**
		 * 切换当前 Dom 对象的显示状态。
		 * @param {String} [type] 显示时使用的特效方式。
		 * @param {Number} duration=300 效果执行时间。
		 * @param {Function} [callBack] 效果执行完的回调函数。
		 * @param {String} [value] 强制设置 toggle 效果。
		 * @param {String} [link] 当效果正在执行时的处理方式。
		 *
		 * - "**wait**"(默认): 等待上个效果执行完成。
		 * - "**ignore**": 忽略新的效果。
		 * - "**stop**": 正常中止上一个效果，然后执行新的效果。
		 * - "**abort**": 强制中止上一个效果，然后执行新的效果。
		 * @return this
		 * @remark 此函数是通过设置 css的 display 属性实现的。
		 */
		toggle: function() {
			var args = arguments,
				flag = args[args.length - 1];
			return this[(typeof flag === 'boolean' ? flag : Dom.isHidden(this.node)) ? 'show' : 'hide'].apply(this, args);
		},

		/**
		 * 设置当前 Dom 对象不可选。
		 * @param {Boolean} value=true 如果为 true，表示不可选，否则表示可选。
		 * @return this
		 */
		unselectable: 'unselectable' in div ? function(value) {
			assert.isElement(this.node, "Dom#unselectable(value): 当前 dom 不支持此操作");
			this.node.unselectable = value !== false ? 'on' : '';
			return this;
		} : 'onselectstart' in div ? function(value) {
			assert.isElement(this.node, "Dom#unselectable(value): 当前 dom 不支持此操作");
			this.node.onselectstart = value !== false ? function () { return false; } : null;
			return this;
		} : function(value) {
			assert.isElement(this.node, "Dom#unselectable(value): 当前 dom 不支持此操作");
			this.node.style.MozUserSelect = value !== false ? 'none' : '';
			return this;
		},

		/**
		 * 设置或删除一个 HTML 属性值。
		 * @param {String} name 要设置的属性名称。
		 * @param {String} value 要设置的属性值。当设置为 null 时，删除此属性。
		 * @return this
		 * @example
		 * 为所有图像设置src属性。
		 * #####HTML:
		 * <pre lang="htm" format="none">
		 * &lt;img/&gt;
		 * &lt;img/&gt;
		 * </pre>
		 * #####JavaScript:
		 * <pre>Dom.query("img").setAttr("src","test.jpg");</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">[ &lt;img src= "test.jpg" /&gt; , &lt;img src= "test.jpg" /&gt; ]</pre>
		 *
		 * 将文档中图像的src属性删除
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;img src="test.jpg"/&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("img").setAttr("src");</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">[ &lt;img /&gt; ]</pre>
		 */
		setAttr: function(name, value) {

			//assert(name !== 'type' || elem.tagName !== "INPUT" || !elem.parentNode, "Dom#setAttr(name, type): 无法修改INPUT元素的 type 属性。");

			var elem = this.node;
			
			name = propFix[name] || name;
			
			var hook = attrFix[name];
			
			if(!hook) {
				hook = defaultHook;
				name = name.toLowerCase();
			}
			
			hook.set(elem, name, value);

			return this;

		},

		/**
		 * 快速设置当前 Dom 对象的样式、属性或事件。
		 * @param {String/Object} name 属性名。可以是一个 css 属性名或 html 属性名。如果属性名是on开头的，则被认为是绑定事件。 - 或 - 属性值，表示 属性名/属性值 的 JSON 对象。
		 * @param {Object} [value] 属性值。
		 * @return this
		 * @remark
		 * 此函数相当于调用 setStyle 或 setAttr 。数字将自动转化为像素值。
		 * @example
		 * 将所有段落字体设为红色、设置 class 属性、绑定 click 事件。
		 * <pre>
		 * Dom.query("p").set("color","red").set("class","cls-red").set("onclick", function(){alert('clicked')});
		 * </pre>
		 *
		 * - 或 -
		 *
		 * <pre>
		 * Dom.query("p").set({
		 * 		"color":"red",
		 * 		"class":"cls-red",
		 * 		"onclick": function(){alert('clicked')}
		 * });
		 * </pre>
		 */
		set: function(options, value) {
			var me = this,
				key,
				setter;

			// .set(key, value)
			if (typeof options === 'string') {
				key = options;
				options = {};
				options[key] = value;
			}

			for (key in options) {
				value = options[key];
				
				// .setStyle(css, value)
				if (me.node.style && (key in me.node.style || rStyle.test(key)))
					me.setStyle(key, value);

				// .setKey(value)
				else if (typeof me[setter = 'set' + key.capitalize()] === 'function')
					me[setter](value);

				// 如果是当前对象的成员。
				else if (key in me) {

					setter = me[key];

					// .key(value)
					if (typeof setter === 'function')
						me[key](value);

					// .key.set(value)
					else if (setter && setter.set)
						setter.set(value);

					// .key = value
					else
						me[key] = value;
					
				// .on(event, value)
				} else if (/^on(\w+)/.test(key))
				    value && me.on(RegExp.$1, value);

				// .setAttr(attr, value);
				else
					me.setAttr(key, value);

			}

			return me;

		},

		/**
		 * 为当前 Dom 对象添加指定的 Css 类名。
		 * @param {String} className 一个或多个要添加到元素中的CSS类名，用空格分开。
		 * @return this
		 * @example
		 * 为匹配的元素加上 'selected' 类。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").addClass("selected");</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello&lt;/p&gt; ]</pre>
		 *
		 * 为匹配的元素加上 selected highlight 类。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").addClass("selected highlight");</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">[ &lt;p class="selected highlight"&gt;Hello&lt;/p&gt; ]</pre>
		 */
		addClass: function(className) {
			assert.isString(className, "Dom#addClass(className): {className} ~");

			var elem = this.node, classList = className.split(/\s+/), newClass, i;

			// 加速为不存在 class 的元素设置 class 。
			if (!elem.className && classList.length <= 1) {
				elem.className = className;

			} else {
				newClass = " " + elem.className + " ";

				for (i = 0; i < classList.length; i++) {
					if (newClass.indexOf(" " + classList[i] + " ") < 0) {
						newClass += classList[i] + " ";
					}
				}
				elem.className = newClass.trim();
			}

			return this;

		},

		/**
		 * 从当前 Dom 对象中删除全部或者指定的类。
		 * @param {String} [className] 一个或多个要删除的CSS类名，用空格分开。如果不提供此参数，将清空 className 。
		 * @return this
		 * @example
		 * 从匹配的元素中删除 'selected' 类
		 * #####HTML:
		 * <pre lang="htm" format="none">
		 * &lt;p class="selected first"&gt;Hello&lt;/p&gt;
		 * </pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").removeClass("selected");</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">
		 * [ &lt;p class="first"&gt;Hello&lt;/p&gt; ]
		 * </pre>
		 */
		removeClass: function(className) {
			assert(!className || className.split, "Dom#removeClass(className): {className} ~");

			var elem = this.node, classList, newClass = "", i;

			if (className) {
				classList = className.split(/\s+/);
				newClass = " " + elem.className + " ";
				for (i = classList.length; i--;) {
					newClass = newClass.replace(" " + classList[i] + " ", " ");
				}
				newClass = newClass.trim();

			}

			elem.className = newClass;

			return this;

		},

		/**
		 * 如果存在（不存在）就删除（添加）一个类。
		 * @param {String} className CSS类名。
		 * @param {Boolean} [toggle] 自定义切换的方式。如果为 true， 则加上类名，否则删除。
		 * @return this
		 * @see #addClass
		 * @see #removeClass
		 * @example
		 * 为匹配的元素切换 'selected' 类
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").toggleClass("selected");</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello&lt;/p&gt;, &lt;p&gt;Hello Again&lt;/p&gt; ]</pre>
		 */
		toggleClass: function(className, state) {
			return this[(state == undefined ? this.hasClass(className) : !state) ? 'removeClass' : 'addClass'](className);
		},

		/**
		 * 设置当前 Dom 对象的文本内容。对于输入框则设置其输入的值。
		 * @param {String} 用于设置元素内容的文本。
		 * @return this
		 * @see #setHtml
		 * @remark 与 {@link #setHtml} 类似, 但将编码 HTML (将 "&lt;" 和 "&gt;" 替换成相应的HTML实体)。
		 * @example
		 * 设定文本框的值。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;input type="text"/&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("input").setText("hello world!");</pre>
		 */
		setText: function(value) {
			this.node[textFix[this.node.nodeName] || propFix.innerText] = value;
			return this;
		},

		/**
		 * 设置当前 Dom 对象的 Html 内容。
		 * @param {String} value 用于设定HTML内容的值。
		 * @return this
		 * @example
		 * 设置一个节点的内部 html
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;p/&gt;&lt;/div&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.get("a").setHtml("&lt;a/&gt;");</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;a/&gt;&lt;/div&gt;</pre>
		 */
		setHtml: function(value) {

			// 如果存在 <script> 或 <style> ，则不能使用 innerHTML 实现。
			if (/<(?:script|style)/i.test(value)) {
				this.empty().append(value);
				return this;
			}

			var elem = this.node,
				map = parseFix.$default;

			assert(elem.nodeType === 1, "Dom#setHtml(value): {elem} 不是元素节点(nodeType === 1), 无法执行 setHtml。", elem);

			try {

				// 对每个子元素清空内存。
				// each(elem.getElementsByTagName("*"), clean);

				// 内部执行 innerHTML 。
				elem.innerHTML = (map[1] + value + map[2]).replace(rXhtmlTag, "<$1></$2>");

				// 如果 innerHTML 出现错误，则直接使用节点方式操作。
			} catch (e) {
				this.empty().append(value);
				return this;
			}

			// IE6 需要包装节点，此处解除包装的节点。
			if (map[0] > 1) {
				value = elem.lastChild;
				elem.removeChild(elem.firstChild);
				elem.removeChild(value);
				while (value.firstChild)
					elem.appendChild(value.firstChild);
			}

			return this;
		},

		/**
		 * 设置当前 Dom 对象的显示大小。
		 * @param {Number/Point} x 要设置的宽或一个包含 x、y 属性的对象。如果不设置，使用 null 。
		 * @param {Number} y 要设置的高。如果不设置，使用 null 。
		 * @return this
		 * @remark
		 * 设置元素实际占用大小（包括内边距和边框，但不包括滚动区域之外的大小）。
		 *
		 * 此方法对可见和隐藏元素均有效。
		 * @example
		 * 设置 id=myP 的段落的大小。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p id="myP"&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.get("myP").setSize({x:200,y:100});</pre>
		 */
		setSize: function(x, y) {
			var me = this,
				p = formatPoint(x, y);

			if (p.x != null) me.setWidth(p.x - Dom.calc(me.node, 'bx+px'));

			if (p.y != null) me.setHeight(p.y - Dom.calc(me.node, 'by+py'));

			return me;
		},

		/**
		 * 获取当前 Dom 对象设置CSS宽度(width)属性的值（不带滚动条）。
		 * @param {Number} value 设置的宽度值。
		 * @return this
		 * @example
		 * 将所有段落的宽设为 20。
		 * <pre>Dom.query("p").setWidth(20);</pre>
		 */
		setWidth: styleFix.width,

		/**
		 * 获取当前 Dom 对象设置CSS高度(hidth)属性的值（不带滚动条）。
		 * @param {Number} value 设置的高度值。
		 * @return this
		 * @example
		 * 将所有段落的高设为 20。
		 * <pre>Dom.query("p").setHeight(20);</pre>
		 */
		setHeight: styleFix.height,

		/**
		 * 设置当前 Dom 对象相对父元素的偏移。
		 * @param {Point} offsetPoint 要设置的 x, y 对象。
		 * @return this
		 * @remark
		 * 此函数仅改变 CSS 中 left 和 top 的值。
		 * 如果当前对象的 position 是static，则此函数无效。
		 * 可以通过 {@link #setPosition} 强制修改 position, 或先调用 {@link Dom.movable} 来更改 position 。
		 *
		 * @example
		 * 设置第一段的偏移。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>
		 * Dom.query("p:first").setOffset({ x: 10, y: 30 });
		 * </pre>
		 * #####结果:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 15, top: 15&lt;/p&gt;</pre>
		 */
		setOffset: function(offsetPoint) {

		    assert(offsetPoint, "Dom#setOffset(offsetPoint): {offsetPoint} 必须有 'x' 和 'y' 属性。", offsetPoint);
			var style = this.node.style;

			if (offsetPoint.y != null)
				style.top = offsetPoint.y + 'px';

			if (offsetPoint.x != null)
				style.left = offsetPoint.x + 'px';
			return this;
		},

		/**
		 * 设置当前 Dom 对象的绝对位置。
		 * @param {Number/Point} x 要设置的水平坐标或一个包含 x、y 属性的对象。如果不设置，使用 null 。
		 * @param {Number} y 要设置的垂直坐标。如果不设置，使用 null 。
		 * @return this
		 * @remark
		 * 如果对象原先的position样式属性是static的话，会被改成relative来实现重定位。
		 * @example
		 * 设置第二段的位置。
		 * #####HTML:
		 * <pre lang="htm" format="none">
		 * &lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;
		 * </pre>
		 * #####JavaScript:
		 * <pre>
		 * Dom.query("p:last").setPosition({ x: 10, y: 30 });
		 * </pre>
		 */
		setPosition: function(x, y) {

			Dom.movable(this.node);
			
			var me = this,
				currentPosition = me.getPosition(),
				offset = me.getOffset(),
				newPosition = formatPoint(x, y);

			if (newPosition.y != null) offset.y += newPosition.y - currentPosition.y;
			else offset.y = null;

			if (newPosition.x != null) offset.x += newPosition.x - currentPosition.x;
			else offset.x = null;

			return me.setOffset(offset);
		},

		/**
		 * 设置当前 Dom 对象的滚动条位置。
		 * @param {Number/Point} x 要设置的水平坐标或一个包含 x、y 属性的对象。如果不设置，使用 null 。
		 * @param {Number} y 要设置的垂直坐标。如果不设置，使用 null 。
		 * @return this
		 */
		setScroll: function(x, y) {
			var elem = this.node,
				offsetPoint = formatPoint(x, y);
				
			if(elem.nodeType !== 9){
				if (offsetPoint.x != null) elem.scrollLeft = offsetPoint.x;
				if (offsetPoint.y != null) elem.scrollTop = offsetPoint.y;
			} else {
				if(offsetPoint.x == null)
					offsetPoint.x = this.getScroll().x;
				if(offsetPoint.y == null)
					offsetPoint.y = this.getScroll().y;
				(elem.defaultView || elem.parentWindow).scrollTo(offsetPoint.x, offsetPoint.y);
			}
			
			return this;
			
		},
		
		/**
		 * 批量为当前 DOM 节点绑定事件。 
		 * @since 3.2
		 */
		bind: function(eventAndSelector, handler){
			
			var eventName, selector;
			
			if (typeof eventAndSelector === 'string') {

			    eventName = (/^\w+/.exec(eventAndSelector) || [''])[0];

			    assert(eventName, "Dom#bind(eventAndSelector, handler): {eventAndSelector} 中不存在事件信息。正确的 eventAndSelector 格式： click.selector");

			    if (selector = eventAndSelector.substr(eventName.length)) {
			        this.delegate(selector, eventName, handler);
			    } else {
			        this.on(eventName, handler);
			    }
			} else {

			    for (eventName in eventAndSelector) {
			        this.bind(eventName, eventAndSelector[eventName]);
			    }

			}
			
			return this;
		},
		
		/**
		 * 模拟提交表单。
		 */
		submit: function(){
			
			// 当手动调用 submit 的时候，不会触发 submit 事件，因此手动模拟  #8
			
			var e = new Dom.Event(this.node, 'submit');
			this.trigger('submit', e);
			if(e.returnValue !== false){
				this.node.submit();
			}
			return this;
		},

		/**
		 * 通过当前 Dom 对象代理执行子节点的事件。
		 * @param {String} selector 筛选子节点的选择器。
		 * @param {String} type 绑定的事件名。
		 * @param {Function} fn 绑定的事件监听器。
		 * @remark
		 * 这个函数会监听子节点的事件冒泡，并使用 CSS 选择器筛选子节点。
		 *
		 * 这个方法是对 (@link #on} 的补充，比如有如下 HTML 代码:
		 * <pre lang="htm">
		 * &amp;lt;body&amp;gt;
		 * &amp;lt;div class=&quot;clickme&quot;&amp;gt;Click here&amp;lt;/div&amp;gt;
		 * &amp;lt;/body&amp;gt;
		 * </pre>
		 *
		 * 可以给这个元素绑定一个简单的click事件：
		 * <pre>
		 * Dom.query('.clickme').bind('click', function() {
		 * 	alert("Bound handler called.");
		 * });
		 * </pre>
		 *
		 * 使用 {@link #on} 时，函数会绑定一个事件处理函数，而以后再添加的对象则不会有。
		 * 而如果让父元素代理执行事件，则可以监听到动态增加的元素。比如:
		 *
		 * <pre>
		 * document.delegate('.clickme', 'click', function() {
		 * 	alert("Bound handler called.");
		 * });
		 * </pre>
		 *
		 * 这时，无论是原先存在的，还是后来动态创建的节点，只要匹配了　.clickme ，就可以成功触发事件。
		 */
		delegate: function(selector, eventName, handler) {

			assert.isString(selector, "Dom#delegate(selector, eventName, handler): {selector}  ~");
			assert.isString(eventName, "Dom#delegate(selector, eventName, handler): {eventName}  ~");
			assert.isFunction(handler, "Dom#delegate(selector, eventName, handler): {handler}  ~");

			var delegateEventName = 'delegate:' + eventName,
				delegateEvent,
				eventInfo = Dom.$event[eventName],
				initEvent,
				data = this.dataField();

			if (eventInfo && eventInfo.delegate) {
				eventName = eventInfo.delegate;
				initEvent = eventInfo.initEvent;
			}
			
			data = data.$event || (data.$event = {});
			delegateEvent = data[delegateEventName];
			
			if(!delegateEvent){
				data[delegateEventName] = delegateEvent = function(e) {
					
					// 获取原始的目标对象。
					var target = e.getTarget(),
					
						// 所有委托的函数信息。
						delegateHandlers = arguments.callee.handlers,
						
						actucalHandlers = [],
						
						i,
						
						handlerInfo,
						
						delegateTarget;
					
					for(i = 0; i < delegateHandlers.length; i++){
					
						handlerInfo = delegateHandlers[i];
						
						if((delegateTarget = target.closest(handlerInfo[1])) && (!initEvent || initEvent.call(delegateTarget, e) !== false)){
							actucalHandlers.push([handlerInfo[0], delegateTarget]);
						}
					}
					
					for(i = 0; i < actucalHandlers.length; i++) {
					
						handlerInfo = actucalHandlers[i];
						
						if(handlerInfo[0].call(handlerInfo[1], e) === false) {
							e.stopPropagation();
							e.preventDefault();
							break;
						}
					}
				
				};
				
				this.on(eventName, delegateEvent);
				
				delegateEvent.handlers = [];
			}
			
			delegateEvent.handlers.push([handler, selector]);
			
			return this;

		}

	})

	.implement({
		
		/**
		 * 获取当前 Dom 对象指定属性的样式。
		 * @param {String} name 需要读取的样式名。允许使用 css 原名字或其骆驼规则。
		 * @return {String} 返回样式对应的值。如果此样式未设置过，返回其默认值。 
		 * @example
		 * 取得 id=myP 的段落的color样式属性的值。
		 * <pre>Dom.get("myP").getStyle("color");</pre>
		 */
		getStyle: function(name) {
		
			var elem = this.node;
		
			assert.isString(name, "Dom#getStyle(name): {name} ~");
			assert(elem.style, "Dom#getStyle(name): 当 Dom 对象对应的节点不是元素，无法使用样式。");
		
			return elem.style[name = name.replace(rStyle, formatStyle)] || getStyle(elem, name);
		
		},
		
		/**
		 * 获取当前 Dom 对象的 HTML 属性值。
		 * @param {String} name 要获取的属性名称。
		 * @return {String} 返回属性值。如果元素没有相应属性，则返回 null 。
	 	 * @example
	 	 * 返回文档中 id="img" 的图像的src属性值。
	 	 * #####HTML:
	 	 * <pre lang="htm" format="none">&lt;img id="img" src="test.jpg"/&gt;</pre>
	 	 * #####JavaScript:
	 	 * <pre>Dom.get("img").getAttr("src");</pre>
	 	 * #####结果:
	 	 * <pre lang="htm" format="none">test.jpg</pre>
		 */
		getAttr: function(name, type) {
			return Dom.getAttr(this.node, name, type);
		},
	
		/**
		 * 取得当前 Dom 对象内容。对于输入框则获取其输入的值。
		 * @return {String} 文本内容。对普通节点返回 textContent 属性, 对输入框返回 value 属性， 对普通节点返回 nodeValue 属性。
		 * @remark 
		 * 结果是由所有匹配元素包含的文本内容组合起来的文本。这个方法对HTML和XML文档都有效。
		 * @example
		 * 获取文本框中的值。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;input type="text" value="some text"/&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("input").getText();</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">["some text"]</pre>
		 */
		getText: function() {
			return Dom.getText(this.node);
		},
	
		/**
		 * 取得当前 Dom 对象的html内容。
		 * @return {String} HTML 字符串。
		 * @example
		 * 获取 id="a" 的节点的内部 html。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;div id="a"&gt;&lt;p/&gt;&lt;/div&gt;</pre>
		 * #####JavaScript:
		 * <pre>$Dom.query("a").getHtml();</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">"&lt;p/&gt;"</pre>
		 */
		getHtml: function() {
			assert(this.node.nodeType === 1, "Dom#getHtml(): 仅当 dom.nodeType === 1 时才能使用此函数。"); 
			return this.node.innerHTML;
		},
	
		/**
		 * 获取当前 Dom 对象的可视区域大小。包括 border 大小。
		 * @return {Point} 位置。
		 * @remark
		 * 此方法对可见和隐藏元素均有效。
		 * 
		 * 获取元素实际占用大小（包括内边距和边框）。
		 * @example
		 * 获取第一段落实际大小。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p:first").getSize();</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">{x=200,y=100}</pre>
		 */
		getSize: function() {
			var elem = this.node,
				x,
				y;
				
			if(elem.nodeType !== 9){
				x = elem.offsetWidth;
				y = elem.offsetHeight;
			} else {
				elem = elem.documentElement;
				x = elem.clientWidth;
				y = elem.clientHeight;
			}
		
			return new Point(x, y);
		},
	
		/**
		 * 获取当前 Dom 对象的CSS width值。（不带滚动条）。
		 * @return {Number} 获取的值。
		 * 取得元素当前计算的宽度值（px）。
		 * @example
		 * 获取第一段的宽。
		 * <pre>Dom.query("p").item(0).getWidth();</pre>
		 * 
		 * 获取当前HTML文档宽度。
		 * <pre>document.getWidth();</pre>
		 */
		getWidth: function() {
			return styleNumber(this.node, 'width');
		},
	
		/**
		 * 获取当前 Dom 对象的CSS height值。（不带滚动条）。
		 * @return {Number} 获取的值。
		 * 取得元素当前计算的高度值（px）。
		 * @example
		 * 获取第一段的高。
		 * <pre>Dom.query("p").item(0).getHeight();</pre>
		 * 
		 * 获取当前HTML文档高度。
		 * <pre>document.getHeight();</pre>
		 */
		getHeight: function() {
			return styleNumber(this.node, 'height');
		},
	
		/**
		 * 获取当前 Dom 对象的滚动区域大小。
		 * @return {Point} 返回的对象包含两个整型属性：x 和 y。
		 * @remark
		 * getScrollSize 获取的值总是大于或的关于 getSize 的值。
		 * 
		 * 此方法对可见和隐藏元素均有效。
		 */
		getScrollSize: function() {
			var elem = this.node,
				x,
				y;
				
			if(elem.nodeType !== 9) {
				x = elem.scrollWidth;
				y = elem.scrollHeight;
			} else {
				var body = elem.body;
				elem = elem.documentElement;
				x = Math.max(elem.scrollWidth, body.scrollWidth, elem.clientWidth);
				y = Math.max(elem.scrollHeight, body.scrollHeight, elem.clientHeight);
			}
		
			return new Point(x, y);
		},
		
		/**
		 * 获取当前 Dom 对象的相对位置。
		 * @return {Point} 返回的对象包含两个整型属性：x 和 y。
		 * @remark
		 * 此方法只对可见元素有效。
		 * 
		 * 获取匹配元素相对父元素的偏移。
		 * @example
		 * 获取第一段的偏移
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
		 * #####JavaScript:<pre>
		 * var p = Dom.query("p").item(0);
		 * var offset = p.getOffset();
		 * trace( "left: " + offset.x + ", top: " + offset.y );
		 * </pre>
		 * #####结果:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 15, top: 15&lt;/p&gt;</pre>
		 */
		getOffset: function() {
			// 如果设置过 left top ，这是非常轻松的事。
			var elem = this.node, 
				left = styleString(elem, 'left'), 
				top = styleString(elem, 'top');
		
			// 如果未设置过。
			if((!left || !top || left === 'auto' || top === 'auto') && styleString(elem, "position") === 'absolute') {
		
				// 绝对定位需要返回绝对位置。
				top = this.offsetParent();
				left = this.getPosition();
				if(!rBody.test(top.node.nodeName))
					left = left.sub(top.getPosition());
				left.x -= styleNumber(elem, 'marginLeft') + styleNumber(top.node, 'borderLeftWidth');
				left.y -= styleNumber(elem, 'marginTop') + styleNumber(top.node, 'borderTopWidth');
	
				return left;
			}
		
			// 碰到 auto ， 空 变为 0 。
			return new Point(parseFloat(left) || 0, parseFloat(top) || 0);
		},
	
		/**
		 * 获取当前 Dom 对象的绝对位置。
		 * @return {Point} 返回的对象包含两个整型属性：x 和 y。
		 * @remark
		 * 此方法只对可见元素有效。
		 * @example
		 * 获取第二段的偏移
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>
		 * var p = Dom.query("p").item(1);
		 * var position = p.getPosition();
		 * trace( "left: " + position.x + ", top: " + position.y );
		 * </pre>
		 * #####结果:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;left: 0, top: 35&lt;/p&gt;</pre>
		 */
		getPosition: function() {
			
			// 对于 document，返回 scroll 。
			if(this.node.nodeType === 9){
				return this.getScroll();
			}
		
			var elem = this.node, 
				bound = typeof elem.getBoundingClientRect !== "undefined" ? elem.getBoundingClientRect() : {x:0, y:0},
				doc = getDocument(elem),
				html = doc.documentElement,
				htmlScroll = doc.getScroll();
			return new Point(bound.left + htmlScroll.x - html.clientLeft, bound.top + htmlScroll.y - html.clientTop);
		},
	
		/**
		 * 获取当前 Dom 对象的滚动条的位置。
		 * @return {Point} 返回的对象包含两个整型属性：x 和 y。
		 * @remark
		 * 此方法对可见和隐藏元素均有效。
		 *
		 * @example
		 * 获取第一段相对滚动条顶部的偏移。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;2nd Paragraph&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>
		 * var p = Dom.query("p").item(0);
		 * trace( "scrollTop:" + p.getScroll() );
		 * </pre>
		 * #####结果:
		 * <pre lang="htm" format="none">
		 * &lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;scrollTop: 0&lt;/p&gt;
		 * </pre>
		 */
		getScroll: function() {
			var elem = this.node,
				win,
				x,
				y;
			if(elem.nodeType !== 9){
				x = elem.scrollLeft;
				y = elem.scrollTop;
			} else if('pageXOffset' in (win = elem.defaultView || elem.parentWindow)) {
				x = win.pageXOffset;
				y = win.pageYOffset;
			} else {
				elem = elem.documentElement;
				x = elem.scrollLeft;
				y = elem.scrollTop;
			}
			
			return new Point(x, y);
		},

		/**
		 * 获取当前 Dom 对象的在原节点的位置。
		 * @param {Boolean} args=true 如果 args 为 true ，则计算文本节点。
		 * @return {Number} 位置。从 0 开始。
		 */
		index: function(args) {
			var i = 0, elem = this.node;
			while (elem = elem.previousSibling)
				if (elem.nodeType === 1 || args === true)
					i++;
			return i;
		},

		/**
		 * 获取当前 Dom 对象的指定位置的直接子节点。
		 * @param {Integer} index 用于查找子元素的 CSS 选择器 或者 元素在 Dom 对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。如果 args 是小于 0 的数字，则从末尾开始计算。
		 * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
		 * @example
		 * 获取第1个子节点。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.find("span").child(1)</pre>
		 */
		child: function(index) {
			
			//assert(typeof index === 'function' || typeof index === 'number' || typeof index === 'string' , 'Dom#child(index): {index} 必须是函数、数字或字符串。');
			
			var first = 'firstChild',
				next = 'nextSibling',
				isNumber = typeof index === 'number';
			
			if(index < 0){
				index = ~index;
				first = 'lastChild';
				next = 'previousSibling';
			}
			
			first = this.node[first];
			
			while(first){
				if(first.nodeType === 1 && (isNumber ? index-- <= 0 : quickMatch(first, index))){
					return new Dom(first);
				}
				
				first = first[next];
			}
			
			return null;
		},

		/**
		 * 获取当前 Dom 对象的父节点对象。
		 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在 Dom 对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
		 * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
		 * @example
		 * 找到每个span元素的所有祖先元素。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.find("span").parent()</pre>
		 */
		parent: createTreeWalker('parentNode'),

		/**
		 * 编辑当前 Dom 对象及父节点对象，找到第一个满足指定 CSS 选择器或函数的节点。
		 * @param {String/Function} [filter] 用于判断的元素的 CSS 选择器 或者 用于筛选元素的过滤函数。
		 * @param {Dom/String} [context=document] 只在指定的节点内搜索此元素。
		 * @return {Dom} 如果当前节点满足要求，则返回当前节点，否则返回一个匹配的父节点对象。如果不存在，则返回 null 。
		 * @remark
		 * closest 和 parent 最大区别就是 closest 会测试当前的元素。
		 */
		closest: function(selector, context) {
			var node = this.node;
				
			while(node) {
				if(quickMatch(node, selector)){
					return (!context || Dom.get(context).has(node)) ? new Dom(node) : null;
				}
				
				node = node.parentNode;
			}
			
			return null;
		},

		/**
		 * 获取当前 Dom 对象的第一个子节点对象。
		 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
		 * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
		 * @example
		 * 获取匹配的第二个元素
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt; This is just a test.&lt;/p&gt; &lt;p&gt; So is this&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").first(1)</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">[ &lt;p&gt; So is this&lt;/p&gt; ]</pre>
		 */
		first: createTreeWalker('nextSibling', 'firstChild'),

		/**
		 * 获取当前 Dom 对象的最后一个子节点对象。
		 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
		 * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
		 * @example
		 * 获取匹配的第二个元素
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt; This is just a test.&lt;/p&gt; &lt;p&gt; So is this&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").getChild(1)</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">[ &lt;p&gt; So is this&lt;/p&gt; ]</pre>
		 */
		last: createTreeWalker('previousSibling', 'lastChild'),

		/**
		 * 获取当前 Dom 对象的下一个相邻节点对象。
		 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
		 * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
		 * @example
		 * 找到每个段落的后面紧邻的同辈元素。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;Hello Again&lt;/p&gt;&lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").getNext()</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">[ &lt;p&gt;Hello Again&lt;/p&gt;, &lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt; ]</pre>
		 */
		next: createTreeWalker('nextSibling'),

		/**
		 * 获取当前 Dom 对象的上一个相邻的节点对象。
		 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
		 * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
		 * @example
		 * 找到每个段落紧邻的前一个同辈元素。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").getPrevious()</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">[ &lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt; ]</pre>
		 *
		 * 找到每个段落紧邻的前一个同辈元素中类名为selected的元素。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;div&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/div&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").getPrevious("div")</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]</pre>
		 */
		prev: createTreeWalker('previousSibling'),

		/**
		 * 获取当前 Dom 对象的全部直接子节点。
		 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
		 * @return {NodeList} 返回满足要求的节点的列表。
		 * @example
		 *
		 * 查找DIV中的每个子元素。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;p&gt;And Again&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("div").getChildren()</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">[ &lt;span&gt;Hello Again&lt;/span&gt; ]</pre>
		 *
		 * 在每个div中查找 div。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;div&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;&lt;p&gt;And Again&lt;/p&gt;&lt;/div&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("div").getChildren("div")</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]</pre>
		 */
		children: createTreeDir('nextSibling', 'firstChild'),

		/**
		 * 获取当前 Dom 对象以后的全部相邻节点对象。
		 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
		 * @return {DomList} 返回一个 DomList 对象。
		 */
		nextAll: createTreeDir('nextSibling'),

		/**
		 * 获取当前 Dom 对象以前的全部相邻节点对象。
		 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
		 * @return {DomList} 返回一个 DomList 对象。
		 */
		prevAll: createTreeDir('previousSibling'),

		/**
		 * 获取当前 Dom 对象以上的全部相邻节点对象。
		 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
		 * @return {DomList} 返回一个 DomList 对象。
		 */
		parentAll: createTreeDir('parentNode'),

		/**
		 * 获取当前 Dom 对象的全部兄弟节点对象。
		 * @param {Integer/String/Function/Boolean} [filter] 用于查找子元素的 CSS 选择器 或者 元素在Control对象中的索引 或者 用于筛选元素的过滤函数 或者 true 则同时接收包含文本节点的所有节点。
		 * @return {DomList} 返回一个 DomList 对象。
		 */
		siblings: function(args) {
			return this.prevAll(args).add(this.nextAll(args));
		},

		/**
		 * 获取用于让当前 Dom 对象定位的父对象。
		 * @return {Dom} 返回一个节点对象。如果不存在，则返回 null 。
		 */
		offsetParent: function() {
			var me = this.node;
			while ((me = me.offsetParent) && !rBody.test(me.nodeName) && styleString(me, "position") === "static");
			return new Dom(me || getDocument(this.node).body);
		}

	}, 2)

	.implement({

		/**
		 * 获取当前节点内的全部子节点。
		 * @param {String} args="*" 要查找的节点的标签名。 * 表示返回全部节点。
		 * @return {DomList} 返回一个 DomList 对象。
		 */
		getElements: function(args) {

			var getElementsByTagName = 'getElementsByTagName';
			var elem = this[getElementsByTagName] ? this : this.node;
			args = args || "*";

			if (elem[getElementsByTagName]) {
				return elem[getElementsByTagName](args);
			}

			getElementsByTagName = 'querySelectorAll';
			if (elem[getElementsByTagName]) {
				return elem[getElementsByTagName](args);
			}

			return [];
		},
		
		/**
		 * 搜索所有与指定表达式匹配的元素。
		 * @param {String} 用于查找的表达式。
		 * @return {NodeList} 返回满足要求的节点的列表。
		 * @example
		 * 从所有的段落开始，进一步搜索下面的span元素。与Dom.query("p span")相同。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;, how are you?&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").query("span")</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">[ &lt;span&gt;Hello&lt;/span&gt; ]</pre>
		 */
		query: function(selector){
			assert.isString(selector, "Dom#find(selector): selector ~。");
			assert(selector, "Dom#find(selector): {selector} 不能为空。", selector);
			var elem = this.node, result;
			
			if(elem.nodeType !== 1) {
				return document.query.call(this, selector)
			}
			
			try{ 
				var oldId = elem.id, displayId = oldId;
				if(!oldId){
					elem.id = displayId = '__SELECTOR__';
					oldId = 0;
				}
				result = elem.querySelectorAll('#' + displayId +' ' + selector);
			} catch(e) {
				result = query(selector, this);
			} finally {
				if(oldId === 0){
					elem.removeAttribute('id');
				}
			}
			
			
			
			return new DomList(result);
		},
	
		/**
		 * 创建并返回当前 Dom 对象的副本。
		 * @param {Boolean} deep=true 是否复制子元素。
		 * @param {Boolean} cloneDataAndEvent=false 是否复制数据和事件。
		 * @param {Boolean} keepId=false 是否复制 id 。
		 * @return {Dom} 新 Dom 对象。
		 *
		 * @example
		 * 克隆所有b元素（并选中这些克隆的副本），然后将它们前置到所有段落中。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;b&gt;Hello&lt;/b&gt;&lt;p&gt;, how are you?&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("b").clone().prependTo("p");</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">&lt;b&gt;Hello&lt;/b&gt;&lt;p&gt;&lt;b&gt;Hello&lt;/b&gt;, how are you?&lt;/p&gt;</pre>
		 */
		clone: function(deep, cloneDataAndEvent, keepId) {
		
			var elem = this.node,
				clone = elem.cloneNode(deep = deep !== false);
			
			if(elem.nodeType === 1){
				if (deep) {
					for (var elemChild = elem.getElementsByTagName('*'), cloneChild = clone.getElementsByTagName('*'), i = 0; cloneChild[i]; i++)
						cleanClone(elemChild[i], cloneChild[i], cloneDataAndEvent, keepId);
				}
			
				cleanClone(elem, clone, cloneDataAndEvent, keepId);
			}
		
			return new this.constructor(clone);
		}
	 
	}, 3)

	.implement({

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
		find: function(selector) {
			assert.isString(selector, "Dom#find(selector): selector ~");
			var elem = this.node, result;
			if (elem.nodeType !== 1) {
				return document.find.call(this, selector)
			}

			try {
				var oldId = elem.id, displayId = oldId;
				if (!oldId) {
					elem.id = displayId = '__SELECTOR__';
					oldId = 0;
				}
				result = elem.querySelector('#' + displayId + ' ' + selector);
			} catch (e) {
				result = query(selector, this)[0];
			} finally {
				if (oldId === 0) {
					elem.removeAttribute('id');
				}
			}

			return result ? new Dom(result) : null;
		},

		/**
		 * 检查当前 Dom 对象是否含有某个特定的类。
		 * @param {String} className 要判断的类名。只允许一个类名。
		 * @return {Boolean} 如果存在则返回 true。
		 * @example
		 * 隐藏包含有某个类的元素。
		 * #####HTML:
		 * <pre lang="htm" format="none">
		 * &lt;div class="protected"&gt;&lt;/div&gt;&lt;div&gt;&lt;/div&gt;
		 * </pre>
		 * #####JavaScript:
		 * <pre>Dom.query("div").on('click', function(){
		 * 	if ( this.hasClass("protected") )
		 * 		this.hide();
		 * });
		 * </pre>
		 */
		hasClass: function(className) {
			return Dom.hasClass(this.node, className);
		},
		
		/**
		 * 检查当前 Dom 对象是否符合指定的表达式。
		 * @param {String} String
		 * @return {Boolean} 如果匹配表达式就返回 true，否则返回  false 。
		 * @example
		 * 由于input元素的父元素是一个表单元素，所以返回true。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;form&gt;&lt;input type="checkbox" /&gt;&lt;/form&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("input[type='checkbox']").match("input")</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">true</pre>
		 */
		match: function (selector) {
			return Dom.match(this.node, selector);
		},
		
		/**
		 * 判断当前元素是否是隐藏的。
		 * @return {Boolean} 当前元素已经隐藏返回 true，否则返回  false 。
		 */
		isHidden: function(){
			return Dom.isHidden(this.node);
		},
		
		/**
		 * 判断一个节点是否有子节点。
		 * @param {Dom} dom 子节点。
		 * @param {Boolean} allowSelf=false 如果为 true，则当当前节点等于指定的节点时也返回 true 。
		 * @return {Boolean} 存在子节点则返回true 。
		 */
		has: function(dom, allowSelf){
			if(typeof dom === "string")
				return (allowSelf && this.match(dom)) || !!this.find(dom);
				
			dom = Dom.getNode(dom);
			
			return (allowSelf && this.node === dom) || Dom.has(this.node, dom);
		}
		
	}, 4);
	
	/// #endregion

	Object.each({

		/**
		 * 插入一个HTML 到末尾。
		 * @param {String/Node/Dom} html 要插入的内容。
		 * @return {Dom} 返回插入的新节点对象。
		 */
		append: function(ctrl, dom) {
			return ctrl.insertBefore(dom, null);
		},

		/**
		 * 插入一个HTML 到顶部。
		 * @param {String/Node/Dom} html 要插入的内容。
		 * @return {Dom} 返回插入的新节点对象。
		 */
		prepend: function(ctrl, dom) {
			return ctrl.insertBefore(dom, ctrl.first(null));
		},

		/**
		 * 插入一个HTML 到前面。
		 * @param {String/Node/Dom} html 要插入的内容。
		 * @return {Dom} 返回插入的新节点对象。
		 */
		before: function(ctrl, dom) {
			var p = ctrl.parentControl || ctrl.parent();
			return p ? p.insertBefore(dom, ctrl) : null;
		},

		/**
		 * 插入一个HTML 到后面。
		 * @param {String/Node/Dom} html 要插入的内容。
		 * @return {Dom} 返回插入的新节点对象。
		 */
		after: function(ctrl, dom) {
			var p = ctrl.parentControl || ctrl.parent();
			return p ? p.insertBefore(dom, ctrl.next(null)) : null;
		},

		/**
		 * 将一个节点用另一个节点替换。
		 * @param {String/Node/Dom} html 用于将匹配元素替换掉的内容。
		 * @return {Element} 替换之后的新元素。
		 * 将所有匹配的元素替换成指定的HTML或DOM元素。
		 * @example
		 * 把所有的段落标记替换成加粗的标记。
		 * #####HTML:
		 * <pre lang="htm" format="none">&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;cruel&lt;/p&gt;&lt;p&gt;World&lt;/p&gt;</pre>
		 * #####JavaScript:
		 * <pre>Dom.query("p").replaceWith("&lt;b&gt;Paragraph. &lt;/b&gt;");</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">&lt;b&gt;Paragraph. &lt;/b&gt;&lt;b&gt;Paragraph. &lt;/b&gt;&lt;b&gt;Paragraph. &lt;/b&gt;</pre>
		 *
		 * 用第一段替换第三段，可以发现他是移动到目标位置来替换，而不是复制一份来替换。
		 * #####HTML:<pre lang="htm" format="none">
		 * &lt;div class=&quot;container&quot;&gt;
		 * &lt;div class=&quot;inner first&quot;&gt;Hello&lt;/div&gt;
		 * &lt;div class=&quot;inner second&quot;&gt;And&lt;/div&gt;
		 * &lt;div class=&quot;inner third&quot;&gt;Goodbye&lt;/div&gt;
		 * &lt;/div&gt;
		 * </pre>
		 * #####JavaScript:
		 * <pre>Dom.find('.third').replaceWith(Dom.find('.first'));</pre>
		 * #####结果:
		 * <pre lang="htm" format="none">
		 * &lt;div class=&quot;container&quot;&gt;
		 * &lt;div class=&quot;inner second&quot;&gt;And&lt;/div&gt;
		 * &lt;div class=&quot;inner first&quot;&gt;Hello&lt;/div&gt;
		 * &lt;/div&gt;
		 * </pre>
		 */
		replaceWith: function(ctrl, dom) {
			var parent;
			if (parent = (ctrl.parentControl || ctrl.parent())) {
				dom = parent.insertBefore(dom, ctrl);
				parent.removeChild(ctrl);
			}
			return dom;
		}

	}, function(value, key) {
	    dp[key] = function (html) {

			var scripts,
				i,
				script,
				t;

	        if (html = Dom.parse(html, this)) {
	        	if(html instanceof DomList){
		        	t = Dom.getDocument(this.node).createDocumentFragment();
		            for (i = 0; i < html.length; i++) {
		                t.appendChild(html[i]);
		            }
		            
		            t = new Dom(t);
		            scripts = t.getElements('SCRIPT');
		            if (!navigator.isStd) {
		                scripts = new DomList(scripts);
		            }
		            value(this, t);
		        } else {
		        	t = html;
		        	if (t.node.tagName === 'SCRIPT') {
						scripts = [t.node];
					} else {
		        	    scripts = t.getElements('SCRIPT');
		        	    if (!navigator.isStd) {
		        	        scripts = new DomList(scripts);
		        	    }
					}
		        	html = value(this, t);
	            }
		        
		        i = 0;
	
				// 如果存在脚本，则一一执行。
				while (script = scripts[i++]) {
					if (!script.type || /\/(java|ecma)script/i.test(script.type)) {
	
						if (script.src) {
							assert(window.Ajax && Ajax.send, "必须载入 System.Ajax.Script 模块以支持动态执行 <script src=''>");
							Ajax.send({
								url: script.src,
								type: "GET",
								dataType: 'script',
								async: false
							});
							//    script.parentNode.removeChild(script);
						} else {
							window.execScript(script.text || script.textContent || script.innerHTML || "");
						}
	
					}
				}
				
			}

			return html;
		};

		DomList.prototype[key] = function(html) {
			var r;
			if (typeof html === 'string') {
				r = new DomList(this.invoke(key, [html]));
			} else {
				r = new DomList;
				html = Dom.get(html);
				this.forEach(function(value) {
					var cloned = html.clone();
					Dom.get(value)[key](cloned);
					r.push(cloned.node);
				});
			}
			return r;
		};

	});
	
	// Dom 函数。
	Dom.defineMethods('node', 'scrollIntoView focus blur select click reset', 1);
	
	/// #region document
	
	/**
	 * 获取当 Dom 对象实际对应的 HTML 节点实例。
	 * @type Node
	 * @protected
	 */
	document.node = document;
	
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
	document.find = function(selector){
		assert.isString(selector, "Dom#find(selector): selector ~");
		var result;
		try{
			result = this.querySelector(selector);
		} catch(e) {
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
	document.query = function(selector){
		assert.isString(selector, "Dom#find(selector): selector ~。");
		var result;
		try{
			result = this.querySelectorAll(selector);
		} catch(e) {
			result = query(selector, this);
		}
		return new DomList(result);
	};
	
	// 拷贝 DOM Event 到 document 。
	t = document.constructor;
	if(t){
		t.$event = Dom.$event;
		t.base = Dom.base;
	} else {
		document.constructor = Dom;
	}

	// document 函数。
	map('on un trigger once delegate dataField getElements getPosition getSize getScroll setScroll getScrollSize has', function (fnName) {
		document[fnName] = dp[fnName];
	});
	
	/// #endregion

	/// #region DomList
	
	// DomList 函数。
	map("slice splice reverse unique shift pop unshift push include indexOf each forEach", function (fnName, index) {
		DomList.prototype[fnName] = index < 4 ? function() {
			return new DomList(ap[fnName].apply(this, arguments));
		} : ap[fnName];
	});
	
	/// #endregion

	/// #region Event

	map("$default mousewheel blur focus focusin focusout scroll change select submit resize error load unload touchstart touchmove touchend hashchange", defaultEvent, Dom.$event);
	
	/// #if CompactMode

	if(isStd) {

	/// #endif

		domReady = 'DOMContentLoaded';
		Event.prototype.getTarget = ep.getTarget;
		
	/// #if CompactMode
	
	} else {

		domReady = 'readystatechange';
		
		defaultEvent.initEvent = function (e) {
			e.target = e.srcElement;
			e.getTarget = ep.getTarget;
			e.stopPropagation = ep.stopPropagation;
			e.preventDefault = ep.preventDefault;
		};
		
		mouseEvent = {
			initEvent: function (e) {
			    if (!e.getTarget) {
			        defaultEvent.initEvent(e);
			        e.relatedTarget = e.fromElement === e.srcElement ? e.toElement : e.fromElement;

			        var eventDoc = getDocument(e.target).documentElement;
			        e.pageX = e.clientX + (eventDoc.scrollLeft || 0) - (eventDoc.clientLeft || 0);
			        e.pageY = e.clientY + (eventDoc.scrollTop || 0) - (eventDoc.clientTop || 0);

					e.layerX = e.x;
					e.layerY = e.y;
					// 1 ： 单击 2 ： 中键点击 3 ： 右击
					e.which = e.button & 1 ? 1: e.button & 2 ? 3: e.button & 4 ? 2: 0;

				}
			}
		};
		
		keyEvent = {
			initEvent: function (e) {
				defaultEvent.initEvent(e);
				e.which = e.keyCode;
			}
		};

		Dom.cloneFix.SCRIPT = 'text';

		styleFix.opacity = function(value){
			var elem = this.node, style = elem.style;

			assert(!+value || (value <= 1 && value >= 0), 'Dom#setStyle("opacity", value): {value} 必须在 0~1 间。', value);
			assert.isElement(elem, "Dom#setStyle(name, value): 当前 dom 不支持样式");

			if (value)
				value *= 100;
			value = value || value === 0 ? 'opacity=' + value : '';

			// 获取真实的滤镜。
			elem = styleString(elem, 'filter');

			assert(!/alpha\([^)]*\)/i.test(elem) || rOpacity.test(elem), 'Dom#setOpacity(value): 当前元素的 {filter} CSS属性存在不属于 alpha 的 opacity， 将导致 setOpacity 不能正常工作。', elem);

			// 当元素未布局，IE会设置失败，强制使生效。
			style.zoom = 1;

			// 设置值。
			style.filter = rOpacity.test(elem) ? elem.replace(rOpacity, value) : (elem + ' alpha(' + value + ')');

			return this;

		};

		defaultHook.get = function(elem, name) {

			if (!elem.getAttributeNode) {
				return defaultHook.getProp(elem, name);
			}

			// 获取属性节点，避免 IE 返回属性。
			name = elem.getAttributeNode(name);

			// 如果不存在节点， name 为 null ，如果不存在节点值， 返回 null。
			return name ? name.value || (name.specified ? "" : null) : null;

		};

		defaultHook.set = formHook.set = function(elem, name, value) {

			if (elem.getAttributeNode) {

				// 获取原始的属性节点。
				var node = elem.getAttributeNode(name);

				// 如果 value === null 表示删除节点。
				if (value === null) {

					// 仅本来存在属性时删除节点。
					if (node) {
						node.nodeValue = '';
						elem.removeAttributeNode(node);
					}

					// 本来存在属性值，则设置属性值。
				} else if (node) {
					node.nodeValue = value;
				} else {
					elem.setAttribute(name, value);
				}

			} else {
				defaultHook.setProp(elem, name, value);
			}
		};

		// IE678 无法获取 style 属性，改用 style.cssText 获取。
		attrFix.style = {
			get: function(elem, name) {
				return elem.style.cssText.toLowerCase() || null;
			},
			set: function(elem, name, value) {
				elem.style.cssText = value || '';
			}
		};

		if (navigator.isQuirks) {
			
			// IE 6/7 获取 Button 的value会返回文本。
			attrFix.value = {
				
				_get: attrFix.value.get,
				
				get: function(elem, name, type) {
					return elem.tagName === 'BUTTON' ? defaultHook.get(elem, name) : this._get(elem, name, type);
				},
				
				set: function(elem, name, value) {
					if(elem.tagName === 'BUTTON') {
						defaultHook.set(elem, name, value);
					} else {
						elem.value = value || '';
					}
				}
			};

			// IE 6/7 会自动添加值到下列属性。
			attrFix.href = attrFix.src = attrFix.useMap = attrFix.width = attrFix.height = {

				get: function(elem, name) {
					return elem.getAttribute(name, 2);
				},

				set: function(elem, name, value) {
					elem.setAttribute(name, value);
				}
			};

			// IE 6/7 在设置 contenteditable 为空时报错。
			attrFix.contentEditable = {

				get: function(elem, name) {

					// 获取属性节点，避免 IE 返回属性。
					name = elem.getAttributeNode(name);

					// 如果不存在节点， name 为 null ，如果不存在节点值， 返回 null。
					return name && name.specified ? name.value : null;

				},

				set: function(elem, name, value) {
					if (value === null) {
						elem.removeAttributeNode(elem.getAttributeNode(name));
					} else {
						defaultHook.set(elem, name, value || "false");
					}
				}
			};
	
			try {
	
				// 修复IE6 因 css 改变背景图出现的闪烁。
				document.execCommand("BackgroundImageCache", false, true);
			} catch(e) {
	
			}

		}

	}
	
	Dom.addEvents("click dblclick mousedown mouseup mouseover mouseenter mousemove mouseleave mouseout contextmenu selectstart selectend", mouseEvent);
	
	Dom.addEvents("keydown keypress keyup", keyEvent);

	if(div.onfocusin === undefined) {

		Dom.addEvents('focusin focusout', {
			add: function (elem, type, fn) {
				var doc = elem.node.ownerDocument || elem.node;
				var data = doc.$data || (doc.$data = {});

				if (!data[type + 'Handler']) {
					data[type + 'Handler'] = function (e) {
						if (e.eventPhase <= 1) {
							var p = elem;
							while (p && p.parent) {
								if (!p.trigger(type, e)) {
									return;
								}

								p = p.parent();
							}

							doc.trigger(type, e);
						}
					};
					doc.addEventListener(type === 'focusin' ? 'focus' : 'blur', data[type + 'Handler'], true);
				}
			}
		});

	}

	if(div.onmousewheel === undefined) {
		Dom.addEvents('mousewheel', {
			base: 'DOMMouseScroll'
		});
	}
	
	// Firefox 会在右击时触发 document.onclick 。
	if(navigator.isFirefox) {
		Dom.addEvents('click', {
			initEvent: function(e){
				return e.which === undefined || e.which === 1;
			}
		});
	}
	
	Object.each({
		'mouseenter': 'mouseover',
		'mouseleave': 'mouseout'
	}, function(fix, event) {
		Dom.addEvents(event, {
			initEvent: function (e) {
				
				// 如果浏览器原生支持 mouseenter/mouseleave, 不作操作。
				if(e.type !== event) {
					
					var relatedTarget = e.relatedTarget;
		
					// 修正 getTarget 返回值。
					e.orignalType = event;
					return this.node !== relatedTarget && !Dom.has(this.node, relatedTarget);
					
				}
			},
			base: div.onmouseenter === null ? null : fix,
			delegate: fix
		});
	});
	
	Dom.addEvents('focus', {
		delegate: 'focusin'
	}).addEvents('blur', {
		delegate: 'focusout'
	});
	
	/// #endregion

	/// #region DomReady

	/**
	 * 设置在页面加载(不包含图片)完成时执行函数。
	 * @param {Functon} fn 当DOM加载完成后要执行的函数。
	 * @member Dom.ready
	 * @remark
	 * 允许你绑定一个在DOM文档载入完成后执行的函数。需要把页面中所有需要在 DOM 加载完成时执行的Dom.ready()操作符都包装到其中来。
	 * 
        @example
          当DOM加载完成后，执行其中的函数。
          #####JavaScript:<pre>Dom.ready(function(){
  // 文档就绪
});</pre>
        
	 */

	/**
	 * 设置在页面加载(包含图片)完成时执行函数。
	 * @param {Functon} fn 执行的函数。
	 * @member Dom.load
	 * @remark
	 * 允许你绑定一个在DOM文档载入完成后执行的函数。需要把页面中所有需要在 DOM 加载完成时执行的Dom.load()操作符都包装到其中来。
        @example
          当DOM加载完成后，执行其中的函数。
          #####JavaScript:<pre>Dom.load(function(){
  // 文档和引用的资源文件加载完成
});</pre>
        
	 */

	// 避免使用了默认的 DOM 事件处理。
	Dom.$event.domready = Dom.$event.domload = {};

	map('ready load', function(readyOrLoad, isLoad) {

		var isReadyOrIsLoad = isLoad ? 'isLoaded': 'isReady';
		
		readyOrLoad = 'dom' + readyOrLoad;

		// 设置 ready load
		return function (fn, scope) {
			
			// 忽略参数不是函数的调用。
		    var isFn = typeof fn === 'function';

			// 如果已载入，则直接执行参数。
			if(Dom[isReadyOrIsLoad]) {

				if (isFn)
					fn.call(scope);

				// 如果参数是函数。
			} else if (isFn) {

				document.on(readyOrLoad, fn, scope);

				// 触发事件。
				// 如果存在 JS 之后的 CSS 文件， 肯能导致 document.body 为空，此时延时执行 DomReady
			} else if (document.body) {

				// 如果 isReady, 则删除
				if(isLoad) {

					// 使用系统文档完成事件。
					isFn = Dom.window;
					fn = readyOrLoad;

					// 确保 ready 触发。
					Dom.ready();

				} else {
					isFn = document;
					fn = domReady;
				}

				defaultEvent.remove(isFn, fn, arguments.callee);

				// 先设置为已经执行。
				Dom[isReadyOrIsLoad] = true;

				// 触发事件。
				if (document.trigger(readyOrLoad, fn)) {

					// 删除事件。
					document.un(readyOrLoad);

				}
				
			} else {
				setTimeout(arguments.callee, 1);
			}

			return document;
		};

	}, Dom);
	
	// 如果readyState 不是 complete, 说明文档正在加载。
	if(document.readyState !== "complete") {

		// 使用系统文档完成事件。
		defaultEvent.add(document, domReady, Dom.ready);

		defaultEvent.add(Dom.window, 'load', Dom.load, false);

		/// #if CompactMode
		
		// 只对 IE 检查。
		if(!isStd) {

			// 来自 jQuery
			// 如果是 IE 且不是框架
			var topLevel = false;

			try {
				topLevel = window.frameElement == null && document.documentElement;
			} catch(e) {
			}

			if(topLevel && topLevel.doScroll) {

				/**
				 * 为 IE 检查状态。
				 * @private
				 */
				(function doScrollCheck() {
					if(Dom.isReady) {
						return;
					}

					try {
						// Use the trick by Diego Perini
						// http://javascript.nwbox.com/IEContentLoaded/
						topLevel.doScroll("left");
					} catch(e) {
						return setTimeout(doScrollCheck, 50);
					}

					Dom.ready();
				})();
			}
		}

		/// #endif
	} else {
		setTimeout(Dom.load, 1);
	}
	
	/// #endregion

	/// #region Export
	
	div = null;
	
	// 导出函数。
	window.Dom = Dom;
	window.DomList = DomList;
	window.Point = Point;
	window.$ = window.$ || Dom.query;
	
	/// #endregion

	/**
	 * @class
	 */

	/**
	 * 创建 DomList 的方法。 
	 * @param {NodeList} fnName 对应的 Dom 对象的函数名。
	 * @param {Integer} listType=0 函数类型。
	 */
	function createDomListMthod(fnName, listType){
		return !listType ? function () {
			// 为每个 Dom 对象调用 fnName 。
			var i = 0, len = this.length, target;
			while(i < len) {
				target = new Dom(this[i++]);
				target[fnName].apply(target, arguments);
			}
			return this;
		} : listType === 2 ? function() {
			// 返回第一个元素的对应值 。
			if(this.length) {
				var target = new Dom(this[0]);
				return target[fnName].apply(target, arguments);
			}
		} : listType === 3 ? function() {
			// 将返回的每个节点放入新的 DomList 中。
			var r = new DomList;
			return r.add.apply(r, this.invoke(fnName, arguments));
		} : function() {
			// 只要有一个返回非 false，就返回这个值。
			var i = 0, r, target;
			while (i < this.length && !r) {
				target = new Dom(this[i++]);
				r = target[fnName].apply(target, arguments);
			}
			return r;
		};
	}
	
	/**
	 * 遍历 NodeList 对象。 
	 * @param {NodeList} nodelist 要遍历的 NodeList。
	 * @param {Function} fn 遍历的函数。
	 */
	function each(nodelist, fn) {
		var i = 0, node;
		while( node = nodelist[i++]){
			fn(node);
		}
	}

	/**
	 * 获取元素的文档。
	 * @param {Node} node 元素。
	 * @return {Document} 文档。
	 */
	function getDocument(node) {
		assert.isNode(node, 'Dom.getDocument(node): {node} ~', node);
		return node.ownerDocument || node.document || node;
	}
	
	/**
	 * 快速判断一个节点满足制定的过滤器。
	 * @param {Node} elem 元素。
	 * @param {String/Function/Undefined} filter 过滤器。
	 * @return {Boolean} 返回结果。
	 */
	function quickMatch(elem, filter){
		return !filter || (typeof filter === 'string' ? /^(?:[-\w:]|[^\x00-\xa0]|\\.)+$/.test(filter) ? elem.tagName === filter.toUpperCase() : Dom.match(elem, filter) : filter(elem));
	}

	/**
	 * 返回简单的遍历函数。
	 * @param {String} next 获取下一个成员使用的名字。
	 * @param {String} first=next 获取第一个成员使用的名字。
	 * @return {Function} 遍历函数。
	 */
	function createTreeWalker(next, first) {
		first = first || next;
		return function(filter) {
			var node = this.node[first];
			
			// 如果 filter === null，则表示获取任意 nodeType 的节点。
			if(filter === null){
				return node ? new Dom(node) : node;
			}
			
			// 找到第一个nodeType == 1 的节点。
			while(node && node.nodeType !== 1) {
				node = node[next];
			}
			
			// 如果存在过滤器，执行过滤器。
			if(node && quickMatch(node, filter)){
				return new Dom(node);
			}
		
			return null;
		};
	}

	/**
	 * 返回简单的遍历函数。
	 * @param {String} next 获取下一个成员使用的名字。
	 * @param {String} first=next 获取第一个成员使用的名字。
	 * @return {Function} 遍历函数。
	 */
	function createTreeDir(next, first) {
		first = first || next;
		return function(filter) {
			var node = this.node[first],
				r = new DomList;

			// 如果 filter === null，则表示获取任意 nodeType 的节点。
			while (node) {
				if ((node.nodeType === 1 && quickMatch(node, filter)) || filter === null)
					r.push(node);
				node = node[next];
			}

			return r;
		}
	}
	
	/**
	 * 删除由于拷贝导致的杂项。
	 * @param {Element} srcElem 源元素。
	 * @param {Element} destElem 目的元素。
	 * @param {Boolean} cloneDataAndEvent=true 是否复制数据。
	 * @param {Boolean} keepId=false 是否留下ID。
	 */
	function cleanClone(srcElem, destElem, cloneDataAndEvent, keepId) {

		// 删除重复的 ID 属性。
		if(!keepId && destElem.removeAttribute)
			destElem.removeAttribute('id');

		/// #if CompactMode
		
		if(destElem.clearAttributes) {

			// IE 会复制 自定义事件， 清楚它。
			destElem.clearAttributes();
			destElem.mergeAttributes(srcElem);
			destElem.$data = null;

			if(srcElem.options) {
				each(srcElem.options, function(value) {
					destElem.options.seleced = value.seleced;
				});
			}
		}

		/// #endif

		if (cloneDataAndEvent !== false && (cloneDataAndEvent = srcElem.$data)) {

			destElem.$data = cloneDataAndEvent = extend({}, cloneDataAndEvent);
			
			// event 作为系统内部对象。事件的拷贝必须重新进行 on 绑定。
			var event = cloneDataAndEvent.$event, dest;

			if (event) {
				cloneDataAndEvent.$event = null;
				dest = new Dom(destElem);
				for (cloneDataAndEvent in event)

					// 对每种事件。
					event[cloneDataAndEvent].handlers.forEach(function(handler) {

						// 如果源数据的 target 是 src， 则改 dest 。
						dest.on(cloneDataAndEvent, handler[0], handler[1].node === srcElem ? dest : handler[1]);
					});
			}
			
		}
		
		// 特殊属性复制。
		if (keepId = Dom.cloneFix[srcElem.tagName]) {
			if (typeof keepId === 'string') {
				destElem[keepId] = srcElem[keepId];
			} else {
				keepId(destElem, srcElem);
			}
		}
	}

	/**
	 * 清除节点的引用。
	 * @param {Element} elem 要清除的元素。
	 */
	function clean(elem) {

		// 删除自定义属性。
		if(elem.clearAttributes)
			elem.clearAttributes();

		// 删除事件。
		new Dom(elem).un();

		// 删除句柄，以删除双重的引用。
		elem.$data = null;

	}

	/**
	 * 到骆驼模式。
	 * @param {String} all 全部匹配的内容。
	 * @param {String} match 匹配的内容。
	 * @return {String} 返回的内容。
	 */
	function formatStyle(all, match) {
		return match ? match.toUpperCase(): styleFloat;
	}

	/**
	 * 读取样式字符串。
	 * @param {Element} elem 元素。
	 * @param {String} name 属性名。
	 * @return {String} 字符串。
	 */
	function styleString(elem, name) {
		assert.isElement(elem, "Dom.styleString(elem, name): {elem} ~");
		return elem.style[name] || getStyle(elem, name);
	}

	/**
	 * 读取样式数字。
	 * @param {Object} elem 元素。
	 * @param {Object} name 属性名。
	 * @return {Number} 数字。
	 */
	function styleNumber(elem, name) {
		assert.isElement(elem, "Dom.styleNumber(elem, name): {elem} ~");
		var value = parseFloat(elem.style[name]);
		if(!value && value !== 0) {
			value = parseFloat(getStyle(elem, name));

			if(!value && value !== 0) {
				if( name in styleFix) {
					
					var styles = {};
					for(var style in Dom.displayFix) {
						styles[style] = elem.style[style];
					}
					
					extend(elem.style, Dom.displayFix);
					value = parseFloat(getStyle(elem, name)) || 0;
					extend(elem.style, styles);
				} else {
					value = 0;
				}
			}
		}

		return value;
	}

	/**
	 * 转换参数为标准点。
	 * @param {Number} x X坐标。
	 * @param {Number} y Y坐标。
	 * @return {Object} {x:v, y:v}
	 */
	function formatPoint(x, y) {
		return x && typeof x === 'object' ? x: {
			x: x,
			y: y
		};
	}
	
	/**
	 * 判断指定选择器是否符合指定的节点。 
	 * @param {Node} node 判断的节点。
	 * @param {String} selector 选择器表达式。
	 */
	function match(node, selector){
		var r, i = 0;
		try{
			r = node.parentNode.querySelectorAll(selector);
		} catch(e){
			return query(selector, new Dom(node.parentNode)).indexOf(node) >= 0 || query(selector, Dom.document).indexOf(node) >= 0;
		}
		while(r[i])
			if(r[i++] === node)
				return true;
		
		return false;
	}

	/// #region Selector
	
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
		while(selector) {
			
			// 保存本次处理前的选择器。
			// 用于在本次处理后检验 selector 是否有变化。
			// 如果没变化，说明 selector 不能被正确处理，即 selector 包含非法字符。
			lastSelector = selector;
			
			// 解析的第一步: 解析简单选择器
			
			// ‘*’ ‘tagName’ ‘.className’ ‘#id’
			if( m = /^(^|[#.])((?:[-\w\*]|[^\x00-\xa0]|\\.)+)/.exec(selector)) {
				
				// 测试是否可以加速处理。
				if(!m[1] || (result[m[1] === '#' ? 'getElementById' : 'getElementsByClassName'])) {
					selector = RegExp.rightContext;
					switch(m[1]) {
						
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
			} else if(m = /^\s*([\s>+~<])\s*(\*|(?:[-\w*]|[^\x00-\xa0]|\\.)*)/.exec(selector)) {
				selector = RegExp.rightContext;
				
				var value = m[2].replace(rBackslash, "");
				
				switch(m[1]){
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
						result = result.parentAll( value);
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
			if(!(result instanceof DomList)){
				result = new DomList(result);
			}
			
			// 解析的第四步: 筛选以上三步返回的结果。
	
			// ‘#id’ ‘.className’ ‘:filter’ ‘[attr’
			while(m = /^([#\.:]|\[\s*)((?:[-\w]|[^\x00-\xa0]|\\.)+)/.exec(selector)) {
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
						if( m = /^\(\s*("([^"]*)"|'([^']*)'|[^\(\)]*(\([^\(\)]*\))?)\s*\)/.exec(selector)) {
							selector = RegExp.rightContext;
							args = m[3] || m[2] || m[1];
						}
						
						
						break;
	
						// ‘[attr’
					default:
						filterData = [value.toLowerCase()];
						
						// ‘selector[attr]’ ‘selector[attr=value]’ ‘selector[attr='value']’  ‘selector[attr="value"]’    ‘selector[attr_=value]’
						if( m = /^\s*(?:(\S?=)\s*(?:(['"])(.*?)\2|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/.exec(selector)) {
							selector = RegExp.rightContext;
							if(m[1]) {
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
				if(filterData.call) {
					
					// 仅有 2 个参数则传入 oldResult 和 result
					if(filterData.length === 3){
						filterData(args, oldResult, result);
					} else {
						while(elem = oldResult[i++]) {
							if(filterData(elem, args))
								result.push(elem);
						}
					}
				} else {
					while(elem = oldResult[i++]){
						var actucalVal = Dom.getAttr(elem, filterData[0], 1),
							expectedVal = filterData[2],
							tmpResult;
						switch(filterData[1]){
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
						
						if(tmpResult){
							result.push(elem);	
						}
					}
				}
			}
			
			// 最后解析 , 如果存在，则继续。

			if( m = /^\s*,\s*/.exec(selector)) {
				selector = RegExp.rightContext;
				return result.add(query(selector, prevResult));
			}


			if(lastSelector.length === selector.length){
				throwError(selector);
			}
		}
		
		return result;
	}
		
	/**
	 * 抛出选择器语法错误。 
 	 * @param {String} message 提示。
	 */
	function throwError(message) {
		throw new SyntaxError('An invalid or illegal string was specified : "' + message + '"!');
	}

	/// #endregion
	
})(this);
