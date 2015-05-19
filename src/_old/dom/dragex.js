/**
 * 拖动 
 */

//#require ../dom/drag.js



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
	}

});