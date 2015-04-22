/**
 * @author xuld
 */

	

function fixPng(image) {
	
	if(typeof XMLHttpRequest !== "undefined") {
		return;
	}
	
	if(!image) {
		var images = document.images;
		for (var i = 0; image = images[i]; i++) {
			fixPng(image);
		}
	} else if (/\.png\b/.test(image.src)) {
		var imgID = (image.id) ? "id='" + image.id + "' " : "";
		var imgClass = (image.className) ? "class='" + image.className + "' " : "";
		var imgTitle = (image.title) ? "title='" + image.title + "' " : "title='" + image.alt + "' ";
		var imgStyle = "display:inline-block;" + image.style.cssText;
		if (image.pin == "left")
			imgStyle = "float:left;" + imgStyle;
		if (image.pin == "right")
			imgStyle = "float:right;" + imgStyle;
		if (image.parentElement.href)
			imgStyle = "cursor:hand;" + imgStyle;
		image.outerHTML = "<span " + imgID + imgClass + imgTitle +
			" style=\"" +
			"width:" +
			image.width +
			"px; margin:6px; height:" +
			image.height +
			"px;" +
			imgStyle +
			";" +
			"filter:progid:DXImageTransform.Microsoft.AlphaImageLoader" +
			"(src=\'" +
			image.src +
			"\', sizingMethod='scale');\"></span>";
	}

}
