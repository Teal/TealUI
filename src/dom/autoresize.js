/** * @author  */using("System.Dom.Base");Dom.implement({
	autoResize: function() {
		this			.setStyle('overflow', 'hidden')			.on('keyup', autoResize);		autoResize.call(this);		function autoResize() {
			this.setHeight('auto');			this.setHeight(this.getScrollSize().y);
		}	}});