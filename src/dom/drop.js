/**
 * @author xuld
 */

// #require dom/drag.js

function Droppable(elem, options) {

    this.elem = elem;

    // 使用用户自定义配置覆盖默认配置。
    for (var key in options) {
        this[key] = options[key];
    }

    Droppable.instances.push(this);

}

Droppable.instances = [];

Droppable.prototype = {

    constructor: Droppable,

    /**
     * 设置当前拖放的节点。
     */
    elem: null,

    /**
     * 处理拖动开始事件。
     * @param {Draggable} draggable 拖放物件。
     * @param {Event} e 事件参数。
     */
    dragStart: function (draggable, e) {
        this.rect = this.elem.getRect();
        this.rect.right = this.rect.left + this.rect.width;
        this.rect.bottom = this.rect.top + this.rect.height;
        return !this.onDragStart || this.onDragStart(draggable);
    },

    /**
     * 处理拖动移动事件。
     * @param {Draggable} draggable 拖放物件。
     * @param {Event} e 事件参数。
     */
    dragMove: function (draggable) {
        return !this.onDragMove || this.onDragMove(draggable);
    },

    /**
     * 处理拖动进入事件。
     * @param {Draggable} droppable 拖放物件。
     * @param {Event} e 事件参数。
     */
    dragEnter: function (draggable) {
        return !this.onDragEnter || this.onDragEnter(draggable);
    },

    /**
     * 处理拖动进入后移动事件。
     * @param {Draggable} droppable 拖放物件。
     * @param {Event} e 事件参数。
     */
    dragOver: function (draggable) {
        return !this.onDragOver || this.onDragOver(draggable);
    },

    /**
     * 处理拖动离开事件。
     * @param {Draggable} droppable 拖放物件。
     * @param {Event} e 事件参数。
     */
    dragLeave: function (draggable) {
        return !this.onDragLeave || this.onDragLeave(draggable);
    },

    /**
     * 处理拖放事件。
     * @param {Draggable} droppable 拖放物件。
     * @param {Event} e 事件参数。
     */
    drop: function (draggable) {
        return !this.onDrop || this.onDrop(draggable);
    },

    /**
     * 处理拖动结束事件。
     * @param {Draggable} droppable 拖放物件。
     * @param {Event} e 事件参数。
     */
    dragEnd: function (draggable) {
        return !this.onDragEnd || this.onDragEnd(draggable);
    },

    /**
     * 判断当前的 bound 是否在指定点和大小表示的矩形是否在本区范围内。
     * @param {Draggable} draggable 拖放物件。
     * @return {Boolean} 在上面返回 true。
     */
    check: function (draggable) {
        return this.rect.left <= draggable.endX && draggable.endX <= this.rect.right && this.rect.top <= draggable.endY && draggable.endY <= this.rect.bottom;
    },

    /**
     * 销毁当前拖动区域。
     */
    destory: function () {
        var index = Droppable.instances.indexOf(this);
        index >= 0 && Droppable.instances.splice(index, 1);
    }

};

Draggable.prototype._dragStart = Draggable.prototype.dragStart;
Draggable.prototype._dragMove = Draggable.prototype.dragMove;
Draggable.prototype._dragEnd = Draggable.prototype.dragEnd;

Draggable.prototype.dragStart = function (e) {
    this._dragStart(e);

    Draggable.availableDroppables = Droppable.instances.filter(function (droppable) {
        return droppable.dragStart(this, e) !== false;
    }, this);
    Draggable.droppableFlags = [];
    Draggable.droppables = [];

};

Draggable.prototype.dragMove = function (e) {
    var me = this,
        i = 0,
        droppables = me.droppables,
        availableDroppables = me.availableDroppables,
        droppableFlags = me.droppableFlags,
        droppable,
        eventProcess = true;

    me._dragMove(e);

    while (i < availableDroppables.length) {
        droppable = availableDroppables[i];
        if (eventProcess && droppable.check(me)) {
            if (droppableFlags[i])
                droppable.onDragOver(me, e);
            else {
                droppableFlags[i] = true;
                eventProcess = droppable.onDragEnter(me, e) !== false;
                droppables.push(droppable);
            }

        } else if (droppableFlags[i]) {
            droppableFlags[i] = false;
            droppable.onDragLeave(me, e);
            droppables.remove(droppable);
        }
        i++;
    }
};

Draggable.prototype.dragEnd = function (e) {
    this._dragEnd(e);

    var me = this;
    afterDrag.call(me, e);
    me.droppables.forEach(function (droppable) {
        droppable.onDrop(me, e);
    });
    me.droppableFlags = me.availableDroppables = null;
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
Element.prototype.setDroppable = function (options) {
    return new Droppable(this, options);
};
