//===========================================
//  扩展 Window   window.js  A
//===========================================
 

	///   #region Window

    /// <summary>
    /// 窗口
    /// </summary>
    /// <class name="Window" />
    p.Window = p.Base.extend({

        constructor: function(w) {
		
			var e =  Element;
		
			/**
             * 本地化 Element 。
             * @class Element
             */
			if(w.Element) {
				Object.extend(w.Element, e).implementIf(e.prototype);
			} else {
				w.Element = e;
			}
			
			Object.extend(Object.extendIf(w.document, e), p.Document);

        },
        getWindow: function () {
            return this.document ? this : (this.window || w);
        },
        /// <summary>
        /// 获取大小
        /// </summary>
        /// <returns type="Object">{x:0, y:0}</returns>
        getSize: navigator.isOpera || navigator.isWebkit ? function() {
            var win = this.getWindow();
            return {x: win.innerWidth, y: win.innerHeight};
        } : function() {
            var doc = getCompatElement(this);
            return {x: doc.clientWidth, y: doc.clientHeight};
        },
        /// <summary>
        /// 获取滚动范围
        /// </summary>
        /// <returns type="Object">{x:0, y:0}</returns>
        getScroll: function() {
            var win = this.getWindow(), doc = getCompatElement(this);
            return {x: win.pageXOffset || doc.scrollLeft, y: win.pageYOffset || doc.scrollTop};
        },
        /// <summary>
        /// 获取最终滚动范围
        /// </summary>
        /// <returns type="Object">{x:0, y:0}</returns>

        /// <summary>
        /// 获取滚动区域大小
        /// </summary>
        /// <returns type="Object">{x:0, y:0}</returns>
        getScrollSize: function() {
            var doc = getCompatElement(this), min = this.getSize();
            return {x: Math.max(doc.scrollWidth, min.x), y: Math.max(doc.scrollHeight, min.y)};
        },
        /// <summary>
        /// xtype
        /// </summary>
        /// <type name="String" />
        /// <const />
        xtype: "Element",

        /// <summary>
        /// 返回节点
        /// </summary>
        get: get,

        /// <summary>
        /// 获取位置
        /// </summary>
        /// <returns type="Object">{x:0, y:0}</returns>
        getPosition: o

    }, true);

    //new p.Window(w);

    //p.Window.prototype.getScrolls = p.Window.prototype.getScroll;

    ///  #endregion
	
	
	
	

		/**
		 * 获取元素可视区域大小。
		 * @method getWindowSize
		 * @return {Point} 位置。
		 */
		getWindowSize: function() {
			var win = this.defaultView;
			return new Point(win.outerWidth || this.node.clientWidth, win.outerHeight || this.node.clientHeight);
		},

		/**
		 * 设置元素可视区域大小。
		 * @method setWindowSize
		 * @param {Number} x 大小。
		 * @param {Number} y 大小。
		 * @return {Document} this 。
		 */
		setWindowSize: function(x, y) {
			var p = Element.getXY(x, y);
			if(p.x == null)
				p.x = this.getWindowSize().x;
			if(p.y == null)
				p.x = this.getWindowSize().y;
			this.defaultView.resizeTo(p.x, p.y);
			return this;
		},
	