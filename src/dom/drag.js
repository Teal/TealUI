/**
 * @author xuld
 */

// #require rect

/**
 * 创建一个新的可拖动区域。
 */
function Draggable(elem, options) {

    this.elem = this.handle = elem;

    // 使用用户自定义配置覆盖默认配置。
    for (var key in options) {
        this[key] = options[key];
    }

    this.handle.on('mousedown', this.handlerMouseDown);

}

Draggable.prototype = {

    constructor: Draggable,

    /**
     * 设置当前拖动的节点。
     */
    elem: null,

    /**
     * 设置拖动的局部。
     */
    handle: null,

    /**
     * 从鼠标按下到开始拖动的延时。
     */
    dragDelay: 500,

    /**
     * 设置是否自动滚动屏幕。
     */
    autoSrcoll: 50,

    /**
     * 实现拖动开始的逻辑。
     * @param {Event} e 原生的 mousemove 事件。
     */
    dragStart: function (e) {
        var me = this;
        me.startOffset = me.elem.getOffset();
        return !me.onDragStart || me.onDragStart(e);
    },

    /**
     * 实现拖动中的逻辑。
     * @param {Event} e 原生的 mousemove 事件。
     */
    dragMove: function (e) {

        var me = this;

        // 更新目标偏移量。
        me.endOffset = {
            left: me.startOffset.left + me.endX - me.startX,
            top: me.startOffset.top + me.endY - me.startY
        };

        // 调用用户的拖动回调并更新位置。
        if (!me.onDragMove || me.onDragMove(e) !== false) {
            me.elem.style.top = me.endOffset.top + 'px';
            me.elem.style.left = me.endOffset.left + 'px';
        }
    },

    /**
     * 实现拖动结束的逻辑。
     * @param {Event} e 原生的 mousemove 事件。
     */
    dragEnd: function (e) {

        var me = this;

        // 如果拖动结束被禁用，则恢复当前拖动滑块到原位置。
        if (me.onDragEnd && me.onDragEnd(e) === false) {
            me.elem.animate({
                left: me.startOffset.left + 'px',
                top: me.startOffset.top + 'px',
            });
        }
        me.startOffset = me.endOffset = null;
    },

    /**
     * 处理 mousedown 事件。
     * 初始化拖动，当单击时，执行这个函数，但不触发 dragStart。
     * 只有鼠标移动时才会继续触发 dragStart。
     * @param {Event} e 事件参数。
     */
    handlerMouseDown: function (e) {

        // 只处理左键拖动。
        if (e.which === 1) {

            var me = this;

            // 阻止默认事件。
            e.preventDefault();

            // 如果当前正在拖动，通知当前拖动对象停止拖动。
            if (Draggable.current) {
                Draggable.current.stopDragging(e);
            }

            // 记录当前的开始位置。
            me.endX = me.startX = e.pageX;
            me.endY = me.startY = e.pageY;

            // 设置下一步处理句柄。
            me.currentHandler = me.startDragging;

            // 当用户仅按住鼠标指定时间，也认为开始拖动。
            me.timer = setTimeout(function () {
                me.timer = 0;
                me.currentHandler(e);
            }, me.dragDelay);

            // 绑定拖动和停止拖动事件。
            var doc = me.elem.ownerDocument;
            doc.on('mouseup', me.handlerMouseUp, me);
            doc.on('mousemove', me.handlerMouseMove, me);

        }

    },

    /**
     * 处理 mousemove 事件。
     * @param {Event} e 事件参数。
     */
    handlerMouseMove: function (e) {

        // 阻止默认事件。
        e.preventDefault();

        var me = this;

        // 自动滚动屏幕。
        if (me.autoSrcoll) {
            var doc = me.elem.ownerDocument,
                docSize = doc.getRect(),
                docScroll = doc.getScroll(),
                globalX = e.pageX - docScroll.left,
                globalY = e.pageY - docScroll.top,
                needScroll = false;

            if (globalX > docSize.width - me.autoSrcoll) {
                docScroll.left += me.autoSrcoll;
                needScroll = true;
            } else if (globalX < me.autoSrcoll) {
                docScroll.left -= me.autoSrcoll;
                needScroll = true;
            }

            if (globalY > docSize.height - me.autoSrcoll) {
                docScroll.top += me.autoSrcoll;
                needScroll = true;
            } else if (globalY < me.autoSrcoll) {
                docScroll.top -= me.autoSrcoll;
                needScroll = true;
            }

            if (needScroll) {
                doc.setScroll(docScroll);
            }
        }

        // 更新当前的鼠标位置。
        me.endX = e.pageX;
        me.endY = e.pageY;

        // 调用当前的处理句柄来处理此函数。
        me.currentHandler(e);
    },

    /**
     * 处理 mouseup 事件。
     * @param {Event} e 事件参数。
     * 这个函数调用 onDragEnd 和 afterDrag
     */
    handlerMouseUp: function (e) {
        // 只有鼠标左键松开， 才认为是停止拖动。
        if (e.which === 1) {
            e.preventDefault();
            this.stopDragging(e);
        }
    },

    /**
     * 处理 mousedown 或 mousemove 事件。开始准备拖动。
     * @param {Event} e 事件。
     */
    startDragging: function (e) {

        var me = this;

        // 设置当前正在拖动的对象。
        Draggable.current = me;

        // 清空计时器。
        if (me.timer) {
            clearTimeout(me.timer);
            me.timer = 0;
        }

        // 设置下次处理拖动的处理函数。
        me.currentHandler = me.dragMove;

        // 锁定鼠标样式。
        me.orignalCursor = document.documentElement.style.cursor;
        document.documentElement.style.cursor = me.elem.getStyle('cursor');
        if ('pointerEvents' in document.body.style)
            document.body.style.pointerEvents = 'none';
        else if (document.body.setCapture)
            document.body.setCapture();

        // 执行开始拖动回调，如果用户阻止和强制停止拖动。
        if (me.dragStart(e) !== false) {
            me.dragMove(e, true);
        } else {
            me.stopDragging(e);
        }
    },

    /**
     * 强制停止当前对象的拖动。
     * @param {Event} e 事件。
     */
    stopDragging: function (e) {
        var me = this,
            doc = me.elem.ownerDocument;
        doc.off('mousemove', me.handlerMouseMove);
        doc.off('mouseup', me.handlerMouseUp);

        //   清空计时器。
        if (me.timer) {
            clearTimeout(me.timer);
            me.timer = 0;
        }

        // 恢复鼠标样式。
        if (document.body.style.pointerEvents === 'none')
            document.body.style.pointerEvents = '';
        else if (document.body.releaseCapture)
            document.body.releaseCapture();
        document.documentElement.style.cursor = me.orignalCursor;

        // 拖动结束。
        me.dragEnd(e);
        Draggable.current = null;

    },

    /**
     * 销毁拖动对象。
     */
    destroy: function () {
        this.handle.off('mousedown', this.handlerMouseDown);
    }

};

/**
 * 初始化指定的元素为可拖动对象。
 * @param {Object} options 拖动的相关属性。
 * 
 * - handle: 拖动的句柄元素。
 * - dragDelay: 从鼠标按下到开始拖动的延时。
 * - autoSrcoll: 设置是否自动滚动屏幕。
 * - onDragStart/onDragMove/onDragEnd: 设置拖动开始/移动/结束时的回调。
 */
Element.prototype.setDraggable = function (options) {
    return new Draggable(this, options);
};
