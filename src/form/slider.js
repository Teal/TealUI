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
        this.onChange();
    },    initHandle: function (handle) {
        var me = this;
        Dom.draggable(handle, {
            autoSrcoll: 0,
            onDragStart: function () {

                // 拖动开始前确定当前滑块的可用范围。每个滑块的范围的前后滑块之间。
                function getPrevOrNext(handle, defaultValue) {
                    return handle && handle.matches('.x-slider-handle') ? parseFloat(handle.style.left) : defaultValue;
                }

                this.min = getPrevOrNext(handle.previousElementSibling, 0),
                this.max = getPrevOrNext(handle.nextElementSibling, 100);
                this.part = me.step && me.elem.offsetWidth * me.step / (me.max - me.min);
            },
            onDragMove: function (e) {

                var left = this.endOffset.left;

                // 实时步长。
                if (this.part) {
                    left = this.part * Math.floor((left + this.part / 2) / this.part);
                }

                // 计算百分比。
                left = left * 100 / me.elem.offsetWidth;

                // 确保滑块在合理拖动范围内。
                this.value = left = Math.max(this.min, Math.min(this.max, left));

                if (me.onChanging(this, e) !== false) {

                    // 仅设置 X 坐标即可。
                    handle.style.left = left + '%';

                    // 更新滑块区域。
                    me.onChange();

                }

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
            start = handles[1] ? parseFloat(handles[0].style.left) : 0,
            fore = Dom.find('.x-slider-fore', this.elem);
        fore.style.left = start + '%';
        fore.style.width = handles[0] ? Math.max(0, parseFloat(handles[handles.length - 1].style.left) - start) + '%' : 0;

        return this.trigger('change');
    },    /**
     * 获取某个索引的滑块。
     */    getHandle: function (index) {
        var handlers = Dom.query('.x-slider-handle', this.elem);
        return handlers[index < 0 ? handlers.length + index : index];
    },    /**
     * 获取每个滑块的值。
     */    getValues: function () {
        var values = [];
        Dom.each(Dom.query('.x-slider-handle', this.elem), function (handle, index) {
            values[index] = this.getValueOfHandle(handle);
        }, this);
        return values;
    },    getStart: function (value) {
        return this.getValueOfHandle(Dom.query('.x-slider-handle', this.elem).length > 1 && this.getHandle(0));
    },    setStart: function (value) {
        return this.setValueOfHandle(Dom.query('.x-slider-handle', this.elem).length > 1 && this.getHandle(0), value);
    },    getEnd: function (value) {
        return this.getValueOfHandle(this.getHandle(-1));
    },    setEnd: function (value) {
        return this.setValueOfHandle(this.getHandle(-1), value);
    },    getValue: function () {
        return this.getEnd() - this.getStart();
    },    setValue: function (value) {
        return this.setEnd(this.getStart() + value);
    }
});