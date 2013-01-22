//===========================================
//  多个元素的效果
//   A: xuld
//===========================================







using("System.Fx.Animate");

DomList.implement({
	
	multiFade: function( opacity, onFade, onShow ) {
		opacity = opacity === undefined ? 0.3 : opacity;
		
		var me = this;
		
		this.on('mouseenter', function(e){
			me.each( function( elem ) {
		    	if( elem != e.target ){
					new Dom(elem).animate({opacity: opacity}, -1, onFade, 'abort');
				}
		    });
		});
		  
		this.on('mouseleave', function(e) {
		    me.each( function( elem ){
		      if( elem != e.target )
		      	new Dom(elem).animate({opacity: 1}, -1,onShow, 'abort');
		    });
		});
		
	}

});

