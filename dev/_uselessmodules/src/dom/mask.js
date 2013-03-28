//===========================================
//  遮罩   mask.js    A
//===========================================



Element.implement({
	
	mask: function (elem) {
		this.setSize(elem.getSize());
		this.setPosition(elem.getOffsets());
		this.bringToFront(elem);
	}
	
});