/**
 * @author xuld
 */

Dom.implement({
	
	imageZoom: function(getUrlCallback){
				
	    return this.addClass('ui-imagezoom-small').on('click', function (e) {
	    	if(this.hasClass('ui-imagezoom-small')){
	    		this.removeClass('ui-imagezoom-small').addClass('ui-imagezoom-large');
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
	    		this.addClass('ui-imagezoom-small').removeClass('ui-imagezoom-large');
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


