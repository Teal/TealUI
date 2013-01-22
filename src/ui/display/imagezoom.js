/**
 * @author xuld
 */

Dom.implement({
	
	imageZoom: function(getUrlCallback){
				
	    return this.addClass('x-imagezoom-small').on('click', function (e) {
	    	if(this.hasClass('x-imagezoom-small')){
	    		this.removeClass('x-imagezoom-small').addClass('x-imagezoom-large');
	    		var oldState;
	    		if(getUrlCallback){
	    			this.dataField().imageZoomSrc = this.node.src;
	    			this.node.src = getUrlCallback(this.node.src);
	    		} else {
	    			this.dataField().imageZoomWidth = this.getWidth();
	    			this.dataField().imageZoomHeight = this.getHeight();
	    			this.node.style.width = this.node.style.height = 'auto';
	    		}
	    	} else {
	    		this.addClass('x-imagezoom-small').removeClass('x-imagezoom-large');
	    		if(getUrlCallback){
	    			this.node.src = this.dataField().imageZoomSrc;
	    		} else {
	    			this.setWidth(this.dataField().imageZoomWidth);
	    			this.setHeight(this.dataField().imageZoomHeight);
	    		}
	    	}
	    });
	}
	
});


