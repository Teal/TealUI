/**
 * @author xuld
 */


using("System.Dom.Base");


Dom.implement({
	
	hover: function(mouseenter, mouseleave){
		return this.on('mouseenter', mouseenter).on('mouseleave', mouseleave);
	}
	
});



