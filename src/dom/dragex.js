/**
 * 拖动 
 */

//#include dom/drag.js



Draggable.implement({
	
	/**
	 * 将当前值改在指定范围内。
	 * @param {Rectangle} box 限制的范围。
	 */
    limit: function (position, size) {

        if (typeof position.x !== 'number') {
            position = Dom.find(position);
            size = Dom.getSize(position);
            position = Dom.getPosition(position);
        }

        var me = this;

        Dom.setOffset(me.proxy, {
            x: me.offset.x + me.to.x - me.from.x,
            y: me.offset.y + me.to.y - me.from.y
        });

    	var myPosition = Dom.getPosition(me.proxy),
			mySize = Dom.getSize(me.proxy),
			deltaX = position.x - myPosition.x,
			deltaY = position.y - myPosition.y;
			
			
		if(deltaX > 0){
			me.to.x += deltaX;
		} else {
			deltaX =  position.x + size.x - myPosition.x - mySize.x;
			if(deltaX < 0){
				me.to.x += deltaX;
			}
		}
		
		if(deltaY > 0){
			me.to.y += deltaY;
		} else {
			deltaY =  position.y + size.y - myPosition.y - mySize.y;
			if(deltaY < 0){
				me.to.y += deltaY;
			}
		}
		
	},
	
	revert: function(){
		var me = this.proxy;
		Dom.draggable(me, false);
		Dom.animate(me, {
			left: this.offset.x,
			top: this.offset.y
		}, -1, function () {
			Dom.draggable(me);
		});
	},
	
	setStep: function(direction, value){
		var delta = parseInt( (this.to[direction] - this.from[direction]) / value);
		
		this.to[direction] = this.from[direction] + delta * value;
	},
	
	autoScroll: function(target){
		
		target = Dom.find(target);

		var scroll = Dom.getScroll(target),
			top = Dom.getPosition(this.proxy),
			pos = Dom.getPosition(target),
			size = Dom.getSize(target),
			scollSize = Dom.getScrollSize(target),
			delta;

		top.x -= pos.x;
		top.y -= pos.y;
		scollSize.x -= size.x;
		scollSize.y -= size.y;

		if(top.y < 0)
			scroll.y += top.y;
		
		if(top.x < 0)
			scroll.x += top.x;
		
		top.x += this.proxy.offsetWidth;
		top.y += this.proxy.offsetHeight;
		
		delta = top.y - size.y;
		
		if(delta > 0 && scroll.y + delta < scollSize.y) {
			scroll.y += delta;
		}
		
		delta = top.x - size.x;
		
		if(delta > 0 && scroll.x + delta < scollSize.x) {
			scroll.x += delta;
		}
		
		Dom.setScroll(document, scroll);
	}
	
});