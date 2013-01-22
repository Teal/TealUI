/** * @author  */include("dom/base.js");Dom.implement({
	autoResize: function() {
		this			.setStyle('overflow', 'hidden')			.on('keyup', autoResize);		autoResize.call(this);		function autoResize() {
			this.setHeight('auto');			this.setHeight(this.getScrollSize().y);
		}	}});