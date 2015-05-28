/** * @author xuld */// #require dom/drag.jsvar Slider = Input.extend({

    /**
     * 规定允许的最小值。
     */
    min: 0,

    /**
     * 规定允许的最大值。
     */
    max: 100,
    /**
     * 规定合法数字间隔（如果 step="3"，则合法数字是 -3,0,3,6，以此类推）。
     */    step: 0,    init: function (options) {
        Dom.each(Dom.query('.x-slider-handle', this.elem), this.initHandle, this);
        var me = this;
        Dom.on(this.elem, 'mousedown', function (e) { me.onClick(e); });
        this.onChange();
    },    onClick: function (e) {

        if (e.target.matches('.x-slider-handle')) {
            return;
        }

        var handles = Dom.query('.x-slider-handle', this.elem),
            left = e.pageX - Dom.getRect(this.elem).left,
            leftP = left * 100 / this.elem.offsetWidth,
            min = 101,
            handle = handles[0];
        
        // 找到最近的点。
        for (var i = handles.length - 1; i >= 0; i--) {
            // 离右边更近则退出循环。
            var value = Math.abs(parseFloat(handles[i].style.left) - leftP);
            if (value < min) {
                handle = handles[i];
                min = value;
            }
        }

        this._setHandleOffset(handle, left);
        Dom.trigger(handle, 'mousedown', e);
    },    _setHandleOffset: function (handle, left) {
        var draggable = {
            endOffset: { left: left }
        };
        this._handleDragStart(handle, draggable);
        this._handleDragMove(handle, draggable);
    },    _handleDragStart: function (handle, draggable) {
        // 拖动开始前确定当前滑块的可用范围。每个滑块的范围的前后滑块之间。
        var handles = Dom.query('.x-slider-handle', this.elem),
            min = 101,
            max = -1,
            value;

        for (var i = 0; i < handles.length; i++) {
            if (handles[i] !== i) {
                value = parseFloat(handles[i].style.left);
                if (value < min) {
                    min = value;
                }
                if (value > max) {
                    max = value;
                }
            }
        }

        if (min === 101) {
            min = 0;
        }

        if (max === -1) {
            max = 100;
        }

        draggable.min = min,
        draggable.max = max;

        // 当两个滑块重叠时，允许滑块切换顺序。
        var currentValue = parseFloat(handle.style.left);
        if (currentValue === draggable.min) {
            draggable.min = 0;
        }
        if (currentValue === draggable.max) {
            draggable.max = 100;
        }

        draggable.part = this.step && this.elem.offsetWidth * this.step / (this.max - this.min);
    },    _handleDragMove: function (handle, draggable, e) {
        var left = draggable.endOffset.left;

        // 实时步长。
        if (draggable.part) {
            left = draggable.part * Math.floor((left + draggable.part / 2) / draggable.part);
        }

        // 计算百分比。
        left = left * 100 / this.elem.offsetWidth;
        
        // 确保滑块在合理拖动范围内。
        draggable.value = left = Math.max(draggable.min, Math.min(draggable.max, left));
        
        if (this.onChanging(draggable, e) !== false) {

            // 仅设置 X 坐标即可。
            handle.style.left = left + '%';

            // 更新滑块区域。
            this.onChange();

        }

    },    initHandle: function (handle) {
        var me = this;
        Dom.draggable(handle, {
            autoSrcoll: 0,
            onDragStart: function (e) {
                me._handleDragStart(handle, this, e);
            },
            onDragMove: function (e) {
                me._handleDragMove(handle, this, e);
                // 阻止默认的设置位置功能。
                return false;
            }
        });

        // 修复 handle 的 left 值。
        if (!/%$/.test(handle.style.left)) {
            handle.style.left = Dom.getOffset(handle).left * 100 / this.elem.offsetWidth + '%';
        }
    },    /**
     * 计算某个滑块的值。
     * @param {Element} handle 要设置的滑块。
     * @returns {Number} 返回一个 0 到 1 的值，表示这个滑块的值。
     */    getValueOfHandle: function (handle) {
        return handle ? this.min + parseFloat(handle.style.left) * (this.max - this.min) / 100 : 0;
    },    /**
     * 设置某个滑块的值。
     * @param {Element} handle 要设置的滑块。
     * @param {Number} value 一个 0 到 1 的值，表示这个滑块的值。
     */    setValueOfHandle: function (handle, value) {
        if (handle) {
            handle.style.left = (value - this.min) * 100 / (this.max - this.min) + '%';
            this.onChange();
        }
        return this;
    },    /**
     * 在滑块即将移动前触发。
     * @param {Object} draggable 保存本次滑块相关的信息。
     * @param {Event} e 引发滑动的原始事件信息。
     * @returns {Boolean} 如果本次滑动无效，则返回 false。
     */    onChanging: function (draggable, e) {
        return this.trigger('chaning', draggable);
    },    onChange: function () {

        // 更新文本域。
        this.getInput().value = this.getValues();

        // 设置滑块前景色。
        var handles = Dom.query('.x-slider-handle', this.elem),
            startHandle = this.getStartHandle(),
            endHandle = this.getEndHandle(),
            start = startHandle ? parseFloat(startHandle.style.left) : 0,
            fore = Dom.find('.x-slider-fore', this.elem);
        fore.style.left = start + '%';
        fore.style.width = endHandle ? Math.max(0, parseFloat(endHandle.style.left) - start) + '%' : 0;

        return this.trigger('change');
    },    /**
     * 获取每个滑块的值。
     */    getValues: function () {
        var values = [];
        Dom.each(Dom.query('.x-slider-handle', this.elem), function (handle, index) {
            values[index] = this.getValueOfHandle(handle);
        }, this);
        return values;
    },    getStartHandle: function () {
        var handles = Dom.query('.x-slider-handle', this.elem),
            min = 0;
        for (var i = 1; i < handles.length; i++) {
            if (parseFloat(handles[min].style.left) > parseFloat(handles[i].style.left)) {
                min = i;
            }
        }
        return handles.length > 1 ? handles[min] : null;
    },    getEndHandle: function () {
        var handles = Dom.query('.x-slider-handle', this.elem),
            max = 0;
        for (var i = 1; i < handles.length; i++) {
            if (parseFloat(handles[max].style.left) < parseFloat(handles[i].style.left)) {
                max = i;
            }
        }
        return handles[max];
    },    getStart: function (value) {
        return this.getValueOfHandle(this.getStartHandle());
    },    setStart: function (value) {
        return this.setValueOfHandle(this.getStartHandle(), value);
    },    getEnd: function (value) {
        return this.getValueOfHandle(this.getEndHandle());
    },    setEnd: function (value) {
        return this.setValueOfHandle(this.getEndHandle(), value);
    },    getValue: function () {
        return this.getEnd() - this.getStart();
    },    setValue: function (value) {
        return this.setEnd(this.getStart() + value);
    }
});