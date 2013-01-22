/**
 * @author xuld
 */


include("dom/base.js");


Dom.implement({
	
	hover: function(mouseenter, mouseleave){
		return this.on('mouseenter', mouseenter).on('mouseleave', mouseleave);
	}
	
});



