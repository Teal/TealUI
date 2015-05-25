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
         * 设置是否自动滚动屏幕。
         */
        autoSrcoll: 50,

        /**
         * 实现拖动开始的逻辑。
         * @param {Event} e 原生的 mousemove 事件。
         */
        dragStart: function (e) {
            this.startOffset = Dom.getOffset(this.elem);
            return !this.onDragStart || this.onDragStart(e);
        },

        /**
         * 实现拖动中的逻辑。
         * @param {Event} e 原生的 mousemove 事件。
         */
        dragMove: function (e) {

            // 更新目标偏移量。
            this.endOffset = {
                left: this.startOffset.left + this.endX - this.startX,
                top: this.startOffset.top + this.endY - this.startY
            };

            // 调用用户的拖动回调并更新位置。
            if (!this.onDragMove || this.onDragMove(e) !== false) {
                this.elem.style.top = this.endOffset.top + 'px';
                this.elem.style.left = this.endOffset.left + 'px';
            }
        },

        /**
         * 实现拖动结束的逻辑。
         * @param {Event} e 原生的 mousemove 事件。
         */
        dragEnd: function (e) {
            // 如果拖动结束被禁用，则恢复当前拖动滑块到原位置。
            if (this.onDragEnd && this.onDragEnd(e) === false) {
                Dom.animate(this.elem, {
                    left: this.startOffset.left + 'px',
                    top: this.startOffset.top + 'px',
                });
            }
            this.startOffset = this.endOffset = null;
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
                draggabe.endX = draggabe.startX = e.pageX;
                draggabe.endY = draggabe.stadragMovertY = e.pageY;

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

            // 自动滚动屏幕。
            if (draggabe.autoSrcoll) {
                var doc = Dom.getDocument(draggabe.elem),
                    docSize = Dom.getRect(doc),
                    docScroll = Dom.getScroll(doc),
                    globalX = e.pageX - docScroll.left,
                    globalY = e.pageY - docScroll.top,
                    needScroll = false;

                if (globalX > docSize.width - draggabe.autoSrcoll) {
                    docScroll.left += draggabe.autoSrcoll;
                    needScroll = true;
                } else if (globalX < draggabe.autoSrcoll) {
                    docScroll.left -= draggabe.autoSrcoll;
                    needScroll = true;
                }

                if (globalY > docSize.height - draggabe.autoSrcoll) {
                    docScroll.top += draggabe.autoSrcoll;
                    needScroll = true;
                } else if (globalY < draggabe.autoSrcoll) {
                    docScroll.top -= draggabe.autoSrcoll;
                    needScroll = true;
                }

                if (needScroll) {
                    Dom.setScroll(doc, docScroll);
                }
            }

            // 更新当前的鼠标位置。
            draggabe.endX = e.pageX;
            draggabe.endY = e.pageY;

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
                draggabe.stopDragging(e);
            }
        },

        /**
         * 处理 mousedown 或 mousemove 事件。开始准备拖动。
         * @param {Event} e 事件。
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
            draggabe.currentHandler = draggabe.dragMove;

            // 锁定鼠标样式。
            draggabe.orignalCursor = document.documentElement.style.cursor;
            document.documentElement.style.cursor = Dom.getStyle(draggabe.elem, 'cursor');
            if ('pointerEvents' in document.body.style)
                document.body.style.pointerEvents = 'none';
            else if (document.body.setCapture)
                document.body.setCapture();

            // 执行开始拖动回调，如果用户阻止和强制停止拖动。
            if (draggabe.dragStart(e) !== false) {
                draggabe.dragMove(e, true);
            } else {
                draggabe.stopDragging(e);
            }
        },

        /**
         * 强制停止当前对象的拖动。
         * @param {Event} e 事件。
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

            // 恢复鼠标样式。
            if (document.body.style.pointerEvents === 'none')
                document.body.style.pointerEvents = '';
            else if (document.body.releaseCapture)
                document.body.releaseCapture();
            document.documentElement.style.cursor = this.orignalCursor;

            // 拖动结束。
            this.dragEnd(e);
            Dom.draggable.current = null;

        },

        /**
         * 销毁拖动对象。
         */
        destroy: function () {
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
