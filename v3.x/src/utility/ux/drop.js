/**
 * @fileOverview 实现拖放功能。
 * @author xuld
 */

typeof include === "function" && include("drag");

/**
 * 创建一个新的可拖放区域。
 * @param {Element} elem 要拖放的元素。
 * @param {Object} options 用户覆盖可拖动对象的配置。
 * @class
 * @inner
 */
function Droppable(elem, options) {

    this.dom = Dom(elem);

    // 使用用户自定义配置覆盖默认配置。
    for (var key in options) {
        this[key] = options[key];
    }

    Droppable.instances.push(this);

}

/**
 * 存储所有拖放区域实例的数组。
 * @inner
 */
Droppable.instances = [];

Droppable.prototype = {

    constructor: Droppable,

    /**
     * 当前拖放的节点。
     * @type {Dom}
     */
    dom: null,

    /**
     * 判断是否有拖动对象正在当前拖放区域内。
     * @type {Number}
     */
    active: false,

    /**
     * 处理拖动开始事件。
     * @param {Draggable} draggable 当前正在拖动的对象。
     * @param {Event} e 事件参数。
     */
    dragStart: function (draggable, e) {
        this.rect = this.dom.rect();
        this.rect.right = this.rect.left + this.rect.width;
        this.rect.bottom = this.rect.top + this.rect.height;
        return !this.onDragStart || this.onDragStart(draggable, e);
    },

    /**
     * 处理拖动移动事件。
     * @param {Draggable} draggable 当前正在拖动的对象。
     * @param {Event} e 事件参数。
     */
    dragMove: function (draggable, e) {
        return this.onDragMove && this.onDragMove(draggable, e);
    },

    /**
     * 处理拖动进入事件。
     * @param {Draggable} draggable 当前正在拖动的对象。
     * @param {Event} e 事件参数。
     */
    dragEnter: function (draggable, e) {
        return !this.onDragEnter || this.onDragEnter(draggable, e);
    },

    /**
     * 处理拖动进入后移动事件。
     * @param {Draggable} draggable 当前正在拖动的对象。
     * @param {Event} e 事件参数。
     */
    dragOver: function (draggable, e) {
        return !this.onDragOver || this.onDragOver(draggable, e);
    },

    /**
     * 处理拖动离开事件。
     * @param {Draggable} draggable 当前正在拖动的对象。
     * @param {Event} e 事件参数。
     */
    dragLeave: function (draggable, e) {
        return !this.onDragLeave || this.onDragLeave(draggable, e);
    },

    /**
     * 处理拖放事件。
     * @param {Draggable} draggable 当前正在拖动的对象。
     * @param {Event} e 事件参数。
     */
    drop: function (draggable, e) {
        return !this.onDrop || this.onDrop(draggable, e);
    },

    /**
     * 处理拖动结束事件。
     * @param {Draggable} draggable 当前正在拖动的对象。
     * @param {Event} e 事件参数。
     */
    dragEnd: function (draggable, e) {
        return !this.onDragEnd || this.onDragEnd(draggable, e);
    },

    /**
     * 判断当前拖放对象是否包含指定的拖动对象。
     * @returns {Boolean} 指示拖放结果。
     */
    contains: function (draggable) {
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

// 修改拖动对象使其支持拖放。
Draggable.prototype._dragStart = Draggable.prototype.dragStart;
Draggable.prototype._dragMove = Draggable.prototype.dragMove;
Draggable.prototype._dragEnd = Draggable.prototype.dragEnd;

Draggable.prototype.dragStart = function (e) {
    this._dragStart(e);

    Draggable.droppables = Droppable.instances.filter(function (droppable) {
        this.active = false;
        return droppable.dragStart(this, e) !== false;
    }, this);

};

Draggable.prototype.dragMove = function (e) {
    var me = this,
        i = 0,
        droppables = Draggable.droppables,
        droppable;

    me._dragMove(e);

    for (; i < droppables.length ; i++) {
        droppable = droppables[i];

        if (droppable.dragMove(me, e) !== false) {

            // 如果进入了当前区域。
            if (droppable.contains(me)) {
                if (droppable.active) {
                    droppable.dragOver(me, e);
                } else if (droppable.dragEnter(me, e) !== false) {
                    droppable.active = true;
                }
            } else if (droppable.active) {
                droppable.dragLeave(me, e);
                droppable.active = false;
            }
        }

    }

};

Draggable.prototype.dragEnd = function (e) {
    this._dragEnd(e);

    var me = this,
        i = 0,
        droppables = Draggable.droppables,
        droppable;

    for (; i < droppables.length ; i++) {
        droppable = droppables[i];

        if (droppable.dragEnd(me, e) !== false && droppable.active) {
            droppable.drop(me, e);
        }
    }

    Draggable.droppables = null;
    
};

Dom.roles.droppable = Droppable;

/**
 * 初始化指定的元素为可拖放对象。
 * @param {Object} [options] 拖放的相关属性。可用的字段有：
 * 
 * * @param {Dom} handle 拖动的句柄元素。
 * * @param {Dom} proxy 拖动的代理元素。
 * * @param {Number} dragDelay 从鼠标按下到开始拖动的延时。
 * * @param {Function} onDragEnter: 设置拖动进入时的回调。
 * * @param {Function} onDragLeave 设置拖动移动移出时的回调。
 * * @param {Function} onDrop 设置拖放结束时的回调。
 * 
 * @returns {Draggable} 返回一个可拖放对象。
 * @example $("#elem1").droppable();
 */
Dom.prototype.droppable = function (options) {
   return this.role('droppable', options);
};
