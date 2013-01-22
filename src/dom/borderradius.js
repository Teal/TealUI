//===========================================
//     borderradius.js    A
//===========================================


// 产生兼容主流浏览器的圆角效果。
// 支持: IE6+ FF2+ Opera 9+ Safari 3+ Opera 9+


/**
 * 产生指定元素的圆角。
 * @param {Element} elem 目标节点。
 * @param {Number} size 圆角的大小。
 */
JPlus.borderRadius = !navigator.isW3C ? function(elem, size){

	//  elem.style.background = 'transparent';
	//  elem.style.borderColor = 'transparent';

	var parent = document.createElement('div'),
		zIndex = parseInt(elem.currentStyle.zIndex) || 0;
	
	parent.innerHTML = [
	
		'<v:roundrect style="display: block;behavior: url(#default#VML);width:',
		elem.offsetWidth,
		'px;height:',
		elem.offsetHeight,
		'px;',
	//	elem.style.cssText,
	//	'" class="',
		//elem.className,
		'" strokeWeight="',
		1,
		'" arcsize="',
		1,
		'"></v:roundrect>'
	
	].join('');
	
//	elem.style.cssText = elem.className = '';
	
	var child = parent.firstChild;
	
	//elem.style.border = child.style.border;
	
	//child.style.border = 'none';
	
	elem.style.overFlow = 'hidden';
	
	elem.parentNode.replaceChild(child, elem);
	
	child.appendChild(elem);
	
	//for(var n = elem.firstChild; n; n = n.nextSibling)
	//	n.style.zIndex = zIndex;
	
	//  parent.firstChild.style.border = elem.style.border;
	// elem.style.border = 'none';
	
	//if(elem.currentStyle.position != 'absolute') {
	//	elem.style.position = 'relative';
	//}

/*
	if (border_opacity && (element.opacity < 1)) {
		rect.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity='+ parseFloat(element.opacity * 100) +')';
	}
*/


	// Hack: IE6 doesn't support transparent borders, use padding to offset original element
	if (navigator.isIE6) {
		elem.style.borderStyle = 'none';
		elem.style.paddingTop = parseInt(element.currentStyle.paddingTop || 0) + 1;
		elem.style.paddingBottom = parseInt(element.currentStyle.paddingBottom || 0) + 1;
	}

	return(true);
} : (function(css){
	[css, 'MozBorderRadius', 'WebkitBorderRadius', 'KhtmlBorderRadius'].forEach(function(attr){
		if(attr in document.documentElement.style){
			css = attr;
			return false;
		}
	});
	
	return function(elem, size){
		elem.style[css] = size + 'px';
	}
})('borderRadius');
