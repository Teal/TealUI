/**
 * @author xuld
 */

// #require offset.js
// #require base.js

/**
 * 初始化指定的元素为可拖动对象。
 */
Dom.draggable = function (elem, options) {

    // 创建新拖动对象。
    var draggabe = {

        /**
         * 设置当前拖动的节点。
         */
        elem: elem,

        /**
         * 设置拖动的局部。
         */
        handle: elem,

        /**
         * 从鼠标按下到开始拖动的延时。
         */
        dragDelay: 500,

        /**
         * 实现拖动开始的逻辑。
         * @param {Event} e 原生的 mousemove 事件。
         */
        dragStart: function (e) {

            // 保存当前鼠标样式。
            this.oldCursor = document.documentElement.style.cursor;
            document.documentElement.style.cursor = Dom.getStyle(this.elem, 'cursor');
            if ('pointerEvents' in document.body.style)
                document.body.style.pointerEvents = 'none';
            else if (document.body.setCapture)
                document.body.setCapture();

            this.fromOffset = Dom.getOffset(this.elem);
            return !this.onDragStart || this.onDragStart(e) !== false;
        },

        /**
         * 实现拖动中的逻辑。
         * @param {Event} e 原生的 mousemove 事件。
         */
        drag: function (e) {

            // 更新目标偏移量。
            this.toOffset = {
                left: this.fromOffset.left + this.toX - this.fromX,
                top: this.fromOffset.top + this.toY - this.fromY
            };

            // 调用用户的拖动回调并更新位置。
            if (!this.onDrag || this.onDrag(e) !== false) {
                Dom.setOffset(this.elem, this.toOffset);
            }
        },

        /**
         * 实现拖动结束的逻辑。
         * @param {Event} e 原生的 mousemove 事件。
         */
        dragEnd: function (e) {

            // 恢复鼠标样式。
            if (document.body.style.pointerEvents === 'none')
                document.body.style.pointerEvents = '';
            else if (document.body.releaseCapture)
                document.body.releaseCapture();
            document.documentElement.style.cursor = this.oldCursor;

            this.onDragEnd && this.onDragEnd(e);
            this.fromOffset = this.toOffset = null;
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

                // 阻止默认事件。
                e.preventDefault();

                // 如果当前正在拖动，通知当前拖动对象停止拖动。
                if (Dom.draggable.current) {
                    Dom.draggable.current.stopDragging(e);
                }

                // 记录当前的开始位置。
                draggabe.toX = draggabe.fromX = e.pageX;
                draggabe.toY = draggabe.fromY = e.pageY;

                // 设置下一步处理句柄。
                draggabe.currentHandler = draggabe.startDragging;

                // 当用户仅按住鼠标指定时间，也认为开始拖动。
                draggabe.timer = setTimeout(function () {
                    draggabe.timer = 0;
                    draggabe.currentHandler(e);
                }, draggabe.dragDelay);

                // 绑定拖动和停止拖动事件。
                var doc = Dom.getDocument(draggabe.elem);
                Dom.on(doc, 'mouseup', draggabe.handlerMouseUp);
                Dom.on(doc, 'mousemove', draggabe.handlerMouseMove);

            }

        },

        /**
         * 处理 mousemove 事件。
         * @param {Event} e 事件参数。
         */
        handlerMouseMove: function (e) {

            // 阻止默认事件。
            e.preventDefault();

            // 更新当前的鼠标位置。
            draggabe.toX = e.pageX;
            draggabe.toY = e.pageY;

            // 调用当前的处理句柄来处理此函数。
            draggabe.currentHandler(e);
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

                // 在 stopDragging 前记录 Draggable.current 。
                var isCurrentDraggable = Dom.draggable.current === this;

                draggabe.stopDragging();

                // 检查是否拖动。
                // 有些浏览器效率较低，可能出现这个函数多次被调用。
                // 为了安全起见，检查 current 变量。
                isCurrentDraggable && this.dragEnd(e);

            }
        },

        /**
         * 处理 mousedown 或 mousemove 事件。开始准备拖动。
         * @param {Event} e 事件。
         * 这个函数调用 onDragStart 和 beforeDrag
         */
        startDragging: function (e) {

            // 设置当前正在拖动的对象。
            Dom.draggable.current = draggabe;

            // 清空计时器。
            if (draggabe.timer) {
                clearTimeout(draggabe.timer);
                draggabe.timer = 0;
            }

            // 设置下次处理拖动的处理函数。
            draggabe.currentHandler = draggabe.drag;

            // 执行开始拖动回调，如果用户阻止和强制停止拖动。
            if (draggabe.dragStart(e) !== false) {
                draggabe.drag(e, true);
            } else {
                draggabe.stopDragging(e);
            }
        },

        /**
         * 强制停止当前对象的拖动。
         */
        stopDragging: function (e) {
            var doc = Dom.getDocument(this.elem);
            Dom.off(doc, 'mousemove', this.handlerMouseMove);
            Dom.off(doc, 'mouseup', this.handlerMouseUp);

            //   清空计时器。
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = 0;
            }

            this.dragEnd(e);

            Dom.draggable.current = null;
        },

        /**
         * 销毁拖动对象。
         */
        destroy: function() {
            Dom.off(draggabe.handle, 'mousedown', draggabe.handlerMouseDown);
        }

    };

    // 使用用户自定义配置覆盖默认配置。
    for (var key in options) {
        draggabe[key] = options[key];
    }

    Dom.on(draggabe.handle, 'mousedown', draggabe.handlerMouseDown);

    return draggabe;

};
