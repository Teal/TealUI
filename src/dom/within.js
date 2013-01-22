//===========================================
//  判断元素是否在制定原元素范围   within.js    A
//===========================================


Dom.implement({
	
	within: function (x,y,width,height) {
		var container,
			containerPos,
			containerSize,
			targetPos = this.getPosition(),
			targetSize = targetPos.add(this.getSize());
		if(typeof(x)=='String'){
			container = Dom.get(id);
			containerPos = container.getPosition();
			containerSize = containerPos.add(container.getSize());
			targetPos = this.getPosition();
			targetSize = targetPos.add(this.getSize());
		}else{
			containerPos = {x:x,y:y};
			containerSize = {x:containerPos.x+(width||0),y:containerPos.y+(height||0)};			
		}
		return Math.max(targetPos.x, containerPos.x) <= Math.min(targetSize.x, containerSize.x) &&
			Math.max(targetPos.y, containerPos.y) <= Math.min(targetSize.y, containerSize.y);
	}
});