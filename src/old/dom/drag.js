/**
 * @author xuld
 */

//#include dom/base.js

/**
 * 处理用户拖动操作的类。
 */
var Draggable = Base.extend({

    /**
     * 从鼠标按下到开始拖动的延时。
     */
    dragDelay: 500,

    /**
	 * 触发原生的 DOM 事件。
	 * @param {String} eventName 触发的事件名。
	 * @param {Event} e mousemove 事件参数对象。
     * @protected virtual
	 */
    raiseEvent: function (eventName, e) {

        // 绑定 draggable 和当前的 Draggable 对象。
        e.draggable = this;

        return Dom.trigger(this.elem, eventName, e);
    },
	
	/**
	 * 当 dragstart 事件发生时执行。
	 * @param {Event} e 原生的 mousemove 事件。
     * @protected virtual
	 */
    onDragStart: function (e) {

    	if (!this.raiseEvent('dragstart', e)) {
            return false;
        }
        // 记录当前的 offset, 用于在 onDrag 时设置位置。
        this.offset = Dom.getOffset(this.proxy);
    },
	
	/**
	 * 当 drag 事件发生时执行。
	 * @param {Event} e 原生的 mousemove 事件。
     * @protected virtual
	 */
	onDrag: function (e) {
	    var me = this;

	    me.raiseEvent('drag', e);

	    Dom.setOffset(me.proxy, {
	        x: me.offset.x + me.to.x - me.from.x,
	        y: me.offset.y + me.to.y - me.from.y
	    });
	},
	
	/**
	 * 当 dragend 事件发生时执行。
	 * @param {Event} e 原生的 mouseup 事件。
     * @protected virtual
	 */
	onDragEnd: function (e) {
	    this.raiseEvent('dragend', e);
	    this.offset = null;
	},
	
	/**
	 * 处理 mousedown 事件。
	 * 初始化拖动，当单击时，执行这个函数，但不触发 dragStart。
	 * 只有鼠标移动时才会继续触发 dragStart。
	 * @param {Event} e 事件参数。
	 */
	handlerMouseDown: function (e) {

		// 左键才继续
		if(e.which !== 1)
			return;
		
        // 如果当前正在拖动，通知当前拖动对象停止拖动。
		if(Draggable.current) {
			Draggable.current.stopDrag(e);
		}
		
        // 阻止默认事件。
		e.preventDefault();

		var me = this;
		
        // 记录当前的开始位置。
		me.from = { x: e.pageX, y: e.pageY };
		me.to = { x: e.pageX, y: e.pageY };
		
		// 设置当前处理  mousemove 的方法。
		// 初始需设置 onDrag
		// 由 onDrag 设置为    onDrag
		me.currentHandler = me.handlerDragStart;
		
        // 延时拖动。
		me.timer = setTimeout(function () {
		    me.timer = 0;
		    me.currentHandler(e);
		}, me.dragDelay);
		
		// 设置文档  mouseup 和   mousemove
		var doc = Dom.getDocument(me.handle);
		Dom.on(doc, 'mouseup', me.handlerDragStop, me);
		Dom.on(doc, 'mousemove', me.handlerMouseMove, me);
	
	},
	
	/**
	 * 处理 mousemove 事件。
	 * @param {Event} e 事件参数。
	 */
	handlerMouseMove: function (e) {
		
		e.preventDefault();
		
        // 更新当前的鼠标位置。
		this.to.x = e.pageX;
		this.to.y = e.pageY;
		
		// 调用当前的处理句柄来处理此函数。
		this.currentHandler(e);
	},
	
	/**
	 * 处理 mousedown 或 mousemove 事件。开始准备拖动。
	 * @param {Event} e 事件。
	 * 这个函数调用 onDragStart 和 beforeDrag
	 */
	handlerDragStart: function (e) {
		
		var me = this;
		
	    //   清空计时器。
		if (me.timer) {
		    clearTimeout(me.timer);
		    me.timer = 0;
		}
		
        // 设置当前正在拖动的对象。
		Draggable.current = me;
		
	    // 设置下次 mousemove 时的处理函数。
		me.currentHandler = me.handlerDrag;
		
	    // 触发 dragstart 事件，  就完全停止拖动。
		if (me.onDragStart(e) !== false) {
		    me.beforeDrag(e);
		    me.handlerDrag(e, true);
		} else {
			// 停止。
			me.stopDragging();
		}
	},
	
	/**
	 * 处理 mousemove 事件。处理拖动。
	 * @param {Event} e 事件参数。
	 * 这个函数调用 onDrag 和 doDrag
	 */
	handlerDrag: function (e) {
		this.onDrag(e);
		this.doDrag(e);
	},
	
	/**
	 * 处理 mouseup 事件。
	 * @param {Event} e 事件参数。
	 * 这个函数调用 onDragEnd 和 afterDrag
	 */
	handlerDragStop: function (e) {
		
		// 只有鼠标左键松开， 才认为是停止拖动。
		if(e.which !== 1)
			return;
		
		e.preventDefault();

	    // 在 stopDragging 前记录 Draggable.current 。
		var isCurrentDraggable = Draggable.current === this;

		this.stopDragging();
		
		// 检查是否拖动。
		// 有些浏览器效率较低，肯能出现这个函数多次被调用。
		// 为了安全起见，检查 current 变量。
		if (isCurrentDraggable) {

		    // 改变结束的鼠标类型，一般这个函数将恢复鼠标样式。
		    this.afterDrag(e);
			
			this.onDragEnd(e);
		
		}
	},
	
	beforeDrag: function (e) {
	    this.oldCursor = document.documentElement.style.cursor;
	    document.documentElement.style.cursor = Dom.getStyle(this.elem, 'cursor');
		if('pointerEvents' in document.body.style)
			document.body.style.pointerEvents = 'none';
		else if(document.body.setCapture)
			document.body.setCapture();
	},

    doDrag: Function.empty,
	
	afterDrag: function(){
		if(document.body.style.pointerEvents === 'none')
			document.body.style.pointerEvents = '';
		else if(document.body.releaseCapture)
			document.body.releaseCapture();
		document.documentElement.style.cursor = this.oldCursor;
	},
	
	constructor: function (options) {
	    Object.extend(this, options);

	    this.handle = this.handle || this.elem;

	    this.proxy = this.proxy || this.elem;

	    this.disable(false);
	},

	/**
	 * 停止当前对象的拖动。
	 */
	stopDragging: function(){
		var doc = Dom.getDocument(this.handle);
		Dom.un(doc, 'mousemove', this.handlerMouseMove, this);
		Dom.un(doc, 'mouseup', this.handlerDragStop, this);

	    //   清空计时器。
	    if (this.timer) {
	        clearTimeout(this.timer);
	        this.timer = 0;
	    }

		Draggable.current = null;
	},

    /**
	 * 启用或禁用当前拖动功能的状态。
	 */
	disable: function (value) {
		Dom[value === false ? 'on' : 'un'](this.handle, 'mousedown', this.handlerMouseDown, this);
	}
	
});

Dom.draggable = function (elem, options) {
	
	var draggable = Dom.data(elem).draggable;
	if (options !== false) {
		if (typeof options !== 'object') options = {};
		if (draggable) {
			Object.extend(draggable, options);
			draggable.disable(false);
		} else {
			options.elem = elem;
			Dom.movable(elem);
			draggable = Dom.data(elem).draggable = new Draggable(options);
		}
	} else if (draggable)
		draggable.disable();
};

/**
 * @class Dom
 */
Dom.implement({
	
	/**
	 * 使当前元素支持拖动。
	 * @param {Element} [handle] 拖动句柄。
	 * @return this
	 */
    draggable: function () {
    	return this.iterate(Dom.draggable, arguments);
	}
	
});
	

