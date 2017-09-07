/**
 * @author xuld
 */

//#include dom/drag.js

var Droppable = (function(){
	
	/**
	 * 全部的区。
	 */
	var droppables = [],
		
		dp = Draggable.prototype,
		
		Droppable = Base.extend({
		
		    raiseEvent: function (eventName, draggable, e) {
		        e.draggable = draggable;
				e.droppable = this;
				return Dom.trigger(this.elem, eventName, e);
			},
			
			/**
			 * 触发 dragenter 执行。
			 * @param {Draggable} droppable 拖放物件。
			 * @param {Event} e 事件参数。
			 */
		    onDragEnter: function (draggable, e) {
			    return this.raiseEvent('dragenter', draggable, e);
			},
			
			/**
			 * 触发 dragover 执行。
			 * @param {Draggable} droppable 拖放物件。
			 * @param {Event} e 事件参数。
			 */
			onDragOver: function (draggable, e) {
			    return this.raiseEvent('dragover', draggable, e);
			},

			/**
			 * 触发 drop 执行。
			 * @param {Draggable} draggable 拖放物件。
			 * @param {Event} e 事件参数。
			 */
			onDrop: function (draggable, e) {
			    return this.raiseEvent('drop', draggable, e);
			},
			
			/**
			 * 触发 dragleave 执行。
			 * @param {Draggable} droppable 拖放物件。
			 * @param {Event} e 事件参数。
			 */
			onDragLeave: function (draggable, e) {
			    return this.raiseEvent('dragleave', draggable, e);
			},
			
			/**
			 * 初始化。
			 * @constructor Droppable
			 */
			constructor: function(options){
			    Object.extend(this, options);
				this.disable(false);
			},

		    /**
             * 判断当前区域是否接受指定的拖动块。
             */
			init: function (draggable) {
				this.lt = Dom.getPosition(this.elem);
				var size = Dom.getSize(this.elem);
				this.rb = {
					x: this.lt.x + size.x,
					y: this.lt.y + size.y
				}
			    return true;
			},
			
			/**
			 * 判断当前的 bound 是否在指定点和大小表示的矩形是否在本区范围内。
			 * @param {Draggable} draggable 拖放物件。
			 * @return {Boolean} 在上面返回 true。
			 */
			check: function (draggable) {
			    return this.lt.x <= draggable.to.x && draggable.to.x <= this.rb.x &&
                    this.lt.y <= draggable.to.y && draggable.to.y <= this.rb.y;
			},

		    /**
			 * 使当前域处理当前的 drop 。
			 */
			disable: function (value) {
				if (value !== false) {
					droppables.remove(this);
				} else if (droppables.indexOf(this) < 0) {
					droppables.push(this);

				}
			    return this;
			}
			
		}),
		
		beforeDrag = dp.beforeDrag,
		
		afterDrag = dp.afterDrag,
		
		mouseEvents = Dom.eventFix.mousemove;
	
    /**
     * 对 Draggable 扩展实现拖放判断。
     */
	Draggable.implement({
		
		beforeDrag: function (e) {
			var me = this;
			beforeDrag.call(me, e);
			me.availableDroppables = droppables.filter(function(droppable){
			    return droppable.init(me);
			});
			me.droppableFlags = new Array(me.availableDroppables.length);
			me.droppables = [];

		},
		
		doDrag: function(e){
			var me = this,
				i = 0,
				droppables = me.droppables,
				availableDroppables = me.availableDroppables,
				droppableFlags = me.droppableFlags,
				droppable,
				eventProcess = true;

			while (i < availableDroppables.length) {
			    droppable = availableDroppables[i];
				if (eventProcess && droppable.check(me)) {
					if(droppableFlags[i])
					    droppable.onDragOver(me, e);
					else {
						droppableFlags[i] = true;
						eventProcess = droppable.onDragEnter(me, e) !== false;
						droppables.push(droppable);
					}

				} else if(droppableFlags[i]){
					droppableFlags[i] = false;
					droppable.onDragLeave(me, e);
					droppables.remove(droppable);
				}
				i++;
			}
		},
		
		afterDrag: function(e){
			var me = this;
			afterDrag.call(me, e);
			me.droppables.forEach(function (droppable) {
			    droppable.onDrop(me, e);
			});
			me.droppableFlags = me.availableDroppables = null;
		}
	});
	
	Dom.defineEvents('dragenter dragleave dragover drop', {
		add: function (elem, type, fn) {
			Dom.addListener(elem, type, fn);
			fn = Dom.data(elem).droppable;
			if(fn){
				fn.disable(false);
			} else {
				Dom.data(elem).droppable = new Droppable({ elem: elem });
			}
		},
		remove: function (elem, type, fn) {
			Dom.removeListener(elem, type, fn);
			Dom.data(elem).droppable.disable();
	        delete Dom.data(elem).droppable;
		},
		initEvent: mouseEvents && mouseEvents.initEvent
	});

	return Droppable;

})();
